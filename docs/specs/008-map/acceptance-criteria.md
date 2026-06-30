# Acceptance Criteria

```gherkin
Given um usuário autenticado em /map
When troca o filtro para "Semana"
Then o mapa só exibe flagrados ocorridos nos últimos 7 dias
```

```gherkin
Given pelo menos um flagrado na lista
When o usuário clica num pin
Then um popup aparece com título e link para /sightings/:id
```
