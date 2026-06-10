/** Pixel rectangle in the source image, as produced by react-easy-crop. */
export interface PixelArea {
  x: number
  y: number
  width: number
  height: number
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/**
 * Crop `src` to `area` and render it into a canvas of exactly `out` pixels,
 * returning a PNG data URL. Used both for the on-screen preview (small `out`)
 * and the final export (photo size at the configured DPI).
 */
export async function cropImage(
  src: string,
  area: PixelArea,
  out: { width: number; height: number },
): Promise<string> {
  const img = await loadImage(src)
  const canvas = document.createElement('canvas')
  canvas.width = out.width
  canvas.height = out.height
  const ctx = canvas.getContext('2d')!
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(
    img,
    area.x,
    area.y,
    area.width,
    area.height,
    0,
    0,
    out.width,
    out.height,
  )
  return canvas.toDataURL('image/png')
}
