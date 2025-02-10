import React from 'react'
import { render, screen } from '@testing-library/react'
import { EngineeredForm } from './EngineeredForm'

// Mock the EditContactDetailsFormStep2 component
jest.mock('../../engineered-forms/EditContactDetailsForm', () => {
  return { EditContactDetailsFormStep2: () => <>EditContactDetailsFormStep2 Mock</> }
})
// Mock the EditNameFormStep2 component
jest.mock('../../engineered-forms/EditNameForm', () => {
  return { EditNameFormStep2: () => <>EditNameFormStep2 Mock</> }
})

describe('EngineeredForm', () => {
  it('renders the correct form when a valid name prop is provided', () => {
    render(<EngineeredForm name='EditContactDetailsFormStep2' />)
    expect(screen.getByText('EditContactDetailsFormStep2 Mock')).toBeInTheDocument()
  })

  it('does not render anything and logs an error when an invalid name prop is provided', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    render(<EngineeredForm name="InvalidFormName" />)
    expect(screen.queryByText('EditContactDetailsFormStep2 Mock')).not.toBeInTheDocument()
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error: EngineeredForm.tsx Form not found: ', 'InvalidFormName')
    consoleErrorSpy.mockRestore()
  })
})
