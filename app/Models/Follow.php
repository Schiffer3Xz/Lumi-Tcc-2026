<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Follow extends Model
{
    protected $fillable = [
        "fk_follower_id",
        "fk_followed_id",
    ];
}
