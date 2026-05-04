# Design System Specification: High-End Editorial POS

## 1. Overview & Creative North Star

### Creative North Star: "The Ethereal Harvest"
This design system rejects the clunky, industrial aesthetic typical of Point of Sale (POS) software. Instead, it adopts the persona of a "High-End Editorial Greenhouse." It is a philosophy of **Soft Minimalism**—where the interface feels as fresh and organic as the produce it manages. 

We break the "template" look by prioritizing negative space (breathing room) over structural rigidity. By utilizing intentional asymmetry in product displays and a radical "no-line" policy, we move away from data-heavy tables toward an airy, curated experience. The interface should feel like a physical layer of fine vellum paper resting on a clean marble countertop—light, premium, and sophisticated.

---

## 2. Colors

The palette is rooted in botanical freshness, utilizing muted greens and "air" tones to create a sense of calm in a busy retail environment.

### The "No-Line" Rule
**Strict Mandate:** Prohibit the use of 1px solid borders for sectioning or containment. 
Boundaries must be defined through **Background Color Shifts** or **Tonal Transitions**. For example, a `surface-container-low` side panel should sit directly against a `surface` background without a stroke. Use whitespace and subtle value changes to guide the eye.

### Surface Hierarchy & Nesting
Treat the UI as a series of nested physical layers. 
- **Base Layer:** `surface` (#f8faf8)
- **Primary Content Areas:** `surface-container-low` (#f1f4f2)
- **Elevated Cards/Modals:** `surface-container-lowest` (#ffffff) for maximum "lift."
- **Recessed Areas:** `surface-container-highest` (#dde4e1) for inactive or background utility zones.

### The "Glass & Gradient" Rule
To add a signature "editorial" soul, use **Glassmorphism** for floating elements (like checkout summaries or quick-action tooltips).
- **Glass Token:** `surface` at 70% opacity with a `24px` backdrop-blur.
- **Signature Gradients:** For primary CTAs (e.g., "Complete Sale"), use a linear gradient from `primary` (#386b02) to `primary-container` (#b7f481) at a 135-degree angle. This provides a tactile, lush quality that flat color cannot replicate.

---

## 3. Typography

The typography is the voice of this system. We use **Manrope** for its geometric yet warm character, focusing exclusively on Light and Medium weights to maintain an "Ethereal" feel. **Bold weights are strictly forbidden**, even for price values.

- **Display (Large/Medium/Small):** Used for total sale amounts or hero category names. Use `Light (300)` weight. The scale is intentionally dramatic (up to `3.5rem`) to create an editorial hierarchy.
- **Headline & Title:** Use `Medium (500)` for section headers. The contrast between a large Light Display value and a smaller Medium Title creates a sophisticated, modern balance.
- **Body & Label:** Use `Light (300)` for descriptions and `Medium (500)` for functional labels to ensure legibility without adding visual "weight."

*Editorial Note: High-value currency should be displayed in `display-lg` with `Light` weight. The lack of "heaviness" in the font makes the price feel premium rather than aggressive.*

---

## 4. Elevation & Depth

We convey hierarchy through **Tonal Layering** and ambient light, never through harsh dropshadows.

- **The Layering Principle:** Depth is achieved by stacking. Place a `surface-container-lowest` (#ffffff) card atop a `surface-container` (#eaefec) background. The 2-3% shift in luminosity is sufficient for the human eye to perceive depth in a minimalist environment.
- **Ambient Shadows:** When a physical float is required (e.g., a "Product Details" popover), use a "Botanical Shadow":
    - Blur: `40px`
    - Spread: `0px`
    - Color: `on-surface` (#2d3432) at **4% opacity**. It should feel like a soft glow of light, not a shadow.
- **The "Ghost Border" Fallback:** If a container requires definition against a similar tone, use the `outline-variant` (#acb3b1) at **15% opacity**. This creates a suggestion of a boundary without closing off the layout.

---

## 5. Components

### Buttons
- **Primary:** Gradient fill (Primary to Primary-Container), `on-primary-container` text, `xl` (1.5rem) rounded corners. No border.
- **Secondary:** `surface-container-high` fill, no border.
- **Tertiary:** Transparent fill, `primary` text weight `Medium`.

### Input Fields
- **Styling:** Use `surface-container-lowest` background with a `sm` (0.25rem) "Ghost Border." 
- **States:** On focus, transition the border to `primary` (#386b02) at 40% opacity and add a subtle `4px` outer glow in the same color.

### Cards & Lists (Produce Items)
- **Constraint:** **Forbid dividers.**
- **Implementation:** Separate produce items in a list using `16px` of vertical white space. For grid views, use `surface-container-low` as a subtle backplate for the product image, allowing the `surface` background of the page to act as the "gutter."

### Freshness Chips
- **Usage:** To denote "Organic," "Local," or "Discount."
- **Style:** `secondary-container` background with `on-secondary-container` text. Use `full` (9999px) rounding for a pill shape that mimics the organic curves of fruits and vegetables.

---

## 6. Do's and Don'ts

### Do
- **DO** use generous padding. If you think there is enough whitespace, add 20% more.
- **DO** use `Light` typography weights for currency and numerical data to maintain the elegant "Visor" reference.
- **DO** use organic, high-quality imagery of produce that bleeds to the edges of containers.
- **DO** use the `xl` (1.5rem) corner radius for main containers to echo the softness of natural forms.

### Don't
- **DON'T** use #000000 for text. Always use `on-surface` (#2d3432) for a softer, more natural contrast.
- **DON'T** use 1px solid lines to separate receipt line items. Use alternating tonal shifts or simple spacing.
- **DON'T** use "Heavy" or "Black" font weights. High emphasis is achieved through scale (size), not thickness.
- **DON'T** use harsh, high-contrast shadows. If the shadow is clearly visible at a glance, it is too dark.