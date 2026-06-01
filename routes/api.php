<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Backend\V1\User\UserCatalogueController;

use App\Http\Controllers\Backend\V1\Permission\PermissionController;

Route::prefix('v1')->group(function () {
    Route::post('user_catalogue/bulk-destroy', [UserCatalogueController::class, 'bulkDestroy']);
    Route::apiResource('user_catalogue', UserCatalogueController::class);
    
    Route::post('permission/bulk-destroy', [\App\Http\Controllers\Backend\V1\Permission\PermissionController::class, 'bulkDestroy']);
    Route::apiResource('permission', \App\Http\Controllers\Backend\V1\Permission\PermissionController::class);

    Route::post('user/bulk-destroy', [\App\Http\Controllers\Backend\V1\User\UserController::class, 'bulkDestroy']);
    Route::apiResource('user', \App\Http\Controllers\Backend\V1\User\UserController::class);
});
