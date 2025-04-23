import React, { useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Campo de texto personalizado com base no MUI TextField
// Suporta diferentes variantes, validação e campo de senha com visibilidade alternável

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius,
    '&.Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
      },
    },
  },
  '& .MuiInputLabel-root': {
    '&.Mui-focused': {
      color: theme.palette.primary.main,
    },
  },
}));

const CustomTextField = ({
  label,
  type = 'text',
  value,
  onChange,
  error = false,
  helperText = '',
  fullWidth = true,
  required = false,
  disabled = false,
  placeholder = '',
  startAdornment,
  endAdornment,
  multiline = false,
  rows = 1,
  variant = 'outlined',
  size = 'medium',
  sx = {},
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <StyledTextField
      label={label}
      type={isPassword ? (showPassword ? 'text' : 'password') : type}
      value={value}
      onChange={onChange}
      error={error}
      helperText={helperText}
      fullWidth={fullWidth}
      required={required}
      disabled={disabled}
      placeholder={placeholder}
      multiline={multiline}
      rows={rows}
      variant={variant}
      size={size}
      sx={sx}
      InputProps={{
        startAdornment: startAdornment && (
          <InputAdornment position="start">{startAdornment}</InputAdornment>
        ),
        endAdornment: isPassword ? (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
              size="small"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ) : (
          endAdornment && <InputAdornment position="end">{endAdornment}</InputAdornment>
        ),
      }}
      {...props}
    />
  );
};

export default CustomTextField;
