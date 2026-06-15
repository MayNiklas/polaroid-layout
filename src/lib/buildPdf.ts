import { jsPDF } from 'jspdf'
import type { PolaroidConfig } from '../config/defaults'
import { derive } from '../config/derive'

/**
 * Build a true-to-scale polaroid PDF.
 *
 * All placement is done in millimeters via jsPDF's `unit: 'mm'`, so the output
 * prints 1:1 as long as the user prints at 100% (no "fit to page" scaling).
 *
 * @param photoPng PNG data URL of the cropped photo, already sized to the
 *                 photo's aspect ratio. jsPDF scales it to fit the mm box.
 */
export function buildPdf(config: PolaroidConfig, photoPng: string): jsPDF {
  const d = derive(config)

  const doc = new jsPDF({
    unit: 'mm',
    format: [d.page.width, d.page.height],
    orientation: d.page.width >= d.page.height ? 'landscape' : 'portrait',
  })

  // White paper background (borders are simply white space around the photo).
  doc.setFillColor(255, 255, 255)
  doc.rect(0, 0, d.page.width, d.page.height, 'F')

  // Photo, placed at the polaroid offset + the photo's offset within it.
  const photoX = d.polaroidOffset.x + d.photoOffset.x
  const photoY = d.polaroidOffset.y + d.photoOffset.y
  doc.addImage(
    photoPng,
    'PNG',
    photoX,
    photoY,
    config.photo.width,
    config.photo.height,
    undefined,
    'NONE', // no JPEG recompression — keep PNG lossless
  )

  if (config.cropMarks.enabled) {
    drawCropMarks(doc, config, d.polaroidOffset, d.polaroid)
  }

  return doc
}

function drawCropMarks(
  doc: jsPDF,
  config: PolaroidConfig,
  offset: { x: number; y: number },
  size: { width: number; height: number },
) {
  const { gap, length, weight } = config.cropMarks
  doc.setDrawColor(0, 0, 0)
  doc.setLineWidth(weight)

  // Polaroid corners.
  const left = offset.x
  const right = offset.x + size.width
  const top = offset.y
  const bottom = offset.y + size.height

  // For each corner: one horizontal + one vertical mark pointing outward,
  // starting `gap` away from the corner and `length` long.
  const corners = [
    { x: left, y: top, dx: -1, dy: -1 },
    { x: right, y: top, dx: 1, dy: -1 },
    { x: left, y: bottom, dx: -1, dy: 1 },
    { x: right, y: bottom, dx: 1, dy: 1 },
  ]

  for (const c of corners) {
    // Horizontal mark.
    doc.line(c.x + c.dx * gap, c.y, c.x + c.dx * (gap + length), c.y)
    // Vertical mark.
    doc.line(c.x, c.y + c.dy * gap, c.x, c.y + c.dy * (gap + length))
  }

  // Midpoint marks on each side, running parallel to their edge (offset into
  // the bleed by `gap`). A mark aligned with the cut line stays useful even
  // after the adjacent edges have already been cut away.
  const midX = offset.x + size.width / 2
  const midY = offset.y + size.height / 2
  // n = outward normal (offset direction), t = tangent (along the edge).
  const sides = [
    { mx: midX, my: top, nx: 0, ny: -1, tx: 1, ty: 0 }, // top edge
    { mx: midX, my: bottom, nx: 0, ny: 1, tx: 1, ty: 0 }, // bottom edge
    { mx: left, my: midY, nx: -1, ny: 0, tx: 0, ty: 1 }, // left edge
    { mx: right, my: midY, nx: 1, ny: 0, tx: 0, ty: 1 }, // right edge
  ]

  for (const s of sides) {
    const cx = s.mx + s.nx * gap
    const cy = s.my + s.ny * gap
    doc.line(
      cx - (s.tx * length) / 2,
      cy - (s.ty * length) / 2,
      cx + (s.tx * length) / 2,
      cy + (s.ty * length) / 2,
    )
  }
}
