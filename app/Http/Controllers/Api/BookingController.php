<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BookingController extends Controller
{
    /**
     * Return the list of bookings for the authenticated user.
     * GET /api/bookings
     */
    public function index(Request $request)
    {
        $bookings = Booking::with('package')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json([
            'message' => 'Bookings retrieved successfully.',
            'bookings' => $bookings,
        ], 200);
    }

    /**
     * Create a new booking linked to the authenticated user.
     * POST /api/bookings
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'package_id' => 'required|exists:packages,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'preferred_datetime' => 'required|date|after:now',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $booking = Booking::create([
            'user_id' => $request->user()->id,
            'package_id' => $request->package_id,
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'preferred_datetime' => $request->preferred_datetime,
            'notes' => $request->notes,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Booking created successfully.',
            'booking' => $booking->load('package'),
        ], 201);
    }

    /**
     * Show a single booking (only if it belongs to the authenticated user).
     * GET /api/bookings/{id}
     */
    public function show(Request $request, $id)
    {
        $booking = Booking::with('package')
            ->where('user_id', $request->user()->id)
            ->find($id);

        if (! $booking) {
            return response()->json([
                'message' => 'Booking not found.',
            ], 404);
        }

        return response()->json([
            'message' => 'Booking retrieved successfully.',
            'booking' => $booking,
        ], 200);
    }
}
