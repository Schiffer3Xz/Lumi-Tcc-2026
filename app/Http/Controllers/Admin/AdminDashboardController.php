<?php

namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Author;
use App\Models\Genre;
use Illuminate\Http\Request;

class AdminDashboardController extends Controller
{
    public function index(){
        $totalBooks = Book::count();
        $totalAuthors = Author::count();
        $totalGenres = Genre::count();
        
        $totalBooksAvailable = Book::where('fk_availability_id', 1)->count();
        $totalBooksUnavailable = Book::where('fk_availability_id', 2)->count();
        $totalBooksBorrowed = Book::where('fk_availability_id', 3)->count();
        $totalBooksPerMonth = Book::whereMonth('created_at', now()->month)->count();
        $totalBooksByGenre = Genre::withCount('books')->get();
        return view('admin/dashboard/index', compact(
            'totalBooks',
            'totalAuthors',
            'totalGenres',
            'totalBooksAvailable',
            'totalBooksUnavailable',
            'totalBooksBorrowed',
            'totalBooksPerMonth',
            'totalBooksByGenre',
        ));
    }

    public function search(Request $request){
        $booksFind = Book::with(['author', 'genre'])
        ->where('title', 'LIKE', "%{$request->search}%")
        ->orWhereHas('author', function($query) use ($request) {
            $query->where('name', 'LIKE', "%{$request->search}%");
        })
        ->orWhereHas('genre', function($query) use ($request) {
            $query->where('name', 'LIKE', "%{$request->search}%");
        })
        ->get();

    }
}
