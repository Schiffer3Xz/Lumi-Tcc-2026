<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = [
        'fk_user_id',
        'fk_conversation_id',
        'content',
    ];
}
