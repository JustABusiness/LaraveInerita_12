<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Backend\V1\User\UserCatalogueController;


Route::prefix('v1')->group(function () {
    Route::post('user_catalogue/bulk-destroy', [UserCatalogueController::class, 'bulkDestroy']);
    Route::apiResource('user_catalogue', UserCatalogueController::class);
    
    Route::post('permission/bulk-destroy', [\App\Http\Controllers\Backend\V1\Permission\PermissionController::class, 'bulkDestroy']);
    Route::apiResource('permission', \App\Http\Controllers\Backend\V1\Permission\PermissionController::class);

    Route::post('language/bulk-destroy', [\App\Http\Controllers\Backend\V1\Language\LanguageController::class, 'bulkDestroy']);
    Route::post('language/change-status', [\App\Http\Controllers\Backend\V1\Language\LanguageController::class, 'changeStatus']);
    Route::apiResource('language', \App\Http\Controllers\Backend\V1\Language\LanguageController::class);

    Route::post('user/bulk-destroy', [\App\Http\Controllers\Backend\V1\User\UserController::class, 'bulkDestroy']);
    Route::post('user/change-status', [\App\Http\Controllers\Backend\V1\User\UserController::class, 'changeStatus']);
    Route::apiResource('user', \App\Http\Controllers\Backend\V1\User\UserController::class);
});
