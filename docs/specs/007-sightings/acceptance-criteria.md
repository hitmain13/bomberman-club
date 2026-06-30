# Acceptance Criteria

```gherkin
Given um usuário autenticado
When ele cria um flagrado com foto, título e coordenadas válidas
Then a API responde 200 com o sighting persistido
And a tela /sightings exibe o novo flagrado no topo
```

```gherkin
Given um flagrado de outro dono
When o usuário tenta excluir
Then a API retorna 403
```

```gherkin
Given uma lista filtrada por período "WEEK"
When o usuário acessa /sightings?period=WEEK
Then só flagrados com occurredAt nos últimos 7 dias são retornados
```
