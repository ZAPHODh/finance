import { cn, FreePlanLimitError, isRedirectError } from '../utils'

describe('Utils - Simple Tests', () => {
  describe('cn (className utility)', () => {
    it('merges class names correctly', () => {
      const result = cn('text-red-500', 'text-blue-500')
      expect(result).toBeTruthy()
      expect(typeof result).toBe('string')
    })

    it('handles conditional classes', () => {
      const isActive = true
      const result = cn('base-class', isActive && 'active-class')
      expect(result).toContain('base-class')
      expect(result).toContain('active-class')
    })

    it('filters out falsy values', () => {
      const result = cn('class1', false && 'class2', null, undefined, 'class3')
      expect(result).toContain('class1')
      expect(result).toContain('class3')
    })

    it('handles empty input', () => {
      const result = cn()
      expect(result).toBe('')
    })
  })

  describe('FreePlanLimitError', () => {
    it('creates error with default message', () => {
      const error = new FreePlanLimitError()
      expect(error).toBeInstanceOf(Error)
      expect(error.message).toBe('Upgrade your plan!')
    })

    it('creates error with custom message', () => {
      const customMessage = 'You have reached the limit'
      const error = new FreePlanLimitError(customMessage)
      expect(error.message).toBe(customMessage)
    })
  })

  describe('isRedirectError', () => {
    it('returns true for Next.js redirect error', () => {
      const redirectError = {
        digest: 'NEXT_REDIRECT;replace;/dashboard',
      }
      expect(isRedirectError(redirectError)).toBe(true)
    })

    it('returns false for null', () => {
      expect(isRedirectError(null)).toBe(false)
    })

    it('returns false for non-object values', () => {
      expect(isRedirectError('string')).toBe(false)
      expect(isRedirectError(123)).toBe(false)
      expect(isRedirectError(undefined)).toBe(false)
    })

    it('returns false for object without digest', () => {
      const normalError = { message: 'Error message' }
      expect(isRedirectError(normalError)).toBe(false)
    })
  })
})
