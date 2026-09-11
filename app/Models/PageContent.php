<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageContent extends Model
{
    protected $fillable = [
        'page_key',
        'section_key',
        'field_key',
        'field_type',
        'value',
        'sort_order',
    ];
}
