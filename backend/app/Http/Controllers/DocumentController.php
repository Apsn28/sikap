<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    public function index(Request $request)
    {
        $query = Document::with(['legalCase', 'uploader'])->latest();
        
        if ($request->has('case_id')) {
            $query->where('case_id', $request->case_id);
        }

        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        return $query->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'file' => 'required|file|max:10240', // 10MB max
            'category' => 'nullable|string',
            'case_id' => 'nullable|exists:cases,id',
        ]);

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $path = $file->store('documents');
            $size = $this->formatSizeUnits($file->getSize());
            
            $document = Document::create([
                'title' => $validated['title'],
                'file_path' => $path,
                'file_type' => $file->extension(),
                'file_size' => $size,
                'category' => $validated['category'] ?? null,
                'case_id' => $validated['case_id'] ?? null,
                'uploaded_by' => $request->user() ? $request->user()->id : null,
            ]);

            return response()->json($document, 201);
        }

        return response()->json(['message' => 'File not provided'], 400);
    }

    public function show($id)
    {
        return Document::with(['legalCase', 'uploader'])->findOrFail($id);
    }

    public function destroy($id)
    {
        $document = Document::findOrFail($id);
        
        if (Storage::exists($document->file_path)) {
            Storage::delete($document->file_path);
        }

        $document->delete();

        return response()->json(null, 204);
    }

    public function download($id)
    {
        $document = Document::findOrFail($id);
        
        if (Storage::exists($document->file_path)) {
            return Storage::download($document->file_path, $document->title . '.' . $document->file_type);
        }

        return response()->json(['message' => 'File not found'], 404);
    }

    private function formatSizeUnits($bytes)
    {
        if ($bytes >= 1073741824)
        {
            $bytes = number_format($bytes / 1073741824, 2) . ' GB';
        }
        elseif ($bytes >= 1048576)
        {
            $bytes = number_format($bytes / 1048576, 2) . ' MB';
        }
        elseif ($bytes >= 1024)
        {
            $bytes = number_format($bytes / 1024, 2) . ' KB';
        }
        elseif ($bytes > 1)
        {
            $bytes = $bytes . ' bytes';
        }
        elseif ($bytes == 1)
        {
            $bytes = $bytes . ' byte';
        }
        else
        {
            $bytes = '0 bytes';
        }

        return $bytes;
    }
}
