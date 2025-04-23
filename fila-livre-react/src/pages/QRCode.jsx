import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Paper,
  Divider,
  Tab,
  Tabs,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Layout from '../components/layout/Layout';
import CustomCard from '../components/common/CustomCard';
import CustomButton from '../components/common/CustomButton';
import CustomTextField from '../components/common/CustomTextField';
import QrCodeIcon from '@mui/icons-material/QrCode';
import ShareIcon from '@mui/icons-material/Share';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';

// Página de geração de QR Code para acesso à fila
// Permite gerar, compartilhar e imprimir QR Codes
// Design responsivo e mobile first

const QRCode = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const qrCodeRef = useRef(null);
  
  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [establishmentName, setEstablishmentName] = useState('Meu Estabelecimento');
  
  // Simulação de geração de QR Code
  useEffect(() => {
    // Em um ambiente real, aqui seria gerado um QR Code real com uma biblioteca como qrcode.react
    // Para esta simulação, usamos uma imagem de placeholder
    setQrCodeUrl('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://filalivreapp.com/join/123456');
  }, []);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleRegenerateQrCode = () => {
    setIsLoading(true);
    
    // Simulação de regeneração de QR Code
    setTimeout(() => {
      setIsLoading(false);
      setQrCodeUrl('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://filalivreapp.com/join/654321');
      alert('QR Code regenerado com sucesso!');
    }, 1000);
  };
  
  const handleDownloadQrCode = () => {
    // Em um ambiente real, aqui seria implementado o download da imagem do QR Code
    alert('Download do QR Code iniciado!');
  };
  
  const handlePrintQrCode = () => {
    // Em um ambiente real, aqui seria implementada a impressão do QR Code
    alert('Impressão do QR Code iniciada!');
  };
  
  const handleShareQrCode = () => {
    // Em um ambiente real, aqui seria implementado o compartilhamento do QR Code
    if (navigator.share) {
      navigator.share({
        title: 'QR Code Fila Livre',
        text: 'Escaneie este QR Code para entrar na fila',
        url: 'https://filalivreapp.com/join/123456',
      });
    } else {
      alert('Compartilhamento não suportado neste navegador');
    }
  };

  return (
    <Layout
      title="QR Code"
      subtitle="Gere e compartilhe QR Codes para acesso à fila"
      breadcrumbs={[{ label: 'QR Code', href: '/qrcode' }]}
      user={{ displayName: 'Usuário Teste', email: 'usuario@teste.com' }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              variant={isMobile ? "fullWidth" : "standard"}
            >
              <Tab label="QR Code da Fila" />
              <Tab label="Configurações" />
            </Tabs>
          </Box>
        </Grid>
        
        {tabValue === 0 ? (
          <>
            <Grid item xs={12} md={6}>
              <CustomCard>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 3,
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    QR Code da Fila
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                    Os clientes podem escanear este QR Code para entrar na fila virtual do seu estabelecimento.
                  </Typography>
                  
                  <Paper
                    elevation={2}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      mb: 3,
                      width: 'fit-content',
                    }}
                    ref={qrCodeRef}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                        {establishmentName}
                      </Typography>
                      
                      <Box
                        component="img"
                        src={qrCodeUrl}
                        alt="QR Code"
                        sx={{
                          width: 200,
                          height: 200,
                          my: 2,
                        }}
                      />
                      
                      <Typography variant="body2" color="text.secondary">
                        Escaneie para entrar na fila
                      </Typography>
                    </Box>
                  </Paper>
                  
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'center',
                      gap: 2,
                      width: '100%',
                    }}
                  >
                    <CustomButton
                      variant="outlined"
                      color="primary"
                      startIcon={<QrCodeIcon />}
                      onClick={handleRegenerateQrCode}
                      loading={isLoading}
                    >
                      Regenerar
                    </CustomButton>
                    
                    <CustomButton
                      variant="outlined"
                      color="primary"
                      startIcon={<DownloadIcon />}
                      onClick={handleDownloadQrCode}
                    >
                      Download
                    </CustomButton>
                    
                    <CustomButton
                      variant="outlined"
                      color="primary"
                      startIcon={<PrintIcon />}
                      onClick={handlePrintQrCode}
                    >
                      Imprimir
                    </CustomButton>
                    
                    <CustomButton
                      variant="outlined"
                      color="primary"
                      startIcon={<ShareIcon />}
                      onClick={handleShareQrCode}
                    >
                      Compartilhar
                    </CustomButton>
                  </Box>
                </Box>
              </CustomCard>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <CustomCard>
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Como Usar
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                      1. Imprima o QR Code
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Imprima o QR Code e coloque-o em um local visível no seu estabelecimento, como na entrada ou próximo ao balcão de atendimento.
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                      2. Oriente os Clientes
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Instrua seus clientes a escanear o QR Code com a câmera do celular para entrar na fila virtual. Eles serão redirecionados para uma página onde poderão inserir seu nome e acompanhar sua posição na fila.
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                      3. Gerencie a Fila
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Acompanhe a fila no painel de controle e chame os clientes quando for a vez deles. Os clientes receberão notificações em seus celulares quando estiverem próximos de serem atendidos.
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                      4. Personalize (Opcional)
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Você pode personalizar a aparência do QR Code e da página de entrada na fila nas configurações do seu estabelecimento.
                    </Typography>
                  </Box>
                </Box>
              </CustomCard>
            </Grid>
          </>
        ) : (
          <Grid item xs={12}>
            <CustomCard>
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Configurações do QR Code
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      label="Nome do Estabelecimento"
                      fullWidth
                      value={establishmentName}
                      onChange={(e) => setEstablishmentName(e.target.value)}
                      helperText="Este nome será exibido no QR Code"
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      label="Mensagem Personalizada"
                      fullWidth
                      defaultValue="Escaneie para entrar na fila"
                      helperText="Mensagem exibida abaixo do QR Code"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <CustomButton
                        variant="contained"
                        color="primary"
                        onClick={() => alert('Configurações salvas!')}
                      >
                        Salvar Configurações
                      </CustomButton>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </CustomCard>
          </Grid>
        )}
      </Grid>
    </Layout>
  );
};

export default QRCode;
