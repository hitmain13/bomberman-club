# Acceptance Criteria

## Criar carro

```gherkin
Given um usuário autenticado
When ele preenche o form de novo carro com dados válidos
Then a API cria o carro vinculado à garage principal
And ele é redirecionado para /cars/:id
```

## Editar carro

```gherkin
Given o dono do carro
When ele edita peso ou potência
Then a API atualiza
And o KPI peso/potência é recalculado no detalhe
```

## Editar carro de outro dono

```gherkin
Given um usuário que não é dono do carro
When ele tenta editar
Then a API retorna 403 forbidden
```

## Instalar peça

```gherkin
Given um usuário no carro próprio
When ele seleciona uma categoria, depois uma Part existente, e instala
Then a Part vira CarPart com installedAt opcional
```

## Definir especificação

```gherkin
Given um SpecificationDefinition tipo NUMBER chamado "boost" com unidade "bar"
When o usuário define value=1.4
Then a API valida tipo, persiste em valueNumber e retorna o valor formatado "1.4 bar"
```

## Validação de tipo na spec

```gherkin
Given um SpecificationDefinition tipo BOOLEAN
When o usuário envia value="sim"
Then a API rejeita com 422 validation error
```
