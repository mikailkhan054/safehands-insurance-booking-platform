<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'package_id',
        'name',
        'email',
        'phone',
        'preferred_datetime',
        'status',
        'notes',
    ];

    protected $casts = [
        'preferred_datetime' => 'datetime',
    ];

    /**
     * A booking belongs to a user.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * A booking belongs to a package.
     */
    public function package(): BelongsTo
    {
        return $this->belongsTo(Package::class);
    }
}
