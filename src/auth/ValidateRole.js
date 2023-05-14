import React from 'react';
import { useAuthContext } from './useAuthContext';

const ValidateRole = (props) => {
  const { user } = useAuthContext();
  const propsR = props;

  if (user) {
    if (user.rol === 'admin') {
      if (propsR.Administrador) {
        return props.children;
      } else {
        return <></>;
      }
    } else if (user.rol === 'user') {
      if (propsR.User) {
        return props.children;
      } else {
        return <></>;
      }
    } else {
      return null;
    }
  }
};

export default ValidateRole;
