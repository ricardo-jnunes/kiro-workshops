# Stack Tecnológica

## Tecnologias Principais

- **Runtime**: Node.js 20+
- **Linguagem**: TypeScript 5+
- **Protocolo**: MCP SDK (`@modelcontextprotocol/sdk`)
- **Validação**: Zod
- **Transporte**: stdio (StdioServerTransport)
- **Container**: Docker (opcional)
- **Módulos**: ES Modules (`"type": "module"`)

## Arquitetura

Arquitetura em camadas separando responsabilidades:

- **server**: bootstrap e registro de handlers no servidor MCP
- **tools**: implementação das ferramentas MCP (`getAddressByCEP`, `getCEPByAddress`)
- **resources**: implementação dos recursos MCP (`readme://viacep`)
- **client**: cliente HTTP para a API ViaCEP (isolado para facilitar testes e substituição)

## Comandos Comuns

```bash
# Instalar dependências
npm install

# Build TypeScript
npm run build

# Iniciar o servidor (após build)
node build/index.js

# Watch mode (desenvolvimento)
npm run watch

# Inspecionar com MCP Inspector
npm run inspector

# Build Docker
docker build -t viacep-brasil-mcp-server .

# Executar via NPX
npx viacep-brasil-mcp-server
```

## Regras Principais

- Cada ferramenta e recurso MCP deve ser implementado em arquivo separado
- Validação de entrada obrigatória com Zod em todas as ferramentas
- O cliente ViaCEP deve ser isolado em módulo próprio — sem chamadas diretas a `fetch` nos handlers
- Sem estado global além da instância do servidor MCP
- Zero erros TypeScript em modo `strict: true`
