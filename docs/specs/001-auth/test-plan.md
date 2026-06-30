# Test Plan

## Unit (backend, M3)

- token.service: emissão e verificação de access + refresh — DONE.
- auth.service: register conflict, login wrong password, refresh válido/inválido — pendente integração com DB (futuro).

## Unit (frontend)

- Forms Login/Register validam Zod via React Hook Form.
- Componentes da feature têm test render + asserção mínima.

## Integration

- (Skip por ora — requer Postgres). Anotado em `.progress/todo.md`.

## E2E (Playwright)

- (Skip por ora — requer ambiente full). Skeleton incluído.
