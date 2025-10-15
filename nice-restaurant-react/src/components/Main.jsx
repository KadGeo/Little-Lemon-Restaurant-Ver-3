import { useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookingForm from './BookingForm';
import { fetchAPI, submitAPI } from '../utils/api';

/**
 * Initialize available times for today
 * @returns {Array<string>} Array of available time slots
 */
function initializeTimes() {
  const today = new Date();
  return fetchAPI(today);
}

/**
 * Update available times based on selected date
 * Filters out already booked time slots to prevent double booking
 * @param {Array<string>} state - Current available times
 * @param {Object} action - Action object with type and date
 * @returns {Array<string>} Updated available times
 */
function updateTimes(state, action) {
  if (action.type === 'UPDATE_TIMES' && action.date) {
    const selectedDate = new Date(action.date);
    return fetchAPI(selectedDate);
  }
  return state;
}

/**
 * Main component that handles booking form logic
 * This component manages the state and logic for the booking system
 */
export default function Main() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(1);
  const [occasion, setOccasion] = useState('');
  const [availableTimes, dispatch] = useReducer(updateTimes, initializeTimes());
  const navigate = useNavigate();

  const submitForm = (formData) => {
    const success = submitAPI(formData);
    if (success) {
      navigate('/booking-confirmed', { state: { booking: formData } });
    } else {
      // Time slot already taken - show error to user
      alert('Sorry, this time slot is no longer available. Please choose another time.');
      // Refresh available times for the selected date
      if (formData.date) {
        dispatch({ type: 'UPDATE_TIMES', date: formData.date });
      }
    }
  };

  return (
    <main>
      <section className="booking-page" aria-labelledby="booking-title">
        <h2 id="booking-title">Book a Table</h2>
        <BookingForm
          date={date}
          setDate={setDate}
          time={time}
          setTime={setTime}
          guests={guests}
          setGuests={setGuests}
          occasion={occasion}
          setOccasion={setOccasion}
          availableTimes={availableTimes}
          dispatch={dispatch}
          submitForm={submitForm}
        />
      </section>
    </main>
  );
}

// Export utility functions for testing
export { initializeTimes, updateTimes };
