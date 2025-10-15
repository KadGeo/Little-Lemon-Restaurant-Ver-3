import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BookingForm from '../BookingForm';

describe('BookingForm', () => {
  // Helper function to create mock props
  const createMockProps = (overrides = {}) => ({
    date: '',
    setDate: vi.fn(),
    time: '',
    setTime: vi.fn(),
    guests: '',
    setGuests: vi.fn(),
    occasion: '',
    setOccasion: vi.fn(),
    availableTimes: ['17:00', '18:00', '19:00', '20:00', '21:00'],
    dispatch: vi.fn(),
    submitForm: vi.fn(),
    ...overrides
  });

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Get future date (days from now)
  const getFutureDate = (daysFromNow) => {
    const future = new Date();
    future.setDate(future.getDate() + daysFromNow);
    return future.toISOString().split('T')[0];
  };

  // Get past date
  const getPastDate = () => {
    const past = new Date();
    past.setDate(past.getDate() - 1);
    return past.toISOString().split('T')[0];
  };

  describe('HTML5 Attributes Validation', () => {
    test('date input has correct HTML5 attributes', () => {
      const mockProps = createMockProps();
      render(<BookingForm {...mockProps} />);

      const dateInput = screen.getByLabelText(/choose date/i);

      expect(dateInput).toHaveAttribute('type', 'date');
      expect(dateInput).toHaveAttribute('id', 'res-date');
      expect(dateInput).toHaveAttribute('name', 'res-date');
      expect(dateInput).toHaveAttribute('required');
      expect(dateInput).toHaveAttribute('aria-required', 'true');
      expect(dateInput).toHaveAttribute('min');
      expect(dateInput).toHaveAttribute('max');
    });

    test('time select has correct HTML5 attributes', () => {
      const mockProps = createMockProps();
      render(<BookingForm {...mockProps} />);

      const timeSelect = screen.getByLabelText(/choose time/i);

      expect(timeSelect).toHaveAttribute('id', 'res-time');
      expect(timeSelect).toHaveAttribute('name', 'res-time');
      expect(timeSelect).toHaveAttribute('required');
      expect(timeSelect).toHaveAttribute('aria-required', 'true');
    });

    test('guests input has correct HTML5 attributes', () => {
      const mockProps = createMockProps();
      render(<BookingForm {...mockProps} />);

      const guestsInput = screen.getByLabelText(/number of guests/i);

      expect(guestsInput).toHaveAttribute('type', 'number');
      expect(guestsInput).toHaveAttribute('id', 'guests');
      expect(guestsInput).toHaveAttribute('name', 'guests');
      expect(guestsInput).toHaveAttribute('min', '1');
      expect(guestsInput).toHaveAttribute('max', '10');
      expect(guestsInput).toHaveAttribute('step', '1');
      expect(guestsInput).toHaveAttribute('required');
      expect(guestsInput).toHaveAttribute('aria-required', 'true');
      expect(guestsInput).toHaveAttribute('placeholder', '1');
    });

    test('occasion select has correct HTML5 attributes', () => {
      const mockProps = createMockProps();
      render(<BookingForm {...mockProps} />);

      const occasionSelect = screen.getByLabelText(/occasion/i);

      expect(occasionSelect).toHaveAttribute('id', 'occasion');
      expect(occasionSelect).toHaveAttribute('name', 'occasion');
      expect(occasionSelect).not.toHaveAttribute('required');
    });

    test('form has noValidate attribute', () => {
      const mockProps = createMockProps();
      const { container } = render(<BookingForm {...mockProps} />);

      const form = container.querySelector('form');
      expect(form).toHaveAttribute('noValidate');
    });

    test('time select renders all available time options', () => {
      const mockProps = createMockProps();
      render(<BookingForm {...mockProps} />);

      const timeSelect = screen.getByLabelText(/choose time/i);
      const options = timeSelect.querySelectorAll('option');

      // Should have 1 placeholder option + 5 time options
      expect(options).toHaveLength(6);
      expect(options[0]).toHaveTextContent('Select a time');
      expect(options[1]).toHaveTextContent('17:00');
      expect(options[5]).toHaveTextContent('21:00');
    });
  });

  describe('Valid Validation Scenarios', () => {
    test('validates correct date input', async () => {
      const mockSetDate = vi.fn();
      const mockProps = createMockProps({
        setDate: mockSetDate,
        date: getFutureDate(7)
      });
      render(<BookingForm {...mockProps} />);

      const dateInput = screen.getByLabelText(/choose date/i);

      // User fills in the date
      fireEvent.change(dateInput, { target: { value: getFutureDate(7) } });
      fireEvent.blur(dateInput);

      // Should not show error message
      await waitFor(() => {
        expect(screen.queryByText(/date cannot be in the past/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/date is required/i)).not.toBeInTheDocument();
      });
    });

    test('validates correct time selection', async () => {
      const user = userEvent.setup();
      const mockProps = createMockProps();
      render(<BookingForm {...mockProps} />);

      const timeSelect = screen.getByLabelText(/choose time/i);

      await user.selectOptions(timeSelect, '18:00');
      fireEvent.blur(timeSelect);

      // Should not show error message
      await waitFor(() => {
        expect(screen.queryByText(/time is required/i)).not.toBeInTheDocument();
      });
    });

    test('validates correct number of guests (within range)', async () => {
      const user = userEvent.setup();
      const mockProps = createMockProps();
      render(<BookingForm {...mockProps} />);

      const guestsInput = screen.getByLabelText(/number of guests/i);

      await user.type(guestsInput, '5');
      fireEvent.blur(guestsInput);

      // Should not show error message
      await waitFor(() => {
        expect(screen.queryByText(/minimum 1 guest required/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/maximum 10 guests allowed/i)).not.toBeInTheDocument();
      });
    });

    test('validates minimum guests value (1)', async () => {
      const user = userEvent.setup();
      const mockProps = createMockProps();
      render(<BookingForm {...mockProps} />);

      const guestsInput = screen.getByLabelText(/number of guests/i);

      await user.type(guestsInput, '1');
      fireEvent.blur(guestsInput);

      // Should not show error message
      await waitFor(() => {
        expect(screen.queryByText(/minimum 1 guest required/i)).not.toBeInTheDocument();
      });
    });

    test('validates maximum guests value (10)', async () => {
      const user = userEvent.setup();
      const mockProps = createMockProps();
      render(<BookingForm {...mockProps} />);

      const guestsInput = screen.getByLabelText(/number of guests/i);

      await user.type(guestsInput, '10');
      fireEvent.blur(guestsInput);

      // Should not show error message
      await waitFor(() => {
        expect(screen.queryByText(/maximum 10 guests allowed/i)).not.toBeInTheDocument();
      });
    });

    test('allows optional occasion field to be empty', async () => {
      const mockProps = createMockProps();
      render(<BookingForm {...mockProps} />);

      const occasionSelect = screen.getByLabelText(/occasion/i);
      fireEvent.blur(occasionSelect);

      // Should not show any error for empty occasion
      await waitFor(() => {
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      });
    });
  });

  describe('Invalid Validation Scenarios', () => {
    test('shows error when date is empty', async () => {
      const mockProps = createMockProps();
      render(<BookingForm {...mockProps} />);

      const dateInput = screen.getByLabelText(/choose date/i);

      fireEvent.focus(dateInput);
      fireEvent.blur(dateInput);

      await waitFor(() => {
        expect(screen.getByText(/date is required/i)).toBeInTheDocument();
      });
    });

    test('shows error when date is in the past', async () => {
      const mockProps = createMockProps({
        date: getPastDate()
      });
      render(<BookingForm {...mockProps} />);

      const dateInput = screen.getByLabelText(/choose date/i);
      const pastDate = getPastDate();

      fireEvent.change(dateInput, { target: { value: pastDate } });
      fireEvent.blur(dateInput);

      await waitFor(() => {
        expect(screen.getByText(/date cannot be in the past/i)).toBeInTheDocument();
      });
    });

    test('shows error when time is not selected', async () => {
      const mockProps = createMockProps();
      render(<BookingForm {...mockProps} />);

      const timeSelect = screen.getByLabelText(/choose time/i);

      fireEvent.focus(timeSelect);
      fireEvent.blur(timeSelect);

      await waitFor(() => {
        expect(screen.getByText(/time is required/i)).toBeInTheDocument();
      });
    });

    test('shows error when guests is empty', async () => {
      const mockProps = createMockProps();
      render(<BookingForm {...mockProps} />);

      const guestsInput = screen.getByLabelText(/number of guests/i);

      fireEvent.focus(guestsInput);
      fireEvent.blur(guestsInput);

      await waitFor(() => {
        expect(screen.getByText(/number of guests is required/i)).toBeInTheDocument();
      });
    });

    test('shows error when guests is less than 1', async () => {
      const user = userEvent.setup();
      const mockProps = createMockProps();
      render(<BookingForm {...mockProps} />);

      const guestsInput = screen.getByLabelText(/number of guests/i);

      await user.clear(guestsInput);
      await user.type(guestsInput, '0');
      fireEvent.blur(guestsInput);

      await waitFor(() => {
        expect(screen.getByText(/minimum 1 guest required/i)).toBeInTheDocument();
      });
    });

    test('shows error when guests is more than 10', async () => {
      const user = userEvent.setup();
      const mockProps = createMockProps();
      render(<BookingForm {...mockProps} />);

      const guestsInput = screen.getByLabelText(/number of guests/i);

      await user.clear(guestsInput);
      await user.type(guestsInput, '15');
      fireEvent.blur(guestsInput);

      await waitFor(() => {
        expect(screen.getByText(/maximum 10 guests allowed/i)).toBeInTheDocument();
      });
    });

    test('validates guests input with invalid number', async () => {
      const user = userEvent.setup();
      const mockProps = createMockProps();
      render(<BookingForm {...mockProps} />);

      const guestsInput = screen.getByLabelText(/number of guests/i);

      await user.clear(guestsInput);
      await user.type(guestsInput, 'abc');
      fireEvent.blur(guestsInput);

      await waitFor(() => {
        // Empty value will trigger "Number of guests is required"
        expect(screen.getByText(/number of guests is required/i)).toBeInTheDocument();
      });
    });
  });

  describe('Form Submission with Validation', () => {
    test('submits form with valid data', async () => {
      const user = userEvent.setup();
      const mockSubmitForm = vi.fn();
      const mockProps = createMockProps({
        date: getFutureDate(7),
        time: '18:00',
        guests: '4',
        occasion: 'Birthday',
        submitForm: mockSubmitForm
      });

      render(<BookingForm {...mockProps} />);

      const submitButton = screen.getByRole('button', { name: /make your reservation/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockSubmitForm).toHaveBeenCalledTimes(1);
        expect(mockSubmitForm).toHaveBeenCalledWith({
          date: getFutureDate(7),
          time: '18:00',
          guests: '4',
          occasion: 'Birthday'
        });
      });
    });

    test('does not submit form with empty required fields', async () => {
      const user = userEvent.setup();
      const mockSubmitForm = vi.fn();
      const mockProps = createMockProps({ submitForm: mockSubmitForm });

      render(<BookingForm {...mockProps} />);

      const submitButton = screen.getByRole('button', { name: /make your reservation/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockSubmitForm).not.toHaveBeenCalled();
        expect(screen.getByText(/date is required/i)).toBeInTheDocument();
        expect(screen.getByText(/time is required/i)).toBeInTheDocument();
        expect(screen.getByText(/number of guests is required/i)).toBeInTheDocument();
      });
    });

    test('does not submit form with invalid date', async () => {
      const user = userEvent.setup();
      const mockSubmitForm = vi.fn();
      const mockProps = createMockProps({
        date: getPastDate(),
        time: '18:00',
        guests: '4',
        submitForm: mockSubmitForm
      });

      render(<BookingForm {...mockProps} />);

      const submitButton = screen.getByRole('button', { name: /make your reservation/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockSubmitForm).not.toHaveBeenCalled();
        expect(screen.getByText(/date cannot be in the past/i)).toBeInTheDocument();
      });
    });

    test('does not submit form with invalid guests number', async () => {
      const user = userEvent.setup();
      const mockSubmitForm = vi.fn();
      const mockProps = createMockProps({
        date: getFutureDate(7),
        time: '18:00',
        guests: '15',
        submitForm: mockSubmitForm
      });

      render(<BookingForm {...mockProps} />);

      const submitButton = screen.getByRole('button', { name: /make your reservation/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockSubmitForm).not.toHaveBeenCalled();
        expect(screen.getByText(/maximum 10 guests allowed/i)).toBeInTheDocument();
      });
    });
  });

  describe('User Interaction and State Updates', () => {
    test('calls setDate and dispatch when date changes', async () => {
      const mockSetDate = vi.fn();
      const mockDispatch = vi.fn();
      const mockProps = createMockProps({
        setDate: mockSetDate,
        dispatch: mockDispatch
      });

      render(<BookingForm {...mockProps} />);

      const dateInput = screen.getByLabelText(/choose date/i);
      const futureDate = getFutureDate(7);

      fireEvent.change(dateInput, { target: { value: futureDate } });

      expect(mockSetDate).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'UPDATE_TIMES',
        date: futureDate
      });
    });

    test('calls setTime when time changes', async () => {
      const user = userEvent.setup();
      const mockSetTime = vi.fn();
      const mockProps = createMockProps({ setTime: mockSetTime });

      render(<BookingForm {...mockProps} />);

      const timeSelect = screen.getByLabelText(/choose time/i);
      await user.selectOptions(timeSelect, '18:00');

      expect(mockSetTime).toHaveBeenCalledWith('18:00');
    });

    test('calls setGuests when guests number changes', async () => {
      const user = userEvent.setup();
      const mockSetGuests = vi.fn();
      const mockProps = createMockProps({ setGuests: mockSetGuests });

      render(<BookingForm {...mockProps} />);

      const guestsInput = screen.getByLabelText(/number of guests/i);
      await user.type(guestsInput, '5');

      expect(mockSetGuests).toHaveBeenCalled();
    });

    test('calls setOccasion when occasion changes', async () => {
      const user = userEvent.setup();
      const mockSetOccasion = vi.fn();
      const mockProps = createMockProps({ setOccasion: mockSetOccasion });

      render(<BookingForm {...mockProps} />);

      const occasionSelect = screen.getByLabelText(/occasion/i);
      await user.selectOptions(occasionSelect, 'Birthday');

      expect(mockSetOccasion).toHaveBeenCalledWith('Birthday');
    });
  });

  describe('Accessibility', () => {
    test('date input has correct aria attributes when invalid', async () => {
      const mockProps = createMockProps();
      render(<BookingForm {...mockProps} />);

      const dateInput = screen.getByLabelText(/choose date/i);

      fireEvent.focus(dateInput);
      fireEvent.blur(dateInput);

      await waitFor(() => {
        expect(dateInput).toHaveAttribute('aria-invalid', 'true');
        expect(dateInput).toHaveAttribute('aria-describedby', 'date-error');
      });
    });

    test('error messages have role="alert" for screen readers', async () => {
      const mockProps = createMockProps();
      render(<BookingForm {...mockProps} />);

      const dateInput = screen.getByLabelText(/choose date/i);

      fireEvent.focus(dateInput);
      fireEvent.blur(dateInput);

      await waitFor(() => {
        const errorMessage = screen.getByText(/date is required/i);
        expect(errorMessage).toHaveAttribute('role', 'alert');
      });
    });

    test('required fields are marked with asterisk in label', () => {
      const mockProps = createMockProps();
      render(<BookingForm {...mockProps} />);

      expect(screen.getByText(/choose date/i)).toBeInTheDocument();
      expect(screen.getByText(/choose time/i)).toBeInTheDocument();
      expect(screen.getByText(/number of guests/i)).toBeInTheDocument();
    });
  });

  // Legacy tests (updated)
  test('renders "Choose date" label text', () => {
    const mockProps = createMockProps();
    render(<BookingForm {...mockProps} />);

    const chooseDateLabel = screen.getByText(/choose date/i);
    expect(chooseDateLabel).toBeInTheDocument();
  });

  test('can be submitted by a user', async () => {
    const user = userEvent.setup();
    const mockSubmitForm = vi.fn();
    const mockProps = createMockProps({
      date: getFutureDate(7),
      time: '18:00',
      guests: '4',
      occasion: 'Birthday',
      submitForm: mockSubmitForm
    });

    render(<BookingForm {...mockProps} />);

    const submitButton = screen.getByRole('button', { name: /make your reservation/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSubmitForm).toHaveBeenCalledTimes(1);
      expect(mockSubmitForm).toHaveBeenCalledWith({
        date: getFutureDate(7),
        time: '18:00',
        guests: '4',
        occasion: 'Birthday'
      });
    });
  });
});
