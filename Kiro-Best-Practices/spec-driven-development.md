# Spec-Driven Development no Kiro

O Desenvolvimento Orientado a Especificações (SDD, na sigla em inglês) é uma abordagem para a construção de software em que você começa com uma especificação clara e formal do que o sistema deve fazer, e então usa essa especificação para orientar o projeto, a implementação e os testes.​

Spec-Driven Development é a abordagem estruturada do Kiro para transformar ideias em software funcional de forma sistemática. Em vez de pular direto para o código, o processo guia você por três etapas formais — Requirements, Design e Tasks — garantindo que o agente de IA compreenda profundamente o que precisa ser construído antes de escrever uma única linha de código.


## Por que usar Spec-Driven Development?

- **Clareza antes da execução**: Requisitos são refinados e validados antes de qualquer implementação, reduzindo retrabalho.
- **Rastreabilidade**: Cada linha de código gerada está conectada a um requisito documentado e a uma decisão de design.
- **Consistência**: O agente segue um plano estruturado com tarefas ordenadas, evitando código duplicado ou conflitante.
- **Iteração controlada**: Você revisa e aprova cada etapa antes de avançar, mantendo controle total sobre a direção do projeto.
- **Colaboração**: Specs versionados no Git permitem que toda a equipe entenda o contexto e as decisões tomadas.

## Quando usar Spec-Driven Development?

- Funcionalidades complexas que envolvem múltiplos componentes ou serviços.
- Projetos com requisitos de compliance, segurança ou auditoria.
- Quando múltiplos desenvolvedores precisam trabalhar na mesma feature.
- Quando o custo de retrabalho é alto e decisões de arquitetura precisam ser documentadas.
- Projetos de longa duração onde contexto precisa ser preservado entre sessões.

## Quando NÃO usar?

- Para protótipos rápidos ou provas de conceito — use Vibe Coding.
- Scripts simples ou automações pontuais.
- Quando requisitos ainda estão muito vagos e precisam de brainstorming conversacional primeiro.

## O Fluxo de Trabalho

O Spec-Driven Development segue um pipeline de três documentos:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Requirements   │ ──▶ │     Design      │ ──▶ │     Tasks       │
│  (O QUE)        │     │  (COMO)         │     │  (EXECUÇÃO)     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### 1. Requirements (requirements.md)

Define **o que** precisa ser construído. Contém:
- User Stories no formato "Como [papel], eu quero [ação], para que [benefício]"
- Critérios de aceitação mensuráveis e testáveis
- Propriedades de corretude (correctness properties) que o sistema deve satisfazer

O Kiro analisa ambiguidades automaticamente e faz perguntas de clarificação antes de prosseguir.

### 2. Design (design.md)

Define **como** será construído. Contém:
- Arquitetura de alto nível (componentes, serviços, modelos de dados)
- Design de baixo nível (assinaturas de funções, algoritmos, pseudocódigo)
- Decisões técnicas e trade-offs documentados
- Diagramas de fluxo e sequência quando necessário

### 3. Tasks (tasks.md)

Define a **ordem de execução**. Contém:
- Lista de tarefas ordenadas por dependência
- Cada tarefa com escopo claro e critério de conclusão
- Grafo de dependências entre tarefas
- Tarefas executáveis individualmente ou em lote via "Run All Tasks"

## Estrutura de Arquivos

```
.kiro/
└── specs/
    └── minha-feature/
        ├── .config.kiro        # Configuração do spec (tipo, workflow)
        ├── requirements.md     # Requisitos e critérios de aceitação
        ├── design.md           # Decisões técnicas e arquitetura
        └── tasks.md            # Plano de implementação ordenado
```

## Workflows Disponíveis

### Requirements-First (Recomendado)
Comece pelos requisitos quando:
- Você tem necessidades de negócio claras mas a abordagem técnica ainda está em aberto.
- Stakeholders precisam validar requisitos antes do desenvolvimento.
- Requisitos regulatórios ou de compliance orientam a solução.

**Fluxo**: Requirements → Design → Tasks → Implementação

### Design-First
Comece pelo design técnico quando:
- Você já sabe a solução técnica mas precisa formalizar requisitos.
- Está refatorando um sistema existente.
- Restrições técnicas determinam a arquitetura.

**Fluxo**: Design → Requirements → Tasks → Implementação

### Bugfix
Para correção de bugs existentes:
- Algo está quebrado, crashando ou se comportando incorretamente.
- Usa a metodologia de "condição de bug" para identificar causa raiz.

**Fluxo**: Bug Condition → Design → Tasks → Correção

### Quick Plan
Para execução rápida com revisão mínima:
- Geração automática de requirements, design e tasks.
- Você revisa o plano final e ajusta se necessário.

**Fluxo**: Clarificação → Geração automática → Revisão → Execução

## Como Iniciar um Spec no Kiro

1. Abra uma sessão **Spec** no Kiro (não Vibe).
2. Descreva sua ideia ou feature em linguagem natural.
3. O Kiro pergunta se é uma **nova feature** ou **bugfix**.
4. Para features, escolha entre começar por **Requirements** ou **Technical Design**.
5. Revise e aprove cada documento antes de avançar.
6. Execute as tasks individualmente ou use "Run All Tasks".

## Boas Práticas

- **Versione os specs no Git** — toda a pasta `.kiro/specs/` deve ser commitada. Isso preserva contexto entre sessões e permite colaboração.
- **Revise antes de aprovar** — o Kiro pausa entre cada fase para sua validação. Use esse momento para refinar.
- **Use referências a arquivos** — nos documentos de spec, você pode incluir `#[[file:caminho/arquivo]]` para que o Kiro considere código existente nas decisões.
- **Itere nos requisitos** — a análise de ambiguidades do Kiro ajuda a encontrar lacunas. Responda as perguntas de clarificação com cuidado.
- **Quebre features grandes em specs menores** — um spec por feature ou módulo facilita a gestão e reduz complexidade.
- **Aproveite o versionamento de specs** — para evolução incremental, crie versões (v1.0.0, v2.0.0) dentro da mesma feature.

## Spec-Driven vs. Vibe Coding

| Aspecto | Spec-Driven | Vibe Coding |
|---------|-------------|-------------|
| Abordagem | Estruturada, faseada | Conversacional, livre |
| Documentação | Formal (requirements, design, tasks) | Nenhuma ou mínima |
| Controle | Alto — aprovação a cada fase | Baixo — fluxo contínuo |
| Ideal para | Features complexas, times, produção | Protótipos, MVPs, exploração |
| Rastreabilidade | Total | Mínima |
| Tempo inicial | Maior (investimento em planejamento) | Menor (código imediato) |
| Retrabalho | Menor a longo prazo | Maior a longo prazo |

## Exemplo Real

No projeto `Kiro-Version-Iteration`, um Kanban board foi desenvolvido usando specs versionados:

```
.kiro/specs/kiro-kanban/
├── v1.0.0/          # Versão inicial com board básico
│   ├── requirements.md
│   ├── design.md
│   └── tasks.md
├── v2.0.0/          # Adição de drag-and-drop
├── v3.0.0/          # Filtros e busca
└── v4.0.0/          # Integração com backend
```

Cada versão passou pelo ciclo completo de Requirements → Design → Tasks → Implementação, garantindo evolução incremental controlada e rastreável.
