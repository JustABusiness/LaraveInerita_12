<?php

namespace App\Http\Controllers\Backend\V1\User;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Backend\BaseController;
use App\Http\Requests\User\Catalogue\StoreRequest;
use App\Http\Requests\User\Catalogue\UpdateRequest;
use App\Services\Impl\V1\Permission\PermissionService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Http\Requests\User\UserCatalogue\BulkDestroyRequest;
use App\Services\Interfaces\User\UserCatalogueServiceInterface as UserCatalogueService;

class UserCatalogueController extends BaseController
{
    use AuthorizesRequests;
    protected $service;
    private $permissionService;

    public function __construct(
        UserCatalogueService $service,
        PermissionService $permissionService
    ) {
        $this->service = $service;
        $this->permissionService = $permissionService;
    }

    public function index(Request $request): JsonResponse
    {
        // $this->authorize('modules', 'user_catalogue.index');
        $data = $this->service->paginate($request);
        return $this->responseSuccess($data);
    }

    public function show(int $id): JsonResponse
    {
        // $this->authorize('modules', 'user_catalogue.index');
        $data = $this->service->show($id);
        return $this->responseSuccess($data);
    }

    public function store(StoreRequest $request): JsonResponse
    {
        // $this->authorize('modules', 'user_catalogue.store');
        $response = $this->service->save($request);
        return $this->handleAction($request, $response);
    }

    public function update(UpdateRequest $request, int $id): JsonResponse
    {
        // $this->authorize('modules', 'user_catalogue.update');
        $response = $this->service->save($request, $id);
        return $this->handleAction($request, $response);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->authorize('modules', 'user_catalogue.destroy');
        $response = $this->service->destroy($id);
        return $this->handleAction(request(), $response);
    }

    public function bulkDestroy(BulkDestroyRequest $request)
    {
        $this->authorize('modules', 'user_catalogue.bulkDestroy');
        $response = $this->service->bulkDestroy($request);
        return $this->handleAction($request, $response);
    }
}
