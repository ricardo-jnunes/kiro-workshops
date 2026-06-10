# Visão Geral do Produto

**ViaCEP Brasil MCP Server** é um servidor MCP (Model Context Protocol) que conecta agentes de IA à API pública [ViaCEP](https://viacep.com.br), permitindo consultas de endereços e CEPs brasileiros por meio de linguagem natural.

## Ferramentas Disponíveis

- **getAddressByCEP** — retorna endereço completo (logradouro, bairro, cidade, UF, IBGE, DDD) a partir de um CEP de 8 dígitos
- **getCEPByAddress** — retorna lista de CEPs a partir de UF, cidade e logradouro

## Recursos Disponíveis

- **readme://viacep** — documentação do servidor em Markdown, acessível via protocolo MCP

## Casos de Uso

- Consulta e validação de endereços em formulários assistidos por IA
- Preenchimento automático de dados de endereço em fluxos conversacionais
- Integração com sistemas que utilizam agentes de IA (Kiro, Claude, Cursor, Copilot)

## Público-Alvo

Desenvolvedores que precisam integrar consulta de CEPs brasileiros em agentes de IA via protocolo MCP.

## Restrições Principais

- Sem autenticação — a API ViaCEP é pública e gratuita
- Somente CEPs brasileiros são suportados
- O servidor opera via stdio (transporte padrão MCP)
