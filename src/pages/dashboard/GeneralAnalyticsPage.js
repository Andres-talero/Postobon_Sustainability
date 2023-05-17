import { Helmet } from 'react-helmet-async';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// _mock_
import { _analyticPost, _analyticOrderTimeline, _analyticTraffic } from '../../_mock/arrays';
// components
import { useSettingsContext } from '../../components/settings';
// sections
import {
  AnalyticsTasks,
  AnalyticsNewsUpdate,
  AnalyticsOrderTimeline,
  AnalyticsCurrentVisits,
  AnalyticsWebsiteVisits,
  AnalyticsTrafficBySite,
  AnalyticsWidgetSummary,
  AnalyticsCurrentSubject,
  AnalyticsConversionRates,
} from '../../sections/@dashboard/general/analytics';
import useGetViewsOfCourse from '../../hooks/useGetViewsOfCourses';
import useGetStadistics from '../../hooks/useGetStadistics';
import useGetViewsOfPosts from '../../hooks/useGetViewsOfPosts';
import { useLocales } from '../../locales';
import { capitalize } from '../../utils/text';
// ----------------------------------------------------------------------

export default function GeneralAnalyticsPage() {
  const theme = useTheme();

  const { themeStretch } = useSettingsContext();

  const { translate } = useLocales();

  const [courseViews] = useGetViewsOfCourse();

  const [userAmount, coursesAmount, postsAmount, viewPostAmount] = useGetStadistics();

  const [postViews] = useGetViewsOfPosts();

  console.log(postViews);

  const maxValue = (array) => {
    const high = array.reduce((max, obj) => (obj.value > max.value ? obj : max));
    return `El curso ${high.name} tuvo la mayor cantidad de vistas, siendo estas de ${high.value} vistas`;
  };

  return (
    <>
      <Helmet>
        <title>Analytics</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h4" sx={{ mb: 5 }}>
          {capitalize(translate('hi_welcome_back'))}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title={capitalize(translate('user_amount'))}
              total={userAmount}
              icon="ant-design:user-outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title={capitalize(translate('course_amount'))}
              total={coursesAmount}
              color="info"
              icon="ant-design:book-outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title={capitalize(translate('post_amount'))}
              total={postsAmount}
              color="warning"
              icon="ant-design:file-outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title={capitalize(translate('view_post_amount'))}
              total={viewPostAmount}
              color="error"
              icon="ant-design:eye-outlined"
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            {courseViews !== null && (
              <AnalyticsConversionRates
                title={capitalize(translate('course_views'))}
                subheader={maxValue(courseViews)}
                chart={{
                  series: courseViews,
                }}
              />
            )}
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            {postViews !== null && (
              <AnalyticsCurrentVisits
                title={capitalize(translate('post_views'))}
                chart={{
                  series: postViews,
                  colors: [
                    theme.palette.primary.main,
                    theme.palette.info.main,
                    theme.palette.error.main,
                    theme.palette.warning.main,
                  ],
                }}
              />
            )}
          </Grid>

          {/*

          <Grid item xs={12} md={6} lg={8}>
            <AnalyticsWebsiteVisits
              title="Website Visits"
              subheader="(+43%) than last year"
              chart={{
                labels: [
                  '01/01/2003',
                  '02/01/2003',
                  '03/01/2003',
                  '04/01/2003',
                  '05/01/2003',
                  '06/01/2003',
                  '07/01/2003',
                  '08/01/2003',
                  '09/01/2003',
                  '10/01/2003',
                  '11/01/2003',
                ],
                series: [
                  {
                    name: 'Team A',
                    type: 'column',
                    fill: 'solid',
                    data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                  },
                  {
                    name: 'Team B',
                    type: 'area',
                    fill: 'gradient',
                    data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                  },
                  {
                    name: 'Team C',
                    type: 'line',
                    fill: 'solid',
                    data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                  },
                ],
              }}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AnalyticsCurrentSubject
              title="Current Subject"
              chart={{
                categories: ['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math'],
                series: [
                  { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                  { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                  { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
                ],
              }}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AnalyticsNewsUpdate title="News Update" list={_analyticPost} />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AnalyticsOrderTimeline title="Order Timeline" list={_analyticOrderTimeline} />
          </Grid> */}
          {/* 
          <Grid item xs={12} md={6} lg={4}>
            <AnalyticsTrafficBySite title="Traffic by Site" list={_analyticTraffic} />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={8}>
            <AnalyticsTasks
              title="Tasks"
              list={[
                { id: '1', label: 'Create FireStone Logo' },
                { id: '2', label: 'Add SCSS and JS files if required' },
                { id: '3', label: 'Stakeholder Meeting' },
                { id: '4', label: 'Scoping & Estimations' },
                { id: '5', label: 'Sprint Showcase' },
              ]}
            />
          </Grid> */}
        </Grid>
      </Container>
    </>
  );
}
