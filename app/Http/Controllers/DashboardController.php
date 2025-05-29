<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        return match (true) {
            $user->hasRole('admin') => Inertia::render('Dashboard/Admin', [
                'user' => Auth::user(),
            ]),
            $user->hasRole('influencer') => Inertia::render('Dashboard/Influencer', [
                'user' => Auth::user(),
            ]),
            $user->hasRole('pasante') => Inertia::render('Dashboard/Pasante', [
                'user' => Auth::user(),
            ]),
            default => abort(403, 'Acceso no autorizado'),
        };
    }
}
