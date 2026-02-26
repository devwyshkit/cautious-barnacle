-- WYSHKIT 2026: Hardening & Certification Migration
-- Consolidated from successful "Lego Test" certification sweep.

BEGIN;

-- 1. Core Architecture: Table-Driven FSM
CREATE TABLE IF NOT EXISTS public.order_valid_transitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_status public.order_status,
    to_status public.order_status NOT NULL,
    required_personalization_approval BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(from_status, to_status)
);

-- Seed Lean 7-state Model
INSERT INTO public.order_valid_transitions (from_status, to_status) VALUES
    (NULL, 'PLACED'),
    ('PLACED', 'CONFIRMED'),
    ('PLACED', 'CANCELLED'),
    ('CONFIRMED', 'PREPARING'),
    ('CONFIRMED', 'CANCELLED'),
    ('PREPARING', 'READY'),
    ('PREPARING', 'CANCELLED'),
    ('READY', 'SHIPPED'),
    ('READY', 'CANCELLED'),
    ('SHIPPED', 'DELIVERED'),
    ('SHIPPED', 'CANCELLED'),
    ('CANCELLED', 'REFUNDED')
ON CONFLICT DO NOTHING;

-- 2. Security Hardening: Control Tables & Views
ALTER TABLE public.order_valid_transitions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read transitions" ON public.order_valid_transitions;
CREATE POLICY "Public read transitions" ON public.order_valid_transitions FOR SELECT TO authenticated, anon USING (true);

ALTER VIEW public.v_active_cart_detailed SET (security_invoker = on);
ALTER VIEW public.v_order_tracking SET (security_invoker = on);

-- 3. Hardened RPC: place_atomic_order
CREATE OR REPLACE FUNCTION public.place_atomic_order(
    p_products jsonb, 
    p_address_id uuid, 
    p_razorpay_order_id text, 
    p_payment_id text DEFAULT NULL::text, 
    p_coupon_code text DEFAULT NULL::text, 
    p_use_wallet boolean DEFAULT false, 
    p_gstin text DEFAULT NULL::text, 
    p_delivery_instructions text DEFAULT NULL::text, 
    p_distance_km numeric DEFAULT NULL::numeric
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_order_id UUID := gen_random_uuid();
  v_order_number TEXT;
  v_vendor_id UUID;
  v_pricing JSON;
  v_address_json JSONB;
  v_has_personalization BOOLEAN := false;
  v_product RECORD;
  v_promised_at TIMESTAMPTZ;
  v_vendor_online BOOLEAN;
  v_vendor_open BOOLEAN;
  v_min_shelf_life INT;
BEGIN
  -- 1. Authentication Check
  v_user_id := COALESCE(auth.uid(), (current_setting('request.jwt.claims', true)::jsonb ->> 'sub')::UUID);

  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Unauthorized');
  END IF;

  -- 2. Idempotency Check
  IF EXISTS (SELECT 1 FROM public.orders WHERE razorpay_order_id = p_razorpay_order_id) THEN
    SELECT id, order_number INTO v_order_id, v_order_number FROM public.orders WHERE razorpay_order_id = p_razorpay_order_id;
    RETURN json_build_object('success', true, 'orderId', v_order_id, 'orderNumber', v_order_number, 'message', 'Order already exists');
  END IF;

  -- 3. Vendor & Serviceability Check
  SELECT vendor_id INTO v_vendor_id FROM public.products WHERE id = (COALESCE(p_products->0->>'productId', p_products->0->>'product_id'))::UUID;
  
  SELECT is_online, (CURRENT_TIME BETWEEN opening_time AND closing_time)
  INTO v_vendor_online, v_vendor_open
  FROM public.vendors WHERE id = v_vendor_id;

  IF NOT v_vendor_online OR NOT v_vendor_open THEN
    RETURN json_build_object('success', false, 'error', 'Vendor is currently offline or closed');
  END IF;

  -- 4. Perishable & Shelf Life Enforcement
  SELECT MIN(shelf_life_hours) INTO v_min_shelf_life
  FROM public.products 
  WHERE id IN (SELECT (COALESCE(val->>'productId', val->>'product_id'))::UUID FROM jsonb_array_elements(p_products) AS val);

  -- 5. Address & Pricing
  SELECT jsonb_build_object('city', city, 'address', address_line1, 'pincode', pincode, 'name', name, 'phone', phone) 
  INTO v_address_json
  FROM public.user_addresses WHERE id = p_address_id AND user_id = v_user_id;

  IF v_address_json IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Address not found');
  END IF;

  v_pricing := public.calculate_order_total(p_products, NULL, p_address_id, p_coupon_code, p_distance_km, p_use_wallet, v_user_id);
  IF (v_pricing->>'error') IS NOT NULL THEN
    RETURN json_build_object('success', false, 'error', v_pricing->>'error');
  END IF;

  -- 6. Atomic ETA Lock
  v_promised_at := NOW() + (COALESCE((SELECT avg_prep_time_mins FROM vendors WHERE id = v_vendor_id), 20) + 30) * INTERVAL '1 minute';

  IF v_min_shelf_life IS NOT NULL AND v_promised_at > (NOW() + v_min_shelf_life * INTERVAL '1 hour') THEN
    RETURN json_build_object('success', false, 'error', 'Delivery window exceeds product shelf life');
  END IF;

  -- 7. Final Commitment
  v_order_number := 'WSH-' || TO_CHAR(NOW(), 'YYMMDD') || '-' || UPPER(SUBSTRING(gen_random_uuid()::TEXT, 1, 6));

  SELECT COALESCE(BOOL_OR((COALESCE(val->>'hasPersonalization', val->>'has_personalization'))::BOOLEAN), false) INTO v_has_personalization
  FROM jsonb_array_elements(p_products) AS val;

  INSERT INTO public.orders (
    id, user_id, vendor_id, order_number, status,
    subtotal, personalization_charges, delivery_fee, platform_fee, tax_amount, discount, total,
    razorpay_order_id, payment_id, payment_status,
    address_id, delivery_address, delivery_instructions,
    has_personalization, gstin, distance_km,
    promised_delivery_at
  ) VALUES (
    v_order_id, v_user_id, v_vendor_id, v_order_number, 'PLACED',
    (v_pricing->>'subtotal')::numeric,
    (v_pricing->>'personalization_charges')::numeric,
    (v_pricing->>'delivery_fee')::numeric,
    (v_pricing->>'platform_fee')::numeric,
    (v_pricing->>'gst')::numeric,
    (v_pricing->>'discount')::numeric,
    (v_pricing->>'total')::numeric,
    p_razorpay_order_id, p_payment_id, CASE WHEN p_payment_id IS NOT NULL THEN 'PAID' ELSE 'PENDING' END,
    p_address_id, v_address_json, p_delivery_instructions,
    v_has_personalization, p_gstin, p_distance_km,
    v_promised_at
  );

  -- 8. Populate order_products and Deduct Stock
  FOR v_product IN SELECT 
      (COALESCE(val->>'productId', val->>'product_id'))::UUID as id, 
      (val->>'quantity')::INT as qty,
      (NULLIF(COALESCE(val->>'variantId', val->>'variant_id'), 'null'))::UUID as variant_id,
      (val->'selected_addons') as addons,
      (val->'personalization') as personalization
    FROM jsonb_array_elements(p_products) AS val LOOP
    
    DECLARE
      v_product_name TEXT;
      v_product_image TEXT;
      v_unit_price NUMERIC;
    BEGIN
      SELECT name, images[1], 
        CASE WHEN v_product.variant_id IS NOT NULL THEN (SELECT price FROM product_variants WHERE id = v_product.variant_id) ELSE base_price END
      INTO v_product_name, v_product_image, v_unit_price
      FROM public.products WHERE id = v_product.id;

      INSERT INTO public.order_products (
        order_id, product_id, product_name, product_image_url, quantity, unit_price, total_price, 
        selected_variant_id, selected_addons, is_personalized, personalization_details
      ) VALUES (
        v_order_id, v_product.id, v_product_name, v_product_image, v_product.qty, v_unit_price, (v_unit_price * v_product.qty),
        v_product.variant_id, v_product.addons, COALESCE((v_product.personalization->>'enabled')::boolean, false), v_product.personalization
      );

      UPDATE public.products 
      SET stock_quantity = stock_quantity - v_product.qty,
          stock_status = CASE WHEN stock_quantity - v_product.qty <= 0 THEN 'out_of_stock' ELSE stock_status END
      WHERE id = v_product.id AND (stock_quantity >= v_product.qty OR stock_quantity IS NULL);
      
      IF NOT FOUND THEN
        RAISE EXCEPTION 'Insufficient stock for product %', v_product.id;
      END IF;
    END;
  END LOOP;

  RETURN json_build_object('success', true, 'orderId', v_order_id, 'orderNumber', v_order_number);
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- 4. Hardened RPC: transition_order
CREATE OR REPLACE FUNCTION public.transition_order(
    p_order_id uuid,
    p_target_status order_status,
    p_metadata jsonb DEFAULT NULL,
    p_user_id uuid DEFAULT auth.uid()
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_current_status order_status;
    v_vendor_id uuid;
    v_is_valid boolean;
    v_role text;
BEGIN
    -- 1. Fetch State
    SELECT status, vendor_id INTO v_current_status, v_vendor_id 
    FROM public.orders WHERE id = p_order_id;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Order not found');
    END IF;

    -- 2. Determine Role
    IF EXISTS (SELECT 1 FROM public.users WHERE id = p_user_id AND role = 'admin') THEN
        v_role := 'ADMIN';
    ELSIF EXISTS (SELECT 1 FROM public.vendor_users WHERE vendor_id = v_vendor_id AND user_id = p_user_id) THEN
        v_role := 'PARTNER';
    ELSIF p_user_id = (SELECT user_id FROM public.orders WHERE id = p_order_id) THEN
        v_role := 'CUSTOMER';
    ELSE
        v_role := 'SYSTEM';
    END IF;

    -- 3. Transition Validation using order_valid_transitions table
    SELECT EXISTS (
        SELECT 1 FROM public.order_valid_transitions 
        WHERE from_status = v_current_status 
        AND to_status = p_target_status
    ) INTO v_is_valid;

    IF v_role = 'ADMIN' THEN v_is_valid := TRUE; END IF;

    IF NOT v_is_valid THEN
        RETURN jsonb_build_object('success', false, 'error', format('Invalid transition: %s -> %s', v_current_status, p_target_status));
    END IF;

    -- 4. Perform Transition (Trigger tr_audit_order_status handles history)
    UPDATE public.orders
    SET status = p_target_status, updated_at = NOW()
    WHERE id = p_order_id;

    RETURN jsonb_build_object('success', true, 'status', p_target_status);
END;
$$;

-- 5. Performance Optimization: RLS Policies
DROP POLICY IF EXISTS "authenticated_manage_addresses" ON public.user_addresses;
CREATE POLICY "authenticated_manage_addresses" ON public.user_addresses 
FOR ALL USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "orders_select_policy" ON public.orders;
CREATE POLICY "orders_select_policy" ON public.orders 
FOR SELECT USING (user_id = (SELECT auth.uid()) OR EXISTS (SELECT 1 FROM vendor_users WHERE vendor_id = orders.vendor_id AND user_id = (SELECT auth.uid())));

-- 6. Maintenance: Index Cleanup
DROP INDEX IF EXISTS public.vendors_location_gix;

COMMIT;
