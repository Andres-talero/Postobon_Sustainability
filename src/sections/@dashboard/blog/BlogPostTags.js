import PropTypes from 'prop-types';
// @mui
import { Chip, Avatar, Checkbox, Stack, FormControlLabel } from '@mui/material';
// utils
import { fShortenNumber } from '../../../utils/formatNumber';
// components
import Iconify from '../../../components/iconify';
import { CustomAvatarGroup } from '../../../components/custom-avatar';
import { updateFavorite } from 'src/firebase/post';

// ----------------------------------------------------------------------

BlogPostTags.propTypes = {
  post: PropTypes.object,
};

export default function BlogPostTags({ post, user }) {
  const { id, favorite, tags, favoritePerson } = post;

  const handleFavorite = async () => {
    await updateFavorite(id, user.uid, favorite);
  };

  return (
    <>
      <Stack direction="row" flexWrap="wrap">
        {tags.map((tag) => (
          <Chip key={tag} label={tag} sx={{ m: 0.5 }} />
        ))}
      </Stack>

      <Stack direction="row" alignItems="center">
        <FormControlLabel
          control={
            <Checkbox
              defaultChecked
              size="small"
              onClick={handleFavorite}
              color="error"
              icon={<Iconify icon="eva:heart-fill" />}
              checkedIcon={<Iconify icon="eva:heart-fill" />}
            />
          }
          label={fShortenNumber(favorite)}
        />

        <CustomAvatarGroup>
          {favoritePerson.map((person) => (
            <Avatar key={person.name} alt={person.name} src={person.avatarUrl} />
          ))}
        </CustomAvatarGroup>
      </Stack>
    </>
  );
}
