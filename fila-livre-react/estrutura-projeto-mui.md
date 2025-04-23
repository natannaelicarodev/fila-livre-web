# Estrutura do Projeto React com Material UI (MUI)

Aqui está a estrutura detalhada do projeto React para o sistema de gerenciamento de filas com Material UI e design mobile first.

## Estrutura de Arquivos

```
fila-livre/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── assets/
│   │   └── images/
│   │       ├── logo.svg
│   │       └── background.jpg
│   ├── components/
│   │   ├── common/
│   │   │   ├── CustomButton.jsx
│   │   │   ├── CustomCard.jsx
│   │   │   ├── CustomTextField.jsx
│   │   │   └── Loader.jsx
│   │   ├── dashboard/
│   │   │   ├── ChartCard.jsx
│   │   │   ├── QueueItem.jsx
│   │   │   └── StatCard.jsx
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── MobileMenu.jsx
│   │   │   └── Sidebar.jsx
│   │   └── queue/
│   │       ├── AddCustomerForm.jsx
│   │       ├── QueueList.jsx
│   │       └── QueueStats.jsx
│   ├── contexts/
│   │   └── FirebaseContext.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── Queue.jsx
│   │   ├── QRCode.jsx
│   │   ├── Settings.jsx
│   │   └── Statistics.jsx
│   ├── services/
│   │   └── firebase.js
│   ├── theme/
│   │   └── index.js
│   ├── App.jsx
│   ├── index.jsx
│   └── routes.jsx
└── package.json
```

## Descrição dos Componentes com Material UI

### Componentes Comuns
- **CustomButton.jsx**: Botão personalizado baseado no MUI Button com diferentes variantes
- **CustomCard.jsx**: Componente de cartão baseado no MUI Card para exibir informações
- **CustomTextField.jsx**: Campo de entrada personalizado baseado no MUI TextField com validação
- **Loader.jsx**: Indicador de carregamento usando MUI CircularProgress

### Componentes do Dashboard
- **ChartCard.jsx**: Cartão MUI para exibir gráficos de estatísticas
- **QueueItem.jsx**: Item individual da fila usando MUI ListItem
- **StatCard.jsx**: Cartão MUI para exibir estatísticas numéricas

### Componentes de Layout
- **Header.jsx**: Cabeçalho da aplicação com AppBar do MUI
- **Layout.jsx**: Layout principal usando MUI Box e Container
- **MobileMenu.jsx**: Menu móvel usando MUI Drawer e List
- **Sidebar.jsx**: Barra lateral usando MUI Drawer permanente

### Componentes da Fila
- **AddCustomerForm.jsx**: Formulário MUI para adicionar novos clientes à fila
- **QueueList.jsx**: Lista de clientes usando MUI List
- **QueueStats.jsx**: Estatísticas resumidas usando MUI Paper e Typography

### Páginas
- **Dashboard.jsx**: Página principal com Grid do MUI
- **Login.jsx**: Página de login com Card e TextField do MUI
- **Queue.jsx**: Gerenciamento da fila com componentes MUI
- **QRCode.jsx**: Geração de QR Code com Paper do MUI
- **Settings.jsx**: Configurações com FormControl do MUI
- **Statistics.jsx**: Estatísticas com componentes Chart e MUI

### Tema e Estilo
- **theme/index.js**: Configuração do tema MUI personalizado

## Configuração do Material UI

Para configurar o Material UI no projeto, você precisará instalar as seguintes dependências:

```bash
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
```

## Tema Personalizado

O tema personalizado do Material UI será configurado para seguir a paleta de cores do sistema:

```javascript
// src/theme/index.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3B82F6', // azul
      light: '#60A5FA',
      dark: '#2563EB',
    },
    secondary: {
      main: '#8B5CF6', // roxo
      light: '#A78BFA',
      dark: '#7C3AED',
    },
    success: {
      main: '#10B981', // verde
      light: '#34D399',
      dark: '#059669',
    },
    warning: {
      main: '#F59E0B', // amarelo
      light: '#FBBF24',
      dark: '#D97706',
    },
    error: {
      main: '#EF4444', // vermelho
      light: '#F87171',
      dark: '#DC2626',
    },
    text: {
      primary: '#1F2937',
      secondary: '#6B7280',
    },
    background: {
      default: '#F9FAFB',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
          borderRadius: 12,
        },
      },
    },
  },
});

export default theme;
```

## Design Mobile First com MUI

O Material UI já é otimizado para abordagem mobile first, mas vamos garantir que nosso sistema siga as melhores práticas:

1. Uso consistente do sistema de Grid do MUI para layouts responsivos
2. Breakpoints apropriados para diferentes tamanhos de tela
3. Drawer responsivo (temporário em dispositivos móveis, permanente em desktop)
4. Tipografia responsiva com o sistema de tipografia do MUI
5. Densidade de interface adaptativa para diferentes dispositivos

Esta estrutura e design com Material UI garantirão um sistema moderno, responsivo e fácil de usar em qualquer dispositivo, com foco especial na experiência móvel.
