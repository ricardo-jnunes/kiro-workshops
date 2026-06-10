# Tasks — v1.0.0

## Task 1: Criar o cliente ViaCEP

- [ ] Criar `src/client/viacep.client.ts`
- [ ] Definir interface `AddressResult` com os campos da API ViaCEP
- [ ] Implementar `fetchAddressByCEP(cep: string): Promise<AddressResult>`
- [ ] Implementar `fetchCEPByAddress(uf, cidade, logradouro): Promise<AddressResult[]>`
- [ ] Lançar `Error` descritivo em caso de status HTTP não-2xx

**Refs**: Design § `src/client/viacep.client.ts`, Requisito 4.1

---

## Task 2: Implementar ferramenta getAddressByCEP

- [ ] Criar `src/tools/get-address-by-cep.ts`
- [ ] Definir e exportar `GetAddressByCEPSchema` com Zod (regex `^[0-9]{8}$`)
- [ ] Exportar `getAddressByCEPDefinition` com `name`, `description` e `inputSchema`
- [ ] Implementar e exportar `handleGetAddressByCEP(args: unknown)` usando o cliente ViaCEP
- [ ] Retornar `isError: true` quando a API retornar `erro: true`

**Refs**: Design § `src/tools/get-address-by-cep.ts`, Requisitos 1.1–1.5

---

## Task 3: Implementar ferramenta getCEPByAddress

- [ ] Criar `src/tools/get-cep-by-address.ts`
- [ ] Definir e exportar `GetCEPByAddressSchema` com Zod (UF: 2 maiúsculas, cidade/logradouro: min 3)
- [ ] Exportar `getCEPByAddressDefinition` com `name`, `description` e `inputSchema`
- [ ] Implementar e exportar `handleGetCEPByAddress(args: unknown)` usando o cliente ViaCEP
- [ ] Retornar mensagem de "nenhum resultado" quando o array retornado for vazio

**Refs**: Design § `src/tools/get-cep-by-address.ts`, Requisitos 2.1–2.5

---

## Task 4: Criar registro de ferramentas

- [ ] Criar `src/tools/index.ts`
- [ ] Implementar `registerTools(server: Server): void`
- [ ] Registrar handler `ListToolsRequestSchema` retornando as duas definições
- [ ] Registrar handler `CallToolRequestSchema` despachando para o handler correto pelo nome da ferramenta
- [ ] Lançar `Error` para nome de ferramenta desconhecido

**Refs**: Design § `src/tools/index.ts`, Requisito 4.2

---

## Task 5: Implementar recurso README

- [ ] Criar `src/resources/readme.resource.ts`
- [ ] Exportar `readmeResourceDefinition` com `uri`, `name`, `description` e `mimeType`
- [ ] Implementar e exportar `handleReadmeResource(projectRoot: string)`
- [ ] Ler `README.md` com `fs.readFileSync` e retornar conteúdo como texto markdown
- [ ] Lançar `Error` descritivo se o arquivo não existir

**Refs**: Design § `src/resources/readme.resource.ts`, Requisitos 3.1–3.3

---

## Task 6: Criar registro de recursos

- [ ] Criar `src/resources/index.ts`
- [ ] Implementar `registerResources(server: Server, projectRoot: string): void`
- [ ] Registrar handler `ListResourcesRequestSchema` retornando a definição do README
- [ ] Registrar handler `ReadResourceRequestSchema` despachando para o handler correto pelo URI
- [ ] Lançar `Error` para URI de recurso desconhecido

**Refs**: Design § `src/resources/index.ts`, Requisito 4.3

---

## Task 7: Criar factory do servidor MCP

- [ ] Criar `src/server.ts`
- [ ] Implementar `createServer(projectRoot: string): Server`
- [ ] Criar instância `Server` com nome e versão
- [ ] Chamar `registerTools(server)` e `registerResources(server, projectRoot)`
- [ ] Retornar a instância configurada

**Refs**: Design § `src/server.ts`, Requisito 4.4

---

## Task 8: Atualizar ponto de entrada

- [ ] Substituir o conteúdo de `src/index.ts` pelo bootstrap mínimo
- [ ] Importar e chamar `createServer(projectRoot)`
- [ ] Conectar `StdioServerTransport` ao servidor
- [ ] Remover toda lógica de negócio e chamadas HTTP do arquivo

**Refs**: Design § `src/index.ts`, Requisito 4.4

---

## Task 9: Verificação final

- [ ] Executar `npm run build` e confirmar zero erros TypeScript
- [ ] Executar `node build/index.js` e confirmar que o servidor inicia sem erros
- [ ] Testar `getAddressByCEP` com CEP `01001000` via MCP Inspector
- [ ] Testar `getCEPByAddress` com `uf: "SP"`, `cidade: "São Paulo"`, `logradouro: "Avenida Paulista"` via MCP Inspector
- [ ] Confirmar que o recurso `readme://viacep` retorna o conteúdo do README.md

**Refs**: Requisitos 5.1–5.4
