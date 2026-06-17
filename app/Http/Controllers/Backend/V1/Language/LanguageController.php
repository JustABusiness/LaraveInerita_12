<?php

namespace App\Http\Controllers\Backend\V1\Language;
 
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\Language\StoreRequest;
use App\Http\Requests\Language\UpdateRequest;
use App\Http\Controllers\Backend\BaseController;
use App\Http\Requests\Language\BulkDestroyRequest;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Services\Interfaces\Language\LanguageServiceInterface as LanguageService;

class LanguageController extends BaseController
{ 
    use AuthorizesRequests;
    protected $service;

    public function __construct(  
        LanguageService $service
    ) {
        $this->service = $service;
    }

    public function index(Request $request): JsonResponse 
    {
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

    public function changeStatus(Request $request): JsonResponse
    {
        $response = $this->service->updateStatus($request->input());
        return $this->handleAction($request, $response);
    }
}
