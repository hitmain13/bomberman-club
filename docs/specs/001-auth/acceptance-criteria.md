# Acceptance Criteria

## Cenário: Registro feliz

```gherkin
Given um visitante sem conta
When ele preenche username "speed.fabio", e-mail válido e senha forte e submete o formulário
Then a API retorna 200 com access token
And um cookie httpOnly de refresh é setado
And o usuário é redirecionado para a Home
```

## Cenário: Registro com username já existente

```gherkin
Given o username "speed.fabio" já existe
When o visitante tenta registrar com o mesmo username
Then a API retorna 409 conflict
And o formulário exibe "Username já está em uso."
```

## Cenário: Login

```gherkin
Given um usuário existente com username "speed.fabio" e senha conhecida
When ele submete identifier "speed.fabio" e a senha correta
Then a sessão é criada e o usuário cai na Home
```

## Cenário: Credenciais inválidas

```gherkin
Given um usuário existente
When ele tenta logar com senha incorreta
Then a API retorna 401 unauthorized
And a mensagem genérica "Credenciais inválidas." é exibida
```

## Cenário: Refresh de sessão ao recarregar

```gherkin
Given uma sessão válida (refresh cookie presente)
When o usuário recarrega a página
Then o frontend chama /auth/refresh
And o usuário continua autenticado sem precisar logar
```

## Cenário: Logout

```gherkin
Given um usuário autenticado
When ele dispara "Sair"
Then o refresh token é revogado no servidor
And o cookie httpOnly é removido
And o usuário volta para a tela de Login
```
