# 010-social — Specification

## Visão

Implementar interações sociais polimórficas (PROFILE | CAR | SIGHTING):

- Likes (toggle)
- Favoritos (toggle)
- Comentários (CRUD básico — create + list + delete owner)
- Follow (toggle entre usuários)
- Notifications (lista + marcar como lida)

## Escopo

- `POST /likes/:targetType/:targetId/toggle`
- `POST /favorites/:targetType/:targetId/toggle`
- `GET /comments/:targetType/:targetId`
- `POST /comments`
- `DELETE /comments/:id`
- `POST /follows/:username/toggle`
- `GET /notifications`
- `POST /notifications/:id/read`

Side-effects: criar `Notification` para o dono ao curtir/comentar/seguir.

## Fora de escopo

- Threads / replies em comments (V1.1).
- Push notifications real-time (V1.1).
