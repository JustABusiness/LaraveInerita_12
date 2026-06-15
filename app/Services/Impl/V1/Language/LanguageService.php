<?php

namespace App\Services\Impl\V1\Language;

use Illuminate\Support\Facades\Auth;
use App\Services\Impl\V1\BaseService;
use App\Repositories\Language\LanguageRepo;
use App\Services\Interfaces\Language\LanguageServiceInterface;

class LanguageService extends BaseService implements LanguageServiceInterface
{
    protected $repository;
    protected $perpage;
    protected $with = ['creators'];
    protected $simpleFilter = ['id', 'publish'];
    protected $searchFields = ['name', 'description'];

    public function __construct(LanguageRepo $repository)
    {
        $this->repository = $repository;
        parent::__construct($repository);
    }

    protected function prepareModelData(): static
    {
        $fillable = $this->repository->getFillable();
        $this->modelData = $this->request->only($fillable);
        $this->modelData['user_id'] = Auth::id();
        return $this;
    }

}
