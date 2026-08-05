# Townhall Immigration — website

*Guidance | Trust | New Beginnings*

Static 5-page site. No build step, no dependencies. Open `index.html` in a browser to view it.

```
Immigration Website/
  index.html          Home
  work-visas.html     Work visas (482, 186, 494) + visitor-to-work
  pr-visas.html       PR visas (189, 190, 491, 191)
  about.html          About us
  contact.html        Contact + assessment form
  favicon.ico
  assets/css/styles.css
  assets/js/main.js
  assets/img/            logo, hero and band artwork, icons
  README.md
```

---

## 1. Replace the placeholders

Every placeholder is wrapped in square brackets, so a find-and-replace across all five `.html`
files catches them. Do these first.

| Placeholder | Replace with | Appears in |
|---|---|---|
| `[PHONE]` | Display phone, e.g. `(03) 9000 0000` | all 5 pages |
| `[PHONE-E164]` | Dial format, e.g. `+61390000000` | all 5 pages |
| `[EMAIL]` | Contact email | all 5 pages |
| `[WHATSAPP-NUMBER]` | Digits only, no `+` or spaces, e.g. `61400000000` | all 5 pages |
| `[WHATSAPP DISPLAY NUMBER]` | Human-readable version | contact.html |
| `[ADDRESS LINE 1]` / `[SUBURB, STATE POSTCODE]` | Office address | all 5 pages |
| `[MARN]` | Migration agent registration number | all 5 pages |
| `[AGENT FULL NAME]` | Registered agent's name | about.html, contact.html |
| `[ABN]` | Australian Business Number | all 5 pages (disclaimer) |
| `[00]` `[000]` `[0]` | Real, substantiable stats | about.html |
| `[Client name]` / `[Occupation], [City]` | Real testimonials | index.html |
| `[Full name]` / `[Role]` | Team members | about.html |
| `[9:00am to 5:30pm AEST]` etc. | Office hours | contact.html |
| `[Station or stop, walking time]`, `[Street parking...]` | Location panel details | contact.html |
| `[URL+ENCODED+ADDRESS]` | Address for the "Get directions" link | contact.html |
| `www.townhallimmigration.com.au` | Confirm this is the real domain (used in every canonical tag) | all 5 pages |

Also replace the placeholder prose blocks in `about.html` (the founder story and the "what we will
not do" list) with the client's own words. Those two sections are what separate this from a template.

---

## 2. Connect the contact form

The form currently does nothing except show a notice. `assets/js/main.js` has a `data-enquiry-form`
handler at the bottom — **delete that block** once you wire up a real endpoint.

Easiest options, no backend required:

- **Netlify Forms** — host on Netlify, add `netlify` and `name="assessment"` to the `<form>` tag. Done.
- **Formspree** — set `action="https://formspree.io/f/XXXX"` and `method="POST"` on the `<form>`.
- **Web3Forms** — free, add a hidden `access_key` input.

Add a honeypot field or captcha. Migration enquiry forms attract heavy spam.

---

## 3. Still to add before launch

- **Privacy policy** and **terms of engagement** pages. Both are linked from every footer and
  currently point at `#`. The privacy policy is not optional — the form collects personal
  information and the consent checkbox references it.
- **A live map**, if wanted. `contact.html` currently shows an illustrated location panel with the
  address. To swap in a real interactive map, replace the `<picture>` inside `.locate` with the
  iframe shown in the comment directly above that section — the
  `maps.google.com/maps?q=ADDRESS&output=embed` format needs no API key.
- **Real photographs of the team and office.** See "On imagery" below.

---

## 4. Deploying

Any static host works. Drag the folder onto [netlify.com/drop](https://app.netlify.com/drop) for an
instant live URL, or upload the contents to `public_html` on cPanel hosting. No Node, no build.

---

## 5. Design notes

### Colour

Defined once at the top of `styles.css`. Two sources are reconciled: the navy and gold come from the
Townhall logo so the mark never clashes with its own site, while the cobalt from the reference site
is kept for interactive elements only.

| Token | Value | Source | Use |
|---|---|---|---|
| `--ink` | `#002454` | logo navy | Dark sections, headings, footer |
| `--ink-2` | `#33425C` | derived | Body text |
| `--gold` | `#B49048` | logo gold | Accents, eyebrows, pay-after-visa band |
| `--blue` | `#0047AB` | reference site | Buttons, subclass codes |
| `--blue-bright` | `#046BD2` | reference site | Links |
| `--wash` | `#F0F5FA` | reference site | Alternating section background |
| `--line` | `#D1D5DB` | reference site | Borders |

Change a value there and it updates everywhere.

Type is Source Serif 4 (headings) and Inter (body), loaded from Google Fonts. If the client wants
zero external requests, self-host both and swap the `<link>` for `@font-face` rules.

### Imagery

All artwork lives in `assets/img/`. Every band image is served as WebP at two widths with a JPEG
fallback via `<picture>`, so phones pull the smaller file. Nothing exceeds ~70 KB.

| File | Used on |
|---|---|
| `hero-a-*` | Home hero (illustrated Australia + harbour) |
| `hero-b-*` | Alternative home hero (photographic). Swap the three filenames in the `<picture>` block in `index.html` |
| `band-work-*` | Work Visas hero |
| `band-pr-*` | PR Visas hero |
| `band-about-*` | About and Contact heroes |
| `map-location-*` | Contact location panel |
| `logo-emblem-256.png` | Nav mark |
| `logo-lockup-light-600.png` | Footer lockup (navy recoloured white) |
| `logo-lockup-600.png` | Full lockup for light backgrounds, e.g. letterhead |
| `apple-touch-icon.png`, `favicon.ico`, `icon-512.png` | Browser and home-screen icons |
| `og-image.jpg` | Link previews on social and WhatsApp |

Each hero sets a `--hero-navy` custom property sampled from its own artwork's left edge, so the text
scrim blends into the image with no visible seam. **If you replace an image, resample that colour**
or a hard vertical line will appear where the gradient ends.

The repeating device is the **subclass code** — treated as a typographic object throughout, and
chained into "pathway rails" on the home, work and PR pages showing `600 → 482 → 186` and
`491 → 191`. That's the thing to preserve if the design gets edited later; it's what makes the site
legible to someone who thinks in subclass numbers.

---

## 6. Compliance — read this before publishing

This is a regulated sector in Australia. Worth having the client confirm each point:

1. **Registration must be real and displayed.** Only a registered migration agent (OMARA) or an
   Australian legal practitioner may give immigration assistance. The MARN appears in the top bar
   and footer of every page. Verify it at mara.gov.au.
2. **No outcome guarantees.** The copy deliberately never promises a grant, and the FAQ says so
   explicitly. Keep it that way, including in any testimonials added later.
3. **"Pay after visa" needs to match the client agreement.** The site says the *professional fee* is
   deferred and that government and third-party charges are not. If the client's actual terms differ,
   change the site — the fee table on `index.html#fees` and the four gold bands must match what
   people sign.
4. **Statistics must be substantiable.** The `[00]` figures on `about.html` are placeholders. An
   unverifiable success rate is exposure under Australian Consumer Law.
5. **Testimonials need written permission** from each client before publishing.
6. **Visa facts change.** Occupation lists, income thresholds, points settings and processing times
   change, sometimes mid-year. The copy avoids hard numbers for this reason, but the site still needs
   reviewing against homeaffairs.gov.au periodically. The 482 income thresholds are indexed around
   1 July each year.

Nothing on the site claims figures that will date quickly, but a registered agent should read all
five pages before they go live.

---

## 7. On imagery — no fake people

Every image on the site is either the client's own logo or generated abstract artwork: cityscapes,
landscapes, architecture, an illustrated map. **There are deliberately no photographs of people.**

Two slots are left as text placeholders rather than filled with generated faces:

- **Team photos** on `about.html`
- **Testimonial attributions** on `index.html`

Generated headshots presented as named registered migration agents, or as real clients giving
testimonials, would misrepresent who is giving regulated immigration advice and who has actually
used the service. On a MARA-regulated site that is a real exposure, not a stylistic preference. Use
genuine photographs of the actual team, and real testimonials with written permission.

If a photo of the agent is not available yet, leaving the card text-only reads better than a stock
face — it looks deliberate, whereas an obviously generic portrait signals the whole site may be
generic.
