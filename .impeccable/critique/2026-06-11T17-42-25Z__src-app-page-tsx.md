---
timestamp: 2026-06-11T17-42-25Z
slug: src-app-page-tsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility of System Status | 3 | Video skip ir onEnded ✓ — nėra buffering indikatoriaus |
| 2 | Match System / Real World | 3 | Lietuvių kalba ✓ — kai kas apkarpoma mobiliu |
| 3 | User Control and Freedom | 2 | Skip mygtukas ✓ — nėra navigacijos header |
| 4 | Consistency and Standards | 2 | Desktop glassmorphism vs mobile teksto juosta — skirtingi modeliai |
| 5 | Error Prevention | 2 | onError fallback ✓ — visi hotspot'ai → 404 |
| 6 | Recognition Rather Than Recall | 2 | Abstrakčios ikonos, 11px etiketės |
| 7 | Flexibility and Efficiency | 2 | Skip mygtukas ✓ — nėra klaviatūros sparčiųjų |
| 8 | Aesthetic and Minimalist Design | 3 | Hero švarus ✓ — 8 vienodo svorio hotspot'ai |
| 9 | Error Recovery | 2 | Video klaida ✓ — hotspot 404 be recovery |
| 10 | Help and Documentation | 1 | Nėra telefono, nėra navigacijos |
| **Viso** | | **22/40** | Priimtina |

## Priority Issues

- [P0] CTA mygtukai dingo iš hero teksto sekcijos
- [P1] Visi hotspot'ų nuorodos → 404
- [P1] Nėra telefono numerio hero sekcijoje
- [P1] Nėra site navigacijos (header)
- [P2] 11px hotspot etiketės — per mažos (WCAG AA)
- [P2] Mobile/desktop patirtys — skirtingi interakcijų modeliai
