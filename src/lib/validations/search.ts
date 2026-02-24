import { z } from "zod";

export const searchQuerySchema = z.object({
  q: z.string().max(200).optional(),
  type: z.enum(["all", "vendors", "products"]).optional().default("all"),
  category: z.string().max(100).optional(),
  tag: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
  offset: z.coerce.number().int().nonnegative().optional().default(0),
});

export type SearchQuery = z.infer<typeof searchQuerySchema>;
