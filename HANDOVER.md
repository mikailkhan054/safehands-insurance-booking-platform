# SafeHands Insurance Booking Platform — Handover Note

**Prepared by:** Muhammad Mikail Khan
**Project:** SafeHands Insurance Booking Platform (Internship Project — Ezitech)
**Repository:** https://github.com/mikailkhan054/safehands-insurance-booking-platform

---

## 1. Project Overview

A booking platform for SafeHands Insurance Brokers. Clients can view insurance packages and request a consultation through a public landing page. An authenticated admin can view, search, and manage all bookings through a dashboard.

## 2. Architecture

```
                    ┌─────────────────────────┐
                    │   Client's Browser       │
                    └───────────┬─────────────┘
                                │
                 ┌──────────────┴──────────────┐
                 │                              │
                 ▼                              ▼
     ┌───────────────────────┐     ┌────────────────────────┐
     │  Public Landing Page   │     │   Admin Dashboard       │
     │  /landing/              │     │   /admin/                │
     │  (HTML, CSS, JS)        │     │   (HTML, CSS, JS)        │
     └───────────┬─────────────┘     └────────────┬─────────────┘
                 │                                 │
                 │        fetch() / JSON           │
                 ▼                                 ▼
     ┌─────────────────────────────────────────────────────────┐
     │                Laravel REST API (/api)                   │
     │  ───────────────────────────────────────────────────     │
     │  /api/auth/register, /api/auth/login   (Sanctum tokens)   │
     │  /api/bookings           (create/list - authenticated)    │
     │  /api/admin/bookings     (list/delete - admin only)       │
     └───────────────────────────┬─────────────────────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │     MySQL Database        │
                    │  users, packages, bookings │
                    └─────────────────────────┘
```

**Flow summary:**
1. A client fills the booking form on the landing page.
2. The form calls the Laravel REST API (`/api/bookings`).
3. The API validates the request, checks authentication (Sanctum token), and writes to the MySQL database.
4. The admin logs into `/admin/`, which also talks to the same API, but through `/api/admin/*` routes protected by an `is_admin` middleware check.
5. The admin can view all bookings, search by client name (filtered client-side in the browser), and delete bookings — each action calling the API directly.

## 3. Tech Stack

| Layer | Technology |
|---|---|
| Frontend (landing page + admin) | HTML, CSS, vanilla JavaScript (`fetch` API) |
| Backend | Laravel (PHP) |
| Authentication | Laravel Sanctum (token-based) |
| Database | MySQL |
| Hosting | Render (backend + database) |

## 4. What Was Built (Task Summary)

| Task | What it covers |
|---|---|
| 1 | Responsive landing page with a validated booking form |
| 2 | Database schema: `users`, `packages`, `bookings` tables with relationships |
| 3 | REST API: registration, login, booking create/list, Sanctum auth |
| 4 | Admin dashboard: list all bookings, client-side search, delete |
| 5 | Deployment, documentation, and this handover note |

## 5. Known Limitations / Not Yet Done

- The public landing page form is not yet fully wired to the live API — submitting it currently requires an authenticated user and a `package_id`, which the public form does not yet collect or supply. This is a planned next step, not a bug in what was built.
- No automated tests (unit/feature tests) were written.
- No pagination on the bookings list — fine for a small dataset, but would need it at scale.
- The admin role is a simple `is_admin` boolean, not a full roles/permissions system.
- No password reset or email verification flow.
- No rate limiting configured on the authentication routes.

## 6. Future Improvement Ideas

1. **Connect the public booking form to the live API** — let a guest (unauthenticated) client submit a booking directly, or add a simple account-creation step before booking.
2. **Package selection on the landing page** — show the seeded packages as selectable options in the booking form instead of a hardcoded `package_id`.
3. **Email notifications** — notify the client and the admin when a new booking is created (e.g. using Laravel's built-in Mail/Notifications).
4. **Pagination and sorting** on the admin dashboard once the number of bookings grows.
5. **Booking status management** — let the admin change a booking's status (pending → confirmed → cancelled) from the dashboard, not just delete it.
6. **Automated tests** — Laravel feature tests for the auth and booking endpoints.
7. **Proper roles/permissions** (e.g. using a package like Spatie Permission) instead of a single `is_admin` flag, for future growth (multiple admin levels).
8. **CI/CD** — auto-deploy to Render on every push to `main` using GitHub Actions.

## 7. Credentials for Review (Test Admin Account)

```
Email:    admin@safehands.com
Password: admin12345
```

*(Seeded via `AdminUserSeeder` — intended for review/demo purposes only; should be changed or removed before real production use.)*

## 8. Deployment

See `README.md` for full deployment steps, environment variables, and the live URL.
