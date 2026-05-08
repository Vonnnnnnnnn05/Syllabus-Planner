<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AuthRoutesTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_with_valid_credentials_returns_user_and_token(): void
    {
        $user = User::factory()->create([
            'full_name' => 'Teacher One',
            'email' => 'teacher1@example.test',
            'password' => bcrypt('password'),
            'role' => 'Teacher',
            'status' => 'Active',
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'teacher1@example.test',
            'password' => 'password',
        ]);

        $response->assertOk()
            ->assertJsonStructure([
                'token',
                'session_authenticated',
                'user' => ['id', 'fullName', 'email', 'role'],
            ])
            ->assertJsonPath('user.id', $user->id)
            ->assertJsonPath('user.email', $user->email)
            ->assertJsonPath('session_authenticated', false);
    }

    public function test_login_with_invalid_credentials_returns_validation_error(): void
    {
        User::factory()->create([
            'email' => 'teacher2@example.test',
            'password' => bcrypt('password'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'teacher2@example.test',
            'password' => 'wrong-password',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_me_requires_authentication(): void
    {
        $this->getJson('/api/me')->assertStatus(401);
    }

    public function test_me_returns_current_user_for_authenticated_request(): void
    {
        $user = User::factory()->create([
            'full_name' => 'Dean User',
            'role' => 'Dean',
            'status' => 'Active',
        ]);

        Sanctum::actingAs($user);

        $this->getJson('/api/me')
            ->assertOk()
            ->assertJsonPath('id', $user->id)
            ->assertJsonPath('email', $user->email)
            ->assertJsonPath('role', 'Dean');
    }

    public function test_admin_only_route_blocks_teacher_and_returns_role_map(): void
    {
        $teacher = User::factory()->create([
            'role' => 'Teacher',
            'status' => 'Active',
        ]);

        Sanctum::actingAs($teacher);

        $this->postJson('/api/users', [
            'name' => 'New Admin',
            'email' => 'newadmin@example.test',
            'password' => 'password',
            'role' => 'Admin',
            'status' => 'Active',
        ])
            ->assertStatus(403)
            ->assertJsonPath('message', 'Access denied by role.')
            ->assertJsonPath('your_role', 'Teacher')
            ->assertJsonStructure([
                'required_roles',
                'role_access_map',
            ]);
    }

    public function test_admin_only_route_allows_admin(): void
    {
        $admin = User::factory()->create([
            'role' => 'Admin',
            'status' => 'Active',
        ]);

        Sanctum::actingAs($admin);

        $this->postJson('/api/users', [
            'name' => 'Created User',
            'email' => 'created@example.test',
            'password' => 'password',
            'role' => 'Teacher',
            'status' => 'Active',
        ])->assertStatus(201);

        $this->assertDatabaseHas('users', [
            'email' => 'created@example.test',
            'role' => 'Teacher',
        ]);
    }

    public function test_logout_requires_authentication(): void
    {
        $this->postJson('/api/logout')->assertStatus(401);
    }

    public function test_logout_returns_success_for_authenticated_user(): void
    {
        $user = User::factory()->create([
            'role' => 'Teacher',
            'status' => 'Active',
        ]);

        Sanctum::actingAs($user);

        $this->postJson('/api/logout')
            ->assertOk()
            ->assertJsonPath('message', 'Logged out successfully');
    }
}
