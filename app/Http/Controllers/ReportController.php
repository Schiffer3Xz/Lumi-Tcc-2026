<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Report;

class ReportController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'content' => 'required|string|max:100',
        ]);

        $content = $request->input('content');

        Report::create([
            '',
        ]);
    }
}
