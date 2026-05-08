<?php

namespace App\Http\Controllers\Api\Concerns;

use App\Models\Course;
use App\Models\User;

trait HandlesRoleAccess
{
    protected function role(?User $user): string
    {
        return strtolower(trim((string) ($user?->role ?? '')));
    }

    protected function isRole(User $user, array $roles): bool
    {
        return in_array($this->role($user), array_map(fn ($role) => strtolower($role), $roles), true);
    }

    protected function canViewAllData(User $user): bool
    {
        return $this->isRole($user, ['Admin', 'Dean']);
    }

    protected function canManageUsers(User $user): bool
    {
        return $this->isRole($user, ['Admin']);
    }

    protected function canManageDepartments(User $user): bool
    {
        return $this->isRole($user, ['Admin', 'Dean', 'Department Head']);
    }

    protected function isDepartmentScopedRole(User $user): bool
    {
        return $this->isRole($user, ['Program Chair', 'Department Head', 'Coordinator']);
    }

    protected function isTeacher(User $user): bool
    {
        return $this->isRole($user, ['Teacher']);
    }

    protected function canAccessCourse(User $user, Course $course): bool
    {
        if ($this->canViewAllData($user)) {
            return true;
        }

        if ($this->isDepartmentScopedRole($user)) {
            return (int) $course->department_id === (int) $user->department_id;
        }

        if ($this->isTeacher($user)) {
            return (int) $course->user_id === (int) $user->id;
        }

        return (int) $course->user_id === (int) $user->id;
    }
}