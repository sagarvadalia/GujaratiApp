# Design System Primitives

This folder contains Tamagui wrappers that align with the shadcn-inspired theme for the app. Prefer these components whenever you need a button, card, badge, form input, or toggle so that spacing, colors, and interaction states remain consistent across light and dark themes.

## Components

- `Button`, `IconButton`, `ToggleButton`: Semantic button variants with solid, outline, ghost, destructive, and secondary styles.
- `Card`: Surface container with optional `elevated` or `interactive` variants.
- `Badge`: Pill-shaped status label with tone variants (`default`, `primary`, `muted`, `outline`, `destructive`, `success`).
- `Input`: Text input field with focus ring + tone variants.
- `ToggleGroup`: Segmented toggle control built on the button primitives.

All components map directly to the semantic tokens defined in `constants/theme.ts`. If you need a new primitive, add it here rather than styling components inline.

