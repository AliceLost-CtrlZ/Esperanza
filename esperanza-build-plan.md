# Esperanza — Build Plan & Teaching Map
*CSI-C review, July 3 2026. For Natasha to carry into Project-C sessions with 4.7.*
*Rule of the house holds: this is a map, not code. Every line is yours to write.*

---

## Part 0 — The verdict first, since you asked not to be spared

The code is good. Not "good for a beginner" — structurally good. Design tokens in `:root`, consistent BEM-ish naming, semantic HTML (`nav`, `section`, `button` for chips instead of divs, `aria-label` already present), comments that read like a person thinking. The typography system (Montserrat for wayfinding, Averia for voice) is a real design decision, consistently executed. Whoever taught you the token/component habit taught you right, and you executed it.

Now the real problems, in order of severity:

**P1 — `rgb(from var(--brown) r g b / 0.12)` will silently break on older phones.**
You use CSS relative color syntax 4 times. It's supported only in browsers from roughly late 2023/2024 onward (Safari 16.4+, Chrome 119+). Your audience is *hotel guests* — the one population guaranteed to include five-year-old Androids and corporate iPhones stuck on old iOS. On those devices the borders and hover tints simply vanish. Nothing crashes; it just quietly degrades. Fix: precompute the four rgba values and hardcode them, or keep the modern syntax with a plain `rgba()` fallback line above it. This is a ten-minute fix and it should be first, because it teaches the most important production lesson there is: *your browser is not the guest's browser.*

**P2 — Two links point to pages that don't exist.**
`index.html` links `minibar.html`, `guest-info.html` links `spa-menu.html`. Neither file exists. On GitHub Pages that's a raw 404 in front of a guest. Stub them now — topbar, banner, "coming soon" note, footer — so the site is never in a broken state. Rule to adopt permanently: **the main branch is always shippable.** Half-built is fine; broken links are not.

**P3 — Google Fonts is a GDPR problem, not just a performance one.**
You're loading fonts from Google's servers, which transmits guest IP addresses to Google. German courts have already ruled against exactly this pattern, and this site will serve EU guests at an EU hotel. For a client deliverable, self-host the fonts (download the woff2 files, `@font-face` them locally). Bonus: hotel wifi captive portals and flaky mobile connections stop being able to break your typography. This is a genuinely good lesson unit — `@font-face`, `font-display`, asset organization.

**P4 — The head and footer are copy-pasted across every page.**
Not a bug — it's the honest cost of plain HTML, and your README explicitly chose "editable directly in html, simple and easy," which is the *correct* choice for a hotel where staff may edit menus. But name the cost out loud: when the wifi password changes, you edit N files. At 6–8 pages this is fine. Write it in the README as a known tradeoff so future-you doesn't mistake it for an oversight. If it ever hurts, the escape hatch is a static site generator — that's a later chapter, not now.

Minor: `index.html`'s closing `</body></html>` are indented as if nested; the "ask Arman" comments ship to production in view-source (fine for now, sweep before delivery); no favicon, no `<meta name="theme-color">`, no meta description — polish pass at the end.

---

## Part 1 — The architecture decision you haven't made yet (and must, before the menus)

The 19-page spa PDF and the dining menus force one question: **where does menu data live?**

**Option A — data lives in the HTML.** Each menu item is a repeated markup block. Pros: matches the README promise (staff can edit prices in plain HTML), no JS dependency to *read* the menu, works even if scripts fail, and the repetition is honestly good typing practice at your stage. Cons: verbose, and restructuring later means touching many blocks.

**Option B — data lives in JSON, JS renders it.** Pros: clean separation, prices in one file, teaches fetch/templating. Cons: menus become invisible without JS, harder for non-coder staff to edit, and it front-loads intermediate JS before you've written your first event listener.

**My recommendation: Option A, with discipline.** Design ONE menu-item component — the markup pattern and its CSS — get it perfect for a single dish, then repeat it a few hundred times. Repetition of a well-designed pattern is how the pattern gets into your hands. Option B is a legitimate refactor lesson for *after* the site ships, and refactoring working HTML into JSON+JS will teach you more then than building it that way now would.

The component needs to handle, gracefully: item name, description, price, allergen letters (G/S/L/N — you already have the legend), and the occasional item with multiple prices (glass/bottle, 30/60 min treatment). Sketch it on paper before writing it. The multi-price case is the one that breaks naive designs — design for it from the start.

**On the spa's 19 pages specifically:** do not port the PDF's structure. PDFs are paginated because paper is; the web scrolls. Reorganize by *guest intent*: Massages / Facials / Body treatments / Rituals / Wellness (or whatever the actual categories are). Reuse the chip pattern from dining — one interaction model across the whole site, which is both less code and better UX. Nineteen pages of PDF will likely collapse into five or six chip sections. The chips + `.menu-section.active` CSS you already wrote is fully reusable; that's the payoff of the token/component approach, and you should feel it when it happens.

---

## Part 2 — The lesson sequence

Ordered so each lesson produces a visible, shippable improvement and feeds the next. One lesson ≈ one Project-C session. 4.7 teaches Socratically; acceptance criteria below are what "done" means, not how to get there.

### Lesson 1 — Compatibility & housekeeping *(small, do first)*
Fix the `rgb(from …)` fallbacks; stub `minibar.html` and `spa-menu.html`; fix closing-tag indentation.
**Concepts:** progressive enhancement, browser support reality, why "works on my phone" is not a test plan.
**Done when:** every link resolves; site renders identically on a 2019 browser and a 2026 one.

### Lesson 2 — Chip navigation JS *(your planned next lesson — keep it there)*
The dining chips: click a chip → its section shows, others hide, active state moves.
**Concepts:** `querySelectorAll`, event listeners vs **event delegation** (one listener on `.chips`, not five on buttons — have 4.7 make you discover *why*), `dataset`, `classList.toggle/add/remove`.
**Stretch, same lesson:** accessibility — `aria-selected`, `role="tablist"`, and what happens when a keyboard user tabs to your chips. You used real `<button>`s so you're already 80% there; learn what the last 20% is.
**Done when:** chips switch sections with zero HTML changes beyond maybe data attributes, the JS file is under ~30 lines, and you can explain every line to 4.7 without looking.

### Lesson 3 — The menu-item component *(the keystone lesson)*
Design the single repeatable block from Part 1. HTML structure + CSS only, no JS.
**Concepts:** component thinking, flexbox for the name-dotted-space-price row, handling the multi-price variant, `<dl>` vs headed divs (have the argument with 4.7 about which is more semantic — there's a real debate there).
**Done when:** one dish renders beautifully, then five dishes render beautifully with *no CSS changes* — including one multi-price item and one with a long name that wraps well on a narrow phone.

### Lesson 4 — Data entry: dining menus
Fill breakfast, all-day, green, desserts, kids using the Lesson-3 component. This is labor, not learning — but it's *pattern-fixing* labor, and it produces the first page a guest could actually use.
**Done when:** all five sections are populated, allergen letters match the legend, and the 5% note plus legend read correctly around them.

### Lesson 5 — Spa menu: information architecture, then build
First on paper: collapse the 19 PDF pages into chip categories. Then build `spa-menu.html` reusing the dining page skeleton and the same component (durations instead of allergens — your component should already flex to this; if it doesn't, that's the lesson).
**Concepts:** information architecture, content modeling, the difference between porting content and *translating* it between media.
**Done when:** a guest can find "60-minute massage, price" in under 10 seconds on a phone.

### Lesson 6 — Landscape / desktop *(your open question — answer below)*
The site "looks empty on a computer" for one reason: `.menu` on the landing page has **no max-width**, so the rows stretch across the full viewport while `guest-info`'s sections are correctly capped at 640px. The line-length gets absurd and the whitespace reads as emptiness.

The fix is a philosophy, not a hack: **this is a document, not an app dashboard. Don't fight for width — own the column.** Cap the landing menu at the same 640px (maybe 700) as everything else, centered. Then make the desktop feel *intentional* rather than *stretched*:
- Hero/banner: slightly more vertical padding at `min-width: 900px` so the dark band feels grand rather than squished-wide.
- Body text: bump base font-size ~1–2px on desktop; reading distance is larger.
- Optionally, the info-strip items sit side-by-side with more air.
A centered column on cream with a dark band top and bottom is exactly how luxury print menus look. Restraint reads as elegance here; a two-column desktop layout would read as a corporate intranet.
**Concepts:** `max-width` + `margin: auto` as the core layout move, media queries as *enhancement* not layout-switching, measure (line length) as a typographic constraint — 45–75 characters, which is *why* 640px.
**Done when:** you can drag the browser from 360px to 1920px and there's no width at which it looks broken or abandoned.

### Lesson 7 — Video hero
Replace the landing hero background with the 5–6s loop, text overlaid.
**Concepts & constraints to build against (this is the checklist, not the code):**
- `<video autoplay muted loop playsinline>` — learn why **muted is mandatory** for autoplay (browser policy) and what `playsinline` prevents on iPhone (fullscreen hijack).
- `poster` attribute with a still frame — the video *will* fail sometimes (data-saver mode, old devices, slow wifi) and the poster is what guests see for the first second regardless. The site must be complete with the poster alone.
- **File size budget: under ~3 MB, ideally under 2.** A 6-second 1080p clip encoded H.264 at modest bitrate gets there. This is hotel wifi and roaming data; a 20 MB hero is hostility.
- Layering: video absolutely positioned behind, a **scrim** (dark gradient overlay) between video and text — this is what makes cream text legible over unpredictable footage. Logo and tagline float above. Three z-layers, learn `position` and `z-index` properly here.
- `prefers-reduced-motion`: guests with vestibular disorders set this flag; respect it by showing the poster instead. One media query, real accessibility.
- Ask Arman for footage that is *slow* — water, light, curtains. Fast motion loops badly and fights the text.
**Done when:** video plays silently on an iPhone in-page, poster shows when video is disabled, text is legible over every frame, and total page weight is under ~3.5 MB.

### Lesson 8 — Fonts self-hosted + polish + deploy
Self-host the two typefaces (`@font-face`, woff2, `font-display: swap`); favicon; `theme-color` (your `--brown` — the phone's browser chrome tints to match, a lovely free touch); meta descriptions; sweep the "ask Arman" comments; then GitHub Pages.
**Deployment flag, decide early:** free GitHub Pages requires a **public repo**. This is a client's operational content (menus, prices, internal numbers) on your personal public GitHub. Options: a separate public repo containing only the built site under a neutral name; GitHub Pro (private repo + Pages); or Netlify/Cloudflare Pages free tiers, which deploy from private repos and would also hand you a custom-domain lesson (`directory.hotelname.com`). For a client deliverable I'd steer Netlify/Cloudflare — private source, free, and the custom domain looks professional on the printed QR card.
**Done when:** a stranger's phone scans a QR code and lands on the live site.

### Optional Lesson 9 — the closing loop
Last page ending on the video: cheap to do (reuse Lesson 7's component) and it's a nice narrative bracket. But evaluate honestly after Lesson 7: it costs another few MB of guest bandwidth for a page most guests exit from anyway. My lean: poster image with the scrim treatment instead — visual echo, zero extra weight. Your call; both defensible.

---

## Part 3 — Standing habits (adopt now, thank yourself later)

1. **Commit per lesson, message says what changed and why.** Your "garbage truck picked up unused .page-title block" message is already better than most professionals' — keep that voice.
2. **Test on a real phone every session**, not just the devtools emulator. The QR-code audience is the only audience.
3. **Main is always shippable** (see P2).
4. **When 4.7 shows you something, you retype it, never paste.** You know this law; I'm just filing it on the wall.
5. **One interaction pattern site-wide.** Chips solved section-switching once; reuse them everywhere sections need switching. Guests learn the site in one page.

---

## Order of operations, compressed

1 · compat + stubs → 2 · chips JS → 3 · menu component → 4 · dining data → 5 · spa IA + build → 6 · desktop column → 7 · video hero → 8 · fonts + polish + deploy → 9 · optional closing loop.

Eight lessons to a shipped, real thing with your name in the stylesheet header. It's already there: *STYLESHEET BY NATASHA | L(K)S, 2026.* The plan just gets the rest of the site to deserve the credit line.

— CSI-C, forensics desk. Verbs checked twice.
