export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      addon_groups: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_required: boolean | null
          max_select: number | null
          min_select: number | null
          name: string
          vendor_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_required?: boolean | null
          max_select?: number | null
          min_select?: number | null
          name: string
          vendor_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_required?: boolean | null
          max_select?: number | null
          min_select?: number | null
          name?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "addon_groups_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          new_state: Json | null
          operator_id: string
          previous_state: Json | null
          reason: string | null
          severity: string | null
          target_id: string | null
          target_table: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          new_state?: Json | null
          operator_id: string
          previous_state?: Json | null
          reason?: string | null
          severity?: string | null
          target_id?: string | null
          target_table?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          new_state?: Json | null
          operator_id?: string
          previous_state?: Json | null
          reason?: string | null
          severity?: string | null
          target_id?: string | null
          target_table?: string | null
        }
        Relationships: []
      }
      cart_products: {
        Row: {
          cart_id: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          personalization: Json | null
          product_id: string
          quantity: number
          selected_addons: Json | null
          selected_variant_id: string | null
          session_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          cart_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          personalization?: Json | null
          product_id: string
          quantity?: number
          selected_addons?: Json | null
          selected_variant_id?: string | null
          session_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          cart_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          personalization?: Json | null
          product_id?: string
          quantity?: number
          selected_addons?: Json | null
          selected_variant_id?: string | null
          session_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_products_cart_id_fkey"
            columns: ["cart_id"]
            isOneToOne: false
            referencedRelation: "carts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_products_selected_variant_id_fkey"
            columns: ["selected_variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_products_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      carts: {
        Row: {
          created_at: string | null
          id: string
          session_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          session_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          session_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          parent_id: string | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          parent_id?: string | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          parent_id?: string | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      checkout_sessions: {
        Row: {
          applied_coupon: string | null
          created_at: string | null
          expires_at: string | null
          gstin: string | null
          guest_lat: number | null
          guest_lng: number | null
          guest_location_name: string | null
          id: string
          selected_address_id: string | null
          session_id: string | null
          snapshot_products: Json | null
          updated_at: string | null
          use_wallet: boolean | null
          user_id: string | null
        }
        Insert: {
          applied_coupon?: string | null
          created_at?: string | null
          expires_at?: string | null
          gstin?: string | null
          guest_lat?: number | null
          guest_lng?: number | null
          guest_location_name?: string | null
          id?: string
          selected_address_id?: string | null
          session_id?: string | null
          snapshot_products?: Json | null
          updated_at?: string | null
          use_wallet?: boolean | null
          user_id?: string | null
        }
        Update: {
          applied_coupon?: string | null
          created_at?: string | null
          expires_at?: string | null
          gstin?: string | null
          guest_lat?: number | null
          guest_lng?: number | null
          guest_location_name?: string | null
          id?: string
          selected_address_id?: string | null
          session_id?: string | null
          snapshot_products?: Json | null
          updated_at?: string | null
          use_wallet?: boolean | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "checkout_sessions_applied_coupon_fkey"
            columns: ["applied_coupon"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "checkout_sessions_selected_address_id_fkey"
            columns: ["selected_address_id"]
            isOneToOne: false
            referencedRelation: "user_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "checkout_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          code: string
          created_at: string | null
          created_by_vendor_id: string | null
          description: string | null
          discount_type: string
          discount_value: number
          end_date: string | null
          id: string
          is_active: boolean | null
          is_platform_coupon: boolean | null
          max_discount_amount: number | null
          min_order_value: number | null
          start_date: string | null
          usage_limit: number | null
          used_count: number | null
        }
        Insert: {
          code: string
          created_at?: string | null
          created_by_vendor_id?: string | null
          description?: string | null
          discount_type: string
          discount_value: number
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          is_platform_coupon?: boolean | null
          max_discount_amount?: number | null
          min_order_value?: number | null
          start_date?: string | null
          usage_limit?: number | null
          used_count?: number | null
        }
        Update: {
          code?: string
          created_at?: string | null
          created_by_vendor_id?: string | null
          description?: string | null
          discount_type?: string
          discount_value?: number
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          is_platform_coupon?: boolean | null
          max_discount_amount?: number | null
          min_order_value?: number | null
          start_date?: string | null
          usage_limit?: number | null
          used_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "coupons_created_by_vendor_id_fkey"
            columns: ["created_by_vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string
          created_at: string | null
          expires_at: string | null
          id: string
          image_url: string | null
          is_persistent: boolean | null
          is_read: boolean | null
          metadata: Json | null
          priority: string | null
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          image_url?: string | null
          is_persistent?: boolean | null
          is_read?: boolean | null
          metadata?: Json | null
          priority?: string | null
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          image_url?: string | null
          is_persistent?: boolean | null
          is_read?: boolean | null
          metadata?: Json | null
          priority?: string | null
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      order_products: {
        Row: {
          created_at: string | null
          final_approved_mockup_url: string | null
          gst_percentage: number | null
          height_cm: number | null
          hsn_code: string | null
          id: string
          is_personalized: boolean | null
          length_cm: number | null
          liability_shifted_at: string | null
          order_id: string
          personalization_details: Json | null
          personalization_revision_count: number | null
          personalization_schema: Json | null
          product_id: string
          product_image_url: string | null
          product_name: string
          quantity: number
          selected_addons: Json | null
          selected_variant_id: string | null
          selected_variant_options: Json | null
          status: Database["public"]["Enums"]["order_product_status"]
          stock_deducted: boolean | null
          total_price: number
          unit_price: number
          vendor_production_notes: string | null
          weight_kg: number | null
          width_cm: number | null
        }
        Insert: {
          created_at?: string | null
          final_approved_mockup_url?: string | null
          gst_percentage?: number | null
          height_cm?: number | null
          hsn_code?: string | null
          id?: string
          is_personalized?: boolean | null
          length_cm?: number | null
          liability_shifted_at?: string | null
          order_id: string
          personalization_details?: Json | null
          personalization_revision_count?: number | null
          personalization_schema?: Json | null
          product_id: string
          product_image_url?: string | null
          product_name: string
          quantity: number
          selected_addons?: Json | null
          selected_variant_id?: string | null
          selected_variant_options?: Json | null
          status?: Database["public"]["Enums"]["order_product_status"]
          stock_deducted?: boolean | null
          total_price: number
          unit_price: number
          vendor_production_notes?: string | null
          weight_kg?: number | null
          width_cm?: number | null
        }
        Update: {
          created_at?: string | null
          final_approved_mockup_url?: string | null
          gst_percentage?: number | null
          height_cm?: number | null
          hsn_code?: string | null
          id?: string
          is_personalized?: boolean | null
          length_cm?: number | null
          liability_shifted_at?: string | null
          order_id?: string
          personalization_details?: Json | null
          personalization_revision_count?: number | null
          personalization_schema?: Json | null
          product_id?: string
          product_image_url?: string | null
          product_name?: string
          quantity?: number
          selected_addons?: Json | null
          selected_variant_id?: string | null
          selected_variant_options?: Json | null
          status?: Database["public"]["Enums"]["order_product_status"]
          stock_deducted?: boolean | null
          total_price?: number
          unit_price?: number
          vendor_production_notes?: string | null
          weight_kg?: number | null
          width_cm?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "order_products_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_products_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "v_order_detail"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_products_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "v_order_tracking"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_products_selected_variant_id_fkey"
            columns: ["selected_variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_history: {
        Row: {
          changed_at: string | null
          id: string
          metadata: Json | null
          order_id: string
          status: Database["public"]["Enums"]["order_status"]
        }
        Insert: {
          changed_at?: string | null
          id?: string
          metadata?: Json | null
          order_id: string
          status?: Database["public"]["Enums"]["order_status"]
        }
        Update: {
          changed_at?: string | null
          id?: string
          metadata?: Json | null
          order_id?: string
          status?: Database["public"]["Enums"]["order_status"]
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "v_order_detail"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "v_order_tracking"
            referencedColumns: ["id"]
          },
        ]
      }
      order_valid_transitions: {
        Row: {
          created_at: string | null
          from_status: Database["public"]["Enums"]["order_status"] | null
          id: string
          required_personalization_approval: boolean | null
          to_status: Database["public"]["Enums"]["order_status"]
        }
        Insert: {
          created_at?: string | null
          from_status?: Database["public"]["Enums"]["order_status"] | null
          id?: string
          required_personalization_approval?: boolean | null
          to_status?: Database["public"]["Enums"]["order_status"]
        }
        Update: {
          created_at?: string | null
          from_status?: Database["public"]["Enums"]["order_status"] | null
          id?: string
          required_personalization_approval?: boolean | null
          to_status?: Database["public"]["Enums"]["order_status"]
        }
        Relationships: []
      }
      orders: {
        Row: {
          address_id: string | null
          awb_number: string | null
          billing_address: Json | null
          cancellation_reason: string | null
          cancelled_by: string | null
          cashback_amount: number | null
          cashback_credited: boolean | null
          change_request_count: number | null
          courier_tracking_id: string | null
          courier_vendor: string | null
          created_at: string | null
          delivery_address: Json | null
          delivery_fee: number | null
          delivery_instructions: string | null
          discount: number | null
          distance_km: number | null
          estimate_downloaded: boolean | null
          gstin: string | null
          gstin_verified: boolean | null
          has_personalization: boolean | null
          id: string
          idempotency_key: string | null
          max_change_requests: number | null
          order_number: string
          payment_id: string | null
          payment_method: string | null
          payment_status: string | null
          payout_id: string | null
          personalization_charges: number | null
          platform_fee: number | null
          price_locked_until: string | null
          promised_delivery_at: string | null
          razorpay_order_id: string | null
          refunded_amount: number | null
          return_deadline: string | null
          shadowfax_tracking_url: string | null
          status: Database["public"]["Enums"]["order_status"]
          subtotal: number
          tax_amount: number | null
          total: number
          total_savings: number | null
          updated_at: string | null
          user_id: string
          vendor_id: string
        }
        Insert: {
          address_id?: string | null
          awb_number?: string | null
          billing_address?: Json | null
          cancellation_reason?: string | null
          cancelled_by?: string | null
          cashback_amount?: number | null
          cashback_credited?: boolean | null
          change_request_count?: number | null
          courier_tracking_id?: string | null
          courier_vendor?: string | null
          created_at?: string | null
          delivery_address?: Json | null
          delivery_fee?: number | null
          delivery_instructions?: string | null
          discount?: number | null
          distance_km?: number | null
          estimate_downloaded?: boolean | null
          gstin?: string | null
          gstin_verified?: boolean | null
          has_personalization?: boolean | null
          id?: string
          idempotency_key?: string | null
          max_change_requests?: number | null
          order_number: string
          payment_id?: string | null
          payment_method?: string | null
          payment_status?: string | null
          payout_id?: string | null
          personalization_charges?: number | null
          platform_fee?: number | null
          price_locked_until?: string | null
          promised_delivery_at?: string | null
          razorpay_order_id?: string | null
          refunded_amount?: number | null
          return_deadline?: string | null
          shadowfax_tracking_url?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          subtotal: number
          tax_amount?: number | null
          total: number
          total_savings?: number | null
          updated_at?: string | null
          user_id: string
          vendor_id: string
        }
        Update: {
          address_id?: string | null
          awb_number?: string | null
          billing_address?: Json | null
          cancellation_reason?: string | null
          cancelled_by?: string | null
          cashback_amount?: number | null
          cashback_credited?: boolean | null
          change_request_count?: number | null
          courier_tracking_id?: string | null
          courier_vendor?: string | null
          created_at?: string | null
          delivery_address?: Json | null
          delivery_fee?: number | null
          delivery_instructions?: string | null
          discount?: number | null
          distance_km?: number | null
          estimate_downloaded?: boolean | null
          gstin?: string | null
          gstin_verified?: boolean | null
          has_personalization?: boolean | null
          id?: string
          idempotency_key?: string | null
          max_change_requests?: number | null
          order_number?: string
          payment_id?: string | null
          payment_method?: string | null
          payment_status?: string | null
          payout_id?: string | null
          personalization_charges?: number | null
          platform_fee?: number | null
          price_locked_until?: string | null
          promised_delivery_at?: string | null
          razorpay_order_id?: string | null
          refunded_amount?: number | null
          return_deadline?: string | null
          shadowfax_tracking_url?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number
          tax_amount?: number | null
          total?: number
          total_savings?: number | null
          updated_at?: string | null
          user_id?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_address_id_fkey"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "user_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_payout_id_fkey"
            columns: ["payout_id"]
            isOneToOne: false
            referencedRelation: "vendor_payouts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_settings: {
        Row: {
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      product_addon_groups: {
        Row: {
          addon_group_id: string
          display_order: number | null
          product_id: string
        }
        Insert: {
          addon_group_id: string
          display_order?: number | null
          product_id: string
        }
        Update: {
          addon_group_id?: string
          display_order?: number | null
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_addon_groups_addon_group_id_fkey"
            columns: ["addon_group_id"]
            isOneToOne: false
            referencedRelation: "addon_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_addon_groups_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_addons: {
        Row: {
          created_at: string | null
          group_id: string | null
          id: string
          is_available: boolean | null
          name: string
          price: number
        }
        Insert: {
          created_at?: string | null
          group_id?: string | null
          id?: string
          is_available?: boolean | null
          name: string
          price?: number
        }
        Update: {
          created_at?: string | null
          group_id?: string | null
          id?: string
          is_available?: boolean | null
          name?: string
          price?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_addons_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "addon_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      product_submissions: {
        Row: {
          base_price: number | null
          category_id: string | null
          created_at: string | null
          description: string | null
          gst_percentage: number | null
          has_personalization: boolean | null
          hsn_code: string | null
          id: string
          images: string[] | null
          is_perishable: boolean | null
          material: string | null
          mrp: number | null
          name: string
          personalization_schema: Json | null
          status: string | null
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          base_price?: number | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          gst_percentage?: number | null
          has_personalization?: boolean | null
          hsn_code?: string | null
          id?: string
          images?: string[] | null
          is_perishable?: boolean | null
          material?: string | null
          mrp?: number | null
          name: string
          personalization_schema?: Json | null
          status?: string | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          base_price?: number | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          gst_percentage?: number | null
          has_personalization?: boolean | null
          hsn_code?: string | null
          id?: string
          images?: string[] | null
          is_perishable?: boolean | null
          material?: string | null
          mrp?: number | null
          name?: string
          personalization_schema?: Json | null
          status?: string | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_submissions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_submissions_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          attributes: Json | null
          created_at: string | null
          id: string
          images: string[] | null
          is_active: boolean | null
          mrp: number | null
          name: string | null
          price: number | null
          product_id: string | null
          sku: string | null
          sort_order: number | null
          stock_quantity: number | null
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          attributes?: Json | null
          created_at?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          mrp?: number | null
          name?: string | null
          price?: number | null
          product_id?: string | null
          sku?: string | null
          sort_order?: number | null
          stock_quantity?: number | null
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          attributes?: Json | null
          created_at?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          mrp?: number | null
          name?: string | null
          price?: number | null
          product_id?: string | null
          sku?: string | null
          sort_order?: number | null
          stock_quantity?: number | null
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          available_for_order: boolean | null
          base_price: number
          brand: string | null
          care_instructions: string | null
          category_id: string | null
          country_of_origin: string | null
          created_at: string | null
          description: string | null
          dimensions: Json | null
          fragile: boolean | null
          fts: unknown
          gst_percentage: number | null
          has_personalization: boolean | null
          hsn_code: string | null
          id: string
          images: string[] | null
          is_active: boolean | null
          is_perishable: boolean | null
          low_stock_threshold: number | null
          manufacturer_info: string | null
          material: string | null
          max_change_requests: number | null
          max_order_quantity: number | null
          min_order_quantity: number | null
          mrp: number | null
          name: string
          packaging_type: string | null
          personalization_fee: number | null
          personalization_options: Json | null
          personalization_schema: Json | null
          preview_time_minutes: number | null
          production_time_minutes: number | null
          rating: number | null
          shelf_life_hours: number | null
          sku: string | null
          slug: string
          sort_order: number | null
          stock_quantity: number | null
          stock_status: string | null
          tags: string[] | null
          total_ratings: number | null
          updated_at: string | null
          vendor_id: string
          video_url: string | null
          weight_kg: number | null
        }
        Insert: {
          available_for_order?: boolean | null
          base_price: number
          brand?: string | null
          care_instructions?: string | null
          category_id?: string | null
          country_of_origin?: string | null
          created_at?: string | null
          description?: string | null
          dimensions?: Json | null
          fragile?: boolean | null
          fts?: unknown
          gst_percentage?: number | null
          has_personalization?: boolean | null
          hsn_code?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_perishable?: boolean | null
          low_stock_threshold?: number | null
          manufacturer_info?: string | null
          material?: string | null
          max_change_requests?: number | null
          max_order_quantity?: number | null
          min_order_quantity?: number | null
          mrp?: number | null
          name: string
          packaging_type?: string | null
          personalization_fee?: number | null
          personalization_options?: Json | null
          personalization_schema?: Json | null
          preview_time_minutes?: number | null
          production_time_minutes?: number | null
          rating?: number | null
          shelf_life_hours?: number | null
          sku?: string | null
          slug: string
          sort_order?: number | null
          stock_quantity?: number | null
          stock_status?: string | null
          tags?: string[] | null
          total_ratings?: number | null
          updated_at?: string | null
          vendor_id: string
          video_url?: string | null
          weight_kg?: number | null
        }
        Update: {
          available_for_order?: boolean | null
          base_price?: number
          brand?: string | null
          care_instructions?: string | null
          category_id?: string | null
          country_of_origin?: string | null
          created_at?: string | null
          description?: string | null
          dimensions?: Json | null
          fragile?: boolean | null
          fts?: unknown
          gst_percentage?: number | null
          has_personalization?: boolean | null
          hsn_code?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_perishable?: boolean | null
          low_stock_threshold?: number | null
          manufacturer_info?: string | null
          material?: string | null
          max_change_requests?: number | null
          max_order_quantity?: number | null
          min_order_quantity?: number | null
          mrp?: number | null
          name?: string
          packaging_type?: string | null
          personalization_fee?: number | null
          personalization_options?: Json | null
          personalization_schema?: Json | null
          preview_time_minutes?: number | null
          production_time_minutes?: number | null
          rating?: number | null
          shelf_life_hours?: number | null
          sku?: string | null
          slug?: string
          sort_order?: number | null
          stock_quantity?: number | null
          stock_status?: string | null
          tags?: string[] | null
          total_ratings?: number | null
          updated_at?: string | null
          vendor_id?: string
          video_url?: string | null
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      returns: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          images: string[] | null
          order_id: string
          reason: string
          refund_amount: number | null
          return_delivery_fee: number | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          order_id: string
          reason: string
          refund_amount?: number | null
          return_delivery_fee?: number | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          order_id?: string
          reason?: string
          refund_amount?: number | null
          return_delivery_fee?: number | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "returns_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "returns_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "v_order_detail"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "returns_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "v_order_tracking"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "returns_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          approved_mockup_url: string | null
          created_at: string | null
          delivered_photo_url: string | null
          delivery_rating: number | null
          fidelity_rating: number | null
          fidelity_tags: string[] | null
          id: string
          images: string[] | null
          is_anonymous: boolean | null
          is_personalised_review: boolean | null
          order_id: string
          order_product_id: string | null
          personalization_rating: number | null
          product_id: string | null
          rating: number
          review_text: string | null
          revision_count: number | null
          tags: string[] | null
          user_id: string
          vendor_id: string
          vendor_replied_at: string | null
          vendor_reply: string | null
          vendor_response_time_rating: number | null
        }
        Insert: {
          approved_mockup_url?: string | null
          created_at?: string | null
          delivered_photo_url?: string | null
          delivery_rating?: number | null
          fidelity_rating?: number | null
          fidelity_tags?: string[] | null
          id?: string
          images?: string[] | null
          is_anonymous?: boolean | null
          is_personalised_review?: boolean | null
          order_id: string
          order_product_id?: string | null
          personalization_rating?: number | null
          product_id?: string | null
          rating: number
          review_text?: string | null
          revision_count?: number | null
          tags?: string[] | null
          user_id: string
          vendor_id: string
          vendor_replied_at?: string | null
          vendor_reply?: string | null
          vendor_response_time_rating?: number | null
        }
        Update: {
          approved_mockup_url?: string | null
          created_at?: string | null
          delivered_photo_url?: string | null
          delivery_rating?: number | null
          fidelity_rating?: number | null
          fidelity_tags?: string[] | null
          id?: string
          images?: string[] | null
          is_anonymous?: boolean | null
          is_personalised_review?: boolean | null
          order_id?: string
          order_product_id?: string | null
          personalization_rating?: number | null
          product_id?: string | null
          rating?: number
          review_text?: string | null
          revision_count?: number | null
          tags?: string[] | null
          user_id?: string
          vendor_id?: string
          vendor_replied_at?: string | null
          vendor_reply?: string | null
          vendor_response_time_rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "v_order_detail"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "v_order_tracking"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_order_product_id_fkey"
            columns: ["order_product_id"]
            isOneToOne: false
            referencedRelation: "order_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      spatial_ref_sys: {
        Row: {
          auth_name: string | null
          auth_srid: number | null
          proj4text: string | null
          srid: number
          srtext: string | null
        }
        Insert: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid: number
          srtext?: string | null
        }
        Update: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid?: number
          srtext?: string | null
        }
        Relationships: []
      }
      user_addresses: {
        Row: {
          address_line1: string
          address_line2: string | null
          city: string | null
          country: string | null
          created_at: string | null
          gstin: string | null
          id: string
          is_default: boolean | null
          latitude: number | null
          location: unknown
          longitude: number | null
          name: string
          phone: string
          pincode: string | null
          state: string | null
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          gstin?: string | null
          id?: string
          is_default?: boolean | null
          latitude?: number | null
          location?: unknown
          longitude?: number | null
          name: string
          phone: string
          pincode?: string | null
          state?: string | null
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          gstin?: string | null
          id?: string
          is_default?: boolean | null
          latitude?: number | null
          location?: unknown
          longitude?: number | null
          name?: string
          phone?: string
          pincode?: string | null
          state?: string | null
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_wallets: {
        Row: {
          balance: number | null
          total_earned: number | null
          total_withdrawn: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          balance?: number | null
          total_earned?: number | null
          total_withdrawn?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          balance?: number | null
          total_earned?: number | null
          total_withdrawn?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wyshkit_money_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      vendor_applications: {
        Row: {
          address_line1: string | null
          bank_details: Json | null
          business_name: string
          category: string | null
          city: string | null
          contact_name: string
          created_at: string | null
          email: string | null
          gstin: string | null
          id: string
          pan_number: string | null
          phone: string
          pincode: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          address_line1?: string | null
          bank_details?: Json | null
          business_name: string
          category?: string | null
          city?: string | null
          contact_name: string
          created_at?: string | null
          email?: string | null
          gstin?: string | null
          id?: string
          pan_number?: string | null
          phone: string
          pincode?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          address_line1?: string | null
          bank_details?: Json | null
          business_name?: string
          category?: string | null
          city?: string | null
          contact_name?: string
          created_at?: string | null
          email?: string | null
          gstin?: string | null
          id?: string
          pan_number?: string | null
          phone?: string
          pincode?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      vendor_payouts: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          razorpay_payout_id: string | null
          settlement_period_end: string | null
          settlement_period_start: string | null
          status: string
          updated_at: string | null
          vendor_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          razorpay_payout_id?: string | null
          settlement_period_end?: string | null
          settlement_period_start?: string | null
          status?: string
          updated_at?: string | null
          vendor_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          razorpay_payout_id?: string | null
          settlement_period_end?: string | null
          settlement_period_start?: string | null
          status?: string
          updated_at?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_payouts_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          agreed_to_contract: boolean | null
          avg_prep_time_mins: number | null
          badge: string | null
          bank_details: Json | null
          banner_url: string | null
          base_delivery_charge: number | null
          business_name: string | null
          business_type: string | null
          city: string | null
          closing_time: string | null
          commission_percentage: number | null
          created_at: string | null
          description: string | null
          email: string | null
          fixed_packaging_charge: number | null
          fts: unknown
          gstin: string | null
          has_outlet: boolean | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_online: boolean | null
          is_promoted: boolean | null
          kyc_data_json: Json | null
          kyc_status: string | null
          kyc_verified_at: string | null
          location: unknown
          minimum_order_amount: number | null
          name: string
          onboarding_fee_paid: boolean | null
          opening_time: string | null
          packaging_charge_type: string | null
          pan_number: string | null
          payout_contact_id: string | null
          payout_fund_account_id: string | null
          personalization_commission_percentage: number | null
          pincode: string | null
          promotion_rank: number | null
          rating: number | null
          razorpay_account_id: string | null
          registered_name: string | null
          serviceability_radius_km: number | null
          settlement_days: number | null
          slug: string
          state: string | null
          tagline: string | null
          total_orders: number | null
          total_ratings: number | null
          updated_at: string | null
          vendor_external_id: string | null
          vendor_tier: string | null
          vendor_type: string | null
          whatsapp_number: string | null
          working_days: string[] | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          agreed_to_contract?: boolean | null
          avg_prep_time_mins?: number | null
          badge?: string | null
          bank_details?: Json | null
          banner_url?: string | null
          base_delivery_charge?: number | null
          business_name?: string | null
          business_type?: string | null
          city?: string | null
          closing_time?: string | null
          commission_percentage?: number | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          fixed_packaging_charge?: number | null
          fts?: unknown
          gstin?: string | null
          has_outlet?: boolean | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_online?: boolean | null
          is_promoted?: boolean | null
          kyc_data_json?: Json | null
          kyc_status?: string | null
          kyc_verified_at?: string | null
          location?: unknown
          minimum_order_amount?: number | null
          name: string
          onboarding_fee_paid?: boolean | null
          opening_time?: string | null
          packaging_charge_type?: string | null
          pan_number?: string | null
          payout_contact_id?: string | null
          payout_fund_account_id?: string | null
          personalization_commission_percentage?: number | null
          pincode?: string | null
          promotion_rank?: number | null
          rating?: number | null
          razorpay_account_id?: string | null
          registered_name?: string | null
          serviceability_radius_km?: number | null
          settlement_days?: number | null
          slug: string
          state?: string | null
          tagline?: string | null
          total_orders?: number | null
          total_ratings?: number | null
          updated_at?: string | null
          vendor_external_id?: string | null
          vendor_tier?: string | null
          vendor_type?: string | null
          whatsapp_number?: string | null
          working_days?: string[] | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          agreed_to_contract?: boolean | null
          avg_prep_time_mins?: number | null
          badge?: string | null
          bank_details?: Json | null
          banner_url?: string | null
          base_delivery_charge?: number | null
          business_name?: string | null
          business_type?: string | null
          city?: string | null
          closing_time?: string | null
          commission_percentage?: number | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          fixed_packaging_charge?: number | null
          fts?: unknown
          gstin?: string | null
          has_outlet?: boolean | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_online?: boolean | null
          is_promoted?: boolean | null
          kyc_data_json?: Json | null
          kyc_status?: string | null
          kyc_verified_at?: string | null
          location?: unknown
          minimum_order_amount?: number | null
          name?: string
          onboarding_fee_paid?: boolean | null
          opening_time?: string | null
          packaging_charge_type?: string | null
          pan_number?: string | null
          payout_contact_id?: string | null
          payout_fund_account_id?: string | null
          personalization_commission_percentage?: number | null
          pincode?: string | null
          promotion_rank?: number | null
          rating?: number | null
          razorpay_account_id?: string | null
          registered_name?: string | null
          serviceability_radius_km?: number | null
          settlement_days?: number | null
          slug?: string
          state?: string | null
          tagline?: string | null
          total_orders?: number | null
          total_ratings?: number | null
          updated_at?: string | null
          vendor_external_id?: string | null
          vendor_tier?: string | null
          vendor_type?: string | null
          whatsapp_number?: string | null
          working_days?: string[] | null
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount: number
          balance_after: number
          created_at: string | null
          id: string
          order_id: string | null
          reason: string
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          created_at?: string | null
          id?: string
          order_id?: string | null
          reason: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          created_at?: string | null
          id?: string
          order_id?: string | null
          reason?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wallet_transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "v_order_detail"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wallet_transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "v_order_tracking"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wallet_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_logs: {
        Row: {
          created_at: string | null
          external_id: string | null
          id: string
          payload: Json | null
          processed_at: string | null
          source: string
        }
        Insert: {
          created_at?: string | null
          external_id?: string | null
          id?: string
          payload?: Json | null
          processed_at?: string | null
          source: string
        }
        Update: {
          created_at?: string | null
          external_id?: string | null
          id?: string
          payload?: Json | null
          processed_at?: string | null
          source?: string
        }
        Relationships: []
      }
    }
    Views: {
      geography_columns: {
        Row: {
          coord_dimension: number | null
          f_geography_column: unknown
          f_table_catalog: unknown
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Relationships: []
      }
      geometry_columns: {
        Row: {
          coord_dimension: number | null
          f_geometry_column: unknown
          f_table_catalog: string | null
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Insert: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Update: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Relationships: []
      }
      v_active_cart_detailed: {
        Row: {
          base_price: number | null
          cart_id: string | null
          created_at: string | null
          effective_unit_price: number | null
          expires_at: string | null
          id: string | null
          personalization: Json | null
          product_gst_percentage: number | null
          product_id: string | null
          product_image_url: string | null
          product_name: string | null
          personalization_fee: number | null
          quantity: number | null
          selected_addons: Json | null
          selected_variant_id: string | null
          session_id: string | null
          updated_at: string | null
          user_id: string | null
          vendor_id: string | null
          vendor_is_online: boolean | null
          vendor_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_products_cart_id_fkey"
            columns: ["cart_id"]
            isOneToOne: false
            referencedRelation: "carts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_products_selected_variant_id_fkey"
            columns: ["selected_variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_products_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      v_order_detail: {
        Row: {
          billing_address: Json | null
          cancellation_reason: string | null
          created_at: string | null
          customer_email: string | null
          customer_name: string | null
          delivery_address: Json | null
          delivery_fee: number | null
          delivery_instructions: string | null
          discount: number | null
          gstin: string | null
          has_personalization: boolean | null
          id: string | null
          order_number: string | null
          order_products: Json | null
          payment_id: string | null
          payment_method: string | null
          payment_status: string | null
          personalization_charges: number | null
          platform_fee: number | null
          previews: Json | null
          promised_delivery_at: string | null
          razorpay_order_id: string | null
          status: Database["public"]["Enums"]["order_status"] | null
          subtotal: number | null
          tax_amount: number | null
          timeline: Json | null
          total: number | null
          total_savings: number | null
          updated_at: string | null
          user_id: string | null
          vendor_id: string | null
          vendor_image: string | null
          vendor_name: string | null
          vendor_prep_mins: number | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      v_order_tracking: {
        Row: {
          address_id: string | null
          awb_number: string | null
          billing_address: Json | null
          cancellation_reason: string | null
          cancelled_by: string | null
          cashback_amount: number | null
          cashback_credited: boolean | null
          change_request_count: number | null
          courier_tracking_id: string | null
          courier_vendor: string | null
          created_at: string | null
          delivery_address: Json | null
          delivery_fee: number | null
          delivery_instructions: string | null
          discount: number | null
          distance_km: number | null
          estimate_downloaded: boolean | null
          first_product_name: string | null
          gstin: string | null
          gstin_verified: boolean | null
          has_personalization: boolean | null
          id: string | null
          idempotency_key: string | null
          max_change_requests: number | null
          order_number: string | null
          payment_id: string | null
          payment_method: string | null
          payment_status: string | null
          payout_id: string | null
          personalization_charges: number | null
          platform_fee: number | null
          price_locked_until: string | null
          product_count: number | null
          promised_delivery_at: string | null
          razorpay_order_id: string | null
          refunded_amount: number | null
          return_deadline: string | null
          shadowfax_tracking_url: string | null
          status: Database["public"]["Enums"]["order_status"] | null
          subtotal: number | null
          tax_amount: number | null
          total: number | null
          updated_at: string | null
          user_id: string | null
          vendor_id: string | null
          vendor_image_url: string | null
          vendor_name: string | null
          vendor_phone: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_address_id_fkey"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "user_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_payout_id_fkey"
            columns: ["payout_id"]
            isOneToOne: false
            referencedRelation: "vendor_payouts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      _postgis_deprecate: {
        Args: { newname: string; oldname: string; version: string }
        Returns: undefined
      }
      _postgis_index_extent: {
        Args: { col: string; tbl: unknown }
        Returns: unknown
      }
      _postgis_pgsql_version: { Args: never; Returns: string }
      _postgis_scripts_pgsql_version: { Args: never; Returns: string }
      _postgis_selectivity: {
        Args: { att_name: string; geom: unknown; mode?: string; tbl: unknown }
        Returns: number
      }
      _postgis_stats: {
        Args: { ""?: string; att_name: string; tbl: unknown }
        Returns: string
      }
      _st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_coveredby:
      | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
      | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_covers:
      | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
      | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_crosses: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      _st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_intersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      _st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      _st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      _st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_sortablehash: { Args: { geom: unknown }; Returns: number }
      _st_touches: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_voronoi: {
        Args: {
          clip?: unknown
          g1: unknown
          return_polygons?: boolean
          tolerance?: number
        }
        Returns: unknown
      }
      _st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      add_product_review: {
        Args: {
          p_approved_mockup_url?: string
          p_comment: string
          p_fidelity_tags?: string[]
          p_order_id: string
          p_order_product_id: string
          p_personalization_rating?: number
          p_product_id: string
          p_rating: number
        }
        Returns: Json
      }
      addauth: { Args: { "": string }; Returns: boolean }
      addgeometrycolumn:
      | {
        Args: {
          catalog_name: string
          column_name: string
          new_dim: number
          new_srid_in: number
          new_type: string
          schema_name: string
          table_name: string
          use_typmod?: boolean
        }
        Returns: string
      }
      | {
        Args: {
          column_name: string
          new_dim: number
          new_srid: number
          new_type: string
          schema_name: string
          table_name: string
          use_typmod?: boolean
        }
        Returns: string
      }
      | {
        Args: {
          column_name: string
          new_dim: number
          new_srid: number
          new_type: string
          table_name: string
          use_typmod?: boolean
        }
        Returns: string
      }
      approve_order_preview: { Args: { p_order_id: string }; Returns: Json }
      calculate_order_total: {
        Args: {
          p_address_id?: string
          p_coupon_code?: string
          p_delivery_fee_override?: number
          p_distance_km?: number
          p_items: Json
          p_session_id?: string
          p_use_wallet?: boolean
          p_user_id?: string
        }
        Returns: Json
      }
      calculate_promised_delivery_time: {
        Args: { p_order_id: string }
        Returns: string
      }
      calculate_return_refund: {
        Args: { p_order_id: string; p_reason: string }
        Returns: Json
      }
      calculate_vendor_settlement: {
        Args: { p_order_id: string }
        Returns: Json
      }
      cancel_order_product_atomic: {
        Args: {
          p_order_id: string
          p_order_product_id: string
          p_reason: string
        }
        Returns: Json
      }
      clear_cart: {
        Args: { p_session_id?: string; p_user_id?: string }
        Returns: Json
      }
      credit_cashback: {
        Args: { p_order_id: string; p_order_total: number; p_user_id: string }
        Returns: Json
      }
      deduct_wallet_balance: {
        Args: {
          p_amount: number
          p_description: string
          p_order_id: string
          p_user_id: string
        }
        Returns: undefined
      }
      disablelongtransactions: { Args: never; Returns: string }
      dropgeometrycolumn:
      | {
        Args: {
          catalog_name: string
          column_name: string
          schema_name: string
          table_name: string
        }
        Returns: string
      }
      | {
        Args: {
          column_name: string
          schema_name: string
          table_name: string
        }
        Returns: string
      }
      | { Args: { column_name: string; table_name: string }; Returns: string }
      dropgeometrytable:
      | {
        Args: {
          catalog_name: string
          schema_name: string
          table_name: string
        }
        Returns: string
      }
      | { Args: { schema_name: string; table_name: string }; Returns: string }
      | { Args: { table_name: string }; Returns: string }
      enablelongtransactions: { Args: never; Returns: string }
      equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      execute_admin_intent: { Args: { p_intent: Json }; Returns: Json }
      execute_cart_mutation: {
        Args: {
          p_clear_other_vendors?: boolean
          p_mode?: string
          p_personalization?: Json
          p_product_id: string
          p_quantity: number
          p_selected_addons?: Json
          p_session_id?: string
          p_user_id?: string
          p_variant_id?: string
        }
        Returns: Json
      }
      geometry: { Args: { "": string }; Returns: unknown }
      geometry_above: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_below: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_cmp: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_contained_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_distance_box: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_distance_centroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_eq: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_ge: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_gt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_le: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_left: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_lt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overabove: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overbelow: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overleft: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overright: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_right: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geomfromewkt: { Args: { "": string }; Returns: unknown }
      get_available_stock: {
        Args: {
          p_exclude_session_id?: string
          p_exclude_user_id?: string
          p_product_id: string
          p_variant_id?: string
        }
        Returns: number
      }
      get_cart_context: {
        Args: { p_session_id?: string; p_user_id?: string }
        Returns: Json
      }
      get_checkout_context: {
        Args: {
          p_applied_coupon?: string
          p_guest_lat?: number
          p_guest_lng?: number
          p_selected_address_id?: string
          p_session_id?: string
          p_use_wallet?: boolean
          p_user_id?: string
        }
        Returns: Json
      }
      get_delivery_fee: { Args: { p_distance_km?: number }; Returns: number }
      get_global_init_surface: {
        Args: { p_lat?: number; p_lng?: number; p_user_id?: string }
        Returns: Json
      }
      get_home_surface: {
        Args: {
          p_lat?: number
          p_lng?: number
          p_session_id?: string
          p_user_id?: string
        }
        Returns: Json
      }
      get_nearby_products: {
        Args: {
          include_out_of_stock?: boolean
          radius_km?: number
          user_lat: number
          user_lng: number
        }
        Returns: Json
      }
      get_personalization_status: { Args: { p_details: Json }; Returns: string }
      get_platform_fee: { Args: never; Returns: number }
      get_product_surface_v1: {
        Args: { p_product_id_or_slug: string; p_vendor_id_or_slug: string }
        Returns: Json
      }
      get_user_orders_v1: { Args: never; Returns: Json }
      get_vendor_financials_v2: { Args: { p_vendor_id: string }; Returns: Json }
      get_vendor_from_session: {
        Args: { p_app_metadata?: Json; p_email?: string; p_user_id: string }
        Returns: Json
      }
      get_vendor_surface: {
        Args: {
          p_category_slug?: string
          p_lat?: number
          p_lng?: number
          p_vendor_id_or_slug: string
        }
        Returns: Json
      }
      gettransactionid: { Args: never; Returns: unknown }
      issue_wallet_credit_atomic: {
        Args: {
          p_amount: number
          p_order_id?: string
          p_reason: string
          p_user_id: string
        }
        Returns: Json
      }
      log_operator_action: {
        Args: {
          p_action: string
          p_new_state?: Json
          p_operator_id?: string
          p_previous_state?: Json
          p_reason?: string
          p_severity?: string
          p_target_id?: string
          p_target_table?: string
        }
        Returns: string
      }
      log_order_status_history:
      | {
        Args: {
          p_description?: string
          p_metadata?: Json
          p_order_id: string
          p_status: Database["public"]["Enums"]["order_status"]
          p_title?: string
        }
        Returns: undefined
      }
      | {
        Args: {
          p_description: string
          p_metadata?: Json
          p_order_id: string
          p_title: string
          p_type: string
        }
        Returns: Json
      }
      longtransactionsenabled: { Args: never; Returns: boolean }
      merge_guest_to_user: {
        Args: { p_session_id: string; p_user_id: string }
        Returns: Json
      }
      place_atomic_order: {
        Args: {
          p_address_id: string
          p_coupon_code?: string
          p_delivery_instructions?: string
          p_distance_km?: number
          p_gstin?: string
          p_items: Json
          p_payment_id?: string
          p_razorpay_order_id: string
          p_use_wallet?: boolean
        }
        Returns: Json
      }
      populate_geometry_columns:
      | { Args: { tbl_oid: unknown; use_typmod?: boolean }; Returns: number }
      | { Args: { use_typmod?: boolean }; Returns: string }
      postgis_constraint_dims: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_srid: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_type: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: string
      }
      postgis_extensions_upgrade: { Args: never; Returns: string }
      postgis_full_version: { Args: never; Returns: string }
      postgis_geos_version: { Args: never; Returns: string }
      postgis_lib_build_date: { Args: never; Returns: string }
      postgis_lib_revision: { Args: never; Returns: string }
      postgis_lib_version: { Args: never; Returns: string }
      postgis_libjson_version: { Args: never; Returns: string }
      postgis_liblwgeom_version: { Args: never; Returns: string }
      postgis_libprotobuf_version: { Args: never; Returns: string }
      postgis_libxml_version: { Args: never; Returns: string }
      postgis_proj_version: { Args: never; Returns: string }
      postgis_scripts_build_date: { Args: never; Returns: string }
      postgis_scripts_installed: { Args: never; Returns: string }
      postgis_scripts_released: { Args: never; Returns: string }
      postgis_svn_version: { Args: never; Returns: string }
      postgis_type_name: {
        Args: {
          coord_dimension: number
          geomname: string
          use_new_name?: boolean
        }
        Returns: string
      }
      postgis_version: { Args: never; Returns: string }
      postgis_wagyu_version: { Args: never; Returns: string }
      process_order_return: {
        Args: {
          p_order_id: string
          p_payment_id?: string
          p_reason: string
          p_refund_amount: number
        }
        Returns: Json
      }
      recalculate_order_total: {
        Args: { p_order_id: string }
        Returns: undefined
      }
      reorder_products: {
        Args: {
          p_order_id: string
          p_reuse_personalization?: boolean
          p_session_id?: string
          p_user_id?: string
        }
        Returns: Json
      }
      request_change: {
        Args: { p_feedback: string; p_order_id: string }
        Returns: Json
      }
      resolve_user_permissions: { Args: { p_user_id: string }; Returns: Json }
      salvation_shift_order_atomic: {
        Args: {
          p_issue_token?: boolean
          p_new_vendor_id: string
          p_order_id: string
          p_reason: string
          p_token_amount?: number
        }
        Returns: Json
      }
      search_products_atomic: {
        Args: {
          p_category_id?: string
          p_lat?: number
          p_limit?: number
          p_lng?: number
          p_offset?: number
          p_query?: string
        }
        Returns: {
          base_price: number
          distance_meters: number
          id: string
          images: string[]
          name: string
          rating: number
          slug: string
          total_count: number
          total_ratings: number
          vendor_id: string
          vendor_image_url: string
          vendor_is_active: boolean
          vendor_name: string
          vendor_slug: string
        }[]
      }
      st_3dclosestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3ddistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_3dlongestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmakebox: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmaxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dshortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_addpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_angle:
      | { Args: { line1: unknown; line2: unknown }; Returns: number }
      | {
        Args: { pt1: unknown; pt2: unknown; pt3: unknown; pt4?: unknown }
        Returns: number
      }
      st_area:
      | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
      | { Args: { "": string }; Returns: number }
      st_asencodedpolyline: {
        Args: { geom: unknown; nprecision?: number }
        Returns: string
      }
      st_asewkt: { Args: { "": string }; Returns: string }
      st_asgeojson:
      | {
        Args: { geog: unknown; maxdecimaldigits?: number; options?: number }
        Returns: string
      }
      | {
        Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
        Returns: string
      }
      | {
        Args: {
          geom_column?: string
          maxdecimaldigits?: number
          pretty_bool?: boolean
          r: Record<string, unknown>
        }
        Returns: string
      }
      | { Args: { "": string }; Returns: string }
      st_asgml:
      | {
        Args: {
          geog: unknown
          id?: string
          maxdecimaldigits?: number
          nprefix?: string
          options?: number
        }
        Returns: string
      }
      | {
        Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
        Returns: string
      }
      | { Args: { "": string }; Returns: string }
      | {
        Args: {
          geog: unknown
          id?: string
          maxdecimaldigits?: number
          nprefix?: string
          options?: number
          version: number
        }
        Returns: string
      }
      | {
        Args: {
          geom: unknown
          id?: string
          maxdecimaldigits?: number
          nprefix?: string
          options?: number
          version: number
        }
        Returns: string
      }
      st_askml:
      | {
        Args: { geog: unknown; maxdecimaldigits?: number; nprefix?: string }
        Returns: string
      }
      | {
        Args: { geom: unknown; maxdecimaldigits?: number; nprefix?: string }
        Returns: string
      }
      | { Args: { "": string }; Returns: string }
      st_aslatlontext: {
        Args: { geom: unknown; tmpl?: string }
        Returns: string
      }
      st_asmarc21: { Args: { format?: string; geom: unknown }; Returns: string }
      st_asmvtgeom: {
        Args: {
          bounds: unknown
          buffer?: number
          clip_geom?: boolean
          extent?: number
          geom: unknown
        }
        Returns: unknown
      }
      st_assvg:
      | {
        Args: { geog: unknown; maxdecimaldigits?: number; rel?: number }
        Returns: string
      }
      | {
        Args: { geom: unknown; maxdecimaldigits?: number; rel?: number }
        Returns: string
      }
      | { Args: { "": string }; Returns: string }
      st_astext: { Args: { "": string }; Returns: string }
      st_astwkb:
      | {
        Args: {
          geom: unknown
          prec?: number
          prec_m?: number
          prec_z?: number
          with_boxes?: boolean
          with_sizes?: boolean
        }
        Returns: string
      }
      | {
        Args: {
          geom: unknown[]
          ids: number[]
          prec?: number
          prec_m?: number
          prec_z?: number
          with_boxes?: boolean
          with_sizes?: boolean
        }
        Returns: string
      }
      st_asx3d: {
        Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
        Returns: string
      }
      st_azimuth:
      | { Args: { geog1: unknown; geog2: unknown }; Returns: number }
      | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
      st_boundingdiagonal: {
        Args: { fits?: boolean; geom: unknown }
        Returns: unknown
      }
      st_buffer:
      | {
        Args: { geom: unknown; options?: string; radius: number }
        Returns: unknown
      }
      | {
        Args: { geom: unknown; quadsegs: number; radius: number }
        Returns: unknown
      }
      st_centroid: { Args: { "": string }; Returns: unknown }
      st_clipbybox2d: {
        Args: { box: unknown; geom: unknown }
        Returns: unknown
      }
      st_closestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_collect: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_concavehull: {
        Args: {
          param_allow_holes?: boolean
          param_geom: unknown
          param_pctconvex: number
        }
        Returns: unknown
      }
      st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_coorddim: { Args: { geometry: unknown }; Returns: number }
      st_coveredby:
      | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
      | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_covers:
      | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
      | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_crosses: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_curvetoline: {
        Args: { flags?: number; geom: unknown; tol?: number; toltype?: number }
        Returns: unknown
      }
      st_delaunaytriangles: {
        Args: { flags?: number; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_difference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_disjoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_distance:
      | {
        Args: { geog1: unknown; geog2: unknown; use_spheroid?: boolean }
        Returns: number
      }
      | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
      st_distancesphere:
      | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
      | {
        Args: { geom1: unknown; geom2: unknown; radius: number }
        Returns: number
      }
      st_distancespheroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_expand:
      | { Args: { box: unknown; dx: number; dy: number }; Returns: unknown }
      | {
        Args: { box: unknown; dx: number; dy: number; dz?: number }
        Returns: unknown
      }
      | {
        Args: {
          dm?: number
          dx: number
          dy: number
          dz?: number
          geom: unknown
        }
        Returns: unknown
      }
      st_force3d: { Args: { geom: unknown; zvalue?: number }; Returns: unknown }
      st_force3dm: {
        Args: { geom: unknown; mvalue?: number }
        Returns: unknown
      }
      st_force3dz: {
        Args: { geom: unknown; zvalue?: number }
        Returns: unknown
      }
      st_force4d: {
        Args: { geom: unknown; mvalue?: number; zvalue?: number }
        Returns: unknown
      }
      st_generatepoints:
      | { Args: { area: unknown; npoints: number }; Returns: unknown }
      | {
        Args: { area: unknown; npoints: number; seed: number }
        Returns: unknown
      }
      st_geogfromtext: { Args: { "": string }; Returns: unknown }
      st_geographyfromtext: { Args: { "": string }; Returns: unknown }
      st_geohash:
      | { Args: { geog: unknown; maxchars?: number }; Returns: string }
      | { Args: { geom: unknown; maxchars?: number }; Returns: string }
      st_geomcollfromtext: { Args: { "": string }; Returns: unknown }
      st_geometricmedian: {
        Args: {
          fail_if_not_converged?: boolean
          g: unknown
          max_iter?: number
          tolerance?: number
        }
        Returns: unknown
      }
      st_geometryfromtext: { Args: { "": string }; Returns: unknown }
      st_geomfromewkt: { Args: { "": string }; Returns: unknown }
      st_geomfromgeojson:
      | { Args: { "": Json }; Returns: unknown }
      | { Args: { "": Json }; Returns: unknown }
      | { Args: { "": string }; Returns: unknown }
      st_geomfromgml: { Args: { "": string }; Returns: unknown }
      st_geomfromkml: { Args: { "": string }; Returns: unknown }
      st_geomfrommarc21: { Args: { marc21xml: string }; Returns: unknown }
      st_geomfromtext: { Args: { "": string }; Returns: unknown }
      st_gmltosql: { Args: { "": string }; Returns: unknown }
      st_hasarc: { Args: { geometry: unknown }; Returns: boolean }
      st_hausdorffdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_hexagon: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_hexagongrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_interpolatepoint: {
        Args: { line: unknown; point: unknown }
        Returns: number
      }
      st_intersection: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_intersects:
      | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
      | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_isvaliddetail: {
        Args: { flags?: number; geom: unknown }
        Returns: Database["public"]["CompositeTypes"]["valid_detail"]
        SetofOptions: {
          from: "*"
          to: "valid_detail"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      st_length:
      | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
      | { Args: { "": string }; Returns: number }
      st_letters: { Args: { font?: Json; letters: string }; Returns: unknown }
      st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      st_linefromencodedpolyline: {
        Args: { nprecision?: number; txtin: string }
        Returns: unknown
      }
      st_linefromtext: { Args: { "": string }; Returns: unknown }
      st_linelocatepoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_linetocurve: { Args: { geometry: unknown }; Returns: unknown }
      st_locatealong: {
        Args: { geometry: unknown; leftrightoffset?: number; measure: number }
        Returns: unknown
      }
      st_locatebetween: {
        Args: {
          frommeasure: number
          geometry: unknown
          leftrightoffset?: number
          tomeasure: number
        }
        Returns: unknown
      }
      st_locatebetweenelevations: {
        Args: { fromelevation: number; geometry: unknown; toelevation: number }
        Returns: unknown
      }
      st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makebox2d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makeline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makevalid: {
        Args: { geom: unknown; params: string }
        Returns: unknown
      }
      st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_minimumboundingcircle: {
        Args: { inputgeom: unknown; segs_per_quarter?: number }
        Returns: unknown
      }
      st_mlinefromtext: { Args: { "": string }; Returns: unknown }
      st_mpointfromtext: { Args: { "": string }; Returns: unknown }
      st_mpolyfromtext: { Args: { "": string }; Returns: unknown }
      st_multilinestringfromtext: { Args: { "": string }; Returns: unknown }
      st_multipointfromtext: { Args: { "": string }; Returns: unknown }
      st_multipolygonfromtext: { Args: { "": string }; Returns: unknown }
      st_node: { Args: { g: unknown }; Returns: unknown }
      st_normalize: { Args: { geom: unknown }; Returns: unknown }
      st_offsetcurve: {
        Args: { distance: number; line: unknown; params?: string }
        Returns: unknown
      }
      st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_perimeter: {
        Args: { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_pointfromtext: { Args: { "": string }; Returns: unknown }
      st_pointm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
        }
        Returns: unknown
      }
      st_pointz: {
        Args: {
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_pointzm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_polyfromtext: { Args: { "": string }; Returns: unknown }
      st_polygonfromtext: { Args: { "": string }; Returns: unknown }
      st_project: {
        Args: { azimuth: number; distance: number; geog: unknown }
        Returns: unknown
      }
      st_quantizecoordinates: {
        Args: {
          g: unknown
          prec_m?: number
          prec_x: number
          prec_y?: number
          prec_z?: number
        }
        Returns: unknown
      }
      st_reduceprecision: {
        Args: { geom: unknown; gridsize: number }
        Returns: unknown
      }
      st_relate: { Args: { geom1: unknown; geom2: unknown }; Returns: string }
      st_removerepeatedpoints: {
        Args: { geom: unknown; tolerance?: number }
        Returns: unknown
      }
      st_segmentize: {
        Args: { geog: unknown; max_segment_length: number }
        Returns: unknown
      }
      st_setsrid:
      | { Args: { geog: unknown; srid: number }; Returns: unknown }
      | { Args: { geom: unknown; srid: number }; Returns: unknown }
      st_sharedpaths: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_shortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_simplifypolygonhull: {
        Args: { geom: unknown; is_outer?: boolean; vertex_fraction: number }
        Returns: unknown
      }
      st_split: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_square: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_squaregrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_srid:
      | { Args: { geog: unknown }; Returns: number }
      | { Args: { geom: unknown }; Returns: number }
      st_subdivide: {
        Args: { geom: unknown; gridsize?: number; maxvertices?: number }
        Returns: unknown[]
      }
      st_swapordinates: {
        Args: { geom: unknown; ords: unknown }
        Returns: unknown
      }
      st_symdifference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_symmetricdifference: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_tileenvelope: {
        Args: {
          bounds?: unknown
          margin?: number
          x: number
          y: number
          zoom: number
        }
        Returns: unknown
      }
      st_touches: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_transform:
      | {
        Args: { from_proj: string; geom: unknown; to_proj: string }
        Returns: unknown
      }
      | {
        Args: { from_proj: string; geom: unknown; to_srid: number }
        Returns: unknown
      }
      | { Args: { geom: unknown; to_proj: string }; Returns: unknown }
      st_triangulatepolygon: { Args: { g1: unknown }; Returns: unknown }
      st_union:
      | { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      | {
        Args: { geom1: unknown; geom2: unknown; gridsize: number }
        Returns: unknown
      }
      st_voronoilines: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_voronoipolygons: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_wkbtosql: { Args: { wkb: string }; Returns: unknown }
      st_wkttosql: { Args: { "": string }; Returns: unknown }
      st_wrapx: {
        Args: { geom: unknown; move: number; wrap: number }
        Returns: unknown
      }
      submit_order_personalization: {
        Args: { p_order_id: string; p_personalization_input: Json }
        Returns: Json
      }
      transition_order: {
        Args: {
          p_metadata?: Json
          p_order_id: string
          p_target_status: Database["public"]["Enums"]["order_status"]
          p_user_id?: string
        }
        Returns: Json
      }
      unlockrows: { Args: { "": string }; Returns: number }
      update_checkout_session: {
        Args: {
          p_applied_coupon?: string
          p_gstin?: string
          p_guest_lat?: number
          p_guest_lng?: number
          p_guest_location_name?: string
          p_selected_address_id?: string
          p_session_id?: string
          p_use_wallet?: boolean
          p_user_id?: string
        }
        Returns: Json
      }
      updategeometrysrid: {
        Args: {
          catalogn_name: string
          column_name: string
          new_srid_in: number
          schema_name: string
          table_name: string
        }
        Returns: string
      }
    }
    Enums: {
      order_product_status:
      | "PENDING_PERSONALIZATION"
      | "MOCKUP_READY"
      | "MOCKUP_REJECTED"
      | "MOCKUP_APPROVED"
      | "IN_PRODUCTION"
      | "PACKED"
      | "READY_FOR_PICKUP"
      | "CANCELLED"
      order_status:
      | "PLACED"
      | "CONFIRMED"
      | "IN_PRODUCTION"
      | "PACKED"
      | "RIDER_ASSIGNED"
      | "ARRIVED_PICKUP"
      | "OUT_FOR_DELIVERY"
      | "ARRIVED_DROP"
      | "DELIVERED"
      | "CANCELLED"
      | "REFUNDED"
      vendor_tier_type: "0" | "1" | "2" | "3"
    }
    CompositeTypes: {
      geometry_dump: {
        path: number[] | null
        geom: unknown
      }
      valid_detail: {
        valid: boolean | null
        reason: string | null
        location: unknown
      }
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
  | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
    DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
    DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
  | keyof DefaultSchema["Enums"]
  | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof DefaultSchema["CompositeTypes"]
  | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
  : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  public: {
    Enums: {
      order_product_status: [
        "PENDING_PERSONALIZATION",
        "MOCKUP_READY",
        "MOCKUP_REJECTED",
        "MOCKUP_APPROVED",
        "IN_PRODUCTION",
        "PACKED",
        "READY_FOR_PICKUP",
        "CANCELLED",
      ],
      order_status: [
        "PLACED",
        "CONFIRMED",
        "IN_PRODUCTION",
        "PACKED",
        "RIDER_ASSIGNED",
        "ARRIVED_PICKUP",
        "OUT_FOR_DELIVERY",
        "ARRIVED_DROP",
        "DELIVERED",
        "CANCELLED",
        "REFUNDED",
      ],
      vendor_tier_type: ["0", "1", "2", "3"],
    },
  },
} as const
