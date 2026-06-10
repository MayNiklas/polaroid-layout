# polaroid-layout

Turn any photo into a print-ready, **true-to-scale** polaroid-style PDF — then
print it at 100% and cut along the marks for a real polaroid-looking print.

Everything runs **in your browser**. Your photo is never uploaded anywhere.

> Built this little tool for my Mom.

## What it does

1. **Upload** a photo (drag-and-drop or file picker).
2. **Position and crop** it — drag to move, zoom in/out. The crop frame is
   locked to the photo's aspect ratio so it always fits the polaroid window.
3. **Export a PDF** sized exactly to the polaroid, with corner **crop marks**.
4. **Print at 100%** (no "fit to page") and cut along the marks.

## Default layout

The classic polaroid proportions, all editable in the UI:

| Element | Default |
| --- | --- |
| Photo | 80 × 105 mm |
| Border (top / sides / bottom) | 6 / 9 / 21 mm |
| Polaroid (cut size) | 98 × 132 mm |
| Export resolution | 600 DPI |

Sizes, borders, crop marks (length / gap / weight / bleed) and DPI are all
configurable in **Layout settings**, and your settings persist between visits.

## Printing true to scale

The PDF is laid out in real millimeters, so it prints 1:1 — **as long as you
print at actual size**. In the print dialog, disable "Fit to page" / "Scale to
fit" and set scale to 100%.

## Development

Built with Vite + React + TypeScript, fully client-side.

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check and produce a static build in dist/
npm run preview  # preview the production build
```

## Deployment

Pushes to `main` are built and published to GitHub Pages by
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). The Vite `base`
is relative, so it works from a project subpath.
