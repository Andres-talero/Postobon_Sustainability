import { Link as RouterLink, useLocation } from 'react-router-dom';
// @mui
import { Box, Grid, Link, Stack, Divider, Container, Typography, IconButton } from '@mui/material';
// routes
import { PATH_PAGE } from '../../routes/paths';
// components
import Logo from '../../components/logo';
import Iconify from '../../components/iconify';
import { EcoBonApp } from '../../EcoBon/EcoBon';

// ----------------------------------------------------------------------

const LINKS = [
  // {
  //   headline: 'Minimal',
  //   children: [{ name: 'Sobre EcoBón', href: PATH_PAGE.about }],
  // },
  // {
  //   headline: 'Proyecto',
  //   children: [
  //     { name: 'Terms and Condition', href: '#' },z
  //     { name: 'Privacy Policy', href: '#' },
  //   ],
  // },
  // {
  //   headline: 'Contact',
  //   children: [
  //     { name: 'support@minimals.cc', href: '#' },
  //     { name: 'Los Angeles, 359  Hidden Valley Road', href: '#' },
  //   ],
  // },
];

// ----------------------------------------------------------------------

export default function Footer() {
  const { pathname } = useLocation();

  const isHome = pathname === '/';

  const simpleFooter = (
    <Box
      component="footer"
      sx={{
        py: 5,
        textAlign: 'center',
        position: 'relative',
        bgcolor: 'background.default',
      }}
    >
      <Container>
        <Logo sx={{ mb: 1, mx: 'auto' }} />

        <Typography variant="caption" component="div">
          © Derechos Reservados
          <br /> Hecho por&nbsp;
          <Link href={EcoBonApp.github.kevgogo}>Kevin Gómez</Link>&nbsp;&amp;&nbsp;
          <Link href={EcoBonApp.github.wiltalero}>Andres Talero</Link>
        </Typography>
      </Container>
    </Box>
  );

  const mainFooter = (
    <Box
      component="footer"
      sx={{
        position: 'relative',
        bgcolor: 'background.default',
      }}
    >
      <Divider />

      <Container sx={{ pt: 10 }}>
        <Grid
          container
          justifyContent={{
            xs: 'center',
            md: 'space-between',
          }}
          sx={{
            textAlign: {
              xs: 'center',
              md: 'left',
            },
          }}
        >
          <Grid item xs={12} sx={{ mb: 3 }}>
            <Logo sx={{ mx: { xs: 'auto', md: 'inherit' } }} />
          </Grid>

          <Grid item xs={8} md={3}>
            <Typography variant="body2" sx={{ pr: { md: 5 } }}>
              El punto de entrada para aprender de forma sustentable.
            </Typography>
          </Grid>

          <Grid item xs={12} md={7}>
            <Stack
              spacing={5}
              justifyContent="space-between"
              direction={{ xs: 'column', md: 'row' }}
            >
              {LINKS.map((list) => (
                <Stack
                  key={list.headline}
                  spacing={2}
                  alignItems={{ xs: 'center', md: 'flex-start' }}
                >
                  <Typography component="div" variant="overline">
                    {list.headline}
                  </Typography>

                  {list.children.map((link) => (
                    <Link
                      key={link.name}
                      component={RouterLink}
                      to={link.href}
                      color="inherit"
                      variant="body2"
                    >
                      {link.name}
                    </Link>
                  ))}
                </Stack>
              ))}
            </Stack>
          </Grid>
        </Grid>

        <Typography
          variant="caption"
          component="div"
          sx={{
            mt: 10,
            pb: 5,
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          © 2021. All rights reserved
        </Typography>
      </Container>
    </Box>
  );

  return isHome ? simpleFooter : mainFooter;
}
