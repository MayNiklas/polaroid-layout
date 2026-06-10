import { useRef, useState } from 'react'

interface Props {
  onImage: (src: string) => void
}

export default function Uploader({ onImage }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function handleFile(file: File | undefined) {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => onImage(reader.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div
      className={`uploader${dragging ? ' uploader--drag' : ''}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        handleFile(e.dataTransfer.files[0])
      }}
    >
      <p>Drop an image here, or click to choose</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  )
}
