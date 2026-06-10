# Estrutura do Projeto

```
Kiro-MCP-ViaCEP/
├── src/
│   ├── index.ts                  # Ponto de entrada — bootstrap do servidor
│   ├── server.ts                 # Criação e configuração da instância Server MCP
│   ├── tools/
│   │   ├── index.ts              # Registro de todas as ferramentas no servidor
│   │   ├── get-address-by-cep.ts # Ferramenta getAddressByCEP
│   │   └── get-cep-by-address.ts # Ferramenta getCEPByAddress
│   ├── resources/
│   │   ├── index.ts              # Registro de todos os recursos no servidor
│   │   └── readme.resource.ts    # Recurso readme://viacep
│   └── client/
│       └── viacep.client.ts      # Cliente HTTP para a API ViaCEP
│
├── .kiro/
│   ├── steering/                 # Regras sempre ativas para o assistente
│   │   ├── product.md
│   │   ├── tech.md
│   │   ├── structure.md
│   │   └── workflow.md
│   ├── settings/
│   │   └── mcp.json              # Configuração MCP local para uso no Kiro
│   └── specs/
│       └── viacep-mcp/
│           └── v1.0.0/           # Iteração 1 — servidor MCP base
│               ├── requirements.md
│               ├── design.md
│               ├── tasks.md
│               └── .config.kiro
│
├── build/                        # Saída do compilador TypeScript (ignorado pelo Git)
├── Dockerfile
├── package.json
├── tsconfig.json
├── .gitignore
└── README.md
```

## Convenções de Nomenclatura

- **Arquivos**: kebab-case (ex.: `get-address-by-cep.ts`)
- **Classes/Interfaces**: PascalCase (ex.: `ViaCepClient`, `AddressResult`)
- **Funções exportadas**: camelCase (ex.: `registerTools`, `getAddressByCEP`)
- **Schemas Zod**: sufixo `Schema` (ex.: `GetAddressByCEPSchema`)

## Regras de Organização

- Cada ferramenta MCP em arquivo dedicado dentro de `src/tools/`
- Cada recurso MCP em arquivo dedicado dentro de `src/resources/`
- O cliente HTTP da API ViaCEP isolado em `src/client/` — nunca chamado diretamente nos handlers
- `src/index.ts` apenas faz o bootstrap — sem lógica de negócio
