<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Book;
use Inertia\Inertia;

class DashboardController extends Controller
{

    public function index(){
         return Inertia::render('home', [
            'books' => Book::with([
                'author',
                'genre',
                'availability'
            ])->get()->map(function ($book) {
                return [
                    'id' => $book->id,
                    'title' => $book->title,
                    'description' => $book->description,
                    'rating' => $book->rating ?? 0,
                    'cover_url' => $book->cover_url
                        ? asset('storage/' . $book->cover_url)
                        : null,
                    'author' => $book->author,
                    'genre' => $book->genre,
                    'availability' => $book->availability,
                ];
            }),
        ]);
    }

    public function teste(){
        return Inertia::render('teste');
    }


    public function list(){
        $books = Book::with(['author', 'genre', 'availability'])->latest()->get();
        return view('user/dashboard', compact('books'));
    }
}
