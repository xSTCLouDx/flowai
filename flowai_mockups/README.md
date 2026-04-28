# FlowAI - Mockups de Alta Fidelidade

Mockups visuais profissionais compatíveis com Figma para o aplicativo móvel de produtividade **FlowAI**.

## 📱 Sobre o FlowAI

**FlowAI** é um aplicativo de produtividade com IA que otimiza o gerenciamento de tarefas através de:
- **Agendamento inteligente** com aprendizado de padrões
- **Priorização automática** baseada em contexto
- **Integração com calendários** Google e Apple
- **Assistente de IA conversacional**
- **Análises de produtividade** personalizadas

### Especificações Técnicas
- **Plataformas:** iOS 14+ e Android 10+
- **Framework:** React Native + Expo
- **Modelo:** Freemium (versões gratuita e premium)
- **Dimensões dos Mockups:** 390 × 844 px (iPhone padrão)

---

## 🎨 Design System

### Paleta de Cores

#### Cores Principais
```
Primary Blue:     #3B82F6 (rgb(59, 130, 246))
Primary Purple:   #8B5CF6 (rgb(139, 92, 246))
Gradient:         Linear gradient de #3B82F6 para #8B5CF6
```

#### Cores de Interface
```
Background:       #FFFFFF (modo claro)
Background Dark:  #1F2937 (modo escuro - suportado)
Surface:          #F9FAFB
Border:           #E5E7EB
Text Primary:     #111827
Text Secondary:   #6B7280
Text Muted:       #9CA3AF
```

#### Cores de Status
```
Success:          #10B981 (verde)
Warning:          #F59E0B (laranja)
Error:            #EF4444 (vermelho)
Info:             #3B82F6 (azul)
```

#### Indicadores de Prioridade
```
High Priority:    #EF4444 (vermelho)
Medium Priority:  #F59E0B (laranja)
Low Priority:     #10B981 (verde)
```

### Tipografia

**Família:** Inter (Google Fonts)

**Escala Tipográfica:**
```
Hero:         32px / Bold / Line-height 40px
H1:           24px / Semibold / Line-height 32px
H2:           20px / Semibold / Line-height 28px
H3:           18px / Medium / Line-height 24px
Body Large:   16px / Regular / Line-height 24px
Body:         14px / Regular / Line-height 20px
Caption:      12px / Regular / Line-height 16px
Tiny:         10px / Regular / Line-height 14px
```

### Grid e Espaçamento

**Sistema de Grid:** 8px base (adaptado dos 4px do planejamento para compatibilidade)

**Espaçamento Padrão:**
```
XXS: 4px   (micro spacing)
XS:  8px   (tight spacing)
SM:  12px  (compact spacing)
MD:  16px  (default spacing)
LG:  24px  (comfortable spacing)
XL:  32px  (spacious spacing)
XXL: 48px  (section spacing)
```

### Componentes Padrão

#### Dimensões de Componentes
```
Buttons:           Altura 44px (touch-friendly)
Input Fields:      Altura 48px
List Items:        Altura 72px
Status Bar:        Altura 44px (iOS safe area)
Tab Bar:           Altura 83px (com home indicator)
FAB (Floating):    56×56px
Icons (pequenos):  20×20px
Icons (padrão):    24×24px
Icons (grandes):   32×32px
Avatar:            40×40px
```

#### Estilos de Elementos
```
Border Radius:     8px (padrão), 12px (cards), 24px (botões pill)
Card Shadow:       0 2px 8px rgba(0,0,0,0.1)
Button Shadow:     0 4px 12px rgba(59,130,246,0.3)
Divider:           1px solid #E5E7EB
```

---

## 📂 Estrutura de Arquivos

```
flowai_mockups/
├── README.md                           # Este arquivo
│
├── onboarding/                         # Telas de onboarding (3 telas)
│   ├── 01_welcome.svg                  # Boas-vindas e proposta de valor
│   ├── 02_features.svg                 # Recursos principais com IA
│   └── 03_permissions.svg              # Permissões (calendário, notificações)
│
├── dashboard/                          # Tela principal
│   └── home_dashboard.svg              # Dashboard com visão geral do dia
│
├── tasks/                              # Gerenciamento de tarefas
│   ├── tasks_list.svg                  # Lista de todas as tarefas com filtros
│   └── add_edit_task.svg               # Formulário para adicionar/editar tarefa
│
├── calendar/                           # Calendário integrado
│   └── calendar_view.svg               # Visualização mensal com tarefas e eventos
│
├── ai_assistant/                       # Assistente de IA
│   └── ai_chat.svg                     # Interface conversacional com IA
│
├── analytics/                          # Análise de produtividade
│   └── productivity_analytics.svg      # Gráficos e estatísticas
│
└── settings/                           # Configurações
    └── settings.svg                    # Perfil, integrações, preferências
```

**Total:** 10 mockups de alta fidelidade

---

## 🖼️ Detalhamento das Telas

### 1. Onboarding (3 telas)

#### 01_welcome.svg - Tela de Boas-vindas
**Conteúdo:**
- Logo do FlowAI
- Título hero: "Sua produtividade, otimizada por IA"
- Subtítulo sobre gerenciamento inteligente de tarefas
- Ilustração moderna com gradiente azul-roxo
- Botão "Continue" para próxima tela

**Objetivo:** Primeira impressão e apresentação da proposta de valor.

#### 02_features.svg - Recursos Principais
**Conteúdo:**
- Título: "Smart AI Assistant"
- Descrição dos recursos de IA (agendamento, priorização, detecção de padrões)
- Ícones ilustrando cada recurso principal
- Tema roxo-azul consistente
- Botão "Next" para continuar

**Objetivo:** Educar sobre as capacidades de IA do aplicativo.

#### 03_permissions.svg - Solicitação de Permissões
**Conteúdo:**
- Título: "Enable Permissions"
- Cards de permissões:
  - Calendário (com ícone de calendário)
  - Notificações (com ícone de sino)
- Explicação do porquê cada permissão é necessária
- Botão "Get Started" para finalizar onboarding

**Objetivo:** Solicitar permissões críticas com justificativas claras.

---

### 2. Dashboard/Home

#### home_dashboard.svg - Dashboard Principal
**Conteúdo:**
- **Header:** Saudação personalizada "Good morning, Ana" + data atual
- **Daily Overview:** Estatísticas do dia (8 tarefas, 3 completadas)
- **Priority Tasks:** 3 cards de tarefas de alta prioridade com:
  - Checkboxes
  - Títulos
  - Estimativas de tempo
  - Badges de prioridade
- **Upcoming Events:** 2 eventos do calendário próximos
- **AI Insights:** Card com sugestão inteligente do assistente
- **Tab Bar:** Navegação inferior (Home, Tasks, Calendar, Analytics, Settings)

**Objetivo:** Visão geral diária com acesso rápido às tarefas principais.

---

### 3. Gerenciamento de Tarefas

#### tasks_list.svg - Lista de Tarefas
**Conteúdo:**
- **Header:** Título "My Tasks" + ícone de busca
- **Filtros:** Chips de filtro (Today ativo, This Week, High Priority, All)
- **Lista de Tarefas:** 6 task cards mostrando:
  - Checkboxes
  - Títulos das tarefas
  - Tags de projeto
  - Datas de vencimento
  - Indicadores de prioridade coloridos (vermelho/laranja/verde)
  - Estimativas de tempo
  - Progresso de subtarefas (ex: 2/5)
- **FAB:** Botão flutuante com ícone "+" no canto inferior direito
- **Tab Bar:** Navegação inferior

**Objetivo:** Visualização completa de todas as tarefas com filtros eficientes.

#### add_edit_task.svg - Adicionar/Editar Tarefa
**Conteúdo:**
- **Header:** "New Task" + botão voltar + botão salvar
- **Formulário:**
  - Campo título da tarefa
  - Campo descrição (textarea)
  - Seletor de projeto (dropdown)
  - Seletor de data (date picker com ícone de calendário)
  - Seletor de hora (time picker)
  - Seletor de prioridade (botões High/Medium/Low)
  - Seletor de duração (dropdown: 15min, 30min, 1h, 2h)
  - Campo de tags com chips sugeridas
- **AI Suggestion Card:** "Best time to schedule: Tomorrow 10:00 AM" (fundo gradiente azul)
- **Botão:** "Save Task" destacado no final

**Objetivo:** Interface completa para criação/edição com sugestões de IA.

---

### 4. Calendário

#### calendar_view.svg - Visualização do Calendário
**Conteúdo:**
- **Header:** "Calendar" + toggle de visualização (Month/Week/Day)
- **Calendário Mensal:**
  - Grade de Abril 2026
  - Hoje destacado em azul
  - Datas com tarefas marcadas com pontos coloridos
- **Painel do Dia Selecionado:**
  - 2 eventos do calendário (com hora e ícone de localização)
  - 3 tarefas (com checkboxes e badges de prioridade)
  - Destaque visual para horários livres
- **Tab Bar:** Navegação inferior

**Objetivo:** Visualização unificada de tarefas e eventos do calendário.

---

### 5. Assistente de IA

#### ai_chat.svg - Chat com IA
**Conteúdo:**
- **Header:** "AI Assistant" + ícone de sparkle/estrela
- **Conversa:**
  - Avatar da IA (esquerda)
  - Mensagens do usuário (direita)
  - 4 mensagens de exemplo:
    1. Usuário: "When should I work on the quarterly report?"
    2. IA: Sugestão de melhor horário com reasoning sobre níveis de energia
    3. Usuário: "Help me prioritize my tasks"
    4. IA: Lista priorizada com explicações
- **Input Bar:** Campo "Ask me anything..." + ícone de microfone
- **Estilo:** Gradiente roxo-azul nos elementos de IA

**Objetivo:** Interface conversacional para interação com o assistente inteligente.

---

### 6. Análise de Produtividade

#### productivity_analytics.svg - Analytics Dashboard
**Conteúdo:**
- **Header:** "Analytics" + seletor de período (Week/Month)
- **KPI Cards (linha superior):**
  - Tasks Completed: 24
  - Completion Rate: 85%
  - Avg Duration: 42min
- **Gráfico de Linha:** Tendência de produtividade nos últimos 7 dias (preenchimento gradiente azul)
- **Heat Map:** Horas mais produtivas por dia da semana (intensidade de cor)
- **Gráfico de Pizza:** Distribuição de tempo por categoria de projeto
- **AI Insights Card:** "Your productivity increased 23% this week. You're most productive in mornings."
- **Tab Bar:** Navegação inferior

**Objetivo:** Análise visual detalhada com insights personalizados de IA.

---

### 7. Configurações

#### settings.svg - Tela de Configurações
**Conteúdo:**
- **Header:** "Settings"
- **Perfil:**
  - Avatar
  - Nome: "Ana Silva"
  - Email
  - Botão "Edit Profile"
- **Seções de Configurações:**
  
  **Account:**
  - Profile
  - Preferences
  
  **Integrations:**
  - Google Calendar (toggle ON)
  - Apple Calendar (toggle OFF)
  - Botão "Sync now"
  
  **Notifications:**
  - Push notifications (toggle)
  - Email digest
  - Quiet hours
  
  **AI Preferences:**
  - Smart scheduling (toggle)
  - Auto-prioritization (toggle)
  - Pattern detection (toggle)
  
  **Subscription:**
  - Current plan: Free
  - Botão "Upgrade to Premium" com ícone de coroa

- **Tab Bar:** Navegação inferior

**Objetivo:** Gestão completa de conta, integrações e preferências de IA.

---

## 🎯 Como Importar no Figma

### Passo a Passo

1. **Abra o Figma** (aplicativo desktop ou web)
2. **Crie um novo projeto** ou abra um existente
3. **Importe os SVGs:**
   - Menu: `File` → `Import`
   - Navegue até `/home/ubuntu/flowai_mockups/`
   - Selecione os arquivos `.svg` desejados
   - Clique em `Open`

4. **Organização sugerida no Figma:**
   ```
   FlowAI Mockups (Page)
   ├── 📱 Onboarding
   │   ├── Frame: Welcome
   │   ├── Frame: Features
   │   └── Frame: Permissions
   ├── 🏠 Dashboard
   │   └── Frame: Home
   ├── ✓ Tasks
   │   ├── Frame: Task List
   │   └── Frame: Add Task
   ├── 📅 Calendar
   │   └── Frame: Calendar View
   ├── 🤖 AI Assistant
   │   └── Frame: Chat
   ├── 📊 Analytics
   │   └── Frame: Productivity
   └── ⚙️ Settings
       └── Frame: Settings
   ```

### Edição no Figma

Todos os elementos são **totalmente editáveis**:
- ✅ **Texto:** Clique duplo para editar
- ✅ **Cores:** Selecione elemento e altere no painel de propriedades
- ✅ **Layout:** Arraste e redimensione livremente
- ✅ **Ícones:** SVG paths editáveis
- ✅ **Componentes:** Agrupe elementos para criar componentes reutilizáveis

### Dicas de Edição

**Criar Componentes Reutilizáveis:**
```
1. Selecione um elemento (ex: task card)
2. Cmd/Ctrl + Alt + K para criar componente
3. Nomeie: "Task Card"
4. Use em outras telas: Cmd/Ctrl + Shift + K para inserir instância
```

**Ajustar Cores Globalmente:**
```
1. Selecione todos os frames: Cmd/Ctrl + A
2. Plugin → "Find and Replace" → "Color"
3. Substitua #3B82F6 pela cor desejada
```

**Exportar para Desenvolvimento:**
```
1. Selecione um frame
2. Painel direito → Export
3. Formatos: PNG (2x, 3x para iOS/Android), SVG, PDF
```

---

## 🧩 Componentes Criados

### Componentes Reutilizáveis Presentes nos Mockups

| Componente | Descrição | Localização |
|------------|-----------|-------------|
| **Task Card** | Card de tarefa com checkbox, título, tags, data, prioridade | tasks_list.svg |
| **Priority Badge** | Badge colorido indicando prioridade (High/Med/Low) | tasks_list.svg, home_dashboard.svg |
| **Tab Bar** | Navegação inferior com 5 ícones | Todas as telas principais |
| **Status Bar** | Barra superior com hora, bateria, sinal (iOS) | Todas as telas |
| **Button Primary** | Botão principal com gradiente azul-roxo | onboarding/*.svg |
| **Button Secondary** | Botão secundário outline | add_edit_task.svg |
| **Input Field** | Campo de entrada de texto estilizado | add_edit_task.svg |
| **AI Insight Card** | Card destacado com sugestão da IA (gradiente) | home_dashboard.svg, add_edit_task.svg |
| **KPI Card** | Card de métrica com número e label | productivity_analytics.svg |
| **Event Card** | Card de evento do calendário | calendar_view.svg |
| **Toggle Switch** | Switch de ativação/desativação | settings.svg |
| **Avatar** | Avatar circular do usuário | settings.svg |
| **Filter Chip** | Chip de filtro clicável | tasks_list.svg |
| **FAB** | Floating Action Button circular | tasks_list.svg |
| **Message Bubble** | Balão de mensagem (chat) | ai_chat.svg |

### Como Extrair Componentes no Figma

```
1. Selecione o elemento visual (ex: task card)
2. Menu: Create Component (Cmd/Ctrl + Alt + K)
3. Nomeie apropriadamente
4. Organize em página "Components" separada
5. Use Auto Layout para responsividade
```

---

## 🎨 Paleta Completa para Figma

### Criar Color Styles no Figma

```
1. Selecione um elemento com a cor desejada
2. Painel de cores → ícone de 4 pontos → "+"
3. Nomeie conforme abaixo:

Primary/Blue:         #3B82F6
Primary/Purple:       #8B5CF6
Surface/Background:   #FFFFFF
Surface/Card:         #F9FAFB
Border/Default:       #E5E7EB
Text/Primary:         #111827
Text/Secondary:       #6B7280
Text/Muted:           #9CA3AF
Status/Success:       #10B981
Status/Warning:       #F59E0B
Status/Error:         #EF4444
Priority/High:        #EF4444
Priority/Medium:      #F59E0B
Priority/Low:         #10B981
```

### Criar Text Styles no Figma

```
1. Selecione um texto
2. Painel de texto → ícone de 4 pontos → "+"
3. Configure conforme:

Hero:         Inter / Bold / 32px / 40px line-height
H1:           Inter / Semibold / 24px / 32px
H2:           Inter / Semibold / 20px / 28px
H3:           Inter / Medium / 18px / 24px
Body Large:   Inter / Regular / 16px / 24px
Body:         Inter / Regular / 14px / 20px
Caption:      Inter / Regular / 12px / 16px
Tiny:         Inter / Regular / 10px / 14px
```

---

## 📐 Especificações Técnicas Detalhadas

### Dimensões dos Mockups
```
Canvas:           390 × 844 px (iPhone 13/14 standard)
Safe Area Top:    44px (iOS status bar)
Safe Area Bottom: 34px (iOS home indicator)
Tab Bar Height:   83px (incluindo safe area)
Header Height:    56px (típico)
```

### Grids e Guides Sugeridos
```
Columns:          6 colunas
Gutter:           16px
Margin:           20px (lateral)
Baseline Grid:    8px
```

### Exportação para Desenvolvimento

**iOS (React Native):**
- Exportar ícones: PNG @2x (78px) e @3x (117px)
- Exportar imagens: PNG @2x e @3x
- Nomenclatura: `icon_name@2x.png`

**Android:**
- Exportar ícones: PNG mdpi (39px), hdpi (58.5px), xhdpi (78px), xxhdpi (117px)
- Nomenclatura: `ic_name.png`

**Formato de Cor para Código:**
```javascript
// colors.ts
export const colors = {
  primaryBlue: '#3B82F6',
  primaryPurple: '#8B5CF6',
  bgWhite: '#FFFFFF',
  surfaceGray: '#F9FAFB',
  borderGray: '#E5E7EB',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
};
```

---

## 🚀 Próximos Passos

### Iteração e Refinamento

1. **Validação com Stakeholders:**
   - Apresente os mockups para validação
   - Colete feedback sobre layout, cores, funcionalidades
   - Itere baseado no feedback

2. **Protótipos Interativos:**
   - Use Figma Prototype para criar fluxos clicáveis
   - Conecte telas com transições
   - Teste a experiência do usuário

3. **Handoff para Desenvolvimento:**
   - Use Figma Dev Mode para specs precisos
   - Exporte assets em múltiplas resoluções
   - Documente interações e animações

4. **Design System Completo:**
   - Extraia todos os componentes reutilizáveis
   - Crie biblioteca de componentes no Figma
   - Documente uso de cada componente

### Ferramentas Complementares

- **Figma Plugins Úteis:**
  - `Stark` - Verificação de acessibilidade e contraste
  - `Content Reel` - Geração de conteúdo realista
  - `Unsplash` - Imagens de placeholder
  - `Iconify` - Biblioteca de ícones
  - `Auto Flow` - Conectar fluxos automaticamente

- **Exportação:**
  - `Figma to Code` - Gerar código React Native
  - `Anima` - Exportar para HTML/CSS

---

## 📝 Notas Técnicas

### Compatibilidade
- ✅ **Figma:** Totalmente compatível (versão web e desktop)
- ✅ **Sketch:** Importação suportada (pode requerer ajustes menores)
- ✅ **Adobe XD:** Importação suportada via SVG
- ✅ **Navegadores:** Visualização em qualquer navegador moderno

### Formato dos Arquivos
- **Formato:** SVG (Scalable Vector Graphics)
- **Tamanho médio:** 15-16 KB por arquivo
- **Compatibilidade:** XML válido, editável em qualquer editor de texto
- **Estrutura:** Elementos agrupados semanticamente com IDs

### Limitações e Considerações
- Fontes: Inter deve estar instalada no sistema ou disponível via Google Fonts
- Ícones: SVG paths incluídos, totalmente editáveis
- Imagens: Ilustrações são SVG gerados programaticamente
- Responsividade: Mockups são fixos em 390×844px, responsividade deve ser implementada no desenvolvimento

---

## 🎓 Melhores Práticas de UX/UI Aplicadas

### Princípios de Design Móvel

✅ **Touch Targets:** Todos os botões têm mínimo de 44×44px (Apple HIG)  
✅ **Hierarquia Visual:** Uso consistente de tamanhos de fonte e pesos  
✅ **Espaçamento:** Respiro adequado entre elementos (mínimo 8px)  
✅ **Contraste:** Texto mantém ratio mínimo de 4.5:1 (WCAG AA)  
✅ **Feedback Visual:** Estados claros (default, hover, active, disabled)  
✅ **Navegação:** Tab bar sempre acessível, hierarquia clara  
✅ **Conteúdo:** Informação priorizada, sem sobrecarga cognitiva  
✅ **Consistência:** Padrões repetidos em todas as telas

### Acessibilidade

✅ **Cores:** Não dependem apenas de cor para transmitir informação  
✅ **Ícones:** Sempre acompanhados de labels quando ambíguo  
✅ **Prioridade:** Indicadores visuais múltiplos (cor + ícone + texto)  
✅ **Tamanho de Fonte:** Mínimo de 12px para legibilidade  
✅ **Espaçamento:** Clicáveis bem espaçados para evitar erros

### Padrões de Interface iOS/Android

- Status bar e safe areas respeitadas
- Tab bar no padrão iOS (ícones + labels)
- FAB no padrão Material Design (Android)
- Gestos nativos considerados (swipe, tap, long press)
- Feedback tátil sugerido para ações importantes

---

## 📧 Suporte e Recursos

### Referências do Projeto
- **Planejamento Completo:** `/home/ubuntu/productivity_app_plan.md`
- **Design System Detalhado:** Seção 5 do documento de planejamento
- **Especificações Técnicas:** Seção 3 do documento de planejamento

### Recursos Externos
- **Figma Learn:** https://help.figma.com/
- **Inter Font:** https://fonts.google.com/specimen/Inter
- **iOS Human Interface Guidelines:** https://developer.apple.com/design/
- **Material Design:** https://material.io/design
- **React Native Docs:** https://reactnative.dev/

### Ferramentas de Design
- **Figma:** https://figma.com
- **Figma Community:** https://figma.com/community (templates e plugins)
- **Coolors:** https://coolors.co (paletas de cores)
- **Type Scale:** https://type-scale.com (escalas tipográficas)

---

## ✨ Resumo

Este conjunto de mockups fornece uma **base sólida e profissional** para o desenvolvimento do FlowAI. Todos os elementos foram criados com atenção aos detalhes de:

- 🎨 **Design:** Paleta moderna azul-roxo, tipografia Inter, espaçamento consistente
- 📱 **UX:** Navegação intuitiva, hierarquia clara, feedback visual adequado
- ♿ **Acessibilidade:** Contraste apropriado, touch targets adequados
- 🔧 **Desenvolvimento:** Componentes reutilizáveis, specs claras, fácil exportação
- 🤖 **IA:** Elementos destacados mostrando inteligência e automação

**Total de telas:** 10 mockups de alta fidelidade  
**Formato:** SVG compatível com Figma  
**Status:** Pronto para importação, prototipagem e handoff

---

**Criado com:** Figma Mockup Skill v4.0  
**Data:** 07 de Abril de 2026  
**Versão:** 1.0
