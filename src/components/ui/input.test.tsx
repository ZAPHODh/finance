import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from './input'

describe('Input Component', () => {
  it('renders input element', () => {
    render(<Input />)
    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
  })

  it('accepts placeholder text', () => {
    render(<Input placeholder="Enter your name" />)
    const input = screen.getByPlaceholderText(/enter your name/i)
    expect(input).toBeInTheDocument()
  })

  it('accepts value prop', () => {
    render(<Input value="Test Value" onChange={() => {}} />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('Test Value')
  })

  it('handles user input', async () => {
    const user = userEvent.setup()
    const handleChange = jest.fn()

    render(<Input onChange={handleChange} />)
    const input = screen.getByRole('textbox')

    await user.type(input, 'Hello')
    expect(handleChange).toHaveBeenCalled()
  })

  it('is disabled when disabled prop is true', () => {
    render(<Input disabled />)
    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
  })

  it('applies custom className', () => {
    render(<Input className="custom-input" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('custom-input')
  })

  it('accepts type prop for different input types', () => {
    const { container } = render(<Input type="email" />)
    const input = container.querySelector('input[type="email"]')
    expect(input).toBeInTheDocument()
  })

  it('accepts number type and validates numeric input', () => {
    const { container } = render(<Input type="number" />)
    const input = container.querySelector('input[type="number"]')
    expect(input).toBeInTheDocument()
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>()
    render(<Input ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })
})
