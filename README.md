# SafeHands Insurance Booking Platform — Task 4

A simple admin dashboard for managing bookings: lists all bookings, lets the admin search by client name (client-side), and delete bookings — all protected behind an `is_admin` role check.

## Folder Structure

```
app/
├── Http/
│   ├── Controllers/Api/
│   │   └── AdminBookingController.php
│   └── Middleware/
│       └── EnsureUserIsAdmin.php
database/
├── migrations/
│   └── 2026_10_04_100000_add_is_admin_to_users_table.php
└── seeders/
    └── AdminUserSeeder.php
public/
└── admin/
    ├── index.html
    ├── css/admin.css
    └── js/admin.js
routes/
└── api.php (updated with admin routes)
```

## Setup

1. Copy `2026_10_04_100000_add_is_admin_to_users_table.php` into
   `database/migrations/`

2. Copy `AdminUserSeeder.php` into `database/seeders/`

3. Copy `EnsureUserIsAdmin.php` into `app/Http/Middleware/`

4. Copy `AdminBookingController.php` into `app/Http/Controllers/Api/`

5. Replace `routes/api.php` with the provided file (adds the
   `/api/admin/bookings` routes)

6. **Register the `admin` middleware alias** — open
   `bootstrap/app.php` and add it inside `->withMiddleware()`:

   ```php
   ->withMiddleware(function (Middleware $middleware) {
       $middleware->alias([
           'admin' => \App\Http\Middleware\EnsureUserIsAdmin::class,
       ]);
   })
   ```

7. Copy the `public/admin/` folder (index.html, css, js) into your
   project's `public/admin/` folder.

8. Run the migration and seed the admin user:
   ```bash
   php artisan migrate
   php artisan db:seed --class=AdminUserSeeder
   ```

9. Start the server:
   ```bash
   php artisan serve
   ```

10. Open the dashboard in the browser:
    ```
    http://127.0.0.1:8000/admin/
    ```

## Admin Login (seeded test account)

```
Email:    admin@safehands.com
Password: admin12345
```

## API Endpoints (Admin only)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/bookings` | List all bookings (any user). Optional `?search=name` query param also supported server-side. |
| DELETE | `/api/admin/bookings/{id}` | Delete a booking by ID. |

Both require:
```
Authorization: Bearer <token>
```
...from a user whose `is_admin` is `true`. Non-admin users get a `403 Forbidden`.

## How It Works

- **Role check:** `EnsureUserIsAdmin` middleware runs after `auth:sanctum` on the `admin` route group. It checks `$request->user()->is_admin` and returns `403` if false.
- **Dashboard login:** The admin logs in through the same `/api/auth/login` endpoint built in Task 3. The frontend checks `is_admin` in the response before showing the dashboard.
- **Loading bookings:** On login, the dashboard calls `GET /api/admin/bookings` once and stores the full list in memory.
- **Search:** Typing in the search box filters the in-memory list client-side (no extra API calls) by matching the client name.
- **Delete:** Clicking "Delete" asks for confirmation, calls `DELETE /api/admin/bookings/{id}`, and removes the row from the table immediately on success.

## What I Did

Added an `is_admin` flag to the users table, built a middleware to gate admin-only routes, created endpoints to list all bookings and delete one, seeded a hardcoded admin test user, and built a plain-JavaScript dashboard with login, a searchable table, and delete functionality — all connected to the Task 3 API.

## What Was Hard

Making sure the `admin` middleware ran *after* `auth:sanctum` (so `$request->user()` is available) rather than before was easy to get wrong, and deciding whether search should hit the API or filter client-side — I went with client-side since the task specifically asked for that, while still keeping a server-side `search` param available as a bonus.

## What I Left Out

There's no pagination on the bookings list (fine for a small dataset, but would be needed at scale), and the admin role is only a boolean flag rather than a full roles/permissions system — out of scope for this task.
