import { useState, useEffect } from 'react'
import SearchBar from './components/SearchBar'
import WeatherCard from './components/WeatherCard'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

function App() {
  const [city, setCity] = useState(null)
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!city) return

    let ignore = false

    async function fetchWeather() {
      setLoading(true)
      setError(null)
      setWeather(null)

      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
        const response = await fetch(url)

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`Couldn't find a city called "${city}".`)
          }
          throw new Error('Something went wrong fetching the weather.')
        }

        const data = await response.json()
        if (!ignore) {
          setWeather(data)
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message)
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    fetchWeather()

    return () => {
      ignore = true
    }
  }, [city])

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 to-slate-950 text-white flex flex-col items-center pt-16 gap-6 px-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Weather Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Live weather via OpenWeatherMap</p>
      </div>

      <SearchBar onSearch={setCity} disabled={loading} />

      {loading && (
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-sky-500"
          role="status"
          aria-label="Loading"
        />
      )}

      {error && (
        <div className="w-full max-w-sm rounded-md border border-red-900 bg-red-950/50 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {weather && <WeatherCard data={weather} />}

      {!city && !loading && (
        <p className="text-slate-600 text-sm">Search for a city to see its current weather.</p>
      )}
    </div>
  )
}

export default App
