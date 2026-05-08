<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'id' => 1,
                'name' => 'Mark Jovic A. Daday',
                'full_name' => 'Mark Jovic A. Daday',
                'email' => 'teacher@gmail.com',
                'password' => Hash::make('password'),
                'department_id' => 1,
                'role' => 'Teacher',
                'avatar' => 'MD',
                'status' => 'Active',
            ],
            [
                'id' => 4,
                'name' => 'Von Esson Vergara',
                'full_name' => 'Von Esson Vergara',
                'email' => 'admin@gmail.com',
                'password' => Hash::make('password'),
                'department_id' => 1,
                'role' => 'Admin',
                'avatar' => 'VV',
                'status' => 'Active',
            ],
            [
                'id' => 5,
                'name' => 'Maria Santos',
                'full_name' => 'Maria Santos',
                'email' => 'teacher2@gmail.com',
                'password' => Hash::make('password'),
                'department_id' => 2,
                'role' => 'Teacher',
                'avatar' => 'MS',
                'status' => 'Active',
            ],
            [
                'id' => 8,
                'name' => 'Pedro Garcia',
                'full_name' => 'Pedro Garcia',
                'email' => 'inactive.teacher@gmail.com',
                'password' => Hash::make('password'),
                'department_id' => 2,
                'role' => 'Teacher',
                'avatar' => 'PG',
                'status' => 'Inactive',
            ],
        ];

        foreach ($users as $user) {
            User::updateOrCreate(['id' => $user['id']], $user);
        }

        User::whereNotIn('role', ['Admin', 'Teacher'])->delete();
    }
}
