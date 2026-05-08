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
                'id' => 2,
                'name' => 'Rubin B. Cerilo',
                'full_name' => 'Rubin B. Cerilo',
                'email' => 'programchair@gmail.com',
                'password' => Hash::make('password'),
                'department_id' => 1,
                'role' => 'Program Chair',
                'avatar' => 'RC',
                'status' => 'Active',
            ],
            [
                'id' => 3,
                'name' => 'Elbren O. Antonio',
                'full_name' => 'Elbren O. Antonio',
                'email' => 'dean@gmail.com',
                'password' => Hash::make('password'),
                'department_id' => 1,
                'role' => 'Dean',
                'avatar' => 'EA',
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
                'id' => 6,
                'name' => 'Juan Cruz',
                'full_name' => 'Juan Cruz',
                'email' => 'departmenthead@gmail.com',
                'password' => Hash::make('password'),
                'department_id' => 1,
                'role' => 'Department Head',
                'avatar' => 'JC',
                'status' => 'Active',
            ],
            [
                'id' => 7,
                'name' => 'Ana Reyes',
                'full_name' => 'Ana Reyes',
                'email' => 'coordinator@gmail.com',
                'password' => Hash::make('password'),
                'department_id' => 1,
                'role' => 'Coordinator',
                'avatar' => 'AR',
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
    }
}
