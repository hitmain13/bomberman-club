# Bounded Contexts

- **Identity & Access** — `User`, `RefreshToken`, RBAC.
- **Garage** — `Garage`, `Car`, `CarImage`.
- **Configurability** — `SpecificationDefinition`, `CarSpecificationValue`, `PartCategory`, `Part`, `CarPart`.
- **Sightings** — `Sighting`.
- **Social** — `Comment`, `Like`, `Favorite`, `Follow`, `Notification`.
- **Discovery** — feed/search/map/ranking (sem entidades próprias; queries dinâmicas + cache).
- **Media** — `Upload`.

Cada contexto vira um módulo backend em `apps/api/src/modules/<contexto>/`.
