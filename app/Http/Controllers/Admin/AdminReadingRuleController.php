<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ReadingRule;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminReadingRuleController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/reading-rules/index', [
            'rules' => ReadingRule::displayList()->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        ReadingRule::create($request->validate(['text' => 'required|string|max:1000']));

        return to_route('admin.reading-rules.index')->with('success', 'Regra cadastrada.');
    }

    public function update(Request $request, ReadingRule $readingRule): RedirectResponse
    {
        $readingRule->update($request->validate(['text' => 'required|string|max:1000']));

        return to_route('admin.reading-rules.index')->with('success', 'Regra atualizada.');
    }

    public function destroy(ReadingRule $readingRule): RedirectResponse
    {
        $readingRule->delete();

        return to_route('admin.reading-rules.index')->with('success', 'Regra excluída.');
    }
}
