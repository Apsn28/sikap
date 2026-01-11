<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Check if admin exists, if not create it
        if (!User::where('email', 'admin@polri.go.id')->exists()) {
            User::create([
                'name' => 'Administrator',
                'email' => 'admin@polri.go.id',
                'password' => Hash::make('password'),
            ]);
        } else {
            // Update password just in case
            $user = User::where('email', 'admin@polri.go.id')->first();
            $user->password = Hash::make('password');
            $user->save();
        }
    }
}
