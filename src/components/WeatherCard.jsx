function WeatherCard({ data }) {
  const { name, sys, main, weather, wind } = data
  const condition = weather[0]

  return (
    <div className="w-full max-w-sm rounded-xl bg-slate-800 border border-slate-700 shadow-lg shadow-black/20 p-6 flex flex-col items-center gap-2">
      <h2 className="text-xl font-semibold">
        {name}
        {sys?.country && <span className="text-slate-500 font-normal">, {sys.country}</span>}
      </h2>
      <img
        src={`https://openweathermap.org/img/wn/${condition.icon}@2x.png`}
        alt={condition.description}
        className="w-20 h-20"
      />
      <p className="text-4xl font-bold">{Math.round(main.temp)}°C</p>
      <p className="text-slate-400 capitalize">{condition.description}</p>
      <p className="text-slate-500 text-sm">Feels like {Math.round(main.feels_like)}°C</p>

      <div className="grid grid-cols-2 gap-4 mt-4 w-full text-center border-t border-slate-700 pt-4">
        <div>
          <p className="text-slate-400 text-sm">Humidity</p>
          <p className="text-lg font-medium">{main.humidity}%</p>
        </div>
        <div>
          <p className="text-slate-400 text-sm">Wind</p>
          <p className="text-lg font-medium">{wind.speed} m/s</p>
        </div>
      </div>
    </div>
  )
}

export default WeatherCard
