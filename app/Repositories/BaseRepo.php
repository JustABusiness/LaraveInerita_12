<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;

class BaseRepo
{
    protected $model;
    protected $payload;
    protected $specs = [];

    public function __construct($model)
    {
        $this->model = $model;
    }

    public function pushSpec(\Closure $spec): static
    {
        $this->specs[] = $spec;
        return $this;
    }

    public function applySpecs($query)
    {
        foreach ($this->specs as $spec) {
            $query = $spec($query);
        }
        return $query;
    }

    public function getFillable(): array
    {
        return $this->model->getFillable();
    }

    public function getRelationable(): array
    {
        return method_exists($this->model, 'getRelationable') ? $this->model->getRelationable() : [];
    }

    public function create(array $payload = []): Model|null
    {
        return $this->model->create($payload)->fresh();
    }

    public function update(int $id, array $payload = []): Model
    {
        $model = $this->findById($id);
        $model->fill($payload);
        $model->save();
        return $model;
    }

    public function findById(int $id, array $with = [], array $columns = ['*']): Model
    {
        return $this->model->select($columns)->with($with)->findOrFail($id);
    }

    public function pagination(array $specs = [])
    {
        $query = $this->model
            ->with($specs['with'] ?? [])
            ->keyword($specs['filter']['keyword'] ?? [])
            ->complexFilter($specs['filter']['complex'] ?? [])
            ->dateFilter($specs['filter']['date'] ?? [])
            ->simpleFilter($specs['filter']['simple'] ?? []);

        $query = $this->applySpecs($query);

        $query->when(!empty($specs['sort']), function ($query) use ($specs) {
            return $query->orderBy($specs['sort'][0], $specs['sort'][1] ?? 'asc');
        });

        return $specs['all']
            ? $query->get()
            : $query->paginate($specs['perpage'] ?? 15)->withQueryString();
    }

    public function bulkDestroy(array $ids = [], ?bool $foreceDelete = false)
    {
        return $foreceDelete ? $this->model->whereIn('id', $ids)->forceDelete() : $this->model->whereIn('id', $ids)->delete();
    }
}
