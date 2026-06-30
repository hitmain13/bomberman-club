# 001-auth — Specification

## Visão

Permitir que um Bomberman se registre, faça login e recupere acesso à conta com segurança nível produção (JWT access curto + refresh rotativo).

## Por quê

Sem identidade não há perfil, garagem, flagrados nem social. Auth é a fundação de todos os demais módulos.

## Escopo

- Tela 01 Splash com CTA "Entrar" / "Criar conta".
- Tela 02 Login (identifier = username ou e-mail + senha).
- Tela 03 Registro (username, e-mail, senha).
- Tela 04 Recuperar senha (request de link via e-mail).
- Sessão persistente via refresh cookie httpOnly + access token em memória.
- Logout.

## Fora de escopo (V1)

- Login social (Google/Apple) — visual presente no wireframe mas implementação fica para 010+.
- Verificação real de e-mail (a entrega de e-mail será stub em dev).
- 2FA.

## Dependências

- Backend `apps/api`: módulos `auth` e `users` (já implementados em M3).
- SDK: `@bomberman/sdk` com `auth.register/login/refresh/logout`.
- Frontend: `AuthProvider` (já implementado em M4).
