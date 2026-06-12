<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/user_catalogue', function () {
        return Inertia::render('user/user_catalogue/index');
    })->name('user_catalogue.index');

    Route::get('/user_catalogue/create', function () {
        return Inertia::render('user/user_catalogue/save');
    })->name('user_catalogue.create');

    Route::get('/user_catalogue/{id}/edit', function ($id) {
        return Inertia::render('user/user_catalogue/save', ['id' => $id]);
    })->name('user_catalogue.edit');

    Route::get('/user', function () {
        return Inertia::render('user/user/index');
    })->name('user.index');

    Route::get('/user/create', function () {
        return Inertia::render('user/user/save');
    })->name('user.create');

    Route::get('/user/{id}/edit', function ($id) {
        return Inertia::render('user/user/save', [
            'id' => $id
        ]);
    })->name('user.edit');
});

