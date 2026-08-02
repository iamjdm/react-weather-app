import { useState } from 'react'

function LocationButton({ onLocate, disabled }) {
  const [error, setError] = useState(null)
  const [locating, setLocating] = useState(false)

  function handleClick() {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.')
      return
    }

    setLocating(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocating(false)
        onLocate(position.coords.latitude, position.coords.longitude)
      },
      (err) => {
        setLocating(false)
        setError(
          err.code === err.PERMISSION_DENIED
            ? 'Location permission denied.'
            : 'Could not determine your location.',
        )
      },
      { timeout: 10000 },
    )
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || locating}
        className="text-xs text-sky-400 hover:text-sky-300 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors"
      >
        {locating ? 'Locating...' : 'Use my location'}
      </button>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}

export default LocationButton
