# Design Document — ViaCEP MCP Server v1.0.0

## Visão Geral

A v1.0.0 refatora o arquivo único `src/index.ts` em uma arquitetura em camadas, separando o servidor MCP, as ferramentas, os recursos e o cliente HTTP em módulos dedicados. O comportamento externo é preservado — as ferramentas e recursos continuam funcionando da mesma forma para os clientes MCP.

---

## Estrutura de Arquivos

```
src/
├── index.ts                      # Bootstrap — conecta transporte ao servidor
├── server.ts                     # Cria e configura a instância Server MCP
├── tools/
│   ├── index.ts                  # Registra ferramentas no servidor via setRequestHandler
│   ├── get-address-by-cep.ts     # Definição e handler de getAddressByCEP
│   └── get-cep-by-address.ts     # Definição e handler de getCEPByAddress
├── resources/
│   ├── index.ts                  # Registra recursos no servidor via setRequestHandler
│   └── readme.resource.ts        # Handler do recurso readme://viacep
└── client/
    └── viacep.client.ts          # Cliente HTTP isolado para a API ViaCEP
```

---

## Módulos

### `src/client/viacep.client.ts`

Responsável por todas as chamadas HTTP à API ViaCEP. Nenhum outro módulo deve chamar `fetch` diretamente.

```typescript
export interface AddressResult {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

export async function fetchAddressByCEP(cep: string): Promise<AddressResult>

export async function fetchCEPByAddress(
  uf: string,
  cidade: string,
  logradouro: string
): Promise<AddressResult[]>
```

Lança `Error` com mensagem descritiva em caso de status HTTP não-2xx.

---

### `src/tools/get-address-by-cep.ts`

```typescript
import { z } from "zod";

export const GetAddressByCEPSchema = z.object({
  cep: z.string().regex(/^[0-9]{8}$/, "O CEP deve ter exatamente 8 dígitos numéricos."),
});

// Definição da ferramenta para ListToolsRequestSchema
export const getAddressByCEPDefinition = { name, description, inputSchema }

// Handler para CallToolRequestSchema
export async function handleGetAddressByCEP(args: unknown): Promise<ToolResult>
```

---

### `src/tools/get-cep-by-address.ts`

```typescript
import { z } from "zod";

export const GetCEPByAddressSchema = z.object({
  uf: z.string().regex(/^[A-Z]{2}$/, "A UF deve ter exatamente 2 letras maiúsculas."),
  cidade: z.string().min(3, "A cidade deve ter ao menos 3 caracteres."),
  logradouro: z.string().min(3, "O logradouro deve ter ao menos 3 caracteres."),
});

export const getCEPByAddressDefinition = { name, description, inputSchema }

export async function handleGetCEPByAddress(args: unknown): Promise<ToolResult>
```

---

### `src/tools/index.ts`

Registra os dois handlers no servidor:

```typescript
export function registerTools(server: Server): void {
  // ListToolsRequestSchema — retorna array com as duas definições
  // CallToolRequestSchema  — despacha para o handler correto pelo nome
}
```

---

### `src/resources/readme.resource.ts`

```typescript
export const readmeResourceDefinition = {
  uri: "readme://viacep",
  name: "ViaCEP README",
  description: "Documentação do ViaCEP MCP Server",
  mimeType: "text/markdown",
}

export async function handleReadmeResource(projectRoot: string): Promise<ResourceResult>
```

---

### `src/resources/index.ts`

```typescript
export function registerResources(server: Server, projectRoot: string): void {
  // ListResourcesRequestSchema — retorna array com as definições de recursos
  // ReadResourceRequestSchema  — despacha para o handler correto pelo URI
}
```

---

### `src/server.ts`

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { registerTools } from "./tools/index.js";
import { registerResources } from "./resources/index.js";

export function createServer(projectRoot: string): Server {
  const server = new Server(
    { name: "viacep-brasil-mcp-server", version: "0.1.0" },
    { capabilities: { tools: {}, resources: {} } }
  );
  registerTools(server);
  registerResources(server, projectRoot);
  return server;
}
```

---

### `src/index.ts`

```typescript
#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer } from "./server.js";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

async function main() {
  const server = createServer(projectRoot);
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Erro ao iniciar o servidor MCP:", error);
  process.exit(1);
});
```

---

## Diagrama de Dependências

```
index.ts
  └── server.ts
        ├── tools/index.ts
        │     ├── get-address-by-cep.ts
        │     │     └── client/viacep.client.ts
        │     └── get-cep-by-address.ts
        │           └── client/viacep.client.ts
        └── resources/index.ts
              └── readme.resource.ts
```

---

## Decisões Técnicas

| Decisão | Escolha | Justificativa |
|---|---|---|
| Cliente HTTP isolado | `src/client/viacep.client.ts` | Facilita mocking em testes e substituição futura (ex.: cache, retry) |
| `registerTools` / `registerResources` como funções | Funções puras recebendo `server` | Evita acoplamento estático; facilita adicionar novos handlers |
| `createServer` em `server.ts` | Factory function | `index.ts` fica responsável apenas pelo bootstrap e transporte |
| Schemas Zod exportados separadamente | Exportados junto à definição da ferramenta | Reutilizáveis em testes sem precisar importar o handler completo |
