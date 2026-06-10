import { useEffect, useState } from 'react'
import type { Area, Point } from 'react-easy-crop'
import { derive } from './config/derive'
import { useConfig } from './config/useConfig'
import { cropImage } from './lib/cropImage'
import Uploader from './components/Uploader'
import CropEditor from './components/CropEditor'
import PolaroidPreview from './components/PolaroidPreview'
import SettingsPanel from './components/SettingsPanel'

// Preview render width in px (kept small for fast live updates).
const PREVIEW_WIDTH = 360

export default function App() {
  const { config, setConfig } = useConfig()
  const d = derive(config)

  const [image, setImage] = useState<string | null>(null)
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [area, setArea] = useState<Area | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)

  // Regenerate the preview whenever the crop settles.
  useEffect(() => {
    if (!image || !area) return
    let cancelled = false
    const out = {
      width: PREVIEW_WIDTH,
      height: Math.round(PREVIEW_WIDTH / d.aspect),
    }
    cropImage(image, area, out).then((url) => {
      if (!cancelled) setPreview(url)
    })
    return () => {
      cancelled = true
    }
  }, [image, area, d.aspect])

  async function exportPdf() {
    if (!image || !area) return
    setExporting(true)
    try {
      // Render the crop at the photo's full pixel size for the configured DPI.
      const png = await cropImage(image, area, d.photoPixels)
      const { buildPdf } = await import('./lib/buildPdf')
      const doc = buildPdf(config, png)
      doc.save('polaroid.pdf')
    } finally {
      setExporting(false)
    }
  }

  function reset() {
    setImage(null)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setArea(null)
    setPreview(null)
  }

  return (
    <main>
      <h1>Polaroid Layout</h1>
      <p className="lead">
        Turn a photo into a print-ready, true-to-scale polaroid. Upload, crop,
        and download a PDF — then print it at 100% and cut along the marks for a
        polaroid-looking print. Everything runs in your browser; your photo is
        never uploaded.
      </p>

      <SettingsPanel config={config} onChange={setConfig} />

      {!image ? (
        <Uploader onImage={setImage} />
      ) : (
        <div className="editor">
          <CropEditor
            image={image}
            aspect={d.aspect}
            crop={crop}
            zoom={zoom}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={setArea}
          />
          <PolaroidPreview config={config} photo={preview} />
          <div className="editor__actions">
            <button
              className="editor__export"
              onClick={exportPdf}
              disabled={!area || exporting}
            >
              {exporting
                ? 'Generating…'
                : `Download PDF (${config.dpi} DPI)`}
            </button>
            <button onClick={reset}>Choose different image</button>
            <p className="editor__hint">
              Print at <strong>100% / Actual size</strong> — turn off "Fit to
              page" / "Scale" — then cut along the corner marks.
            </p>
          </div>
        </div>
      )}
    </main>
  )
}
