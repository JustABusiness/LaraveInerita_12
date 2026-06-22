<?php

namespace App\Models;

use App\Traits\HasQuery;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class PostCatalogue extends Model
{
   use SoftDeletes, HasQuery;

   protected $fillable = [
      'name',
      'description',
      'user_id',
      'publish',
      'deleted_at'
   ];

   protected $relationtable = [ 
   ];

   protected $casts = [
      'publish' => 'integer',
      'created_at' => 'datetime:Y-m-d H:i',
      'updated_at' => 'datetime:Y-m-d H:i',
   ];

   public function creators(): BelongsTo
   { 
      return $this->belongsTo(User::class, 'user_id', 'id');
   }

   public function getRelationable()
   {
      return $this->relationtable;
   }


}
