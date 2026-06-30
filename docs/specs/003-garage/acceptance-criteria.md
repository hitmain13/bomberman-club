# Acceptance Criteria

## Cenário: Listar meus carros vazio

```gherkin
Given um usuário autenticado sem carros cadastrados
When ele acessa /me/cars
Then vê o estado vazio "Você ainda não cadastrou carros."
And vê o CTA "Adicionar carro" levando para /me/cars/new
```

## Cenário: Listar meus carros

```gherkin
Given um usuário com 3 carros
When ele acessa /me/cars
Then vê os 3 CarCards com cover, nickname, brand+model, hp, peso e relação peso/pot.
```

## Cenário: Listar carros de outro usuário

```gherkin
Given um usuário público com 2 carros
When alguém acessa /u/speed.fabio/cars
Then vê os 2 carros publicados
```
