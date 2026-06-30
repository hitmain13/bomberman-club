# Acceptance Criteria

## Cenário: Visualizar próprio perfil

```gherkin
Given um usuário autenticado
When ele acessa /me
Then vê seu avatar, nome, username, cidade, bio
And vê contadores de carros, flagrados e seguidores
And vê o CTA "Editar perfil"
```

## Cenário: Visualizar perfil de outro usuário

```gherkin
Given um usuário autenticado
When ele acessa /u/speed.fabio
Then vê os dados públicos daquele usuário
And vê os CTAs "Seguir" e "Mensagem" (Seguir fica como placeholder até M11)
```

## Cenário: Editar perfil

```gherkin
Given um usuário na tela "Editar perfil"
When ele altera bio, cidade e username válidos
And confirma
Then a API atualiza
And ele volta para a tela do perfil com os novos dados visíveis
```

## Cenário: Username em uso ao editar

```gherkin
Given o usuário tenta editar o username para um já existente
When confirma
Then vê erro "Username já está em uso." sem perder os campos preenchidos
```
