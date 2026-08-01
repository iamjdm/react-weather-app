const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// entry.dt is a UTC unix timestamp (seconds). Shifting it by the city's
// timezone offset and reading it back with the UTC getters gives us the
// city's local wall-clock time, without the browser's own timezone
// interfering (which is what plain `new Date(dt_txt)` or `toLocaleDateString`
// would do).
function toCityLocalDate(dt, timezoneOffsetSeconds) {
  return new Date((dt + timezoneOffsetSeconds) * 1000)
}

function getDailyEntries(list, timezoneOffsetSeconds) {
  const closestPerDay = new Map()

  for (const entry of list) {
    const localDate = toCityLocalDate(entry.dt, timezoneOffsetSeconds)
    const dateKey = localDate.toISOString().slice(0, 10)
    const hoursFromNoon = Math.abs(localDate.getUTCHours() - 12)

    const current = closestPerDay.get(dateKey)
    if (!current || hoursFromNoon < current.hoursFromNoon) {
      closestPerDay.set(dateKey, { entry, hoursFromNoon })
    }
  }

  // The API's 40 entries cover a 120-hour window starting from "now," not
  // from local midnight, so they typically span 6 local calendar dates
  // (a partial first/last day plus 4 full days). Cap to 5 to match the
  // "5-Day Forecast" label.
  return Array.from(closestPerDay.values())
    .slice(0, 5)
    .map(({ entry }) => entry)
}

function formatDay(dt, timezoneOffsetSeconds) {
  return WEEKDAYS[toCityLocalDate(dt, timezoneOffsetSeconds).getUTCDay()]
}

function ForecastList({ data }) {
  const dailyEntries = getDailyEntries(data.list, data.city.timezone)

  return (
    <div className="w-full max-w-sm">
      <h3 className="text-slate-400 text-sm mb-2">5-Day Forecast</h3>
      <div className="flex gap-2 overflow-x-auto">
        {dailyEntries.map((entry) => (
          <div
            key={entry.dt}
            className="flex-1 min-w-[64px] rounded-lg bg-slate-800 border border-slate-700 p-3 flex flex-col items-center gap-1"
          >
            <p className="text-xs text-slate-400">{formatDay(entry.dt, data.city.timezone)}</p>
            <img
              src={`https://openweathermap.org/img/wn/${entry.weather[0].icon}.png`}
              alt={entry.weather[0].description}
              className="w-8 h-8"
            />
            <p className="text-sm font-medium">{Math.round(entry.main.temp)}°</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ForecastList
