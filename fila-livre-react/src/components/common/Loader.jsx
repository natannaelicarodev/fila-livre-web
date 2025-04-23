import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

// Componente de carregamento personalizado com base no MUI CircularProgress
// Suporta diferentes tamanhos e mensagens de carregamento

const LoaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(3),
}));

const Loader = ({
  size = 40,
  color = 'primary',
  thickness = 3.6,
  message = 'Carregando...',
  fullScreen = false,
  sx = {},
}) => {
  const loader = (
    <LoaderContainer sx={sx}>
      <CircularProgress
        size={size}
        color={color}
        thickness={thickness}
        sx={{ mb: message ? 2 : 0 }}
      />
      {message && (
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
        >
          {message}
        </Typography>
      )}
    </LoaderContainer>
  );

  if (fullScreen) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          zIndex: 9999,
        }}
      >
        {loader}
      </Box>
    );
  }

  return loader;
};

export default Loader;
