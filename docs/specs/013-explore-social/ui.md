# UI

## Telas (wireframe suplementar "Pessoas & Carros")

| # | Tela | Implementação |
| - | ---- | -------------- |
| 01 | Home/Feed | já existente (`/feed`), sem alteração |
| 02 | Explorar | `/explore` — busca + tabs Todos/Pessoas/Carros/Flagrados + modo navegação (Em destaque + Membros recentes) |
| 03 | Pessoas (lista) | aba "Pessoas" do `/explore` sem query — `PersonListItem` em lista |
| 04 | Filtros (Pessoas) | `PeopleFiltersSheet` (bottom sheet: cidade, ordenar por, membro desde) |
| 05 | Pessoas (resultado filtrado) | mesma lista + chip de cidade ativa com botão de remover |
| 06 | Perfil do membro | `/u/[username]` enriquecido (stats reais, 4 abas) |
| 07 | Perfil (aba Carros) | reaproveita `CarList`/`UserCarsTab` já existente |
| 08 | Carro do membro (detalhe) | já existente (`/cars/[id]`), sem alteração |
| 09 | Carros (lista geral) | aba "Carros" do `/explore` — `CarCard` com `owner` |
| 10 | Carros (filtro por membro) | mesma aba + `?owner=username` na URL + chip "Membro: @username" |

## Padrão visual

Mobile-first 375px, cards arredondados, ícones lineares (consistente com `Icon` atom existente — novo ícone `filter` adicionado seguindo o mesmo estilo `stroke="currentColor"`), tipografia clara (herdada do design system, sem novos tokens).

## Estados

Todas as novas listas seguem o padrão `StatePanel` já estabelecido: `loading` (skeleton), `empty` (mensagem contextual), `error` (com descrição).
