import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, test, expect } from 'vitest'
import SearchBar from './SearchBar'

test('calls onSearch with the trimmed city name when submitted', async () => {
  const user = userEvent.setup()
  const onSearch = vi.fn()

  render(<SearchBar onSearch={onSearch} />)

  const input = screen.getByPlaceholderText('Enter a city name...')
  await user.type(input, '  London  ')
  await user.click(screen.getByRole('button', { name: 'Search' }))

  expect(onSearch).toHaveBeenCalledWith('London')
  expect(onSearch).toHaveBeenCalledTimes(1)
})

test('does not call onSearch when the input is empty', async () => {
  const user = userEvent.setup()
  const onSearch = vi.fn()

  render(<SearchBar onSearch={onSearch} />)

  await user.click(screen.getByRole('button', { name: 'Search' }))

  expect(onSearch).not.toHaveBeenCalled()
})
