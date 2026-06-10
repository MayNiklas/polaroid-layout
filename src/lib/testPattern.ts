import type { PolaroidConfig } from '../config/defaults'
import { derive } from '../config/derive'

/**
 * Generate a PNG data URL with a 10 mm grid for ruler verification.
 *
 * The image is rendered at the photo's full pixel size for the configured DPI,
 * with grid lines every 10 mm. After printing at 100%, each grid square should
 * measure exactly 10 mm — confirming the whole pipeline is true to scale.
 */
export function makeTestPattern(config: PolaroidConfig): string {
  const d = derive(config)
  const { width: pxW, height: pxH } = d.photoPixels
  const pxPerMm = pxW / config.photo.width

  const canvas = document.createElement('canvas')
  canvas.width = pxW
  canvas.height = pxH
  const ctx = canvas.getContext('2d')!

  // Background.
  ctx.fillStyle = '#fde7c9'
  ctx.fillRect(0, 0, pxW, pxH)

  // 10 mm grid.
  ctx.strokeStyle = '#c0651a'
  ctx.lineWidth = Math.max(1, pxPerMm * 0.15)
  const step = 10 * pxPerMm
  ctx.beginPath()
  for (let x = 0; x <= pxW + 0.5; x += step) {
    ctx.moveTo(x, 0)
    ctx.lineTo(x, pxH)
  }
  for (let y = 0; y <= pxH + 0.5; y += step) {
    ctx.moveTo(0, y)
    ctx.lineTo(pxW, y)
  }
  ctx.stroke()

  // Outer edge of the photo area, full strength.
  ctx.lineWidth = Math.max(2, pxPerMm * 0.3)
  ctx.strokeRect(0, 0, pxW, pxH)

  // Label.
  ctx.fillStyle = '#000'
  ctx.font = `${Math.round(pxPerMm * 4)}px sans-serif`
  ctx.textBaseline = 'top'
  ctx.fillText(`10 mm grid · ${config.photo.width}×${config.photo.height} mm`, step * 0.4, step * 0.4)

  return canvas.toDataURL('image/png')
}
