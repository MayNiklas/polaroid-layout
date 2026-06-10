import {
  DEFAULT_CONFIG,
  PRESETS,
  type PolaroidConfig,
} from '../config/defaults'

interface Props {
  config: PolaroidConfig
  onChange: (config: PolaroidConfig) => void
}

/** A labelled numeric field that edits one mm/DPI value. */
function NumberField({
  label,
  value,
  min = 0,
  step = 1,
  unit = 'mm',
  onChange,
}: {
  label: string
  value: number
  min?: number
  step?: number
  unit?: string
  onChange: (v: number) => void
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <span className="field__input">
        <input
          type="number"
          value={value}
          min={min}
          step={step}
          onChange={(e) => {
            const v = Number(e.target.value)
            if (!Number.isNaN(v) && v >= min) onChange(v)
          }}
        />
        <span className="field__unit">{unit}</span>
      </span>
    </label>
  )
}

export default function SettingsPanel({ config, onChange }: Props) {
  // Helpers that update one nested slice and bubble the whole config up.
  const setPhoto = (p: Partial<PolaroidConfig['photo']>) =>
    onChange({ ...config, photo: { ...config.photo, ...p } })
  const setBorder = (b: Partial<PolaroidConfig['border']>) =>
    onChange({ ...config, border: { ...config.border, ...b } })
  const setMarks = (m: Partial<PolaroidConfig['cropMarks']>) =>
    onChange({ ...config, cropMarks: { ...config.cropMarks, ...m } })

  const presetNames = Object.keys(PRESETS)

  return (
    <details className="settings" open>
      <summary>Layout settings</summary>

      <div className="settings__body">
        <div className="settings__row">
          {presetNames.length > 1 && (
            <label className="field">
              <span>Preset</span>
              <select
                onChange={(e) => {
                  const preset = PRESETS[e.target.value]
                  if (preset) onChange(preset)
                }}
                value=""
              >
                <option value="" disabled>
                  Choose…
                </option>
                {presetNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
          )}
          <button onClick={() => onChange(DEFAULT_CONFIG)}>
            Reset to default
          </button>
        </div>

        <fieldset>
          <legend>Photo</legend>
          <NumberField
            label="Width"
            value={config.photo.width}
            min={10}
            onChange={(width) => setPhoto({ width })}
          />
          <NumberField
            label="Height"
            value={config.photo.height}
            min={10}
            onChange={(height) => setPhoto({ height })}
          />
        </fieldset>

        <fieldset>
          <legend>Borders</legend>
          <NumberField
            label="Top"
            value={config.border.top}
            onChange={(top) => setBorder({ top })}
          />
          <NumberField
            label="Sides"
            value={config.border.sides}
            onChange={(sides) => setBorder({ sides })}
          />
          <NumberField
            label="Bottom"
            value={config.border.bottom}
            onChange={(bottom) => setBorder({ bottom })}
          />
        </fieldset>

        <fieldset>
          <legend>Crop marks</legend>
          <label className="field field--check">
            <input
              type="checkbox"
              checked={config.cropMarks.enabled}
              onChange={(e) => setMarks({ enabled: e.target.checked })}
            />
            <span>Enabled</span>
          </label>
          <NumberField
            label="Bleed"
            value={config.cropMarks.bleed}
            onChange={(bleed) => setMarks({ bleed })}
          />
          <NumberField
            label="Length"
            value={config.cropMarks.length}
            onChange={(length) => setMarks({ length })}
          />
          <NumberField
            label="Gap"
            value={config.cropMarks.gap}
            step={0.5}
            onChange={(gap) => setMarks({ gap })}
          />
          <NumberField
            label="Line weight"
            value={config.cropMarks.weight}
            step={0.05}
            onChange={(weight) => setMarks({ weight })}
          />
        </fieldset>

        <fieldset>
          <legend>Export</legend>
          <NumberField
            label="Resolution"
            value={config.dpi}
            min={72}
            step={1}
            unit="DPI"
            onChange={(dpi) => onChange({ ...config, dpi })}
          />
        </fieldset>
      </div>
    </details>
  )
}
