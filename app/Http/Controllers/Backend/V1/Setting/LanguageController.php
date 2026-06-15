<?php

namespace App\Http\Controllers\Backend\V1\Setting;
 
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Backend\BaseController;
use App\Http\Requests\Setting\Language\StoreRequest;
use App\Http\Requests\Setting\Language\UpdateRequest;
use App\Http\Requests\Setting\Language\BulkDestroyRequest;
use App\Services\Interfaces\Language\LanguageServiceInterface as LanguageService;

class LanguageController extends BaseController
{  
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
}
 