import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Layout from '../components/layout/Layout';
import StatCard from '../components/dashboard/StatCard';
import ChartCard from '../components/dashboard/ChartCard';
import QueueItem from '../components/dashboard/QueueItem';
import CustomButton from '../components/common/CustomButton';
import CustomCard from '../components/common/CustomCard';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import QrCodeIcon from '@mui/icons-material/QrCode';
import BarChartIcon from '@mui/icons-material/BarChart';

// Página principal do dashboard
// Exibe estatísticas, gráficos e fila atual
// Responsiva para diferentes tamanhos de tela

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const savedEmail = localStorage.getItem('filaLivre_email');
    const displayName = localStorage.getItem('filaLivre_displayName');
    // console.log(displayName)
    // const saved
  },[])
  // Dados de exemplo para estatísticas
  const stats = [
    {
      title: 'Pessoas na Fila',
      value: '12',
      icon: <PersonIcon />,
      trend: { value: 8, isPositive: false },
      color: 'primary'
    },
    {
      title: 'Tempo Médio',
      value: '15 min',
      icon: <AccessTimeIcon />,
      trend: { value: 5, isPositive: true },
      color: 'secondary'
    },
    {
      title: 'Atendidos Hoje',
      value: '48',
      icon: <CheckCircleIcon />,
      trend: { value: 12, isPositive: true },
      color: 'success'
    },
    {
      title: 'Taxa de Desistência',
      value: '4%',
      icon: <CancelIcon />,
      trend: { value: 2, isPositive: true },
      color: 'error'
    }
  ];
  
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
    }
  ];
  
  // Função para chamar o próximo cliente
  const handleCallNext = () => {
    setIsLoading(true);
    // Simulação de chamada de API
    setTimeout(() => {
      setIsLoading(false);
      // Aqui seria implementada a lógica real para chamar o próximo cliente
      alert('Próximo cliente chamado!');
    }, 1000);
  };

  return (
    <Layout
      title="Dashboard"
      subtitle="Visão geral da sua fila"
      user={{ displayName: localStorage.getItem('filaLivre_displayName'), email: localStorage.getItem('filaLivre_email') }}
    >
      <Grid container spacing={3}>
        {/* Cards de estatísticas */}
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              trend={stat.trend}
              color={stat.color}
            />
          </Grid>
        ))}
        
        {/* Gráficos */}
        <Grid item xs={12} lg={8}>
          <ChartCard
            title="Fluxo de Clientes"
            subtitle="Últimas 24 horas"
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 300,
                color: 'text.secondary',
              }}
            >
              <Typography variant="body2">
                Gráfico de fluxo de clientes
                {/* Em um ambiente real, aqui seria implementado um gráfico com Chart.js ou Recharts */}
              </Typography>
            </Box>
          </ChartCard>
        </Grid>
        
        <Grid item xs={12} lg={4}>
          <ChartCard
            title="Distribuição por Horário"
            subtitle="Hoje"
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 300,
                color: 'text.secondary',
              }}
            >
              <Typography variant="body2">
                Gráfico de pizza
                {/* Em um ambiente real, aqui seria implementado um gráfico com Chart.js ou Recharts */}
              </Typography>
            </Box>
          </ChartCard>
        </Grid>
        
        {/* Fila atual */}
        <Grid item xs={12} lg={8}>
          <CustomCard
            title="Fila Atual"
            footer={
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  {queueItems.length > 0 
                    ? `Mostrando ${Math.min(5, queueItems.length)} de ${queueItems.length} pessoas na fila` 
                    : 'Fila vazia'}
                </Typography>
                <CustomButton
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => window.location.href = '/queue'}
                >
                  Ver Todos
                </CustomButton>
              </Box>
            }
          >
            <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
              {queueItems.length > 0 ? (
                queueItems.map((item) => (
                  <QueueItem
                    key={item.id}
                    position={item.position}
                    name={item.name}
                    waitTime={item.waitTime}
                    joinedAt={item.joinedAt}
                    isActive={item.isActive}
                  />
                ))
              ) : (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography color="text.secondary">
                    Não há clientes na fila no momento.
                  </Typography>
                </Box>
              )}
            </Box>
          </CustomCard>
        </Grid>
        
        {/* Ações rápidas */}
        <Grid item xs={12} lg={4}>
          <CustomCard title="Ações Rápidas">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <CustomButton
                variant="contained"
                color="primary"
                fullWidth
                startIcon={<AddIcon />}
                onClick={() => window.location.href = '/queue'}
              >
                Adicionar Cliente
              </CustomButton>
              
              <CustomButton
                variant="contained"
                color="primary"
                fullWidth
                startIcon={<ArrowUpwardIcon />}
                onClick={handleCallNext}
                loading={isLoading}
                disabled={queueItems.length === 0}
              >
                Chamar Próximo
              </CustomButton>
              
              <CustomButton
                variant="outlined"
                color="primary"
                fullWidth
                startIcon={<QrCodeIcon />}
                onClick={() => window.location.href = '/qrcode'}
              >
                Gerar QR Code
              </CustomButton>
              
              <CustomButton
                variant="outlined"
                color="primary"
                fullWidth
                startIcon={<BarChartIcon />}
                onClick={() => window.location.href = '/statistics'}
              >
                Exportar Relatório
              </CustomButton>
            </Box>
          </CustomCard>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Dashboard;
