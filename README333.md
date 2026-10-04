# SafeHands Insurance Booking Platform

A booking platform for **SafeHands Insurance Brokers**, built as part of an internship project. Clients can browse insurance packages and schedule consultations through a responsive landing page and a REST API backend.

**Intern:** Muhammad Mikail Khan
**Client:** SafeHands Insurance Brokers
**Stack:** HTML, CSS, JavaScript (frontend) · Laravel, PHP, MySQL (backend) · Laravel Sanctum (auth)

---

## Project Status

| # | Task | Status |
|---|---|---|
| 1 | Responsive landing page with booking form | ✅ Done |
| 2 | Database schema and migrations | ✅ Done |
| 3 | REST API for bookings and authentication | ✅ Done |
| 4 | Admin dashboard to manage bookings | ⬜ Upcoming |
| 5 | Deploy, document, and hand over | ⬜ Upcoming |

---

## Task 1 — Landing Page

A responsive landing page showcasing SafeHands' services, with a booking form (name, email, phone, preferred date/time), client-side validation, and a `fetch()` submission to `/api/bookings`.

- `index.html`, `css/style.css`, `js/script.js`
- Semantic HTML, Flexbox/Grid layout, mobile-responsive

## Task 2 — Database Schema & Migrations

Laravel migrations for `users`, `packages`, and `bookings`, with Eloquent models and relationships, plus a seeder for sample insurance packages.

**Schema:**

- **users** — `id`, `name`, `email`, `phone`, `password`, timestamps
- **packages** — `id`, `name`, `description`, `type`, `price`, `duration`, `is_active`, timestamps
- **bookings** — `id`, `user_id` (FK → users), `package_id` (FK → packages), `name`, `email`, `phone`, `preferred_datetime`, `status`, `notes`, timestamps

**Relationships:** A `User` has many `Bookings`. A `Package` has many `Bookings`. A `Booking` belongs to a `User` and a `Package`.

**Run:**
```bash
php artisan migrate --seed
```

## Task 3 — REST API & Authentication

Token-based authentication using **Laravel Sanctum**, plus booking endpoints scoped to the logged-in user.

| Method | Endpoint | Auth required | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register a new user, returns token |
| POST | `/api/auth/login` | No | Login, returns token |
| POST | `/api/auth/logout` | Yes | Revoke current token |
| GET | `/api/bookings` | Yes | List bookings for the logged-in user |
| POST | `/api/bookings` | Yes | Create a new booking |
| GET | `/api/bookings/{id}` | Yes | View a single booking |

Protected routes require the header: `Authorization: Bearer <token>`

All responses return JSON with appropriate HTTP status codes (`201` created, `200` success, `401` unauthorized, `404` not found, `422` validation error).

---

## Local Setup

```bash
composer install
cp .env.example .env
php artisan key:generate
# set DB_* values in .env, then:
php artisan migrate --seed
php artisan serve
```

API will be available at `http://127.0.0.1:8000/api`.

## What I Did

Built the full-stack foundation of the booking platform: a responsive landing page with a validated booking form, the database schema with migrations and relationships for users/packages/bookings, and a token-authenticated REST API covering registration, login, and booking creation/listing.

## What Was Hard

Getting the local environment set up correctly (PHP, Composer, and Sanctum configuration) took longer than expected, and making sure Sanctum's middleware and routes were wired up correctly so protected endpoints actually enforced authentication.

## What I Left Out

The admin dashboard, deployment, and full handover documentation are not part of this stage — those come in Tasks 4 and 5. The frontend landing page (Task 1) is not yet wired up to call the live API (Task 3); that integration is planned for a later step.
