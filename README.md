# Site de Imobiliária

Site completo para imobiliária: landing page, catálogo de imóveis com filtros,
página de cada imóvel com formulário de contato, e painel administrativo para
cadastrar imóveis, gerenciar fotos, leads e configurações do site — tudo
dinâmico (nome, logo, cores, contato), nada hardcoded.

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript + Tailwind + shadcn/ui
- [Prisma](https://prisma.io) + PostgreSQL ([Supabase](https://supabase.com))
- Supabase Auth (login do admin) e Supabase Storage (fotos de imóveis)
- [Resend](https://resend.com) para e-mail de notificação de leads (opcional)

## Configuração local

1. Crie um projeto gratuito em [supabase.com](https://supabase.com).
2. Copie `.env.example` para `.env` e preencha com as credenciais do seu
   projeto Supabase (Project Settings → Database para as connection strings,
   Project Settings → API Keys para as chaves).
3. Instale as dependências e aplique o schema no banco:
   ```bash
   npm install
   npx prisma migrate dev
   npm run db:seed
   ```
   O seed cria um usuário admin (`SEED_ADMIN_EMAIL`/`SEED_ADMIN_PASSWORD` do
   `.env`) no Supabase Auth e 5 imóveis de exemplo.
4. Rode o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
5. Acesse [http://localhost:3000](http://localhost:3000) (site público) e
   [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
   (painel administrativo).

## Scripts

- `npm run dev` — servidor de desenvolvimento
- `npm run build` / `npm run start` — build e servidor de produção
- `npm run lint` — checagem de lint
- `npm run db:migrate` — cria/aplica migrations do Prisma
- `npm run db:seed` — popula o banco (admin + imóveis de exemplo)
- `npm run db:studio` — abre o Prisma Studio para inspecionar o banco

## Deploy (Vercel)

1. Importe o repositório na [Vercel](https://vercel.com/new).
2. Configure as variáveis de ambiente do `.env.example` no painel do projeto
   (Settings → Environment Variables) — as mesmas usadas localmente, apontando
   para o mesmo projeto Supabase ou um projeto de produção separado.
3. Configure `RESEND_API_KEY` e `EMAIL_FROM` para os e-mails de lead serem
   enviados de verdade (sem isso, o sistema continua funcionando, só não
   envia e-mail).
4. Depois do primeiro deploy, rode `npx prisma migrate deploy` (apontando
   para o banco de produção) e `npm run db:seed` uma vez para criar o admin.
5. Atualize `NEXT_PUBLIC_SITE_URL` para o domínio real — é usado no
   `sitemap.xml`, `robots.txt` e nos links dos e-mails de notificação.

## Estrutura

- `src/app/(site)` — páginas públicas (home, catálogo, imóvel, contato...)
- `src/app/admin` — painel administrativo (protegido por login)
- `src/lib/actions` — server actions (mutações: imóveis, fotos, leads, config)
- `src/lib/supabase` — clientes Supabase (server, admin/service-role)
- `prisma/schema.prisma` — modelo de dados
