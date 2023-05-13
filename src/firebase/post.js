// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 as uuidv4 } from 'uuid';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, getDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { DB, STORAGE } from '../auth/FirebaseContext';

async function addPost(data) {
  try {
    const filename = `${uuidv4()}`;
    console.log(filename);
    const storageRef = await ref(STORAGE, filename);

    const imageRute = await uploadBytes(storageRef, data.cover).then((snapshot) => {
      const rute = getDownloadURL(snapshot.ref).then((url) => url);
      return rute;
    });

    const body = data.content.replace(/"/g, "'").toString();

    const filename2 = `${uuidv4()}`;

    const blob2 = new Blob([body], { type: 'text/html' });

    const storageRef2 = await ref(STORAGE, filename2);

    const fileRute = await uploadBytes(storageRef2, blob2).then((snapshot) => {
      const rute = getDownloadURL(snapshot.ref).then((url) => url);
      return rute;
    });

    const payload = {
      title: data.title,
      description: data.description,
      content: fileRute,
      cover: {
        path: data.cover.path,
        preview: imageRute,
      },
      tags: data.tags,
      publish: data.publish,
      comments: data.comments,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      metaKeywords: data.metaKeywords,
      comment: 0,
      favorite: 0,
      share: 0,
      view: 0,
      createdAt: new Date().toISOString(),
      favoritePerson: [],
      author: {
        avatarUrl:
          'https://firebasestorage.googleapis.com/v0/b/postobon-sustainability.appspot.com/o/Postobon.png?alt=media&token=0374bc94-e78b-4dfc-92d0-e671ba719249',
        name: 'Postobon',
      },
    };
    const response = await addDoc(collection(DB, 'posts'), payload);
    return response;
  } catch (error) {
    return { error: error.message };
  }
}

const getAllPost = async () => {
  try {
    const response = await getDoc(collection(DB, 'posts'));
    console.log(response);
    return response.exists() ? response.data() : null;
  } catch (error) {
    return { error: error.message };
  }
};

const getPost = async (id) => {
  try {
    const response = await getDoc(doc(DB, 'posts', id));
    return response.exists() ? response.data() : null;
  } catch (error) {
    return { error: error.message };
  }
};

const deletePost = async (id) => {
  try {
    const response = await deleteDoc(doc(DB, 'posts', id));
    return response;
  } catch (error) {
    return { error: error.message };
  }
};

const updatePost = async ({
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
    const response = await updateDoc(doc(DB, 'post', id), {
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

export { addPost, getPost, getAllPost, deletePost, updatePost };
