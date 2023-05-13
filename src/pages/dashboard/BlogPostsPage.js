import orderBy from 'lodash/orderBy';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';
import { useEffect, useCallback, useState } from 'react';
// @mui
import { Grid, Button, Container, Stack } from '@mui/material';
// utils
import axios from '../../utils/axios';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Iconify from '../../components/iconify';
import { SkeletonPostItem } from '../../components/skeleton';
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import { BlogPostCard, BlogPostsSort, BlogPostsSearch } from '../../sections/@dashboard/blog';
import useGetAllPost from "../../hooks/useGetAllPosts";

// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Popular' },
  { value: 'oldest', label: 'Oldest' },
];

// ----------------------------------------------------------------------

export default function BlogPostsPage() {

  const { themeStretch } = useSettingsContext();

  const [postss, setPosts] = useState([]);

  const [sortBy, setSortBy] = useState('latest');

  const sortedPosts = applySortBy(postss, sortBy);

  const [posts, obtenerMasPost, hayMasPorCargar] = useGetAllPost();
  console.log(posts);

  useEffect(() => {
    if(posts.length > 0)
    {
    setPosts(posts);
    }
  }, [posts]);

  const handleChangeSortBy = (event) => {
    setSortBy(event.target.value);
  };

  return (
    <>
      <Helmet>
        <title> Blog: Posts | Minimal UI</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Blog"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Blog',
              href: PATH_DASHBOARD.blog.root,
            },
            {
              name: 'Posts',
            },
          ]}
          action={
            <Button
              component={RouterLink}
              to={PATH_DASHBOARD.blog.new}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Post
            </Button>
          }
        />

        <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          <BlogPostsSearch />
          <BlogPostsSort sortBy={sortBy} sortOptions={SORT_OPTIONS} onSort={handleChangeSortBy} />
        </Stack>

        <Grid container spacing={3}>
          {(!postss.length ? [...Array(12)] : sortedPosts).map((post, index) =>
            post ? (
              <Grid key={post.id} item xs={12} sm={6} md={(index === 0 && 6) || 3}>
                <BlogPostCard post={post} index={index} />
              </Grid>
            ) : (
              <SkeletonPostItem key={index} />
            )
          )}
        </Grid>
      </Container>
    </>
  );
}

// ----------------------------------------------------------------------

const applySortBy = (posts, sortBy) => {
  if (sortBy === 'latest') {
    return orderBy(posts, ['createdAt'], ['desc']);
  }

  if (sortBy === 'oldest') {
    return orderBy(posts, ['createdAt'], ['asc']);
  }

  if (sortBy === 'popular') {
    return orderBy(posts, ['view'], ['desc']);
  }
  return posts;
};