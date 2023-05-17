import PropTypes from 'prop-types';
import { paramCase } from 'change-case';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Box, Card, Link, Stack, Fab } from '@mui/material';
// routes
import { capitalize } from '../../../../utils/text';
import { PATH_DASHBOARD } from '../../../../routes/paths';
// utils
import { fCurrency } from '../../../../utils/formatNumber';
// redux
import { useDispatch } from '../../../../redux/store';
import { addToCart } from '../../../../redux/slices/product';
// components
import Iconify from '../../../../components/iconify';
import Label from '../../../../components/label';
import Image from '../../../../components/image';
import { ColorPreview } from '../../../../components/color-utils';

// ----------------------------------------------------------------------

ShopProductCard.propTypes = {
  product: PropTypes.object,
};

export default function ShopProductCard({ product }) {
  const { id, name, cover, status } = product;

  const dispatch = useDispatch();

  const linkTo = PATH_DASHBOARD.eCommerce.view(id);

  const handleAddCart = async () => {
    const newProduct = {
      id,
      name,
      cover,
      quantity: 1,
    };
    try {
      dispatch(addToCart(newProduct));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card
      sx={{
        '&:hover .add-cart-btn': {
          opacity: 1,
        },
      }}
    >
      <Box sx={{ position: 'relative', p: 1 }}>
        {status && (
          <Label
            variant="filled"
            color={(status === 'sale' && 'error') || 'info'}
            sx={{
              top: 16,
              right: 16,
              zIndex: 9,
              position: 'absolute',
              textTransform: 'uppercase',
            }}
          >
            {status}
          </Label>
        )}

        <Image alt={name} src={cover} ratio="1/1" sx={{ borderRadius: 1.5 }} />
      </Box>

      <Stack spacing={2.5} sx={{ p: 3 }}>
        <Link component={RouterLink} to={linkTo} color="inherit" variant="subtitle2" noWrap>
          {capitalize(name)}
        </Link>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={0.5} sx={{ typography: 'subtitle1' }} />
        </Stack>
      </Stack>
    </Card>
  );
}
