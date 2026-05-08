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
                'name' => 'Mark Jovic A. Daday',
                'full_name' => 'Mark Jovic A. Daday',
                'email' => 'mjdaday@sku.edu.ph',
                'password' => Hash::make('password'),
                'department_id' => 1,
                'role' => 'Teacher',
                'avatar' => 'MD',
                'status' => 'Active',
            ],
            [
                'name' => 'Rubin B. Cerilo',
                'full_name' => 'Rubin B. Cerilo',
                'email' => 'rbc@sku.edu.ph',
                'password' => Hash::make('password'),
                'department_id' => 1,
                'role' => 'Program Chair',
                'avatar' => 'RC',
                'status' => 'Active',
            ],
            [
                'name' => 'Elbren O. Antonio',
                'full_name' => 'Elbren O. Antonio',
                'email' => 'eoa@sku.edu.ph',
                'password' => Hash::make('password'),
                'department_id' => 1,
                'role' => 'Dean',
                'avatar' => 'EA',
                'status' => 'Active',
            ],
            [
                'name' => 'Von Esson Vergara',
                'full_name' => 'Von Esson Vergara',
                'email' => 'vev@sku.edu.ph',
                'password' => Hash::make('password'),
                'department_id' => 1,
                'role' => 'Admin',
                'avatar' => 'VV',
                'status' => 'Active',
            ],
            [
                'name' => 'Maria Santos',
                'full_name' => 'Maria Santos',
                'email' => 'ms@sku.edu.ph',
                'password' => Hash::make('password'),
                'department_id' => 2,
                'role' => 'Teacher',
                'avatar' => 'MS',
                'status' => 'Active',
            ],
            [
                'name' => 'Juan Cruz',
                'full_name' => 'Juan Cruz',
                'email' => 'jc@sku.edu.ph',
                'password' => Hash::make('password'),
                'department_id' => 1,
                'role' => 'Department Head',
                'avatar' => 'JC',
                'status' => 'Active',
            ],
            [
                'name' => 'Ana Reyes',
                'full_name' => 'Ana Reyes',
                'email' => 'ar@sku.edu.ph',
                'password' => Hash::make('password'),
                'department_id' => 1,
                'role' => 'Coordinator',
                'avatar' => 'AR',
                'status' => 'Active',
            ],
            [
                'name' => 'Pedro Garcia',
                'full_name' => 'Pedro Garcia',
                'email' => 'pg@sku.edu.ph',
                'password' => Hash::make('password'),
                'department_id' => 2,
                'role' => 'Teacher',
                'avatar' => 'PG',
                'status' => 'Inactive',
            ],
        ];

        foreach ($users as $user) {
            User::create($user);
        }
    }
}
