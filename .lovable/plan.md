## Fix Customer Dashboard tabs alignment

**Problem:** In `src/components/customer-dashboard/ProjectTabs.tsx`, the row containing the three tabs ("Active Projects", "Completed & Closed", "All Projects") and the "Filter"/"Refresh" buttons uses `flex justify-between` with no wrapping. On narrow/medium widths the tab labels overflow or squeeze against the action buttons, and on mobile the two groups collide instead of stacking.

**Fix (presentation-only, `ProjectTabs.tsx`):**
- Make the wrapper `flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3` so tabs sit above the action buttons on mobile and align on the same row on ≥sm screens.
- Give `TabsList` `w-full sm:w-auto` and let its triggers use `flex-1 sm:flex-none` so the three tabs distribute evenly on mobile without truncation.
- Right-align the Filter/Refresh group on mobile with `self-end sm:self-auto` and keep them in their own flex row.
- No logic, data, or styling-token changes elsewhere.

**Out of scope:** ProjectsList grid, ProjectCard layout, Solar Calculator tab.
