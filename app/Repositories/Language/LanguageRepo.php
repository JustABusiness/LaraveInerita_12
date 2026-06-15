<?php

namespace App\Repositories\Language;

use App\Repositories\BaseRepo;
use App\Models\Language;

class LanguageRepo extends BaseRepo
{
    public function __construct(Language $model)
    {
         parent::__construct($model);
    }
}
