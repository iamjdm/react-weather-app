import { useState } from 'react'

function SearchBar({ onSearch, disabled }) {
  const [city, setCity] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const trimmed = city.trim()
    if (!trimmed) return
    onSearch(trimmed)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-sm">
      <input
        type="text"
        value={city}
        onChange={(event) => setCity(event.target.value)}
        placeholder="Enter a city name..."
        className="flex-1 rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
      />
      <button
        type="submit"
        disabled={disabled}
        className="rounded-md bg-sky-600 px-4 py-2 font-medium hover:bg-sky-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors"
      >
        Search
      </button>
    </form>
  )
}

export default SearchBar
