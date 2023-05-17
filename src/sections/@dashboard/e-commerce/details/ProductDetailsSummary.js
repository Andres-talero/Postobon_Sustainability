import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { sentenceCase } from 'change-case';
import { useNavigate } from 'react-router-dom';
// form
import { Controller, useForm } from 'react-hook-form';
// @mui
import {
  Box,
  Link,
  Stack,
  Button,
  Rating,
  Divider,
  MenuItem,
  Typography,
  IconButton,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// utils
import { fShortenNumber, fCurrency } from '../../../../utils/formatNumber';
// _mock
import { _socials } from '../../../../_mock/arrays';
// components
import Label from '../../../../components/label';
import Iconify from '../../../../components/iconify';
import { IncrementerButton } from '../../../../components/custom-input';
import { ColorSinglePicker } from '../../../../components/color-utils';
import FormProvider, { RHFSelect } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

ProductDetailsSummary.propTypes = {
  cart: PropTypes.array,
  onAddCart: PropTypes.func,
  product: PropTypes.object,
  onGotoStep: PropTypes.func,
};

export default function ProductDetailsSummary({ cart, product, onAddCart, onGotoStep, ...other }) {
  const navigate = useNavigate();

  const { id, name, cover, status, tags, totalRating, totalReview } = product;

  const alreadyProduct = cart.map((item) => item.id).includes(id);

  const defaultValues = {
    id,
    name,
    cover,
  };

  const methods = useForm({
    defaultValues,
  });

  const { reset, watch, control, setValue, handleSubmit } = methods;

  const values = watch();

  useEffect(() => {
    if (product) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  const onSubmit = async (data) => {
    try {
      console.log(PATH_DASHBOARD.blog.posts(product.id));
      navigate(PATH_DASHBOARD.blog.posts(product.id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddCart = async () => {
    try {
      onAddCart({
        ...values,
        colors: [values.colors],
        subtotal: values.price * values.quantity,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack
        spacing={3}
        sx={{
          p: (theme) => ({
            md: theme.spacing(5, 5, 0, 2),
          }),
        }}
        {...other}
      >
        <Stack spacing={2}>
          <Typography variant="h5">{name}</Typography>

          {tags.map((tag, index) => (
            <Typography
              key={index}
              variant="overline"
              component="div"
              sx={{
                color: status === 'sale' ? 'error.main' : 'info.main',
              }}
            >
              {tag}
            </Typography>
          ))}

          <Stack direction="row" alignItems="center" spacing={1}>
            <Rating value={totalRating} precision={0.1} readOnly />

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              ({fShortenNumber(totalReview)}
              reviews)
            </Typography>
          </Stack>
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack direction="row" spacing={2}>
          <Button fullWidth size="large" type="submit" variant="contained">
            Take this course
          </Button>
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="center">
          {_socials.map((social) => (
            <IconButton key={social.name}>
              <Iconify icon={social.icon} />
            </IconButton>
          ))}
        </Stack>
      </Stack>
    </FormProvider>
  );
}
