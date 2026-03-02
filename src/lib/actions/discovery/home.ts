'use server';

import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logging/logger';
import { logError } from '@/lib/utils/error-handler';
import { WyshkitProduct } from '@/lib/types/product';
import {
    WyshkitProductSchema,
} from '@/lib/validations/discovery';

// WYSHKIT 2026: Legacy Home Actions Purged
// Use getGlobalInitSurface from @/lib/actions/discovery/init instead.
