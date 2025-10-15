import { useState } from 'react';

export default function BookingForm({
  date,
  setDate,
  time,
  setTime,
  guests,
  setGuests,
  occasion,
  setOccasion,
  availableTimes,
  dispatch,
  submitForm
}) {
  // Validation error states
  const [errors, setErrors] = useState({
    date: '',
    time: '',
    guests: '',
    occasion: ''
  });

  // Touched fields tracking
  const [touched, setTouched] = useState({
    date: false,
    time: false,
    guests: false,
    occasion: false
  });

  // Get today's date in YYYY-MM-DD format for min validation
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Get max date (e.g., 3 months from now)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return maxDate.toISOString().split('T')[0];
  };

  // Validate date field
  const validateDate = (value) => {
    if (!value) {
      return 'Date is required';
    }
    const selectedDate = new Date(value);
    const today = new Date(getTodayDate());
    const maxDate = new Date(getMaxDate());

    if (selectedDate < today) {
      return 'Date cannot be in the past';
    }
    if (selectedDate > maxDate) {
      return 'Date cannot be more than 3 months in the future';
    }
    return '';
  };

  // Validate time field
  const validateTime = (value) => {
    if (!value) {
      return 'Time is required';
    }
    return '';
  };

  // Validate guests field
  const validateGuests = (value) => {
    if (!value) {
      return 'Number of guests is required';
    }
    const numGuests = parseInt(value, 10);
    if (isNaN(numGuests)) {
      return 'Please enter a valid number';
    }
    if (numGuests < 1) {
      return 'Minimum 1 guest required';
    }
    if (numGuests > 10) {
      return 'Maximum 10 guests allowed';
    }
    return '';
  };

  // Validate occasion field (optional but can add custom logic)
  const validateOccasion = (value) => {
    // Occasion is optional, so no validation needed
    return '';
  };

  // Handle date change with validation
  const handleDateChange = (e) => {
    const value = e.target.value;
    setDate(value);
    if (dispatch) {
      dispatch({ type: 'UPDATE_TIMES', date: value });
    }

    if (touched.date) {
      setErrors(prev => ({ ...prev, date: validateDate(value) }));
    }
  };

  // Handle date blur
  const handleDateBlur = () => {
    setTouched(prev => ({ ...prev, date: true }));
    setErrors(prev => ({ ...prev, date: validateDate(date) }));
  };

  // Handle time change with validation
  const handleTimeChange = (e) => {
    const value = e.target.value;
    setTime(value);

    if (touched.time) {
      setErrors(prev => ({ ...prev, time: validateTime(value) }));
    }
  };

  // Handle time blur
  const handleTimeBlur = () => {
    setTouched(prev => ({ ...prev, time: true }));
    setErrors(prev => ({ ...prev, time: validateTime(time) }));
  };

  // Handle guests change with validation
  const handleGuestsChange = (e) => {
    const value = e.target.value;
    setGuests(value);

    if (touched.guests) {
      setErrors(prev => ({ ...prev, guests: validateGuests(value) }));
    }
  };

  // Handle guests blur
  const handleGuestsBlur = () => {
    setTouched(prev => ({ ...prev, guests: true }));
    setErrors(prev => ({ ...prev, guests: validateGuests(guests) }));
  };

  // Handle occasion change
  const handleOccasionChange = (e) => {
    const value = e.target.value;
    setOccasion(value);

    if (touched.occasion) {
      setErrors(prev => ({ ...prev, occasion: validateOccasion(value) }));
    }
  };

  // Handle occasion blur
  const handleOccasionBlur = () => {
    setTouched(prev => ({ ...prev, occasion: true }));
    setErrors(prev => ({ ...prev, occasion: validateOccasion(occasion) }));
  };

  // Handle form submit with complete validation
  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      date: true,
      time: true,
      guests: true,
      occasion: true
    });

    // Validate all fields
    const newErrors = {
      date: validateDate(date),
      time: validateTime(time),
      guests: validateGuests(guests),
      occasion: validateOccasion(occasion)
    };

    setErrors(newErrors);

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some(error => error !== '');

    if (!hasErrors) {
      const formData = {
        date,
        time,
        guests,
        occasion
      };

      submitForm(formData);
    }
  };

  return (
    <form className="booking-form php-email-form" onSubmit={handleSubmit} noValidate>
      <div className="row gy-4">
        <div className="col-md-6">
          <label htmlFor="res-date" className="form-label">
            Choose Date <span className="text-danger">*</span>
          </label>
          <input
            type="date"
            className={`form-control ${touched.date && errors.date ? 'is-invalid' : ''}`}
            id="res-date"
            name="res-date"
            value={date}
            onChange={handleDateChange}
            onBlur={handleDateBlur}
            min={getTodayDate()}
            max={getMaxDate()}
            required
            aria-required="true"
            aria-invalid={touched.date && errors.date ? 'true' : 'false'}
            aria-describedby={errors.date ? 'date-error' : undefined}
          />
          {touched.date && errors.date && (
            <div id="date-error" className="invalid-feedback d-block" role="alert">
              {errors.date}
            </div>
          )}
        </div>

        <div className="col-md-6">
          <label htmlFor="res-time" className="form-label">
            Choose Time <span className="text-danger">*</span>
          </label>
          <select
            className={`form-control form-select ${touched.time && errors.time ? 'is-invalid' : ''}`}
            id="res-time"
            name="res-time"
            value={time}
            onChange={handleTimeChange}
            onBlur={handleTimeBlur}
            required
            aria-required="true"
            aria-invalid={touched.time && errors.time ? 'true' : 'false'}
            aria-describedby={errors.time ? 'time-error' : undefined}
          >
            <option value="">Select a time</option>
            {availableTimes && availableTimes.map((availableTime) => (
              <option key={availableTime} value={availableTime}>
                {availableTime}
              </option>
            ))}
          </select>
          {touched.time && errors.time && (
            <div id="time-error" className="invalid-feedback d-block" role="alert">
              {errors.time}
            </div>
          )}
        </div>

        <div className="col-md-6">
          <label htmlFor="guests" className="form-label">
            Number of Guests <span className="text-danger">*</span>
          </label>
          <input
            type="number"
            className={`form-control ${touched.guests && errors.guests ? 'is-invalid' : ''}`}
            placeholder="1"
            min="1"
            max="10"
            step="1"
            id="guests"
            name="guests"
            value={guests}
            onChange={handleGuestsChange}
            onBlur={handleGuestsBlur}
            required
            aria-required="true"
            aria-invalid={touched.guests && errors.guests ? 'true' : 'false'}
            aria-describedby={errors.guests ? 'guests-error' : undefined}
          />
          {touched.guests && errors.guests && (
            <div id="guests-error" className="invalid-feedback d-block" role="alert">
              {errors.guests}
            </div>
          )}
        </div>

        <div className="col-md-6">
          <label htmlFor="occasion" className="form-label">
            Occasion (Optional)
          </label>
          <select
            className={`form-control form-select ${touched.occasion && errors.occasion ? 'is-invalid' : ''}`}
            id="occasion"
            name="occasion"
            value={occasion}
            onChange={handleOccasionChange}
            onBlur={handleOccasionBlur}
            aria-invalid={touched.occasion && errors.occasion ? 'true' : 'false'}
            aria-describedby={errors.occasion ? 'occasion-error' : undefined}
          >
            <option value="">Select an occasion</option>
            <option value="Birthday">Birthday</option>
            <option value="Anniversary">Anniversary</option>
            <option value="Date Night">Date Night</option>
            <option value="Business">Business Meeting</option>
            <option value="Other">Other</option>
          </select>
          {touched.occasion && errors.occasion && (
            <div id="occasion-error" className="invalid-feedback d-block" role="alert">
              {errors.occasion}
            </div>
          )}
        </div>

        <div className="col-12 text-center">
          <button
            type="submit"
            className="btn-book-table"
            aria-label="Submit reservation booking form"
          >
            <i className="bi bi-calendar-check me-2"></i>
            Make Your Reservation
          </button>
        </div>
      </div>
    </form>
  );
}
