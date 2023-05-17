import { useState, useEffect } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';
import { DB } from '../auth/FirebaseContext';

const useGetCourse = ({ id }) => {
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const unsuscribe = onSnapshot(doc(DB, 'course', id), (snapshot) => {
      if (snapshot.exists()) {
        setCourse({ ...snapshot.data(), id: snapshot.id });
      } else {
        setCourse(null);
      }
    });

    return unsuscribe;
  }, [id]);

  console.log(course);

  return [course];
};

export default useGetCourse;
