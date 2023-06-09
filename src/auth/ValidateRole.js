import { useAuthContext } from './useAuthContext';

const ValidateRole = (props) => {
  const { user } = useAuthContext();
  const propsR = props;

  if (user) {
    if (user.role === 'admin') {
      if (propsR.Administrador) {
        return propsR.children;
      }
      return [];
    }
    if (user.role === 'user') {
      if (propsR.User) {
        return propsR.children;
      }
      return [];
    }
  }
  return propsR.children;
};

export default ValidateRole;
