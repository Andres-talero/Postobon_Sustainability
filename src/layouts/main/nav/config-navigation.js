// routes
import { PATH_AUTH, PATH_ECOBON, PATH_PAGE } from '../../../routes/paths';
// config
import { PATH_AFTER_LOGIN } from '../../../config-global';
// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

const navConfig = [
  {
    title: 'Home',
    icon: <Iconify icon="eva:home-fill" />,
    path: '/',
  },
  { title: '¿Que es EcoBón?', path: PATH_PAGE.about },
  { title: 'Postobón', path: PATH_ECOBON.cliente },
  { title: 'U EAN', path: PATH_ECOBON.universidad },
];

export default navConfig;
