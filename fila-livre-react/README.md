# Fila Livre - Sistema de Gerenciamento de Filas

Este é um guia passo a passo para criar o projeto Fila Livre (sistema de gerenciamento de filas) com React.js no Windows, com design mobile first.

## Configuração do Ambiente no Windows

### Pré-requisitos

1. **Node.js e npm**
   - Acesse [nodejs.org](https://nodejs.org/)
   - Baixe e instale a versão LTS (recomendada para a maioria dos usuários)
   - Verifique a instalação abrindo o Prompt de Comando e digitando:
     ```
     node -v
     npm -v
     ```

2. **Visual Studio Code (ou seu editor preferido)**
   - Baixe e instale o [Visual Studio Code](https://code.visualstudio.com/)
   - Extensões recomendadas:
     - ES7+ React/Redux/React-Native snippets
     - Prettier - Code formatter
     - ESLint

3. **Git (opcional, mas recomendado)**
   - Baixe e instale o [Git para Windows](https://git-scm.com/download/win)

## Criando o Projeto React

1. Abra o Prompt de Comando ou PowerShell como administrador

2. Navegue até a pasta onde deseja criar o projeto:
   ```
   cd C:\Caminho\Para\Seus\Projetos
   ```

3. Crie um novo projeto React:
   ```
   npx create-react-app fila-livre
   ```

4. Navegue até a pasta do projeto:
   ```
   cd fila-livre
   ```

5. Instale as dependências necessárias:
   ```
   npm install react-router-dom firebase @mui/material @mui/icons-material @emotion/react @emotion/styled chart.js react-chartjs-2 react-hot-toast
   ```

6. Inicie o servidor de desenvolvimento:
   ```
   npm start
   ```

O navegador deve abrir automaticamente com o projeto em execução em `http://localhost:3000`.

## Estrutura de Pastas

Após criar o projeto, organize-o com a seguinte estrutura de pastas:

```
fila-livre/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── ...
├── src/
│   ├── assets/
│   │   └── images/
│   ├── components/
│   │   ├── common/
│   │   ├── dashboard/
│   │   ├── layout/
│   │   └── queue/
│   ├── contexts/
│   │   └── FirebaseContext.js
│   ├── pages/
│   │   ├── Dashboard.js
│   │   ├── Login.js
│   │   ├── Queue.js
│   │   ├── QRCode.js
│   │   ├── Settings.js
│   │   └── Statistics.js
│   ├── services/
│   │   └── firebase.js
│   ├── styles/
│   │   ├── global.css
│   │   └── theme.js
│   ├── App.js
│   ├── index.js
│   └── routes.js
└── package.json
```

Siga as instruções detalhadas nos arquivos de código para implementar cada componente e funcionalidade.

## Próximos Passos

Após configurar o ambiente e criar a estrutura do projeto, siga para a implementação dos componentes e páginas conforme os arquivos de código fornecidos.
