import React, { useState } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Divider,
  Switch,
  FormControlLabel,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Layout from '../components/layout/Layout';
import CustomCard from '../components/common/CustomCard';
import CustomButton from '../components/common/CustomButton';
import CustomTextField from '../components/common/CustomTextField';
import SaveIcon from '@mui/icons-material/Save';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LanguageIcon from '@mui/icons-material/Language';
import SecurityIcon from '@mui/icons-material/Security';
import StoreIcon from '@mui/icons-material/Store';

// Página de configurações do estabelecimento
// Permite personalizar configurações do sistema de filas
// Design responsivo e mobile first

const Settings = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [isLoading, setIsLoading] = useState(false);
  const [establishmentName, setEstablishmentName] = useState('Meu Estabelecimento');
  const [establishmentAddress, setEstablishmentAddress] = useState('Rua Exemplo, 123');
  const [establishmentPhone, setEstablishmentPhone] = useState('(11) 99999-9999');
  const [establishmentEmail, setEstablishmentEmail] = useState('contato@estabelecimento.com');
  const [maxQueueSize, setMaxQueueSize] = useState('50');
  const [estimatedWaitTime, setEstimatedWaitTime] = useState('15');
  
  // Configurações de notificações
  const [notifyCustomer, setNotifyCustomer] = useState(true);
  const [notifyBeforeCall, setNotifyBeforeCall] = useState(true);
  const [notifyTimeBeforeCall, setNotifyTimeBeforeCall] = useState('5');
  const [sendSMS, setSendSMS] = useState(false);
  
  const handleSaveSettings = () => {
    setIsLoading(true);
    
    // Simulação de salvamento das configurações
    setTimeout(() => {
      setIsLoading(false);
      // Aqui seria implementada a integração real com Firebase
      alert('Configurações salvas com sucesso!');
    }, 1500);
  };

  return (
    <Layout
      title="Configurações"
      subtitle="Personalize as configurações do seu estabelecimento"
      breadcrumbs={[{ label: 'Configurações', href: '/settings' }]}
      user={{ displayName: 'Usuário Teste', email: 'usuario@teste.com' }}
    >
      <Grid container spacing={3}>
        {/* Informações do Estabelecimento */}
        <Grid item xs={12}>
          <CustomCard
            title="Informações do Estabelecimento"
            icon={<StoreIcon />}
          >
            <Grid container spacing={3} sx={{ p: 2 }}>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label="Nome do Estabelecimento"
                  fullWidth
                  value={establishmentName}
                  onChange={(e) => setEstablishmentName(e.target.value)}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label="Endereço"
                  fullWidth
                  value={establishmentAddress}
                  onChange={(e) => setEstablishmentAddress(e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label="Telefone"
                  fullWidth
                  value={establishmentPhone}
                  onChange={(e) => setEstablishmentPhone(e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label="Email"
                  fullWidth
                  value={establishmentEmail}
                  onChange={(e) => setEstablishmentEmail(e.target.value)}
                  type="email"
                />
              </Grid>
            </Grid>
          </CustomCard>
        </Grid>
        
        {/* Configurações da Fila */}
        <Grid item xs={12} md={6}>
          <CustomCard
            title="Configurações da Fila"
            icon={<AccessTimeIcon />}
          >
            <Box sx={{ p: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <CustomTextField
                    label="Tamanho Máximo da Fila"
                    fullWidth
                    value={maxQueueSize}
                    onChange={(e) => setMaxQueueSize(e.target.value)}
                    type="number"
                    helperText="Deixe em branco para fila ilimitada"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <CustomTextField
                    label="Tempo Médio de Atendimento (minutos)"
                    fullWidth
                    value={estimatedWaitTime}
                    onChange={(e) => setEstimatedWaitTime(e.target.value)}
                    type="number"
                    helperText="Usado para calcular o tempo estimado de espera"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={true}
                        color="primary"
                      />
                    }
                    label="Permitir que clientes entrem na fila remotamente"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={true}
                        color="primary"
                      />
                    }
                    label="Mostrar posição na fila para os clientes"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={true}
                        color="primary"
                      />
                    }
                    label="Mostrar tempo estimado de espera"
                  />
                </Grid>
              </Grid>
            </Box>
          </CustomCard>
        </Grid>
        
        {/* Configurações de Notificações */}
        <Grid item xs={12} md={6}>
          <CustomCard
            title="Configurações de Notificações"
            icon={<NotificationsIcon />}
          >
            <Box sx={{ p: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifyCustomer}
                        onChange={(e) => setNotifyCustomer(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Notificar cliente quando for chamado"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifyBeforeCall}
                        onChange={(e) => setNotifyBeforeCall(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Notificar cliente antes de ser chamado"
                  />
                </Grid>
                
                {notifyBeforeCall && (
                  <Grid item xs={12}>
                    <CustomTextField
                      label="Minutos antes de chamar"
                      fullWidth
                      value={notifyTimeBeforeCall}
                      onChange={(e) => setNotifyTimeBeforeCall(e.target.value)}
                      type="number"
                      helperText="Quantos minutos antes de chamar o cliente ele será notificado"
                    />
                  </Grid>
                )}
                
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={sendSMS}
                        onChange={(e) => setSendSMS(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Enviar notificações por SMS (além de notificações no app)"
                  />
                </Grid>
                
                {sendSMS && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      O envio de SMS pode gerar custos adicionais. Consulte os preços na página de faturamento.
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          </CustomCard>
        </Grid>
        
        {/* Configurações Avançadas */}
        <Grid item xs={12}>
          <CustomCard
            title="Configurações Avançadas"
            icon={<SecurityIcon />}
          >
            <Box sx={{ p: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={true}
                        color="primary"
                      />
                    }
                    label="Coletar estatísticas anônimas de uso"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={false}
                        color="primary"
                      />
                    }
                    label="Modo de manutenção (fila desativada)"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={true}
                        color="primary"
                      />
                    }
                    label="Backup automático dos dados"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={true}
                        color="primary"
                      />
                    }
                    label="Permitir múltiplas filas"
                  />
                </Grid>
              </Grid>
            </Box>
          </CustomCard>
        </Grid>
        
        {/* Botões de Ação */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <CustomButton
              variant="outlined"
              color="primary"
              sx={{ mr: 2 }}
              onClick={() => window.location.reload()}
            >
              Cancelar
            </CustomButton>
            
            <CustomButton
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSaveSettings}
              loading={isLoading}
            >
              Salvar Configurações
            </CustomButton>
          </Box>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Settings;
