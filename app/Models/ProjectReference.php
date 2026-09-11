<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectReference extends Model
{
    protected $fillable = ['category', 'no', 'client', 'user', 'year', 'project'];

    protected function casts(): array
    {
        return [
            'year' => 'integer',
        ];
    }
}
