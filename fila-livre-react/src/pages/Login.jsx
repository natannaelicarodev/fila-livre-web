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
  CircularProgress
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import CustomTextField from '../components/common/CustomTextField';
import CustomButton from '../components/common/CustomButton';
import GoogleIcon from '@mui/icons-material/Google';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { useFirebase } from '../contexts/FirebaseContext';

// Componente de redirecionamento após login
const RedirectHandler = () => {
  const { user, loading } = useFirebase();
  const navigate = useNavigate();
  const location = useLocation();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    // Verificar se há um redirecionamento pendente no localStorage
    const pendingRedirect = localStorage.getItem('filaLivre_pendingRedirect');

    if (user && !loading && !redirecting) {
      setRedirecting(true);

      // Verificar se há um redirecionamento específico na URL
      const searchParams = new URLSearchParams(location.search);
      const redirectTo = searchParams.get('redirect');

      // Determinar para onde redirecionar
      let targetPath = '/dashboard'; // Padrão

      if (redirectTo) {
        // Redirecionar para o caminho especificado na URL
        targetPath = redirectTo;
      } else if (pendingRedirect) {
        // Redirecionar para o caminho salvo no localStorage
        targetPath = pendingRedirect;
        localStorage.removeItem('filaLivre_pendingRedirect');
      }

      // Verificar se o usuário tem um estabelecimento
      // Em um app real, verificaríamos isso no contexto do Firebase
      const hasEstablishment = localStorage.getItem('filaLivre_hasEstablishment') === 'true';

      if (!hasEstablishment) {
        // Se o usuário não tiver um estabelecimento, redirecionar para a página de criação
        targetPath = '/create-establishment';
      }

      // Redirecionar para o caminho determinado
      navigate(targetPath, { replace: true });
      console.log("user", user)
    }
  }, [user, loading, navigate, location.search, redirecting]);

  return null;
};

// Página de login com redirecionamento
const Login = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { login, loginWithGoogle, user, loading: authLoading } = useFirebase();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Verificar se há mensagem de sucesso na URL (ex: após redefinição de senha)
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const success = searchParams.get('success');

    if (success === 'password_reset') {
      setSuccessMessage('Sua senha foi redefinida com sucesso. Faça login com sua nova senha.');
      setShowSuccess(true);
    }
  }, []);

  // Verificar se há credenciais salvas no localStorage
  useEffect(() => {
    const savedEmail = localStorage.getItem('filaLivre_email');
    const savedRememberMe = localStorage.getItem('filaLivre_rememberMe') === 'true';
    const saveDisplayName = localStorage.setItem('filaLivre_displayName', user?.providerData[0].displayName)
    console.log('filaLivre_email')
    // if (window.location.search == '/')
    //   localStorage.setItem('filaLivre_displayName', null)
    // localStorage.setItem('filaLivre_email', null);
    if (savedEmail && savedRememberMe) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const validateEmail = (email) => {
    if (!email) return { isValid: false, message: 'O email é obrigatório' };

    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) return { isValid: false, message: 'Email inválido' };

    return { isValid: true, message: '' };
  };

  const validatePassword = (password) => {
    if (!password) return { isValid: false, message: 'A senha é obrigatória' };

    if (password.length < 6) return { isValid: false, message: 'A senha deve ter pelo menos 6 caracteres' };

    return { isValid: true, message: '' };
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validação
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    setEmailError(emailValidation.message);
    setPasswordError(passwordValidation.message);

    if (!emailValidation.isValid || !passwordValidation.isValid) {
      return;
    }

    setIsLoading(true);

    try {
      // Salvar email no localStorage se "Lembrar-me" estiver marcado
      if (rememberMe) {
        localStorage.setItem('filaLivre_email', email);
        localStorage.setItem('filaLivre_rememberMe', 'true');
      } else {
        localStorage.removeItem('filaLivre_email');
        localStorage.removeItem('filaLivre_rememberMe');
      }

      // Autenticação com Firebase
      await login(email, password);

      // O redirecionamento é tratado pelo componente RedirectHandler
    } catch (error) {
      console.error('Erro de login:', error);

      // Tratamento de erros específicos
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setEmailError('');
        setPasswordError('Email ou senha incorretos');
      } else {
        setErrorMessage(error.message || 'Ocorreu um erro ao fazer login. Tente novamente.');
        setShowError(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);

    try {
      // Autenticação com Google via Firebase
      await loginWithGoogle();
      setTimeout(() => {
        setIsLoading(false);
        // Aqui seria implementada a integração real com Firebase
        window.location.href = '/dashboard';
      }, 1500);
      // O redirecionamento é tratado pelo componente RedirectHandler
    } catch (error) {
      console.error('Erro de login com Google:', error);

      setErrorMessage(error.message || 'Ocorreu um erro ao fazer login com Google. Tente novamente.');
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
      {/* Componente de redirecionamento */}
      <RedirectHandler />

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
            Fila Livre
          </Typography>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            Painel do Estabelecimento
          </Typography>

          {authLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box component="form" onSubmit={handleLogin} sx={{ mt: 4 }}>
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
                sx={{ mb: 2 }}
              />

              <CustomTextField
                label="Senha"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!passwordError}
                helperText={passwordError}
                disabled={isLoading}
                required
                startAdornment={<LockIcon color="action" />}
                sx={{ mb: 3 }}
              />

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 3,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    id="remember-me"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ marginRight: 8 }}
                  />
                  <Typography variant="body2" component="label" htmlFor="remember-me">
                    Lembrar-me
                  </Typography>
                </Box>

                <MuiLink
                  component={Link}
                  to="/forgot-password"
                  variant="body2"
                  color="primary"
                  underline="hover"
                >
                  Esqueceu a senha?
                </MuiLink>
              </Box>

              <CustomButton
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                loading={isLoading}
                sx={{ mb: 2 }}
              >
                Entrar
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
                onClick={handleGoogleLogin}
                disabled={isLoading}
                sx={{ mb: 3 }}
              >
                Google
              </CustomButton>

              <Typography variant="body2" align="center">
                Não tem uma conta?{' '}
                <MuiLink
                  component={Link}
                  to="/Signup"
                  color="primary"
                  underline="hover"
                  fontWeight="medium"
                >
                  Cadastre-se
                </MuiLink>
              </Typography>
            </Box>
          )}
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

export default Login;
