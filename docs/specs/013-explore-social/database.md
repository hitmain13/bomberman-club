# Database

## Nenhuma migration nova

Todas as capacidades desta feature são servidas por agregações Prisma sobre o schema existente (M2):

- Contagem de carros por usuário: `Garage._count.cars` agrupado em memória por `userId` (um usuário só tem uma garage principal na prática, mas o código suporta múltiplas).
- Contagem de seguidores/seguindo: `Follow._count` via `followingId`/`followerId` (índices já existentes).
- Contagem de curtidas recebidas: `Like.count` polimórfico (`targetType` + `targetId` em `PROFILE`, `CAR`, `SIGHTING` do próprio usuário e de seus carros/flagrados).
- Filtro de carros por stage: join no EAV (`CarSpecificationValue` + `SpecificationDefinition.key = "stage"`), validando a premissa original do ADR 0002 ("nunca mais precisa criar migration para adicionar um filtro por spec").
- Ordenação de pessoas por seguidores: `orderBy: { followers: { _count: "desc" } }` (suportado nativamente pelo Prisma 5 em relations 1-N).

## Decisão explícita de não migrar

Dois campos mencionados no prompt de feature (`banner` de perfil, `último acesso`) foram avaliados e **não implementados** nesta rodada — ver ADR 0008 para a justificativa completa (nenhum aparece nos wireframes pixel; adicionar agora seria puramente especulativo).
