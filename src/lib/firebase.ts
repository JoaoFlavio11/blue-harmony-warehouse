import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Validar se as variáveis de ambiente estão configuradas
const requiredEnvVars = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const missingVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value)
  .map(([key]) => `VITE_FIREBASE_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}`);

if (missingVars.length > 0) {
  console.error('❌ FIREBASE: Variáveis de ambiente não configuradas:');
  console.error('   ' + missingVars.join('\n   '));
  console.error('\n📝 Siga os passos:');
  console.error('   1. Acesse: https://console.firebase.google.com/');
  console.error('   2. Crie/selecione seu projeto');
  console.error('   3. Vá em Project Settings > General');
  console.error('   4. Em "Your apps", adicione um Web App');
  console.error('   5. Copie as credenciais e cole no arquivo .env\n');
}

// Configuração do Firebase
const firebaseConfig = {
  apiKey: requiredEnvVars.apiKey || '',
  authDomain: requiredEnvVars.authDomain || '',
  projectId: requiredEnvVars.projectId || '',
  storageBucket: requiredEnvVars.storageBucket || '',
  messagingSenderId: requiredEnvVars.messagingSenderId || '',
  appId: requiredEnvVars.appId || '',
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o Firebase Auth
export const auth = getAuth(app);

export default app;
