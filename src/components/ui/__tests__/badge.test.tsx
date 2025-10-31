import React from 'react'
import { render, screen } from '@testing-library/react'
import { Badge } from '../badge'

describe('Badge Component', () => {
  it('renders with children text', () => {
    render(<Badge>Test Badge</Badge>)
    expect(screen.getByText('Test Badge')).toBeInTheDocument()
  })

  it('applies default variant', () => {
    const { container } = render(<Badge>Default</Badge>)
    const badge = container.firstChild
    expect(badge).toBeInTheDocument()
  })

  it('renders secondary variant', () => {
    const { container } = render(<Badge variant="secondary">Secondary</Badge>)
    const badge = container.firstChild
    expect(badge).toBeInTheDocument()
  })

  it('renders destructive variant', () => {
    const { container } = render(<Badge variant="destructive">Destructive</Badge>)
    const badge = container.firstChild
    expect(badge).toBeInTheDocument()
  })

  it('renders outline variant', () => {
    const { container } = render(<Badge variant="outline">Outline</Badge>)
    const badge = container.firstChild
    expect(badge).toBeInTheDocument()
  })

  it('accepts custom className', () => {
    const { container } = render(<Badge className="custom-class">Custom</Badge>)
    const badge = container.firstChild as HTMLElement
    expect(badge.className).toContain('custom-class')
  })
})
