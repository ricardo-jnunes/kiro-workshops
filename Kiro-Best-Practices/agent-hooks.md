Hooks são automações event-driven que executam agentes de IA em segundo plano quando eventos específicos acontecem no IDE. ​

Os Hooks são ferramentas de automação que otimizam seu fluxo de trabalho de desenvolvimento, executando automaticamente ações predefinidas do agente de IA quando eventos específicos ocorrem em sua IDE. ​

Com os hooks, você elimina a necessidade de solicitar manualmente tarefas rotineiras e garante consistência em toda a sua base de código.​

### Exemplo para criar testes unitários sempre que salva um arquivo tsx.
- - Título do Hook: Generate tests
- Evento (Trigger): File Saved (Quando um arquivo é salvo)
- Filtro de Arquivo (Padrão): src/components/**/*.tsx
- Ação: Ask Kiro (Prompt do Agente)
```
"Quando um arquivo .tsx em src/components/ for salvo, verifique se existe um arquivo de teste correspondente (ex: NomeDoComponente.test.tsx). Se não existir, analise as props e o comportamento do componente e crie um arquivo de teste básico cobrindo a renderização inicial e as interações principais."
```

### Exemplo para deixar o README do projeto sempre atualizado
- Título do Hook: Auto Update README
- Evento (Trigger): 
- File Saved (ou alteração em arquivos .py/.js)
- Filtro de Arquivos (Watch paths): src/**/*.js (ou a extensão do seu projeto)
- Tipo de Ação: Agent Prompt (Ask Kiro)
```
"When a core source file in src/ is modified and saved, review the code changes. Compare them with the current README.md file. If any new features, public functions, or setup instructions were added or removed, update the README.md automatically to keep the documentation accurate and synchronized. 
```