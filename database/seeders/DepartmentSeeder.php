<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        $departments = [
            ['department_name' => 'Information Technology', 'department_code' => 'IT'],
            ['department_name' => 'Computer Science', 'department_code' => 'CS'],
            ['department_name' => 'Software Engineering', 'department_code' => 'SE'],
            ['department_name' => 'Data Science', 'department_code' => 'DS'],
            ['department_name' => 'Information Systems', 'department_code' => 'IS'],
        ];

        foreach ($departments as $dept) {
            Department::create($dept);
        }
    }
}
