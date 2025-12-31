# Interactive Nail Clipping Minigame & Fixes

## Objective
Convert the passive nail clipping animation into a fully interactive minigame where the user controls scissors to trim the dog's nails. Ensure the mechanics are robust, visually clear, and easy to use.

## Implementation Details

### 1. Game State & Transition
- **Start:** Triggered by "Kynnet" button. Camera zooms in smoothly to the front paw using `leg0` position.
- **State:** `nailGameActive` flag prevents other interactions.
- **Exit:** Added a persistent "❌ Lopeta" button to ensure the user is never stuck in the minigame.

### 2. Interaction Mechanics
- **3D Cursor:** A pair of 3D scissors follows the mouse cursor.
- **Raycasting:** Mouse coordinates mapped correctly to the canvas for accurate 3D picking.
- **Visual Feedback:** Nails glow red (hover effect) when the scissors are positioned over them.
- **Clipping:** Clicking a glowing nail triggers a snip animation, reduces the nail size, and spawns a falling nail piece particle.

### 3. Visual Improvements
- **Nail Visibility:** Nails enlarged (ConeGeometry radius 0.03 -> 0.04) and positioned higher to be clearly visible against the paw.
- **Scissors Model:** Enhanced 3D model with distinct blades and red handles, oriented to point towards the paw.
- **Camera:** positioned to give a clear, top-down-forward view of the paw.

### 4. Bug Fixes
- Fixed `addBaseboards` ReferenceError that prevented game loading.
- Fixed mouse coordinate calculation relative to the canvas rather than the window.
- Fixed `endNailGame` to properly clean up event listeners and UI elements.
