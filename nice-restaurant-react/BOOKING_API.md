# Booking API Documentation

This document describes the booking API implementation for the Little Lemon Restaurant application, including the double-booking prevention system.

## Overview

The booking system uses a client-side API with sessionStorage persistence to manage restaurant reservations. It prevents double bookings by tracking reserved time slots and filtering them from available times.

## API Location

```
src/utils/api.js
```

## Core Functions

### fetchAPI(date)

Fetches available time slots for a given date, automatically filtering out already booked times.

**Parameters:**
- `date` (Date): The date to fetch available times for

**Returns:**
- `Array<string>`: Array of available time slots in "HH:MM" format (e.g., ['17:00', '18:30'])

**Example:**
```javascript
import { fetchAPI } from '../utils/api';

const date = new Date('2025-12-25');
const availableTimes = fetchAPI(date);
// Returns: ['17:00', '17:30', '18:00', ...] (excluding booked times)
```

**How It Works:**
1. Generates random time slots from 5:00 PM to 11:00 PM using a seeded random generator
2. Retrieves existing bookings from sessionStorage
3. Filters out times that are already booked for the selected date
4. Returns only available times

**Time Slot Generation:**
- Uses a seeded random number generator for consistent results
- Generates slots between 17:00 (5 PM) and 23:00 (11 PM)
- Each hour can have :00 and :30 minute slots
- Randomness is based on the day of the month

### submitAPI(formData)

Submits a booking reservation and stores it in sessionStorage.

**Parameters:**
- `formData` (Object): The booking data
  - `date` (string): Reservation date in YYYY-MM-DD format (required)
  - `time` (string): Reservation time in HH:MM format (required)
  - `guests` (number): Number of guests (required)
  - `occasion` (string): Special occasion (optional)

**Returns:**
- `boolean`: `true` if booking was successful, `false` if failed

**Example:**
```javascript
import { submitAPI } from '../utils/api';

const bookingData = {
  date: '2025-12-25',
  time: '18:00',
  guests: 4,
  occasion: 'Birthday'
};

const success = submitAPI(bookingData);
if (success) {
  console.log('Booking confirmed!');
} else {
  console.error('Booking failed - time slot may already be booked');
}
```

**Validation:**
1. Checks that both `date` and `time` are provided
2. Verifies the time slot isn't already booked for that date
3. If validation passes, adds booking to sessionStorage
4. Returns `true` on success, `false` on failure

**Double-Booking Prevention:**
The function automatically checks if a time slot is already booked:
```javascript
const isAlreadyBooked = bookedReservations.some(booking =>
  booking.date === formData.date && booking.time === formData.time
);

if (isAlreadyBooked) {
  console.error('Booking failed: This time slot is already booked');
  return false;
}
```

### getAllBookings()

Retrieves all stored bookings (useful for debugging/testing).

**Returns:**
- `Array<Object>`: Array of all booking objects

**Example:**
```javascript
import { getAllBookings } from '../utils/api';

const allBookings = getAllBookings();
console.log('Total bookings:', allBookings.length);
allBookings.forEach(booking => {
  console.log(`${booking.date} at ${booking.time} - ${booking.guests} guests`);
});
```

### clearAllBookings()

Clears all bookings from sessionStorage (useful for testing/debugging).

**Example:**
```javascript
import { clearAllBookings } from '../utils/api';

clearAllBookings();
console.log('All bookings cleared');
```

## Data Storage

### Storage Mechanism

Bookings are stored in the browser's `sessionStorage`:
- **Key**: `littleLemonBookings`
- **Format**: JSON stringified array of booking objects
- **Persistence**: Data persists during the browser session
- **Scope**: Per browser tab/window

### Booking Object Structure

Each booking stored has the following structure:
```javascript
{
  date: "2025-12-25",      // YYYY-MM-DD format
  time: "18:00",           // HH:MM format
  guests: 4,               // Number (1-10)
  occasion: "Birthday",    // String (optional)
  timestamp: "2025-10-15T02:00:00.000Z"  // ISO timestamp
}
```

### Why SessionStorage?

- **Client-side persistence**: No backend required for MVP
- **Tab-isolated**: Each tab has its own booking set (prevents conflicts)
- **Temporary**: Clears when tab/window closes (good for demo)
- **Easy migration**: Can be replaced with a real API later

## Integration with BookingPage

### Component Setup

```javascript
import { useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAPI, submitAPI } from '../utils/api';

function initializeTimes() {
  const today = new Date();
  return fetchAPI(today);
}

function updateTimes(state, action) {
  if (action.type === 'UPDATE_TIMES' && action.date) {
    const selectedDate = new Date(action.date);
    return fetchAPI(selectedDate);
  }
  return state;
}

export default function BookingPage() {
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
      // Handle booking failure (time slot already taken)
      alert('Sorry, this time slot is no longer available. Please choose another time.');
    }
  };

  // ... rest of component
}
```

### Workflow

1. **Initial Load**:
   - `initializeTimes()` is called
   - Fetches available times for today
   - Filters out any already booked times

2. **Date Selection**:
   - User selects a date
   - `dispatch({ type: 'UPDATE_TIMES', date: selectedDate })` is called
   - `updateTimes()` fetches new available times for that date
   - Time dropdown updates with available slots

3. **Booking Submission**:
   - User fills form and submits
   - `submitForm()` calls `submitAPI()`
   - If successful, navigates to confirmation page
   - If time is taken, shows error message

4. **Double-Booking Prevention**:
   - Each time `fetchAPI()` is called, it checks existing bookings
   - Already booked time slots are automatically filtered out
   - User can only select from genuinely available times

## Testing the API

### Manual Testing

```javascript
// 1. Book a time slot
const booking1 = {
  date: '2025-12-25',
  time: '18:00',
  guests: 4,
  occasion: 'Dinner'
};
console.log('First booking:', submitAPI(booking1)); // Should return true

// 2. Try to book the same time (should fail)
const booking2 = {
  date: '2025-12-25',
  time: '18:00',  // Same date and time
  guests: 2,
  occasion: 'Date'
};
console.log('Double booking:', submitAPI(booking2)); // Should return false

// 3. Check available times (should not include 18:00)
const availableTimes = fetchAPI(new Date('2025-12-25'));
console.log('Available times:', availableTimes); // 18:00 should be missing

// 4. View all bookings
console.log('All bookings:', getAllBookings());

// 5. Clear all bookings
clearAllBookings();
console.log('After clear:', getAllBookings()); // Should be empty array
```

### Unit Tests

```javascript
import { describe, test, expect, beforeEach } from 'vitest';
import { fetchAPI, submitAPI, getAllBookings, clearAllBookings } from '../utils/api';

describe('Booking API', () => {
  beforeEach(() => {
    clearAllBookings();
  });

  test('fetchAPI returns array of time slots', () => {
    const times = fetchAPI(new Date('2025-12-25'));
    expect(Array.isArray(times)).toBe(true);
    expect(times.length).toBeGreaterThan(0);
  });

  test('submitAPI stores booking successfully', () => {
    const booking = {
      date: '2025-12-25',
      time: '18:00',
      guests: 4,
      occasion: 'Birthday'
    };

    expect(submitAPI(booking)).toBe(true);
    expect(getAllBookings()).toHaveLength(1);
  });

  test('prevents double booking', () => {
    const booking1 = { date: '2025-12-25', time: '18:00', guests: 4 };
    const booking2 = { date: '2025-12-25', time: '18:00', guests: 2 };

    expect(submitAPI(booking1)).toBe(true);
    expect(submitAPI(booking2)).toBe(false);
    expect(getAllBookings()).toHaveLength(1);
  });

  test('filters out booked times from available times', () => {
    const date = new Date('2025-12-25');
    const timesBefore = fetchAPI(date);

    submitAPI({ date: '2025-12-25', time: timesBefore[0], guests: 2 });

    const timesAfter = fetchAPI(date);
    expect(timesAfter).not.toContain(timesBefore[0]);
    expect(timesAfter.length).toBeLessThan(timesBefore.length);
  });
});
```

## Migration to Real API

When moving to a production backend, replace the functions in `src/utils/api.js`:

```javascript
export const fetchAPI = async (date) => {
  const response = await fetch(`/api/available-times?date=${date.toISOString()}`);
  return response.json();
};

export const submitAPI = async (formData) => {
  const response = await fetch('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  return response.ok;
};
```

The rest of the application code remains unchanged!

## Error Handling

### Current Implementation

```javascript
const success = submitAPI(formData);
if (success) {
  // Booking confirmed
  navigate('/booking-confirmed', { state: { booking: formData } });
} else {
  // Booking failed
  alert('This time slot is no longer available');
}
```

### Recommended Production Error Handling

```javascript
try {
  const success = await submitAPI(formData);
  if (success) {
    navigate('/booking-confirmed', { state: { booking: formData } });
  } else {
    setError('This time slot is no longer available. Please select another time.');
    // Refresh available times
    dispatch({ type: 'UPDATE_TIMES', date: formData.date });
  }
} catch (error) {
  setError('Failed to submit booking. Please try again.');
  console.error('Booking error:', error);
}
```

## Browser Compatibility

- **sessionStorage**: Supported in all modern browsers (IE8+)
- **JSON methods**: Supported in all modern browsers
- **Fallback**: If sessionStorage is unavailable, bookings will be in-memory only

## Security Considerations

### Current (Client-Side)

- ⚠️ Data can be manipulated by users (DevTools)
- ⚠️ No server-side validation
- ⚠️ No protection against malicious bookings
- ✅ Safe for development/demo purposes

### Production Recommendations

1. **Server-side validation**: Always validate bookings on the backend
2. **Authentication**: Require user login for bookings
3. **Rate limiting**: Prevent spam bookings
4. **CAPTCHA**: Protect against bots
5. **Database transactions**: Ensure atomic booking operations
6. **Conflict resolution**: Handle race conditions with database locks

## Performance Considerations

- **SessionStorage limits**: ~5-10MB per origin (more than enough for bookings)
- **JSON parsing**: Minimal overhead for typical booking volumes
- **Memory efficiency**: Bookings are stored compressed in sessionStorage
- **Scalability**: For production, move to database with proper indexing

## Future Enhancements

1. **Booking capacity**: Support multiple tables/parties per time slot
2. **Waitlist**: Allow customers to join a waitlist for full time slots
3. **Modifications**: Enable customers to modify/cancel bookings
4. **Notifications**: Send confirmation emails/SMS
5. **Admin panel**: Staff interface to manage bookings
6. **Analytics**: Track popular times, average party size, etc.
