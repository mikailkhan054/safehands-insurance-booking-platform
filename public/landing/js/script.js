// ===== SafeHands Booking Form =====
// Handles client-side validation and submits booking data to /api/bookings

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('booking-form');
  const submitBtn = document.getElementById('submit-btn');
  const statusBox = document.getElementById('form-status');

  const fields = {
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
    datetime: document.getElementById('datetime'),
  };

  const errors = {
    name: document.getElementById('name-error'),
    email: document.getElementById('email-error'),
    phone: document.getElementById('phone-error'),
    datetime: document.getElementById('datetime-error'),
  };

  // Simple validators for each field
  const validators = {
    name: (value) => {
      if (!value.trim()) return 'Name is required.';
      if (value.trim().length < 3) return 'Name must be at least 3 characters.';
      return '';
    },
    email: (value) => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) return 'Email is required.';
      if (!emailPattern.test(value.trim())) return 'Please enter a valid email address.';
      return '';
    },
    phone: (value) => {
      const phonePattern = /^[0-9+\-\s]{10,15}$/;
      if (!value.trim()) return 'Phone number is required.';
      if (!phonePattern.test(value.trim())) return 'Please enter a valid phone number (10-15 digits).';
      return '';
    },
    datetime: (value) => {
      if (!value) return 'Please select a preferred date and time.';
      const selected = new Date(value);
      if (selected < new Date()) return 'Please choose a future date and time.';
      return '';
    },
  };

  // Validate a single field and show/hide its error message
  function validateField(fieldName) {
    const value = fields[fieldName].value;
    const message = validators[fieldName](value);

    if (message) {
      errors[fieldName].textContent = message;
      fields[fieldName].classList.add('invalid');
    } else {
      errors[fieldName].textContent = '';
      fields[fieldName].classList.remove('invalid');
    }
    return !message;
  }

  // Validate on blur so users get feedback as they go
  Object.keys(fields).forEach((fieldName) => {
    fields[fieldName].addEventListener('blur', () => validateField(fieldName));
  });

  function validateAll() {
    let isValid = true;
    Object.keys(fields).forEach((fieldName) => {
      const fieldValid = validateField(fieldName);
      if (!fieldValid) isValid = false;
    });
    return isValid;
  }

  function showStatus(message, type) {
    statusBox.textContent = message;
    statusBox.className = 'form-status ' + type;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusBox.className = 'form-status';
    statusBox.textContent = '';

    if (!validateAll()) {
      showStatus('Please fix the errors above before submitting.', 'error');
      return;
    }

    const payload = {
      name: fields.name.value.trim(),
      email: fields.email.value.trim(),
      phone: fields.phone.value.trim(),
      datetime: fields.datetime.value,
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Server responded with status ' + response.status);
      }

      showStatus('Your consultation has been booked! We will contact you soon.', 'success');
      form.reset();
    } catch (error) {
      // Note: /api/bookings requires authentication (Task 3) and a package_id,
      // so this public form will currently show an error when submitted as-is.
      // Wiring this up fully is planned for a later integration step.
      showStatus('Could not submit booking right now. Please try again later.', 'error');
      console.error('Booking submission failed:', error);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Confirm Booking';
    }
  });
});
