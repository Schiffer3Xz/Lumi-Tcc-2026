<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    protected $fillable = [
        'name',
        'is_group',
        'created_by',
    ];

    protected function casts(): array
    {
        return ['is_group' => 'boolean'];
    }

    public function participants(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(User::class, 'conversation_users', 'fk_conversation_id', 'fk_user_id')->withTimestamps();
    }
}
