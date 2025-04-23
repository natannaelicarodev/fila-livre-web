import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider, 
  Link as MuiLink,
  useMediaQuery,
  Alert,
  Snackbar,
  FormHelperText
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import CustomTextField from '../components/common/CustomTextField';
import CustomButton from '../components/common/CustomButton';
import GoogleIcon from '@mui/icons-material/Google';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { useFirebase } from '../contexts/FirebaseContext';

// Funções de validação avançada
const validateEmail = (email) => {
  if (!email) return { isValid: false, message: 'O email é obrigatório' };
  
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return { isValid: false, message: 'Email inválido' };
  
  return { isValid: true, message: '' };
};

const validatePassword = (password) => {
  if (!password) return { isValid: false, message: 'A senha é obrigatória' };
  
  if (password.length < 6) return { isValid: false, message: 'A senha deve ter pelo menos 6 caracteres' };
  
  // Verificar se a senha contém pelo menos um número
  if (!/\d/.test(password)) return { isValid: false, message: 'A senha deve conter pelo menos um número' };
  
  // Verificar se a senha contém pelo menos uma letra
  if (!/[a-zA-Z]/.test(password)) return { isValid: false, message: 'A senha deve conter pelo menos uma letra' };
  
  return { isValid: true, message: '' };
};

const validatePasswordMatch = (password, confirmPassword) => {
  if (!confirmPassword) return { isValid: false, message: 'Confirme sua senha' };
  
  if (password !== confirmPassword) return { isValid: false, message: 'As senhas não coincidem' };
  
  return { isValid: true, message: '' };
};

const validateName = (name) => {
  if (!name) return { isValid: false, message: 'O nome é obrigatório' };
  
  if (name.trim().length < 3) return { isValid: false, message: 'O nome deve ter pelo menos 3 caracteres' };
  
  return { isValid: true, message: '' };
};

// Componente de validação de força de senha
const PasswordStrengthIndicator = ({ password }) => {
  const theme = useTheme();
  
  // Calcular força da senha
  const calculateStrength = (password) => {
    if (!password) return 0;
    
    let strength = 0;
    
    // Comprimento mínimo
    if (password.length >= 6) strength += 1;
    if (password.length >= 10) strength += 1;
    
    // Complexidade
    if (/[0-9]/.test(password)) strength += 1; // Números
    if (/[a-z]/.test(password)) strength += 1; // Letras minúsculas
    if (/[A-Z]/.test(password)) strength += 1; // Letras maiúsculas
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1; // Caracteres especiais
    
    return Math.min(strength, 5); // Máximo de 5
  };
  
  const strength = calculateStrength(password);
  
  // Determinar cor e mensagem com base na força
  const getStrengthInfo = (strength) => {
    switch (strength) {
      case 0:
        return { color: 'error.main', message: 'Muito fraca' };
      case 1:
        return { color: 'error.main', message: 'Fraca' };
      case 2:
        return { color: 'warning.main', message: 'Razoável' };
      case 3:
        return { color: 'warning.main', message: 'Média' };
      case 4:
        return { color: 'success.main', message: 'Forte' };
      case 5:
        return { color: 'success.main', message: 'Muito forte' };
      default:
        return { color: 'error.main', message: 'Muito fraca' };
    }
  };
  
  const { color, message } = getStrengthInfo(strength);
  
  return (
    <Box sx={{ mt: 1, mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
        <Box sx={{ flexGrow: 1, mr: 1 }}>
          <Box sx={{ height: 4, borderRadius: 2, bgcolor: 'grey.200', position: 'relative' }}>
            <Box
              sx={{
                height: '100%',
                borderRadius: 2,
                bgcolor: color,
                width: `${(strength / 5) * 100}%`,
                transition: 'width 0.3s ease-in-out',
              }}
            />
          </Box>
        </Box>
        <Typography variant="caption" color={color} sx={{ minWidth: 80 }}>
          {message}
        </Typography>
      </Box>
      
      <Typography variant="caption" color="text.secondary">
        Use pelo menos 6 caracteres, incluindo letras e números
      </Typography>
    </Box>
  );
};

// Página de cadastro com validação avançada
const Signup = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { register, loginWithGoogle, user } = useFirebase();
  
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [establishmentName, setEstablishmentName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [displayNameError, setDisplayNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [establishmentNameError, setEstablishmentNameError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [formTouched, setFormTouched] = useState({
    displayName: false,
    email: false,
    password: false,
    confirmPassword: false,
    establishmentName: false
  });
  
  // Verificar se o usuário já está autenticado
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  // Validar campos quando mudam
  useEffect(() => {
    if (formTouched.displayName) {
      const { isValid, message } = validateName(displayName);
      setDisplayNameError(isValid ? '' : message);
    }
    
    if (formTouched.email) {
      const { isValid, message } = validateEmail(email);
      setEmailError(isValid ? '' : message);
    }
    
    if (formTouched.password) {
      const { isValid, message } = validatePassword(password);
      setPasswordError(isValid ? '' : message);
    }
    
    if (formTouched.confirmPassword) {
      const { isValid, message } = validatePasswordMatch(password, confirmPassword);
      setConfirmPasswordError(isValid ? '' : message);
    }
    
    if (formTouched.establishmentName) {
      const { isValid, message } = validateName(establishmentName);
      setEstablishmentNameError(isValid ? '' : message);
    }
  }, [displayName, email, password, confirmPassword, establishmentName, formTouched]);
  
  const handleSignup = async (e) => {
    e.preventDefault();
    
    // Marcar todos os campos como tocados para validação
    setFormTouched({
      displayName: true,
      email: true,
      password: true,
      confirmPassword: true,
      establishmentName: true
    });
    
    // Validação
    const nameValidation = validateName(displayName);
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
    const confirmPasswordValidation = validatePasswordMatch(password, confirmPassword);
    const establishmentValidation = validateName(establishmentName);
    
    setDisplayNameError(nameValidation.message);
    setEmailError(emailValidation.message);
    setPasswordError(passwordValidation.message);
    setConfirmPasswordError(confirmPasswordValidation.message);
    setEstablishmentNameError(establishmentValidation.message);
    
    if (!nameValidation.isValid || !emailValidation.isValid || 
        !passwordValidation.isValid || !confirmPasswordValidation.isValid || 
        !establishmentValidation.isValid) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Registro com Firebase
      await register(email, password, {
        displayName,
        establishmentName
      });
      
      // Após o registro bem-sucedido, o usuário será redirecionado para o dashboard
      // pelo useEffect quando o estado do usuário for atualizado
    } catch (error) {
      console.error('Erro de registro:', error);
      
      // Tratamento de erros específicos do Firebase
      let errorMsg = 'Ocorreu um erro ao criar sua conta. Tente novamente.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMsg = 'Este email já está em uso. Tente fazer login ou use outro email.';
        setEmailError('Este email já está em uso');
      } else if (error.code === 'auth/invalid-email') {
        errorMsg = 'Email inválido.';
        setEmailError('Email inválido');
      } else if (error.code === 'auth/weak-password') {
        errorMsg = 'A senha é muito fraca. Use pelo menos 6 caracteres.';
        setPasswordError('A senha é muito fraca');
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      setErrorMessage(errorMsg);
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleSignup = async () => {
    setIsLoading(true);
    
    try {
      // Autenticação com Google via Firebase
      await loginWithGoogle();
      
      // Após o login com Google, o usuário será redirecionado para completar o perfil
      // ou diretamente para o dashboard se já tiver um perfil
    } catch (error) {
      console.error('Erro de registro com Google:', error);
      
      // Tratamento de erros específicos do Firebase
      let errorMsg = 'Ocorreu um erro ao registrar com Google. Tente novamente.';
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMsg = 'O popup de login foi fechado antes da conclusão.';
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMsg = 'A solicitação de login foi cancelada.';
      } else if (error.code === 'auth/popup-blocked') {
        errorMsg = 'O popup de login foi bloqueado pelo navegador.';
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
          maxWidth: 500,
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
            Criar Conta
          </Typography>
          
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Cadastre seu estabelecimento no Fila Livre
          </Typography>
          
          <Box component="form" onSubmit={handleSignup} sx={{ mt: 4 }}>
            <CustomTextField
              label="Nome Completo"
              fullWidth
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              onBlur={() => setFormTouched(prev => ({ ...prev, displayName: true }))}
              error={!!displayNameError}
              helperText={displayNameError}
              disabled={isLoading}
              required
              startAdornment={<PersonIcon color="action" />}
              sx={{ mb: 2 }}
            />
            
            <CustomTextField
              label="Email"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setFormTouched(prev => ({ ...prev, email: true }))}
              error={!!emailError}
              helperText={emailError}
              disabled={isLoading}
              required
              startAdornment={<EmailIcon color="action" />}
              sx={{ mb: 2 }}
            />
            
            <CustomTextField
              label="Senha"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setFormTouched(prev => ({ ...prev, password: true }))}
              error={!!passwordError}
              helperText={passwordError}
              disabled={isLoading}
              required
              startAdornment={<LockIcon color="action" />}
            />
            
            {/* Indicador de força da senha */}
            <PasswordStrengthIndicator password={password} />
            
            <CustomTextField
              label="Confirmar Senha"
              type="password"
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => setFormTouched(prev => ({ ...prev, confirmPassword: true }))}
              error={!!confirmPasswordError}
              helperText={confirmPasswordError}
              disabled={isLoading}
              required
              startAdornment={<LockIcon color="action" />}
              sx={{ mb: 2 }}
            />
            
            <CustomTextField
              label="Nome do Estabelecimento"
              fullWidth
              value={establishmentName}
              onChange={(e) => setEstablishmentName(e.target.value)}
              onBlur={() => setFormTouched(prev => ({ ...prev, establishmentName: true }))}
              error={!!establishmentNameError}
              helperText={establishmentNameError}
              disabled={isLoading}
              required
              startAdornment={<StoreIcon color="action" />}
              sx={{ mb: 3 }}
            />
            
            <CustomButton
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              loading={isLoading}
              sx={{ mb: 2 }}
            >
              Cadastrar
            </CustomButton>
            
            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Ou continue com
              </Typography>
            </Divider>
            
            <CustomButton
              variant="outlined"
              color="primary"
              fullWidth
              startIcon={<GoogleIcon />}
              onClick={handleGoogleSignup}
              disabled={isLoading}
              sx={{ mb: 3 }}
            >
              Google
            </CustomButton>
            
            <Typography variant="body2" align="center">
              Já tem uma conta?{' '}
              <MuiLink
                component={Link}
                to="/"
                color="primary"
                underline="hover"
                fontWeight="medium"
              >
                Faça login
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
    </Box>
  );
};

export default Signup;
