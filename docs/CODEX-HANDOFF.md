# SOL10 project handoff

## State

On 29 October 2026 the supplied `hemy-sol10` concept was transferred into this project. React, Three.js, That Open Fragments, the corrected design reference, embedded fonts, and SOL10 model data were preserved. The original concept directory was left unchanged.

The application provides model navigation, selection, IFC properties, storey/category filters, sectioning, opacity, an element register, and browser-local sample work orders. Operational integrations are disconnected. This is a concept application, not a production CMMS or live telemetry service.

## Running

- `npm ci` installs locked dependencies.
- `npm run dev` starts development at http://127.0.0.1:4174.
- `npm run build` produces `dist`.
- `npm run preview` serves the production build on the same port.

The development and build scripts refresh `public/engine/worker.mjs` from the pinned Fragments package. Do not run development and preview simultaneously on port 4174.

## Constraints and gaps

- Follow AGENTS.md and the corrected design reference in this directory.
- Preserve original IFC identities and keep the source IFC read-only.
- The provided metadata indexes geometry, not verified installed assets.
- Picking geometry outside the metadata index can leave the context panel empty.
- Work orders are localStorage examples; no shared persistence, authentication, or external integration is implemented.
- The source package referenced `scripts/import-ifc.mjs` and this handoff, but neither was included. This handoff was reconstructed from the provided files. Model re-import tooling still needs to be recovered or implemented before changing the source model.
- Preserve the provided derivative and metadata until a reproducible import pipeline is available.

## Transfer verification

- npm install completed with zero reported vulnerabilities; production build passed.
- Build emits optional WebGPU/TSL export warnings from Fragments with the WebGL Three.js entry point.
- Browser verification confirmed model loading, rendered geometry, and explorer selection displaying IFC identity and property sets. No browser console errors were captured.
- SHA-256 comparison confirmed model, metadata, and design reference are unchanged from the supplied concept.
- Preview was started on port 4175 because 4174 was already occupied. Use npm run preview -- --port 4175 to reproduce.

