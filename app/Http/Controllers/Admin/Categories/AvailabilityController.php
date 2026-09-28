<?php

namespace App\Http\Controllers\Admin\Categories;

use App\Http\Controllers\Controller;
use App\Models\Availability;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AvailabilityController extends Controller
{
    public function index()
    {
        $availabilities = Availability::all();

        return Inertia::render('admin/categories/manage', ['resource' => 'availability', 'items' => $availabilities]);
    }

    public function store(Request $request)
    {
        $dados = $request->validate([
            'availability' => ['required', 'string', 'max:255', 'unique:availabilities,availability'],
        ]);

        Availability::create($dados);

        return back();
    }

    public function edit($id)
    {
        $availability = Availability::findOrFail($id);

        return Inertia::render('admin/categories/edit', ['resource' => 'availability', 'item' => $availability]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'availability' => ['required', 'string', 'max:255', 'unique:availabilities,availability,'.$id],
        ]);

        Availability::where('id', $id)->update([
            'availability' => $request->availability,
        ]);

        return redirect('admin/categories/availability');
    }

    public function destroy($id)
    {
        Availability::where('id', $id)->delete();

        return redirect('admin/categories/availability');
    }
}
