<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {

    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        Gate::define('modules', function ($user, $permission) {
            $user->loadMissing('user_catalogue.permissions');
            $permissions = $user->user_catalogue->flatMap(fn ($catalogue) => $catalogue->permissions)->pluck('canonical')->unique()->values();
            
            return $permissions->contains($permission);
        });
    }}
 