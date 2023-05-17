import PropTypes from 'prop-types';
import * as Yup from 'yup';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {
  Stack,
  Button,
  Rating,
  Dialog,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
  FormHelperText,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { useAuthContext } from '../../../../auth/useAuthContext';
import FormProvider, { RHFTextField } from '../../../../components/hook-form';
import { updateCourseReview, updateRating } from '../../../../firebase/course';

// ----------------------------------------------------------------------

ProductDetailsNewReviewForm.propTypes = {
  onClose: PropTypes.func,
  product: PropTypes.object.isRequired,
};

export default function ProductDetailsNewReviewForm({ onClose, product, ...other }) {
  const ReviewSchema = Yup.object().shape({
    rating: Yup.mixed().required('Rating is required'),
    review: Yup.string().required('Review is required'),
    name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
  });

  const { user } = useAuthContext();

  console.log('product', product);

  const defaultValues = {
    rating: null,
    review: '',
    name: '',
    email: '',
  };

  const methods = useForm({
    resolver: yupResolver(ReviewSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      const raitings = product.ratings;

      const numberOfStars = Number(data.rating);

      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < raitings.length; i++) {
        if (i + 1 === numberOfStars) {
          // eslint-disable-next-line operator-assignment
          raitings[i].starCount = raitings[i].starCount + numberOfStars;
          // eslint-disable-next-line no-plusplus
          raitings[i].reviewCount++;
        }
      }

      let totalStars = 0;
      let totalReviews = 0;

      raitings.forEach((item) => {
        totalStars += item.starCount;
        totalReviews += item.reviewCount;
      });

      const average = totalStars / totalReviews;
      const averageFixed = average.toFixed(1);

      const body = {
        name: data.name,
        comment: data.review,
        email: data.email,
        rating: Number(data.rating),
        isPurchased: true,
        helpful: 0,
        postedAt: new Date().toISOString(),
      };
      const { reviews } = product;
      reviews.push(body);
      await updateCourseReview({
        id: product.id,
        review: reviews,
        ratings: raitings,
        totalRating: averageFixed,
        totalReview: totalReviews,
      });
      await updateRating(product.id, user.uid, true);
      reset();
      onClose();
      console.log('DATA', data);
    } catch (error) {
      console.error(error);
    }
  };

  const onCancel = () => {
    onClose();
    reset();
  };

  return (
    <Dialog onClose={onClose} {...other}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle> Add Review </DialogTitle>

        <DialogContent>
          <Stack direction="row" flexWrap="wrap" alignItems="center" spacing={1.5}>
            <Typography variant="body2">Your review about this product:</Typography>

            <Controller
              name="rating"
              control={control}
              render={({ field }) => <Rating {...field} value={Number(field.value)} />}
            />
          </Stack>

          {!!errors.rating && <FormHelperText error> {errors.rating?.message}</FormHelperText>}

          <RHFTextField name="review" label="Review *" multiline rows={3} sx={{ mt: 3 }} />

          <RHFTextField name="name" label="Name *" sx={{ mt: 3 }} />

          <RHFTextField name="email" label="Email *" sx={{ mt: 3 }} />
        </DialogContent>

        <DialogActions>
          <Button color="inherit" variant="outlined" onClick={onCancel}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Post review
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
