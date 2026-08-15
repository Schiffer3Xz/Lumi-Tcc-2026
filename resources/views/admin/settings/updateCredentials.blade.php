<!DOCTYPE html>
<html lang="pt-br" class="h-full">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Perfil & Segurança</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap');
        body { font-family: 'Inter', sans-serif; background-color: #fbf9f6; }
        .sidebar-bg { background-color: #2d221b; }
        .sidebar-border { border-color: #3e3027; }
        
        .panel-card { 
            background: #ffffff; 
            border: 1px solid #e6dccf; 
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
        }
        .input-style {
            background: #fdfcfb;
            border: 1px solid #e6dccf;
            transition: all 0.3s ease;
        }
        .input-style:focus {
            border-color: #b08968;
            outline: none;
            box-shadow: 0 0 0 3px rgba(176, 137, 104, 0.1);
        }
        .btn-action {
            background: #fdfcfb;
            border: 1px solid #e6dccf;
            transition: all 0.2s;
        }
        .btn-action:hover {
            border-color: #b08968;
            background: #f7f2ea;
            color: #b08968;
        }
    </style>
</head>
<body class="flex min-h-screen">

    <!-- Sidebar -->
    <aside class="w-64 sidebar-bg sidebar-border border-r flex flex-col justify-between shrink-0 hidden md:flex">
        <div class="p-6 border-b sidebar-border">
            <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-[#b08968]/20 flex items-center justify-center text-[#d4a373]">
                    <i class="fa-solid fa-gear"></i>
                </div>
                <div>
                    <span class="text-[10px] font-bold uppercase tracking-wider text-[#a38875] block">Painel</span>
                    <span class="text-sm font-black text-[#d6c7b9]">Configurações</span>
                </div>
            </div>
        </div>
        <nav class="p-4 space-y-1 flex-1">
            <a href="#" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#d6c7b9] bg-[#382b22] border sidebar-border">
                <i class="fa-solid fa-sliders text-[#d4a373]"></i> Geral & Perfil
            </a>
            <a href="#" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#a38875] hover:text-[#d6c7b9] hover:bg-[#382b22]/50 transition-all">
                <i class="fa-solid fa-shield-halved"></i> Segurança
            </a>
            <a href="#" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#a38875] hover:text-[#d6c7b9] hover:bg-[#382b22]/50 transition-all">
                <i class="fa-solid fa-users-gear"></i> Administradores
            </a>
            <a href="#" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#a38875] hover:text-[#d6c7b9] hover:bg-[#382b22]/50 transition-all">
                <i class="fa-solid fa-clipboard-list"></i> Auditoria de Logs
            </a>
        </nav>
        <div class="p-4 border-t sidebar-border bg-[#241b14]">
            <a href="#" class="flex items-center gap-2 text-xs text-[#a38875] hover:text-[#d6c7b9]">
                <i class="fa-solid fa-arrow-left"></i> Voltar ao sistema principal
            </a>
        </div>
    </aside>

    <main class="flex-1 py-10 px-6 sm:px-12 overflow-y-auto">
        <div class="max-w-3xl mx-auto">
            
            <div class="mb-10">
                <span class="text-[10px] font-bold uppercase tracking-widest text-[#b08968] bg-[#f4ede2] px-3 py-1 rounded-full">Editar Perfil</span>
                <h1 class="text-3xl font-black text-[#2d221b] mt-3 tracking-tight">Informações Pessoais</h1>
            </div>

            <form class="space-y-8" action="{{route('admin.settings.profile.update')}}" method="POST">
                @csrf
                @method('PUT')

            <!-- Seção Avatar (Substitua a parte do avatar no código anterior por esta) -->
                <div class="panel-card rounded-2xl p-8 flex items-center justify-between">
                    <div class="flex items-center gap-6">
                        <!-- Foto de Perfil com estilo rústico -->
                        <div class="w-20 h-20 rounded-full bg-[#fdfcfb] border-2 border-[#e6dccf] flex items-center justify-center text-[#b08968] shadow-inner relative overflow-hidden">
                            <i class="fa-solid fa-user text-3xl"></i>
                            <!-- Opcional: Se tiver uma imagem, você colocaria um <img> aqui -->
                        </div>
                        <div>
                            <h3 class="text-xs font-bold text-[#2d221b] uppercase tracking-wider">Foto de Perfil</h3>
                            <p class="text-[10px] text-[#8c7462] mt-1 max-w-[200px]">Formatos aceitos: JPG, PNG. Tamanho máximo: 2MB.</p>
                        </div>
                    </div>
                    <button type="button" class="px-5 py-2.5 rounded-xl text-[10px] font-bold border border-[#e6dccf] text-[#8c7462] hover:bg-[#b08968] hover:text-white transition-all uppercase tracking-widest">
                        Alterar Imagem
                    </button>
                </div>
                <!-- Seção Dados -->
                <div class="panel-card rounded-2xl p-8 space-y-6">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label class="text-[10px] font-bold text-[#8c7462] uppercase tracking-wider block mb-2">Nome Completo</label>
                            <input type="text" name="name"  value="{{ old('name', auth()->user()->name) }}" class="w-full p-3 rounded-xl input-style text-xs">
                        </div>
                        <div>
                            <label class="text-[10px] font-bold text-[#8c7462] uppercase tracking-wider block mb-2">Nickname</label>
                            <input type="text" name="nickname" value="{{ old('nickname', auth()->user()->nickname) }}" class="w-full p-3 rounded-xl input-style text-xs">
                        </div>
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-[#8c7462] uppercase tracking-wider block mb-2">Biografia</label>
                        <textarea name="description" class="w-full p-3 rounded-xl input-style text-xs h-24">{{ old('description', auth()->user()->description) }}</textarea>
                    </div>
                </div>

                <!-- Seção Segurança (Botões ao invés de Textbox) -->
                <div class="panel-card rounded-2xl p-8 space-y-6">
                    <h2 class="text-xs font-bold text-[#2d221b] uppercase tracking-wider flex items-center gap-2">
                        <i class="fa-solid fa-lock text-[#b08968]"></i> Gerenciamento de Acesso
                    </h2>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <a href="{{ route('admin.settings.email.edit') }}" class="btn-action w-full p-4 rounded-xl text-xs font-bold flex items-center justify-between">
                            <span>Alterar E-mail</span>
                            <i class="fa-solid fa-envelope"></i>
                        </a>
                        <a href="{{ route('admin.settings.password.edit') }}" class="btn-action w-full p-4 rounded-xl text-xs font-bold flex items-center justify-between">
                            <span>Redefinir Senha</span>
                            <i class="fa-solid fa-key"></i>
                        </a>
                    </div>
                </div>

                <div class="flex justify-end gap-3 pt-4">
                   <a href="{{route('admin.settings.index')}}" class="px-6 py-3 rounded-xl text-xs font-bold text-[#8c7462] hover:text-[#2d221b] transition-all text-center">
                        Voltar as Configurações
                    </a>
                    <button type="submit" class="px-8 py-3 rounded-xl text-xs font-bold bg-[#2d221b] text-[#d6c7b9] hover:bg-[#b08968] transition-all shadow-lg shadow-[#2d221b]/20">Salvar Alterações</button>
                </div>
            </form>
        </div>
    </main>
</body>
</html>