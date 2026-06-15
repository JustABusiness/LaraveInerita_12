<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/language', function () {
        return Inertia::render('language/index');
    })->name('language.index');

    Route::get('/language/create', function () {
        return Inertia::render('language/save');
    })->name('language.create');

    Route::get('/language/{id}/edit', function ($id) {
        return Inertia::render('language/save', [
            'id' => $id
        ]);
    })->name('language.edit');  
});
