// ==========================================
// CONTROL CONTABILIDADE - APLICAÇÃO SPA NATIVA v2.1
// ==========================================

// Dados iniciais base de empresas
const INITIAL_COMPANIES = [
  { id: 1, codigo: "001", grupo: "CONSTRUTORAS", nome: "ALFA ENGENHARIA E CONSTRUCOES LTDA", cnpj: "14.285.912/0001-44", classe: "A", regime: "Lucro Real Mensal", colaborador: "Brayann", segmento: "Construção Civil", fechamento: "2026-08" },
  { id: 2, codigo: "002", grupo: "ALIMENTOS", nome: "BETA DISTRIBUIDORA DE ALIMENTOS SA", cnpj: "23.491.018/0001-92", classe: "A", regime: "Lucro Real Trimestral", colaborador: "Brayann", segmento: "Comércio Atacadista", fechamento: "2026-08" },
  { id: 3, codigo: "003", grupo: "TRANSPORTES", nome: "GAMMA LOGISTICA E TRANSPORTES LTDA", cnpj: "08.771.234/0001-15", classe: "B", regime: "Lucro Real Mensal", colaborador: "Carlos", segmento: "Transportes", fechamento: "2026-07" },
  { id: 4, codigo: "004", grupo: "TECNOLOGIA", nome: "DELTA SERVICOS TECNOLOGICOS LTDA", cnpj: "31.902.441/0001-09", classe: "B", regime: "Lucro Real Trimestral", colaborador: "Mariana", segmento: "Tecnologia", fechamento: "2026-08" },
  { id: 5, codigo: "005", grupo: "METALURGIA", nome: "EPSILON INDUSTRIA METALURGICA SA", cnpj: "19.382.716/0001-50", classe: "A", regime: "Lucro Real Mensal", colaborador: "Brayann", segmento: "Indústria", fechamento: "2026-06" },
  { id: 6, codigo: "006", grupo: "SAUDE", nome: "ZETA FARMACEUTICA LTDA", cnpj: "05.123.987/0001-63", classe: "C", regime: "Lucro Presumido", colaborador: "Juliana", segmento: "Farmacêutico", fechamento: "2026-08" },
  { id: 7, codigo: "007", grupo: "VAREJO", nome: "THETA VAREJO E MODA LTDA", cnpj: "42.819.321/0001-77", classe: "C", regime: "Simples Nacional", colaborador: "Carlos", segmento: "Comércio Varejista", fechamento: "2026-05" },
  { id: 8, codigo: "008", grupo: "SAUDE", nome: "OMEGA CLINICA MEDICA INTEGRADA", cnpj: "27.654.321/0001-88", classe: "B", regime: "Lucro Real Trimestral", colaborador: "Mariana", segmento: "Saúde", fechamento: "2026-08" }
];

const INITIAL_USERS = [
  { id: 1, usuario: "brayann", email: "brayann@controlcontabilidade.com.br", senha: "bra@7288", nome: "Brayann Mikael" }
];

const INITIAL_TASKS = [
  { id: 1, titulo: "Conferir apuração de PIS/COFINS Alfa Engenharia", descricao: "Validar notas de entrada de materiais e créditos extemporâneos.", data: "2026-10-02", urgencia: "Alta", concluida: false },
  { id: 2, titulo: "Emitir DARF IRPJ Trimestral Beta Distribuidora", descricao: "Verificar se cliente optou por Quota Única ou 3 Parcelas.", data: "2026-10-05", urgencia: "Alta", concluida: false },
  { id: 3, titulo: "Solicitar extratos bancários pendentes Delta Tecnologia", descricao: "Contatar financeiro para conciliação da conta Santander.", data: "2026-10-10", urgencia: "Media", concluida: false },
  { id: 4, titulo: "Reunião de alinhamento com a diretoria", descricao: "Apresentação dos indicadores do fechamento do 3º trimestre.", data: "2026-10-15", urgencia: "Baixa", concluida: false }
];

const MONTH_COMPETENCIES = [];
for (const yr of [2026, 2027]) {
  const startM = yr === 2026 ? 8 : 1;
  for (let m = startM; m <= 12; m++) {
    MONTH_COMPETENCIES.push(`${m.toString().padStart(2, '0')}/${yr}`);
  }
}

const QUARTERS = [
  "1º Trim 2026", "2º Trim 2026", "3º Trim 2026", "4º Trim 2026",
  "1º Trim 2027", "2º Trim 2027", "3º Trim 2027", "4º Trim 2027"
];

// Estado Global da Aplicação
const state = {
  user: localStorage.getItem('control_auth_user') || null,
  authMode: 'login', // 'login' ou 'register'
  users: JSON.parse(localStorage.getItem('control_users') || 'null') || INITIAL_USERS,
  theme: localStorage.getItem('control_theme') || 'dark',
  activeTab: 'dashboard',
  globalSearch: '',
  isNotificationOpen: false,
  selPisComp: '09/2026',
  selTrim: '3º Trim 2026',
  selIrpjMes: '09/2026',
  fechamentoFilter: 'all',
  taskFilter: 'ativas',
  customLogo: localStorage.getItem('control_custom_logo') || null,
  companies: JSON.parse(localStorage.getItem('control_companies') || 'null') || INITIAL_COMPANIES,
  tasks: JSON.parse(localStorage.getItem('control_tasks') || 'null') || INITIAL_TASKS,
  pisCofinsData: JSON.parse(localStorage.getItem('control_piscofins') || '{}'),
  irpjTrimData: JSON.parse(localStorage.getItem('control_irpj_trim') || '{}'),
  irpjMensalData: JSON.parse(localStorage.getItem('control_irpj_mensal') || '{}'),
  modal: { isOpen: false, mode: 'create', company: null },
  // Filtros dedicados da tela de CRUD de Empresas
  crudFilters: {
    responsavel: 'todos',
    regime: 'todos',
    classe: 'todos',
    grupo: 'todos',
    segmento: 'todos'
  },
  charts: {}
};

function saveStorage() {
  localStorage.setItem('control_users', JSON.stringify(state.users));
  localStorage.setItem('control_companies', JSON.stringify(state.companies));
  localStorage.setItem('control_tasks', JSON.stringify(state.tasks));
  localStorage.setItem('control_piscofins', JSON.stringify(state.pisCofinsData));
  localStorage.setItem('control_irpj_trim', JSON.stringify(state.irpjTrimData));
  localStorage.setItem('control_irpj_mensal', JSON.stringify(state.irpjMensalData));
}

function getFechamentoStatus(mesStr) {
  if (!mesStr) return { status: 'critico', label: 'Sem Registro', color: 'red', css: 'bg-rose-500/10 text-rose-400 border border-rose-500/30' };
  const [fYear, fMonth] = mesStr.split('-').map(Number);
  const diff = (2026 - fYear) * 12 + (9 - fMonth);
  if (diff <= 1) {
    return { status: 'em_dia', label: 'Em Dia (08/2026)', color: 'green', css: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' };
  } else if (diff <= 2) {
    return { status: 'atencao', label: '1 a 2 meses atraso', color: 'yellow', css: 'bg-amber-500/10 text-amber-400 border border-amber-500/30' };
  } else {
    return { status: 'critico', label: 'Mais de 2 meses atraso', color: 'red', css: 'bg-rose-500/10 text-rose-400 border border-rose-500/30' };
  }
}

// Renderização fiel da Logomarca Oficial da Control Contabilidade (Imagem 1)
function renderLogo(heightClass = "h-10") {
  if (state.customLogo) {
    return `<img src="${state.customLogo}" alt="Control Contabilidade" class="${heightClass} object-contain" />`;
  }
  return `
    <div class="inline-flex items-center select-none" style="line-height: 1;">
      <svg class="${heightClass} w-auto" viewBox="0 0 540 130" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" style="display: block; max-height: 100%;">
        <!-- Símbolo C e Checkmark -->
        <g id="symbol">
          <!-- Anel Circular C (Azul Marinho #0D3B66) -->
          <path d="M 65 5 
                   A 60 60 0 1 0 107.4 107.4 
                   L 93.3 93.3 
                   A 40 40 0 1 1 65 25 
                   A 40 40 0 0 1 93.3 36.7 
                   L 107.4 22.6 
                   A 60 60 0 0 0 65 5 Z" 
                fill="#0D3B66" />
          
          <!-- Checkmark Laranja (#F58220) cortando o arco superior -->
          <path d="M 38 65 
                   L 68 95 
                   L 115 22 
                   L 98 12 
                   L 68 72 
                   L 52 53 Z" 
                fill="#F58220" />
        </g>

        <!-- Tipografia "control" -->
        <g id="brand-control">
          <!-- Letra c -->
          <path d="M 195 48 C 190 42 182 39 171 39 C 153 39 140 52 140 71 C 140 90 153 103 171 103 C 182 103 190 100 195 94 L 186 85 C 182 89 177 91 171 91 C 160 91 152 83 152 71 C 152 59 160 51 171 51 C 177 51 182 53 186 57 Z" fill="#0D3B66" />
          
          <!-- Letra o -->
          <path d="M 235 39 C 217 39 204 52 204 71 C 204 90 217 103 235 103 C 253 103 266 90 266 71 C 266 52 253 39 235 39 Z M 235 51 C 246 51 254 59 254 71 C 254 83 246 91 235 91 C 224 91 216 83 216 71 C 216 59 224 51 235 51 Z" fill="#0D3B66" />

          <!-- Letra n -->
          <path d="M 276 41 L 276 101 L 288 101 L 288 66 C 288 56 295 51 304 51 C 313 51 318 56 318 66 L 318 101 L 330 101 L 330 63 C 330 49 321 40 307 40 C 298 40 291 44 286 51 L 286 41 Z" fill="#0D3B66" />

          <!-- Letra t -->
          <path d="M 352 25 L 340 25 L 340 41 L 332 41 L 332 52 L 340 52 L 340 85 C 340 96 345 102 357 102 C 361 102 365 101 368 99 L 365 88 C 363 89 360 90 358 90 C 354 90 352 87 352 82 L 352 52 L 367 52 L 367 41 L 352 41 Z" fill="#0D3B66" />

          <!-- Letra r -->
          <path d="M 377 41 L 377 101 L 389 101 L 389 68 C 389 56 397 51 408 52 L 408 40 C 398 40 392 45 387 52 L 387 41 Z" fill="#0D3B66" />

          <!-- Letra o -->
          <path d="M 440 39 C 422 39 409 52 409 71 C 409 90 422 103 440 103 C 458 103 471 90 471 71 C 471 52 458 39 440 39 Z M 440 51 C 451 51 459 59 459 71 C 459 83 451 91 440 91 C 429 91 421 83 421 71 C 421 59 429 51 440 51 Z" fill="#0D3B66" />

          <!-- Letra l -->
          <path d="M 482 12 L 482 101 L 494 101 L 494 12 Z" fill="#0D3B66" />
        </g>

        <!-- Subtítulo "C O N T A B I L I D A D E" -->
        <g id="brand-subtitle" fill="#F58220" font-family="'Rethink Sans', 'Montserrat', Arial, sans-serif" font-weight="700" font-size="16" letter-spacing="0.48em">
          <text x="142" y="125">CONTABILIDADE</text>
        </g>
      </svg>
    </div>
  `;
}

// Renderizador Principal da SPA
function render() {
  const root = document.getElementById('app');
  if (!root) return;

  // Sincronizar tema no HTML e no body
  if (state.theme === 'dark') {
    document.documentElement.classList.add('dark');
    document.body.className = "bg-[#111116] text-gray-100 antialiased selection:bg-[#ECBD56] selection:text-[#111116]";
  } else {
    document.documentElement.classList.remove('dark');
    document.body.className = "bg-[#EDEDE8] text-gray-900 antialiased selection:bg-[#ECBD56] selection:text-[#111116]";
  }

  // Se não autenticado -> Exibir Tela de Login ou Cadastro
  if (!state.user) {
    renderAuthScreen(root);
    return;
  }

  // Filtragem de empresas por busca global
  const filtered = state.companies.filter(c => {
    if (!state.globalSearch.trim()) return true;
    const q = state.globalSearch.toLowerCase();
    return (c.nome && c.nome.toLowerCase().includes(q)) ||
           (c.cnpj && c.cnpj.includes(q)) ||
           (c.codigo && c.codigo.toString().toLowerCase().includes(q)) ||
           (c.grupo && c.grupo.toLowerCase().includes(q));
  });

  const pendingTasksCount = state.tasks.filter(t => !t.concluida).length;

  root.innerHTML = `
    <div class="min-h-screen flex flex-col">
      <!-- HEADER SUPERIOR COM NOVO LOGOTIPO -->
      <header class="sticky top-0 z-30 backdrop-blur-md bg-white/90 dark:bg-[#111116]/90 border-b border-gray-200 dark:border-gray-800/80 px-6 py-3.5">
        <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <div class="flex items-center gap-6">
            <div class="group relative cursor-pointer" title="Clique para alterar a logomarca personalizada">
              ${renderLogo("h-11")}
              <input type="file" id="logo-input" accept="image/*" class="hidden" />
            </div>
          </div>

          <!-- Barra de Pesquisa Global -->
          <div class="flex-1 max-w-md mx-4">
            <div class="relative">
              <input
                type="text"
                id="global-search-input"
                value="${state.globalSearch}"
                placeholder="Busca global por Código, Nome, CNPJ ou Grupo..."
                class="w-full pl-4 pr-10 py-2.5 rounded-full text-sm bg-gray-100 dark:bg-[#1C1C23] border border-transparent dark:border-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-[#ECBD56]"
              />
              ${state.globalSearch ? `
                <button id="clear-search-btn" class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-white">
                  ✕
                </button>
              ` : ''}
            </div>
          </div>

          <!-- Ações do Header -->
          <div class="flex items-center gap-3">
            <!-- Central de Notificações -->
            <div class="relative">
              <button id="toggle-notif-btn" class="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-[#1C1C23] text-gray-600 dark:text-gray-300 relative transition" title="Central de Alertas e Vencimentos">
                <span class="text-lg">🔔</span>
                <span class="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#D94838] rounded-full ring-2 ring-white dark:ring-[#111116] animate-pulse"></span>
              </button>

              ${state.isNotificationOpen ? `
                <div class="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#15151A] border border-gray-200 dark:border-gray-800 shadow-2xl p-4 z-50">
                  <div class="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                    <h4 class="font-bold text-sm text-gray-900 dark:text-white">Central de Alertas & Vencimentos</h4>
                    <span class="text-xs text-gray-400">2 alertas ativos</span>
                  </div>
                  <div class="mt-3 space-y-2.5 max-h-72 overflow-y-auto">
                    <div class="p-3 rounded-xl text-xs border bg-amber-500/10 border-amber-500/30 text-amber-400">
                      <div class="font-bold mb-1">⚠️ Prazo Padrão: Vencimento dia 25</div>
                      <div>Certifique-se de que os DARFs de PIS, COFINS e IRPJ/CSLL foram transmitidos até o dia 25.</div>
                    </div>
                    <div class="p-3 rounded-xl text-xs border bg-blue-500/10 border-blue-500/30 text-blue-400">
                      <div class="font-bold mb-1">ℹ️ Fechamento Mensal</div>
                      <div>Competência ideal de trabalho: Mês anterior (08/2026).</div>
                    </div>
                  </div>
                </div>
              ` : ''}
            </div>

            <!-- Alternador de Tema -->
            <button id="toggle-theme-btn" class="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-[#1C1C23] text-gray-600 dark:text-gray-300 transition" title="Alternar Modo Escuro / Claro">
              ${state.theme === 'dark' ? '☀️' : '🌙'}
            </button>

            <!-- Carga de Dados (XLSX) -->
            <label class="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-[#1C1C23] text-gray-600 dark:text-gray-300 cursor-pointer transition" title="Importar Planilha XLSX (Código, Grupo, Empresa, CNPJ, Classe, Regime, Responsável, Segmento)">
              <span class="text-lg">☁️</span>
              <input type="file" id="spreadsheet-file-input" accept=".xlsx, .xls, .csv" class="hidden" />
            </label>

            <!-- Exportar Dados -->
            <button id="export-data-btn" class="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-[#1C1C23] text-gray-600 dark:text-gray-300 transition" title="Exportar Empresas (XLSX)">
              <span class="text-lg">📥</span>
            </button>

            <div class="h-6 w-px bg-gray-200 dark:bg-gray-800"></div>

            <!-- Perfil de Usuário & Logout -->
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full bg-[#ECBD56] text-gray-950 font-bold flex items-center justify-center text-sm shadow">
                ${state.user.charAt(0).toUpperCase()}
              </div>
              <div class="hidden md:block text-left">
                <div class="text-xs font-bold leading-tight">${state.user}</div>
                <div class="text-[10px] text-gray-400">Contábil</div>
              </div>
              <button id="logout-btn" class="p-1.5 rounded-full hover:bg-rose-500/10 text-gray-400 hover:text-rose-500 transition ml-1" title="Encerrar Sessão">
                🚪
              </button>
            </div>

          </div>
        </div>
      </header>

      <!-- BARRA DE NAVEGAÇÃO -->
      <nav class="bg-white dark:bg-[#15151A] border-b border-gray-200 dark:border-gray-800/80 px-6 py-2">
        <div class="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto">
          ${[
            { id: 'dashboard', label: 'Dashboard Inicial', icon: '📊' },
            { id: 'fechamentos', label: 'Fechamentos', icon: '📅' },
            { id: 'piscofins', label: 'PIS / COFINS (Mensal)', icon: '📄' },
            { id: 'irpj_trim', label: 'IRPJ/CSLL Trimestral', icon: '📑' },
            { id: 'irpj_mensal', label: 'IRPJ/CSLL Mensal', icon: '🧮' },
            { id: 'tarefas', label: 'Tarefas', icon: '✅', badge: pendingTasksCount },
            { id: 'empresas', label: 'Empresas (CRUD & Filtros)', icon: '🏢', count: state.companies.length }
          ].map(tab => {
            const isActive = state.activeTab === tab.id;
            return `
              <button
                data-tab="${tab.id}"
                class="tab-btn flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-[#ECBD56] text-gray-950 shadow-md shadow-[#ECBD56]/20'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1C1C23] hover:text-white'
                }"
              >
                <span>${tab.icon}</span>
                <span>${tab.label}</span>
                ${tab.badge ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold ${isActive ? 'bg-gray-950 text-white' : 'bg-[#D94838] text-white'}">${tab.badge}</span>` : ''}
                ${tab.count !== undefined ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold ${isActive ? 'bg-gray-950 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-400'}">${tab.count}</span>` : ''}
              </button>
            `;
          }).join('')}
        </div>
      </nav>

      <!-- CONTEÚDO PRINCIPAL -->
      <main class="flex-1 max-w-7xl w-full mx-auto p-6" id="main-content">
        ${renderActiveTab(filtered)}
      </main>

      <!-- MODAL DE CRUD DE EMPRESA -->
      ${state.modal.isOpen ? renderCompanyModal() : ''}
    </div>
  `;

  attachEventHandlers();
  if (state.activeTab === 'dashboard') {
    renderCharts(filtered);
  }
}

// ----------------------------------------------------
// TELA DE AUTENTICAÇÃO: LOGIN OU REGISTRO DE CONTA
// ----------------------------------------------------
function renderAuthScreen(root) {
  const isLogin = state.authMode === 'login';

  root.innerHTML = `
    <div class="min-h-screen flex items-center justify-center p-4">
      <div class="w-full max-w-md p-8 rounded-3xl bg-white dark:bg-[#15151A] shadow-2xl border border-gray-200 dark:border-gray-800 relative overflow-hidden">
        <div class="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#133E68] via-[#E88A1A] to-[#133E68]"></div>
        
        <div class="flex flex-col items-center mb-6 mt-2">
          ${renderLogo("h-14")}
          <h2 class="mt-5 text-2xl font-extrabold text-gray-900 dark:text-white">
            ${isLogin ? 'Acesso Restrito' : 'Criar Nova Conta'}
          </h2>
          <p class="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
            Dashboard de Gestão e Controle Contábil
          </p>
        </div>

        <div id="auth-alert-container"></div>

        ${isLogin ? `
          <!-- Formulário de Login -->
          <form id="login-form" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Usuário ou E-mail</label>
              <input
                type="text"
                id="login-username"
                required
                placeholder="Seu usuário ou e-mail"
                class="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-[#1C1C23] border border-gray-200 dark:border-gray-700/60 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#ECBD56] transition"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Senha</label>
              <input
                type="password"
                id="login-password"
                required
                placeholder="••••••••"
                class="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-[#1C1C23] border border-gray-200 dark:border-gray-700/60 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#ECBD56] transition"
              />
            </div>

            <button
              type="submit"
              class="w-full py-3.5 px-6 rounded-full font-bold text-gray-950 bg-[#ECBD56] hover:bg-[#DEA93F] shadow-lg shadow-[#ECBD56]/20 transition flex items-center justify-center gap-2 mt-2"
            >
              <span>Entrar no Sistema</span>
            </button>
          </form>

          <div class="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800 text-center flex flex-col gap-2">
            <p class="text-xs text-gray-400">Não tem uma conta cadastrada?</p>
            <button
              type="button"
              onclick="setAuthMode('register')"
              class="text-xs font-bold text-[#E88A1A] hover:underline"
            >
              Cadastre-se agora
            </button>
          </div>
        ` : `
          <!-- Formulário de Criação de Conta -->
          <form id="register-form" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Nome Completo</label>
              <input
                type="text"
                id="reg-fullname"
                required
                placeholder="Ex: Ana Silva"
                class="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-[#1C1C23] border border-gray-200 dark:border-gray-700/60 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#ECBD56] transition"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Nome de Usuário</label>
              <input
                type="text"
                id="reg-username"
                required
                placeholder="Ex: ana.silva"
                class="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-[#1C1C23] border border-gray-200 dark:border-gray-700/60 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#ECBD56] transition"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">E-mail Profissional</label>
              <input
                type="email"
                id="reg-email"
                required
                placeholder="ana@controlcontabilidade.com.br"
                class="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-[#1C1C23] border border-gray-200 dark:border-gray-700/60 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#ECBD56] transition"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Senha de Acesso</label>
              <input
                type="password"
                id="reg-password"
                required
                placeholder="Mínimo 6 caracteres"
                class="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-[#1C1C23] border border-gray-200 dark:border-gray-700/60 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#ECBD56] transition"
              />
            </div>

            <button
              type="submit"
              class="w-full py-3.5 px-6 rounded-full font-bold text-gray-950 bg-[#ECBD56] hover:bg-[#DEA93F] shadow-lg shadow-[#ECBD56]/20 transition flex items-center justify-center gap-2 mt-2"
            >
              <span>Finalizar Cadastro</span>
            </button>
          </form>

          <div class="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800 text-center flex flex-col gap-2">
            <p class="text-xs text-gray-400">Já possui uma conta?</p>
            <button
              type="button"
              onclick="setAuthMode('login')"
              class="text-xs font-bold text-[#E88A1A] hover:underline"
            >
              Voltar para o Login
            </button>
          </div>
        `}

        <div class="mt-6 text-center">
          <span class="text-[11px] text-gray-500">Control Contabilidade &bull; Versão 2.1</span>
        </div>
      </div>
    </div>
  `;

  // Handler de Login
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const u = document.getElementById('login-username').value.trim().toLowerCase();
      const p = document.getElementById('login-password').value.trim();

      // Busca na lista de usuários cadastrados
      const found = state.users.find(usr => 
        (usr.usuario.toLowerCase() === u || (usr.email && usr.email.toLowerCase() === u)) && usr.senha === p
      );

      if (found) {
        state.user = found.usuario;
        localStorage.setItem('control_auth_user', found.usuario);
        render();
      } else {
        document.getElementById('auth-alert-container').innerHTML = `
          <div class="mb-4 p-3 rounded-xl text-xs font-semibold bg-rose-500/10 text-rose-500 border border-rose-500/30">
            Usuário ou senha inválidos. Caso não tenha conta, clique em "Cadastre-se agora".
          </div>
        `;
      }
    });
  }

  // Handler de Registro
  const regForm = document.getElementById('register-form');
  if (regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nome = document.getElementById('reg-fullname').value.trim();
      const usuario = document.getElementById('reg-username').value.trim();
      const email = document.getElementById('reg-email').value.trim().toLowerCase();
      const senha = document.getElementById('reg-password').value.trim();

      // Validação de duplicidade
      if (state.users.some(u => u.usuario.toLowerCase() === usuario.toLowerCase() || u.email.toLowerCase() === email)) {
        document.getElementById('auth-alert-container').innerHTML = `
          <div class="mb-4 p-3 rounded-xl text-xs font-semibold bg-rose-500/10 text-rose-500 border border-rose-500/30">
            Este usuário ou e-mail já está cadastrado. Tente outro.
          </div>
        `;
        return;
      }

      const newUser = { id: Date.now(), nome, usuario, email, senha };
      state.users.push(newUser);
      saveStorage();

      // Faz login automático com o novo usuário
      state.user = usuario;
      localStorage.setItem('control_auth_user', usuario);
      alert(`Conta criada com sucesso! Bem-vindo(a), ${nome}.`);
      render();
    });
  }
}

function renderActiveTab(filtered) {
  switch (state.activeTab) {
    case 'dashboard':
      return renderDashboardTab(filtered);
    case 'fechamentos':
      return renderFechamentosTab(filtered);
    case 'piscofins':
      return renderPisCofinsTab(filtered);
    case 'irpj_trim':
      return renderIrpjTrimTab(filtered);
    case 'irpj_mensal':
      return renderIrpjMensalTab(filtered);
    case 'tarefas':
      return renderTarefasTab();
    case 'empresas':
      return renderEmpresasTab(filtered);
    default:
      return '';
  }
}

// ---------------- DASHBOARD TAB ----------------
function renderDashboardTab(companies) {
  const realCompanies = companies.filter(c => c.regime && c.regime.includes('Lucro Real'));
  let pendingPis = 0;
  realCompanies.forEach(c => {
    const rec = state.pisCofinsData[`${c.id}_09/2026`];
    if (!rec || rec.status === 'Pendente') pendingPis++;
  });

  const trimCompanies = companies.filter(c => c.regime === 'Lucro Real Trimestral');
  let pendingTrim = 0;
  trimCompanies.forEach(c => {
    const rec = state.irpjTrimData[`${c.id}_3º Trim 2026`];
    if (!rec || (!rec.prejuizo && ((rec.quotaUnica && !rec.darfUnica) || (!rec.quotaUnica && (!rec.p1 || !rec.p2 || !rec.p3))))) {
      pendingTrim++;
    }
  });

  const mensalCompanies = companies.filter(c => c.regime === 'Lucro Real Mensal');
  let pendingMensal = 0;
  mensalCompanies.forEach(c => {
    const rec = state.irpjMensalData[`${c.id}_09/2026`];
    if (!rec || (!rec.prejuizo && rec.status === 'Pendente')) pendingMensal++;
  });

  let emDia = 0, atencao = 0, critico = 0;
  companies.forEach(c => {
    const s = getFechamentoStatus(c.fechamento).status;
    if (s === 'em_dia') emDia++;
    else if (s === 'atencao') atencao++;
    else critico++;
  });
  const tot = companies.length || 1;

  return `
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-2 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h1 class="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white uppercase">
            DASHBOARD DE GESTÃO E CONTROLE CONTÁBIL
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Visão consolidada de fechamentos fiscais, obrigações tributárias e produtividade da equipe
          </p>
        </div>
        <div>
          <span class="px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-[#1C1C23] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800">
            Competência Base: 09/2026
          </span>
        </div>
      </div>

      <!-- CARDS SUPERIORES -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div onclick="switchTab('piscofins')" class="p-5 rounded-3xl bg-white dark:bg-[#15151A] border border-gray-200 dark:border-gray-800 hover:border-[#ECBD56]/50 cursor-pointer shadow-sm transition">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-gray-400">Total DARFs Pendentes PIS/COFINS</span>
            <span class="p-2 rounded-full bg-rose-500/10 text-rose-500 font-bold">⚠️</span>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-3xl font-extrabold text-gray-900 dark:text-white">${pendingPis}</span>
            <span class="text-xs font-semibold text-gray-400">de ${realCompanies.length} empresas (Lucro Real)</span>
          </div>
          <div class="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800/60 flex items-center justify-between text-xs text-[#ECBD56] font-bold">
            <span>Vencimento dia 25</span>
            <span>Ver detalhes →</span>
          </div>
        </div>

        <div onclick="switchTab('irpj_trim')" class="p-5 rounded-3xl bg-white dark:bg-[#15151A] border border-gray-200 dark:border-gray-800 hover:border-[#ECBD56]/50 cursor-pointer shadow-sm transition">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-gray-400">Total DARFs Pendentes IRPJ/CSLL</span>
            <span class="p-2 rounded-full bg-amber-500/10 text-amber-500 font-bold">📑</span>
          </div>
          <div class="mt-3 flex items-baseline gap-4">
            <div>
              <span class="text-3xl font-extrabold text-gray-900 dark:text-white">${pendingTrim}</span>
              <span class="text-[11px] font-bold uppercase text-gray-400 ml-1">Trimestrais</span>
            </div>
            <div class="w-px h-6 bg-gray-700"></div>
            <div>
              <span class="text-3xl font-extrabold text-gray-900 dark:text-white">${pendingMensal}</span>
              <span class="text-[11px] font-bold uppercase text-gray-400 ml-1">Mensais</span>
            </div>
          </div>
          <div class="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800/60 flex items-center justify-between text-xs text-[#ECBD56] font-bold">
            <span>Acompanhamento Geral</span>
            <span>Gerenciar →</span>
          </div>
        </div>

        <div onclick="switchTab('fechamentos')" class="p-5 rounded-3xl bg-white dark:bg-[#15151A] border border-gray-200 dark:border-gray-800 hover:border-[#ECBD56]/50 cursor-pointer shadow-sm transition">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-gray-400">Métrica de Fechamentos</span>
            <span class="p-2 rounded-full bg-emerald-500/10 text-emerald-500 font-bold">📈</span>
          </div>
          <div class="mt-3 grid grid-cols-3 gap-2 text-center">
            <div class="p-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <div class="text-xl font-extrabold text-emerald-500">${Math.round((emDia/tot)*100)}%</div>
              <div class="text-[10px] font-bold uppercase text-emerald-400">Em Dia</div>
            </div>
            <div class="p-2 rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <div class="text-xl font-extrabold text-amber-500">${Math.round((atencao/tot)*100)}%</div>
              <div class="text-[10px] font-bold uppercase text-amber-400">Atenção</div>
            </div>
            <div class="p-2 rounded-2xl bg-rose-500/10 border border-rose-500/20">
              <div class="text-xl font-extrabold text-rose-500">${Math.round((critico/tot)*100)}%</div>
              <div class="text-[10px] font-bold uppercase text-rose-400">Crítico</div>
            </div>
          </div>
          <div class="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800/60 flex items-center justify-between text-xs text-[#ECBD56] font-bold">
            <span>Ideal: Mês Anterior</span>
            <span>Auditar →</span>
          </div>
        </div>
      </div>

      <!-- GRID DE 7 GRÁFICOS -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="p-5 rounded-3xl bg-white dark:bg-[#15151A] border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col">
          <h3 class="font-bold text-sm text-gray-900 dark:text-white mb-4">1. Empresas por Colaborador Responsável</h3>
          <div class="h-56 relative"><canvas id="chartColab"></canvas></div>
        </div>

        <div class="p-5 rounded-3xl bg-white dark:bg-[#15151A] border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col">
          <h3 class="font-bold text-sm text-gray-900 dark:text-white mb-4">2. Segmento de Atuação (Rosca)</h3>
          <div class="h-56 relative"><canvas id="chartSegment"></canvas></div>
        </div>

        <div class="p-5 rounded-3xl bg-white dark:bg-[#15151A] border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col">
          <h3 class="font-bold text-sm text-gray-900 dark:text-white mb-4">3. Status Atual de Fechamento</h3>
          <div class="h-56 relative"><canvas id="chartFechamento"></canvas></div>
        </div>

        <div class="p-5 rounded-3xl bg-white dark:bg-[#15151A] border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col">
          <h3 class="font-bold text-sm text-gray-900 dark:text-white mb-4">4. Classificação por Classe</h3>
          <div class="h-56 relative"><canvas id="chartClass"></canvas></div>
        </div>

        <div class="p-5 rounded-3xl bg-white dark:bg-[#15151A] border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col">
          <h3 class="font-bold text-sm text-gray-900 dark:text-white mb-4">5. PIS/COFINS (Pendentes vs Concluídos)</h3>
          <div class="h-56 relative"><canvas id="chartPis"></canvas></div>
        </div>

        <div class="p-5 rounded-3xl bg-white dark:bg-[#15151A] border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col">
          <h3 class="font-bold text-sm text-gray-900 dark:text-white mb-4">6. IRPJ/CSLL (Pendentes vs Concluídos)</h3>
          <div class="h-56 relative"><canvas id="chartIrpj"></canvas></div>
        </div>

        <div class="p-5 rounded-3xl bg-white dark:bg-[#15151A] border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col lg:col-span-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-sm text-gray-900 dark:text-white">7. Índice de Tarefas (Aberto vs Concluídas)</h3>
            <span class="text-xs text-gray-400">Total: ${state.tasks.length}</span>
          </div>
          <div class="h-56 relative"><canvas id="chartTasks"></canvas></div>
        </div>
      </div>
    </div>
  `;
}

function renderCharts(companies) {
  Object.values(state.charts).forEach(c => { if (c) c.destroy(); });
  state.charts = {};

  const isDark = state.theme === 'dark';
  const textColor = isDark ? '#A1A1AA' : '#52525B';
  const gridColor = isDark ? '#27272A' : '#E4E4E7';

  // 1. Colaborador
  const colabMap = {};
  companies.forEach(c => { colabMap[c.colaborador || 'Outro'] = (colabMap[c.colaborador || 'Outro'] || 0) + 1; });
  const el1 = document.getElementById('chartColab');
  if (el1) {
    state.charts.c1 = new Chart(el1, {
      type: 'bar',
      data: {
        labels: Object.keys(colabMap),
        datasets: [{ label: 'Empresas', data: Object.values(colabMap), backgroundColor: '#ECBD56', borderRadius: 8 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { ticks: { color: textColor }, grid: { display: false } }, y: { ticks: { color: textColor, precision: 0 }, grid: { color: gridColor } } }
      }
    });
  }

  // 2. Segmento
  const segMap = {};
  companies.forEach(c => { segMap[c.segmento || 'Outros'] = (segMap[c.segmento || 'Outros'] || 0) + 1; });
  const el2 = document.getElementById('chartSegment');
  if (el2) {
    state.charts.c2 = new Chart(el2, {
      type: 'doughnut',
      data: {
        labels: Object.keys(segMap),
        datasets: [{ data: Object.values(segMap), backgroundColor: ['#ECBD56', '#133E68', '#22AC77', '#8B5CF6', '#D94838', '#0EA5E9'] }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'right', labels: { color: textColor, boxWidth: 12 } } }
      }
    });
  }

  // 3. Status Fechamento
  let emDia = 0, atencao = 0, critico = 0;
  companies.forEach(c => {
    const s = getFechamentoStatus(c.fechamento).status;
    if (s === 'em_dia') emDia++;
    else if (s === 'atencao') atencao++;
    else critico++;
  });
  const el3 = document.getElementById('chartFechamento');
  if (el3) {
    state.charts.c3 = new Chart(el3, {
      type: 'bar',
      data: {
        labels: ['Em Dia (Ideal)', 'Atenção (1-2m)', 'Crítico (>2m)'],
        datasets: [{ data: [emDia, atencao, critico], backgroundColor: ['#22AC77', '#F59E0B', '#D94838'], borderRadius: 8 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { ticks: { color: textColor }, grid: { display: false } }, y: { ticks: { color: textColor, precision: 0 }, grid: { color: gridColor } } }
      }
    });
  }

  // 4. Classe
  const clsMap = { 'Classe A': 0, 'Classe B': 0, 'Classe C': 0 };
  companies.forEach(c => { clsMap[`Classe ${c.classe || 'C'}`] = (clsMap[`Classe ${c.classe || 'C'}`] || 0) + 1; });
  const el4 = document.getElementById('chartClass');
  if (el4) {
    state.charts.c4 = new Chart(el4, {
      type: 'doughnut',
      data: {
        labels: Object.keys(clsMap),
        datasets: [{ data: Object.values(clsMap), backgroundColor: ['#ECBD56', '#133E68', '#5B5D64'] }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'right', labels: { color: textColor, boxWidth: 12 } } }
      }
    });
  }

  // 5. PIS/COFINS
  const realCos = companies.filter(c => c.regime && c.regime.includes('Lucro Real'));
  let pendPis = 0;
  realCos.forEach(c => {
    const rec = state.pisCofinsData[`${c.id}_09/2026`];
    if (!rec || rec.status === 'Pendente') pendPis++;
  });
  const el5 = document.getElementById('chartPis');
  if (el5) {
    state.charts.c5 = new Chart(el5, {
      type: 'pie',
      data: {
        labels: ['Pendentes', 'Concluídos'],
        datasets: [{ data: [pendPis, Math.max(0, realCos.length - pendPis)], backgroundColor: ['#D94838', '#22AC77'] }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { color: textColor, boxWidth: 12 } } }
      }
    });
  }

  // 6. IRPJ/CSLL
  const el6 = document.getElementById('chartIrpj');
  if (el6) {
    state.charts.c6 = new Chart(el6, {
      type: 'pie',
      data: {
        labels: ['Pendentes', 'Concluídos'],
        datasets: [{ data: [3, 5], backgroundColor: ['#D94838', '#22AC77'] }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { color: textColor, boxWidth: 12 } } }
      }
    });
  }

  // 7. Tarefas
  const abertas = state.tasks.filter(t => !t.concluida).length;
  const conc = state.tasks.filter(t => t.concluida).length;
  const el7 = document.getElementById('chartTasks');
  if (el7) {
    state.charts.c7 = new Chart(el7, {
      type: 'doughnut',
      data: {
        labels: ['Em Aberto', 'Concluídas'],
        datasets: [{ data: [abertas, conc], backgroundColor: ['#F59E0B', '#22AC77'] }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { color: textColor, boxWidth: 12 } } }
      }
    });
  }
}

// ---------------- FECHAMENTOS TAB ----------------
function renderFechamentosTab(companies) {
  const list = companies.filter(c => {
    if (state.fechamentoFilter === 'all') return true;
    return getFechamentoStatus(c.fechamento).status === state.fechamentoFilter;
  });

  return `
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-2 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h1 class="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white uppercase">Controle de Fechamentos Contábeis</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400">Competência ideal: mês anterior (2026-08). Acompanhe o avanço contábil por empresa.</p>
        </div>

        <div class="flex items-center gap-2 bg-white dark:bg-[#15151A] p-1.5 rounded-full border border-gray-200 dark:border-gray-800">
          ${[
            { id: 'all', label: 'Todas' },
            { id: 'em_dia', label: '🟢 Em Dia' },
            { id: 'atencao', label: '🟡 Atenção' },
            { id: 'critico', label: '🔴 Crítico' }
          ].map(f => `
            <button
              onclick="setFechamentoFilter('${f.id}')"
              class="px-3 py-1.5 rounded-full text-xs font-bold transition ${state.fechamentoFilter === f.id ? 'bg-[#ECBD56] text-gray-950' : 'text-gray-400'}"
            >
              ${f.label}
            </button>
          `).join('')}
        </div>
      </div>

      <div class="overflow-x-auto rounded-3xl bg-white dark:bg-[#15151A] border border-gray-200 dark:border-gray-800 shadow-sm">
        <table class="w-full text-left text-sm border-collapse">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-800/80 bg-gray-50/50 dark:bg-[#1C1C23]/50 text-gray-400 uppercase text-[11px] font-bold tracking-wider">
              <th class="py-4 px-6">Empresa & CNPJ</th>
              <th class="py-4 px-4">Regime</th>
              <th class="py-4 px-4">Responsável</th>
              <th class="py-4 px-4">Último Fechamento</th>
              <th class="py-4 px-4">Status</th>
              <th class="py-4 px-6 text-right">Ação</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800/60">
            ${list.map(c => {
              const st = getFechamentoStatus(c.fechamento);
              return `
                <tr class="hover:bg-gray-50 dark:hover:bg-[#1C1C23]/40 transition">
                  <td class="py-4 px-6">
                    <div class="font-bold text-gray-900 dark:text-white">${c.nome}</div>
                    <div class="text-xs text-gray-400 font-mono">${c.cnpj}</div>
                  </td>
                  <td class="py-4 px-4 text-xs font-semibold text-gray-600 dark:text-gray-300">${c.regime}</td>
                  <td class="py-4 px-4 text-xs font-medium text-gray-600 dark:text-gray-300">${c.colaborador}</td>
                  <td class="py-4 px-4">
                    <input
                      type="month"
                      value="${c.fechamento || '2026-08'}"
                      onchange="updateCompanyFechamento(${c.id}, this.value)"
                      class="px-3 py-1.5 text-xs rounded-xl bg-gray-100 dark:bg-[#1C1C23] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#ECBD56]"
                    />
                  </td>
                  <td class="py-4 px-4">
                    <span class="px-3 py-1 rounded-full text-xs font-semibold ${st.css}">${st.label}</span>
                  </td>
                  <td class="py-4 px-6 text-right">
                    <button
                      onclick="updateCompanyFechamento(${c.id}, '2026-08')"
                      class="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#22AC77]/10 text-[#22AC77] hover:bg-[#22AC77]/20 border border-[#22AC77]/30 transition"
                    >
                      Avançar p/ 08/2026
                    </button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ---------------- PIS / COFINS TAB ----------------
function renderPisCofinsTab(companies) {
  const realCos = companies.filter(c => c.regime && c.regime.includes('Lucro Real'));

  return `
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-2 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h1 class="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white uppercase">Apuração PIS / COFINS (Mensal)</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400">Exclusivo para empresas do Regime de Lucro Real. Vencimento: dia 25.</p>
        </div>

        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2 bg-white dark:bg-[#15151A] px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-800">
            <span class="text-xs font-bold text-gray-400">Competência:</span>
            <select id="sel-pis-comp" onchange="setPisComp(this.value)" class="bg-transparent text-xs font-bold text-gray-900 dark:text-white focus:outline-none cursor-pointer">
              ${MONTH_COMPETENCIES.map(m => `<option value="${m}" ${state.selPisComp === m ? 'selected' : ''} class="bg-[#15151A] text-white">${m}</option>`).join('')}
            </select>
          </div>

          <button onclick="resetPisMonth()" class="px-4 py-2 rounded-full text-xs font-bold bg-[#D94838]/10 text-[#D94838] hover:bg-[#D94838]/20 border border-[#D94838]/30 transition">
            Resetar Mês
          </button>
        </div>
      </div>

      <div class="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-medium">
        ⚠️ <strong>Atenção ao Prazo Legal:</strong> O DARF deve ser transmitido e pago até o dia 25 do mês subsequente (antecipando se dia não útil).
      </div>

      <div class="overflow-x-auto rounded-3xl bg-white dark:bg-[#15151A] border border-gray-200 dark:border-gray-800 shadow-sm">
        <table class="w-full text-left text-sm border-collapse">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-800/80 bg-gray-50/50 dark:bg-[#1C1C23]/50 text-gray-400 uppercase text-[11px] font-bold tracking-wider">
              <th class="py-4 px-6">Empresa & CNPJ</th>
              <th class="py-4 px-4">Regime</th>
              <th class="py-4 px-4">Responsável</th>
              <th class="py-4 px-4">Situação</th>
              <th class="py-4 px-6 text-center">DARF Enviado?</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800/60">
            ${realCos.map(c => {
              const rec = state.pisCofinsData[`${c.id}_${state.selPisComp}`] || { status: 'Pendente', darfEnviado: false };
              return `
                <tr class="hover:bg-gray-50 dark:hover:bg-[#1C1C23]/40 transition">
                  <td class="py-4 px-6">
                    <div class="font-bold text-gray-900 dark:text-white">${c.nome}</div>
                    <div class="text-xs text-gray-400 font-mono">${c.cnpj}</div>
                  </td>
                  <td class="py-4 px-4 text-xs font-semibold text-gray-600 dark:text-gray-300">${c.regime}</td>
                  <td class="py-4 px-4 text-xs font-medium text-gray-600 dark:text-gray-300">${c.colaborador}</td>
                  <td class="py-4 px-4">
                    <select
                      onchange="updatePisStatus(${c.id}, this.value)"
                      class="px-3 py-1.5 rounded-full text-xs font-bold border focus:outline-none transition cursor-pointer ${
                        rec.status === 'Concluída' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                        rec.status === 'Análise' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                        rec.status === 'Isenta' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' :
                        'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }"
                    >
                      <option value="Pendente" ${rec.status === 'Pendente' ? 'selected' : ''} class="bg-[#15151A] text-white">🔴 Pendente</option>
                      <option value="Análise" ${rec.status === 'Análise' ? 'selected' : ''} class="bg-[#15151A] text-white">🟡 Análise</option>
                      <option value="Concluída" ${rec.status === 'Concluída' ? 'selected' : ''} class="bg-[#15151A] text-white">🟢 Concluída</option>
                      <option value="Isenta" ${rec.status === 'Isenta' ? 'selected' : ''} class="bg-[#15151A] text-white">🟣 Isenta</option>
                    </select>
                  </td>
                  <td class="py-4 px-6 text-center">
                    <label class="inline-flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        ${rec.darfEnviado ? 'checked' : ''}
                        onchange="togglePisDarf(${c.id}, this.checked)"
                        class="w-5 h-5 rounded-md text-[#ECBD56] focus:ring-[#ECBD56]"
                      />
                      <span class="text-xs font-semibold text-gray-300">${rec.darfEnviado ? 'Enviado' : 'Não enviado'}</span>
                    </label>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ---------------- IRPJ TRIMESTRAL TAB ----------------
function renderIrpjTrimTab(companies) {
  const trimCos = companies.filter(c => c.regime === 'Lucro Real Trimestral');

  return `
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-2 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h1 class="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white uppercase">IRPJ / CSLL - Lucro Real Trimestral</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400">Apuração trimestral com opções de Quota Única ou Parcelamento em 3 Quotas.</p>
        </div>

        <div class="flex items-center gap-2 bg-white dark:bg-[#15151A] px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-800">
          <span class="text-xs font-bold text-gray-400">Trimestre:</span>
          <select onchange="setTrim(this.value)" class="bg-transparent text-xs font-bold text-gray-900 dark:text-white focus:outline-none cursor-pointer">
            ${QUARTERS.map(q => `<option value="${q}" ${state.selTrim === q ? 'selected' : ''} class="bg-[#15151A] text-white">${q}</option>`).join('')}
          </select>
        </div>
      </div>

      <div class="overflow-x-auto rounded-3xl bg-white dark:bg-[#15151A] border border-gray-200 dark:border-gray-800 shadow-sm">
        <table class="w-full text-left text-sm border-collapse">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-800/80 bg-gray-50/50 dark:bg-[#1C1C23]/50 text-gray-400 uppercase text-[11px] font-bold tracking-wider">
              <th class="py-4 px-6">Empresa & CNPJ</th>
              <th class="py-4 px-4">Responsável</th>
              <th class="py-4 px-4">Prejuízo Fiscal?</th>
              <th class="py-4 px-4">Modalidade de Pagamento</th>
              <th class="py-4 px-6 text-center">Status / DARFs</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800/60">
            ${trimCos.map(c => {
              const rec = state.irpjTrimData[`${c.id}_${state.selTrim}`] || { prejuizo: false, quotaUnica: true, darfUnica: false, p1: false, p2: false, p3: false };
              return `
                <tr class="hover:bg-gray-50 dark:hover:bg-[#1C1C23]/40 transition">
                  <td class="py-4 px-6">
                    <div class="font-bold text-gray-900 dark:text-white">${c.nome}</div>
                    <div class="text-xs text-gray-400 font-mono">${c.cnpj}</div>
                  </td>
                  <td class="py-4 px-4 text-xs font-medium text-gray-600 dark:text-gray-300">${c.colaborador}</td>
                  <td class="py-4 px-4">
                    <label class="inline-flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        ${rec.prejuizo ? 'checked' : ''}
                        onchange="toggleTrimPrejuizo(${c.id}, this.checked)"
                        class="w-5 h-5 rounded-md text-[#ECBD56] focus:ring-[#ECBD56]"
                      />
                      <span class="text-xs font-bold ${rec.prejuizo ? 'text-purple-400' : 'text-gray-400'}">${rec.prejuizo ? 'Sem DARF (Prejuízo)' : 'Não'}</span>
                    </label>
                  </td>
                  <td class="py-4 px-4">
                    ${rec.prejuizo ? '<span class="text-xs text-gray-400 italic">Dispensado</span>' : `
                      <div class="flex items-center gap-4 text-xs font-semibold">
                        <label class="inline-flex items-center gap-1.5 cursor-pointer">
                          <input type="radio" name="mode_${c.id}" ${rec.quotaUnica ? 'checked' : ''} onchange="setTrimQuotaMode(${c.id}, true)" />
                          <span>Quota Única</span>
                        </label>
                        <label class="inline-flex items-center gap-1.5 cursor-pointer">
                          <input type="radio" name="mode_${c.id}" ${!rec.quotaUnica ? 'checked' : ''} onchange="setTrimQuotaMode(${c.id}, false)" />
                          <span>3 Parcelas</span>
                        </label>
                      </div>
                    `}
                  </td>
                  <td class="py-4 px-6 text-center">
                    ${rec.prejuizo ? `
                      <span class="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30">🟢 Concluído (Prejuízo)</span>
                    ` : rec.quotaUnica ? `
                      <label class="inline-flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" ${rec.darfUnica ? 'checked' : ''} onchange="toggleTrimDarfUnica(${c.id}, this.checked)" class="w-5 h-5 rounded text-[#22AC77]" />
                        <span class="text-xs font-bold ${rec.darfUnica ? 'text-emerald-400' : 'text-rose-400'}">${rec.darfUnica ? 'DARF Única Paga' : 'DARF Pendente'}</span>
                      </label>
                    ` : `
                      <div class="flex items-center justify-center gap-3">
                        <label class="inline-flex items-center gap-1 cursor-pointer">
                          <input type="checkbox" ${rec.p1 ? 'checked' : ''} onchange="toggleTrimParcela(${c.id}, 1, this.checked)" class="w-4 h-4 rounded text-[#22AC77]" />
                          <span class="text-xs ${rec.p1 ? 'text-emerald-400 font-bold' : 'text-gray-400'}">1ª</span>
                        </label>
                        <label class="inline-flex items-center gap-1 cursor-pointer">
                          <input type="checkbox" ${rec.p2 ? 'checked' : ''} onchange="toggleTrimParcela(${c.id}, 2, this.checked)" class="w-4 h-4 rounded text-[#22AC77]" />
                          <span class="text-xs ${rec.p2 ? 'text-emerald-400 font-bold' : 'text-gray-400'}">2ª</span>
                        </label>
                        <label class="inline-flex items-center gap-1 cursor-pointer">
                          <input type="checkbox" ${rec.p3 ? 'checked' : ''} onchange="toggleTrimParcela(${c.id}, 3, this.checked)" class="w-4 h-4 rounded text-[#22AC77]" />
                          <span class="text-xs ${rec.p3 ? 'text-emerald-400 font-bold' : 'text-gray-400'}">3ª</span>
                        </label>
                      </div>
                    `}
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ---------------- IRPJ MENSAL TAB ----------------
function renderIrpjMensalTab(companies) {
  const mensalCos = companies.filter(c => c.regime === 'Lucro Real Mensal');

  return `
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-2 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h1 class="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white uppercase">IRPJ / CSLL - Lucro Real Mensal</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400">Apuração mensal por estimativa com opções de recolhimento ou prejuízo acumulado.</p>
        </div>

        <div class="flex items-center gap-2 bg-white dark:bg-[#15151A] px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-800">
          <span class="text-xs font-bold text-gray-400">Mês:</span>
          <select onchange="setIrpjMes(this.value)" class="bg-transparent text-xs font-bold text-gray-900 dark:text-white focus:outline-none cursor-pointer">
            ${MONTH_COMPETENCIES.map(m => `<option value="${m}" ${state.selIrpjMes === m ? 'selected' : ''} class="bg-[#15151A] text-white">${m}</option>`).join('')}
          </select>
        </div>
      </div>

      <div class="overflow-x-auto rounded-3xl bg-white dark:bg-[#15151A] border border-gray-200 dark:border-gray-800 shadow-sm">
        <table class="w-full text-left text-sm border-collapse">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-800/80 bg-gray-50/50 dark:bg-[#1C1C23]/50 text-gray-400 uppercase text-[11px] font-bold tracking-wider">
              <th class="py-4 px-6">Empresa & CNPJ</th>
              <th class="py-4 px-4">Responsável</th>
              <th class="py-4 px-4">Prejuízo Fiscal?</th>
              <th class="py-4 px-4">Situação</th>
              <th class="py-4 px-6 text-center">Status Final</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800/60">
            ${mensalCos.map(c => {
              const rec = state.irpjMensalData[`${c.id}_${state.selIrpjMes}`] || { status: 'Pendente', prejuizo: false };
              return `
                <tr class="hover:bg-gray-50 dark:hover:bg-[#1C1C23]/40 transition">
                  <td class="py-4 px-6">
                    <div class="font-bold text-gray-900 dark:text-white">${c.nome}</div>
                    <div class="text-xs text-gray-400 font-mono">${c.cnpj}</div>
                  </td>
                  <td class="py-4 px-4 text-xs font-medium text-gray-600 dark:text-gray-300">${c.colaborador}</td>
                  <td class="py-4 px-4">
                    <label class="inline-flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        ${rec.prejuizo ? 'checked' : ''}
                        onchange="toggleMensalPrejuizo(${c.id}, this.checked)"
                        class="w-5 h-5 rounded-md text-[#ECBD56] focus:ring-[#ECBD56]"
                      />
                      <span class="text-xs font-bold ${rec.prejuizo ? 'text-purple-400' : 'text-gray-400'}">${rec.prejuizo ? 'Sim (Sem DARF)' : 'Não'}</span>
                    </label>
                  </td>
                  <td class="py-4 px-4">
                    ${rec.prejuizo ? '<span class="text-xs text-purple-400 font-semibold">Concluído via Prejuízo</span>' : `
                      <select
                        onchange="updateMensalStatus(${c.id}, this.value)"
                        class="px-3 py-1.5 rounded-full text-xs font-bold border focus:outline-none transition cursor-pointer ${
                          rec.status === 'Concluída' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                          rec.status === 'Análise' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                          rec.status === 'Estimativa' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' :
                          'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        }"
                      >
                        <option value="Pendente" ${rec.status === 'Pendente' ? 'selected' : ''} class="bg-[#15151A] text-white">🔴 Pendente</option>
                        <option value="Análise" ${rec.status === 'Análise' ? 'selected' : ''} class="bg-[#15151A] text-white">🟡 Análise</option>
                        <option value="Concluída" ${rec.status === 'Concluída' ? 'selected' : ''} class="bg-[#15151A] text-white">🟢 Concluída</option>
                        <option value="Estimativa" ${rec.status === 'Estimativa' ? 'selected' : ''} class="bg-[#15151A] text-white">🟣 Estimativa</option>
                      </select>
                    `}
                  </td>
                  <td class="py-4 px-6 text-center">
                    <span class="px-3 py-1 rounded-full text-xs font-bold ${
                      rec.status === 'Concluída' || rec.prejuizo ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }">
                      ${rec.status === 'Concluída' || rec.prejuizo ? 'Concluído' : 'Pendente'}
                    </span>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ---------------- TAREFAS TAB (GOOGLE TASKS) ----------------
function renderTarefasTab() {
  const urgencyWeight = { 'Alta': 3, 'Media': 2, 'Baixa': 1 };
  const activeTasks = state.tasks.filter(t => !t.concluida).sort((a, b) => {
    const diff = (urgencyWeight[b.urgencia] || 1) - (urgencyWeight[a.urgencia] || 1);
    if (diff !== 0) return diff;
    return new Date(a.data) - new Date(b.data);
  });
  const completedTasks = state.tasks.filter(t => t.concluida);
  const displayList = state.taskFilter === 'ativas' ? activeTasks : completedTasks;

  return `
    <div class="space-y-6 max-w-4xl mx-auto">
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-2 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h1 class="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white uppercase">Gestão de Tarefas (Google Tasks)</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400">Organize pendências com ordenação automática por urgência e proximidade de vencimento.</p>
        </div>

        <div class="flex items-center gap-2 bg-white dark:bg-[#15151A] p-1.5 rounded-full border border-gray-200 dark:border-gray-800">
          <button
            onclick="setTaskFilter('ativas')"
            class="px-4 py-1.5 rounded-full text-xs font-bold transition ${state.taskFilter === 'ativas' ? 'bg-[#ECBD56] text-gray-950' : 'text-gray-400'}"
          >
            Pendentes (${activeTasks.length})
          </button>
          <button
            onclick="setTaskFilter('concluidas')"
            class="px-4 py-1.5 rounded-full text-xs font-bold transition ${state.taskFilter === 'concluidas' ? 'bg-[#ECBD56] text-gray-950' : 'text-gray-400'}"
          >
            Concluídas (${completedTasks.length})
          </button>
        </div>
      </div>

      <!-- Formulário de Adicionar Tarefa -->
      <form id="new-task-form" class="p-5 rounded-3xl bg-white dark:bg-[#15151A] border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
        <div class="flex items-center gap-2 font-bold text-sm text-gray-900 dark:text-white">
          <span class="text-[#ECBD56]">➕</span>
          <span>Criar Nova Tarefa</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            id="task-title-input"
            required
            placeholder="Título da tarefa..."
            class="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-[#1C1C23] border border-gray-200 dark:border-gray-700/60 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#ECBD56]"
          />
          <input
            type="text"
            id="task-desc-input"
            placeholder="Descrição ou observações (opcional)..."
            class="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-[#1C1C23] border border-gray-200 dark:border-gray-700/60 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#ECBD56]"
          />
        </div>

        <div class="flex flex-wrap items-center justify-between gap-4 pt-1">
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-2">
              <span class="text-xs font-semibold text-gray-400">Data Limite:</span>
              <input
                type="date"
                id="task-date-input"
                required
                value="2026-10-05"
                class="px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-[#1C1C23] border border-gray-200 dark:border-gray-700/60 text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#ECBD56]"
              />
            </div>

            <div class="flex items-center gap-2">
              <span class="text-xs font-semibold text-gray-400">Urgência:</span>
              <select
                id="task-urgency-input"
                class="px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-[#1C1C23] border border-gray-200 dark:border-gray-700/60 text-gray-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#ECBD56]"
              >
                <option value="Alta">🔴 Alta</option>
                <option value="Media">🟡 Média</option>
                <option value="Baixa">🟢 Baixa</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            class="px-6 py-2 rounded-full font-bold text-xs text-gray-950 bg-[#ECBD56] hover:bg-[#DEA93F] transition shadow-md shadow-[#ECBD56]/20"
          >
            Adicionar Tarefa
          </button>
        </div>
      </form>

      <!-- Lista de Tarefas -->
      <div class="space-y-3">
        ${displayList.map(t => `
          <div class="p-4 rounded-2xl border transition flex items-start gap-4 ${
            t.concluida ? 'bg-gray-50/50 dark:bg-[#15151A]/40 border-gray-200 dark:border-gray-800/40 opacity-70' : 'bg-white dark:bg-[#15151A] border-gray-200 dark:border-gray-800 shadow-sm hover:border-[#ECBD56]/40'
          }">
            <button
              onclick="toggleTaskComplete(${t.id})"
              class="mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                t.concluida ? 'bg-[#22AC77] border-[#22AC77] text-white' : 'border-gray-500 hover:border-[#ECBD56]'
              }"
            >
              ${t.concluida ? '✓' : ''}
            </button>

            <div class="flex-1">
              <div class="flex items-center gap-3">
                <h4 class="font-bold text-sm ${t.concluida ? 'line-through text-gray-400' : 'text-gray-900 dark:text-white'}">
                  ${t.titulo}
                </h4>
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  t.urgencia === 'Alta' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
                  t.urgencia === 'Media' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                  'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                }">
                  ${t.urgencia}
                </span>
              </div>
              ${t.descricao ? `<p class="text-xs text-gray-400 mt-1">${t.descricao}</p>` : ''}
              <div class="flex items-center gap-3 mt-2 text-[11px] text-gray-400">
                <span>📅 Vencimento: ${t.data}</span>
              </div>
            </div>

            <button onclick="deleteTask(${t.id})" class="p-1.5 rounded-full hover:bg-rose-500/10 text-gray-400 hover:text-rose-500 transition" title="Excluir">
              🗑️
            </button>
          </div>
        `).join('')}

        ${displayList.length === 0 ? `
          <div class="p-8 text-center rounded-3xl bg-white dark:bg-[#15151A] border border-gray-200 dark:border-gray-800 text-gray-400">
            <p class="text-sm font-semibold">Nenhuma tarefa nesta categoria no momento!</p>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// ABA 7: CADASTRO E GESTÃO DE EMPRESAS (COM FILTROS COMPLETOS)
// ----------------------------------------------------
function renderEmpresasTab(companies) {
  // Obter listas únicas para popular os selects de filtro
  const allResponsaveis = Array.from(new Set(state.companies.map(c => c.colaborador).filter(Boolean))).sort();
  const allRegimes = Array.from(new Set(state.companies.map(c => c.regime).filter(Boolean))).sort();
  const allClasses = Array.from(new Set(state.companies.map(c => c.classe).filter(Boolean))).sort();
  const allGrupos = Array.from(new Set(state.companies.map(c => c.grupo).filter(Boolean))).sort();
  const allSegmentos = Array.from(new Set(state.companies.map(c => c.segmento).filter(Boolean))).sort();

  // Aplicação dos Filtros dedicados
  const fList = companies.filter(c => {
    if (state.crudFilters.responsavel !== 'todos' && c.colaborador !== state.crudFilters.responsavel) return false;
    if (state.crudFilters.regime !== 'todos' && c.regime !== state.crudFilters.regime) return false;
    if (state.crudFilters.classe !== 'todos' && c.classe !== state.crudFilters.classe) return false;
    if (state.crudFilters.grupo !== 'todos' && c.grupo !== state.crudFilters.grupo) return false;
    if (state.crudFilters.segmento !== 'todos' && c.segmento !== state.crudFilters.segmento) return false;
    return true;
  });

  return `
    <div class="space-y-6">
      <!-- Cabeçalho da Aba -->
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-2 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h1 class="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white uppercase">
            Cadastro e Gestão de Empresas
          </h1>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Base cadastral com ${state.companies.length} empresas. Utilize os filtros abaixo para conferência rápida de dados.
          </p>
        </div>

        <button
          onclick="openCompanyModal('create')"
          class="px-5 py-2.5 rounded-full font-bold text-xs text-gray-950 bg-[#ECBD56] hover:bg-[#DEA93F] transition shadow-md shadow-[#ECBD56]/20 flex items-center gap-2"
        >
          <span>➕</span>
          <span>Cadastrar Empresa</span>
        </button>
      </div>

      <!-- SEÇÃO DEDICADA DE FILTROS PARA CONFERÊNCIA RÁPIDA -->
      <div class="p-5 rounded-3xl bg-white dark:bg-[#15151A] border border-gray-200 dark:border-gray-800 shadow-sm space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            <span class="text-[#ECBD56]">🔍</span>
            <span>Filtros Rápidos para Conferência</span>
          </div>
          <button
            onclick="clearCrudFilters()"
            class="text-xs text-[#ECBD56] hover:underline font-semibold"
          >
            Limpar Filtros
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <!-- Filtro Responsável -->
          <div>
            <label class="block text-[11px] font-semibold text-gray-400 mb-1">Responsável</label>
            <select
              onchange="setCrudFilter('responsavel', this.value)"
              class="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#1C1C23] border border-gray-200 dark:border-gray-700/60 text-gray-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#ECBD56]"
            >
              <option value="todos">Todos os Responsáveis</option>
              ${allResponsaveis.map(r => `<option value="${r}" ${state.crudFilters.responsavel === r ? 'selected' : ''}>${r}</option>`).join('')}
            </select>
          </div>

          <!-- Filtro Regime Tributário -->
          <div>
            <label class="block text-[11px] font-semibold text-gray-400 mb-1">Regime Tributário</label>
            <select
              onchange="setCrudFilter('regime', this.value)"
              class="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#1C1C23] border border-gray-200 dark:border-gray-700/60 text-gray-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#ECBD56]"
            >
              <option value="todos">Todos os Regimes</option>
              ${allRegimes.map(rg => `<option value="${rg}" ${state.crudFilters.regime === rg ? 'selected' : ''}>${rg}</option>`).join('')}
            </select>
          </div>

          <!-- Filtro Classe -->
          <div>
            <label class="block text-[11px] font-semibold text-gray-400 mb-1">Classe</label>
            <select
              onchange="setCrudFilter('classe', this.value)"
              class="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#1C1C23] border border-gray-200 dark:border-gray-700/60 text-gray-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#ECBD56]"
            >
              <option value="todos">Todas as Classes</option>
              ${allClasses.map(cl => `<option value="${cl}" ${state.crudFilters.classe === cl ? 'selected' : ''}>Classe ${cl}</option>`).join('')}
            </select>
          </div>

          <!-- Filtro Grupo -->
          <div>
            <label class="block text-[11px] font-semibold text-gray-400 mb-1">Grupo Empresarial</label>
            <select
              onchange="setCrudFilter('grupo', this.value)"
              class="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#1C1C23] border border-gray-200 dark:border-gray-700/60 text-gray-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#ECBD56]"
            >
              <option value="todos">Todos os Grupos</option>
              ${allGrupos.map(g => `<option value="${g}" ${state.crudFilters.grupo === g ? 'selected' : ''}>${g}</option>`).join('')}
            </select>
          </div>

          <!-- Filtro Segmento -->
          <div>
            <label class="block text-[11px] font-semibold text-gray-400 mb-1">Segmento</label>
            <select
              onchange="setCrudFilter('segmento', this.value)"
              class="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#1C1C23] border border-gray-200 dark:border-gray-700/60 text-gray-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#ECBD56]"
            >
              <option value="todos">Todos os Segmentos</option>
              ${allSegmentos.map(s => `<option value="${s}" ${state.crudFilters.segmento === s ? 'selected' : ''}>${s}</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="text-[11px] text-gray-400 pt-1 flex items-center justify-between">
          <span>Exibindo <strong>${fList.length}</strong> de <strong>${state.companies.length}</strong> empresas</span>
        </div>
      </div>

      <!-- Tabela de Empresas -->
      <div class="overflow-x-auto rounded-3xl bg-white dark:bg-[#15151A] border border-gray-200 dark:border-gray-800 shadow-sm">
        <table class="w-full text-left text-sm border-collapse">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-800/80 bg-gray-50/50 dark:bg-[#1C1C23]/50 text-gray-400 uppercase text-[11px] font-bold tracking-wider">
              <th class="py-4 px-4">Cód.</th>
              <th class="py-4 px-4">Grupo</th>
              <th class="py-4 px-6">Empresa & CNPJ</th>
              <th class="py-4 px-3 text-center">Classe</th>
              <th class="py-4 px-4">Regime Tributário</th>
              <th class="py-4 px-4">Responsável</th>
              <th class="py-4 px-4">Segmento</th>
              <th class="py-4 px-6 text-right">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800/60">
            ${fList.map(c => `
              <tr class="hover:bg-gray-50 dark:hover:bg-[#1C1C23]/40 transition">
                <td class="py-4 px-4 font-mono text-xs font-bold text-[#ECBD56]">
                  ${c.codigo || c.id}
                </td>
                <td class="py-4 px-4 text-xs font-semibold text-gray-400 uppercase">
                  ${c.grupo || '-'}
                </td>
                <td class="py-4 px-6">
                  <div class="font-bold text-gray-900 dark:text-white">${c.nome}</div>
                  <div class="text-xs text-gray-400 font-mono">${c.cnpj}</div>
                </td>
                <td class="py-4 px-3 text-center">
                  <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#ECBD56]/10 text-[#ECBD56] border border-[#ECBD56]/30">
                    ${c.classe || 'A'}
                  </span>
                </td>
                <td class="py-4 px-4">
                  <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    c.regime && c.regime.includes('Real') ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' : 'bg-gray-500/10 text-gray-400 border border-gray-500/30'
                  }">
                    ${c.regime}
                  </span>
                </td>
                <td class="py-4 px-4 text-xs font-medium text-gray-600 dark:text-gray-300">
                  ${c.colaborador}
                </td>
                <td class="py-4 px-4 text-xs text-gray-400">
                  ${c.segmento}
                </td>
                <td class="py-4 px-6 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button onclick="openCompanyModal('view', ${c.id})" class="p-1.5 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition" title="Visualizar Detalhes">
                      👁️
                    </button>
                    <button onclick="openCompanyModal('edit', ${c.id})" class="p-1.5 rounded-full hover:bg-gray-800 text-gray-400 hover:text-[#ECBD56] transition" title="Editar Empresa">
                      ✏️
                    </button>
                    <button onclick="deleteCompany(${c.id})" class="p-1.5 rounded-full hover:bg-rose-500/10 text-gray-400 hover:text-rose-500 transition" title="Excluir Empresa">
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        ${fList.length === 0 ? `
          <div class="p-8 text-center text-gray-400 text-xs">
            Nenhuma empresa encontrada com os filtros selecionados.
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

// ---------------- MODAL DE CRUD DE EMPRESA ----------------
function renderCompanyModal() {
  const { mode, company } = state.modal;
  const isView = mode === 'view';
  const c = company || {
    codigo: '',
    grupo: '',
    nome: '',
    cnpj: '',
    classe: 'A',
    regime: 'Lucro Real Mensal',
    colaborador: 'Brayann',
    segmento: 'Serviços',
    fechamento: '2026-08'
  };

  return `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div class="w-full max-w-lg rounded-3xl bg-white dark:bg-[#15151A] border border-gray-200 dark:border-gray-800 shadow-2xl p-6 relative">
        <div class="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
          <h3 class="font-extrabold text-lg text-gray-900 dark:text-white">
            ${mode === 'create' ? 'Cadastrar Nova Empresa' : mode === 'edit' ? 'Editar Empresa' : 'Detalhes da Empresa'}
          </h3>
          <button onclick="closeCompanyModal()" class="p-1.5 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white">✕</button>
        </div>

        <form id="company-modal-form" class="mt-5 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-400 mb-1">1. Código</label>
              <input
                type="text"
                id="modal-codigo"
                ${isView ? 'disabled' : ''}
                value="${c.codigo || ''}"
                placeholder="Ex: 001"
                class="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-[#1C1C23] border border-gray-200 dark:border-gray-700/60 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#ECBD56]"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-400 mb-1">2. Grupo Empresarial</label>
              <input
                type="text"
                id="modal-grupo"
                ${isView ? 'disabled' : ''}
                value="${c.grupo || ''}"
                placeholder="Ex: HOLDING"
                class="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-[#1C1C23] border border-gray-200 dark:border-gray-700/60 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#ECBD56]"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-400 mb-1">3. Razão Social / Empresa</label>
            <input
              type="text"
              id="modal-nome"
              required
              ${isView ? 'disabled' : ''}
              value="${c.nome}"
              placeholder="Nome da empresa"
              class="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-[#1C1C23] border border-gray-200 dark:border-gray-700/60 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#ECBD56]"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-400 mb-1">4. CNPJ</label>
              <input
                type="text"
                id="modal-cnpj"
                required
                ${isView ? 'disabled' : ''}
                value="${c.cnpj}"
                placeholder="00.000.000/0001-00"
                class="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-[#1C1C23] border border-gray-200 dark:border-gray-700/60 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#ECBD56]"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-400 mb-1">5. Classe</label>
              <select
                id="modal-classe"
                ${isView ? 'disabled' : ''}
                class="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-[#1C1C23] border border-gray-200 dark:border-gray-700/60 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#ECBD56]"
              >
                <option value="A" ${c.classe === 'A' ? 'selected' : ''}>Classe A</option>
                <option value="B" ${c.classe === 'B' ? 'selected' : ''}>Classe B</option>
                <option value="C" ${c.classe === 'C' ? 'selected' : ''}>Classe C</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-400 mb-1">6. Regime Tributário</label>
              <select
                id="modal-regime"
                ${isView ? 'disabled' : ''}
                class="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-[#1C1C23] border border-gray-200 dark:border-gray-700/60 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#ECBD56]"
              >
                <option value="Lucro Real Mensal" ${c.regime === 'Lucro Real Mensal' ? 'selected' : ''}>Lucro Real Mensal</option>
                <option value="Lucro Real Trimestral" ${c.regime === 'Lucro Real Trimestral' ? 'selected' : ''}>Lucro Real Trimestral</option>
                <option value="Lucro Presumido" ${c.regime === 'Lucro Presumido' ? 'selected' : ''}>Lucro Presumido</option>
                <option value="Simples Nacional" ${c.regime === 'Simples Nacional' ? 'selected' : ''}>Simples Nacional</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-400 mb-1">7. Responsável</label>
              <input
                type="text"
                id="modal-colaborador"
                ${isView ? 'disabled' : ''}
                value="${c.colaborador}"
                placeholder="Ex: Brayann"
                class="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-[#1C1C23] border border-gray-200 dark:border-gray-700/60 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#ECBD56]"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-400 mb-1">8. Segmento</label>
              <input
                type="text"
                id="modal-segmento"
                ${isView ? 'disabled' : ''}
                value="${c.segmento}"
                placeholder="Ex: Comércio"
                class="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-[#1C1C23] border border-gray-200 dark:border-gray-700/60 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#ECBD56]"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-400 mb-1">Mês Fechamento Base</label>
              <input
                type="month"
                id="modal-fechamento"
                ${isView ? 'disabled' : ''}
                value="${c.fechamento || '2026-08'}"
                class="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-[#1C1C23] border border-gray-200 dark:border-gray-700/60 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#ECBD56]"
              />
            </div>
          </div>

          <div class="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 dark:border-gray-800">
            <button type="button" onclick="closeCompanyModal()" class="px-5 py-2.5 rounded-full text-xs font-bold text-gray-400 hover:text-white transition">
              Cancelar
            </button>
            ${!isView ? `
              <button type="submit" class="px-6 py-2.5 rounded-full font-bold text-xs text-gray-950 bg-[#ECBD56] hover:bg-[#DEA93F] transition shadow-md shadow-[#ECBD56]/20">
                Salvar Empresa
              </button>
            ` : ''}
          </div>
        </form>
      </div>
    </div>
  `;
}

// ---------------- ATTACH EVENT HANDLERS ----------------
function attachEventHandlers() {
  // Troca de Abas
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.activeTab = btn.getAttribute('data-tab');
      render();
    });
  });

  // Busca Global
  const searchInput = document.getElementById('global-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.globalSearch = e.target.value;
      render();
      const updatedInput = document.getElementById('global-search-input');
      if (updatedInput) {
        updatedInput.focus();
        updatedInput.setSelectionRange(updatedInput.value.length, updatedInput.value.length);
      }
    });
  }

  const clearBtn = document.getElementById('clear-search-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      state.globalSearch = '';
      render();
    });
  }

  // Notificações
  const notifBtn = document.getElementById('toggle-notif-btn');
  if (notifBtn) {
    notifBtn.addEventListener('click', () => {
      state.isNotificationOpen = !state.isNotificationOpen;
      render();
    });
  }

  // Alternar Tema
  const themeBtn = document.getElementById('toggle-theme-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('control_theme', state.theme);
      render();
    });
  }

  // Logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      state.user = null;
      localStorage.removeItem('control_auth_user');
      render();
    });
  }

  // Upload Logo
  const logoInput = document.getElementById('logo-input');
  if (logoInput) {
    logoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          state.customLogo = ev.target.result;
          localStorage.setItem('control_custom_logo', ev.target.result);
          render();
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // -------------------------------------------------------------------
  // IMPORTAÇÃO DE PLANILHA EXCEL (MAPEAMENTO ESTRITO DAS 8 COLUNAS)
  // Coluna 1: Código
  // Coluna 2: Grupo
  // Coluna 3: Empresa
  // Coluna 4: CNPJ
  // Coluna 5: Classe
  // Coluna 6: Regime Tributário
  // Coluna 7: Responsável
  // Coluna 8: Segmento
  // -------------------------------------------------------------------
  const fileInput = document.getElementById('spreadsheet-file-input');
  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = new Uint8Array(ev.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheet];

          // Lê matriz de linhas (header: 1) para mapear fielmente as 8 colunas por índice ou por cabeçalho
          const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });
          if (!rows || rows.length <= 1) {
            alert("A planilha selecionada está vazia ou sem dados válidos.");
            return;
          }

          // Descobrir se a primeira linha é cabeçalho
          const header = rows[0].map(h => (h ? h.toString().trim().toLowerCase() : ""));
          const hasNamedHeader = header.some(h => h.includes('empresa') || h.includes('cnpj') || h.includes('código') || h.includes('codigo'));
          const dataRows = hasNamedHeader ? rows.slice(1) : rows;

          const imported = [];
          dataRows.forEach((row, idx) => {
            if (!row || row.length === 0 || (!row[0] && !row[2] && !row[3])) return;

            // Mapeamento Estrito das 8 Colunas
            const codigo = row[0] ? row[0].toString().trim() : (idx + 1).toString();
            const grupo = row[1] ? row[1].toString().trim() : "GERAL";
            const empresa = row[2] ? row[2].toString().trim() : `Empresa ${codigo}`;
            const cnpj = row[3] ? row[3].toString().trim() : "00.000.000/0001-00";
            const classe = row[4] ? row[4].toString().trim().toUpperCase() : "A";
            const regime = row[5] ? row[5].toString().trim() : "Lucro Real Mensal";
            const responsavel = row[6] ? row[6].toString().trim() : "Brayann";
            const segmento = row[7] ? row[7].toString().trim() : "Serviços";

            imported.push({
              id: Date.now() + idx,
              codigo,
              grupo,
              nome: empresa,
              cnpj,
              classe,
              regime,
              colaborador: responsavel,
              segmento,
              fechamento: "2026-08"
            });
          });

          if (imported.length > 0) {
            state.companies = imported;
            saveStorage();
            render();
            alert(`Sucesso! ${imported.length} empresas importadas respeitando estritamente a ordem das 8 colunas:\n1. Código\n2. Grupo\n3. Empresa\n4. CNPJ\n5. Classe\n6. Regime Tributário\n7. Responsável\n8. Segmento`);
          } else {
            alert("Nenhuma empresa válida encontrada na planilha.");
          }
        } catch (err) {
          alert('Erro ao processar a planilha. Verifique o arquivo Excel.');
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }

  // Exportar XLSX
  const exportBtn = document.getElementById('export-data-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      // Exporta no formato padronizado das 8 colunas
      const exportRows = state.companies.map(c => ({
        "Código": c.codigo || c.id,
        "Grupo": c.grupo || "GERAL",
        "Empresa": c.nome,
        "CNPJ": c.cnpj,
        "Classe": c.classe,
        "Regime Tributário": c.regime,
        "Responsável": c.colaborador,
        "Segmento": c.segmento
      }));

      const ws = XLSX.utils.json_to_sheet(exportRows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Empresas");
      XLSX.writeFile(wb, "Control_Contabilidade_Empresas_Padrao.xlsx");
    });
  }

  // Form de Tarefa
  const taskForm = document.getElementById('new-task-form');
  if (taskForm) {
    taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('task-title-input').value.trim();
      const desc = document.getElementById('task-desc-input').value.trim();
      const date = document.getElementById('task-date-input').value;
      const urg = document.getElementById('task-urgency-input').value;
      if (!title) return;
      state.tasks.unshift({ id: Date.now(), titulo: title, descricao: desc, data: date, urgencia: urg, concluida: false });
      saveStorage();
      render();
    });
  }

  // Form de Modal de Empresa (com as 8 colunas)
  const compForm = document.getElementById('company-modal-form');
  if (compForm) {
    compForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const codigo = document.getElementById('modal-codigo').value.trim();
      const grupo = document.getElementById('modal-grupo').value.trim();
      const nome = document.getElementById('modal-nome').value.trim();
      const cnpj = document.getElementById('modal-cnpj').value.trim();
      const classe = document.getElementById('modal-classe').value;
      const regime = document.getElementById('modal-regime').value;
      const colaborador = document.getElementById('modal-colaborador').value.trim();
      const segmento = document.getElementById('modal-segmento').value.trim();
      const fechamento = document.getElementById('modal-fechamento').value;

      if (state.modal.mode === 'create') {
        state.companies.unshift({
          id: Date.now(),
          codigo: codigo || (state.companies.length + 1).toString(),
          grupo: grupo || 'GERAL',
          nome,
          cnpj,
          classe,
          regime,
          colaborador,
          segmento,
          fechamento
        });
      } else if (state.modal.mode === 'edit' && state.modal.company) {
        const idx = state.companies.findIndex(x => x.id === state.modal.company.id);
        if (idx !== -1) {
          state.companies[idx] = {
            ...state.companies[idx],
            codigo,
            grupo,
            nome,
            cnpj,
            classe,
            regime,
            colaborador,
            segmento,
            fechamento
          };
        }
      }
      saveStorage();
      closeCompanyModal();
    });
  }
}

// ---------------- FUNÇÕES GLOBAIS EXPOSTAS ----------------
window.setAuthMode = (mode) => { state.authMode = mode; render(); };
window.switchTab = (tab) => { state.activeTab = tab; render(); };
window.setFechamentoFilter = (f) => { state.fechamentoFilter = f; render(); };
window.updateCompanyFechamento = (id, val) => {
  const c = state.companies.find(x => x.id === id);
  if (c) { c.fechamento = val; saveStorage(); render(); }
};
window.setPisComp = (comp) => { state.selPisComp = comp; render(); };
window.updatePisStatus = (id, st) => {
  const darf = st === 'Concluída';
  state.pisCofinsData[`${id}_${state.selPisComp}`] = { status: st, darfEnviado: darf };
  saveStorage(); render();
};
window.togglePisDarf = (id, checked) => {
  state.pisCofinsData[`${id}_${state.selPisComp}`] = { status: checked ? 'Concluída' : 'Pendente', darfEnviado: checked };
  saveStorage(); render();
};
window.resetPisMonth = () => {
  if (confirm(`Resetar todas as empresas para Pendente em ${state.selPisComp}?`)) {
    state.companies.forEach(c => { state.pisCofinsData[`${c.id}_${state.selPisComp}`] = { status: 'Pendente', darfEnviado: false }; });
    saveStorage(); render();
  }
};
window.setTrim = (t) => { state.selTrim = t; render(); };
window.toggleTrimPrejuizo = (id, checked) => {
  const k = `${id}_${state.selTrim}`;
  state.irpjTrimData[k] = { ...(state.irpjTrimData[k] || {}), prejuizo: checked };
  saveStorage(); render();
};
window.setTrimQuotaMode = (id, isUnica) => {
  const k = `${id}_${state.selTrim}`;
  state.irpjTrimData[k] = { ...(state.irpjTrimData[k] || {}), quotaUnica: isUnica };
  saveStorage(); render();
};
window.toggleTrimDarfUnica = (id, checked) => {
  const k = `${id}_${state.selTrim}`;
  state.irpjTrimData[k] = { ...(state.irpjTrimData[k] || {}), darfUnica: checked };
  saveStorage(); render();
};
window.toggleTrimParcela = (id, pNum, checked) => {
  const k = `${id}_${state.selTrim}`;
  state.irpjTrimData[k] = { ...(state.irpjTrimData[k] || {}), [`p${pNum}`]: checked };
  saveStorage(); render();
};
window.setIrpjMes = (m) => { state.selIrpjMes = m; render(); };
window.toggleMensalPrejuizo = (id, checked) => {
  const k = `${id}_${state.selIrpjMes}`;
  state.irpjMensalData[k] = { ...(state.irpjMensalData[k] || {}), prejuizo: checked, status: checked ? 'Concluída' : 'Pendente' };
  saveStorage(); render();
};
window.updateMensalStatus = (id, st) => {
  const k = `${id}_${state.selIrpjMes}`;
  state.irpjMensalData[k] = { ...(state.irpjMensalData[k] || {}), status: st };
  saveStorage(); render();
};
window.setTaskFilter = (f) => { state.taskFilter = f; render(); };
window.toggleTaskComplete = (id) => {
  const t = state.tasks.find(x => x.id === id);
  if (t) { t.concluida = !t.concluida; saveStorage(); render(); }
};
window.deleteTask = (id) => {
  if (confirm('Deseja excluir esta tarefa?')) {
    state.tasks = state.tasks.filter(x => x.id !== id);
    saveStorage(); render();
  }
};

// Funções de CRUD e Filtros de Empresa
window.openCompanyModal = (mode, id) => {
  const comp = id ? state.companies.find(x => x.id === id) : null;
  state.modal = { isOpen: true, mode, company: comp };
  render();
};
window.closeCompanyModal = () => {
  state.modal = { isOpen: false, mode: 'create', company: null };
  render();
};
window.deleteCompany = (id) => {
  if (confirm('Confirma a exclusão desta empresa?')) {
    state.companies = state.companies.filter(x => x.id !== id);
    saveStorage(); render();
  }
};
window.setCrudFilter = (key, val) => {
  state.crudFilters[key] = val;
  render();
};
window.clearCrudFilters = () => {
  state.crudFilters = {
    responsavel: 'todos',
    regime: 'todos',
    classe: 'todos',
    grupo: 'todos',
    segmento: 'todos'
  };
  render();
};

// Inicialização imediata
document.addEventListener('DOMContentLoaded', render);
render();
