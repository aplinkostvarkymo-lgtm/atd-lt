# ATD.lt — Kūrimo metodologija
*Versija 1.0 — 2026-04-18*

---

## Pagrindinis principas: ANF Framework

Vietoj to, kad aprašyti Claude ką norime gauti (ir gauti generinį AI rezultatą) —
imame komponentus, kuriuos sukūrė realūs dizaineriai, ir liepiame Claude juos sujungti ir užpildyti.

**A — Assemble** → surinkti komponentus iš 21st.dev
**N — Normalize** → suvienodinti į vieną dizaino sistemą
**F — Fill** → užpildyti Roberto realia informacija

---

## Įrankiai

| Įrankis | Rolė |
|---|---|
| Cursor | Pagrindinis kūrimo redaktorius — visi komponentai rašomi čia |
| Claude (frontend-design skill) | Garantuoja ne-generinę estetiką — jau įdiegta projekte |
| 21st.dev | Komponentų šaltinis — realių dizainerių sukurti React/HTML komponentai |
| Whisper Flow | Balso įvedimas vietoj rankinio rašymo (ypač ilgiems promptams) |

---

## Žingsnis po žingsnio

### 1. Pasiruošimas (vienkartinis)

- [ ] Cursor projekte patikrinti, kad `frontend-design` skill aktyvus
- [ ] Sukurti `/components` katalogą projekte
- [ ] Kiekvienai sekcijai sukurti atskirą `.txt` failą su 21st.dev promptu

### 2. Assemble — komponentų rinkimas

Eiti į **21st.dev**, ieškoti pagal sekcijos tipą, spausti **Copy Prompt → Claude Code**.

| Sekcija | Ko ieškoti 21st.dev |
|---|---|
| Hero | `full screen hero video parallax minimal` |
| Before/After slider | `before after image comparison slider` |
| Paslaugų kortelės | `services cards hover minimal` |
| Portfolio grid | `portfolio gallery grid filter` |
| Atsiliepimai | `testimonials reviews minimal` |
| FAQ accordion | `faq accordion minimal` |
| Kontaktų forma | `contact form minimal clean` |
| Statistikų juosta | `stats counter numbers bar` |

Kiekvienas prompt → atskiras failas:
```
/components/01-hero.txt
/components/02-services-cards.txt
/components/03-before-after.txt
/components/04-portfolio.txt
/components/05-testimonials.txt
/components/06-faq.txt
/components/07-contact.txt
/components/08-stats-bar.txt
```

Cursor prompt po surinkimo:
```
Create the ATD.lt website using all components in the /components folder, in order.
Use the frontend-design skill. Stack them vertically as one page.
```

### 3. Normalize — suvienodinimas

Po visų komponentų surinkimo — vienas normalizacijos prompt:

```
Normalize the entire page so it looks like one coherent design:

Fonts:
- Headings: Playfair Display (serif), latin-ext subset (Lithuanian: ą č ę ė į š ų ū ž)
- Body: DM Sans, latin-ext subset
- Import both from next/font/google

Colors:
- Primary green: #2D5016
- Background/cream: #F5F0E8
- Black: #1A1A1A
- White: #FFFFFF
- No purple. No generic blue.

Spacing: generous whitespace between sections (padding: 80px–120px vertical)
Animations: subtle scroll-triggered fade-in only. No aggressive animations.
Mobile: mobile-first. All sections must work on 375px width.
Images: use Next.js <Image> component everywhere.
```

### 4. Fill — turinio užpildymas

**Research prompt** (nauja Cursor sesija):
```
Review the entire ATD.lt website. List every piece of placeholder content
that needs to be replaced with real business information.
```

**Fill prompt** su Roberto duomenimis:
```
Fill the entire website with real content for ATD — Aplinkos Tvarkymas:

Business:
- Owner: Robertas Česynas
- Phone: +370 657 85096
- Email: Robertas@atd.lt
- Location: Vilnius, Lithuania
- Service area: Vilnius ir Vilniaus rajonas
- Founded: 2012 (12+ metų patirtis)
- Projects completed: 170+
- Facebook followers: 3000+

Services + prices:
- Vejos įrengimas: nuo 8 €/m² (ruloninė), nuo 4 €/m² (sėjama)
- Trinkelių klojimas: 25–45 €/m²
- Apželdinimas pagal projektą: individualus skaičiavimas
- Tvenkinių kasimas: pagal matmenis
- Konsultacija ir apžiūra: nemokama

Target audience:
- Primary (70%): private homeowners, women 35–55, Vilnius suburbs
- Secondary (30%): property developers, architects, project managers

Hero H1: "Aplinkos tvarkymas Vilniuje — nuo eskizo iki rezultato"
Hero subheadline: "Veja, apželdinimas, trinkelės. Dirbame su projektine dokumentacija."
Hero CTA 1: "Gauti preliminarią kainą"
Hero CTA 2: "Žiūrėti darbus"
```

---

## Ko NEDARYTI

- **Nenaudoti Level 1 (simple prompting)** kaip pagrindinio metodo — garantuoja purpurinę generinę estetiką
- **Nekurti komponentų be 21st.dev šaltinio** pirmam puslapiui — Claude sukurs generinį rezultatą
- **Nepraleisti Normalize žingsnio** — be jo komponentai iš skirtingų šaltinių atrodys nesuderinti

---

## Papildomi resursai

- Dizaino referentai: `konkurentu-analitika.md`
- Next.js setup ir deployment: `nextjs-vercel-skill.md`
- LLM optimizavimas: `llms-aeo-skill.md`
- Pilnas projekto planas: `ATD-remake.md`
