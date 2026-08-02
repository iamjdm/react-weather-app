import { useState, useEffect } from 'react'
import SearchBar from './components/SearchBar'
import LocationButton from './components/LocationButton'
import WeatherCard from './components/WeatherCard'
import ForecastList from './components/ForecastList'
import RecentSearches from './components/RecentSearches'
import { loadRecentSearches, saveRecentSearches, addRecentSearch } from './utils/recentSearches'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

function App() {
  // Either { type: 'city', city } or { type: 'coords', lat, lon } -- a single
  // piece of state so the fetch effect below has one clear trigger, instead
  // of juggling two separately-nullable "city" and "coords" states.
  const [query, setQuery] = useState(null)
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [recentSearches, setRecentSearches] = useState(loadRecentSearches)

  useEffect(() => {
    saveRecentSearches(recentSearches)
  }, [recentSearches])

  useEffect(() => {
    if (!query) return

    let ignore = false

    async function fetchWeather() {
      setLoading(true)
      setError(null)
      setWeather(null)
      setForecast(null)

      try {
        const params =
          query.type === 'coords'
            ? `lat=${query.lat}&lon=${query.lon}&units=metric&appid=${API_KEY}`
            : `q=${encodeURIComponent(query.city)}&units=metric&appid=${API_KEY}`

        const [weatherResponse, forecastResponse] = await Promise.all([
          fetch(`https://api.openweathermap.org/data/2.5/weather?${params}`),
          fetch(`https://api.openweathermap.org/data/2.5/forecast?${params}`),
        ])

        if (!weatherResponse.ok) {
          if (weatherResponse.status === 404) {
            throw new Error(
              query.type === 'coords'
                ? "Couldn't find weather for your location."
                : `Couldn't find a city called "${query.city}".`,
            )
          }
          throw new Error('Something went wrong fetching the weather.')
        }
        if (!forecastResponse.ok) {
          throw new Error('Something went wrong fetching the forecast.')
        }

        const weatherData = await weatherResponse.json()
        const forecastData = await forecastResponse.json()

        if (!ignore) {
          setWeather(weatherData)
          setForecast(forecastData)
          setRecentSearches((prev) => addRecentSearch(prev, weatherData.name))
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
  }, [query])

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 to-slate-950 text-white flex flex-col items-center pt-16 gap-6 px-4 pb-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Weather Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Live weather via OpenWeatherMap</p>
      </div>

      <SearchBar onSearch={(city) => setQuery({ type: 'city', city })} disabled={loading} />
      <LocationButton
        onLocate={(lat, lon) => setQuery({ type: 'coords', lat, lon })}
        disabled={loading}
      />
      <RecentSearches
        cities={recentSearches}
        onSelect={(city) => setQuery({ type: 'city', city })}
      />

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
      {forecast && <ForecastList data={forecast} />}

      {!query && !loading && (
        <p className="text-slate-600 text-sm">Search for a city to see its current weather.</p>
      )}
    </div>
  )
}

export default App
