# FEATURE_SIGHTINGS_V2.md

# Bomberman Club — Evolução da Feature "Flagrados" (V2)

> Este documento especifica a evolução da feature **Flagrados**. Antes de iniciar qualquer implementação, leia todo o contexto arquitetural do projeto e garanta que a solução permaneça consistente com os padrões existentes.

---

# Contexto

Antes de implementar esta feature, leia obrigatoriamente:

- ARCHITECTURE.md
- IMPLEMENTATION_EXECUTION.md
- EXECUTION_STRATEGY.md
- docs/specs
- docs/architecture
- ADRs
- .cursor/rules
- .cursor/skills
- .ai/rules
- progress.md
- decisions.md

Não implemente nenhuma alteração sem compreender completamente a arquitetura atual.

---

# Objetivos

Esta evolução possui quatro objetivos principais:

1. Melhorar significativamente a experiência da tela de detalhes do flagrado.
2. Adicionar suporte a múltiplas fotos por flagrado.
3. Adicionar compartilhamento de flagrados.
4. Investigar e corrigir o bug de logout inesperado ao navegar pelo mapa.

Todas as alterações devem preservar a arquitetura atual do projeto.

---

# Feature 1 — Novo Layout da Página de Detalhes do Flagrado

Redesenhar completamente a página de detalhes seguindo padrões cognitivos utilizados pelas principais redes sociais modernas.

Referências:

- Instagram
- Threads
- X
- Reddit
- Facebook Marketplace (layout de mídia)
- TikTok (ações flutuantes)

Não copiar layouts.

Utilizar apenas boas práticas de UX.

---

## Nova hierarquia visual

```text
Header

↓

Autor

↓

Galeria de imagens

↓

Botões flutuantes (Curtir / Comentar)

↓

Título

↓

Localização

↓

Mapa

↓

Comentários

↓

Campo para comentar
```

---

## Autor

Exibir:

- avatar
- nome
- @username
- data
- horário
- menu de ações (3 pontos)

---

## Menu do autor

Substituir o botão vermelho "Excluir flagrado".

Utilizar:

```text
⋮

↓

Editar

Apagar
```

Apresentar dropdown moderno.

Somente o autor poderá visualizar esse menu.

---

# Feature 2 — Curtidas e Comentários

Remover os botões inferiores.

Criar botões flutuantes sobre a imagem.

Posicionamento:

```text
Imagem

           ❤️

           💬
```

O botão de comentários deverá:

- exibir badge
- abrir automaticamente a área de comentários

O botão de curtidas deverá:

- possuir animação
- atualizar contador em tempo real

---

# Feature 3 — Galeria de Fotos

Atualmente um flagrado possui apenas uma imagem.

Evoluir o domínio para suportar múltiplas fotos.

Antes de implementar:

avaliar a modelagem atual.

Caso necessário:

criar nova entidade reutilizando Upload.

A solução deve permitir:

- múltiplas fotos
- ordenação
- foto principal
- futura reorganização por drag and drop

---

## Upload

Na criação de um flagrado permitir:

Selecionar:

1

↓

2

↓

3

↓

...

↓

10 fotos

As fotos deverão possuir:

preview

remoção

reordenação

compressão

upload paralelo

retry

---

## Página de detalhes

Exibir:

carrossel horizontal

indicadores

swipe

zoom

lazy loading

---

# Feature 4 — Compartilhar Flagrado

Adicionar botão:

Compartilhar

Permitir:

- copiar link
- Web Share API (quando suportado)
- compartilhamento nativo mobile
- fallback para clipboard

A URL deverá abrir diretamente o flagrado.

Caso usuário não esteja autenticado:

redirecionar para login.

Após autenticação:

retornar automaticamente para o flagrado.

---

# Feature 5 — Mapa

Melhorar a apresentação do mapa.

Adicionar:

gradiente inferior

efeito de expansão

botão:

```text
Ver mapa completo
```

Ao tocar:

expandir o mapa.

---

# Feature 6 — Comentários

A área de comentários deverá:

mostrar:

- avatar
- nome
- username
- tempo relativo
- comentário
- curtidas
- responder

Preparar estrutura para comentários aninhados.

Não é necessário implementar replies agora.

Somente preparar arquitetura.

---

# Feature 7 — Compartilhamento Interno

Preparar o domínio para permitir:

Compartilhar um flagrado dentro do próprio Bomberman Club.

Mesmo que essa funcionalidade ainda não seja utilizada.

Modelar pensando no futuro.

---

# Bug Crítico — Logout inesperado

Existe um bug:

Fluxo:

Mapa

↓

Selecionar pin

↓

Ver detalhes

↓

Usuário é deslogado

Isso nunca deve acontecer.

---

## Investigação obrigatória

Antes de corrigir:

investigar profundamente.

Verificar:

- Auth Context
- JWT
- Refresh Token
- TanStack Query
- Middleware
- Cookies
- Navegação
- Router
- Interceptors
- Providers
- Cache
- Guards
- Session Storage
- Local Storage

Descobrir a causa raiz.

Não aplicar correções superficiais.

---

## Auditoria

Além desse fluxo:

executar auditoria completa.

Verificar:

Perfil

Garage

Cars

Feed

Explore

Mapa

Comentários

Notificações

Configurações

Uploads

Curtir

Compartilhar

Sempre que existir troca de rota.

Caso encontre qualquer logout inesperado:

corrigir.

---

# Banco de Dados

Antes de modificar qualquer tabela responder:

É possível reutilizar Upload?

Existe entidade semelhante?

Existe duplicação?

Existe solução mais escalável?

A modelagem deve continuar preparada para:

- galerias
- vídeos futuramente
- anexos
- mídia compartilhada

---

# Backend

Caso seja necessário:

criar:

- novos endpoints
- paginação
- upload múltiplo
- ordenação de imagens
- compartilhamento

Seguir:

Repository

↓

Service

↓

Controller

↓

DTO

↓

Mapper

↓

Factory

↓

Builder

---

# Frontend

Todos os novos componentes devem seguir:

Atomic Design

Feature First

Server Components

Vitest

Playwright

TanStack Query

Context API

Tailwind

---

# Componentes esperados

Caso não existam:

- SightingGallery
- GalleryCarousel
- GalleryIndicator
- FloatingActionBar
- ShareButton
- ShareDialog
- CommentsSection
- CommentComposer
- ExpandableMap
- AuthorHeader
- AuthorMenu
- ImageUploaderMultiple
- ImagePreviewGrid

Sempre reutilizar componentes existentes antes de criar novos.

---

# Performance

As galerias devem utilizar:

- lazy loading
- preload da próxima imagem
- virtualização quando necessário
- compressão
- cache

Evitar downloads desnecessários.

---

Ao concluir:

Criar flagrado com:

- 1 foto
- 2 fotos
- 5 fotos

Editar flagrado.

Excluir flagrado.

Curtir.

Comentar.

Compartilhar.

Abrir via link compartilhado.

Abrir mapa.

Expandir mapa.

Abrir comentários.

Trocar imagens.

Swipe.

Zoom.

Responsividade.

Dark Mode.

Navegação.

Sessão autenticada.

Sessão expirada.

Refresh Token.

---

---

# Atualização da Arquitetura

Caso qualquer decisão arquitetural seja alterada:

Atualizar obrigatoriamente:

- ARCHITECTURE.md
- docs/specs
- ADRs
- .cursor/rules
- .ai/rules
- decisions.md

---

# Critério de Conclusão

A feature somente poderá ser considerada concluída quando:

✅ Novo layout implementado.

✅ Galeria múltipla funcionando.

✅ Upload múltiplo funcionando.

✅ Compartilhamento funcionando.

✅ Deep link funcionando.

✅ Mapa expansível funcionando.

✅ Botões flutuantes implementados.

✅ Comentários reorganizados.

✅ Menu do autor implementado.

✅ Bug de logout identificado pela causa raiz e corrigido.

✅ Auditoria completa de autenticação executada.

✅ Nenhum fluxo gerar logout inesperado.

✅ Todos os testes passando.

✅ Documentação atualizada.

---

# Resultado Esperado

Ao final da implementação, entregar:

1. Planejamento arquitetural da evolução da feature.
2. Impacto na modelagem do banco de dados.
3. Alterações nos contratos da API.
4. Alterações no frontend.
5. Componentes reutilizados.
6. Novos componentes criados.
7. Justificativa para novos padrões (caso existam).
8. Atualização da documentação e das ADRs quando necessário.

# Feature 8 — Compressão Inteligente de Imagens (Zero Custo)

## Contexto

Recentemente foi implementada uma solução de **Reverse Geocoding** extremamente eficiente utilizando:

- OpenStreetMap (Nominatim)
- Redis
- Cache
- Throttling
- Retry
- Backoff
- Persistência do resultado no banco
- Redução de requests externos

A implementação foi extremamente bem sucedida e deve servir como referência arquitetural para esta nova feature.

A nova funcionalidade deve seguir exatamente a mesma filosofia:

> **Resolver um problema de performance utilizando processamento local e cache, evitando custos com serviços externos.**

---

# Objetivo

Implementar um pipeline completo de **compressão inteligente de imagens**, realizado **100% localmente**, sem qualquer dependência de APIs pagas ou serviços SaaS.

O objetivo é reduzir significativamente:

- tempo de upload
- consumo de banda
- espaço em disco
- espaço no S3/MinIO
- tempo de download
- custo futuro de infraestrutura

Tudo isso mantendo excelente qualidade visual.

---

# Filosofia da solução

A solução deve seguir o mesmo conceito utilizado na geolocalização:

- processamento local
- reaproveitamento
- cache quando fizer sentido
- zero custo operacional
- arquitetura reutilizável
- fácil manutenção

A implementação deve ser transparente para o usuário.

---

# Investigação Arquitetural

Antes de implementar:

Realizar uma análise completa da infraestrutura existente.

Verificar:

- pipeline de upload
- UploadService
- MinIO
- S3
- armazenamento
- componentes de upload
- fluxo de criação de flagrados
- fluxo de edição
- upload do perfil
- upload do carro
- upload da garagem

Caso seja possível criar um pipeline reutilizável:

preferir essa abordagem.

---

# Escopo

A compressão deverá ser aplicada em todos os uploads de imagem do sistema.

Incluindo:

- flagrados
- carros
- perfil
- banner
- futuras galerias
- futuras funcionalidades

Evitar implementações específicas para apenas uma feature.

---

# Pipeline esperado

O pipeline deverá possuir aproximadamente a seguinte responsabilidade:

```text
Selecionar imagem

↓

Validar formato

↓

Validar tamanho

↓

Corrigir orientação EXIF

↓

Redimensionar (quando necessário)

↓

Comprimir

↓

Gerar preview

↓

Gerar metadados

↓

Upload

↓

Persistir
```

A implementação exata fica a critério da arquitetura existente.

---

# Compressão

Objetivos:

Reduzir o tamanho do arquivo mantendo qualidade visual.

A estratégia deve considerar automaticamente:

- resolução
- proporção
- formato
- tamanho original

Evitar compressões agressivas.

Priorizar qualidade.

---

# Formatos

Analisar quais formatos o projeto atualmente suporta.

A solução deve permanecer preparada para futura expansão.

Considerar:

- JPEG
- PNG
- WEBP
- AVIF (quando fizer sentido)

Não quebrar compatibilidade existente.

---

# Responsabilidade

A compressão deve acontecer antes do upload.

O usuário não deve perceber o processo.

A interface deve continuar responsiva.

Caso necessário:

executar processamento assíncrono.

---

# Preview

Durante o upload:

Continuar exibindo preview.

Caso exista compressão:

o preview não deve piscar.

Evitar recriações desnecessárias.

---

# Metadados

Persistir quando útil:

- largura
- altura
- tamanho original
- tamanho comprimido
- taxa de compressão
- mime type

Essas informações poderão ser utilizadas futuramente para métricas.

---

# Observabilidade

Seguir a mesma filosofia utilizada na geolocalização.

Adicionar métricas.

Exemplos:

- imagens processadas
- tamanho original
- tamanho comprimido
- percentual médio de redução
- tempo médio de processamento
- falhas
- retries

Registrar logs úteis.

---

# Performance

A solução deve minimizar:

- uso de memória
- uso de CPU
- bloqueio da interface
- uploads desnecessários

Caso uma imagem já esteja suficientemente otimizada:

evitar recompressão.

---

# Reutilização

Antes de criar qualquer utilitário:

procurar implementações existentes.

Reutilizar:

- UploadService
- componentes
- hooks
- schemas
- utils
- validators

Não criar duplicação.

---

# Banco de Dados

Avaliar se faz sentido persistir:

- originalSize
- compressedSize
- compressionRatio
- width
- height

Caso a modelagem agregue valor futuro:

criar migration.

Caso contrário:

não adicionar complexidade desnecessária.

Registrar a decisão em ADR.

---

# Backend

Avaliar se a compressão deve ocorrer:

- apenas no frontend
- apenas no backend
- híbrida

Escolher a solução que apresentar melhor custo-benefício.

Justificar a decisão arquitetural.

---

# Frontend

Melhorar a experiência de upload.

Adicionar:

- indicador de processamento
- progresso
- preview
- tratamento de erro
- retry quando necessário

Tudo reutilizando componentes existentes.

---

# Critérios de Aceitação

A implementação será considerada concluída quando:

✅ Todas as imagens forem comprimidas automaticamente.

✅ Nenhum serviço pago for utilizado.

✅ Nenhuma API externa for necessária.

✅ A qualidade visual permanecer excelente.

✅ O tamanho médio dos uploads reduzir significativamente.

✅ O pipeline de upload permanecer transparente para o usuário.

✅ Todos os uploads existentes continuarem funcionando.

✅ A solução for reutilizável para qualquer entidade do sistema.

✅ Browser QA executado.

✅ Testes automatizados passando.

✅ Documentação atualizada.

---

# Auditoria

Após concluir:

Executar testes em:

- upload de perfil
- upload de carro
- upload de flagrado
- múltiplas fotos
- imagens grandes
- imagens pequenas
- formatos diferentes

Comparar:

- tamanho antes
- tamanho depois
- qualidade visual
- tempo de upload

Gerar relatório resumido.

---

# Resultado Esperado

Ao final da implementação entregar:

1. Planejamento arquitetural da solução.
2. Justificativa técnica da abordagem escolhida.
3. Componentes reutilizados.
4. Novos componentes criados (caso existam).
5. Impacto na infraestrutura.
6. Métricas de compressão obtidas.
7. Comparativo antes/depois.
8. Atualização da documentação.
9. Atualização das ADRs quando necessário.
10. Evidências de Browser QA e testes automatizados.

---

# Princípio Arquitetural

Esta feature deve seguir exatamente a filosofia adotada na implementação da geolocalização:

- solução simples
- solução elegante
- custo zero
- baixo acoplamento
- alta reutilização
- alta performance
- fácil manutenção
- preparada para evolução futura

Caso exista uma solução mais simples, mais performática e mais reutilizável do que a inicialmente planejada, ela deve ser preferida, desde que preserve a arquitetura e os padrões definidos para o Bomberman Club.

# Feature 9 — Administração Global de Flagrados (RBAC)

## Contexto

Atualmente a funcionalidade de exclusão de flagrados segue a seguinte regra:

- apenas o autor do flagrado consegue visualizar o menu de ações;
- apenas o autor consegue editar;
- apenas o autor consegue excluir.

Essa regra funciona corretamente para usuários comuns.

Entretanto, o projeto agora passa a possuir o conceito de **Administrador Global**, responsável pela moderação da plataforma.

Essa feature deve evoluir o sistema de permissões sem criar tratamentos específicos ("hardcoded") para usuários individuais.

A arquitetura deve continuar preparada para futuras permissões e papéis administrativos.

---

# Objetivo

Implementar um sistema onde usuários administradores possam moderar qualquer flagrado da plataforma.

O comportamento esperado para um administrador deve ser exatamente o mesmo do autor do flagrado no que diz respeito às ações administrativas.

---

# Investigação Arquitetural

Antes de implementar:

Realizar uma análise completa da arquitetura atual.

Verificar:

- módulo Auth
- RBAC existente
- User
- Session
- JWT
- Refresh Token
- Middlewares
- Guards
- Policies
- Permissões
- Context API
- Providers
- Hooks
- DTOs
- Tipagens

Responder internamente:

Existe um sistema de permissões reutilizável?

Existe Role?

Existe Claim?

Existe Policy?

Existe Guard?

Sempre reutilizar antes de criar novas abstrações.

---

# Evolução do Domínio

Caso ainda não exista:

evoluir o domínio para suportar papéis de usuário.

Exemplo:

- USER
- ADMIN

A implementação deve permanecer preparada para futuras funções como:

- MODERATOR
- SUPER_ADMIN
- EVENT_ADMIN

Evitar qualquer implementação baseada em comparação direta de e-mails.

A solução deve ser baseada em permissões.

---

# Usuário administrador

Para esta entrega, o seguinte usuário deverá possuir privilégios administrativos:

```text
hide.fabio123@gmail.com
```

Entretanto:

essa associação deve acontecer através do sistema de papéis do domínio.

Nunca através de:

```ts
if (email === "...") { ... }
```

Caso ainda não exista papel ADMIN para esse usuário:

criar migration, seed ou procedimento adequado seguindo os padrões do projeto.

---

# Interface

Quando o usuário autenticado possuir permissão administrativa:

a interface deverá se comportar exatamente como se ele fosse o autor.

Ou seja:

- visualizar menu de ações
- editar
- excluir

Mesmo quando o flagrado pertencer a outro usuário.

---

# Menu de ações

Continuar utilizando:

```text
⋮

Editar

Apagar
```

Apenas alterar a lógica de autorização.

Não modificar a experiência visual.

---

# Backend

Revisar todos os endpoints relacionados aos flagrados.

Garantir que:

- usuários comuns apenas possam editar seus próprios flagrados;
- administradores possam editar qualquer flagrado;
- usuários comuns apenas possam excluir seus próprios flagrados;
- administradores possam excluir qualquer flagrado.

Nunca confiar apenas na validação do frontend.

Toda autorização deve ocorrer também no backend.

---

# Auditoria de Permissões

Realizar uma auditoria completa.

Verificar outras funcionalidades que hoje utilizam validações semelhantes.

Exemplos:

- comentários
- carros
- uploads
- perfil
- notificações
- futuras entidades moderáveis

Caso exista código duplicado de autorização:

centralizar a regra.

---

# Evolução Arquitetural

Caso necessário:

introduzir uma camada de autorização reutilizável.

Exemplos possíveis:

- AuthorizationService
- PermissionService
- Ability
- Policy
- AuthorizationGuard

Escolher a solução mais simples e elegante.

Evitar duplicação de verificações.

---

# Frontend

Revisar:

- hooks de autenticação
- sessão
- providers
- componentes condicionais

Garantir que toda renderização baseada em permissões reutilize uma única fonte de verdade.

Evitar lógica duplicada em múltiplas telas.

---

# Segurança

Garantir que:

mesmo manipulando requests manualmente,

um usuário comum nunca consiga excluir conteúdo de terceiros.

Toda decisão deve ser validada no backend.

---

# Testes

Adicionar testes para:

Usuário comum:

- editar próprio flagrado
- excluir próprio flagrado
- tentar excluir flagrado de terceiros

Administrador:

- editar qualquer flagrado
- excluir qualquer flagrado

Validar também:

- renderização correta do menu
- permissões da API
- autorização do backend

---

# Browser QA

Executar obrigatoriamente:

Usuário comum:

- acessar próprio flagrado
- acessar flagrado de outro membro

Administrador:

- acessar próprio flagrado
- acessar flagrado de terceiros
- editar
- excluir

Garantir que todos os fluxos estejam funcionando corretamente.

---

# Atualização da Arquitetura

Caso seja criada uma nova abstração de autorização:

Atualizar obrigatoriamente:

- ARCHITECTURE.md
- docs/specs
- ADRs
- .cursor/rules
- .ai/rules
- decisions.md

---

# Critério de Conclusão

A feature somente poderá ser considerada concluída quando:

✅ Administradores puderem editar qualquer flagrado.

✅ Administradores puderem excluir qualquer flagrado.

✅ Usuários comuns continuarem limitados aos próprios flagrados.

✅ Nenhuma regra esteja baseada em e-mail hardcoded.

✅ Toda autorização esteja protegida também no backend.

✅ Código de autorização reutilizável.

✅ Testes automatizados passando.

✅ Browser QA concluído.

✅ Documentação atualizada.

---

# Resultado Esperado

Ao final da implementação entregar:

1. Planejamento arquitetural da evolução do sistema de permissões.
2. Impacto no domínio de autenticação e autorização.
3. Alterações no banco de dados (caso existam).
4. Alterações nos contratos da API.
5. Componentes reutilizados.
6. Novas abstrações de autorização (caso criadas) e justificativa.
7. Relatório de Browser QA.
8. Relatório dos testes automatizados.
9. Atualização das ADRs e da documentação quando necessário.
