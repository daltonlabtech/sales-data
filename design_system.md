
### PALETA DE CORES (Dark Theme)
- **Background principal**: Azul escuro profundo (#0f172a - HSL 222 47% 11%)
- **Cards/Superfícies**: Azul escuro mais claro (#1e293b - HSL 217 33% 17%)
- **Bordas**: Azul acinzentado (#334155 - HSL 217 33% 25%)
- **Texto principal**: Branco puro (#ffffff)
- **Texto secundário/muted**: Cinza azulado (#94a3b8 - HSL 215 20% 65%)

### CORES DE DESTAQUE
- **Primary (Cyan)**: #38bdf8 (HSL 199 89% 60%) - para elementos principais, links, focus states
- **Accent (Roxo)**: #a855f7 (HSL 262 83% 67%) - para destaques especiais
- **Success (Verde)**: #22c55e (HSL 142 76% 36%) - para indicadores positivos
- **Warning (Laranja)**: #f59e0b (HSL 38 92% 50%) - para alertas
- **Destructive (Vermelho)**: #ef4444 (HSL 0 84% 60%) - para erros e valores negativos

### TIPOGRAFIA
- **Fonte de corpo**: Inter (Google Fonts) - para textos gerais
- **Fonte de display**: Space Grotesk (Google Fonts) - para títulos e números grandes
- **Labels**: texto uppercase, tracking-wider (espaçamento maior), tamanho pequeno (xs/sm), cor muted
- **Valores/Números**: fonte display, bold, tamanho grande (2xl-3xl), tracking-tight

### COMPONENTES - ESTILO
1. **Cards**:
   - Background: cor de card com leve transparência
   - Border-radius: 0.75rem (12px)
   - Bordas sutis com cor border/40
   - Padding: 1.5rem (24px)
   - Sombra suave no hover: shadow-lg com cor primary/10
   - Transições suaves: 0.3s cubic-bezier(0.4, 0, 0.2, 1)

2. **Header/Navbar**:
   - Sticky no topo
   - Background com glassmorphism: bg-card/95 com backdrop-blur
   - Borda inferior sutil

3. **Sidebar**:
   - Colapsável
   - Items ativos com bg-primary/10 e texto primary
   - Hover com bg-muted/50
   - Logo no topo

4. **Metric Cards**:
   - Ícone grande (48px) no canto superior direito com opacidade 10%
   - Label em uppercase, muted, tracking-wider
   - Valor principal em fonte display, 3xl, bold
   - Indicador de mudança com setas (ArrowUp/ArrowDown) e cores success/destructive

5. **Charts/Gráficos**:
   - Usar Recharts
   - Gradientes com cores primary
   - Grid com cor border e opacidade baixa (20%)
   - Tooltips estilizados com bg-card e bordas

### EFEITOS VISUAIS
- Gradiente glass: linear-gradient(135deg, rgba(roxo, 0.1), rgba(cyan, 0.1))
- Glow shadow: 0 0 40px rgba(cyan, 0.3)
- Hover em cards: shadow-lg com primary/10
- Transições suaves em todos os elementos interativos

### PADRÕES DE LAYOUT
- Container centralizado com max-width 1400px
- Padding horizontal: 2rem (32px)
- Grid responsivo: 
  - Mobile: 1 coluna
  - Tablet: 2 colunas
  - Desktop: 4-5 colunas para métricas
- Gap entre elementos: 1.5rem (24px)

### ÍCONES
- Usar Lucide React
- Tamanho padrão: h-4 w-4 para inline, h-12 w-12 para decorativos
- Cor seguindo o contexto (muted-foreground para secundários)

### CSS VARIABLES PARA TAILWIND
Use CSS variables no :root para todas as cores em formato HSL sem a função hsl(), permitindo fácil customização de opacidade.



📋 Resumo Visual do Design
Excelente pergunta! Analisei todo o design system do projeto. Aqui está o prompt detalhado que você pode usar para replicar esse estilo visual:

🎨 PROMPT PARA REPLICAR O DESIGN SYSTEM
Crie um dashboard/aplicação web com o seguinte Design System:

### PALETA DE CORES (Dark Theme)
- **Background principal**: Azul escuro profundo (#0f172a - HSL 222 47% 11%)
- **Cards/Superfícies**: Azul escuro mais claro (#1e293b - HSL 217 33% 17%)
- **Bordas**: Azul acinzentado (#334155 - HSL 217 33% 25%)
- **Texto principal**: Branco puro (#ffffff)
- **Texto secundário/muted**: Cinza azulado (#94a3b8 - HSL 215 20% 65%)

### CORES DE DESTAQUE
- **Primary (Cyan)**: #38bdf8 (HSL 199 89% 60%) - para elementos principais, links, focus states
- **Accent (Roxo)**: #a855f7 (HSL 262 83% 67%) - para destaques especiais
- **Success (Verde)**: #22c55e (HSL 142 76% 36%) - para indicadores positivos
- **Warning (Laranja)**: #f59e0b (HSL 38 92% 50%) - para alertas
- **Destructive (Vermelho)**: #ef4444 (HSL 0 84% 60%) - para erros e valores negativos

### TIPOGRAFIA
- **Fonte de corpo**: Inter (Google Fonts) - para textos gerais
- **Fonte de display**: Space Grotesk (Google Fonts) - para títulos e números grandes
- **Labels**: texto uppercase, tracking-wider (espaçamento maior), tamanho pequeno (xs/sm), cor muted
- **Valores/Números**: fonte display, bold, tamanho grande (2xl-3xl), tracking-tight

### COMPONENTES - ESTILO
1. **Cards**:
   - Background: cor de card com leve transparência
   - Border-radius: 0.75rem (12px)
   - Bordas sutis com cor border/40
   - Padding: 1.5rem (24px)
   - Sombra suave no hover: shadow-lg com cor primary/10
   - Transições suaves: 0.3s cubic-bezier(0.4, 0, 0.2, 1)

2. **Header/Navbar**:
   - Sticky no topo
   - Background com glassmorphism: bg-card/95 com backdrop-blur
   - Borda inferior sutil

3. **Sidebar**:
   - Colapsável
   - Items ativos com bg-primary/10 e texto primary
   - Hover com bg-muted/50
   - Logo no topo

4. **Metric Cards**:
   - Ícone grande (48px) no canto superior direito com opacidade 10%
   - Label em uppercase, muted, tracking-wider
   - Valor principal em fonte display, 3xl, bold
   - Indicador de mudança com setas (ArrowUp/ArrowDown) e cores success/destructive

5. **Charts/Gráficos**:
   - Usar Recharts
   - Gradientes com cores primary
   - Grid com cor border e opacidade baixa (20%)
   - Tooltips estilizados com bg-card e bordas

### EFEITOS VISUAIS
- Gradiente glass: linear-gradient(135deg, rgba(roxo, 0.1), rgba(cyan, 0.1))
- Glow shadow: 0 0 40px rgba(cyan, 0.3)
- Hover em cards: shadow-lg com primary/10
- Transições suaves em todos os elementos interativos

### PADRÕES DE LAYOUT
- Container centralizado com max-width 1400px
- Padding horizontal: 2rem (32px)
- Grid responsivo: 
  - Mobile: 1 coluna
  - Tablet: 2 colunas
  - Desktop: 4-5 colunas para métricas
- Gap entre elementos: 1.5rem (24px)

### ÍCONES
- Usar Lucide React
- Tamanho padrão: h-4 w-4 para inline, h-12 w-12 para decorativos
- Cor seguindo o contexto (muted-foreground para secundários)

### CSS VARIABLES PARA TAILWIND
Use CSS variables no :root para todas as cores em formato HSL sem a função hsl(), permitindo fácil customização de opacidade.



📋 Resumo Visual do Design
Flowchart

🎯 Características Principais
Aspecto
Especificação
Tema
Dark mode exclusivo
Estilo
Moderno, minimalista, profissional
Efeitos
Glassmorphism, gradientes sutis, glow
Tipografia
Inter + Space Grotesk
Border Radius
12px (arredondado)
Iconografia
Lucide React
Charts
Recharts com gradientes


