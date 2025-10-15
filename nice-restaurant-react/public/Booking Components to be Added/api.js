// Store booked reservations in memory
const bookedReservations = [];

const seededRandom = function (seed) {
    var m = 2**35 - 31;
    var a = 185852;
    var s = seed % m;
    return function () {
        return (s = s * a % m) / m;
    };
}

const fetchAPI = function(date) {
    let result = [];
    let random = seededRandom(date.getDate());

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
    const availableTimes = result.filter(time => {
        return !bookedReservations.some(booking =>
            booking.date === dateString && booking.time === time
        );
    });

    return availableTimes;
};

const submitAPI = function(formData) {
    // Store the booking
    if (formData.date && formData.time) {
        bookedReservations.push({
            date: formData.date,
            time: formData.time,
            guests: formData.guests,
            occasion: formData.occasion
        });
        return true;
    }
    return false;
};

window.fetchAPI = fetchAPI;
window.submitAPI = submitAPI;
