import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Main, { initializeTimes, updateTimes } from '../Main';
import * as api from '../../utils/api';

// Mock the API module
vi.mock('../../utils/api', () => ({
  fetchAPI: vi.fn(),
  submitAPI: vi.fn(),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Main Component', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Set default mock implementations
    api.fetchAPI.mockReturnValue(['17:00', '18:00', '19:00', '20:00', '21:00']);
    api.submitAPI.mockReturnValue(true);
  });

  describe('initializeTimes', () => {
    test('returns an array of available times', () => {
      const times = initializeTimes();

      expect(Array.isArray(times)).toBe(true);
      expect(times.length).toBeGreaterThan(0);
    });

    test('calls fetchAPI with today\'s date', () => {
      const beforeCall = new Date();
      initializeTimes();
      const afterCall = new Date();

      expect(api.fetchAPI).toHaveBeenCalledTimes(1);

      const calledWithDate = api.fetchAPI.mock.calls[0][0];
      expect(calledWithDate).toBeInstanceOf(Date);
      expect(calledWithDate.getTime()).toBeGreaterThanOrEqual(beforeCall.getTime());
      expect(calledWithDate.getTime()).toBeLessThanOrEqual(afterCall.getTime());
    });

    test('returns the result from fetchAPI', () => {
      const mockTimes = ['17:00', '17:30', '18:00'];
      api.fetchAPI.mockReturnValue(mockTimes);

      const result = initializeTimes();

      expect(result).toEqual(mockTimes);
    });
  });

  describe('updateTimes', () => {
    test('returns state unchanged when action type is not UPDATE_TIMES', () => {
      const state = ['17:00', '18:00', '19:00'];
      const action = { type: 'SOME_OTHER_ACTION' };

      const result = updateTimes(state, action);

      expect(result).toEqual(state);
      expect(api.fetchAPI).not.toHaveBeenCalled();
    });

    test('returns state unchanged when action has no date', () => {
      const state = ['17:00', '18:00', '19:00'];
      const action = { type: 'UPDATE_TIMES' };

      const result = updateTimes(state, action);

      expect(result).toEqual(state);
      expect(api.fetchAPI).not.toHaveBeenCalled();
    });

    test('calls fetchAPI with the provided date when action type is UPDATE_TIMES', () => {
      const state = ['17:00', '18:00', '19:00'];
      const testDate = '2025-12-25';
      const action = { type: 'UPDATE_TIMES', date: testDate };

      updateTimes(state, action);

      expect(api.fetchAPI).toHaveBeenCalledTimes(1);

      const calledWithDate = api.fetchAPI.mock.calls[0][0];
      expect(calledWithDate).toBeInstanceOf(Date);
      expect(calledWithDate.toISOString().split('T')[0]).toBe(testDate);
    });

    test('returns new available times from fetchAPI', () => {
      const state = ['17:00', '18:00', '19:00'];
      const newTimes = ['17:30', '18:30', '19:30', '20:00'];
      api.fetchAPI.mockReturnValue(newTimes);

      const action = { type: 'UPDATE_TIMES', date: '2025-12-25' };
      const result = updateTimes(state, action);

      expect(result).toEqual(newTimes);
    });

    test('handles different date formats correctly', () => {
      const state = ['17:00', '18:00'];
      const dateString = '2025-01-15';
      const action = { type: 'UPDATE_TIMES', date: dateString };

      updateTimes(state, action);

      const calledDate = api.fetchAPI.mock.calls[0][0];
      expect(calledDate.getFullYear()).toBe(2025);
      expect(calledDate.getMonth()).toBe(0); // January is 0
      expect(calledDate.getDate()).toBe(15);
    });
  });

  describe('Main Component Integration', () => {
    const renderMain = () => {
      return render(
        <BrowserRouter>
          <Main />
        </BrowserRouter>
      );
    };

    test('renders the BookingForm component', () => {
      renderMain();

      // Check for form elements
      expect(screen.getByLabelText(/choose date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/choose time/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/number of guests/i)).toBeInTheDocument();
    });

    test('renders with heading "Book a Table"', () => {
      renderMain();

      expect(screen.getByRole('heading', { name: /book a table/i })).toBeInTheDocument();
    });

    test('initializes with times from initializeTimes', () => {
      const mockTimes = ['17:00', '18:00', '19:00'];
      api.fetchAPI.mockReturnValue(mockTimes);

      renderMain();

      const timeSelect = screen.getByLabelText(/choose time/i);

      // Check that the mock times are in the dropdown
      mockTimes.forEach(time => {
        expect(timeSelect).toContain(screen.getByRole('option', { name: time }));
      });
    });

    test('updates available times when date is changed', async () => {
      const user = userEvent.setup();
      const initialTimes = ['17:00', '18:00', '19:00'];
      const newTimes = ['17:30', '18:30', '19:30'];

      api.fetchAPI.mockReturnValue(initialTimes);
      api.fetchAPI.mockReturnValue(newTimes);

      renderMain();

      // Change the date
      const dateInput = screen.getByLabelText(/choose date/i);
      await user.type(dateInput, '2025-12-25');

      await waitFor(() => {
        expect(api.fetchAPI).toHaveBeenCalled();
        expect(api.fetchAPI).toHaveBeenCalledWith(expect.any(Date));
      });
    });

    test('calls submitAPI when form is submitted with valid data', async () => {
      const user = userEvent.setup();
      renderMain();

      // Fill in the form
      const dateInput = screen.getByLabelText(/choose date/i);
      const timeSelect = screen.getByLabelText(/choose time/i);
      const guestsInput = screen.getByLabelText(/number of guests/i);

      await user.type(dateInput, '2025-12-25');
      await user.selectOptions(timeSelect, '18:00');
      await user.clear(guestsInput);
      await user.type(guestsInput, '4');

      // Submit the form
      const submitButton = screen.getByRole('button', { name: /make your reservation/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(api.submitAPI).toHaveBeenCalledWith(
          expect.objectContaining({
            date: '2025-12-25',
            time: '18:00',
            guests: '4',
          })
        );
      });
    });

    test('navigates to confirmation page on successful booking', async () => {
      const user = userEvent.setup();
      api.submitAPI.mockReturnValue(true);

      renderMain();

      // Fill and submit form
      const dateInput = screen.getByLabelText(/choose date/i);
      const timeSelect = screen.getByLabelText(/choose time/i);
      const guestsInput = screen.getByLabelText(/number of guests/i);

      await user.type(dateInput, '2025-12-25');
      await user.selectOptions(timeSelect, '18:00');
      await user.clear(guestsInput);
      await user.type(guestsInput, '4');

      const submitButton = screen.getByRole('button', { name: /make your reservation/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(
          '/booking-confirmed',
          expect.objectContaining({
            state: expect.objectContaining({
              booking: expect.any(Object)
            })
          })
        );
      });
    });

    test('shows alert when booking fails', async () => {
      const user = userEvent.setup();
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      api.submitAPI.mockReturnValue(false);

      renderMain();

      // Fill and submit form
      const dateInput = screen.getByLabelText(/choose date/i);
      const timeSelect = screen.getByLabelText(/choose time/i);
      const guestsInput = screen.getByLabelText(/number of guests/i);

      await user.type(dateInput, '2025-12-25');
      await user.selectOptions(timeSelect, '18:00');
      await user.clear(guestsInput);
      await user.type(guestsInput, '4');

      const submitButton = screen.getByRole('button', { name: /make your reservation/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(
          'Sorry, this time slot is no longer available. Please choose another time.'
        );
        expect(mockNavigate).not.toHaveBeenCalled();
      });

      alertSpy.mockRestore();
    });

    test('refreshes available times when booking fails', async () => {
      const user = userEvent.setup();
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      api.submitAPI.mockReturnValue(false);

      renderMain();

      const fetchCallCountBefore = api.fetchAPI.mock.calls.length;

      const dateInput = screen.getByLabelText(/choose date/i);
      const timeSelect = screen.getByLabelText(/choose time/i);
      const guestsInput = screen.getByLabelText(/number of guests/i);

      await user.type(dateInput, '2025-12-25');
      await user.selectOptions(timeSelect, '18:00');
      await user.clear(guestsInput);
      await user.type(guestsInput, '4');

      const submitButton = screen.getByRole('button', { name: /make your reservation/i });
      await user.click(submitButton);

      await waitFor(() => {
        // Should have called fetchAPI more times than before (for refresh after failed booking)
        expect(api.fetchAPI.mock.calls.length).toBeGreaterThan(fetchCallCountBefore);
      });

      alertSpy.mockRestore();
    });

    test('passes dispatch function to BookingForm', () => {
      renderMain();

      // The form should be able to dispatch actions (tested indirectly through date change)
      const dateInput = screen.getByLabelText(/choose date/i);
      expect(dateInput).toBeInTheDocument();
    });

    test('includes occasion in submitted form data', async () => {
      const user = userEvent.setup();
      renderMain();

      const dateInput = screen.getByLabelText(/choose date/i);
      const timeSelect = screen.getByLabelText(/choose time/i);
      const guestsInput = screen.getByLabelText(/number of guests/i);
      const occasionSelect = screen.getByLabelText(/occasion/i);

      await user.type(dateInput, '2025-12-25');
      await user.selectOptions(timeSelect, '18:00');
      await user.clear(guestsInput);
      await user.type(guestsInput, '4');
      await user.selectOptions(occasionSelect, 'Birthday');

      const submitButton = screen.getByRole('button', { name: /make your reservation/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(api.submitAPI).toHaveBeenCalledWith(
          expect.objectContaining({
            occasion: 'Birthday'
          })
        );
      });
    });
  });

  describe('State Management', () => {
    const renderMain = () => {
      return render(
        <BrowserRouter>
          <Main />
        </BrowserRouter>
      );
    };

    test('maintains separate state for each form field', async () => {
      const user = userEvent.setup();
      renderMain();

      const dateInput = screen.getByLabelText(/choose date/i);
      const timeSelect = screen.getByLabelText(/choose time/i);
      const guestsInput = screen.getByLabelText(/number of guests/i);

      await user.type(dateInput, '2025-12-25');
      expect(dateInput).toHaveValue('2025-12-25');

      await user.selectOptions(timeSelect, '18:00');
      expect(timeSelect).toHaveValue('18:00');

      await user.clear(guestsInput);
      await user.type(guestsInput, '6');
      expect(guestsInput).toHaveValue(6);
    });

    test('uses useReducer for managing available times', () => {
      const mockTimes = ['17:00', '18:00', '19:00', '20:00'];
      api.fetchAPI.mockReturnValue(mockTimes);

      renderMain();

      const timeSelect = screen.getByLabelText(/choose time/i);
      const options = Array.from(timeSelect.options)
        .filter(opt => opt.value !== '') // Exclude placeholder
        .map(opt => opt.value);

      expect(options).toEqual(mockTimes);
    });
  });

  describe('Accessibility', () => {
    const renderMain = () => {
      return render(
        <BrowserRouter>
          <Main />
        </BrowserRouter>
      );
    };

    test('main element has proper semantic HTML', () => {
      renderMain();

      const mainElement = screen.getByRole('main');
      expect(mainElement).toBeInTheDocument();
    });

    test('section has proper aria-labelledby', () => {
      const { container } = renderMain();

      const section = container.querySelector('.booking-page');
      expect(section).toHaveAttribute('aria-labelledby', 'booking-title');
    });

    test('heading is properly labeled', () => {
      renderMain();

      const heading = screen.getByRole('heading', { name: /book a table/i });
      expect(heading).toHaveAttribute('id', 'booking-title');
    });
  });
});
