import Cropper from 'react-easy-crop'
import type { Area, Point } from 'react-easy-crop'

interface Props {
  image: string
  aspect: number
  crop: Point
  zoom: number
  onCropChange: (crop: Point) => void
  onZoomChange: (zoom: number) => void
  onCropComplete: (areaPixels: Area) => void
}

export default function CropEditor({
  image,
  aspect,
  crop,
  zoom,
  onCropChange,
  onZoomChange,
  onCropComplete,
}: Props) {
  return (
    <div className="crop-editor">
      <div className="crop-editor__stage">
        <Cropper
          image={image}
          aspect={aspect}
          crop={crop}
          zoom={zoom}
          minZoom={1}
          maxZoom={5}
          restrictPosition
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          onCropComplete={(_, areaPixels) => onCropComplete(areaPixels)}
        />
      </div>
      <label className="crop-editor__zoom">
        Zoom
        <input
          type="range"
          min={1}
          max={5}
          step={0.01}
          value={zoom}
          onChange={(e) => onZoomChange(Number(e.target.value))}
        />
      </label>
    </div>
  )
}
