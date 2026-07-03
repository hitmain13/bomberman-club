# Acceptance Criteria

## Listar pessoas (sem busca)

```gherkin
Given um usuário autenticado na aba "Pessoas" do Explorar sem digitar nada
When a lista carrega
Then vê membros ordenados por mais recentes, cada um com avatar, @username,
  cidade, quantidade de carros, quantidade de seguidores e botão de seguir
```

## Filtrar pessoas por cidade

```gherkin
Given a aba "Pessoas" aberta
When o usuário abre os filtros, define cidade "São Paulo - SP" e aplica
Then a lista é refeita mostrando apenas membros dessa cidade
And um chip "São Paulo - SP" com botão de remover aparece acima da lista
```

## Abrir perfil a partir da lista

```gherkin
Given a lista de pessoas do Explorar
When o usuário toca em um card de pessoa (fora do botão Seguir)
Then é navegado para /u/:username
```

## Perfil público com estatísticas reais

```gherkin
Given o perfil de um membro com 3 carros, 12 flagrados, 128 seguidores e 40 seguindo
When o usuário abre /u/:username
Then a grade de estatísticas mostra os 4 números corretos
And o botão de seguir reflete o estado real (Seguir/Seguindo) desde o primeiro render
```

## Abas do perfil

```gherkin
Given um perfil público
When o usuário navega pelas abas Sobre, Carros, Flagrados, Curtidas
Then "Sobre" mostra bio, cidade e "no clube desde"
And "Curtidas" mostra os carros e flagrados que o membro curtiu
```

## Explorar carros com filtro de stage

```gherkin
Given a aba "Carros" do Explorar
When o usuário filtra por Stage "Stage 2" e ordena por "Mais potentes"
Then apenas carros com essa spec de stage aparecem, ordenados por hp desc
And cada card mostra o proprietário (avatar + @username)
```

## Filtrar carros por proprietário

```gherkin
Given a URL /explore?type=CARS&owner=speed.fabio
When a página carrega
Then apenas os carros de @speed.fabio aparecem
And um chip "Membro: @speed.fabio" com botão de remover é exibido
```
