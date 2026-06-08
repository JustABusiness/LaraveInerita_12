<?php

namespace App\Http\Controllers\Backend\V1\Permission;
 
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Backend\BaseController;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Http\Requests\Permission\Permission\StoreRequest;
use App\Http\Requests\Permission\Permission\UpdateRequest;
use App\Http\Requests\Permission\Permission\BulkDestroyRequest;
use App\Services\Interfaces\Permission\PermissionServiceInterface as PermissionService;

class PermissionController extends BaseController
{ 
    use AuthorizesRequests;
    protected $service;

    public function __construct(  
        PermissionService $service
    ) {
        $this->service = $service;
    }

    public function index(Request $request): JsonResponse
    {
        // $this->authorize('modules', 'permission.index');
        $data = $this->service->paginate($request); 
        return $this->responseSuccess($data);
    }

    public function show(int $id): JsonResponse
    {
        $data = $this->service->show($id);
        return $this->responseSuccess($data);
    }

    public function store(StoreRequest $request): JsonResponse
    {
        $response = $this->service->save($request);
        return $this->handleAction($request, $response);
    }

    public function update(UpdateRequest $request, int $id): JsonResponse
    {
        $response = $this->service->save($request, $id);
        return $this->handleAction($request, $response);
    }

    public function destroy(int $id): JsonResponse 
    {
        $response = $this->service->destroy($id);
        return $this->handleAction(request(), $response);
    }

    public function bulkDestroy(BulkDestroyRequest $request)
    { 
        $response = $this->service->bulkDestroy($request);
        return $this->handleAction($request, $response);
    } 
}
 