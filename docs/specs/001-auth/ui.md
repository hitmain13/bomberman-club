# UI

## Telas (wireframe.png)

- **01 Splash** — logo grande, tagline, botões "Entrar" e "Criar conta".
- **02 Login** — campo `identifier` + `senha`, link "Esqueceu sua senha?", botão "Entrar", botões sociais visuais (sem ação em V1), link "Cadastre-se".
- **03 Registro** — `username`, `e-mail`, `senha`, `confirmar senha`, checkbox de termos, botão "Criar conta", link "Já tem conta? Entrar".
- **04 Recuperar senha** — input `e-mail`, botão "Enviar link", link "Lembrou da senha? Entrar".

Estados:

- Loading no submit (button + form disabled).
- Error inline (form fields) + alerta acima.
- Sucesso → redirect para Home (`/`) ou tela de "verifique seu e-mail".

## Eventos

- Submit do form → mutation TanStack Query → `AuthProvider.signIn|signUp`.
- Refresh on mount já é resolvido pelo provider.

## Sem bottom-nav

Todas as telas de auth usam `AppShell` com `hideBottomNav`.
