function RecentSearches({ cities, onSelect }) {
  if (cities.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 justify-center max-w-sm">
      {cities.map((city) => (
        <button
          key={city}
          type="button"
          onClick={() => onSelect(city)}
          className="text-xs rounded-full bg-slate-800 border border-slate-700 px-3 py-1 text-slate-300 hover:bg-slate-700 transition-colors"
        >
          {city}
        </button>
      ))}
    </div>
  )
}

export default RecentSearches
