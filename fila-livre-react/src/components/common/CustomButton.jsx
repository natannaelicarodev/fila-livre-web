import React from 'react';
import { Button, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

// Botão personalizado com base no MUI Button
// Suporta diferentes variantes e estados de carregamento

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: 'none',
  '&:hover': {
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  '&.MuiButton-sizeLarge': {
    padding: '12px 24px',
    fontSize: '1rem',
  },
  '&.MuiButton-sizeSmall': {
    padding: '6px 12px',
    fontSize: '0.8rem',
  },
}));

const CustomButton = ({
  children,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  loading = false,
  startIcon,
  endIcon,
  onClick,
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      color={color}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      startIcon={loading ? null : startIcon}
      endIcon={loading ? null : endIcon}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <>
          <CircularProgress
            size={24}
            color="inherit"
            style={{ marginRight: children ? 8 : 0 }}
          />
          {children}
        </>
      ) : (
        children
      )}
    </StyledButton>
  );
};

export default CustomButton;
