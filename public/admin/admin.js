// ===== SafeHands Admin Dashboard =====

const API_BASE = '/api';

const loginScreen = document.getElementById('login-screen');
const dashboardScreen = document.getElementById('dashboard-screen');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');
const searchInput = document.getElementById('search-input');
const bookingsTbody = document.getElementById('bookings-tbody');
const emptyState = document.getElementById('empty-state');
const resultsCount = document.getElementById('results-count');
const statusMessage = document.getElementById('status-message');

// Holds every booking fetched from the API; search filters this in-memory.
let allBookings = [];

function getToken() {
  return sessionStorage.getItem('admin_token');
}

function setToken(token) {
  sessionStorage.setItem('admin_token', token);
}

function clearToken() {
  sessionStorage.removeItem('admin_token');
}

function showDashboard() {
  loginScreen.classList.add('hidden');
  dashboardScreen.classList.remove('hidden');
  loadBookings();
}

function showLogin() {
  dashboardScreen.classList.add('hidden');
  loginScreen.classList.remove('hidden');
}

function showStatus(message, type) {
  statusMessage.textContent = message;
  statusMessage.className = 'status-message ' + type;
  setTimeout(() => {
    statusMessage.className = 'status-message';
  }, 3000);
}

// ---- Login ----
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginError.textContent = '';

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      loginError.textContent = data.message || 'Login failed.';
      return;
    }

    // Reject non-admin users right here on the client too
    if (!data.user.is_admin) {
      loginError.textContent = 'This account does not have admin access.';
      return;
    }

    setToken(data.token);
    loginForm.reset();
    showDashboard();
  } catch (error) {
    loginError.textContent = 'Could not connect to the server.';
    console.error('Login error:', error);
  }
});

// ---- Logout ----
logoutBtn.addEventListener('click', async () => {
  try {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
    });
  } catch (error) {
    console.error('Logout request failed:', error);
  } finally {
    clearToken();
    allBookings = [];
    showLogin();
  }
});

// ---- Load bookings from the admin API ----
async function loadBookings() {
  try {
    const response = await fetch(`${API_BASE}/admin/bookings`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
    });

    if (response.status === 401 || response.status === 403) {
      showStatus('Session expired or access denied. Please log in again.', 'error');
      clearToken();
      showLogin();
      return;
    }

    const data = await response.json();
    allBookings = data.bookings || [];
    renderBookings(allBookings);
  } catch (error) {
    showStatus('Could not load bookings.', 'error');
    console.error('Load bookings error:', error);
  }
}

// ---- Render the table rows ----
function renderBookings(bookings) {
  bookingsTbody.innerHTML = '';

  if (bookings.length === 0) {
    emptyState.classList.remove('hidden');
  } else {
    emptyState.classList.add('hidden');
  }

  resultsCount.textContent = `${bookings.length} booking${bookings.length !== 1 ? 's' : ''}`;

  bookings.forEach((booking) => {
    const row = document.createElement('tr');

    const dateFormatted = booking.preferred_datetime
      ? new Date(booking.preferred_datetime).toLocaleString()
      : '-';

    const packageName = booking.package ? booking.package.name : '-';

    row.innerHTML = `
      <td>${escapeHtml(booking.name)}</td>
      <td>${escapeHtml(packageName)}</td>
      <td>${escapeHtml(dateFormatted)}</td>
      <td><span class="status-badge status-${booking.status}">${escapeHtml(booking.status)}</span></td>
      <td><button class="delete-btn" data-id="${booking.id}">Delete</button></td>
    `;

    bookingsTbody.appendChild(row);
  });

  // Attach delete handlers to the newly created buttons
  document.querySelectorAll('.delete-btn').forEach((btn) => {
    btn.addEventListener('click', () => handleDelete(btn.dataset.id, btn));
  });
}

// ---- Client-side search filter (no extra API call) ----
searchInput.addEventListener('input', () => {
  const term = searchInput.value.trim().toLowerCase();

  const filtered = allBookings.filter((booking) =>
    booking.name.toLowerCase().includes(term)
  );

  renderBookings(filtered);
});

// ---- Delete a booking ----
async function handleDelete(id, button) {
  const confirmed = confirm('Are you sure you want to delete this booking?');
  if (!confirmed) return;

  button.disabled = true;
  button.textContent = 'Deleting...';

  try {
    const response = await fetch(`${API_BASE}/admin/bookings/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      showStatus(data.message || 'Could not delete booking.', 'error');
      button.disabled = false;
      button.textContent = 'Delete';
      return;
    }

    // Remove from local list and re-render (updates the list immediately)
    allBookings = allBookings.filter((b) => b.id != id);
    renderBookings(allBookings);
    showStatus('Booking deleted successfully.', 'success');
  } catch (error) {
    showStatus('Network error while deleting booking.', 'error');
    console.error('Delete error:', error);
    button.disabled = false;
    button.textContent = 'Delete';
  }
}

// ---- Basic HTML escaping to keep injected data safe ----
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

// ---- On page load, check if already logged in ----
if (getToken()) {
  showDashboard();
} else {
  showLogin();
}
