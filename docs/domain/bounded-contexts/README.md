# Bounded Contexts

- **Identity & Access** — `User`, `RefreshToken`, RBAC.
- **Garage** — `Garage`, `Car`, `CarImage`.
- **Configurability** — `SpecificationDefinition`, `CarSpecificationValue`, `PartCategory`, `Part`, `CarPart`.
- **Sightings** — `Sighting`.
- **Social** — `Comment`, `Like`, `Favorite`, `Follow`, `Notification`.
- **Discovery** — feed/search/ranking/explore (people, cars)/estatísticas de perfil/itens curtidos (sem entidades próprias; queries dinâmicas + agregação sobre outros contexts + cache). Única camada autorizada a importar repositórios de múltiplos módulos de domínio (ADR 0008).
- **Media** — `Upload`.

Cada contexto vira um módulo backend em `apps/api/src/modules/<contexto>/`.
