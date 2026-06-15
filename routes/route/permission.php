<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/permission', function () {
        return Inertia::render('permission/index');
    })->name('permission.index');

    Route::get('/permission/create', function () {
        return Inertia::render('permission/save');
    })->name('permission.create');

    Route::get('/permission/{id}/edit', function ($id) {
        return Inertia::render('permission/save', ['id' => $id] );
    })->name('permission.edit');
});
