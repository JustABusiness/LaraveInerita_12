<?php

namespace App\Services\Impl\V1\User;

use Illuminate\Support\Facades\Auth;
use App\Services\Impl\V1\BaseService;
use App\Repositories\User\UserRepo;
use App\Services\Interfaces\User\UserServiceInterface;

class UserService extends BaseService implements UserServiceInterface
{
    protected $repository;
    protected $perpage;
    protected $searchFields = ['name','email', 'address']; 
    protected $with = ['user_catalogue'];

    public function __construct(UserRepo $repository)
    {
        $this->repository = $repository;
        parent::__construct($repository);
    }

    protected function prepareModelData(): static
    {
        $fillable = $this->repository->getFillable();
        $this->modelData = $this->request->only($fillable);
        
        if ($this->request->filled('password')) {
            $this->modelData['password'] = bcrypt($this->request->input('password'));
        } else {
            unset($this->modelData['password']);
        }

        return $this;
    }

    protected function beforeSave(): static
    {
        return $this;
    }

    protected function withRelation(): static
    {
        if ($this->request->filled('user_catalogue_ids')) {
            $this->model->user_catalogue()->sync($this->request->input('user_catalogue_ids'));
        }
        return $this;
    }

    protected function afterSave(): static
    {
        return $this;
    }

}



