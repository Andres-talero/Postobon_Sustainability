import { collection, addDoc, getDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { DB } from '../auth/FirebaseContext';

const addClient = async ({
  nombres,
  apellidos,
  documento,
  correo,
  celular,
  dirección,
  ciudad,
  fecha,
  uidUsuario,
}) => {
  try {
    const response = await addDoc(collection(DB, 'clientes'), {
      nombres: nombres.toUpperCase(),
      apellidos: apellidos.toUpperCase(),
      documento: Number(documento),
      correo,
      celular: Number(celular),
      direccion: dirección.toUpperCase(),
      ciudad: ciudad.toUpperCase(),
      fecha,
      usuario_creador: uidUsuario,
    });
    return response;
  } catch (error) {
    return { error: error.message };
  }
};

const getClient = async (id) => {
  try {
    const response = await getDoc(doc(DB, 'clientes', id));
    return response.exists() ? response.data() : null;
  } catch (error) {
    return { error: error.message };
  }
};

const deleteClient = async (id) => {
  try {
    const response = await deleteDoc(doc(DB, 'clientes', id));
    return response;
  } catch (error) {
    return { error: error.message };
  }
};

const updateCliente = async ({
  id,
  nombres,
  apellidos,
  documento,
  correo,
  celular,
  dirección,
  ciudad,
  fecha,
}) => {
  try {
    const response = await await updateDoc(doc(DB, 'clientes', id), {
      nombres: nombres.toUpperCase(),
      apellidos: apellidos.toUpperCase(),
      documento: Number(documento),
      correo,
      celular: Number(celular),
      direccion: dirección.toUpperCase(),
      ciudad: ciudad.toUpperCase(),
      fecha,
    });
    return response;
  } catch (error) {
    return { error: error.message };
  }
};

export { addClient, getClient, deleteClient, updateCliente as editarCliente };
