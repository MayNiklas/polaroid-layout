import type { PolaroidConfig } from './defaults'

/** All derived geometry, in mm, computed from a PolaroidConfig. */
export interface Derived {
  /** Outer polaroid frame size (photo + borders). */
  polaroid: { width: number; height: number }
  /** Photo top-left offset within the polaroid frame. */
  photoOffset: { x: number; y: number }
  /** Full PDF page size (polaroid + bleed on all sides). */
  page: { width: number; height: number }
  /** Polaroid top-left offset within the page. */
  polaroidOffset: { x: number; y: number }
  /** Photo aspect ratio (width / height) for the crop editor. */
  aspect: number
  /** Photo pixel size at the configured DPI. */
  photoPixels: { width: number; height: number }
}

const MM_PER_INCH = 25.4

export function derive(config: PolaroidConfig): Derived {
  const { photo, border, cropMarks, dpi } = config

  const polaroid = {
    width: border.sides * 2 + photo.width,
    height: border.top + photo.height + border.bottom,
  }

  const bleed = cropMarks.enabled ? cropMarks.bleed : 0

  return {
    polaroid,
    photoOffset: { x: border.sides, y: border.top },
    page: {
      width: polaroid.width + bleed * 2,
      height: polaroid.height + bleed * 2,
    },
    polaroidOffset: { x: bleed, y: bleed },
    aspect: photo.width / photo.height,
    photoPixels: {
      width: Math.round((photo.width / MM_PER_INCH) * dpi),
      height: Math.round((photo.height / MM_PER_INCH) * dpi),
    },
  }
}
