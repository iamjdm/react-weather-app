import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, test, expect, afterEach } from 'vitest'
import LocationButton from './LocationButton'

function mockGeolocation(value) {
  Object.defineProperty(navigator, 'geolocation', {
    value,
    configurable: true,
  })
}

afterEach(() => {
  mockGeolocation(undefined)
})

test('calls onLocate with latitude and longitude on success', async () => {
  mockGeolocation({
    getCurrentPosition: (success) => {
      success({ coords: { latitude: 51.5, longitude: -0.12 } })
    },
  })
  const onLocate = vi.fn()
  const user = userEvent.setup()

  render(<LocationButton onLocate={onLocate} disabled={false} />)
  await user.click(screen.getByRole('button', { name: /use my location/i }))

  expect(onLocate).toHaveBeenCalledWith(51.5, -0.12)
})

test('shows a permission-denied message without calling onLocate', async () => {
  mockGeolocation({
    getCurrentPosition: (_success, error) => {
      error({ code: 1, PERMISSION_DENIED: 1 })
    },
  })
  const onLocate = vi.fn()
  const user = userEvent.setup()

  render(<LocationButton onLocate={onLocate} disabled={false} />)
  await user.click(screen.getByRole('button', { name: /use my location/i }))

  expect(await screen.findByText(/permission denied/i)).toBeInTheDocument()
  expect(onLocate).not.toHaveBeenCalled()
})

test('shows an unsupported message when the browser has no geolocation API', async () => {
  mockGeolocation(undefined)
  const user = userEvent.setup()

  render(<LocationButton onLocate={vi.fn()} disabled={false} />)
  await user.click(screen.getByRole('button', { name: /use my location/i }))

  expect(await screen.findByText(/not supported/i)).toBeInTheDocument()
})
