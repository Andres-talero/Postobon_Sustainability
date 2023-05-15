import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
// routes
import { useLocales } from '../../locales';
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import { BlogNewPostForm } from '../../sections/@dashboard/blog';
import { capitalize } from '../../utils/text';

// ----------------------------------------------------------------------

export default function BlogNewPostPage() {
  const { themeStretch } = useSettingsContext();
  const { translate } = useLocales();

  return (
    <>
      <Helmet>
        <title>{capitalize(translate('new_post'))}</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={capitalize(translate('new_post'))}
          links={[
            {
              name: capitalize(translate('posts')),
              href: PATH_DASHBOARD.blog.root,
            },
            {
              name: capitalize(translate('new_post')),
            },
          ]}
        />

        <BlogNewPostForm />
      </Container>
    </>
  );
}
