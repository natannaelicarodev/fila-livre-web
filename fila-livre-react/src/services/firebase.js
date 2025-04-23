import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  getDocs,
  limit,
  deleteDoc,
  increment
} from 'firebase/firestore';

// Configuração do Firebase
// Substitua com suas próprias credenciais do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDR7zPawkqWmIybh672UUf93ncXwu0V-Zk",
  authDomain: "fila-livre-app-web.firebaseapp.com",
  projectId: "fila-livre-app-web",
  storageBucket: "fila-livre-app-web.firebasestorage.app",
  messagingSenderId: "880169215160",
  appId: "1:880169215160:web:64d7a397485c64c026004d",
  measurementId: "G-Q2523TXSHB"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Classe de erro personalizada para autenticação
export class AuthError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.name = 'AuthError';
  }
}

// Classe de erro personalizada para operações de fila
export class QueueError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.name = 'QueueError';
  }
}

// Classe de erro personalizada para operações de estabelecimento
export class EstablishmentError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.name = 'EstablishmentError';
  }
}

// ===== FUNÇÕES DE AUTENTICAÇÃO =====

export const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Atualizar último login
    await updateDoc(doc(db, 'users', userCredential.user.uid), {
      lastLogin: serverTimestamp()
    });
    
    return { user: userCredential.user, error: null };
  } catch (error) {
    console.error('Erro de login:', error);
    
    // Traduzir códigos de erro do Firebase para mensagens amigáveis
    let errorMessage = 'Ocorreu um erro ao fazer login. Tente novamente.';
    let errorCode = error.code || 'auth/unknown';
    
    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        errorMessage = 'Email ou senha incorretos.';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Muitas tentativas de login. Tente novamente mais tarde.';
        break;
      case 'auth/user-disabled':
        errorMessage = 'Esta conta foi desativada.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Email inválido.';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
        break;
      default:
        if (error.message) {
          errorMessage = error.message;
        }
    }
    
    throw new AuthError(errorCode, errorMessage);
  }
};

export const signInWithGoogle = async () => {
  try {
    // Configurar o provedor Google para solicitar mais permissões
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });
    
    const userCredential = await signInWithPopup(auth, googleProvider);
    
    // Verificar se o usuário já existe no Firestore
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    
    // Se o usuário não existir, criar um documento para ele
    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: userCredential.user.email,
        displayName: userCredential.user.displayName || '',
        photoURL: userCredential.user.photoURL || '',
        role: 'user',
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      });
    } else {
      // Atualizar último login
      await updateDoc(doc(db, 'users', userCredential.user.uid), {
        lastLogin: serverTimestamp()
      });
    }
    
    return { user: userCredential.user, error: null };
  } catch (error) {
    console.error('Erro de login com Google:', error);
    
    // Traduzir códigos de erro do Firebase para mensagens amigáveis
    let errorMessage = 'Ocorreu um erro ao fazer login com Google. Tente novamente.';
    let errorCode = error.code || 'auth/unknown';
    
    switch (error.code) {
      case 'auth/popup-closed-by-user':
        errorMessage = 'O popup de login foi fechado antes da conclusão.';
        break;
      case 'auth/cancelled-popup-request':
        errorMessage = 'A solicitação de login foi cancelada.';
        break;
      case 'auth/popup-blocked':
        errorMessage = 'O popup de login foi bloqueado pelo navegador.';
        break;
      case 'auth/account-exists-with-different-credential':
        errorMessage = 'Já existe uma conta com este email, mas com outro método de login.';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
        break;
      default:
        if (error.message) {
          errorMessage = error.message;
        }
    }
    
    throw new AuthError(errorCode, errorMessage);
  }
};

export const signUpWithEmail = async (email, password, userData = {}) => {
  try {
    // Validar dados antes de criar o usuário
    if (!email || !password) {
      throw new AuthError('auth/invalid-input', 'Email e senha são obrigatórios.');
    }
    
    if (password.length < 6) {
      throw new AuthError('auth/weak-password', 'A senha deve ter pelo menos 6 caracteres.');
    }
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Atualizar perfil do usuário se houver dados adicionais
    if (userData.displayName) {
      await updateProfile(userCredential.user, {
        displayName: userData.displayName
      });
    }
    
    // Criar documento do usuário no Firestore com dados adicionais
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email: userCredential.user.email,
      displayName: userData.displayName || '',
      role: userData.role || 'user',
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      ...userData // Incluir outros dados fornecidos
    });
    
    // Se houver dados de estabelecimento, criar um documento para ele
    if (userData.establishmentName) {
      await createEstablishment({
        name: userData.establishmentName,
        ownerId: userCredential.user.uid
      });
    }
    
    return { user: userCredential.user, error: null };
  } catch (error) {
    console.error('Erro de registro:', error);
    
    // Se já for um AuthError, apenas repassar
    if (error instanceof AuthError) {
      throw error;
    }
    
    // Traduzir códigos de erro do Firebase para mensagens amigáveis
    let errorMessage = 'Ocorreu um erro ao criar sua conta. Tente novamente.';
    let errorCode = error.code || 'auth/unknown';
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'Este email já está em uso. Tente fazer login ou use outro email.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Email inválido.';
        break;
      case 'auth/weak-password':
        errorMessage = 'A senha é muito fraca. Use pelo menos 6 caracteres.';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
        break;
      default:
        if (error.message) {
          errorMessage = error.message;
        }
    }
    
    throw new AuthError(errorCode, errorMessage);
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    throw new AuthError('auth/sign-out-failed', 'Erro ao fazer logout. Tente novamente.');
  }
};

export const resetPassword = async (email) => {
  try {
    if (!email) {
      throw new AuthError('auth/invalid-input', 'Email é obrigatório.');
    }
    
    await sendPasswordResetEmail(auth, email);
    return { success: true, error: null };
  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    
    // Traduzir códigos de erro do Firebase para mensagens amigáveis
    let errorMessage = 'Ocorreu um erro ao enviar o email de redefinição. Tente novamente.';
    let errorCode = error.code || 'auth/unknown';
    
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'Não encontramos uma conta com este email.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Email inválido.';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Muitas tentativas. Tente novamente mais tarde.';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
        break;
      default:
        if (error.message) {
          errorMessage = error.message;
        }
    }
    
    throw new AuthError(errorCode, errorMessage);
  }
};

// Função para verificar o estado de autenticação atual
export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      unsubscribe();
      resolve(user);
    }, error => {
      reject(error);
    });
  });
};

// Função para atualizar o perfil do usuário
export const updateUserProfile = async (userData) => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      throw new AuthError('auth/no-current-user', 'Nenhum usuário autenticado.');
    }
    
    // Atualizar perfil no Auth
    if (userData.displayName || userData.photoURL) {
      await updateProfile(user, {
        displayName: userData.displayName || user.displayName,
        photoURL: userData.photoURL || user.photoURL
      });
    }
    
    // Atualizar dados no Firestore
    await updateDoc(doc(db, 'users', user.uid), {
      ...userData,
      updatedAt: serverTimestamp()
    });
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    
    // Se já for um AuthError, apenas repassar
    if (error instanceof AuthError) {
      throw error;
    }
    
    throw new AuthError('auth/update-profile-failed', 'Erro ao atualizar perfil. Tente novamente.');
  }
};

// ===== FUNÇÕES DE ESTABELECIMENTO =====

// Criar um novo estabelecimento
export const createEstablishment = async (establishmentData) => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      throw new EstablishmentError('establishment/no-current-user', 'Nenhum usuário autenticado.');
    }
    
    if (!establishmentData.name) {
      throw new EstablishmentError('establishment/invalid-data', 'Nome do estabelecimento é obrigatório.');
    }
    
    // Verificar se o usuário já tem um estabelecimento
    const existingEstablishmentsQuery = query(
      collection(db, 'establishments'),
      where('ownerId', '==', user.uid)
    );
    
    const existingEstablishments = await getDocs(existingEstablishmentsQuery);
    
    if (!existingEstablishments.empty) {
      throw new EstablishmentError(
        'establishment/already-exists',
        'Você já possui um estabelecimento cadastrado.'
      );
    }
    
    // Criar o estabelecimento
    const establishmentRef = await addDoc(collection(db, 'establishments'), {
      name: establishmentData.name,
      ownerId: user.uid,
      address: establishmentData.address || '',
      phone: establishmentData.phone || '',
      category: establishmentData.category || '',
      description: establishmentData.description || '',
      openingHours: establishmentData.openingHours || {},
      logo: establishmentData.logo || '',
      status: 'active',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    // Atualizar o usuário com o ID do estabelecimento
    await updateDoc(doc(db, 'users', user.uid), {
      establishmentId: establishmentRef.id,
      role: 'owner',
      updatedAt: serverTimestamp()
    });
    
    return {
      id: establishmentRef.id,
      ...establishmentData,
      ownerId: user.uid,
      status: 'active'
    };
  } catch (error) {
    console.error('Erro ao criar estabelecimento:', error);
    
    // Se já for um EstablishmentError, apenas repassar
    if (error instanceof EstablishmentError) {
      throw error;
    }
    
    throw new EstablishmentError(
      'establishment/creation-failed',
      'Erro ao criar estabelecimento. Tente novamente.'
    );
  }
};

// Atualizar um estabelecimento existente
export const updateEstablishment = async (establishmentId, establishmentData) => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      throw new EstablishmentError('establishment/no-current-user', 'Nenhum usuário autenticado.');
    }
    
    // Verificar se o estabelecimento existe e pertence ao usuário
    const establishmentDoc = await getDoc(doc(db, 'establishments', establishmentId));
    
    if (!establishmentDoc.exists()) {
      throw new EstablishmentError('establishment/not-found', 'Estabelecimento não encontrado.');
    }
    
    const establishmentData = establishmentDoc.data();
    
    if (establishmentData.ownerId !== user.uid) {
      throw new EstablishmentError(
        'establishment/permission-denied',
        'Você não tem permissão para atualizar este estabelecimento.'
      );
    }
    
    // Atualizar o estabelecimento
    await updateDoc(doc(db, 'establishments', establishmentId), {
      ...establishmentData,
      updatedAt: serverTimestamp()
    });
    
    return {
      id: establishmentId,
      ...establishmentData,
      updatedAt: new Date()
    };
  } catch (error) {
    console.error('Erro ao atualizar estabelecimento:', error);
    
    // Se já for um EstablishmentError, apenas repassar
    if (error instanceof EstablishmentError) {
      throw error;
    }
    
    throw new EstablishmentError(
      'establishment/update-failed',
      'Erro ao atualizar estabelecimento. Tente novamente.'
    );
  }
};

// Obter estabelecimento por ID
export const getEstablishment = async (establishmentId) => {
  try {
    if (!establishmentId) {
      throw new EstablishmentError('establishment/invalid-id', 'ID do estabelecimento é obrigatório.');
    }
    
    const establishmentDoc = await getDoc(doc(db, 'establishments', establishmentId));
    
    if (!establishmentDoc.exists()) {
      throw new EstablishmentError('establishment/not-found', 'Estabelecimento não encontrado.');
    }
    
    return {
      id: establishmentDoc.id,
      ...establishmentDoc.data()
    };
  } catch (error) {
    console.error('Erro ao buscar estabelecimento:', error);
    
    // Se já for um EstablishmentError, apenas repassar
    if (error instanceof EstablishmentError) {
      throw error;
    }
    
    throw new EstablishmentError(
      'establishment/fetch-failed',
      'Erro ao buscar estabelecimento. Tente novamente.'
    );
  }
};

// Obter estabelecimento do usuário atual
export const getUserEstablishment = async () => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      throw new EstablishmentError('establishment/no-current-user', 'Nenhum usuário autenticado.');
    }
    
    // Buscar estabelecimentos do usuário
    const establishmentsQuery = query(
      collection(db, 'establishments'),
      where('ownerId', '==', user.uid),
      limit(1)
    );
    
    const establishmentsSnapshot = await getDocs(establishmentsQuery);
    
    if (establishmentsSnapshot.empty) {
      return null; // Usuário não tem estabelecimento
    }
    
    const establishmentDoc = establishmentsSnapshot.docs[0];
    
    return {
      id: establishmentDoc.id,
      ...establishmentDoc.data()
    };
  } catch (error) {
    console.error('Erro ao buscar estabelecimento:', error);
    
    // Se já for um EstablishmentError, apenas repassar
    if (error instanceof EstablishmentError) {
      throw error;
    }
    
    throw new EstablishmentError(
      'establishment/fetch-failed',
      'Erro ao buscar estabelecimento. Tente novamente.'
    );
  }
};

// ===== FUNÇÕES DE FILA =====

// Criar uma nova fila
export const createQueue = async (queueData) => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      throw new QueueError('queue/no-current-user', 'Nenhum usuário autenticado.');
    }
    
    if (!queueData.name) {
      throw new QueueError('queue/invalid-data', 'Nome da fila é obrigatório.');
    }
    
    // Buscar o estabelecimento do usuário
    const establishment = await getUserEstablishment();
    
    if (!establishment) {
      throw new QueueError(
        'queue/no-establishment',
        'Você precisa criar um estabelecimento antes de criar uma fila.'
      );
    }
    
    // Criar a fila
    const queueRef = await addDoc(collection(db, 'queues'), {
      name: queueData.name,
      establishmentId: establishment.id,
      description: queueData.description || '',
      estimatedTimePerCustomer: queueData.estimatedTimePerCustomer || 10, // em minutos
      status: 'active',
      currentNumber: 0,
      customersWaiting: 0,
      customersAttended: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return {
      id: queueRef.id,
      ...queueData,
      establishmentId: establishment.id,
      status: 'active',
      currentNumber: 0,
      customersWaiting: 0,
      customersAttended: 0
    };
  } catch (error) {
    console.error('Erro ao criar fila:', error);
    
    // Se já for um QueueError, apenas repassar
    if (error instanceof QueueError) {
      throw error;
    }
    
    throw new QueueError('queue/creation-failed', 'Erro ao criar fila. Tente novamente.');
  }
};

// Obter fila ativa de um estabelecimento
export const getEstablishmentActiveQueue = async (establishmentId) => {
  try {
    if (!establishmentId) {
      throw new QueueError('queue/invalid-establishment-id', 'ID do estabelecimento é obrigatório.');
    }
    
    // Buscar filas ativas do estabelecimento
    const queuesQuery = query(
      collection(db, 'queues'),
      where('establishmentId', '==', establishmentId),
      where('status', '==', 'active'),
      limit(1)
    );
    
    const queuesSnapshot = await getDocs(queuesQuery);
    
    if (queuesSnapshot.empty) {
      return null; // Estabelecimento não tem fila ativa
    }
    
    const queueDoc = queuesSnapshot.docs[0];
    
    return {
      id: queueDoc.id,
      ...queueDoc.data()
    };
  } catch (error) {
    console.error('Erro ao buscar fila ativa:', error);
    
    // Se já for um QueueError, apenas repassar
    if (error instanceof QueueError) {
      throw error;
    }
    
    throw new QueueError('queue/fetch-failed', 'Erro ao buscar fila ativa. Tente novamente.');
  }
};

// Adicionar cliente à fila
export const addCustomerToQueue = async (queueId, customerData) => {
  try {
    // Verificar se a fila existe
    const queueDoc = await getDoc(doc(db, 'queues', queueId));
    
    if (!queueDoc.exists()) {
      throw new QueueError('queue/not-found', 'Fila não encontrada.');
    }
    
    const queueData = queueDoc.data();
    
    if (queueData.status !== 'active') {
      throw new QueueError('queue/inactive', 'Esta fila não está ativa no momento.');
    }
    
    // Incrementar o número da fila
    const newNumber = queueData.currentNumber + 1;
    
    // Adicionar cliente à fila
    const customerRef = await addDoc(collection(db, 'queue_items'), {
      queueId,
      establishmentId: queueData.establishmentId,
      name: customerData.name || 'Cliente',
      phone: customerData.phone || '',
      email: customerData.email || '',
      number: newNumber,
      status: 'waiting',
      entryTime: serverTimestamp(),
      waitTime: 0,
      serviceTime: 0,
      notes: customerData.notes || ''
    });
    
    // Atualizar contadores da fila
    await updateDoc(doc(db, 'queues', queueId), {
      currentNumber: newNumber,
      customersWaiting: increment(1),
      updatedAt: serverTimestamp()
    });
    
    return {
      id: customerRef.id,
      queueId,
      number: newNumber,
      status: 'waiting',
      ...customerData
    };
  } catch (error) {
    console.error('Erro ao adicionar cliente à fila:', error);
    
    // Se já for um QueueError, apenas repassar
    if (error instanceof QueueError) {
      throw error;
    }
    
    throw new QueueError('queue/add-customer-failed', 'Erro ao adicionar cliente à fila. Tente novamente.');
  }
};

// Chamar próximo cliente da fila
export const callNextInQueue = async (queueId) => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      throw new QueueError('queue/no-current-user', 'Nenhum usuário autenticado.');
    }
    
    // Verificar se a fila existe
    const queueDoc = await getDoc(doc(db, 'queues', queueId));
    
    if (!queueDoc.exists()) {
      throw new QueueError('queue/not-found', 'Fila não encontrada.');
    }
    
    // Buscar o próximo cliente na fila (o mais antigo com status 'waiting')
    const waitingCustomersQuery = query(
      collection(db, 'queue_items'),
      where('queueId', '==', queueId),
      where('status', '==', 'waiting'),
      orderBy('number', 'asc'),
      limit(1)
    );
    
    const waitingCustomersSnapshot = await getDocs(waitingCustomersQuery);
    
    if (waitingCustomersSnapshot.empty) {
      throw new QueueError('queue/empty', 'Não há clientes na fila.');
    }
    
    const customerDoc = waitingCustomersSnapshot.docs[0];
    const customerData = customerDoc.data();
    
    // Atualizar status do cliente para 'attending'
    await updateDoc(doc(db, 'queue_items', customerDoc.id), {
      status: 'attending',
      callTime: serverTimestamp(),
      waitTime: serverTimestamp() - customerData.entryTime
    });
    
    // Atualizar contadores da fila
    await updateDoc(doc(db, 'queues', queueId), {
      customersWaiting: increment(-1),
      updatedAt: serverTimestamp()
    });
    
    return {
      id: customerDoc.id,
      ...customerData,
      status: 'attending'
    };
  } catch (error) {
    console.error('Erro ao chamar próximo cliente:', error);
    
    // Se já for um QueueError, apenas repassar
    if (error instanceof QueueError) {
      throw error;
    }
    
    throw new QueueError('queue/call-next-failed', 'Erro ao chamar próximo cliente. Tente novamente.');
  }
};

// Concluir atendimento de um cliente
export const completeQueueItem = async (queueItemId) => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      throw new QueueError('queue/no-current-user', 'Nenhum usuário autenticado.');
    }
    
    // Verificar se o item da fila existe
    const queueItemDoc = await getDoc(doc(db, 'queue_items', queueItemId));
    
    if (!queueItemDoc.exists()) {
      throw new QueueError('queue/item-not-found', 'Item da fila não encontrado.');
    }
    
    const queueItemData = queueItemDoc.data();
    
    if (queueItemData.status !== 'attending') {
      throw new QueueError('queue/invalid-status', 'Este cliente não está em atendimento.');
    }
    
    // Atualizar status do cliente para 'completed'
    await updateDoc(doc(db, 'queue_items', queueItemId), {
      status: 'completed',
      completionTime: serverTimestamp(),
      serviceTime: serverTimestamp() - queueItemData.callTime
    });
    
    // Atualizar contadores da fila
    await updateDoc(doc(db, 'queues', queueItemData.queueId), {
      customersAttended: increment(1),
      updatedAt: serverTimestamp()
    });
    
    return {
      id: queueItemId,
      ...queueItemData,
      status: 'completed'
    };
  } catch (error) {
    console.error('Erro ao concluir atendimento:', error);
    
    // Se já for um QueueError, apenas repassar
    if (error instanceof QueueError) {
      throw error;
    }
    
    throw new QueueError('queue/complete-failed', 'Erro ao concluir atendimento. Tente novamente.');
  }
};

// Assinar atualizações de uma fila
export const subscribeToQueue = (queueId, callback) => {
  try {
    // Assinar atualizações dos itens da fila
    const queueItemsQuery = query(
      collection(db, 'queue_items'),
      where('queueId', '==', queueId),
      orderBy('number', 'asc')
    );
    
    const unsubscribe = onSnapshot(queueItemsQuery, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      callback(items);
    }, (error) => {
      console.error('Erro ao assinar atualizações da fila:', error);
      callback([], error);
    });
    
    return unsubscribe;
  } catch (error) {
    console.error('Erro ao assinar atualizações da fila:', error);
    throw new QueueError('queue/subscribe-failed', 'Erro ao assinar atualizações da fila. Tente novamente.');
  }
};

// ===== FUNÇÕES DE ESTATÍSTICAS =====

// Obter estatísticas de um estabelecimento
export const getEstablishmentStatistics = async (establishmentId, period = 'day') => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      throw new EstablishmentError('establishment/no-current-user', 'Nenhum usuário autenticado.');
    }
    
    // Verificar se o estabelecimento existe e pertence ao usuário
    const establishmentDoc = await getDoc(doc(db, 'establishments', establishmentId));
    
    if (!establishmentDoc.exists()) {
      throw new EstablishmentError('establishment/not-found', 'Estabelecimento não encontrado.');
    }
    
    const establishmentData = establishmentDoc.data();
    
    if (establishmentData.ownerId !== user.uid) {
      throw new EstablishmentError(
        'establishment/permission-denied',
        'Você não tem permissão para acessar as estatísticas deste estabelecimento.'
      );
    }
    
    // Determinar a data de início com base no período
    const now = new Date();
    let startDate = new Date();
    
    switch (period) {
      case 'day':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(now.getDate() - now.getDay());
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'month':
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'year':
        startDate.setMonth(0, 1);
        startDate.setHours(0, 0, 0, 0);
        break;
      default:
        startDate.setHours(0, 0, 0, 0);
    }
    
    // Buscar estatísticas salvas
    const statisticsQuery = query(
      collection(db, 'statistics'),
      where('establishmentId', '==', establishmentId),
      where('date', '>=', startDate)
    );
    
    const statisticsSnapshot = await getDocs(statisticsQuery);
    
    // Processar estatísticas
    const statistics = statisticsSnapshot.docs.map(doc => doc.data());
    
    // Calcular totais
    const totals = statistics.reduce((acc, stat) => {
      acc.customersAttended += stat.customersAttended || 0;
      acc.averageWaitTime += stat.averageWaitTime || 0;
      acc.averageServiceTime += stat.averageServiceTime || 0;
      return acc;
    }, {
      customersAttended: 0,
      averageWaitTime: 0,
      averageServiceTime: 0
    });
    
    // Calcular médias
    if (statistics.length > 0) {
      totals.averageWaitTime /= statistics.length;
      totals.averageServiceTime /= statistics.length;
    }
    
    return {
      period,
      statistics,
      totals
    };
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    
    // Se já for um EstablishmentError, apenas repassar
    if (error instanceof EstablishmentError) {
      throw error;
    }
    
    throw new EstablishmentError(
      'establishment/statistics-failed',
      'Erro ao obter estatísticas. Tente novamente.'
    );
  }
};

// Salvar estatísticas de uma fila
export const saveQueueStatistics = async (queueId) => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      throw new QueueError('queue/no-current-user', 'Nenhum usuário autenticado.');
    }
    
    // Verificar se a fila existe
    const queueDoc = await getDoc(doc(db, 'queues', queueId));
    
    if (!queueDoc.exists()) {
      throw new QueueError('queue/not-found', 'Fila não encontrada.');
    }
    
    const queueData = queueDoc.data();
    
    // Buscar itens da fila concluídos hoje
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const completedItemsQuery = query(
      collection(db, 'queue_items'),
      where('queueId', '==', queueId),
      where('status', '==', 'completed'),
      where('completionTime', '>=', today)
    );
    
    const completedItemsSnapshot = await getDocs(completedItemsQuery);
    
    if (completedItemsSnapshot.empty) {
      throw new QueueError('queue/no-completed-items', 'Não há atendimentos concluídos hoje.');
    }
    
    // Calcular estatísticas
    const completedItems = completedItemsSnapshot.docs.map(doc => doc.data());
    
    const totalWaitTime = completedItems.reduce((acc, item) => acc + (item.waitTime || 0), 0);
    const totalServiceTime = completedItems.reduce((acc, item) => acc + (item.serviceTime || 0), 0);
    
    const averageWaitTime = totalWaitTime / completedItems.length;
    const averageServiceTime = totalServiceTime / completedItems.length;
    
    // Salvar estatísticas
    const dateStr = today.toISOString().split('T')[0];
    
    const statisticsRef = doc(db, 'statistics', `${queueId}_${dateStr}`);
    
    await setDoc(statisticsRef, {
      queueId,
      queueName: queueData.name,
      establishmentId: queueData.establishmentId,
      date: today,
      dateStr,
      customersAttended: completedItems.length,
      averageWaitTime,
      averageServiceTime,
      updatedAt: serverTimestamp()
    }, { merge: true });
    
    return {
      date: dateStr,
      customersAttended: completedItems.length,
      averageWaitTime,
      averageServiceTime
    };
  } catch (error) {
    console.error('Erro ao salvar estatísticas:', error);
    
    // Se já for um QueueError, apenas repassar
    if (error instanceof QueueError) {
      throw error;
    }
    
    throw new QueueError('queue/save-statistics-failed', 'Erro ao salvar estatísticas. Tente novamente.');
  }
};

// Exportar funções e objetos
export { auth, db };
