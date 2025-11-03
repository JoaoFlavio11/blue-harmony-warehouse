# 🔥 Configuração do Firebase Authentication

Este guia mostra como configurar o Firebase para autenticação no seu projeto WMS.

## 📋 Passo a Passo

### 1. Criar/Acessar Projeto Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto" (ou selecione um existente)
3. Dê um nome ao projeto (ex: "warehouse-wms")
4. Siga os passos de criação (pode desabilitar Google Analytics se quiser)

### 2. Adicionar Web App ao Projeto

1. No painel do projeto, clique no ícone `</>` (Web)
2. Registre o app com um apelido (ex: "WMS Frontend")
3. **NÃO** precisa configurar Firebase Hosting
4. Clique em "Registrar app"

### 3. Copiar Credenciais

Você verá um código similar a este:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456"
};
```

### 4. Configurar Variáveis de Ambiente

1. Crie um arquivo `.env` na raiz do projeto (copie do `.env.example`)
2. Cole as credenciais do Firebase:

```bash
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abc123def456
```

### 5. Habilitar Email/Password Authentication

1. No Firebase Console, vá em **Authentication** no menu lateral
2. Clique na aba **Sign-in method**
3. Clique em **Email/Password**
4. **Ative** o provedor "Email/Password"
5. Clique em **Salvar**

### 6. (Opcional) Configurar Domínio Autorizado

Se estiver usando um domínio customizado:

1. Em **Authentication** > **Settings**
2. Role até **Authorized domains**
3. Adicione seu domínio de produção

### 7. Testar a Aplicação

1. Reinicie o servidor de desenvolvimento (se estiver rodando)
2. Acesse `/login` na sua aplicação
3. Tente criar uma conta com email/senha
4. Faça login com as credenciais criadas

## ✅ Verificação

Se tudo estiver correto, você deve ver no console:
- `✅ Conta criada com sucesso: seu@email.com` ao criar conta
- `✅ Login bem-sucedido: seu@email.com` ao fazer login

## ❌ Erros Comuns

### "Firebase não configurado"
- Verifique se o arquivo `.env` existe
- Verifique se as variáveis começam com `VITE_`
- Reinicie o servidor de desenvolvimento

### "API key not valid"
- Confirme que copiou a API Key corretamente do Firebase Console
- Não deixe espaços extras nas variáveis do `.env`

### "Email already in use"
- Normal! O usuário já foi cadastrado
- Tente fazer login ou use outro email

### "Email/Password não habilitado"
- Vá em Authentication > Sign-in method
- Certifique-se que Email/Password está ATIVO

## 📚 Recursos Adicionais

- [Documentação Firebase Auth](https://firebase.google.com/docs/auth)
- [Gerenciar Usuários](https://console.firebase.google.com/) → Authentication → Users
- [Ver Logs](https://console.firebase.google.com/) → Logs Explorer

## 🔒 Segurança

⚠️ **IMPORTANTE:**
- Nunca commite o arquivo `.env` no Git
- O `.env` já está no `.gitignore`
- Em produção, configure as variáveis no seu serviço de hosting
