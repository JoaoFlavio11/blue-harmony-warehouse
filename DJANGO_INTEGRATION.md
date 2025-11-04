# 🔧 Guia de Integração Frontend + Django Backend

## ✅ Correções Aplicadas

1. **URLs corrigidas**: Removida duplicação de `/api` nos endpoints
2. **API Client configurado**: Aponta para `http://localhost:8000/api`
3. **Firebase Auth integrado**: Token JWT é enviado em todas as requisições

---

## 📋 Checklist de Configuração do Backend Django

### 1. CORS (Cross-Origin Resource Sharing)

O Django precisa permitir requisições do frontend. Verifique o arquivo `settings.py`:

```python
# settings.py

INSTALLED_APPS = [
    # ...
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # ANTES do CommonMiddleware!
    'django.middleware.common.CommonMiddleware',
    # ...
]

# Desenvolvimento
CORS_ALLOW_ALL_ORIGINS = True  # OU especifique:
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Frontend Vite
    "http://127.0.0.1:5173",
]

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]
```

**Instale o django-cors-headers:**
```bash
pip install django-cors-headers
```

---

### 2. Autenticação Firebase no Backend

O backend precisa validar o token JWT do Firebase. Crie um middleware de autenticação:

```python
# middleware/firebase_auth.py

import firebase_admin
from firebase_admin import auth, credentials
from django.http import JsonResponse
from functools import wraps

# Inicializar Firebase Admin SDK
if not firebase_admin._apps:
    cred = credentials.Certificate('path/to/serviceAccountKey.json')
    firebase_admin.initialize_app(cred)

def firebase_required(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        
        if not auth_header.startswith('Bearer '):
            return JsonResponse({'error': 'Token não fornecido'}, status=401)
        
        token = auth_header.split('Bearer ')[1]
        
        try:
            decoded_token = auth.verify_id_token(token)
            request.user_uid = decoded_token['uid']
            request.user_email = decoded_token.get('email')
            return view_func(request, *args, **kwargs)
        except Exception as e:
            return JsonResponse({'error': f'Token inválido: {str(e)}'}, status=401)
    
    return wrapper
```

**Aplicar nas views:**
```python
from .middleware.firebase_auth import firebase_required

@firebase_required
def create_warehouse(request):
    # request.user_uid contém o ID do usuário
    # request.user_email contém o email do usuário
    pass
```

---

### 3. Estrutura de URLs Esperada

O frontend espera estas rotas no Django:

```python
# urls.py

urlpatterns = [
    # Warehouses
    path('api/warehouses/', views.warehouses_list_create),
    path('api/warehouses/<str:id>/', views.warehouse_detail),
    
    # Zones
    path('api/zones/', views.zones_list_create),
    path('api/zones/<str:id>/', views.zone_detail),
    path('api/warehouses/<str:warehouse_id>/zones/', views.warehouse_zones),
    
    # Bins
    path('api/bins/', views.bins_list_create),
    path('api/bins/<str:id>/', views.bin_detail),
    path('api/shelves/<str:shelf_id>/bins/', views.shelf_bins),
    
    # Products
    path('api/products/', views.products_list_create),
    path('api/products/<str:id>/', views.product_detail),
    
    # Orders
    path('api/orders/', views.orders_list_create),
    path('api/orders/<str:id>/', views.order_detail),
    
    # Routes
    path('api/routes/', views.routes_list_create),
    path('api/routes/<str:id>/', views.route_detail),
    path('api/routing/picking-route/', views.optimize_picking_route),
    
    # Dashboard
    path('api/dashboard/stats/', views.dashboard_stats),
    
    # Analytics
    path('api/analytics/', views.analytics),
]
```

---

### 4. Exemplo de View com Firebase Auth

```python
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .middleware.firebase_auth import firebase_required
import json

@csrf_exempt
@require_http_methods(["GET", "POST"])
@firebase_required
def warehouses_list_create(request):
    if request.method == 'GET':
        # Buscar armazéns do Neo4j
        warehouses = get_warehouses_from_neo4j()
        return JsonResponse(warehouses, safe=False)
    
    elif request.method == 'POST':
        data = json.loads(request.body)
        # Adicionar user_uid aos dados
        data['created_by'] = request.user_uid
        
        # Salvar no Neo4j
        warehouse = create_warehouse_in_neo4j(data)
        return JsonResponse(warehouse, status=201)
```

---

## 🧪 Como Testar

### 1. Verificar se o Backend está rodando
```bash
cd warehouse-api
python manage.py runserver
```

### 2. Testar endpoint sem auth (para CORS)
```bash
curl http://localhost:8000/api/warehouses/
```

**Esperado**: Se CORS estiver OK, deve retornar dados ou erro 401 (não autorizado)

### 3. Testar com token Firebase

No navegador, após fazer login:
```javascript
// No console do navegador
console.log(localStorage.getItem('auth_token'))
```

Copie o token e teste:
```bash
curl -H "Authorization: Bearer SEU_TOKEN_AQUI" http://localhost:8000/api/warehouses/
```

---

## 🐛 Problemas Comuns

### "Failed to fetch"
- ✅ Verifique se o backend está rodando em `http://localhost:8000`
- ✅ Verifique se o CORS está configurado
- ✅ Verifique o console do navegador para erros mais detalhados

### "401 Unauthorized"
- ✅ Verifique se o Firebase Admin SDK está inicializado
- ✅ Verifique se o token está sendo enviado corretamente
- ✅ Verifique os logs do Django para detalhes do erro

### "CORS Error"
- ✅ Instale `django-cors-headers`
- ✅ Adicione ao INSTALLED_APPS e MIDDLEWARE
- ✅ Configure CORS_ALLOWED_ORIGINS

---

## 📝 Variáveis de Ambiente Frontend

Crie o arquivo `.env` na raiz do frontend:

```env
# Django Backend API
VITE_API_BASE_URL=http://localhost:8000/api

# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

---

## ✨ Próximos Passos

1. Configure o CORS no Django
2. Implemente autenticação Firebase no backend
3. Teste os endpoints com token
4. Configure o `.env` no frontend
5. Teste a criação de um armazém

**Dica**: Comece testando sem autenticação (comentando `@firebase_required`) para garantir que o CORS está OK, depois adicione a autenticação.
