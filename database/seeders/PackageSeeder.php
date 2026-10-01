<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Package;

class PackageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $packages = [
            [
                'name' => 'Basic Life Shield',
                'description' => 'Affordable life insurance coverage for individuals starting out, with essential protection for your family.',
                'type' => 'life',
                'price' => 2500.00,
                'duration' => '1 year',
                'is_active' => true,
            ],
            [
                'name' => 'Family Health Plus',
                'description' => 'Comprehensive health insurance plan covering hospitalization, checkups, and emergency care for the whole family.',
                'type' => 'health',
                'price' => 4800.00,
                'duration' => '1 year',
                'is_active' => true,
            ],
            [
                'name' => 'Home Guard Complete',
                'description' => 'Full protection for your home and belongings against fire, theft, and natural disasters.',
                'type' => 'home',
                'price' => 3200.00,
                'duration' => '1 year',
                'is_active' => true,
            ],
        ];

        foreach ($packages as $package) {
            Package::create($package);
        }
    }
}
