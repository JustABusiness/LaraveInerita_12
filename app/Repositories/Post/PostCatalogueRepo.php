<?php

namespace App\Repositories\Post;

use App\Repositories\BaseRepo;
use App\Models\PostCatalogue;

class PostCatalogueRepo extends BaseRepo
{
    public function __construct(PostCatalogue $model)
    {
         parent::__construct($model);
    }
}
