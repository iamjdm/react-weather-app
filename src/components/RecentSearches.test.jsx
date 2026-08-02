import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, test, expect } from 'vitest'
import RecentSearches from './RecentSearches'

test('renders nothing when there are no recent searches', () => {
  const { container } = render(<RecentSearches cities={[]} onSelect={vi.fn()} />)
  expect(container).toBeEmptyDOMElement()
})

test('calls onSelect with the clicked city', async () => {
  const user = userEvent.setup()
  const onSelect = vi.fn()

  render(<RecentSearches cities={['London', 'Tokyo']} onSelect={onSelect} />)

  await user.click(screen.getByRole('button', { name: 'Tokyo' }))

  expect(onSelect).toHaveBeenCalledWith('Tokyo')
})
