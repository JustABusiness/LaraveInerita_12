<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/ielts/documents', function () {
        return Inertia::render('ielts/documents');
    })->name('ielts.documents');

    Route::get('/ielts/mock-tests', function () {
        return Inertia::render('ielts/mock-tests');
    })->name('ielts.mock-tests');
});
