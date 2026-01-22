# Open Graph Image Specification

**File:** `/public/og-image.png`
**Status:** TO BE CREATED
**Priority:** HIGH (required for proper social media sharing)

---

## Specifications

**Dimensions:** 1200 x 630 pixels
**Format:** PNG (recommended) or JPG
**File Size:** <500KB (optimize for fast loading)
**Color Space:** RGB

---

## Design Requirements

### Layout

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│              [Varity Logo - Center Top]             │
│                                                     │
│                Varity App Store                     │
│         Enterprise Application Marketplace          │
│                                                     │
│           70-85% Lower Infrastructure Costs         │
│                                                     │
│  [Icons: Web3, Secure, Fast] [store.varity.so]    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Text Content

**Main Title:** "Varity App Store"
- Font: Bold, 60-72px
- Color: White or Brand Teal (#14b8a6)
- Position: Center, top third

**Subtitle:** "Enterprise Application Marketplace"
- Font: Regular, 36-40px
- Color: Light gray (#94a3b8)
- Position: Below title

**Value Prop:** "70-85% Lower Infrastructure Costs"
- Font: Semi-bold, 32-36px
- Color: Accent color or white
- Position: Center

**URL:** "store.varity.so"
- Font: Regular, 24-28px
- Color: Light gray
- Position: Bottom right

### Visual Elements

**Background:**
- Gradient: Dark blue/teal to black
- Or: Dark with subtle grid pattern
- Avoid: Pure black (doesn't look professional)

**Logo:**
- Use: `/logo/varity-logo-color.svg` or teal version
- Size: 120-150px wide
- Position: Top center or left

**Icons (Optional):**
- Web3 icon
- Security shield
- Speed/performance icon
- Position: Bottom, centered

### Brand Colors

**Primary:**
- Teal: #14b8a6 (brand-500)
- Dark: #030712 (background)
- White: #ffffff

**Accent:**
- Light teal: #5eead4 (brand-400)
- Gray: #94a3b8 (foreground-secondary)

---

## Tools to Create

### Option 1: Figma (Recommended)
1. Create 1200x630 frame
2. Add gradient background
3. Add logo and text
4. Export as PNG (2x for retina)

### Option 2: Canva
1. Use "Facebook Post" template (1200x630)
2. Customize with brand colors
3. Download as PNG

### Option 3: Code (React/HTML)
```typescript
// Use @vercel/og or similar
import { ImageResponse } from '@vercel/og';

export default async function OGImage() {
  return new ImageResponse(
    (
      <div style={{
        background: 'linear-gradient(to bottom, #0f172a, #020617)',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px',
      }}>
        <h1 style={{ fontSize: 72, color: '#14b8a6' }}>
          Varity App Store
        </h1>
        <p style={{ fontSize: 36, color: '#94a3b8' }}>
          Enterprise Application Marketplace
        </p>
        <p style={{ fontSize: 32, color: '#ffffff', marginTop: 40 }}>
          70-85% Lower Infrastructure Costs
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
```

### Option 4: Screenshot + Edit
1. Take screenshot of homepage hero
2. Crop to 1200x630
3. Add overlay with text
4. Export as PNG

---

## Testing

After creating the image, test on:

1. **Twitter Card Validator**
   - https://cards-dev.twitter.com/validator
   - Paste: https://store.varity.so
   - Verify image shows correctly

2. **LinkedIn Post Inspector**
   - https://www.linkedin.com/post-inspector/
   - Check preview

3. **Facebook Sharing Debugger**
   - https://developers.facebook.com/tools/debug/
   - Clear cache if needed

4. **Discord Preview**
   - Paste link in Discord
   - Check embed preview

5. **Slack Preview**
   - Paste link in Slack
   - Check unfurl preview

---

## Implementation

Once created, place file at:
```
/public/og-image.png
```

The metadata is already configured to reference this file:
```typescript
// /src/app/layout.tsx (already done)
openGraph: {
  images: [
    {
      url: "/og-image.png",
      width: 1200,
      height: 630,
      alt: "Varity App Store - Enterprise Application Marketplace",
    },
  ],
}
```

---

## Examples (for inspiration)

**Good OG Images:**
- Vercel: Clean, logo, value prop
- Linear: Gradient, product screenshot
- Stripe: Simple, bold typography
- GitHub: Logo, tagline, dark background

**Avoid:**
- Too much text (hard to read)
- Low contrast (invisible on dark mode)
- Tiny logo (lost on small screens)
- Generic stock photos

---

## Fallback (Temporary)

Currently using: `/logo/varity-logo-color.svg`

This works but:
- SVGs may not render on all platforms
- No context (just logo, no value prop)
- Not optimized size (1200x630)

**Action:** Create proper PNG ASAP

---

## Priority Level: HIGH

**Why:** First impression on social media, affects click-through rate

**Impact:** 2-3x higher engagement with proper OG image

**Timeline:** Should be created before public launch

---

**Status:** Awaiting design team or can be created via Canva/Figma
