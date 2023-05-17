// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 as uuidv4 } from 'uuid';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  collection,
  addDoc,
  getDoc,
  doc,
  deleteDoc,
  updateDoc,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { DB, STORAGE } from '../auth/FirebaseContext';

async function addPost(data, id) {
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

    const blob2 = new Blob([body], { type: 'text/plain' });
    console.log(blob2);

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
      course_id: id,
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

const getPost = async ({ id }) => {
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

const updateFavorite = async (id, userID, favorite) => {
  try {
    const validate = await validateUserPost(id, userID);
    console.log(validate);
    if (validate[0].favorite === false) {
      await updateUserPost(validate[0].id, id, userID, true, validate[0].comment, validate[0].view);
      const response = await updateDoc(doc(DB, 'posts', id), {
        favorite: favorite + 1,
      });
      return response;
    }
    await updateUserPost(validate[0].id, id, userID, false, validate[0].comment, validate[0].view);
    const response = await updateDoc(doc(DB, 'posts', id), {
      favorite: favorite - 1,
    });
    return response;
  } catch (error) {
    return { error: error.message };
  }
};

const addUserPost = async (postID, userID, view) => {
  try {
    const response = await addDoc(collection(DB, 'post_user'), {
      postID,
      userID,
      favorite: false,
      comment: false,
      view,
    });
    return response;
  } catch (error) {
    return { error: error.message };
  }
};

const updateUserPost = async (id, postID, userID, favorite, comment, view) => {
  try {
    const response = await updateDoc(doc(DB, 'post_user', id), {
      userID,
      favorite,
      comment,
      view,
    });
    return response;
  } catch (error) {
    return { error: error.message };
  }
};

const validateUserPost = async (postID, userID) => {
  try {
    const q = query(collection(DB, 'post_user'), where('postID', '==', postID));
    const response = await getDocs(q);
    // eslint-disable-next-line no-shadow
    const data = response.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const userPost = data.filter((item) => item.userID === userID);
    return userPost;
  } catch (error) {
    return { error: error.message };
  }
};

const updateView = async (id, userID, view) => {
  try {
    const validate = await validateUserPost(id, userID);
    if (validate.length === 0) {
      await addUserPost(id, userID, true);
      const response = await updateDoc(doc(DB, 'posts', id), {
        view: view + 1,
      });
      return response;
    }
    return null;
  } catch (error) {
    return { error: error.message };
  }
};

const addComment = async (post, user, comment) => {
  try {
    const validate = await validateUserPost(post.id, user.uid);
    await updateUserPost(
      validate[0].id,
      post.id,
      user.uid,
      validate[0].favorite,
      validate[0].comment + 1,
      validate[0].view
    );
    await updateDoc(doc(DB, 'posts', post.id), {
      comment: post.comment + 1,
    });

    const data = {
      postID: post.id,
      userID: user.uid,
      name: user.displayName,
      avatarUrl:
        'https://firebasestorage.googleapis.com/v0/b/postobon-sustainability.appspot.com/o/Postobon.png?alt=media&token=0374bc94-e78b-4dfc-92d0-e671ba719249',
      message: comment,
      postedAt: new Date().toISOString(),
      users: [],
      replyComment: [],
    };
    console.log(data);
    const response = await addDoc(collection(DB, 'post_comments'), data);
    return response;
  } catch (error) {
    return { error: error.message };
  }
};

const updateShare = async (id, share) => {
  try {
    const response = await updateDoc(doc(DB, 'posts', id), {
      share: share + 1,
    });
    return response;
  } catch (error) {
    return { error: error.message };
  }
};

export {
  addPost,
  getPost,
  getAllPost,
  deletePost,
  updatePost,
  updateFavorite,
  updateView,
  addComment,
  updateShare
};
