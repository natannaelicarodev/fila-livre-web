import React, { useState } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  List,
  Divider,
  Alert,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useFirebase } from '../contexts/FirebaseContext';
import Layout from '../components/layout/Layout';
import CustomCard from '../components/common/CustomCard';
import CustomButton from '../components/common/CustomButton';
import CustomTextField from '../components/common/CustomTextField';
import QueueItem from '../components/dashboard/QueueItem';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import toast from 'react-hot-toast';

// Componente de formulário para adicionar cliente à fila
const AddCustomerForm = ({ onSubmit, onCancel, isLoading }) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerNameError, setCustomerNameError] = useState('');
  
  const handleSubmit = () => {
    // Validação
    if (!customerName.trim()) {
      setCustomerNameError('O nome é obrigatório');
      return;
    }
    
    onSubmit({
      displayName: customerName,
      phone: customerPhone
    });
  };
  
  return (
    <CustomCard
      title="Adicionar Cliente"
      sx={{ mb: 3 }}
    >
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid item xs={12} sm={6}>
          <CustomTextField
            label="Nome do Cliente"
            fullWidth
            value={customerName}
            onChange={(e) => {
              setCustomerName(e.target.value);
              if (e.target.value.trim()) {
                setCustomerNameError('');
              }
            }}
            error={!!customerNameError}
            helperText={customerNameError}
            disabled={isLoading}
            required
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <CustomTextField
            label="Telefone (opcional)"
            fullWidth
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            disabled={isLoading}
          />
        </Grid>
        
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <CustomButton
              variant="outlined"
              color="primary"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancelar
            </CustomButton>
            
            <CustomButton
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              loading={isLoading}
            >
              Adicionar à Fila
            </CustomButton>
          </Box>
        </Grid>
      </Grid>
    </CustomCard>
  );
};

// Componente principal da página de fila
const QueueManager = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { 
    queueItems, 
    activeQueue, 
    addCustomer, 
    callNext, 
    completeService, 
    refreshQueue 
  } = useFirebase();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  
  // Filtrar itens da fila por status
  const waitingItems = queueItems.filter(item => item.status === 'waiting');
  const calledItems = queueItems.filter(item => item.status === 'called');
  
  // Encontrar o cliente ativo (chamado)
  const activeCustomer = calledItems.length > 0 ? calledItems[0] : null;
  
  const handleAddCustomer = () => {
    setIsAddingCustomer(true);
  };
  
  const handleCancelAdd = () => {
    setIsAddingCustomer(false);
  };
  
  const handleSubmitCustomer = async (customerData) => {
    try {
      setIsLoading(true);
      
      const result = await addCustomer(customerData);
      
      toast.success(`${customerData.displayName} foi adicionado à fila na posição ${result.position}`);
      setIsAddingCustomer(false);
    } catch (error) {
      toast.error(error.message || 'Erro ao adicionar cliente');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCallNext = async () => {
    try {
      setIsLoading(true);
      
      const nextCustomer = await callNext();
      
      if (nextCustomer) {
        toast.success(`${nextCustomer.displayName} foi chamado!`);
      }
    } catch (error) {
      toast.error(error.message || 'Erro ao chamar próximo cliente');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCompleteService = async () => {
    if (!activeCustomer) return;
    
    try {
      setIsLoading(true);
      
      await completeService(activeCustomer.id);
      
      toast.success('Atendimento concluído!');
    } catch (error) {
      toast.error(error.message || 'Erro ao concluir atendimento');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRefreshQueue = async () => {
    try {
      setIsLoading(true);
      
      await refreshQueue();
      
      toast.success('Fila atualizada!');
    } catch (error) {
      toast.error(error.message || 'Erro ao atualizar fila');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Layout
      title="Gerenciamento de Fila"
      subtitle="Visualize e gerencie os clientes na fila"
      breadcrumbs={[{ label: 'Fila', href: '/queue' }]}
    >
      <Grid container spacing={3}>
        {/* Ações da fila */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <Box>
              <CustomButton
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddCustomer}
                disabled={isAddingCustomer || isLoading}
                sx={{ mr: 2 }}
              >
                Adicionar Cliente
              </CustomButton>
              
              <CustomButton
                variant="outlined"
                color="primary"
                startIcon={<RefreshIcon />}
                onClick={handleRefreshQueue}
                loading={isLoading}
              >
                Atualizar
              </CustomButton>
            </Box>
            
            <Box>
              <CustomButton
                variant="contained"
                color="primary"
                startIcon={<ArrowUpwardIcon />}
                onClick={handleCallNext}
                loading={isLoading}
                disabled={waitingItems.length === 0 || activeCustomer}
                sx={{ mr: 2 }}
              >
                Chamar Próximo
              </CustomButton>
              
              <CustomButton
                variant="contained"
                color="success"
                startIcon={<CheckCircleIcon />}
                onClick={handleCompleteService}
                loading={isLoading}
                disabled={!activeCustomer}
              >
                Concluir Atendimento
              </CustomButton>
            </Box>
          </Box>
        </Grid>
        
        {/* Formulário de adição de cliente */}
        {isAddingCustomer && (
          <Grid item xs={12}>
            <AddCustomerForm
              onSubmit={handleSubmitCustomer}
              onCancel={handleCancelAdd}
              isLoading={isLoading}
            />
          </Grid>
        )}
        
        {/* Cliente atual */}
        {activeCustomer && (
          <Grid item xs={12}>
            <CustomCard
              title="Cliente Atual"
              sx={{ mb: 3, borderLeft: `4px solid ${theme.palette.primary.main}` }}
            >
              <Box sx={{ p: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h5" component="div">
                      {activeCustomer.displayName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Chamado às {new Date(activeCustomer.calledAt?.toDate()).toLocaleTimeString()}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                    <CustomButton
                      variant="contained"
                      color="success"
                      onClick={handleCompleteService}
                      loading={isLoading}
                    >
                      Concluir Atendimento
                    </CustomButton>
                  </Grid>
                </Grid>
              </Box>
            </CustomCard>
          </Grid>
        )}
        
        {/* Lista de espera */}
        <Grid item xs={12}>
          <CustomCard
            title={`Fila de Espera (${waitingItems.length})`}
          >
            {waitingItems.length > 0 ? (
              <List disablePadding>
                {waitingItems.map((item, index) => (
                  <React.Fragment key={item.id}>
                    {index > 0 && <Divider />}
                    <QueueItem
                      position={item.position}
                      name={item.displayName}
                      waitTime={item.joinedAt ? `${Math.round((new Date() - item.joinedAt.toDate()) / 60000)} min` : '0 min'}
                      joinedAt={item.joinedAt ? new Date(item.joinedAt.toDate()).toLocaleTimeString() : ''}
                      isActive={false}
                    />
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="text.secondary">
                  Não há clientes na fila de espera.
                </Typography>
                {!activeCustomer && (
                  <CustomButton
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleAddCustomer}
                    sx={{ mt: 2 }}
                  >
                    Adicionar Cliente
                  </CustomButton>
                )}
              </Box>
            )}
          </CustomCard>
        </Grid>
        
        {/* Estatísticas da fila */}
        <Grid item xs={12}>
          <CustomCard
            title="Estatísticas da Fila"
            sx={{ mt: 3 }}
          >
            <Grid container spacing={3} sx={{ p: 2 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="primary" fontWeight="bold">
                    {waitingItems.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Na Fila
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="primary" fontWeight="bold">
                    {activeCustomer ? '1' : '0'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Em Atendimento
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="primary" fontWeight="bold">
                    {waitingItems.length > 0 ? `${Math.round(waitingItems.reduce((acc, item) => acc + (new Date() - item.joinedAt.toDate()) / 60000, 0) / waitingItems.length)} min` : '0 min'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tempo Médio de Espera
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="primary" fontWeight="bold">
                    {waitingItems.length > 0 ? `${Math.round(waitingItems.length * 15)} min` : '0 min'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tempo Estimado Total
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CustomCard>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default QueueManager;
