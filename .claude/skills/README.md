# Skills for artist websites

Ten third-party agent skills that cover each stage of building a musician's site.
Claude Code loads them automatically in this repository (`.claude/skills/`).
Selected by install count on the skills.sh registry (LinklyAI/best-skills dataset,
snapshot 2026-11-02), filtered for web work and reviewed before adding.

`frontend-design` (anthropics/skills, #1 by installs, ~1.06M) is not here because it is
already enabled on the claude.ai account and syncs into every session.

| Stage | Skill | Source | skills.sh installs |
| --- | --- | --- | --- |
| 1. Words: bio, hero, booking CTA | `copywriting` | coreyhaines31/marketingskills | 243K |
| 2. Art direction | `design-taste-frontend` | leonxlnx/taste-skill | 716K |
| 3. Design system: palette, fonts, style | `ui-ux-pro-max` | nextlevelbuilder/ui-ux-pro-max-skill | 429K |
| 4. Polish and animation | `emil-design-eng` | emilkowalski/skills | 408K |
| 5. UI / UX / accessibility review | `web-design-guidelines` | vercel-labs/agent-skills | 813K |
| 6. Browser testing, screenshots | `webapp-testing` | anthropics/skills | 195K |
| 7. Pre-launch audit: speed, a11y, SEO, best practices | `web-quality-audit` | addyosmani/web-quality-skills | 66K (a11y) |
| 8. SEO audit | `seo-audit` | coreyhaines31/marketingskills | 244K |
| 9. Structured data: MusicGroup, MusicEvent | `schema` | coreyhaines31/marketingskills | 82K |
| 10. Conversion: booking and newsletter sign-ups | `cro` | coreyhaines31/marketingskills | 95K |

## Local changes

- `web-design-guidelines`: added `references/guidelines.md`, a local copy of Vercel's rules, used when the live fetch fails.
- `ui-ux-pro-max`: script paths changed from the plugin root to `${CLAUDE_SKILL_DIR}` (this skill's folder); test fixtures removed.
- `web-quality-audit`: its five sibling skills (performance, core-web-vitals, accessibility, seo, best-practices) are bundled under `references/*/GUIDE.md` so its links resolve.
- `evals/` folders removed (only used for developing the skills).

All are MIT licensed except `webapp-testing` (Apache 2.0, see its `LICENSE.txt`).

## Requirements

- `design-taste-frontend`: Node 22+ and Chrome/Chromium for its `draw`/`inspect` scripts; `assets.mjs` needs network access to open image archives (Openverse, Wikimedia, museums).
- `ui-ux-pro-max`: Python 3, no packages.
- `webapp-testing`: Python Playwright.
- `web-quality-audit`: `jq` for `scripts/analyze.sh`.
