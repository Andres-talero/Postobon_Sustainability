import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Link, Typography } from '@mui/material';
// routes
import { PATH_AUTH } from '../../routes/paths';
// components
import Iconify from '../../components/iconify';
// sections
import AuthResetPasswordForm from '../../sections/auth/AuthResetPasswordForm';
// assets
import { PasswordIcon } from '../../assets/icons';

// ----------------------------------------------------------------------

export default function ResetPasswordPage() {
  return (
    <>
      <Helmet>
        <title> Reset Password | EcoBón</title>
      </Helmet>

      <PasswordIcon sx={{ mb: 5, height: 96 }} />

      <Typography variant="h3" paragraph>
        ¿Olvidaste tu clave?
      </Typography>

      <Typography sx={{ color: 'text.secondary', mb: 5 }}>
        Ingrese la dirección de correo electrónico asociada con su cuenta y le enviaremos un enlace
        para restablecer su contraseña.
      </Typography>

      <AuthResetPasswordForm />

      <Link
        component={RouterLink}
        to={PATH_AUTH.login}
        color="inherit"
        variant="subtitle2"
        sx={{
          mt: 3,
          mx: 'auto',
          alignItems: 'center',
          display: 'inline-flex',
        }}
      >
        <Iconify icon="eva:chevron-left-fill" width={16} />
        Inicio de Sesión
      </Link>
    </>
  );
}
