<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return ['public_reviews' => 'boolean', 'social_notifications' => 'boolean'];
    }

    protected $fillable = [
        'name',
        'email',
        'password',
        'is_admin',
        'first_login',
        'nickname',
        'description',
    ];

    public function friend()
    {
        return $this->belongsToMany(
            User::class,
            'friendships',
            'fk_user_id',
            'fk_friend_id'
        );
    }

    public function follows()
    {
        return $this->belongsToMany(
            User::class,
            'follows',
            'fk_follower_id',
            'fk_followed_id',
        );
    }

    public function followers()
    {
        return $this->belongsToMany(
            User::class,
            'follows',
            'fk_followed_id',
            'fk_follower_id',
        );
    }
}
