# WyshKit 2026: PHILOSOPHY

> "Build for the neighborhood of 2026. Zero reinvention. Zero overengineering. Maximum trust."

## The North Star
WyshKit is the **Hyperlocal Product OS**. We do not own inventory; we own the **Intelligence + Identity Layer** that maps local supply to immediate demand. We are the "Swiggy Food for Products."

---

## 1. The Zero-Friction Mandate
In 2026, the cost of a user's attention is higher than the order value. Every tap is a tax.

### Address Gravity
- **Law**: The app pre-resolves the "Where" before the user asks "What".
- **Implementation**: ML-backed address correction + IP/GPS convergence. The screen says "Delivering to [Koramangala]", not "Enter Address".
- **Legacy Pattern (DELETED)**: Making users select their city or pin their location before browsing.

### Turbo Checkout (1-Tap Invisible)
- **Law**: Payment is a background task, not a foreground interruption.
- **Implementation**: 1-Tap prediction based on past behavior (Credit Card, UPI, Wallet).
- **Anti-Pattern (DELETED)**: Selecting payment methods every time. 

---

## 2. Logistics Purity: One Vendor, One Cart
We follow the Swiggy Food substrate, not the Amazon/Grocery substrate.

- **The Pattern**: 1 Order = 1 Rider = 1 Pickup = 1 Drop.
- **The Friction**: If you add items from two different vendors, the current cart IS REPLACED. We do not support multi-stop routing. It doubles ETA and rider cost.
- **VC Moat**: This ensures every order is a point-to-point race with a <45 min SLA.

---

## 3. The Identity Layer (Optionality)
Personalization is our market differentiator, but **Inventory is the prerequisite.**

- **The Rule**: Not every product is personalized. Not every user wants to personalize.
- **The Flow**: 
    1. **Layer 1**: Plain product delivery (Swiggy Food speed).
    2. **Layer 2**: Optional personalization work loop (Fiverr trust layer).
- **Architecture**: Personalization requirements are captured *after* money has changed hands (**Commitment Before Creativity**).

---

## 4. Zero Reinvention (Engineering Law)
If a problem is solved by a platform (Supabase, WareIQ, Razorpay), we do not build it.

- **Stack Purity**: We are a Thin Client on top of a Thick Kernel (Postgres/RLS).
- **Design Purity**: DLS-Atoms-Only. No ad-hoc CSS. No Tailwind hubris. If the token doesn't exist in the DLS, the design is wrong. See [DESIGN.md](./DESIGN.md) for the UI/UX laws.

---

## 5. Anti-Patterns & Dark Patterns (The "Zero Noose" Policy)
Swiggy 2026 is clean. WyshKit must be cleaner.

1. **Basket Sneaking (FORBIDDEN)**: No "suggested" items automatically added to the cart. Even if free.
2. **Confirm Shaming (FORBIDDEN)**: No "No, I don't want 40-minute delivery" buttons in the checkout flow.
3. **Noisy Hubris (FORBIDDEN)**: No persistent marketing banners or floating "Sale" stickers. The product is the hero.
4. **Forced Action (FORBIDDEN)**: No mandatory login to browse or add to cart.

---

## 6. The "Store-as-Dark-Store" Arbitrage
We turn retail real estate into high-speed fulfillment nodes.

- **The Vision**: Apple Premium Resellers, boAt zones, and professional Trophy shops are our "Dark Stores". They have the stock; we have the rails.
- **The Value**: We give organized retail the speed of Instamart and the trust of the "Preview Moat".
