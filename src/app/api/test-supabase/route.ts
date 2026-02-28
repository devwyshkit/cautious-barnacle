/**
 * Supabase Connection & Data Diagnostic
 * GET /api/test-supabase
 * Use this to verify Supabase is connected and tables have data.
 */
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const report: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    env: {},
    connection: 'unknown',
    tables: {} as Record<string, { count: number; sample?: unknown[]; error?: string }>,
    rpc: {} as Record<string, { success: boolean; error?: string; data?: unknown }>,
  };

  // 1. Check env vars (masked)
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  report.env = {
    hasUrl: !!url,
    urlPrefix: url ? `${url.slice(0, 30)}...` : null,
    hasAnonKey: !!key,
  };

  if (!url || !key) {
    report.connection = 'failed';
    report.env.missing = !url ? ['NEXT_PUBLIC_SUPABASE_URL'] : ['NEXT_PUBLIC_SUPABASE_ANON_KEY'];
    return NextResponse.json(report, { status: 500 });
  }

  try {
    const supabase = createClient(url, key);

    // 2. Test direct table queries
    const tables = ['categories', 'products', 'vendors'] as const;
    for (const table of tables) {
      try {
        const { data, error } = await supabase.from(table).select('*').limit(5);
        if (error) {
          (report.tables as Record<string, unknown>)[table] = { count: 0, error: error.message };
        } else {
          const { count } = await supabase.from(table).select('*', { count: 'exact', head: true });
          (report.tables as Record<string, unknown>)[table] = {
            count: count ?? data?.length ?? 0,
            sample: data?.slice(0, 2),
          };
        }
      } catch (e: unknown) {
        (report.tables as Record<string, unknown>)[table] = {
          count: 0,
          error: e instanceof Error ? e.message : String(e),
        };
      }
    }

    // 3. Test get_home_surface RPC (without location - typically returns empty vendors/products)
    const rpcReport: Record<string, unknown> = {};
    try {
      const { data, error } = await supabase.rpc('get_home_surface', {
        p_lat: null,
        p_lng: null,
        p_user_id: null,
        p_session_id: null,
      });
      if (error) {
        rpcReport.withoutLocation = { success: false, error: error.message };
      } else {
        const raw = Array.isArray(data) ? (data[0] ?? data) : data;
        const categories = raw?.categories ?? [];
        const vendors = raw?.vendors ?? raw?.sections_data?.vendors ?? [];
        const products = raw?.featured_products ?? raw?.sections_data?.best_sellers ?? [];
        rpcReport.withoutLocation = {
          success: true,
          categoriesCount: Array.isArray(categories) ? categories.length : 0,
          vendorsCount: Array.isArray(vendors) ? vendors.length : 0,
          productsCount: Array.isArray(products) ? products.length : 0,
        };
      }
    } catch (e: unknown) {
      rpcReport.withoutLocation = { success: false, error: e instanceof Error ? e.message : String(e) };
    }

    // 4. Test get_home_surface WITH Bengaluru coords (vendor locations are in Bengaluru)
    try {
      const { data, error } = await supabase.rpc('get_home_surface', {
        p_lat: 12.9716,
        p_lng: 77.5946,
        p_user_id: null,
        p_session_id: null,
      });
      if (error) {
        rpcReport.withBengaluru = { success: false, error: error.message };
      } else {
        const raw = Array.isArray(data) ? (data[0] ?? data) : data;
        const categories = raw?.categories ?? [];
        const vendors = raw?.vendors ?? raw?.sections_data?.vendors ?? [];
        const products = raw?.featured_products ?? raw?.sections_data?.best_sellers ?? [];
        rpcReport.withBengaluru = {
          success: true,
          categoriesCount: Array.isArray(categories) ? categories.length : 0,
          vendorsCount: Array.isArray(vendors) ? vendors.length : 0,
          productsCount: Array.isArray(products) ? products.length : 0,
        };
      }
    } catch (e: unknown) {
      rpcReport.withBengaluru = { success: false, error: e instanceof Error ? e.message : String(e) };
    }

    (report.rpc as Record<string, unknown>).get_home_surface = rpcReport;

    report.connection = 'ok';
    return NextResponse.json(report);
  } catch (e: unknown) {
    report.connection = 'failed';
    report.error = e instanceof Error ? e.message : String(e);
    return NextResponse.json(report, { status: 500 });
  }
}
