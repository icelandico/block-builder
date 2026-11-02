# AGENTS.md

Client-side Vite + React 19 + TypeScript app for planning city layouts for
Impressions Games city-builders (Zeus currently; others planned). No server —
layouts are JSON files/localStorage. See `README.md` for the phase roadmap.

## Commands

```sh
npm run dev      # Vite dev server
npm run lint     # oxlint (config: .oxlintrc.json)
npm run build    # tsc -b && vite build — this IS the typecheck; there is no separate one
```

- No test runner configured yet (Vitest and Zod arrive with roadmap phases 3–5;
  don't assume they exist). Konva + react-konva are installed since Phase 2.
- Project is currently Phase 2 (Konva board done): the remaining `src/*` stubs
  (features/place-building, save-layout, …, shared/persistence) have roadmap
  comments — keep their doc-comments intact.

## Git

- When creating branch use following convention: `{type}/{description}`. There could be following branch types:
  - feature - for new functionalities
  - fix - for fixing current functionalities, changing phrases, translations
  - docs - updating files such as README, AGENTS or other that will be created in this project
  - chore - updating libraries in packages.json, parts of code not connected with business logic, styles, application appearance
  - style - changes that regard only css, colors, layout

## Feature Sliced Design (FSD) + aliases

- Layers: `app` → `pages` → `widgets` → `features` → `entities` → `shared`.
  Imports only go downward; never import upward or skip layers.
- Use the `@app/@pages/@widgets/@features/@entities/@shared` aliases. They are
  defined in **three places** that must be kept in sync:
  `tsconfig.app.json` (types), `vite.config.ts` (runtime), and the root
  `tsconfig.json` (duplicate of app paths).
- Cross-slice imports go through a slice's public API (`index.ts`), not deep
  into its internals. State lives in `{layer}/model/*.ts` (Zustand stores);
  shadcn components in `shared/ui` are re-exported from `shared/ui/index.ts`.

## Conventions that differ from defaults

- `verbatimModuleSyntax` + `erasableSyntaxOnly` are on: type imports must be
  `import type { ... }`, no enums/namespaces — use `as const` objects.
- No router: navigation is a Zustand `useViewStore` switch in `app/model/view-store.ts`.
- Architecture rule: board/domain stores stay headless (pure data, no Konva/canvas
  deps) so canvas rendering is only a view of the state.
- Board rendering: `widgets/board` renders a Konva `Stage` with three layers
  (static grid, buildings, interaction); pan/zoom lives in `shared/camera`
  (camera store), tile-to-pixel math in `shared/konva-helpers` (`TILE`). The
  Stage fills its container (ResizeObserver) and is draggable for panning.
- Pages compose widgets via `PlannerLayout` slots (sidebar/toolbar/board) —
  widgets never import other widgets.
- Tailwind v4 is config-less (CSS-first): theme tokens/variables live in
  `src/index.css`. shadcn/ui CLI config is `components.json` (aliases → `@shared/ui`,
  utils → `@shared/lib/utils`); add new shadcn components under `src/shared/ui/`.
  A `TooltipProvider` wraps the app in `src/app/index.tsx`.
