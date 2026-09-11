<x-admin.layout title="Painel administrativo">
<x-slot:head><script src="https://cdn.jsdelivr.net/npm/chart.js"></script></x-slot:head>
<div class="mb-6"><span class="mb-1 block text-[10px] font-bold uppercase tracking-widest text-blue-600">VISÃO GERAL</span><h1 class="text-2xl font-bold text-slate-900">Seu acervo em um só lugar.</h1><p class="mt-1 text-sm text-slate-500">Acompanhe os livros, autores e atividades da Sala de Leitura.</p></div>
<div class="space-y-6">
                <!-- Cards Grid -->
                <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                    <!-- Card 1: Livros -->
                    <div class="bg-white rounded-xl border border-slate-200/80 px-3.5 py-3 shadow-2xs hover:border-amber-300 transition flex flex-col justify-between group">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-amber-600 transition">Livros</span>
                            <div class="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xs shadow-2xs">📚</div>
                        </div>
                        <span class="text-lg font-bold text-slate-900 tracking-tight">{{ $totalBooks }}</span>
                    </div>

                    <!-- Card 2: Autores -->
                    <div class="bg-white rounded-xl border border-slate-200/80 px-3.5 py-3 shadow-2xs hover:border-amber-300 transition flex flex-col justify-between group">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-amber-600 transition">Autores</span>
                            <div class="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xs shadow-2xs">👤</div>
                        </div>
                        <span class="text-lg font-bold text-slate-900 tracking-tight">{{ $totalAuthors }}</span>
                    </div>

                    <!-- Card 3: Gêneros -->
                    <div class="bg-white rounded-xl border border-slate-200/80 px-3.5 py-3 shadow-2xs hover:border-amber-300 transition flex flex-col justify-between group">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-amber-600 transition">Gêneros</span>
                            <div class="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xs shadow-2xs">🏷️</div>
                        </div>
                        <span class="text-lg font-bold text-slate-900 tracking-tight">{{ $totalGenres }}</span>
                    </div>

                    <!-- Card 4: Disponíveis -->
                    <div class="bg-white rounded-xl border border-slate-200/80 px-3.5 py-3 shadow-2xs hover:border-emerald-300 transition flex flex-col justify-between group">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-emerald-600 transition">Disponíveis</span>
                            <div class="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs shadow-2xs">✅</div>
                        </div>
                        <span class="text-lg font-bold text-slate-900 tracking-tight">{{ $totalBooksAvailable }}</span>
                    </div>

                    <!-- Card 5: Indisponíveis -->
                    <div class="bg-white rounded-xl border border-slate-200/80 px-3.5 py-3 shadow-2xs hover:border-rose-300 transition flex flex-col justify-between group">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-rose-600 transition">Indisponíveis</span>
                            <div class="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-xs shadow-2xs">❌</div>
                        </div>
                        <span class="text-lg font-bold text-slate-900 tracking-tight">{{ $totalBooksUnavailable }}</span>
                    </div>

                    <!-- Card 6: Emprestados -->
                    <div class="bg-white rounded-xl border border-slate-200/80 px-3.5 py-3 shadow-2xs hover:border-sky-300 transition flex flex-col justify-between group">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-sky-600 transition">Emprestados</span>
                            <div class="w-6 h-6 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center text-xs shadow-2xs">📖</div>
                        </div>
                        <span class="text-lg font-bold text-slate-900 tracking-tight">{{ $totalBooksBorrowed }}</span>
                    </div>

                    <!-- Card 7: Cadastrados no Mês -->
                    <div class="bg-white rounded-xl border border-slate-200/80 px-3.5 py-3 shadow-2xs hover:border-blue-300 transition flex flex-col justify-between group col-span-2 sm:col-span-1">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-blue-600 transition truncate pr-1">Cadastrados (Mês)</span>
                            <div class="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs shadow-2xs shrink-0">✨</div>
                        </div>
                        <span class="text-lg font-bold text-slate-900 tracking-tight">{{ $totalBooksPerMonth }}</span>
                    </div>
                </div>

                <!-- Chart Container -->
                <div class="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm">
                    <h2 class="font-bold text-slate-800 mb-4 text-base">
                        Livros por Gênero
                    </h2>
                    <div class="relative h-80 w-full">
                        <canvas id="booksGenreChart"></canvas>
                    </div>
                </div>
            </div>

<x-slot:scripts>
<script>
        // Dados injetados pelo Laravel
        const booksByGenre = @json($totalBooksByGenre);

        // Inicialização do Gráfico
        document.addEventListener('DOMContentLoaded', function () {
            const ctx = document.getElementById('booksGenreChart').getContext('2d');

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: booksByGenre.map(item => item.name),
                    datasets: [{
                        label: 'Quantidade de livros',
                        data: booksByGenre.map(item => item.books_count),
                        backgroundColor: '#2563eb',
                        borderColor: '#1d4ed8',
                        borderWidth: 1,
                        borderRadius: 6,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: '#f1f5f9'
                            },
                            ticks: {
                                precision: 0
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        });
    </script>
</x-slot:scripts>
</x-admin.layout>
