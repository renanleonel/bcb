# BCB

## ✨ Funcionalidades Implementadas

### Autenticação e Identificação

- Login com validação de CPF/CNPJ
- Persistência de sessão via localStorage
- Logout com remoção de dados locais

### Interface de Chat

- Lista de conversas recentes com filtro
- Sistema de busca de mensagens
- Histórico de mensagens em formato de bolhas
- Envio de mensagens normais e urgentes
- Simulação de interação em tempo real
- Sistema de notificações para mensagens não lidas

### Gestão Financeira

- Visualização de histórico de gastos
- Registro de custos por mensagem enviada
- Exibição de saldo disponível

## 🔧 Premissas Técnicas

### Implementado

- Sistema de autenticação simplificada
- Mocks para simulação de API e respostas
- Interface responsiva para desktop e mobile
- Sistema de notificações para mensagens não lidas

### Limitações Conhecidas

- Sem proteção contra spam de mensagens
- Ausência de skeletons para loading states
- Informações limitadas de perfil de usuário
- Respostas simuladas com números aleatórios (0-10)

## 🛠️ Tecnologias Utilizadas

- **React** - Framework principal
- **TypeScript** - Linguagem de programação
- **Tailwind CSS** - Estilização
- **Shadcn UI** - Componentes de interface
- **React Router** - Navegação

## 🚀 Como Executar o Projeto

1. **Clone o repositório**

   ```bash
   git clone [URL_DO_REPOSITORIO]
   cd [NOME_DO_DIRETORIO]
   ```

2. **Instale as dependências**

   ```bash
   pnpm install
   ```

3. **Inicie o projeto**

   ```bash
   pnpm run dev
   ```

4. **Acesse a aplicação**
   - Abra seu navegador em `http://localhost:8080`
   - Use qualquer CPF ou CNPJ válido para testar
