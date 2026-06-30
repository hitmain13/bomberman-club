# Acceptance Criteria

```gherkin
Given um usuário autenticado
When ele curte um flagrado pela primeira vez
Then a contagem de likes incrementa em 1
And uma Notification do tipo LIKE é gerada para o dono do flagrado
```

```gherkin
Given um usuário que já curtiu
When ele clica novamente
Then a contagem decrementa
And nenhuma Notification adicional é gerada
```

```gherkin
Given um comentário do próprio usuário
When ele deleta
Then a API retorna 200
```

```gherkin
Given um comentário de outro autor
When o usuário tenta deletar
Then a API retorna 403
```
