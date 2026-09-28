<?php

namespace App\Http\Controllers\Admin\Categories;

use App\Http\Controllers\Controller;
use App\Models\Genre;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GenreController extends Controller
{
    public function index()
    {
        $genres = Genre::all();

        return Inertia::render('admin/categories/manage', ['resource' => 'genres', 'items' => $genres]);
    }

    public function store(Request $request)
    {
        $dados = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:genres,name'],
        ]);

        Genre::create($dados);

        return back();
    }

    public function edit($id)
    {
        $genre = Genre::findOrFail($id);

        return Inertia::render('admin/categories/edit', ['resource' => 'genres', 'item' => $genre]);
    }

    public function update(Request $request, $id)
    {
        Genre::where('id', $id)->update([
            'name' => $request->name,
        ]);

        return redirect()->route('admin.genres.index');
    }

    public function destroy($id)
    {
        Genre::where('id', $id)->delete();

        return redirect()->route('admin.genres.index');
    }
}
