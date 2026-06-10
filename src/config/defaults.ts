// All measurements are in millimeters unless noted. Nothing downstream should
// hardcode mm values — everything reads from a PolaroidConfig.

export interface PolaroidConfig {
  /** Photo (image) area size in mm. */
  photo: { width: number; height: number }
  /** White border widths in mm. Sides applies to both left and right. */
  border: { top: number; sides: number; bottom: number }
  /** Crop marks drawn in the bleed around the polaroid. */
  cropMarks: {
    enabled: boolean
    /** Bleed margin around the polaroid where marks live, in mm. */
    bleed: number
    /** Length of each mark line, in mm. */
    length: number
    /** Gap between the polaroid corner and the start of the mark, in mm. */
    gap: number
    /** Line weight, in mm. */
    weight: number
  }
  /** Export resolution for the rasterized photo. */
  dpi: number
}

export const CLASSIC_POLAROID: PolaroidConfig = {
  photo: { width: 80, height: 105 },
  border: { top: 6, sides: 9, bottom: 21 },
  cropMarks: {
    enabled: true,
    bleed: 5,
    length: 4,
    gap: 1,
    weight: 0.2,
  },
  dpi: 600,
}

export const DEFAULT_CONFIG = CLASSIC_POLAROID

export const PRESETS: Record<string, PolaroidConfig> = {
  'Classic Polaroid': CLASSIC_POLAROID,
}
