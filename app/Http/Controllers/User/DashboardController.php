<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Book;

class DashboardController extends Controller
{
    public function list(){
        $books = Book::with(['author', 'genre', 'availability'])->latest()->get();
        return view('user/dashboard', compact('books'));
    }
}
