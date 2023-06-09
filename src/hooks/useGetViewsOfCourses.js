import { useState, useEffect } from 'react';
import { onSnapshot, query, collection, getDoc, doc } from 'firebase/firestore';
import { DB } from '../auth/FirebaseContext';

const useGetViewsOfCourse = () => {
  const [courseViews, setCourseViews] = useState(null);

  useEffect(() => {
    const consulta = query(collection(DB, 'course_user'));

    const unsubscribe = onSnapshot(consulta, { includeMetadataChanges: true }, async(snapshot) => {
      if (snapshot.docs.length > 0) {
        const counts = await snapshot.docs.reduce(async (acc, docs) => {
          const { courseID } = docs.data();
          const courseData = await getDoc(doc(DB, 'course', courseID));
          const courseName = courseData.data().name;
          const course = await acc;
          if (course[courseName]) {
            course[courseName] += 1;
          } else {
            course[courseName] = 1;
          }
          return acc;
        }, []);

        const counts2 = Object.keys(counts).map((key) => ({ name: key, value: counts[key] }));

        setCourseViews(counts2);
      } else {
        setCourseViews(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return [courseViews];
};

export default useGetViewsOfCourse;
