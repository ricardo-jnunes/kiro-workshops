# Requirements Document — v1.0.0

## Introdução

A iteração **v1.0.0** estabelece o servidor MCP **ViaCEP Brasil** com arquitetura em camadas, separando responsabilidades em módulos dedicados. O objetivo é refatorar o arquivo único `src/index.ts` em uma estrutura organizada e extensível, mantendo todas as funcionalidades existentes e garantindo compilação sem erros.

---

## Glossário

- **MCP Server**: Instância do servidor Model Context Protocol, responsável por registrar e despachar ferramentas e recursos.
- **Tool**: Ferramenta MCP invocável por agentes de IA, com nome, descrição e schema de entrada definidos.
- **Resource**: Recurso MCP acessível por URI, retornando conteúdo estruturado (texto, markdown, etc.).
- **ViaCEP Client**: Módulo isolado responsável pelas chamadas HTTP à API ViaCEP.
- **CEP**: Código de Endereçamento Postal brasileiro, composto por 8 dígitos numéricos.
- **UF**: Código de duas letras maiúsculas representando um estado brasileiro (ex.: `SP`, `RS`).
- **Schema Zod**: Definição de validação de entrada usando a biblioteca Zod.
- **stdio**: Transporte padrão MCP via entrada/saída padrão do processo.

---

## Requisitos

### Requisito 1: Ferramenta getAddressByCEP

**User Story:** Como agente de IA, quero consultar o endereço completo de um CEP brasileiro, para que eu possa fornecer informações de localização precisas ao usuário.

#### Critérios de Aceitação

1. THE Tool `getAddressByCEP` SHALL aceitar um parâmetro `cep` do tipo string com exatamente 8 dígitos numéricos, rejeitando qualquer valor com comprimento diferente ou caracteres não numéricos.
2. WHEN o `cep` fornecido for válido e existir na base ViaCEP, THE Tool SHALL retornar um objeto JSON com os campos: `cep`, `logradouro`, `complemento`, `bairro`, `localidade`, `uf`, `ibge`, `gia`, `ddd`, `siafi`.
3. WHEN o `cep` fornecido não existir na base ViaCEP (resposta com `erro: true`), THE Tool SHALL retornar `isError: true` com mensagem `"CEP não encontrado."`.
4. IF a API ViaCEP retornar status HTTP diferente de 2xx, THEN THE Tool SHALL lançar um erro com mensagem descritiva informando a falha na comunicação com a API.
5. THE Tool SHALL validar o parâmetro `cep` usando Zod antes de realizar qualquer chamada HTTP, de modo que entradas inválidas sejam rejeitadas sem chamada à API.

---

### Requisito 2: Ferramenta getCEPByAddress

**User Story:** Como agente de IA, quero buscar CEPs a partir de informações parciais de endereço, para que eu possa localizar códigos postais sem conhecer o CEP exato.

#### Critérios de Aceitação

1. THE Tool `getCEPByAddress` SHALL aceitar três parâmetros obrigatórios: `uf` (string de exatamente 2 letras maiúsculas), `cidade` (string com mínimo de 3 caracteres) e `logradouro` (string com mínimo de 3 caracteres).
2. WHEN os parâmetros forem válidos e a API retornar resultados, THE Tool SHALL retornar um array JSON com os endereços encontrados, cada um contendo pelo menos `cep`, `logradouro`, `bairro`, `localidade` e `uf`.
3. WHEN a API retornar lista vazia, THE Tool SHALL retornar mensagem `"Nenhum CEP encontrado para o endereço informado."` sem `isError`.
4. IF a API ViaCEP retornar status HTTP diferente de 2xx, THEN THE Tool SHALL lançar um erro com mensagem descritiva informando a falha na comunicação com a API.
5. THE Tool SHALL validar todos os parâmetros usando Zod antes de realizar qualquer chamada HTTP.

---

### Requisito 3: Recurso README

**User Story:** Como desenvolvedor integrando o servidor MCP, quero acessar a documentação do servidor via protocolo MCP, para que eu possa consultá-la sem sair do ambiente de desenvolvimento.

#### Critérios de Aceitação

1. THE Resource `readme://viacep` SHALL estar listado na resposta do handler `ListResourcesRequestSchema` com `uri`, `name`, `description` e `mimeType: "text/markdown"`.
2. WHEN o URI `readme://viacep` for solicitado via `ReadResourceRequestSchema`, THE Resource SHALL retornar o conteúdo do arquivo `README.md` da raiz do projeto como texto markdown.
3. IF o arquivo `README.md` não existir no sistema de arquivos, THEN THE Resource SHALL lançar um erro com mensagem `"Failed to read README.md: <detalhe do erro>"`.

---

### Requisito 4: Arquitetura em Camadas

**User Story:** Como desenvolvedor, quero que o código seja organizado em módulos separados por responsabilidade, para que seja fácil adicionar novas ferramentas, recursos e manter o código existente.

#### Critérios de Aceitação

1. THE ViaCEP Client SHALL ser implementado em `src/client/viacep.client.ts`, expondo funções para `fetchAddressByCEP` e `fetchCEPByAddress`, de modo que nenhum handler de ferramenta contenha chamadas diretas a `fetch`.
2. THE Tools `getAddressByCEP` e `getCEPByAddress` SHALL ser implementadas em arquivos separados dentro de `src/tools/`, cada uma exportando sua definição de schema e função handler.
3. THE Resource `readme://viacep` SHALL ser implementado em `src/resources/readme.resource.ts`, separado dos handlers de ferramentas.
4. THE arquivo `src/index.ts` SHALL conter apenas o bootstrap do servidor (criação da instância, registro de handlers e início do transporte), sem lógica de negócio ou chamadas HTTP diretas.
5. THE projeto SHALL compilar sem erros TypeScript em modo `strict: true` após a refatoração.

---

### Requisito 5: Qualidade Técnica — v1.0.0

**User Story:** Como desenvolvedor, quero que o servidor mantenha zero erros de compilação e funcione corretamente após a refatoração, para que a mudança estrutural não introduza regressões.

#### Critérios de Aceitação

1. THE projeto SHALL compilar sem erros com `npm run build` (execução de `tsc` sem nenhuma linha de erro na saída).
2. WHEN o servidor for iniciado com `node build/index.js`, THE servidor SHALL conectar ao transporte stdio sem erros de runtime.
3. THE servidor SHALL responder corretamente às ferramentas `getAddressByCEP` e `getCEPByAddress` com o mesmo comportamento da implementação anterior ao refatoramento.
4. THE código SHALL seguir as convenções de nomenclatura definidas no steering file `structure.md`: arquivos em kebab-case, classes em PascalCase, funções exportadas em camelCase, schemas com sufixo `Schema`.
