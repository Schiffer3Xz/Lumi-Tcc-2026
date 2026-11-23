<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class ReadingRule extends Model
{
    protected $fillable = ['text'];

    public static function displayList(): Builder
    {
        return static::query()->select('id', 'text')->orderBy('id');
    }
}
