# Portal de Chamados — Facilities

Portal de consulta de chamados do Zoho Desk para a equipe de operações da Genial Care.

## Estrutura

```
chamados-facilities/
├── index.html          # Frontend
├── api/
│   ├── tickets.js      # Proxy: lista tickets
│   └── search.js       # Proxy: busca tickets
├── vercel.json
└── README.md
```

## Deploy no Vercel

### 1. Subir o repositório no GitHub

```bash
git init
git add .
git commit -m "feat: portal de chamados facilities"
git remote add origin https://github.com/matheussilva-ai/chamados-facilities.git
git push -u origin main
```

### 2. Importar no Vercel

- Acesse vercel.com → Add New Project
- Selecione o repositório `chamados-facilities`
- Framework Preset: **Other**
- Clique em Deploy

### 3. Configurar variáveis de ambiente

No painel do projeto no Vercel → Settings → Environment Variables:

| Nome | Valor |
|------|-------|
| `ZOHO_CLIENT_ID` | `1000.U4B2MCG9ECED1FKM5FXLY4RPZ7EAAK` |
| `ZOHO_CLIENT_SECRET` | `efafbe583dab2a9ac05e19b8585de5d8235e81436d` |
| `ZOHO_REFRESH_TOKEN` | `1000.9dfd2b31d586a9b1b16bbb70aa9288bf.90c321973ba209e0283bdbdd3d9d7a28` |
| `ZOHO_ORG_ID` | `860600477` |

Após adicionar, clique em **Redeploy**.

## Funcionalidades

- Listagem de todos os chamados do departamento Facilities
- Filtro por status: Aberto, Em andamento, Aguardando, Resolvido
- Busca por assunto em tempo real
- Cards com: número, status, solicitante, responsável, data, última atualização
- Modal de detalhes com link direto para o Zoho Desk
- Atualização manual via botão refresh
