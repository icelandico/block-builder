# Block Builder

A client-side web app for planning housing blocks and city layouts for
Impressions Games city-builders (Zeus, Caesar III, Pharaoh, Emperor).
MVP covers Zeus; layouts are saved as JSON files and shared without a server.

## Tech Stack

- TypeScript + Vite + React 19
- Feature Sliced Design (FSD) architecture
- Zustand — state
- Konva + react-konva — board rendering (Phase 2)
- shadcn/ui + Tailwind CSS v4 — app UI
- Zod — layout schema validation (Phase 5)
- Vitest — placement/validation logic tests

## Quick start

```sh
npm install
npm run dev      # start dev server
npm run build    # type-check + production build
npm run lint     # oxlint
npm run test     # vitest (run once); test:watch for watch mode
```

## Structure (Feature Sliced Design)

```
src/
  app/        # app layer: view navigation, providers, global root
  pages/      # pages: game chooser, planner (composition only)
  widgets/    # composed UI blocks (planner layout shell, ...)
  features/   # user interactions: place/move/select/bulldoze/rotate,
              # save-layout, load-layout, grid-resize (later phases)
  entities/   # domain: game catalog metadata, building catalogs (BuildingDef,
            # ZEUS_CATALOG), board state
  shared/     # reusable, domain-unware code: ui (shadcn), lib, camera,
              # konva-helpers, persistence
```

Layers import only downward (`app` → `pages` → `widgets` → `features` →
`entities` → `shared`), cross-slice imports only via a slice's public API
(`index.ts`).

## Roadmap

- [x] Phase 1 — Skeleton: chooser screen, planner shell, FSD folders
- [x] Phase 2 — Konva grid board: pan/zoom, grid resize
- [x] Phase 3 — Zeus building catalog (data model, `entities/building`)
- [x] Phase 4 — Placement flow: ghost preview, R-rotate, road drag-drawing, bulldoze
- [ ] Phase 5 — Save/Load/Share: versioned Zod JSON schema, localStorage autosave
- [ ] Later — Publish & browse blocks (Supabase), other games' catalogs

