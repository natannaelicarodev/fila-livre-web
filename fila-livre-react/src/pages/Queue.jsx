import React, { useState } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Tabs, 
  Tab, 
  Divider,
  List,
  IconButton,
  Tooltip,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Layout from '../components/layout/Layout';
import CustomCard from '../components/common/CustomCard';
import CustomButton from '../components/common/CustomButton';
import CustomTextField from '../components/common/CustomTextField';
import QueueItem from '../components/dashboard/QueueItem';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Página de gerenciamento da fila
// Permite visualizar, adicionar e gerenciar clientes na fila
// Design responsivo e mobile first

const Queue = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerNameError, setCustomerNameError] = useState('');
  
  // Dados de exemplo para a fila
  const queueItems = [
    {
      id: '1',
      position: 1,
      name: 'João Silva',
      waitTime: '5 min',
      joinedAt: '14:30',
      isActive: true
    },
    {
      id: '2',
      position: 2,
      name: 'Maria Oliveira',
      waitTime: '3 min',
      joinedAt: '14:32',
      isActive: false
    },
    {
      id: '3',
      position: 3,
      name: 'Pedro Santos',
      waitTime: '2 min',
      joinedAt: '14:33',
      isActive: false
    },
    {
      id: '4',
      position: 4,
      name: 'Ana Costa',
      waitTime: '1 min',
      joinedAt: '14:34',
      isActive: false
    },
    {
      id: '5',
      position: 5,
      name: 'Carlos Ferreira',
      waitTime: '1 min',
      joinedAt: '14:35',
      isActive: false
    }
  ];
  
  // Dados de exemplo para clientes atendidos
  const servedItems = [
    {
      id: '101',
      position: 0,
      name: 'Roberto Almeida',
      waitTime: '8 min',
      joinedAt: '14:20',
      servedAt: '14:28',
      isActive: false
    },
    {
      id: '102',
      position: 0,
      name: 'Fernanda Lima',
      waitTime: '6 min',
      joinedAt: '14:15',
      servedAt: '14:21',
      isActive: false
    },
    {
      id: '103',
      position: 0,
      name: 'Marcelo Souza',
      waitTime: '10 min',
      joinedAt: '14:00',
      servedAt: '14:10',
      isActive: false
    }
  ];
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleAddCustomer = () => {
    setIsAddingCustomer(true);
  };
  
  const handleCancelAdd = () => {
    setIsAddingCustomer(false);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerNameError('');
  };
  
  const handleSubmitCustomer = () => {
    // Validação
    if (!customerName.trim()) {
      setCustomerNameError('O nome é obrigatório');
      return;
    }
    
    setIsLoading(true);
    
    // Simulação de adição de cliente
    setTimeout(() => {
      setIsLoading(false);
      setIsAddingCustomer(false);
      setCustomerName('');
      setCustomerPhone('');
      setCustomerNameError('');
      // Aqui seria implementada a integração real com Firebase
      alert(`Cliente ${customerName} adicionado à fila!`);
    }, 1000);
  };
  
  const handleCallNext = () => {
    setIsLoading(true);
    
    // Simulação de chamada do próximo cliente
    setTimeout(() => {
      setIsLoading(false);
      // Aqui seria implementada a integração real com Firebase
      alert('Próximo cliente chamado!');
    }, 1000);
  };
  
  const handleCompleteService = () => {
    setIsLoading(true);
    
    // Simulação de conclusão de atendimento
    setTimeout(() => {
      setIsLoading(false);
      // Aqui seria implementada a integração real com Firebase
      alert('Atendimento concluído!');
    }, 1000);
  };
  
  const handleRefreshQueue = () => {
    setIsLoading(true);
    
    // Simulação de atualização da fila
    setTimeout(() => {
      setIsLoading(false);
      // Aqui seria implementada a integração real com Firebase
      alert('Fila atualizada!');
    }, 1000);
  };

  return (
    <Layout
      title="Gerenciamento de Fila"
      subtitle="Visualize e gerencie os clientes na fila"
      breadcrumbs={[{ label: 'Fila', href: '/queue' }]}
      user={{ displayName: 'Usuário Teste', email: 'usuario@teste.com' }}
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
                disabled={queueItems.length === 0}
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
                disabled={!queueItems.some(item => item.isActive)}
              >
                Concluir Atendimento
              </CustomButton>
            </Box>
          </Box>
        </Grid>
        
        {/* Formulário de adição de cliente */}
        {isAddingCustomer && (
          <Grid item xs={12}>
            <CustomCard
              title="Adicionar Cliente"
              sx={{ mb: 3 }}
            >
              <Grid container spacing={2}>
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
                      onClick={handleCancelAdd}
                      disabled={isLoading}
                    >
                      Cancelar
                    </CustomButton>
                    
                    <CustomButton
                      variant="contained"
                      color="primary"
                      onClick={handleSubmitCustomer}
                      loading={isLoading}
                    >
                      Adicionar à Fila
                    </CustomButton>
                  </Box>
                </Grid>
              </Grid>
            </CustomCard>
          </Grid>
        )}
        
        {/* Abas de fila atual e atendidos */}
        <Grid item xs={12}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              variant={isMobile ? "fullWidth" : "standard"}
            >
              <Tab label={`Fila Atual (${queueItems.length})`} />
              <Tab label="Atendidos Hoje" />
            </Tabs>
          </Box>
        </Grid>
        
        <Grid item xs={12}>
          {tabValue === 0 ? (
            <CustomCard>
              {queueItems.length > 0 ? (
                <List disablePadding>
                  {queueItems.map((item, index) => (
                    <React.Fragment key={item.id}>
                      {index > 0 && <Divider />}
                      <QueueItem
                        position={item.position}
                        name={item.name}
                        waitTime={item.waitTime}
                        joinedAt={item.joinedAt}
                        isActive={item.isActive}
                      />
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography color="text.secondary">
                    Não há clientes na fila no momento.
                  </Typography>
                  <CustomButton
                    variant="contained"
                    color="primary"
                    startIcon={<PersonAddIcon />}
                    onClick={handleAddCustomer}
                    sx={{ mt: 2 }}
                  >
                    Adicionar Cliente
                  </CustomButton>
                </Box>
              )}
            </CustomCard>
          ) : (
            <CustomCard>
              {servedItems.length > 0 ? (
                <List disablePadding>
                  {servedItems.map((item, index) => (
                    <React.Fragment key={item.id}>
                      {index > 0 && <Divider />}
                      <QueueItem
                        position={0}
                        name={item.name}
                        waitTime={item.waitTime}
                        joinedAt={`${item.joinedAt} - ${item.servedAt}`}
                        isActive={false}
                      />
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography color="text.secondary">
                    Nenhum cliente foi atendido hoje.
                  </Typography>
                </Box>
              )}
            </CustomCard>
          )}
        </Grid>
        
        {/* Estatísticas da fila */}
        <Grid item xs={12}>
          <CustomCard
            title="Estatísticas da Fila"
            sx={{ mt: 3 }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="primary" fontWeight="bold">
                    {queueItems.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Na Fila
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="primary" fontWeight="bold">
                    15 min
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tempo Médio
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="primary" fontWeight="bold">
                    {servedItems.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Atendidos Hoje
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="primary" fontWeight="bold">
                    4%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Taxa de Desistência
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

export default Queue;
