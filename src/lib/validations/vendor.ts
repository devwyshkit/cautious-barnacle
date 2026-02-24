import { z } from "zod";

export const PartnerRegistrationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters").regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
  city: z.string().min(2, "City is required"),
  pincode: z.string().length(6, "Pincode must be 6 digits").regex(/^\d+$/, "Pincode must be numeric"),
});

export const PartnerUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  imageUrl: z.string().url().optional().nullable(),
  isOnline: z.boolean().optional(),
  prepHours: z.number().min(0).optional().nullable(),
  deliveryFee: z.number().min(0).optional().nullable(),
  city: z.string().optional().nullable(),
});

export type PartnerRegistration = z.infer<typeof PartnerRegistrationSchema>;
export type PartnerUpdate = z.infer<typeof PartnerUpdateSchema>;
