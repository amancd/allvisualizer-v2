# AllVisualizer: project guidelines

Open-source Next.js 16 (App Router) + Tailwind v4 site of interactive visualizations. Readability for contributors matters more than cleverness.

## Hard rules

- **No emojis.** Not in UI text, headings, buttons, card icons, canvas labels or data files. They look cheap. Use a Lucide icon (`lucide-react`) when an icon is needed, or plain text. `icon` props only accept Lucide icons, so the compiler enforces this for cards and headers. Typographic symbols that are notation (✓ ✗ → × ≈ θ) are fine.
- **Visualizations must be responsive** down to a 360px-wide phone with no horizontal page scroll:
  - Draw canvases/SVGs in a fixed coordinate space and scale with CSS: keep `width`/`height` attributes on `<canvas>`, give SVGs a `viewBox`, and add `responsiveSurface` (`block h-auto w-full max-w-full`) from `lib/visualization.ts`. Never use fixed pixel widths (`w-[600px]`, `style={{ width: 800 }}`) on containers.
  - Convert pointer positions with `toDrawingPoint(e, element)` from `lib/visualization.ts`; raw `clientX - rect.left` breaks once the surface is scaled. Prefer pointer events (`onPointerDown/Move/Up`) and add `touch-none` to draggable surfaces.
  - Layout grids collapse on small screens (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`). Grids that *are* the data (matrix cells, array cells) keep fixed columns but must fit or scroll inside their own `overflow-x-auto` box.
  - Control rows wrap (`flex-wrap`), and side-by-side panels stack below `lg`.
- **Use design tokens, not raw colors** for UI chrome: `text-ink`, `text-ink-muted`, `text-ink-faint`, `border-line`, `border-line-strong`, `bg-subtle`, `bg-brand-*`, `rounded-card`, `shadow-card`. Tokens live in `app/globals.css`. Colors *inside* a visualization (series, vectors, particles) may use the regular Tailwind palette.
- **One width for every page:** use the `page-container` utility. Header, footer and page bodies share it so their edges line up.
- **Each link appears once per page.** Header: Categories, About, Contact, search, GitHub. Footer: Support, Privacy, Terms, Instagram. Don't repeat those in page bodies, and don't link the same destination twice within a page.

## Where things live

- `config/content/`: the registry of every subject, topic and visualizer (`types.ts` explains the model). Subject pages, topic pages, search, sitemap and prev/next links are generated from it. Add a visualizer by adding an item here plus a page at `<topic.itemBasePath>/<slug>/page.tsx`.
- `components/content/`: page building blocks. Visualizer pages are `<DetailPage subject=… item=…>` containing `ContentSection`, `Prose`, `Callout`, `CardGrid`, `StepList`, `Formula`, `DataTable`, `CodeTabs`, `Complexity`, `PracticeProblem`, `RelatedItems`. Don't hand-write breadcrumbs, page headers or discussion sections.
- `components/ui/`: design-system primitives (`Button`/`buttonStyles`, `Input`, `Select`, `Textarea`, `Badge`, `PageHeader`, `Breadcrumbs`).
- `config/dsa-patterns/`: DSA Patterns notes, one file per category; UI in `components/dsa-patterns/`.
- `lib/visualization.ts`: helpers for responsive canvases/SVGs.
- Reference pages: `app/physics-visualizer/simulations/newtons-laws/page.tsx` (simulation) and `app/dsa-visualizer/problems/two-sum/page.tsx` (coding problem).

## Workflow

- Type-check with `npx tsc --noEmit -p .` and lint with `npm run lint`.
- Don't run `npm run build` while `npm run dev` is running; both write to `.next` and the dev server ends up serving stale CSS. Stop the dev server first.
- Commit as the `amancd` GitHub account (this repo's local git config uses the GitHub noreply address). Don't use a work email.
