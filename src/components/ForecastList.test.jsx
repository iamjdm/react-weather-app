import { render, screen } from '@testing-library/react'
import { test, expect } from 'vitest'
import ForecastList from './ForecastList'

function makeEntry(dt, temp) {
  return {
    dt,
    main: { temp },
    weather: [{ description: 'clear sky', icon: '01d' }],
  }
}

test('renders one card per local day, picking the entry closest to local noon', () => {
  const data = {
    city: { timezone: 0 }, // UTC city, so local time === UTC time
    list: [
      makeEntry(Date.UTC(2026, 7, 2, 0, 0, 0) / 1000, 15),
      makeEntry(Date.UTC(2026, 7, 2, 12, 0, 0) / 1000, 22),
      makeEntry(Date.UTC(2026, 7, 3, 0, 0, 0) / 1000, 14),
      makeEntry(Date.UTC(2026, 7, 3, 12, 0, 0) / 1000, 24),
      makeEntry(Date.UTC(2026, 7, 4, 9, 0, 0) / 1000, 20),
      makeEntry(Date.UTC(2026, 7, 4, 12, 0, 0) / 1000, 26),
    ],
  }

  render(<ForecastList data={data} />)

  expect(screen.getByText('22°')).toBeInTheDocument()
  expect(screen.getByText('24°')).toBeInTheDocument()
  expect(screen.getByText('26°')).toBeInTheDocument()

  expect(screen.queryByText('15°')).not.toBeInTheDocument()
  expect(screen.queryByText('14°')).not.toBeInTheDocument()
  expect(screen.queryByText('20°')).not.toBeInTheDocument()
})

test('groups by the city local date rather than the UTC date near a day boundary', () => {
  // City is UTC-5. An entry at 2026-08-02 03:00 UTC is actually
  // 2026-08-01 22:00 local -- it belongs to Aug 1, not Aug 2.
  const data = {
    city: { timezone: -5 * 60 * 60 },
    list: [
      makeEntry(Date.UTC(2026, 7, 2, 3, 0, 0) / 1000, 10), // local: Aug 1, 22:00
      makeEntry(Date.UTC(2026, 7, 2, 17, 0, 0) / 1000, 25), // local: Aug 2, 12:00
      makeEntry(Date.UTC(2026, 7, 3, 17, 0, 0) / 1000, 27), // local: Aug 3, 12:00
    ],
  }

  render(<ForecastList data={data} />)

  // All three fall on distinct local calendar days, so all three should
  // render as separate cards rather than the boundary pair collapsing
  // into one.
  expect(screen.getByText('10°')).toBeInTheDocument()
  expect(screen.getByText('25°')).toBeInTheDocument()
  expect(screen.getByText('27°')).toBeInTheDocument()
})

test('caps the forecast at 5 days even when the raw data spans 6 local calendar dates', () => {
  // Simulates the real API: 40 entries on a 3-hour grid starting from a
  // non-midnight hour, so the window spans 6 local days, not 5.
  const startUtc = Date.UTC(2026, 7, 1, 21, 0, 0) / 1000
  const threeHours = 3 * 60 * 60
  const list = Array.from({ length: 40 }, (_, i) => makeEntry(startUtc + i * threeHours, i))

  const data = { city: { timezone: 0 }, list }

  const { container } = render(<ForecastList data={data} />)

  const cards = container.querySelectorAll('img')
  expect(cards).toHaveLength(5)
})
