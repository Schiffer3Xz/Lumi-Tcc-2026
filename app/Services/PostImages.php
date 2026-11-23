<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use RuntimeException;

class PostImages
{
    public const RULES = ['image', 'mimes:jpg,jpeg,png,webp', 'max:5120'];

    public static function store(UploadedFile $image): string
    {
        $path = $image->store('posts', 'public');
        if (! $path) {
            throw new RuntimeException('Falha ao armazenar a imagem.');
        }

        return $path;
    }
}
