import { Helmet } from 'react-helmet-async';
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { Box, Divider, Stack, Container, Typography, Pagination } from '@mui/material';
// routes
// eslint-disable-next-line import/no-unresolved
import { PATH_DASHBOARD } from '../../routes/paths';
// utils
import axios from '../../utils/axios';
// components
import Markdown from '../../components/markdown';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import { SkeletonPostDetails } from '../../components/skeleton';
import { useLocales } from 'src/locales';
// sections
import {
  BlogPostHero,
  BlogPostTags, 
  BlogPostCard,
  BlogPostCommentList,
  BlogPostCommentForm,
} from '../../sections/@dashboard/blog';
import useGetPost from '../../hooks/useGetPost';
import useGetRecentPosts from '../../hooks/useGetRecentPosts';
import { useAuthContext } from '../../auth/useAuthContext';
import { updateView } from '../../firebase/post';
import { capitalize } from '../../utils/text';
import useGetAllCommentsByPost from '../../hooks/useGetAllCommentsByPost';

// ----------------------------------------------------------------------

export default function BlogPostPage() {
  const { themeStretch } = useSettingsContext();

  const { title } = useParams();

  const { user } = useAuthContext();

  console.log(user);

  const [post] = useGetPost({ id: title });

  const [recentPosts, setRecentPosts] = useState([]);

  const [loadingPost, setLoadingPost] = useState(true);

  const [errorMsg, setErrorMsg] = useState(null);

  const [body, setBody] = useState(null);

  const [posts] = useGetRecentPosts();

  const [comments] = useGetAllCommentsByPost(title);

  console.log(comments);

  const { translate } = useLocales();

  const getPostFunction = useCallback(async () => {
    try {
      const textUrl = post.content;
      //acceder a textUrl y extraer el texto
      const response = await axios.get(textUrl);
      const text = response.data;
      setBody(text);
      setLoadingPost(false);
    } catch (error) {
      console.error(error);
      setLoadingPost(false);
      setErrorMsg(error.message);
    }
  }, [post]);

  useEffect(() => {
    if (posts.length > 0) {
      setRecentPosts(posts);
    }
  }, [posts]);

  useEffect(() => {
    if (post !== null) {
      getPostFunction();
    }
  }, [getPostFunction, post]);

  useEffect(() => {
    if (post !== null && user !== null) {
      const { id, view } = post;
      const { uid } = user;
      const updateViewFunction = async () => {
        await updateView(id, uid, view);
      };
      setTimeout(() => {
        updateViewFunction();
      }, 2000);
    }
  }, [post, user]);

  return (
    <>
      <Helmet>
        <title>{`Blog: ${post?.title || ''} | Minimal UI`}</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={capitalize(translate('post'))}
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
              name: post?.title,
            },
          ]}
        />

        {post && (
          <Stack
            sx={{
              borderRadius: 2,
              boxShadow: (theme) => ({
                md: theme.customShadows.card,
              }),
            }}
          >
            <BlogPostHero post={post} />

            <Typography
              variant="h6"
              sx={{
                py: 5,
                px: { md: 5 },
              }}
            >
              {post.description}
            </Typography>

            <Markdown
              children={body}
              sx={{
                px: { md: 5 },
              }}
            />
            <Stack
              spacing={3}
              sx={{
                py: 5,
                px: { md: 5 },
              }}
            >
              <Divider />

              <BlogPostTags post={post} user={user} />

              <Divider />
            </Stack>

            <Stack
              sx={{
                px: { md: 5 },
              }}
            >
              <Stack direction="row" sx={{ mb: 3 }}>
                <Typography variant="h4">Comments</Typography>

                <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
                  ({post.comment})
                </Typography>
              </Stack>

              <BlogPostCommentForm post={post} user={user} />

              <Divider sx={{ mt: 5, mb: 2 }} />
            </Stack>

            <Stack
              sx={{
                px: { md: 5 },
              }}
            >
              <BlogPostCommentList comments={comments} />

              {/* <Pagination
                count={8}
                sx={{
                  my: 5,
                  ml: 'auto',
                  mr: { xs: 'auto', md: 0 },
                }}
              /> */}
            </Stack>
          </Stack>
        )}

        {errorMsg && !loadingPost && <Typography variant="h6">404 {errorMsg}</Typography>}

        {loadingPost && <SkeletonPostDetails />}

        {!!recentPosts.length && (
          <>
            <Typography variant="h4" sx={{ my: 5 }}>
              Recent posts
            </Typography>

            <Box
              gap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(4, 1fr)',
              }}
            >
              {recentPosts.slice(recentPosts.length - 4).map((recentPost) => (
                <BlogPostCard key={recentPost.id} post={recentPost} />
              ))}
            </Box>
          </>
        )}
      </Container>
    </>
  );
}
