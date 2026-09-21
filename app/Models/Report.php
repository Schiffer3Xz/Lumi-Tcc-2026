<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    protected $fillable = [
        'content',
        'fk_user_id',
        'fk_post_id',
        'fk_commnet_id',
    ];
}
