<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;

class AdminBookingController extends Controller
{
    /**
     * Return ALL bookings (any user), with optional search by client name.
     * GET /api/admin/bookings?search=ali
     */
    public function index(Request $request)
    {
        $query = Booking::with(['user', 'package']);

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $bookings = $query->latest()->get();

        return response()->json([
            'message' => 'Bookings retrieved successfully.',
            'bookings' => $bookings,
        ], 200);
    }

    /**
     * Delete a booking by ID.
     * DELETE /api/admin/bookings/{id}
     */
    public function destroy($id)
    {
        $booking = Booking::find($id);

        if (! $booking) {
            return response()->json([
                'message' => 'Booking not found.',
            ], 404);
        }

        $booking->delete();

        return response()->json([
            'message' => 'Booking deleted successfully.',
        ], 200);
    }
}
