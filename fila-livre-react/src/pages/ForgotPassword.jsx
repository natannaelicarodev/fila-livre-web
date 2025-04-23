import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider, 
  Link as MuiLink,
  useMediaQuery,
  Alert,
  Snackbar
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import CustomTextField from '../components/common/CustomTextField';
import CustomButton from '../components/common/CustomButton';
import GoogleIcon from '@mui/icons-material/Google';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { useFirebase } from '../contexts/FirebaseContext';

// Página de recuperação de senha
// Permite solicitar redefinição de senha
// Design responsivo e mobile first

const ForgotPassword = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { resetPassword, user } = useFirebase();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Verificar se o usuário já está autenticado
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
    
    // Verificar se há email salvo no localStorage
    const savedEmail = localStorage.getItem('filaLivre_email');
    
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, [user, navigate]);
  
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    // Validação
    let isValid = true;
    
    if (!email) {
      setEmailError('O email é obrigatório');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Email inválido');
      isValid = false;
    } else {
      setEmailError('');
    }
    
    if (!isValid) return;
    
    setIsLoading(true);
    
    try {
      // Enviar email de redefinição de senha
      await resetPassword(email);
      
      setSuccessMessage(`Um email de redefinição de senha foi enviado para ${email}. Verifique sua caixa de entrada.`);
      setShowSuccess(true);
      
      // Limpar o campo de email após o envio bem-sucedido
      setEmail('');
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      
      // Tratamento de erros específicos do Firebase
      let errorMsg = 'Ocorreu um erro ao enviar o email de redefinição. Tente novamente.';
      
      if (error.code === 'auth/user-not-found') {
        errorMsg = 'Não encontramos uma conta com este email.';
      } else if (error.code === 'auth/invalid-email') {
        errorMsg = 'Email inválido.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMsg = 'Muitas tentativas. Tente novamente mais tarde.';
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      setErrorMessage(errorMsg);
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCloseError = () => {
    setShowError(false);
  };
  
  const handleCloseSuccess = () => {
    setShowSuccess(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.palette.primary.main,
        backgroundImage: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          maxWidth: 450,
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            p: 4,
            textAlign: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 3,
            }}
          >
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                backgroundColor: theme.palette.primary.main,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: 24,
              }}
            >
              FL
            </Box>
          </Box>
          
          <Typography variant="h5" component="h1" gutterBottom fontWeight="bold">
            Esqueceu sua senha?
          </Typography>
          
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Informe seu email para receber um link de redefinição de senha
          </Typography>
          
          <Box component="form" onSubmit={handleResetPassword} sx={{ mt: 4 }}>
            <CustomTextField
              label="Email"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!emailError}
              helperText={emailError}
              disabled={isLoading}
              required
              startAdornment={<EmailIcon color="action" />}
              sx={{ mb: 3 }}
            />
            
            <CustomButton
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              loading={isLoading}
              sx={{ mb: 3 }}
            >
              Enviar Link de Redefinição
            </CustomButton>
            
            <Typography variant="body2" align="center">
              Lembrou sua senha?{' '}
              <MuiLink
                component={Link}
                to="/"
                color="primary"
                underline="hover"
                fontWeight="medium"
              >
                Voltar para o login
              </MuiLink>
            </Typography>
          </Box>
        </Box>
        
        <Box
          sx={{
            p: 2,
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
            borderTop: '1px solid rgba(0, 0, 0, 0.05)',
            textAlign: 'center',
          }}
        >
          <Typography variant="caption" color="text.secondary">
            © 2025 Fila Livre. Todos os direitos reservados.
          </Typography>
        </Box>
      </Paper>
      
      {/* Snackbar para exibir mensagens de erro */}
      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
      
      {/* Snackbar para exibir mensagens de sucesso */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ForgotPassword;
