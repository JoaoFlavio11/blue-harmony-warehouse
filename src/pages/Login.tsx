import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { 
  Warehouse, 
  Loader2, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  CheckCircle2 
} from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login, signup, isAuthenticated } = useAuth();
  
  // Estados do Formulário
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Campos
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Redirecionar se já estiver logado
  if (isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignup) {
        // Validação básica de senha no Frontend
        if (password !== confirmPassword) {
          toast.error('As senhas não coincidem.');
          setIsLoading(false);
          return;
        }

        if (password.length < 6) {
          toast.error('A senha deve ter pelo menos 6 caracteres.');
          setIsLoading(false);
          return;
        }

        // Passando o nome, caso seu AuthContext suporte. 
        // Se não suportar, pode remover o argumento 'name'.
        await signup(email, password, name); 
        toast.success('Conta criada com sucesso! Bem-vindo.');
      } else {
        await login(email, password);
        toast.success('Login realizado com sucesso!');
      }
      navigate('/dashboard');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Erro ao processar solicitação.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setPassword('');
    setConfirmPassword('');
    // Opcional: Limpar erros ou estados
  };

  return (
    <div className="w-full h-screen lg:grid lg:grid-cols-2 overflow-hidden">
      
      {/* LADO ESQUERDO: Branding e Visual (Apenas Desktop) */}
      <div className="hidden lg:flex flex-col justify-between bg-zinc-900 text-white p-10 relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
        
        {/* Logo / Marca */}
        <div className="relative z-10 flex items-center gap-2 font-bold text-2xl">
          <div className="bg-primary p-2 rounded-lg">
            <Warehouse className="h-6 w-6 text-primary-foreground" />
          </div>
          <span>EasyRoute WMS</span>
        </div>

        {/* Depoimento ou Frase de Impacto */}
        <div className="relative z-10 max-w-md">
          <blockquote className="space-y-2">
            <p className="text-lg font-medium leading-relaxed">
              "A otimização logística começa com um sistema inteligente. 
              Gerencie seu estoque, reduza perdas e aumente a eficiência do seu armazém."
            </p>
            <footer className="text-sm text-zinc-400">
              &copy; 2025 EasyRoute Systems
            </footer>
          </blockquote>
        </div>
      </div>

      {/* LADO DIREITO: Formulário */}
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="mx-auto w-full max-w-[400px] flex flex-col justify-center space-y-6">
          
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              {isSignup ? 'Crie sua conta' : 'Bem-vindo de volta'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isSignup 
                ? 'Preencha os dados abaixo para começar a gerenciar seu armazém.' 
                : 'Entre com suas credenciais para acessar o painel.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Campo Nome (Apenas Signup) */}
            {isSignup && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-300">
                <Label htmlFor="name">Nome Completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="Ex: João da Silva"
                    className="pl-9"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={isSignup}
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}

            {/* Campo Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Corporativo</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nome@empresa.com"
                  className="pl-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Campo Senha */}
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-9 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Campo Confirmar Senha (Apenas Signup) */}
            {isSignup && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-300">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <div className="relative">
                  <CheckCircle2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className="pl-9"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required={isSignup}
                    disabled={isLoading}
                  />
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-red-500 font-medium ml-1">
                    As senhas não coincidem
                  </p>
                )}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSignup ? 'Criar Conta' : 'Entrar na Plataforma'}
            </Button>
          </form>

          {/* Rodapé do Form */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Ou
              </span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {isSignup ? "Já possui uma conta? " : "Ainda não tem acesso? "}
              <button
                onClick={toggleMode}
                className="font-medium text-primary hover:underline underline-offset-4"
                disabled={isLoading}
              >
                {isSignup ? "Fazer Login" : "Cadastrar-se"}
              </button>
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}