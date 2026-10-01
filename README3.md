# SafeHands Insurance Booking Platform — Task 3

REST API for user authentication (Laravel Sanctum) and booking management.

## Folder Structure

```
app/
├── Http/
│   └── Controllers/
│       └── Api/
│           ├── AuthController.php
│           └── BookingController.php
├── Models/
│   └── User.php (updated with HasApiTokens)
routes/
└── api.php
```

## Setup

1. Install Sanctum (skip if already installed):
   ```bash
   composer require laravel/sanctum
   php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
   php artisan migrate
   ```

2. Copy `AuthController.php` and `BookingController.php` into
   `app/Http/Controllers/Api/`

3. Replace `app/Models/User.php` with the updated version (adds the
   `HasApiTokens` trait).

4. Replace `routes/api.php` with the provided file.

5. Make sure `bootstrap/app.php` (Laravel 11+) has the `api` routes
   file enabled:
   ```php
   ->withRouting(
       web: __DIR__.'/../routes/web.php',
       api: __DIR__.'/../routes/api.php',
       commands: __DIR__.'/../routes/console.php',
       health: '/up',
   )
   ```

## API Endpoints

| Method | Endpoint | Auth required | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register a new user, returns token |
| POST | `/api/auth/login` | No | Login, returns token |
| POST | `/api/auth/logout` | Yes | Revoke current token |
| GET | `/api/bookings` | Yes | List bookings for the logged-in user |
| POST | `/api/bookings` | Yes | Create a new booking |
| GET | `/api/bookings/{id}` | Yes | View a single booking |

Protected routes require the header:
```
Authorization: Bearer <token>
```

## Sample Requests (using Postman or curl)

**Register**
```bash
curl -X POST http://127.0.0.1:8000/api/auth/register \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{"name":"Ali Khan","email":"ali@example.com","phone":"03001234567","password":"secret123","password_confirmation":"secret123"}'
```

**Login**
```bash
curl -X POST http://127.0.0.1:8000/api/auth/login \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{"email":"ali@example.com","password":"secret123"}'
```

**Create Booking** (replace `<token>` with the token from login/register)
```bash
curl -X POST http://127.0.0.1:8000/api/bookings \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"package_id":1,"name":"Ali Khan","email":"ali@example.com","phone":"03001234567","preferred_datetime":"2026-10-05 10:00:00"}'
```

**List Bookings**
```bash
curl -X GET http://127.0.0.1:8000/api/bookings \
  -H "Accept: application/json" \
  -H "Authorization: Bearer <token>"
```

## Error Handling

- Invalid input → `422` with a `errors` object describing each field
- Wrong email/password on login → `401`
- Booking not found / not owned by user → `404`
- Missing or invalid token on protected route → `401`

## What I Did

Built authentication (register/login/logout) using Laravel Sanctum for
token-based auth, and booking endpoints (create/list/view) scoped to
the logged-in user via `auth:sanctum` middleware, with validation and
proper JSON responses and status codes on every route.

## What Was Hard

Getting the Sanctum middleware and `bootstrap/app.php` routing
registration right so that `/api` routes actually loaded was the
trickiest part, along with making sure every response — success and
error — returns a consistent JSON shape.

## What I Left Out

Password reset and email verification flows are not implemented, and
there is no rate limiting configured on the auth routes yet — both
would be good next steps but were outside this task's scope.
