---
description: How to add a new shadcn/ui component and wire it to the WyshKit design system
---

# Adding a shadcn/ui Component

## Before You Start

1. Check if the component already exists: `ls src/components/ui/`
2. Check if shadcn/ui has it: https://ui.shadcn.com/docs/components
3. If it exists upstream but not locally, install it. **Never build from scratch** what shadcn already provides.

## Install

```bash
// turbo
npx shadcn@latest add [component-name]
```

This installs to `src/components/ui/[component-name].tsx`. The file is fully editable — shadcn/ui is a copy-paste system, not a dependency.

## Wire to WyshKit Design System

After installing, audit the component for WyshKit compliance:

1. **Tap targets**: All interactive elements must be ≥44×44px (Fitts' Law). Check `min-h-11 min-w-11`.
2. **CSS Variables**: Use `--background`, `--foreground`, `--primary`, etc. from `globals.css`. Never hardcode colours.
3. **Dark mode**: shadcn/ui handles this via CSS variables. Don't add separate dark mode classes.
4. **Mobile first**: Default styles = mobile. Add `md:` and `lg:` breakpoints for larger screens.
5. **Haptics**: If the component is transactional (button, slider, toggle), add haptic feedback via the `useHaptic` hook.

## Component Types to WyshKit Mapping

| WyshKit Surface | shadcn Component | Notes |
|---|---|---|
| ProductSheet | `Sheet` (bottom) | Use `side="bottom"` |
| CartDrawer | `Sheet` (bottom) | Persistent cart bar triggers it |
| OTPSheet | `Sheet` (bottom) | Slides over checkout |
| CartSwitchSheet | `AlertDialog` | Two clear actions, no confirmshaming |
| LocationSheet | `Sheet` (bottom) | Address autocomplete inside |
| Bill breakdown | `Accordion` or inline | Collapsed by default |
| Variant chips | `ToggleGroup` | Single-select variants |
| Add-ons | `Checkbox` | Multiple-select |
| Personalisation toggle | `Switch` | Single toggle with price |
| Slide to Pay | Custom (not shadcn) | Horizontal slider — custom component |
| Toast errors | `Sonner` | Human-readable, never raw DB errors |

## Forbidden Patterns

- ❌ Never use `window.confirm()` or `window.alert()`. Use `AlertDialog`.
- ❌ Never use `Dialog` when `Sheet` (bottom) is more appropriate on mobile.
- ❌ Never nest sheets inside sheets (Law #4: No Surface Nesting).
- ❌ Never use `Popover` for critical information. Popovers dismiss on outside click.

## Example: Adding a Sheet

```bash
npx shadcn@latest add sheet
```

Then in your component:
```tsx
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

<Sheet open={isOpen} onOpenChange={setIsOpen}>
  <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto">
    <SheetHeader>
      <SheetTitle>Product Name</SheetTitle>
    </SheetHeader>
    {/* Content */}
  </SheetContent>
</Sheet>
```

## After Adding

// turbo
```bash
npm run lint
npm run build
```

Verify no build errors. Verify mobile layout at 375px viewport.
