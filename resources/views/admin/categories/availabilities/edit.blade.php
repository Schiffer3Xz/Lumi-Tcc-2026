<!DOCTYPE html>
<html lang="pt-PT">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Editar Disponibilidade | Gestão</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50 text-slate-900 font-sans antialiased">

    <div class="min-h-screen flex items-center justify-center p-6">

        <div class="w-full max-w-lg bg-white shadow-xl shadow-slate-200/50 border border-slate-100 rounded-3xl p-8">

            <div class="mb-8 text-center sm:text-left">
                <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Editar Disponibilidade</h1>
                <p class="text-slate-500 mt-1">Atualize as informações do seu registro no sistema.</p>
            </div>

            <form action="{{ route('admin.availability.update', $availability->id) }}" method="POST" class="space-y-6">
                @csrf
                @method('PUT')

                <div>
                    <label for="availability" class="block text-sm font-semibold text-slate-700 mb-2">
                        Nome da Disponibilidade
                    </label>
                    <input
                        type="text"
                        id="availability"
                        name="availability"
                        value="{{ old('availability', $availability->availability) }}"
                        class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all duration-300"
                        placeholder="Ex: Disponível"
                        required
                    >
                    @error('availability')
                        <p class="mt-2 text-sm text-red-500 font-medium">{{ $message }}</p>
                    @enderror
                </div>

                <div class="flex flex-col sm:flex-row gap-3 pt-4">
                    <a href="{{ route('admin.categories.index') }}"
                       class="w-full sm:w-auto px-6 py-3 text-center text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors">
                        Cancelar
                    </a>
                    <button type="submit"
                            class="w-full sm:flex-1 px-6 py-3 bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700 shadow-lg shadow-amber-500/20 transition-all active:scale-95">
                        Salvar Alterações
                    </button>
                </div>
            </form>

        </div>
    </div>

</body>
</html>
