# Digital twin project guidance

- Use React, That Open Fragments and Three.js. Prefer That Open's existing loading, selection, visibility, property and BIM functions over custom equivalents.
- Treat `docs/Hemy-Solutions-Design-System-Corrected.html` as the visual authority. The final corrected tokens use Poppins and blue #1769E0 with navy #002340; earlier token definitions inside that file are overridden later.
- Use the actual SOL10 model. Do not replace it with a schematic or pretend simulated operational data came from the IFC.
- Keep original IFC files read-only. Preserve GlobalIds and the distinction between geometry elements, asset types, installed assets and external system records.
- UI maintenance records are local examples until a real authorized backend is connected. Never display invented live sensor readings or connection health.
- Keep worker and Fragments library versions matched. Run `npm run build` after source changes and verify the real viewer in a browser for model-affecting changes.
- Read `docs/CODEX-HANDOFF.md` before resuming. Do not change unrelated projects or the original reference design file.
