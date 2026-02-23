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
      addresses: {
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
      cart_items: {
        Row: {
          created_at: string | null
          id: string
          item_id: string
          personalization: Json | null
          quantity: number
          selected_addons: Json | null
          selected_variant_id: string | null
          session_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_id: string
          personalization?: Json | null
          quantity?: number
          selected_addons?: Json | null
          selected_variant_id?: string | null
          session_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          item_id?: string
          personalization?: Json | null
          quantity?: number
          selected_addons?: Json | null
          selected_variant_id?: string | null
          session_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "v_item_listings_search"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "v_trending_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_selected_variant_id_fkey"
            columns: ["selected_variant_id"]
            isOneToOne: false
            referencedRelation: "variants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      cart_reservations: {
        Row: {
          cart_item_id: string
          expires_at: string
          id: string
          item_id: string
          quantity: number
          reserved_at: string
          variant_id: string | null
        }
        Insert: {
          cart_item_id: string
          expires_at: string
          id?: string
          item_id: string
          quantity: number
          reserved_at?: string
          variant_id?: string | null
        }
        Update: {
          cart_item_id?: string
          expires_at?: string
          id?: string
          item_id?: string
          quantity?: number
          reserved_at?: string
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_reservations_cart_item_id_fkey"
            columns: ["cart_item_id"]
            isOneToOne: false
            referencedRelation: "cart_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_reservations_cart_item_id_fkey"
            columns: ["cart_item_id"]
            isOneToOne: false
            referencedRelation: "v_active_cart_detailed"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_reservations_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_reservations_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "v_item_listings_search"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_reservations_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "v_trending_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_reservations_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "variants"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          slug?: string
        }
        Relationships: []
      }
      category_commissions: {
        Row: {
          category_id: string
          commission_rate: number
          created_at: string | null
          id: string
          partner_id: string | null
        }
        Insert: {
          category_id: string
          commission_rate: number
          created_at?: string | null
          id?: string
          partner_id?: string | null
        }
        Update: {
          category_id?: string
          commission_rate?: number
          created_at?: string | null
          id?: string
          partner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "category_commissions_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "category_commissions_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "v_active_cart_detailed"
            referencedColumns: ["partner_id"]
          },
          {
            foreignKeyName: "category_commissions_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "v_partner_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "category_commissions_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "v_partners_detailed"
            referencedColumns: ["id"]
          },
        ]
      }
      checkout_sessions: {
        Row: {
          applied_coupon: string | null
          created_at: string | null
          gstin: string | null
          guest_lat: number | null
          guest_lng: number | null
          guest_location_name: string | null
          id: string
          selected_address_id: string | null
          session_id: string | null
          updated_at: string | null
          use_wallet: boolean | null
          user_id: string | null
        }
        Insert: {
          applied_coupon?: string | null
          created_at?: string | null
          gstin?: string | null
          guest_lat?: number | null
          guest_lng?: number | null
          guest_location_name?: string | null
          id?: string
          selected_address_id?: string | null
          session_id?: string | null
          updated_at?: string | null
          use_wallet?: boolean | null
          user_id?: string | null
        }
        Update: {
          applied_coupon?: string | null
          created_at?: string | null
          gstin?: string | null
          guest_lat?: number | null
          guest_lng?: number | null
          guest_location_name?: string | null
          id?: string
          selected_address_id?: string | null
          session_id?: string | null
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
            referencedRelation: "addresses"
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
          created_by_partner_id: string | null
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
          created_by_partner_id?: string | null
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
          created_by_partner_id?: string | null
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
            foreignKeyName: "coupons_created_by_partner_id_fkey"
            columns: ["created_by_partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupons_created_by_partner_id_fkey"
            columns: ["created_by_partner_id"]
            isOneToOne: false
            referencedRelation: "v_active_cart_detailed"
            referencedColumns: ["partner_id"]
          },
          {
            foreignKeyName: "coupons_created_by_partner_id_fkey"
            columns: ["created_by_partner_id"]
            isOneToOne: false
            referencedRelation: "v_partner_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupons_created_by_partner_id_fkey"
            columns: ["created_by_partner_id"]
            isOneToOne: false
            referencedRelation: "v_partners_detailed"
            referencedColumns: ["id"]
          },
        ]
      }
      deliveries: {
        Row: {
          awb_number: string | null
          courier_partner: string | null
          created_at: string | null
          delivered_at: string | null
          estimated_delivery_at: string | null
          id: string
          order_id: string | null
          partner_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          awb_number?: string | null
          courier_partner?: string | null
          created_at?: string | null
          delivered_at?: string | null
          estimated_delivery_at?: string | null
          id?: string
          order_id?: string | null
          partner_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          awb_number?: string | null
          courier_partner?: string | null
          created_at?: string | null
          delivered_at?: string | null
          estimated_delivery_at?: string | null
          id?: string
          order_id?: string | null
          partner_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deliveries_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deliveries_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "v_order_tracking"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deliveries_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deliveries_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "v_active_cart_detailed"
            referencedColumns: ["partner_id"]
          },
          {
            foreignKeyName: "deliveries_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "v_partner_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deliveries_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "v_partners_detailed"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_updates: {
        Row: {
          created_at: string | null
          delivery_id: string | null
          description: string | null
          id: string
          location: string | null
          occurred_at: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          delivery_id?: string | null
          description?: string | null
          id?: string
          location?: string | null
          occurred_at?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          delivery_id?: string | null
          description?: string | null
          id?: string
          location?: string | null
          occurred_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_updates_delivery_id_fkey"
            columns: ["delivery_id"]
            isOneToOne: false
            referencedRelation: "deliveries"
            referencedColumns: ["id"]
          },
        ]
      }
      dispatch_attempts: {
        Row: {
          attempts: number | null
          created_at: string | null
          id: string
          last_error: string | null
          max_attempts: number | null
          next_attempt_at: string | null
          order_id: string
          payload: Json
          status: string
          updated_at: string | null
        }
        Insert: {
          attempts?: number | null
          created_at?: string | null
          id?: string
          last_error?: string | null
          max_attempts?: number | null
          next_attempt_at?: string | null
          order_id: string
          payload: Json
          status?: string
          updated_at?: string | null
        }
        Update: {
          attempts?: number | null
          created_at?: string | null
          id?: string
          last_error?: string | null
          max_attempts?: number | null
          next_attempt_at?: string | null
          order_id?: string
          payload?: Json
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dispatch_attempts_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dispatch_attempts_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "v_order_tracking"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string | null
          id: string
          item_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          item_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "v_item_listings_search"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "v_trending_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      item_reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          images: string[] | null
          item_id: string
          rating: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          images?: string[] | null
          item_id: string
          rating: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          images?: string[] | null
          item_id?: string
          rating?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_reviews_product_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_reviews_product_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "v_item_listings_search"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_reviews_product_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "v_trending_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      items: {
        Row: {
          approval_status: string
          base_price: number
          brand: string | null
          capacity: string | null
          care_instructions: string | null
          category: string | null
          country_of_origin: string | null
          created_at: string | null
          delivery_time_max: number | null
          delivery_time_min: number | null
          description: string | null
          dimensions: Json | null
          embedding: string | null
          expiry_date: string | null
          fragile: boolean | null
          fssai_license: string | null
          fts: unknown
          gst_percentage: number | null
          gst_rate: number | null
          has_personalization: boolean | null
          hsn_code: string | null
          id: string
          images: string[] | null
          is_active: boolean | null
          is_perishable: boolean | null
          is_promoted: boolean | null
          is_sponsored: boolean | null
          low_stock_threshold: number | null
          manufacturer_info: string | null
          material: string | null
          max_change_requests: number | null
          mrp: number | null
          name: string
          net_weight: string | null
          packaging_type: string | null
          partner_id: string
          personalization_fee: number | null
          personalization_options: Json | null
          personalization_schema: Json | null
          preview_time_minutes: number | null
          production_hours: number | null
          production_time_minutes: number | null
          promoted_rank: number | null
          promotion_rank: number | null
          rating: number | null
          return_eligible: boolean | null
          return_policy: string | null
          return_policy_type: string | null
          shelf_life_hours: number | null
          slug: string
          specifications: Json | null
          sponsorship_budget: number | null
          sponsorship_spent: number | null
          stock_quantity: number | null
          stock_status: string | null
          tags: string[] | null
          total_ratings: number | null
          updated_at: string | null
          video_url: string | null
          weight_kg: number | null
        }
        Insert: {
          approval_status?: string
          base_price: number
          brand?: string | null
          capacity?: string | null
          care_instructions?: string | null
          category?: string | null
          country_of_origin?: string | null
          created_at?: string | null
          delivery_time_max?: number | null
          delivery_time_min?: number | null
          description?: string | null
          dimensions?: Json | null
          embedding?: string | null
          expiry_date?: string | null
          fragile?: boolean | null
          fssai_license?: string | null
          fts?: unknown
          gst_percentage?: number | null
          gst_rate?: number | null
          has_personalization?: boolean | null
          hsn_code?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_perishable?: boolean | null
          is_promoted?: boolean | null
          is_sponsored?: boolean | null
          low_stock_threshold?: number | null
          manufacturer_info?: string | null
          material?: string | null
          max_change_requests?: number | null
          mrp?: number | null
          name: string
          net_weight?: string | null
          packaging_type?: string | null
          partner_id: string
          personalization_fee?: number | null
          personalization_options?: Json | null
          personalization_schema?: Json | null
          preview_time_minutes?: number | null
          production_hours?: number | null
          production_time_minutes?: number | null
          promoted_rank?: number | null
          promotion_rank?: number | null
          rating?: number | null
          return_eligible?: boolean | null
          return_policy?: string | null
          return_policy_type?: string | null
          shelf_life_hours?: number | null
          slug: string
          specifications?: Json | null
          sponsorship_budget?: number | null
          sponsorship_spent?: number | null
          stock_quantity?: number | null
          stock_status?: string | null
          tags?: string[] | null
          total_ratings?: number | null
          updated_at?: string | null
          video_url?: string | null
          weight_kg?: number | null
        }
        Update: {
          approval_status?: string
          base_price?: number
          brand?: string | null
          capacity?: string | null
          care_instructions?: string | null
          category?: string | null
          country_of_origin?: string | null
          created_at?: string | null
          delivery_time_max?: number | null
          delivery_time_min?: number | null
          description?: string | null
          dimensions?: Json | null
          embedding?: string | null
          expiry_date?: string | null
          fragile?: boolean | null
          fssai_license?: string | null
          fts?: unknown
          gst_percentage?: number | null
          gst_rate?: number | null
          has_personalization?: boolean | null
          hsn_code?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_perishable?: boolean | null
          is_promoted?: boolean | null
          is_sponsored?: boolean | null
          low_stock_threshold?: number | null
          manufacturer_info?: string | null
          material?: string | null
          max_change_requests?: number | null
          mrp?: number | null
          name?: string
          net_weight?: string | null
          packaging_type?: string | null
          partner_id?: string
          personalization_fee?: number | null
          personalization_options?: Json | null
          personalization_schema?: Json | null
          preview_time_minutes?: number | null
          production_hours?: number | null
          production_time_minutes?: number | null
          promoted_rank?: number | null
          promotion_rank?: number | null
          rating?: number | null
          return_eligible?: boolean | null
          return_policy?: string | null
          return_policy_type?: string | null
          shelf_life_hours?: number | null
          slug?: string
          specifications?: Json | null
          sponsorship_budget?: number | null
          sponsorship_spent?: number | null
          stock_quantity?: number | null
          stock_status?: string | null
          tags?: string[] | null
          total_ratings?: number | null
          updated_at?: string | null
          video_url?: string | null
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_vendor_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_vendor_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "v_active_cart_detailed"
            referencedColumns: ["partner_id"]
          },
          {
            foreignKeyName: "products_vendor_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "v_partner_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_vendor_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "v_partners_detailed"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string | null
          gst_percentage: number | null
          height_cm: number | null
          hsn_code: string | null
          id: string
          is_personalized: boolean | null
          item_id: string
          item_image_url: string | null
          item_name: string
          length_cm: number | null
          liability_shifted_at: string | null
          order_id: string
          personalization_config: Json | null
          personalization_details: Json | null
          personalization_schema: Json | null
          quantity: number
          selected_addons: Json | null
          selected_variant_id: string | null
          selected_variant_options: Json | null
          status: string | null
          total_price: number
          unit_price: number
          weight_kg: number | null
          width_cm: number | null
        }
        Insert: {
          created_at?: string | null
          gst_percentage?: number | null
          height_cm?: number | null
          hsn_code?: string | null
          id?: string
          is_personalized?: boolean | null
          item_id: string
          item_image_url?: string | null
          item_name: string
          length_cm?: number | null
          liability_shifted_at?: string | null
          order_id: string
          personalization_config?: Json | null
          personalization_details?: Json | null
          personalization_schema?: Json | null
          quantity: number
          selected_addons?: Json | null
          selected_variant_id?: string | null
          selected_variant_options?: Json | null
          status?: string | null
          total_price: number
          unit_price: number
          weight_kg?: number | null
          width_cm?: number | null
        }
        Update: {
          created_at?: string | null
          gst_percentage?: number | null
          height_cm?: number | null
          hsn_code?: string | null
          id?: string
          is_personalized?: boolean | null
          item_id?: string
          item_image_url?: string | null
          item_name?: string
          length_cm?: number | null
          liability_shifted_at?: string | null
          order_id?: string
          personalization_config?: Json | null
          personalization_details?: Json | null
          personalization_schema?: Json | null
          quantity?: number
          selected_addons?: Json | null
          selected_variant_id?: string | null
          selected_variant_options?: Json | null
          status?: string | null
          total_price?: number
          unit_price?: number
          weight_kg?: number | null
          width_cm?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "v_order_tracking"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "v_item_listings_search"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "v_trending_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_selected_variant_id_fkey"
            columns: ["selected_variant_id"]
            isOneToOne: false
            referencedRelation: "variants"
            referencedColumns: ["id"]
          },
        ]
      }
      order_personalization: {
        Row: {
          approved_at: string | null
          customer_feedback: string | null
          instructions: string | null
          item_index: number
          max_revisions: number
          order_id: string
          order_item_id: string | null
          partner_notes: string | null
          preview_uploaded_at: string | null
          preview_url: string | null
          preview_version: number | null
          revision_count: number | null
          status: string | null
          submitted_at: string | null
          text_input: string | null
          uploaded_files: string[] | null
        }
        Insert: {
          approved_at?: string | null
          customer_feedback?: string | null
          instructions?: string | null
          item_index?: number
          max_revisions?: number
          order_id: string
          order_item_id?: string | null
          partner_notes?: string | null
          preview_uploaded_at?: string | null
          preview_url?: string | null
          preview_version?: number | null
          revision_count?: number | null
          status?: string | null
          submitted_at?: string | null
          text_input?: string | null
          uploaded_files?: string[] | null
        }
        Update: {
          approved_at?: string | null
          customer_feedback?: string | null
          instructions?: string | null
          item_index?: number
          max_revisions?: number
          order_id?: string
          order_item_id?: string | null
          partner_notes?: string | null
          preview_uploaded_at?: string | null
          preview_url?: string | null
          preview_version?: number | null
          revision_count?: number | null
          status?: string | null
          submitted_at?: string | null
          text_input?: string | null
          uploaded_files?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "order_personalization_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_personalization_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "v_order_tracking"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_personalization_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: true
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_history: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          order_id: string | null
          title: string | null
          type: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          order_id?: string | null
          title?: string | null
          type?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          order_id?: string | null
          title?: string | null
          type?: string | null
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
            referencedRelation: "v_order_tracking"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          accept_deadline: string | null
          accepted_at: string | null
          addon_ids: Json | null
          address_id: string | null
          approved_at: string | null
          awb_number: string | null
          billing_address: Json | null
          cancellation_reason: string | null
          cancelled_by: string | null
          cashback_amount: number | null
          cashback_credited: boolean | null
          change_request_count: number | null
          commission_amount: number | null
          courier_partner: string | null
          created_at: string | null
          delivered_at: string | null
          delivery_address: Json | null
          delivery_fee: number | null
          delivery_instructions: string | null
          design_deadline_at: string | null
          details_submitted_at: string | null
          discount: number | null
          dispatched_at: string | null
          distance_km: number | null
          estimate_downloaded: boolean | null
          expected_delivery_date: string | null
          gst: number | null
          gstin: string | null
          gstin_verified: boolean | null
          has_personalization: boolean | null
          id: string
          in_production_at: string | null
          input_received_at: string | null
          max_change_requests: number | null
          net_settlement_amount: number | null
          order_number: string
          packed_at: string | null
          paid_at: string | null
          partner_id: string
          payment_id: string | null
          payment_method: string | null
          payment_status: string | null
          payout_id: string | null
          payout_status: string | null
          personalization_charges: number | null
          personalization_input: Json | null
          personalization_status: string | null
          placed_at: string | null
          platform_fee: number | null
          preview_ready_at: string | null
          preview_status: string | null
          preview_uploaded_at: string | null
          price_locked_until: string | null
          production_started_at: string | null
          razorpay_order_id: string | null
          refunded_amount: number | null
          return_deadline: string | null
          return_status: string | null
          status: Database["public"]["Enums"]["order_status"]
          subtotal: number
          tax_amount: number | null
          total: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          accept_deadline?: string | null
          accepted_at?: string | null
          addon_ids?: Json | null
          address_id?: string | null
          approved_at?: string | null
          awb_number?: string | null
          billing_address?: Json | null
          cancellation_reason?: string | null
          cancelled_by?: string | null
          cashback_amount?: number | null
          cashback_credited?: boolean | null
          change_request_count?: number | null
          commission_amount?: number | null
          courier_partner?: string | null
          created_at?: string | null
          delivered_at?: string | null
          delivery_address?: Json | null
          delivery_fee?: number | null
          delivery_instructions?: string | null
          design_deadline_at?: string | null
          details_submitted_at?: string | null
          discount?: number | null
          dispatched_at?: string | null
          distance_km?: number | null
          estimate_downloaded?: boolean | null
          expected_delivery_date?: string | null
          gst?: number | null
          gstin?: string | null
          gstin_verified?: boolean | null
          has_personalization?: boolean | null
          id?: string
          in_production_at?: string | null
          input_received_at?: string | null
          max_change_requests?: number | null
          net_settlement_amount?: number | null
          order_number: string
          packed_at?: string | null
          paid_at?: string | null
          partner_id: string
          payment_id?: string | null
          payment_method?: string | null
          payment_status?: string | null
          payout_id?: string | null
          payout_status?: string | null
          personalization_charges?: number | null
          personalization_input?: Json | null
          personalization_status?: string | null
          placed_at?: string | null
          platform_fee?: number | null
          preview_ready_at?: string | null
          preview_status?: string | null
          preview_uploaded_at?: string | null
          price_locked_until?: string | null
          production_started_at?: string | null
          razorpay_order_id?: string | null
          refunded_amount?: number | null
          return_deadline?: string | null
          return_status?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          subtotal: number
          tax_amount?: number | null
          total: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          accept_deadline?: string | null
          accepted_at?: string | null
          addon_ids?: Json | null
          address_id?: string | null
          approved_at?: string | null
          awb_number?: string | null
          billing_address?: Json | null
          cancellation_reason?: string | null
          cancelled_by?: string | null
          cashback_amount?: number | null
          cashback_credited?: boolean | null
          change_request_count?: number | null
          commission_amount?: number | null
          courier_partner?: string | null
          created_at?: string | null
          delivered_at?: string | null
          delivery_address?: Json | null
          delivery_fee?: number | null
          delivery_instructions?: string | null
          design_deadline_at?: string | null
          details_submitted_at?: string | null
          discount?: number | null
          dispatched_at?: string | null
          distance_km?: number | null
          estimate_downloaded?: boolean | null
          expected_delivery_date?: string | null
          gst?: number | null
          gstin?: string | null
          gstin_verified?: boolean | null
          has_personalization?: boolean | null
          id?: string
          in_production_at?: string | null
          input_received_at?: string | null
          max_change_requests?: number | null
          net_settlement_amount?: number | null
          order_number?: string
          packed_at?: string | null
          paid_at?: string | null
          partner_id?: string
          payment_id?: string | null
          payment_method?: string | null
          payment_status?: string | null
          payout_id?: string | null
          payout_status?: string | null
          personalization_charges?: number | null
          personalization_input?: Json | null
          personalization_status?: string | null
          placed_at?: string | null
          platform_fee?: number | null
          preview_ready_at?: string | null
          preview_status?: string | null
          preview_uploaded_at?: string | null
          price_locked_until?: string | null
          production_started_at?: string | null
          razorpay_order_id?: string | null
          refunded_amount?: number | null
          return_deadline?: string | null
          return_status?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number
          tax_amount?: number | null
          total?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_address_id_fkey"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_payout_id_fkey"
            columns: ["payout_id"]
            isOneToOne: false
            referencedRelation: "partner_payouts"
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
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_vendor_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "v_active_cart_detailed"
            referencedColumns: ["partner_id"]
          },
          {
            foreignKeyName: "orders_vendor_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "v_partner_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_vendor_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "v_partners_detailed"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_delivery_zones: {
        Row: {
          created_at: string | null
          delivery_fee: number | null
          estimated_days: number | null
          id: string
          is_active: boolean | null
          partner_id: string
          zone_type: string
          zone_value: string | null
        }
        Insert: {
          created_at?: string | null
          delivery_fee?: number | null
          estimated_days?: number | null
          id?: string
          is_active?: boolean | null
          partner_id: string
          zone_type: string
          zone_value?: string | null
        }
        Update: {
          created_at?: string | null
          delivery_fee?: number | null
          estimated_days?: number | null
          id?: string
          is_active?: boolean | null
          partner_id?: string
          zone_type?: string
          zone_value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "store_delivery_zones_store_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "store_delivery_zones_store_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "v_active_cart_detailed"
            referencedColumns: ["partner_id"]
          },
          {
            foreignKeyName: "store_delivery_zones_store_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "v_partner_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "store_delivery_zones_store_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "v_partners_detailed"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_payouts: {
        Row: {
          commission_amount: number
          created_at: string | null
          failure_reason: string | null
          id: string
          mode: string | null
          notes: Json | null
          order_ids: string[]
          partner_id: string | null
          payout_amount: number
          processed_at: string | null
          razorpay_fees: number | null
          razorpay_fund_account_id: string
          razorpay_transfer_id: string
          status: string
          total_amount: number
          updated_at: string | null
          utr: string | null
        }
        Insert: {
          commission_amount: number
          created_at?: string | null
          failure_reason?: string | null
          id?: string
          mode?: string | null
          notes?: Json | null
          order_ids: string[]
          partner_id?: string | null
          payout_amount: number
          processed_at?: string | null
          razorpay_fees?: number | null
          razorpay_fund_account_id: string
          razorpay_transfer_id: string
          status?: string
          total_amount: number
          updated_at?: string | null
          utr?: string | null
        }
        Update: {
          commission_amount?: number
          created_at?: string | null
          failure_reason?: string | null
          id?: string
          mode?: string | null
          notes?: Json | null
          order_ids?: string[]
          partner_id?: string | null
          payout_amount?: number
          processed_at?: string | null
          razorpay_fees?: number | null
          razorpay_fund_account_id?: string
          razorpay_transfer_id?: string
          status?: string
          total_amount?: number
          updated_at?: string | null
          utr?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_payouts_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_payouts_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "v_active_cart_detailed"
            referencedColumns: ["partner_id"]
          },
          {
            foreignKeyName: "partner_payouts_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "v_partner_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_payouts_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "v_partners_detailed"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          order_id: string
          partner_id: string
          rating: number
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          order_id: string
          partner_id: string
          rating: number
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          order_id?: string
          partner_id?: string
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "v_order_tracking"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_reviews_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_reviews_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "v_active_cart_detailed"
            referencedColumns: ["partner_id"]
          },
          {
            foreignKeyName: "partner_reviews_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "v_partner_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_reviews_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "v_partners_detailed"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_users: {
        Row: {
          created_at: string | null
          id: string
          partner_id: string | null
          role: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          partner_id?: string | null
          role?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          partner_id?: string | null
          role?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_users_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_users_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "v_active_cart_detailed"
            referencedColumns: ["partner_id"]
          },
          {
            foreignKeyName: "partner_users_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "v_partner_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_users_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "v_partners_detailed"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          agreed_to_contract: boolean | null
          avg_prep_time_mins: number | null
          badge: string | null
          bank_details: Json | null
          base_delivery_charge: number | null
          business_name: string | null
          business_type: string | null
          city: string | null
          closing_time: string | null
          commission_percentage: number | null
          created_at: string | null
          delivery_fee: number | null
          description: string | null
          email: string | null
          fixed_packaging_charge: number | null
          fssai_license: string | null
          fts: unknown
          gstin: string | null
          has_outlet: boolean | null
          id: string
          idfy_verification_id: string | null
          image_url: string | null
          is_active: boolean | null
          is_online: boolean | null
          is_promoted: boolean | null
          kyc_status: string | null
          latitude: number | null
          location: unknown
          longitude: number | null
          minimum_order_amount: number | null
          name: string
          onboarding_fee_paid: boolean | null
          onboarding_status: string | null
          opening_time: string | null
          outlet_type: string | null
          packaging_charge_type: string | null
          pan_number: string | null
          partner_email: string | null
          partner_external_id: string | null
          partner_id: string | null
          partner_type: string | null
          payout_contact_id: string | null
          payout_fund_account_id: string | null
          personalization_commission_percentage: number | null
          pincode: string | null
          prep_hours: number | null
          promotion_rank: number | null
          rating: number | null
          razorpay_account_id: string | null
          registered_name: string | null
          response_time_hours: number | null
          serviceability_radius_km: number | null
          serviceable_pincodes: string[] | null
          settlement_days: number | null
          slug: string
          state: string | null
          total_orders: number | null
          total_ratings: number | null
          updated_at: string | null
          vendor_tier: string | null
          whatsapp_number: string | null
          whatsapp_phoneNumber: number | null
          working_days: string[] | null
        }
        Insert: {
          agreed_to_contract?: boolean | null
          avg_prep_time_mins?: number | null
          badge?: string | null
          bank_details?: Json | null
          base_delivery_charge?: number | null
          business_name?: string | null
          business_type?: string | null
          city?: string | null
          closing_time?: string | null
          commission_percentage?: number | null
          created_at?: string | null
          delivery_fee?: number | null
          description?: string | null
          email?: string | null
          fixed_packaging_charge?: number | null
          fssai_license?: string | null
          fts?: unknown
          gstin?: string | null
          has_outlet?: boolean | null
          id?: string
          idfy_verification_id?: string | null
          image_url?: string | null
          is_active?: boolean | null
          is_online?: boolean | null
          is_promoted?: boolean | null
          kyc_status?: string | null
          latitude?: number | null
          location?: unknown
          longitude?: number | null
          minimum_order_amount?: number | null
          name: string
          onboarding_fee_paid?: boolean | null
          onboarding_status?: string | null
          opening_time?: string | null
          outlet_type?: string | null
          packaging_charge_type?: string | null
          pan_number?: string | null
          partner_email?: string | null
          partner_external_id?: string | null
          partner_id?: string | null
          partner_type?: string | null
          payout_contact_id?: string | null
          payout_fund_account_id?: string | null
          personalization_commission_percentage?: number | null
          pincode?: string | null
          prep_hours?: number | null
          promotion_rank?: number | null
          rating?: number | null
          razorpay_account_id?: string | null
          registered_name?: string | null
          response_time_hours?: number | null
          serviceability_radius_km?: number | null
          serviceable_pincodes?: string[] | null
          settlement_days?: number | null
          slug: string
          state?: string | null
          total_orders?: number | null
          total_ratings?: number | null
          updated_at?: string | null
          vendor_tier?: string | null
          whatsapp_number?: string | null
          whatsapp_phoneNumber?: number | null
          working_days?: string[] | null
        }
        Update: {
          agreed_to_contract?: boolean | null
          avg_prep_time_mins?: number | null
          badge?: string | null
          bank_details?: Json | null
          base_delivery_charge?: number | null
          business_name?: string | null
          business_type?: string | null
          city?: string | null
          closing_time?: string | null
          commission_percentage?: number | null
          created_at?: string | null
          delivery_fee?: number | null
          description?: string | null
          email?: string | null
          fixed_packaging_charge?: number | null
          fssai_license?: string | null
          fts?: unknown
          gstin?: string | null
          has_outlet?: boolean | null
          id?: string
          idfy_verification_id?: string | null
          image_url?: string | null
          is_active?: boolean | null
          is_online?: boolean | null
          is_promoted?: boolean | null
          kyc_status?: string | null
          latitude?: number | null
          location?: unknown
          longitude?: number | null
          minimum_order_amount?: number | null
          name?: string
          onboarding_fee_paid?: boolean | null
          onboarding_status?: string | null
          opening_time?: string | null
          outlet_type?: string | null
          packaging_charge_type?: string | null
          pan_number?: string | null
          partner_email?: string | null
          partner_external_id?: string | null
          partner_id?: string | null
          partner_type?: string | null
          payout_contact_id?: string | null
          payout_fund_account_id?: string | null
          personalization_commission_percentage?: number | null
          pincode?: string | null
          prep_hours?: number | null
          promotion_rank?: number | null
          rating?: number | null
          razorpay_account_id?: string | null
          registered_name?: string | null
          response_time_hours?: number | null
          serviceability_radius_km?: number | null
          serviceable_pincodes?: string[] | null
          settlement_days?: number | null
          slug?: string
          state?: string | null
          total_orders?: number | null
          total_ratings?: number | null
          updated_at?: string | null
          vendor_tier?: string | null
          whatsapp_number?: string | null
          whatsapp_phoneNumber?: number | null
          working_days?: string[] | null
        }
        Relationships: []
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
      returns: {
        Row: {
          admin_notes: string | null
          created_at: string | null
          description: string | null
          id: string
          images: string[] | null
          order_id: string
          order_item_id: string | null
          processed_at: string | null
          reason: string
          refund_amount: number | null
          return_delivery_fee: number | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          order_id: string
          order_item_id?: string | null
          processed_at?: string | null
          reason: string
          refund_amount?: number | null
          return_delivery_fee?: number | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          order_id?: string
          order_item_id?: string | null
          processed_at?: string | null
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
            referencedRelation: "v_order_tracking"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "returns_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
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
      serviceable_pincodes: {
        Row: {
          created_at: string | null
          estimated_delivery_days: number | null
          id: string
          is_active: boolean | null
          pincode: string
        }
        Insert: {
          created_at?: string | null
          estimated_delivery_days?: number | null
          id?: string
          is_active?: boolean | null
          pincode: string
        }
        Update: {
          created_at?: string | null
          estimated_delivery_days?: number | null
          id?: string
          is_active?: boolean | null
          pincode?: string
        }
        Relationships: []
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
      stock_reservations: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          item_id: string | null
          payment_intent_id: string | null
          quantity: number
          user_id: string | null
          variant_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string
          id?: string
          item_id?: string | null
          payment_intent_id?: string | null
          quantity: number
          user_id?: string | null
          variant_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          item_id?: string | null
          payment_intent_id?: string | null
          quantity?: number
          user_id?: string | null
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_reservations_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_reservations_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "v_item_listings_search"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_reservations_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "v_trending_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_reservations_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "variants"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          is_admin: boolean | null
          phone: string | null
          role: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          is_admin?: boolean | null
          phone?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_admin?: boolean | null
          phone?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      variants: {
        Row: {
          attributes: Json | null
          created_at: string | null
          id: string
          images: string[] | null
          is_active: boolean | null
          item_id: string | null
          mrp: number | null
          name: string | null
          price: number | null
          sku: string | null
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
          item_id?: string | null
          mrp?: number | null
          name?: string | null
          price?: number | null
          sku?: string | null
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
          item_id?: string | null
          mrp?: number | null
          name?: string | null
          price?: number | null
          sku?: string | null
          stock_quantity?: number | null
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "variants_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "variants_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "v_item_listings_search"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "variants_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "v_trending_items"
            referencedColumns: ["id"]
          },
        ]
      }
      wyshkit_money: {
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
      wyshkit_money_transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          order_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          order_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          order_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wyshkit_money_transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wyshkit_money_transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "v_order_tracking"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wyshkit_money_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      admin_dashboard_stats: {
        Row: {
          pending_orders: number | null
          total_orders: number | null
          total_partners: number | null
          total_revenue: number | null
          total_users: number | null
        }
        Relationships: []
      }
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
          created_at: string | null
          id: string | null
          item_id: string | null
          item_image: string | null
          item_is_active: boolean | null
          item_name: string | null
          line_total: number | null
          partner_city: string | null
          partner_id: string | null
          partner_latitude: number | null
          partner_longitude: number | null
          partner_name: string | null
          partner_prep_hours: number | null
          personalization: Json | null
          personalization_fee: number | null
          personalization_options: Json | null
          quantity: number | null
          selected_addons: Json | null
          session_id: string | null
          updated_at: string | null
          user_id: string | null
          variant_id: string | null
          variant_name: string | null
          variant_price: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "v_item_listings_search"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "v_trending_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_selected_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "variants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      v_active_cart_totals: {
        Row: {
          cart_owner_id: string | null
          pricing: Json | null
          session_id: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      v_item_listings_search: {
        Row: {
          base_price: number | null
          category: string | null
          created_at: string | null
          description: string | null
          elite_signals: Json | null
          fts_vector: unknown
          has_personalization: boolean | null
          id: string | null
          images: string[] | null
          is_active: boolean | null
          is_perishable: boolean | null
          mrp: number | null
          name: string | null
          partner_id: string | null
          partner_image: string | null
          partner_name: string | null
          partner_slug: string | null
          personalization_options: Json | null
          rating: number | null
          return_eligible: boolean | null
          shelf_life_hours: number | null
          slug: string | null
          stock_quantity: number | null
          stock_status: string | null
          tags: string[] | null
          total_ratings: number | null
          updated_at: string | null
          weight_kg: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_vendor_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_vendor_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "v_active_cart_detailed"
            referencedColumns: ["partner_id"]
          },
          {
            foreignKeyName: "products_vendor_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "v_partner_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_vendor_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "v_partners_detailed"
            referencedColumns: ["id"]
          },
        ]
      }
      v_order_tracking: {
        Row: {
          approved_at: string | null
          delivered_at: string | null
          dispatched_at: string | null
          has_personalization: boolean | null
          id: string | null
          in_production_at: string | null
          input_received_at: string | null
          order_number: string | null
          packed_at: string | null
          paid_at: string | null
          partner_business_name: string | null
          partner_id: string | null
          partner_name: string | null
          personalization_status: string | null
          placed_at: string | null
          preview_ready_at: string | null
          status: Database["public"]["Enums"]["order_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_vendor_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_vendor_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "v_active_cart_detailed"
            referencedColumns: ["partner_id"]
          },
          {
            foreignKeyName: "orders_vendor_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "v_partner_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_vendor_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "v_partners_detailed"
            referencedColumns: ["id"]
          },
        ]
      }
      v_partner_listings: {
        Row: {
          city: string | null
          delivery_fee: number | null
          elite_signals: Json | null
          id: string | null
          image_url: string | null
          is_active: boolean | null
          is_online: boolean | null
          name: string | null
          prep_hours: number | null
          rating: number | null
          slug: string | null
          total_ratings: number | null
        }
        Insert: {
          city?: string | null
          delivery_fee?: number | null
          elite_signals?: never
          id?: string | null
          image_url?: string | null
          is_active?: boolean | null
          is_online?: boolean | null
          name?: string | null
          prep_hours?: number | null
          rating?: number | null
          slug?: string | null
          total_ratings?: number | null
        }
        Update: {
          city?: string | null
          delivery_fee?: number | null
          elite_signals?: never
          id?: string | null
          image_url?: string | null
          is_active?: boolean | null
          is_online?: boolean | null
          name?: string | null
          prep_hours?: number | null
          rating?: number | null
          slug?: string | null
          total_ratings?: number | null
        }
        Relationships: []
      }
      v_partners_detailed: {
        Row: {
          business_type: string | null
          city: string | null
          created_at: string | null
          description: string | null
          gstin: string | null
          id: string | null
          image_url: string | null
          is_active: boolean | null
          is_online: boolean | null
          kyc_status: string | null
          name: string | null
          pan_number: string | null
          partner_type: string | null
          pincode: string | null
          rating: number | null
          slug: string | null
          state: string | null
          total_ratings: number | null
        }
        Insert: {
          business_type?: string | null
          city?: string | null
          created_at?: string | null
          description?: string | null
          gstin?: string | null
          id?: string | null
          image_url?: string | null
          is_active?: boolean | null
          is_online?: boolean | null
          kyc_status?: string | null
          name?: string | null
          pan_number?: string | null
          partner_type?: string | null
          pincode?: string | null
          rating?: never
          slug?: string | null
          state?: string | null
          total_ratings?: never
        }
        Update: {
          business_type?: string | null
          city?: string | null
          created_at?: string | null
          description?: string | null
          gstin?: string | null
          id?: string | null
          image_url?: string | null
          is_active?: boolean | null
          is_online?: boolean | null
          kyc_status?: string | null
          name?: string | null
          pan_number?: string | null
          partner_type?: string | null
          pincode?: string | null
          rating?: never
          slug?: string | null
          state?: string | null
          total_ratings?: never
        }
        Relationships: []
      }
      v_trending_items: {
        Row: {
          base_price: number | null
          description: string | null
          elite_signals: Json | null
          has_personalization: boolean | null
          id: string | null
          images: string[] | null
          is_active: boolean | null
          mrp: number | null
          name: string | null
          partner_city: string | null
          partner_id: string | null
          partner_name: string | null
          personalization_options: Json | null
          production_hours: number | null
          rating: number | null
          recent_order_count: number | null
          slug: string | null
          total_ratings: number | null
          trending_score: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_vendor_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_vendor_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "v_active_cart_detailed"
            referencedColumns: ["partner_id"]
          },
          {
            foreignKeyName: "products_vendor_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "v_partner_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_vendor_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "v_partners_detailed"
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
      add_to_cart_atomic: {
        Args: {
          p_item_id: string
          p_personalization?: Json
          p_quantity: number
          p_selected_addons?: Json
          p_session_id?: string
          p_user_id?: string
          p_variant_id?: string
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
      calculate_order_total: {
        Args: {
          p_address_id?: string
          p_cart_items: Json
          p_coupon_code?: string
          p_delivery_fee_override?: number
          p_distance_km?: number
          p_session_id?: string
          p_use_wallet?: boolean
          p_user_id?: string
        }
        Returns: Json
      }
      calculate_return_refund: {
        Args: { p_order_id: string; p_reason: string }
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
          p_item_id: string
          p_mode?: string
          p_personalization?: Json
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
          p_item_id?: string
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
      get_home_surface: {
        Args: { p_lat?: number; p_lng?: number; p_user_id?: string }
        Returns: Json
      }
      get_nearby_items: {
        Args: {
          include_out_of_stock?: boolean
          radius_km?: number
          user_lat: number
          user_lng: number
        }
        Returns: {
          base_price: number
          distance_km: number
          has_personalization: boolean
          id: string
          images: string[]
          is_online: boolean
          name: string
          partner_id: string
          partner_name: string
          production_time_minutes: number
          rating: number
          stock_quantity: number
          stock_status: string
        }[]
      }
      get_partner_dashboard_stats: {
        Args: { p_partner_id: string }
        Returns: Json
      }
      get_partner_stats: {
        Args: { p_partner_id: string }
        Returns: {
          active_orders: number
          pending_requirements: number
          total_orders: number
          total_revenue: number
        }[]
      }
      gettransactionid: { Args: never; Returns: unknown }
      log_order_status_history: {
        Args: {
          p_description: string
          p_metadata?: Json
          p_order_id: string
          p_title: string
          p_type: string
        }
        Returns: undefined
      }
      longtransactionsenabled: { Args: never; Returns: boolean }
      merge_guest_to_user: {
        Args: { p_session_id: string; p_user_id: string }
        Returns: Json
      }
      migrate_guest_cart: {
        Args: { p_session_id: string; p_user_id: string }
        Returns: undefined
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
      place_secure_order: {
        Args: {
          p_address_id?: string
          p_coupon_code?: string
          p_delivery_instructions?: string
          p_distance_km?: number
          p_gstin?: string
          p_items: Json
          p_payment_id?: string
          p_razorpay_order_id: string
          p_session_id?: string
          p_use_wallet?: boolean
          p_user_id?: string
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
      raw_sql: { Args: { query: string }; Returns: Json }
      recalculate_order_total: {
        Args: { p_order_id: string }
        Returns: undefined
      }
      resolve_user_permissions: { Args: { p_user_id: string }; Returns: Json }
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
      transition_order: {
        Args: {
          p_new_status: Database["public"]["Enums"]["order_status"]
          p_order_id: string
        }
        Returns: Json
      }
      transition_order_status: {
        Args: { p_metadata?: Json; p_new_status: string; p_order_id: string }
        Returns: boolean
      }
      unlockrows: { Args: { "": string }; Returns: number }
      update_checkout_session: {
        Args: {
          p_applied_coupon?: string
          p_gstin?: string
          p_guest_lat?: number
          p_guest_lng?: number
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
      verify_and_update_payment: {
        Args: {
          p_new_status: string
          p_order_id: string
          p_payment_id: string
          p_payment_method: string
          p_razorpay_order_id: string
          p_requirement_status: string
          p_timeline_description: string
          p_timeline_metadata: Json
          p_timeline_title: string
          p_user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      order_status:
        | "PLACED"
        | "CONFIRMED"
        | "DETAILS_RECEIVED"
        | "PREVIEW_READY"
        | "CHANGE_REQUESTED"
        | "APPROVED"
        | "IN_PRODUCTION"
        | "PACKED"
        | "DISPATCHED"
        | "DELIVERED"
        | "CANCELLED"
        | "REFUNDED"
        | "INPUT_RECEIVED"
        | "REVISION_REQUESTED"
        | "OUT_FOR_DELIVERY"
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
      order_status: [
        "PLACED",
        "CONFIRMED",
        "DETAILS_RECEIVED",
        "PREVIEW_READY",
        "CHANGE_REQUESTED",
        "APPROVED",
        "IN_PRODUCTION",
        "PACKED",
        "DISPATCHED",
        "DELIVERED",
        "CANCELLED",
        "REFUNDED",
        "INPUT_RECEIVED",
        "REVISION_REQUESTED",
        "OUT_FOR_DELIVERY",
      ],
    },
  },
} as const
