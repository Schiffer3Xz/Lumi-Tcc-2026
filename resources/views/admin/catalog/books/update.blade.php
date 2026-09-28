<x-admin.layout title="Gestão de Acervo">
    @php
        $availabilityBooks = $books->map(fn ($book) => [
            'id' => $book->id,
            'title' => $book->title,
            'author' => $book->author->name ?? 'Autor desconhecido',
            'status' => $book->availability->availability ?? 'Sem disponibilidade',
            'cover_url' => $book->cover_url
                ? (str_starts_with($book->cover_url, 'http') ? $book->cover_url : asset('storage/'.$book->cover_url))
                : null,
            'edit_url' => route('admin.books.edit', $book->id),
        ])->values();
    @endphp
    <div data-admin-availability data-books="{{ $availabilityBooks->toJson() }}" data-dashboard-url="{{ route('admin.dashboard') }}">
        <p class="py-8 text-sm text-slate-500" role="status">Carregando acervo...</p>
        <noscript>Ative o JavaScript para buscar e filtrar os livros. Você também pode <a href="{{ route('admin.books.list') }}">acessar o catálogo</a>.</noscript>
    </div>
</x-admin.layout>
