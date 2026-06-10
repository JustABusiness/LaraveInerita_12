<?php

namespace App\Traits;

use Illuminate\Support\Carbon;

trait HasQuery
{
    public function scopeSimpleFilter($query, array $filters = [])
    {
        if (is_array($filters) && count($filters)) {
            foreach ($filters as $field => $value) {
                if (!empty($value) || $value === 0 || $value === '0') {
                    $query->where($field, $value);
                }
            }
        }
        return $query;
    }

    public function scopeKeyword($query, $keyword = [])
    {
        if (isset($keyword['q']) && !is_null($keyword['q'])) {
            if (!$keyword['isMultiLanguage']) {
                $query->where(function ($q) use ($keyword) {
                    foreach ($keyword['fields'] as $field) {
                        $q->orWhere($field, 'LIKE', '%' . $keyword['q'] . '%');
                    }
                });
            } else {
                $query->whereHas('languages', function ($q) use ($keyword) {
                    $q->where(function ($subQuery) use ($keyword) {
                        foreach ($keyword['fields'] as $field) {
                            $subQuery->orWhere($field, 'LIKE', '%' . $keyword['q'] . '%');
                        }
                    });
                });
            }
        }
        return $query;
    }

    public function scopeComplexFilter($query, array $filters = [])
    {
        if (is_array($filters) && count($filters)) {
            foreach ($filters as $field => $condition) {
                if (count($condition)) {
                    foreach ($condition as $operator => $value) {
                        switch ($operator) {
                            case 'gt':
                                $query->where($field, '>', $value);
                                break;
                            case 'gte':
                                $query->where($field, '>=', $value);
                                break;
                            case 'lt':
                                $query->where($field, '<', $value);
                                break;
                            case 'lte':
                                $query->where($field, '<=', $value);
                                break;
                            case 'eq':
                                $query->where($field, '=', $value);
                                break;
                            case 'between':
                                $parts = explode(',', $value);
                                if (count($parts) === 2) {
                                    [$min, $max] = $parts;
                                    $query->whereBetween($field, [$min, $max]);
                                }
                                break;
                            case 'in':
                                $in = explode(',', $value);
                                if (count($in)) {
                                    $query->whereIn($field, $in);
                                }
                                break;
                            default:
                                // code...
                                break;
                        }
                    }
                }

            }
        }
        return $query;
    }

    public function scopeWithFilter($query, array $filters = [])
    {
        if (count($filters)) {
            foreach ($filters as $model => $condition) {
                $query->whereHas($model, function ($subQuery) use ($condition) {
                    $this->applyRelationRecursive($subQuery, $condition);
                });
            }
        }
        return $query;
    }

    public function scopeDateFilter($query, array $filters = [])
    {
        if (is_array($filters) && count($filters)) {
            foreach ($filters as $field => $condition) {
                if (count($condition)) {
                    foreach ($condition as $operator => $value) {
                        switch ($operator) {
                            case 'gt':
                                $query->where($field, '>', Carbon::parse($value)->startOfDay());
                                break;
                            case 'gte':
                                $query->where($field, '>=', Carbon::parse($value)->startOfDay());
                                break;
                            case 'lt':
                                $query->where($field, '<', Carbon::parse($value)->endOfDay());
                                break;
                            case 'lte':
                                $query->where($field, '<=', Carbon::parse($value)->endOfDay());
                                break;
                            case 'eq':
                                $query->where($field, '=', Carbon::parse($value)->startOfDay());
                                break;
                            case 'between':
                                [$startDate, $endDate] = explode(',', $value);
                                $startDate = Carbon::parse($startDate)->startOfDay();
                                $endDate = Carbon::parse($endDate)->endOfDay();
                                if (isset($startDate) && isset($endDate) && $startDate < $endDate) {
                                    $query->whereBetween($field, [$startDate, $endDate]);
                                }
                                break;
                            default:
                                // code...
                                break;
                        }
                    }
                }
            }
        }
        return $query;
    }

    private function applyRelationRecursive($query, array $conditions = [])
    {
        $fieldConditions = [];
        $relationConditions = [];
        $operatorArray = array_flip(['gt', 'gte', 'lt', 'lte', 'eq', 'between', 'like', 'in']);

        foreach ($conditions as $key => $value) {
            if (isset($value) && is_array($value) && !array_key_exists($key, $operatorArray)) {
                $relationConditions[$key] = $value; 
            } else {
                $fieldConditions[$key] = $value;
            }
        }
        
        $this->scopeComplexFilter($query, $fieldConditions);
        if (is_array($relationConditions) && count($relationConditions)){
            foreach ($relationConditions as $relation => $condition) {
                $query->whereHas($relation, function ($subQuery) use ($condition) {
                    $this->applyRelationRecursive($subQuery, $condition);
                });
            }
        }

        return $query;
    }
}
