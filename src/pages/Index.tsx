import { useState } from 'react';
import { useProducts, useCreateProduct, useDeleteProduct } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Plus, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { Product } from '@/services/warehouseService';

const Index = () => {
  const { data: products, isLoading, error, isError } = useProducts();
  const createProduct = useCreateProduct();
  const deleteProduct = useDeleteProduct();

  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    description: '',
    quantity: 0,
    price: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || newProduct.quantity < 0 || newProduct.price < 0) {
      return;
    }
    await createProduct.mutateAsync(newProduct);
    setNewProduct({ name: '', description: '', quantity: 0, price: 0 });
  };

  const handleDelete = async (id: number | undefined) => {
    if (!id) return;
    if (window.confirm('Tem certeza que deseja deletar este produto?')) {
      await deleteProduct.mutateAsync(id);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Warehouse Manager</h1>
          <p className="text-muted-foreground">Teste de integração Frontend + Backend Django</p>
        </div>

        {/* Status de Conexão */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isError ? (
                <>
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  Status: Erro de Conexão
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Status: Conectado
                </>
              )}
            </CardTitle>
            <CardDescription>
              {isError 
                ? `Erro: ${error?.message}. Verifique se o backend Django está rodando em http://localhost:8000`
                : 'Backend Django conectado com sucesso!'}
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Formulário de Criação */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Novo Produto
              </CardTitle>
              <CardDescription>Adicione um novo produto ao estoque</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="Nome do produto"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    placeholder="Descrição do produto"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quantity">Quantidade</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="0"
                      value={newProduct.quantity}
                      onChange={(e) => setNewProduct({ ...newProduct, quantity: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Preço</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" disabled={createProduct.isPending} className="w-full">
                  {createProduct.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Criar Produto
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Lista de Produtos */}
          <Card>
            <CardHeader>
              <CardTitle>Produtos</CardTitle>
              <CardDescription>
                {isLoading ? 'Carregando...' : `${products?.length || 0} produtos cadastrados`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : products && products.length > 0 ? (
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold">{product.name}</h3>
                        {product.description && (
                          <p className="text-sm text-muted-foreground">{product.description}</p>
                        )}
                        <div className="flex gap-4 mt-1 text-sm">
                          <span>Qtd: {product.quantity}</span>
                          <span>R$ {product.price.toFixed(2)}</span>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(product.id)}
                        disabled={deleteProduct.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum produto cadastrado
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
