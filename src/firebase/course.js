// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 as uuidv4 } from 'uuid';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  collection,
  addDoc,
  getDoc,
  doc,
  updateDoc,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { DB, STORAGE } from '../auth/FirebaseContext';

async function addCourse(data) {
  try {
    const filename = `${uuidv4()}`;
    const storageRef = await ref(STORAGE, filename);

    const imageRute = await uploadBytes(storageRef, data.images).then((snapshot) => {
      const rute = getDownloadURL(snapshot.ref).then((url) => url);
      return rute;
    });

    const body = data.description.replace(/"/g, "'").toString();

    const filename2 = `${uuidv4()}`;

    const blob2 = new Blob([body], { type: 'text/plain' });
    console.log(blob2);

    const storageRef2 = await ref(STORAGE, filename2);

    const fileRute = await uploadBytes(storageRef2, blob2).then((snapshot) => {
      const rute = getDownloadURL(snapshot.ref).then((url) => url);
      return rute;
    });

    const payload = {
      cover: imageRute,
      images: [imageRute],
      name: data.name,
      tags: data.tags,
      totalRating: 0,
      totalReview: 0,
      status: '',
      reviews: [],
      ratings: [
        {
          name: '1 Star',
          starCount: 0,
          reviewCount: 0,
        },
        {
          name: '2 Star',
          starCount: 0,
          reviewCount: 0,
        },
        {
          name: '3 Star',
          starCount: 0,
          reviewCount: 0,
        },
        {
          name: '4 Star',
          starCount: 0,
          reviewCount: 0,
        },
        {
          name: '5 Star',
          starCount: 0,
          reviewCount: 0,
        },
      ],
      description: fileRute,
      createdAt: new Date().toISOString(),
      category: data.category,
    };
    const response = await addDoc(collection(DB, 'course'), payload);
    return response;
  } catch (error) {
    return { error: error.message };
  }
}

const getAllCourse = async () => {
  try {
    const response = await getDoc(collection(DB, 'course'));
    console.log(response);
    return response.exists() ? response.data() : null;
  } catch (error) {
    return { error: error.message };
  }
};

const getCourse = async ({ id }) => {
  try {
    const response = await getDoc(doc(DB, 'course', id));
    return response.exists() ? response.data() : null;
  } catch (error) {
    return { error: error.message };
  }
};

const updateCourseReview = async ({ id, review, ratings, totalRating, totalReview }) => {
  try {
    const response = await updateDoc(doc(DB, 'course', id), {
      reviews: review,
      ratings,
      totalRating,
      totalReview,
    });
    return response;
  } catch (error) {
    return { error: error.message };
  }
};

const addUserCourse = async (courseID, userID, view) => {
  try {
    const response = await addDoc(collection(DB, 'course_user'), {
      courseID,
      userID,
      ranting: false,
      posts: [],
      view,
    });
    return response;
  } catch (error) {
    return { error: error.message };
  }
};

const updateUserCourse = async (id, courseID, userID, ranting, posts, view) => {
  try {
    const response = await updateDoc(doc(DB, 'course_user', id), {
      courseID,
      userID,
      ranting,
      posts,
      view,
    });
    return response;
  } catch (error) {
    return { error: error.message };
  }
};

const validateUserCourse = async (courseID, userID) => {
  try {
    const q = query(collection(DB, 'course_user'), where('courseID', '==', courseID));
    const response = await getDocs(q);
    // eslint-disable-next-line no-shadow
    const data = response.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const userPost = data.filter((item) => item.userID === userID);
    return userPost;
  } catch (error) {
    return { error: error.message };
  }
};

const updateView = async (courseID, userID, view) => {
  try {
    const validate = await validateUserCourse(courseID, userID);
    if (validate.length === 0) {
      await addUserCourse(courseID, userID, true);
      const response = await updateDoc(doc(DB, 'course_user', courseID), {
        view: view + 1,
      });
      return response;
    }
    return null;
  } catch (error) {
    return { error: error.message };
  }
};

const updateRating = async (courseID, userID, rating) => {
  try {
    const validate = await validateUserCourse(courseID, userID);
    if (validate[0].ranting === false) {
      const response = await updateDoc(doc(DB, 'course_user', validate[0].id), {
        ranting: true,
      });
      return response;
    }
    return null;
  } catch (error) {
    return { error: error.message };
  }
};

export {
  addCourse,
  getCourse,
  getAllCourse,
  updateCourseReview,
  updateView,
  updateRating,
  updateUserCourse,
};
