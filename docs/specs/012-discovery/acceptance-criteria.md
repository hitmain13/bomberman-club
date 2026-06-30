# Acceptance Criteria

```gherkin
Given um usuário autenticado
When ele acessa /feed?scope=recent
Then vê os flagrados e carros mais recentes intercalados
```

```gherkin
Given carros publicados na base
When ele acessa /ranking?metric=weightToPower
Then vê o top 20 ordenado pelo menor kg/cv
```

```gherkin
Given a query "GTI"
When ele acessa /search?q=GTI
Then vê pessoas, carros e flagrados que contenham GTI no nome/título
```
