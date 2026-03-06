# WyshKit 2026: DESIGN — The UI/UX Bible

> "Complexity is a bug. Density is a feature. Delight is the compound interest."

## 1. The Visual Substrate: Lean & Spatial
We move away from the "Loud" 2021 aesthetic toward the **Lean 2026** standard.

### Spatial UI (The Floating Layer)
- **Law**: UI is not a flat sheet; it is a stack of floating spatial modules.
- **Implementation**: Backgrounds stay clean and white/neutral. Interactive modules (Cart, Progress, Actions) float as **Spatial Pills** with subtle glassmorphism or solid fills.
- **Shadows**: No heavy, blurry shadows. Use sharp, multi-layered "tight" shadows or none at all.
- **Anti-Pattern (DELETED)**: Full-width sticky footers that glue themselves to the bottom.

### Bento Grid Layouts
- **Law**: Organise complexity using asymmetric, compartmentalised bento blocks.
- **Use Case**: Home feed banners, Vendor features, and Product information.
- **Philosophy**: Each bento box is an independent node of information. Grid > List.

---

## 2. Component Density & Ratios (The 2026 Metric)
Swiggy 2026 components are "Lean", not "Bulky". We optimize for the number of information nodes visible above the fold.

### The 4px High-Density Grid
- **Base Unit**: 4px. All padding, margins, and heights must be multiples of 4.
- **Standard Card Padding**: `12px` (Internal) | `16px` (External).
- **Sub-element Gap**: `4px` or `8px`. Never `16px` for internal relationships.
- **Component Height**: A standard list item or button shouldn't exceed `44px` unless it contains secondary metadata.

### Shadcn Calibration (Density Tuning)
Default Shadcn components are often too "airy". We tune them for high-density performance:
- **Radius**: Global radius is `6px` or `8px`. Avoid the `12px+` "bubble" look.
- **Buttons**: Use `size="sm"` or `size="xs"` (custom) as the default for mobile.
- **Typography**: Base body text is `13px` or `14px`. Labels are `11px` (Bold/All-caps).
- **Inputs**: Reduce `py-2` to `py-1.5`.

---

## 3. High-Density Typography & Space
We maximize information per millimeter without inducing cognitive load.

### The Density Law
- **Spacing**: Use a strict 4px grid. Standard padding is `12px` or `16px`. Never `24px` or more for internal content.
- **Typography Scale**: 
  - **Heading**: Small, bold, all-caps for labels. 
  - **Price**: The Hero. Largest element on the card.
  - **Body**: Highly legible, slightly compressed (e.g., Inter or Outfit).
- **Rule**: If there is more than `32px` of empty vertical space between two related elements, it's a wasted design opportunity.

---

## 3. Micro-Animations & Haptic Resonance
Static UI is dead. Interaction must have "Weight".

- **Haptics**: 
  - `Light` on Toggles/Chips.
  - `Medium` on "Add to Cart".
  - `Heavy` (Success) on "Slide to Pay".
- **Animations**:
  - **Spring-loaded**: All sheets slide up with a distinct "spring" physics (not linear `ease`).
  - **Transitions**: Changing a variant should "morph" the price, not just switch the text.
  - **Celebration**: Confetti on payment success. Success is an event, not just a status.

---

## 4. The "Turbo" Patterns
Mobile-first speed requires reducing the number of ocular fixations.

- **One-Trip Loading**: Use Skeletons that match the exact shape of the incoming data. No generic spinners.
- **Address Gravity UI**: The address bar is a persistent floating pill at the top. Tapping it shows a **Top-Sheet**, not a new page.
- **Button Purity**: The primary CTA is always "Slide to Pay" or "Slide to [Action]". Tapping is for selection; Sliding is for commitment.

---

## 5. Forbidden (Legacy) UI Patterns
Anything from the "Loud" era is an anti-pattern:

1.  **Banner Noise**: No persistent "SALE" or "OFFER" stickers that cover product images.
2.  **Loud Contrast**: Avoid bright primary colors for backgrounds. Use black text on white or off-white. Use the brand color for **Intent** only (e.g., the Slide button).
3.  **Nested Navigation**: Avoid "Hamburger" menus. If a user needs more than 2 taps to reach any core surface, the information architecture is too deep.
4.  **Information Overload**: No 10-line product descriptions on the sheet. 3 bullets max.

---

## 6. Zero Reinvention (DLS Atoms)
If a designer asks for a custom button style, they have failed.

- **Atoms**: `AppText`, `AppHeading`, `AppButton`, `AppSheet`.
- **Constraint**: Every screen must be built using **only** these atoms. Ad-hoc Tailwind or raw CSS is a violation of the **Law of Consistency**.
