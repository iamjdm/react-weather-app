const STORAGE_KEY = 'weatherApp.recentSearches'
const MAX_RECENT = 5

export function loadRecentSearches() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function saveRecentSearches(cities) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cities))
}

export function addRecentSearch(cities, city) {
  const deduped = cities.filter((existing) => existing.toLowerCase() !== city.toLowerCase())
  return [city, ...deduped].slice(0, MAX_RECENT)
}
