<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Http\Resources\Json\JsonResource;

class AppServiceProvider extends ServiceProvider
{
    public array $bindings = [
        \App\Services\Interfaces\User\UserCatalogueServiceInterface::class => \App\Services\Impl\V1\User\UserCatalogueService::class,
        \App\Services\Interfaces\User\UserServiceInterface::class => \App\Services\Impl\V1\User\UserService::class,
        \App\Services\Interfaces\Permission\PermissionServiceInterface::class => \App\Services\Impl\V1\Permission\PermissionService::class,
        \App\Services\Interfaces\Language\LanguageServiceInterface::class => \App\Services\Impl\V1\Language\LanguageService::class,
    ];

    /** 
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        JsonResource::withoutWrapping(); 
    }
}
