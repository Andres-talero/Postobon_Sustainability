import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import FormProvider, { RHFTextField } from '../../../../components/hook-form';
import { addComment } from "../../../../firebase/post"

// ----------------------------------------------------------------------

export default function BlogPostCommentForm({ post, user }) {
  const CommentSchema = Yup.object().shape({
    comment: Yup.string().required('Comment is required'),
    name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
  });

  const defaultValues = {
    comment: '',
    name: '',
    email: '',
  };

  const methods = useForm({
    resolver: yupResolver(CommentSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const uploadComment = await addComment(post, user, e.target.comment.value);
      console.log(uploadComment);
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} alignItems="flex-end">
        <RHFTextField
          name="comment"
          placeholder="Write some of your comments..."
          multiline
          rows={3}
        />

        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          Post comment
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
