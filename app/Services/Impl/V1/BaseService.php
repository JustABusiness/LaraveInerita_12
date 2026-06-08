<?php

namespace App\Services\Impl\V1;

use Illuminate\Http\Request;
use App\Traits\HasSpecBuilder;
use App\Traits\HasTransaction;
use App\Services\Interfaces\BaseServiceInteface;

abstract class BaseService implements BaseServiceInteface
{
    use HasTransaction, HasSpecBuilder;

    protected $repository;
    protected $request;
    protected $modelData;
    protected $model;
    protected $result;
    protected $withRelation;
    protected $afterSave;
    protected $with = [];
    protected $perpage = 20;
    protected $simpleFilter = ['publish'];
    protected $complexFilter = ['id'];
    protected $searchFields = ['name'];
    protected $dateFilter = ['created_at', 'updated_at'];
    protected $sort = ['id', 'desc'];

    public function __construct(mixed $repository)
    {
        $this->repository = $repository;
    }

    protected abstract function prepareModelData(): static;

    protected function setRequest($request): static
    {
        $this->request = $request;
        return $this;
    }
    public function save(Request $request, ?int $id = null)
    {
        try {
            return $this->beginTransaction()
                ->setRequest($request)
                ->prepareModelData()
                ->beforeSave()
                ->saveModel($id)
                ->withRelation()
                ->afterSave()
                ->commit()
                ->getResult();

        } catch (\Throwable $th) {
            $this->rollback();
            return false;
        }
    }

    private function saveModel(?int $id = null): static
    {
        $this->model = $id ? $this->repository->update($id, $this->modelData) : $this->repository->create($this->modelData);
        $this->result = $this->model;
        return $this;
    }

    private function getResult()
    {
        return $this->result;
    }

    public function findById(int $id)
    {
        $this->model = $this->repository->findById($id, $this->with);
    }

    public function show(int $id)
    {
        $this->findById($id);
        $this->result = $this->model;
        return $this->getResult();
    }

    public function paginate(Request $request)
    {
        $this->setRequest($request);
        $specification = $this->specifications();
        $this->result = $this->repository->pagination($specification);
        return $this->getResult();
    }

    public function destroy(int $id)
    {
        try {
            return $this->beginTransaction()
                ->beforeDelete($id)
                ->deleteModel()
                ->afterDelete()
                ->commit()
                ->getResult();

        } catch (\Throwable $th) {
            $this->rollBack();
            return false;
        }
    }

    public function deleteModel(): static
    {
        $this->result = $this->model->delete();
        return $this;
    }

    public function bulkDestroy(Request $request)
    {
        try {
            return $this->beginTransaction()
                ->setRequest($request)
                ->bulkDestroyModel()
                ->afterBulkDestroy()
                ->commit()
                ->getResult();
        } catch (\Throwable $th) {
            $this->rollback();
            return false;
        }
    }

    public function updateStatus(array $post = [])
    {
        try {
            return $this->beginTransaction()
                ->updateStatusModel($post)
                ->commit()
                ->getResult();
        } catch (\Throwable $th) {
            $this->rollback();
            return false;
        }
    }

    private function updateStatusModel(array $post = []): static
    {
        $payload[$post['field']] = $post['value'];
        $this->model = $this->repository->update($post['id'], $payload);
        $this->result = $this->model;
        return $this;
    }

    public function bulkDestroyModel()
    {
        $this->result = $this->repository->bulkDestroy($this->request->input('ids', []));
        return $this;
    }
}
