# 📦 Sistema WMS - Data Warehouse Frontend

> Frontend React integrado com API Django para Warehouse Management System

[![React](https://img.shields.io/badge/React-18.3.1-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC)](https://tailwindcss.com/)
[![vite](https://img.shields.io/badge/vite-7.2-D689E8)]([https://vite.org/](https://vite.dev/))

## 🎯 Visão Geral

Este é o **frontend React** do sistema WMS, integrado com o [backend Django + Neo4j](https://github.com/JoaoFlavio11/warehouse-api).

### Principais Funcionalidades

✅ Dashboard de Warehouses com estatísticas em tempo real  
✅ Gerenciamento completo de produtos e estoque    
✅ Histórico de movimentações de estoque  
✅ Autenticação via Firebase  
✅ API REST integrada com React Query  

---

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+ e npm
- Backend rodando em http://localhost:8000 ([veja aqui](https://github.com/JoaoFlavio11/warehouse-api))
- Projeto Firebase configurado

### Instalação

```bash
# Clone o repositório
git clone https://github.com/JoaoFlavio11/data-warehouse.git
cd data-warehouse

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp docs/.env.example .env.local
# Edite .env.local com suas credenciais

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse: http://localhost:3000

---

## 🏗️ Arquitetura

```
Frontend (React)
├── Components
│   ├── WarehouseDashboard
│   ├── ProductsList
│
├── Services/API
│   ├── warehouse.ts ──────────> Backend API
│
├── Hooks (React Query)
│   ├── useWarehouse
│
└── Types (TypeScript)
    ├── warehouse.ts

```

---

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── warehouse/      # Componentes de warehouse
│   └── ui/            # Componentes UI (shadcn)
│
├── services/
│   └── api/           # Clients da API
│       ├── client.ts       # Axios configurado
│       ├── warehouse.ts    # Warehouse endpoints
│
├── hooks/             # Custom hooks
│   ├── useWarehouse.ts
│
├── types/             # TypeScript types
│   ├── warehouse.ts
│
├── pages/             # Páginas
│   ├── Index.tsx
│   └── NotFound.tsx
│
└── lib/               # Utilitários
    └── utils.ts
```

---

## 🛠️ Stack Tecnológico

### Core
- **React 18.3.1** - UI Library
- **TypeScript** - Type Safety
- **Vite** - Dev Server

### UI & Styling
- **TailwindCSS** - Utility-first CSS
- **shadcn/ui** - Componentes UI
- **Lucide React** - Ícones

### Data Fetching & State
- **React Query (TanStack Query)** - Server state management
- **Axios** - HTTP client

### Forms & Validation
- **React Hook Form** - Formulários performáticos
- **Zod** - Schema validation

### Auth
- **Firebase SDK** - Autenticação

---

## 🔌 API

### Configuração

Todas as chamadas de API são gerenciadas através do Axios client configurado:

```typescript
// src/services/api/client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
});

// Interceptor para adicionar token Firebase
apiClient.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('firebaseToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Exemplo de Uso

```typescript
// Usando hook customizado
import { useWarehouses } from '@/hooks/useWarehouse';

function Dashboard() {
  const { data: warehouses, isLoading, error } = useWarehouses();
  
  if (isLoading) return <Skeleton />;
  if (error) return <Error />;
  
  return (
    <div>
      {warehouses.map(warehouse => (
        <WarehouseCard key={warehouse.uid} warehouse={warehouse} />
      ))}
    </div>
  );
}
```

---

## 🔐 Autenticação

O sistema usa **Firebase Authentication**. Configure as credenciais em `.env.local`:

---

## 🧪 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento

# Build
npm run build           # Build para produção
npm run preview         # Preview do build

# Qualidade de Código
npm run lint            # Verifica problemas no código
npm run type-check      # Verifica tipos TypeScript
```

---

## 🔗 Repositórios Relacionados

- **Backend API**: [warehouse-api](https://github.com/JoaoFlavio11/warehouse-api)
- **Frontend**: [data-warehouse](https://github.com/JoaoFlavio11/data-warehouse) (este repo)

---

## 👨‍💻 Autor

**João Flávio**
- GitHub: [@JoaoFlavio11](https://github.com/JoaoFlavio11)

---

## 🗺️ Roadmap

- [x] ✅ Dashboard de warehouses
- [x] ✅ Gerenciamento de produtos
- [x] ✅ Controle de estoque
- [x] ✅ Sistema de pedidos
- [x] ✅ Analytics dashboard
- [x] ✅ Real-time updates
- [x] ✅ Relatórios em PDF

**Legenda**: ✅ Implementado | 🚧 Em desenvolvimento | 📅 Planejado

---

**Última atualização**: dezembro 2025
