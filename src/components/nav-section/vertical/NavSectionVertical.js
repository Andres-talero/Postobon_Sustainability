import PropTypes from 'prop-types';
// @mui
import { List, Stack } from '@mui/material';
// locales
// eslint-disable-next-line import/no-unresolved
import ValidateRole from 'src/auth/ValidateRole';
import { useLocales } from '../../../locales';
//
import { StyledSubheader } from './styles';
import NavList from './NavList';

// ----------------------------------------------------------------------

NavSectionVertical.propTypes = {
  sx: PropTypes.object,
  data: PropTypes.array,
};

export default function NavSectionVertical({ data, sx, ...other }) {
  const { translate } = useLocales();

  return (
    <Stack sx={sx} {...other}>
      {data.map((group) => {
        const key = group.subheader || group.items[0].title;

        return (
          <List key={key} disablePadding sx={{ px: 2 }}>
            {group.subheader &&
              (group.admin ? (
                <ValidateRole Administrador>
                  <StyledSubheader disableSticky>{`${translate(group.subheader)}`}</StyledSubheader>
                </ValidateRole>
              ) : (
                <ValidateRole User>
                  <StyledSubheader disableSticky>{`${translate(group.subheader)}`}</StyledSubheader>
                </ValidateRole>
              ))}

            {group.items.map((list) => (
              <div key={list.title + list.path}>
                {list.admin ? (
                  <ValidateRole Administrador>
                    <NavList
                      key={list.title + list.path}
                      data={list}
                      depth={1}
                      hasChild={!!list.children}
                    />
                  </ValidateRole>
                ) : (
                  <ValidateRole User>
                    <NavList
                      key={list.title + list.path}
                      data={list}
                      depth={1}
                      hasChild={!!list.children}
                    />
                  </ValidateRole>
                )}
              </div>
            ))}
          </List>
        );
      })}
    </Stack>
  );
}
