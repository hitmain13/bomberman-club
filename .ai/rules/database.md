# Database (canonical)

Detalhado em `.cursor/rules/70-database.mdc` e `docs/architecture/adr/0002-eav-puro.md` e `docs/architecture/adr/0004-relacoes-polimorficas.md`.

## Modelos principais

- **User** — autenticação e identidade pública (username, email, bio, city, avatarUploadId).
- **RefreshToken** — sessão; hash + expiresAt + revokedAt.
- **Garage** — pessoa pode ter várias; uma `isPrimary`.
- **Car** — campos tipados (weight, horsepower, torque, currentKm, year, brand, model, fuel, engine, generation, plate?). Tudo dinâmico vira EAV.
- **CarImage** — galeria (referencia `Upload`).
- **Upload** — fonte única de mídia (`ownerId`, `bucketKey`, `url`, `mime`, `size`, `width?`, `height?`).
- **PartCategory / Part / CarPart** — peças reaproveitáveis.
- **SpecificationDefinition / CarSpecificationValue** — EAV puro.
- **Sighting** — flagrados (referencia `Upload`, latitude/longitude, occurredAt).
- **Follow** — `followerId` → `followingId`.
- **Comment / Like / Favorite** — polimórficos (`targetType`, `targetId`).
- **Notification** — `userId`, `type`, `actorId?`, `targetType?`, `targetId?`, `readAt?`.

## Seeds

- `PartCategory`: Turbo, Intercooler, Fuel, Intake, Exhaust, Suspension, Transmission, Cooling, Engine, Brakes, Wheels, Electronics.
- `SpecificationDefinition`: stage, boost, compression, ecu, injector, turbo_model, launch_control_rpm, fuel_type, intake_type, exhaust_type, transmission_type, drivetrain.
