<?php

namespace App\Http\Controllers\Admin\Categories;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Genre;


class GenreController extends Controller
{

    public function index()
    {
        $genres = Genre::all();

        return view('admin/categories/genres/create', compact('genres'));
    }

    public function store(Request $request){
        $dados = $request->validate([
        'name' => ['required','string','max:255','unique:genres,name',],
        ]);

        Genre::create($dados);
        return back();
    }

    public function edit($id){
        $genre = Genre::findOrFail($id);

        return view('admin/categories/genres/edit', compact('genre'));
    }

    public function update(Request $request, $id){
        Genre::where('id', $id)->update([
            'name' => $request->name,
        ]);

        return redirect('admin/categories/genre');
    }

    public function destroy($id){
        Genre::where('id', $id)->delete();

        return redirect('admin/categories/genre');
    }
}