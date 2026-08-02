import { test, expect } from 'vitest'
import { addRecentSearch } from './recentSearches'

test('adds a new city to the front of the list', () => {
  const result = addRecentSearch(['Paris', 'Tokyo'], 'London')
  expect(result).toEqual(['London', 'Paris', 'Tokyo'])
})

test('moves an existing city to the front instead of duplicating it', () => {
  const result = addRecentSearch(['Paris', 'Tokyo', 'London'], 'Tokyo')
  expect(result).toEqual(['Tokyo', 'Paris', 'London'])
})

test('dedupes case-insensitively', () => {
  const result = addRecentSearch(['london'], 'London')
  expect(result).toEqual(['London'])
})

test('caps the list at 5 entries', () => {
  const result = addRecentSearch(['A', 'B', 'C', 'D', 'E'], 'F')
  expect(result).toEqual(['F', 'A', 'B', 'C', 'D'])
})
