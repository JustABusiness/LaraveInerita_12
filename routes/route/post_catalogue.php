<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/post_catalogue', function () {
        return Inertia::render('post/post_catalogue/index');
    })->name('post_catalogue.index');

    Route::get('/post_catalogue/create', function () {
        return Inertia::render('post/post_catalogue/save');
    })->name('post_catalogue.create');

    Route::get('/post_catalogue/{id}/edit', function ($id) {
        return Inertia::render('post/post_catalogue/save', [
            'id' => $id
        ]); 
    })->name('post_catalogue.edit');  
});
