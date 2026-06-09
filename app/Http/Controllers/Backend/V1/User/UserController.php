<?php

namespace App\Http\Controllers\Backend\V1\User;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\User\User\StoreRequest;
use App\Http\Requests\User\User\UpdateRequest;
use App\Http\Controllers\Backend\BaseController;
use App\Http\Requests\User\User\BulkDestroyRequest;
use App\Services\Interfaces\User\UserServiceInterface as UserService;
use App\Services\Interfaces\User\UserCatalogueServiceInterface as UserCatalogueService;

class UserController extends BaseController
{
    protected $service;
    private $userCatalogueService;

    public function __construct(
        UserService $service,
        UserCatalogueService $userCatalogueService
    ) {
        $this->service = $service;
        $this->userCatalogueService = $userCatalogueService;
    }

    public function index(Request $request): JsonResponse
    {
        $data = $this->service->paginate($request);

        if ($request->has('get_catalogues')) {
            $catRequest = new Request(['type' => 'all']);
            $userCatalogues = $this->userCatalogueService->paginate($catRequest);

            return $this->responseSuccess([
                'users' => $data,
                'user_catalogues' => $userCatalogues
            ]);
        }

        return $this->responseSuccess($data);
    }

    public function show(int $id): JsonResponse
    {
        $data = $this->service->show($id);
        $userCatalogues = $this->userCatalogueService->paginate(new Request(['type' => 'all']));
        return $this->responseSuccess([
            'user' => $data,
            'user_catalogues' => $userCatalogues
        ]);
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
