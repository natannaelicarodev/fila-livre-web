import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  auth,
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail,
  signOutUser,
  resetPassword,
  getCurrentUser,
  updateUserProfile,
  getEstablishment,
  updateEstablishment,
  createEstablishment,
  getEstablishmentActiveQueue,
  createQueue,
  addCustomerToQueue,
  callNextInQueue,
  completeQueueItem,
  subscribeToQueue,
  getEstablishmentStatistics,
  saveQueueStatistics
} from '../services/firebase';

// Criar o contexto
const FirebaseContext = createContext(null);

// Hook para usar o contexto
export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase deve ser usado dentro de um FirebaseProvider');
  }
  return context;
};

// Provedor do contexto
export const FirebaseProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [establishment, setEstablishment] = useState(null);
  const [activeQueue, setActiveQueue] = useState(null);
  const [queueItems, setQueueItems] = useState([]);
  const [error, setError] = useState(null);

  // Verificar estado de autenticação ao carregar
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      try {
        if (authUser) {
          setUser(authUser);
          
          // Buscar estabelecimento do usuário
          try {
            const establishmentData = await getEstablishment(authUser.uid);
            setEstablishment(establishmentData);
            
            // Buscar fila ativa do estabelecimento
            if (establishmentData) {
              try {
                const queueData = await getEstablishmentActiveQueue(establishmentData.id);
                setActiveQueue(queueData);
                
                // Assinar atualizações da fila
                if (queueData) {
                  const unsubscribeQueue = subscribeToQueue(queueData.id, (items) => {
                    setQueueItems(items);
                  });
                  
                  // Limpar assinatura ao desmontar
                  return () => {
                    unsubscribeQueue();
                  };
                }
              } catch (queueError) {
                console.error('Erro ao buscar fila ativa:', queueError);
              }
            }
          } catch (establishmentError) {
            console.error('Erro ao buscar estabelecimento:', establishmentError);
          }
        } else {
          setUser(null);
          setEstablishment(null);
          setActiveQueue(null);
          setQueueItems([]);
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    });
    
    return () => unsubscribe();
  }, []);

  // Função de login
  const login = async (email, password) => {
    try {
      setLoading(true);
      const result = await signInWithEmail(email, password);
      return result;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Função de login com Google
  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await signInWithGoogle();
      return result;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Função de registro
  const register = async (email, password, userData) => {
    try {
      setLoading(true);
      const result = await signUpWithEmail(email, password, userData);
      return result;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Função de logout
  const logout = async () => {
    try {
      setLoading(true);
      await signOutUser();
      setUser(null);
      setEstablishment(null);
      setActiveQueue(null);
      setQueueItems([]);
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Função para redefinir senha
  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      await resetPassword(email);
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar perfil
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      await updateUserProfile(userData);
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar estabelecimento
  const fetchEstablishment = async (establishmentId) => {
    try {
      setLoading(true);
      const establishmentData = await getEstablishment(establishmentId);
      setEstablishment(establishmentData);
      return establishmentData;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar estabelecimento
  const updateEstablishmentData = async (establishmentId, establishmentData) => {
    try {
      setLoading(true);
      const result = await updateEstablishment(establishmentId, establishmentData);
      setEstablishment(result);
      return result;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Função para criar estabelecimento
  const createEstablishmentData = async (establishmentData) => {
    try {
      setLoading(true);
      const result = await createEstablishment(establishmentData);
      setEstablishment(result);
      return result;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar fila ativa
  const fetchActiveQueue = async (establishmentId) => {
    try {
      setLoading(true);
      const queueData = await getEstablishmentActiveQueue(establishmentId);
      setActiveQueue(queueData);
      return queueData;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Função para criar fila
  const createQueueData = async (queueData) => {
    try {
      setLoading(true);
      const result = await createQueue(queueData);
      setActiveQueue(result);
      return result;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Função para adicionar cliente à fila
  const addCustomer = async (queueId, customerData) => {
    try {
      setLoading(true);
      const result = await addCustomerToQueue(queueId, customerData);
      return result;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Função para chamar próximo cliente
  const callNext = async (queueId) => {
    try {
      setLoading(true);
      const result = await callNextInQueue(queueId);
      return result;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Função para concluir atendimento
  const completeService = async (queueItemId) => {
    try {
      setLoading(true);
      const result = await completeQueueItem(queueItemId);
      return result;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Função para obter estatísticas
  const getStatistics = async (establishmentId, period) => {
    try {
      setLoading(true);
      const result = await getEstablishmentStatistics(establishmentId, period);
      return result;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Função para salvar estatísticas
  const saveStatistics = async (queueId) => {
    try {
      setLoading(true);
      const result = await saveQueueStatistics(queueId);
      return result;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Valor do contexto
  const value = {
    user,
    loading,
    error,
    establishment,
    activeQueue,
    queueItems,
    login,
    loginWithGoogle,
    register,
    logout,
    forgotPassword,
    updateProfile,
    fetchEstablishment,
    updateEstablishmentData,
    createEstablishmentData,
    fetchActiveQueue,
    createQueueData,
    addCustomer,
    callNext,
    completeService,
    getStatistics,
    saveStatistics
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseProvider;
