// Store booked reservations in memory (sessionStorage for persistence across page refreshes)
const STORAGE_KEY = 'littleLemonBookings';

// Get existing bookings from storage
const getBookedReservations = () => {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading bookings from storage:', error);
    return [];
  }
};

// Save bookings to storage
const saveBookedReservations = (bookings) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  } catch (error) {
    console.error('Error saving bookings to storage:', error);
  }
};

/**
 * Seeded random number generator for consistent time slot generation
 * @param {number} seed - Seed value for the random number generator
 * @returns {Function} Random number generator function
 */
const seededRandom = function (seed) {
  var m = 2**35 - 31;
  var a = 185852;
  var s = seed % m;
  return function () {
    return (s = s * a % m) / m;
  };
};

/**
 * Fetch available time slots for a given date
 * Filters out already booked times to prevent double booking
 * @param {Date} date - The date to fetch available times for
 * @returns {Array<string>} Array of available time slots (e.g., ['17:00', '18:30'])
 */
export const fetchAPI = function(date) {
  let result = [];
  let random = seededRandom(date.getDate());

  // Generate time slots from 5 PM (17:00) to 11 PM (23:00)
  for(let i = 17; i <= 23; i++) {
    if(random() < 0.5) {
      result.push(i + ':00');
    }
    if(random() < 0.5) {
      result.push(i + ':30');
    }
  }

  // Filter out already booked times for this date
  const dateString = date.toISOString().split('T')[0];
  const bookedReservations = getBookedReservations();

  const availableTimes = result.filter(time => {
    return !bookedReservations.some(booking =>
      booking.date === dateString && booking.time === time
    );
  });

  return availableTimes;
};

/**
 * Submit a booking reservation
 * Validates and stores the booking, preventing double booking
 * @param {Object} formData - The booking form data
 * @param {string} formData.date - Reservation date (YYYY-MM-DD)
 * @param {string} formData.time - Reservation time (HH:MM)
 * @param {number} formData.guests - Number of guests
 * @param {string} formData.occasion - Special occasion (optional)
 * @returns {boolean} True if booking was successful, false otherwise
 */
export const submitAPI = function(formData) {
  // Validate required fields
  if (!formData.date || !formData.time) {
    console.error('Booking failed: Missing date or time');
    return false;
  }

  const bookedReservations = getBookedReservations();

  // Check if this time slot is already booked
  const isAlreadyBooked = bookedReservations.some(booking =>
    booking.date === formData.date && booking.time === formData.time
  );

  if (isAlreadyBooked) {
    console.error('Booking failed: This time slot is already booked');
    return false;
  }

  // Add the new booking
  bookedReservations.push({
    date: formData.date,
    time: formData.time,
    guests: formData.guests,
    occasion: formData.occasion || '',
    timestamp: new Date().toISOString()
  });

  // Save to storage
  saveBookedReservations(bookedReservations);

  console.log('Booking successful:', formData);
  return true;
};

/**
 * Get all booked reservations (useful for testing/debugging)
 * @returns {Array<Object>} Array of all bookings
 */
export const getAllBookings = () => {
  return getBookedReservations();
};

/**
 * Clear all bookings (useful for testing/debugging)
 */
export const clearAllBookings = () => {
  sessionStorage.removeItem(STORAGE_KEY);
};

// Export for window (if needed for testing or external access)
if (typeof window !== 'undefined') {
  window.fetchAPI = fetchAPI;
  window.submitAPI = submitAPI;
  window.getAllBookings = getAllBookings;
  window.clearAllBookings = clearAllBookings;
}
