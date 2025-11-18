# 🎨 MetaWorks Brand Kit - Color Scheme Guide

**Version**: 1.0  
**Last Updated**: October 28, 2025  
**For**: Creative Team, Designers, Developers

---

## 📋 Quick Reference

**Brand Identity**: Modern, Professional, Cybersecurity-focused  
**Primary Color**: Cyan/Turquoise (representing technology and trust)  
**Style**: Dark theme with vibrant accents  
**Mood**: Professional, Secure, Innovative, Tech-forward

---

## 🎨 PRIMARY COLORS

### Cyan (Primary Brand Color)
The signature MetaWorks color - use for CTAs, highlights, and brand moments

| Format | Value |
|--------|-------|
| **HEX** | `#00AEEF` |
| **RGB** | `rgb(0, 174, 239)` |
| **HSL** | `hsl(194, 100%, 46%)` |
| **CMYK** | `C:100 M:27 Y:0 K:6` |

**Usage**: 
- Primary buttons and CTAs
- Logo accent
- Links and interactive elements
- Progress indicators
- Active states

---

### Emerald Green (Secondary/Accent)
Complementary color for gradients and success states

| Format | Value |
|--------|-------|
| **HEX** | `#10B981` |
| **RGB** | `rgb(16, 185, 129)` |
| **HSL** | `hsl(160, 84%, 39%)` |
| **CMYK** | `C:91 M:0 Y:30 K:27` |

**Usage**: 
- Gradients (paired with primary cyan)
- Success messages
- Achievement badges
- Growth indicators
- Secondary CTAs

---

## 🌈 GRADIENT COMBINATIONS

### Primary Gradient
```css
background: linear-gradient(135deg, #00AEEF 0%, #10B981 100%);
```
- **From**: Cyan (#00AEEF)
- **To**: Emerald (#10B981)
- **Direction**: 135 degrees (diagonal)

**Usage**: Hero sections, cards, buttons, premium features

### Glass Effect Gradient
```css
background: linear-gradient(135deg, rgba(0, 174, 239, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%);
backdrop-filter: blur(10px);
```

**Usage**: Overlays, modern UI cards, modals

---

## ⚫ NEUTRAL COLORS (Dark Theme)

### Background Colors

**Primary Background** (Darkest)
| Format | Value |
|--------|-------|
| **HEX** | `#0A0F14` |
| **RGB** | `rgb(10, 15, 20)` |
| **HSL** | `hsl(210, 33%, 6%)` |

**Secondary Background** (Dark Gray)
| Format | Value |
|--------|-------|
| **HEX** | `#0F1517` |
| **RGB** | `rgb(15, 21, 23)` |
| **HSL** | `hsl(195, 21%, 7%)` |

**Card Background** (Lighter Dark)
| Format | Value |
|--------|-------|
| **HEX** | `#1A1F24` |
| **RGB** | `rgb(26, 31, 36)` |
| **HSL** | `hsl(210, 16%, 12%)` |

### Text Colors

**Primary Text** (White)
| Format | Value |
|--------|-------|
| **HEX** | `#FFFFFF` |
| **RGB** | `rgb(255, 255, 255)` |
| **Opacity** | 100% for headings, 85-90% for body |

**Secondary Text** (Gray)
| Format | Value |
|--------|-------|
| **HEX** | `#9CA3AF` |
| **RGB** | `rgb(156, 163, 175)` |
| **HSL** | `hsl(220, 9%, 65%)` |

**Muted Text** (Darker Gray)
| Format | Value |
|--------|-------|
| **HEX** | `#6B7280` |
| **RGB** | `rgb(107, 114, 128)` |
| **HSL** | `hsl(220, 9%, 46%)` |

---

## 🚦 SEMANTIC COLORS

### Success (Green)
| Format | Value |
|--------|-------|
| **HEX** | `#10B981` |
| **RGB** | `rgb(16, 185, 129)` |
| **Usage** | Completed tasks, success messages, positive indicators |

### Warning (Yellow/Amber)
| Format | Value |
|--------|-------|
| **HEX** | `#F59E0B` |
| **RGB** | `rgb(245, 158, 11)` |
| **HSL** | `hsl(38, 92%, 50%)` |
| **Usage** | Warnings, pending states, attention needed |

### Error (Red)
| Format | Value |
|--------|-------|
| **HEX** | `#EF4444` |
| **RGB** | `rgb(239, 68, 68)` |
| **HSL** | `hsl(0, 84%, 60%)` |
| **Usage** | Errors, critical alerts, deletion confirmations |

### Info (Blue)
| Format | Value |
|--------|-------|
| **HEX** | `#3B82F6` |
| **RGB** | `rgb(59, 130, 246)` |
| **HSL** | `hsl(221, 91%, 60%)` |
| **Usage** | Information messages, tooltips, help text |

---

## 🎯 USAGE GUIDELINES

### Do's ✅

1. **Use Primary Cyan** for all CTAs and important actions
2. **Combine Cyan + Emerald** in gradients for premium feel
3. **Maintain 4.5:1 contrast ratio** minimum for accessibility
4. **Use white text** on dark backgrounds for readability
5. **Apply glass effects** for modern, layered UI elements

### Don'ts ❌

1. **Don't use pure black** (#000000) - use our dark grays instead
2. **Don't mix too many colors** - stick to 2-3 per section
3. **Don't use low-opacity text** below 60% - readability suffers
4. **Don't apply cyan to large areas** - use as accents
5. **Don't forget dark mode** - this is our primary theme

---

## 🖼️ COLOR PALETTE EXAMPLES

### Hero Section
```
Background: Dark gradient (#0A0F14 → #0F1517)
Heading: White (#FFFFFF)
Subheading: Light Gray (rgba(255,255,255,0.85))
CTA Button: Cyan to Emerald gradient
```

### Cards & Components
```
Card Background: #1A1F24 with 5% white overlay
Border: rgba(0, 174, 239, 0.1)
Title: White (#FFFFFF)
Body Text: #9CA3AF
Icons: Cyan (#00AEEF)
```

### Forms & Inputs
```
Input Background: rgba(255,255,255,0.05)
Input Border: rgba(255,255,255,0.1)
Input Text: White (#FFFFFF)
Placeholder: #6B7280
Focus Border: Cyan (#00AEEF)
```

---

## 📱 EXPORT FOR DESIGN TOOLS

### Figma Color Styles
```
Primary/Cyan: #00AEEF
Primary/Emerald: #10B981
Background/Dark-1: #0A0F14
Background/Dark-2: #0F1517
Background/Card: #1A1F24
Text/Primary: #FFFFFF
Text/Secondary: #9CA3AF
Text/Muted: #6B7280
Success: #10B981
Warning: #F59E0B
Error: #EF4444
Info: #3B82F6
```

### Adobe Color Swatch (.ase)
```
Cyan: 00AEEF
Emerald: 10B981
Dark-1: 0A0F14
Dark-2: 0F1517
White: FFFFFF
Gray: 9CA3AF
```

### Tailwind Config
```javascript
colors: {
  primary: '#00AEEF',
  secondary: '#10B981',
  dark: {
    100: '#1A1F24',
    200: '#0F1517',
    300: '#0A0F14',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#9CA3AF',
    muted: '#6B7280',
  }
}
```

---

## 🎨 BRAND APPLICATIONS

### Logo Colors
- Primary: Cyan (#00AEEF)
- On Dark: White (#FFFFFF)
- On Light: Dark (#0A0F14)

### Social Media
- Header Background: Dark gradient
- Accent: Cyan (#00AEEF)
- Text: White (#FFFFFF)

### Marketing Materials
- Headlines: Cyan to Emerald gradient
- Body: White on dark backgrounds
- CTAs: Solid cyan or gradient

### Email Templates
- Header: Dark (#0F1517)
- Body: White background with dark text (reversed for emails)
- Links: Cyan (#00AEEF)
- Buttons: Cyan to Emerald gradient

---

## 📄 FILE EXPORTS

Save these color palettes for your tools:

**Photoshop (.aco)**
```
RGB(0,174,239) - Cyan
RGB(16,185,129) - Emerald
RGB(10,15,20) - Dark-1
RGB(15,21,23) - Dark-2
RGB(255,255,255) - White
RGB(156,163,175) - Gray
```

**Sketch (.sketchpalette)**
```json
{
  "compatibleVersion": "2.0",
  "pluginVersion": "2.22",
  "colors": [
    "#00AEEF",
    "#10B981",
    "#0A0F14",
    "#0F1517",
    "#FFFFFF",
    "#9CA3AF"
  ]
}
```

---

## 🔗 Quick Copy Values

**Primary Palette**
```
#00AEEF  Cyan (Primary)
#10B981  Emerald (Secondary)
#0A0F14  Background Dark
#FFFFFF  Text White
#9CA3AF  Text Gray
```

**Gradient CSS**
```css
background: linear-gradient(135deg, #00AEEF 0%, #10B981 100%);
```

**Glass Effect CSS**
```css
background: rgba(15, 21, 23, 0.6);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.1);
```

---

## 👥 CONTACT

**For Brand Questions**:  
Contact: Creative Team Lead  
**For Implementation**:  
Contact: Development Team  

---

**© 2025 MetaWorks - All Rights Reserved**

*This brand kit is proprietary and confidential. Do not share outside the organization without permission.*
