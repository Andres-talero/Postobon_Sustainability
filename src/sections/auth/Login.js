import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Alert, Tooltip, Stack, Typography, Link, Box } from '@mui/material';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// routes
import { PATH_AUTH } from '../../routes/paths';
// layouts
import LoginLayout from '../../layouts/login';
//
import AuthLoginForm from './AuthLoginForm';
import AuthWithSocial from './AuthWithSocial';
import { EcoBonApp } from '../../EcoBon/EcoBon';

// ----------------------------------------------------------------------

export default function Login() {
  const { method } = useAuthContext();
  const COLORS = ['info'];

  return (
    <LoginLayout>
      <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
        <Typography variant="h4">{EcoBonApp.signInTitle}</Typography>

        <Stack direction="row" spacing={0.5}>
          <Typography variant="body2">{EcoBonApp.newUserText}</Typography>

          <Link component={RouterLink} to={PATH_AUTH.register} variant="subtitle2">
            {EcoBonApp.createNewAccount}
          </Link>
        </Stack>
      </Stack>

      {/* <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
        {COLORS.map((color) => (
          <Alert key={color} severity={color} onClose={() => {}}>
            Correo de Prueba: <strong>demo@ecobon.com</strong>&nbsp;/&nbsp;Password:{' '}
            <strong>demo1234</strong>
          </Alert>
        ))}
      </Stack> */}

      <AuthLoginForm />
    </LoginLayout>
  );
}
