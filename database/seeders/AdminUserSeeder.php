<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Creates one hardcoded admin user for testing the admin dashboard.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@safehands.com'],
            [
                'name' => 'SafeHands Admin',
                'phone' => '03000000000',
                'password' => Hash::make('admin12345'),
                'is_admin' => true,
            ]
        );
    }
}
