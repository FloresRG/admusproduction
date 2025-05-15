<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class AppServiceProvider extends ServiceProvider
{
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
   
    Inertia::share([
        'auth.user' => function () {
            if (! $user = Auth::user()) return null;
            return [
                'id'    => $user->id,
                'name'  => $user->name,
                'roles' => $user->getRoleNames()->toArray(),        // Collection de roles
                'perms' => $user->getPermissionNames(),  // Collection de permisos
            ];
        },
    ]);
    }
}
