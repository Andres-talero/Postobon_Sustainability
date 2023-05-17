import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, limit, startAfter, where } from 'firebase/firestore';
import { DB } from '../auth/FirebaseContext';

const useGetStadistics = () => {
  const [userAmount, setUserAmount] = useState(0);
  const [coursesAmount, setCoursesAmount] = useState(0);
  const [postsAmount, setPostsAmount] = useState(0);
  const [viewPostAmount, setViewPostAmount] = useState(0);

  const getUsersAmount = () => {
    const consultaMas = query(collection(DB, 'users'));

    onSnapshot(consultaMas, (snapshot) => {
      setUserAmount(snapshot.docs.length);
    });
  };

  const getCoursesAmount = () => {
    const consultaMas = query(collection(DB, 'course'));

    onSnapshot(consultaMas, (snapshot) => {
      setCoursesAmount(snapshot.docs.length);
    });
  };

  const getPostsAmount = () => {
    const consultaMas = query(collection(DB, 'posts'));

    onSnapshot(consultaMas, (snapshot) => {
      setPostsAmount(snapshot.docs.length);
    });
  };

  const getViewPostAmount = () => {
    const consultaMas = query(collection(DB, 'posts'));
    onSnapshot(consultaMas, (snapshot) => {
      setViewPostAmount(snapshot.docs.map((post) => post.data().view).reduce((a, b) => a + b, 0));
    });
  };


  useEffect(() => {
    getUsersAmount();
    getCoursesAmount();
    getPostsAmount();
    getViewPostAmount();
  }, []);

  return [userAmount, coursesAmount, postsAmount, viewPostAmount];
};

export default useGetStadistics;
