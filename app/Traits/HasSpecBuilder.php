<?php

namespace App\Traits;

trait HasSpecBuilder
{
    protected function build($filter = [])
    {
        if (is_array($filter) && count($filter)) {
            $condition = [];
            foreach ($filter as $key => $value) {
                if ($this->request->has($value)) {
                    $condition[$value] = $this->request->input($value);
                }
            }
            return $condition;
        }
    }

    protected function specifications(): array
    {
        return [
            'all' => $this->request->input('type') === 'all',
            'perpage' => $this->request->input('perpage') ?? $this->perpage ?? 15,
            'sort' => $this->request->input('sort') ? explode('|', $this->request->input('sort')) : ($this->sort ?? []),
            'with' => $this->with ?? [],
            'filter' => [
                'simple' => $this->build($this->simpleFilter),
                'keyword' => [
                    'q' => $this->request->input('keyword'),
                    'fields' => $this->searchFields,
                    'isMultiLanguage' => $this->isMultiLanguage ?? false,
                ],
                'complex' => $this->build($this->complexFilter),
                'date' => $this->build($this->dateFilter),
                'with' => $this->build($this->withFilter),
            ]
        ];
    }

}
