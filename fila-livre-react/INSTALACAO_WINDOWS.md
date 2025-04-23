# Guia de Instalação do Fila Livre para Windows

Este guia fornece instruções passo a passo para instalar e executar o sistema de gerenciamento de filas Fila Livre em um ambiente Windows.

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

1. **Node.js e npm**
   - Acesse [nodejs.org](https://nodejs.org/)
   - Baixe e instale a versão LTS (recomendada para a maioria dos usuários)
   - Verifique a instalação abrindo o Prompt de Comando e digitando:
     ```
     node -v
     npm -v
     ```

2. **Git (opcional)**
   - Baixe e instale o [Git para Windows](https://git-scm.com/download/win)
   - Útil para clonar o repositório, mas você também pode baixar o código como arquivo ZIP

3. **Editor de código**
   - Recomendamos o [Visual Studio Code](https://code.visualstudio.com/)
   - Extensões úteis: ES7+ React/Redux/React-Native snippets, Prettier, ESLint

## Instalação

### Opção 1: Usando Git

1. Abra o Prompt de Comando ou PowerShell como administrador

2. Navegue até a pasta onde deseja criar o projeto:
   ```
   cd C:\Caminho\Para\Seus\Projetos
   ```

3. Clone o repositório (se você tiver o Git instalado):
   ```
   git clone https://github.com/seu-usuario/fila-livre.git
   ```

4. Navegue até a pasta do projeto:
   ```
   cd fila-livre
   ```

### Opção 2: Usando arquivo ZIP

1. Baixe o código como arquivo ZIP

2. Extraia o conteúdo para uma pasta de sua escolha (ex: C:\Projetos\fila-livre)

3. Abra o Prompt de Comando ou PowerShell como administrador

4. Navegue até a pasta onde você extraiu o código:
   ```
   cd C:\Projetos\fila-livre
   ```

## Configuração

1. Instale as dependências do projeto:
   ```
   npm install
   ```

2. Configure o Firebase:
   - Acesse [console.firebase.google.com](https://console.firebase.google.com/)
   - Crie um novo projeto (ou use um existente)
   - Adicione um aplicativo web ao seu projeto Firebase
   - Copie as credenciais de configuração fornecidas
   - Abra o arquivo `src/services/firebase.js` e substitua o objeto `firebaseConfig` com suas credenciais:
     ```javascript
     const firebaseConfig = {
       apiKey: "SUA_API_KEY",
       authDomain: "seu-projeto.firebaseapp.com",
       projectId: "seu-projeto",
       storageBucket: "seu-projeto.appspot.com",
       messagingSenderId: "seu-messaging-sender-id",
       appId: "seu-app-id"
     };
     ```

3. Habilite os serviços necessários no Firebase:
   - Authentication (Email/Password e Google)
   - Firestore Database
   - Crie as regras de segurança para o Firestore

## Execução

1. Inicie o servidor de desenvolvimento:
   ```
   npm start
   ```

2. O navegador deve abrir automaticamente com o aplicativo em execução em `http://localhost:3000`

3. Para fazer login, você pode:
   - Criar uma nova conta usando o formulário de cadastro
   - Usar a autenticação do Google
   - Usar as credenciais de teste (se configuradas):
     - Email: teste@exemplo.com
     - Senha: senha123

## Construção para Produção

Quando estiver pronto para implantar o aplicativo em produção:

1. Crie uma versão otimizada para produção:
   ```
   npm run build
   ```

2. A pasta `build` conterá os arquivos otimizados prontos para implantação

3. Você pode hospedar esses arquivos em qualquer serviço de hospedagem estática, como:
   - Firebase Hosting
   - Netlify
   - Vercel
   - GitHub Pages

## Solução de Problemas

Se encontrar problemas durante a instalação ou execução:

1. **Erro de dependências:**
   ```
   npm clean-install
   ```

2. **Erro de porta em uso:**
   - Altere a porta no arquivo `package.json`:
     ```json
     "scripts": {
       "start": "set PORT=3001 && react-scripts start",
       ...
     }
     ```

3. **Erro de conexão com Firebase:**
   - Verifique se as credenciais estão corretas
   - Confirme se os serviços necessários estão habilitados no console do Firebase
   - Verifique as regras de segurança do Firestore

4. **Problemas com Node.js:**
   - Certifique-se de usar uma versão compatível (recomendamos Node.js 16.x ou superior)
   - Se necessário, use o [nvm-windows](https://github.com/coreybutler/nvm-windows) para gerenciar múltiplas versões do Node.js

## Estrutura do Projeto

```
fila-livre/
├── public/               # Arquivos públicos
├── src/                  # Código-fonte
│   ├── assets/           # Recursos estáticos
│   ├── components/       # Componentes React
│   │   ├── common/       # Componentes comuns
│   │   ├── dashboard/    # Componentes do dashboard
│   │   ├── layout/       # Componentes de layout
│   │   └── queue/        # Componentes da fila
│   ├── contexts/         # Contextos React
│   ├── pages/            # Páginas da aplicação
│   ├── services/         # Serviços (Firebase, etc.)
│   ├── theme/            # Configuração do tema MUI
│   ├── App.jsx           # Componente principal
│   ├── index.jsx         # Ponto de entrada
│   └── index.css         # Estilos globais
└── package.json          # Dependências e scripts
```

## Personalização

Você pode personalizar o aplicativo editando:

1. **Tema e cores:**
   - Edite o arquivo `src/theme/index.js` para alterar cores, tipografia, etc.

2. **Configurações do estabelecimento:**
   - Use a página de Configurações no aplicativo para personalizar seu estabelecimento

3. **Logo e marca:**
   - Substitua os arquivos em `src/assets/images/`
   - Atualize as referências no código conforme necessário

## Suporte

Se precisar de ajuda adicional:

- Consulte a documentação do React: [reactjs.org](https://reactjs.org/)
- Consulte a documentação do Material UI: [mui.com](https://mui.com/)
- Consulte a documentação do Firebase: [firebase.google.com/docs](https://firebase.google.com/docs)
