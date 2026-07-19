 <form action="{{ route('logout') }}" method="POST" class="w-full">
                            @csrf
                            <button type="submit" class="flex items-center justify-between p-3 rounded-lg transition-colors hover:bg-slate-800 group w-full text-left">
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 group-hover:text-white">
                                        <i class="fa-solid fa-user text-xs"></i>
                                    </div>
                                    <div class="flex flex-col">
                                        <span class="text-sm font-medium text-white">Sair</span>
                                        <span class="text-xs text-slate-400">Encerrar sessão</span>
                                    </div>
                                </div>
                                <i class="fa-solid fa-right-from-bracket text-slate-500 group-hover:text-red-400 text-xs transition-transform group-hover:translate-x-1"></i>
                            </button>
                        </form>