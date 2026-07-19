<?php

namespace App\Http\Controllers\Admin\Categories;

use App\Http\Controllers\Controller;
use App\Models\Availability;
use Illuminate\Http\Request;

class AvailabilityController extends Controller
{
    public function index()
    {
        $availabilities = Availability::all();

        return view('admin/categories/availabilities/create', compact('availabilities'));
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

        return view('admin/categories/availabilities/edit', compact('availability'));
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'availability' => ['required', 'string', 'max:255', 'unique:availabilities,availability,' . $id],
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
