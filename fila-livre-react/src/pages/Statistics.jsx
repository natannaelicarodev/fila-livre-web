import React, { useState } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Divider,
  MenuItem,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Layout from '../components/layout/Layout';
import CustomCard from '../components/common/CustomCard';
import CustomButton from '../components/common/CustomButton';
import CustomTextField from '../components/common/CustomTextField';
import ChartCard from '../components/dashboard/ChartCard';
import DownloadIcon from '@mui/icons-material/Download';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

// Página de estatísticas e relatórios
// Exibe dados estatísticos sobre o uso do sistema de filas
// Design responsivo e mobile first

const Statistics = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState('today');
  const [startDate, setStartDate] = useState('2025-04-15');
  const [endDate, setEndDate] = useState('2025-04-22');
  
  // Dados de exemplo para estatísticas
  const stats = {
    totalCustomers: 248,
    avgWaitTime: 12,
    peakHour: '14:00 - 15:00',
    avgServiceTime: 8,
    abandonRate: 4.2,
    satisfactionRate: 92
  };
  
  const handleDateRangeChange = (event) => {
    setDateRange(event.target.value);
    
    // Simulação de atualização de datas com base no intervalo selecionado
    const today = new Date();
    let start = new Date();
    
    switch(event.target.value) {
      case 'today':
        start = today;
        break;
      case 'yesterday':
        start = new Date(today);
        start.setDate(start.getDate() - 1);
        break;
      case 'week':
        start = new Date(today);
        start.setDate(start.getDate() - 7);
        break;
      case 'month':
        start = new Date(today);
        start.setMonth(start.getMonth() - 1);
        break;
      case 'custom':
        // Manter as datas personalizadas existentes
        return;
      default:
        break;
    }
    
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(today.toISOString().split('T')[0]);
  };
  
  const handleGenerateReport = () => {
    setIsLoading(true);
    
    // Simulação de geração de relatório
    setTimeout(() => {
      setIsLoading(false);
      // Aqui seria implementada a integração real com Firebase
      alert('Relatório gerado com sucesso!');
    }, 1500);
  };
  
  const handleExportData = (format) => {
    // Simulação de exportação de dados
    alert(`Exportando dados em formato ${format}...`);
  };

  return (
    <Layout
      title="Estatísticas"
      subtitle="Visualize dados estatísticos sobre o uso do sistema de filas"
      breadcrumbs={[{ label: 'Estatísticas', href: '/statistics' }]}
      user={{ displayName: 'Usuário Teste', email: 'usuario@teste.com' }}
    >
      <Grid container spacing={3}>
        {/* Filtros de Data */}
        <Grid item xs={12}>
          <CustomCard>
            <Box sx={{ p: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={4} md={3}>
                  <CustomTextField
                    select
                    label="Intervalo de Datas"
                    value={dateRange}
                    onChange={handleDateRangeChange}
                    fullWidth
                  >
                    <MenuItem value="today">Hoje</MenuItem>
                    <MenuItem value="yesterday">Ontem</MenuItem>
                    <MenuItem value="week">Últimos 7 dias</MenuItem>
                    <MenuItem value="month">Último mês</MenuItem>
                    <MenuItem value="custom">Personalizado</MenuItem>
                  </CustomTextField>
                </Grid>
                
                {dateRange === 'custom' && (
                  <>
                    <Grid item xs={12} sm={4} md={3}>
                      <CustomTextField
                        label="Data Inicial"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={4} md={3}>
                      <CustomTextField
                        label="Data Final"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </>
                )}
                
                <Grid item xs={12} sm={4} md={3}>
                  <CustomButton
                    variant="contained"
                    color="primary"
                    onClick={handleGenerateReport}
                    loading={isLoading}
                    fullWidth
                  >
                    Gerar Relatório
                  </CustomButton>
                </Grid>
              </Grid>
            </Box>
          </CustomCard>
        </Grid>
        
        {/* Cards de Estatísticas */}
        <Grid item xs={12} sm={6} md={4}>
          <CustomCard>
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h3" color="primary" fontWeight="bold">
                {stats.totalCustomers}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Clientes Atendidos
              </Typography>
            </Box>
          </CustomCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <CustomCard>
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h3" color="primary" fontWeight="bold">
                {stats.avgWaitTime} min
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Tempo Médio de Espera
              </Typography>
            </Box>
          </CustomCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <CustomCard>
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h3" color="primary" fontWeight="bold">
                {stats.peakHour}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Horário de Pico
              </Typography>
            </Box>
          </CustomCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <CustomCard>
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h3" color="primary" fontWeight="bold">
                {stats.avgServiceTime} min
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Tempo Médio de Atendimento
              </Typography>
            </Box>
          </CustomCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <CustomCard>
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h3" color="error" fontWeight="bold">
                {stats.abandonRate}%
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Taxa de Desistência
              </Typography>
            </Box>
          </CustomCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <CustomCard>
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h3" color="success" fontWeight="bold">
                {stats.satisfactionRate}%
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Satisfação dos Clientes
              </Typography>
            </Box>
          </CustomCard>
        </Grid>
        
        {/* Gráficos */}
        <Grid item xs={12} md={6}>
          <ChartCard
            title="Fluxo de Clientes por Hora"
            subtitle="Número de clientes por hora do dia"
            icon={<BarChartIcon />}
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
                Gráfico de barras do fluxo de clientes
                {/* Em um ambiente real, aqui seria implementado um gráfico com Chart.js ou Recharts */}
              </Typography>
            </Box>
          </ChartCard>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <ChartCard
            title="Tempo Médio de Espera por Dia"
            subtitle="Evolução do tempo médio de espera"
            icon={<TrendingUpIcon />}
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
                Gráfico de linha do tempo médio de espera
                {/* Em um ambiente real, aqui seria implementado um gráfico com Chart.js ou Recharts */}
              </Typography>
            </Box>
          </ChartCard>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <ChartCard
            title="Distribuição por Dia da Semana"
            subtitle="Número de clientes por dia da semana"
            icon={<CalendarTodayIcon />}
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
                Gráfico de barras da distribuição por dia da semana
                {/* Em um ambiente real, aqui seria implementado um gráfico com Chart.js ou Recharts */}
              </Typography>
            </Box>
          </ChartCard>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <ChartCard
            title="Motivos de Atendimento"
            subtitle="Distribuição por tipo de serviço"
            icon={<PieChartIcon />}
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
                Gráfico de pizza dos motivos de atendimento
                {/* Em um ambiente real, aqui seria implementado um gráfico com Chart.js ou Recharts */}
              </Typography>
            </Box>
          </ChartCard>
        </Grid>
        
        {/* Exportação de Dados */}
        <Grid item xs={12}>
          <CustomCard
            title="Exportar Dados"
            icon={<DownloadIcon />}
          >
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary" paragraph>
                Exporte os dados estatísticos para análise em outras ferramentas.
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <CustomButton
                  variant="outlined"
                  color="primary"
                  startIcon={<DownloadIcon />}
                  onClick={() => handleExportData('csv')}
                >
                  Exportar CSV
                </CustomButton>
                
                <CustomButton
                  variant="outlined"
                  color="primary"
                  startIcon={<DownloadIcon />}
                  onClick={() => handleExportData('excel')}
                >
                  Exportar Excel
                </CustomButton>
                
                <CustomButton
                  variant="outlined"
                  color="primary"
                  startIcon={<DownloadIcon />}
                  onClick={() => handleExportData('pdf')}
                >
                  Exportar PDF
                </CustomButton>
              </Box>
            </Box>
          </CustomCard>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Statistics;
