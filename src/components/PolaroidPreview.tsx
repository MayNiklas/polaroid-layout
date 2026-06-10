import type { PolaroidConfig } from '../config/defaults'
import { derive } from '../config/derive'

interface Props {
  config: PolaroidConfig
  /** Cropped photo as a data URL, or null while none is ready yet. */
  photo: string | null
  /** On-screen pixels per mm. */
  scale?: number
}

/**
 * Scaled, true-to-proportion preview of the final polaroid: white frame with
 * the cropped photo placed at the correct offset. Crop marks are indicated as
 * thin corner ticks so the user sees the cut guides.
 */
export default function PolaroidPreview({ config, photo, scale = 3 }: Props) {
  const d = derive(config)
  const mm = (v: number) => `${v * scale}px`

  return (
    <div className="preview">
      <div
        className="preview__page"
        style={{ width: mm(d.page.width), height: mm(d.page.height) }}
      >
        <div
          className="preview__polaroid"
          style={{
            left: mm(d.polaroidOffset.x),
            top: mm(d.polaroidOffset.y),
            width: mm(d.polaroid.width),
            height: mm(d.polaroid.height),
          }}
        >
          <div
            className="preview__photo"
            style={{
              left: mm(d.photoOffset.x),
              top: mm(d.photoOffset.y),
              width: mm(config.photo.width),
              height: mm(config.photo.height),
            }}
          >
            {photo && <img src={photo} alt="cropped preview" />}
          </div>
        </div>
      </div>
      <p className="preview__caption">
        Preview · polaroid {d.polaroid.width}×{d.polaroid.height} mm
      </p>
    </div>
  )
}
