import { useState, useEffect } from 'react';
import { onSnapshot, query, collection } from 'firebase/firestore';
import { DB } from '../auth/FirebaseContext';

const useGetViewsOfCourse = () => {
  const [courseViews, setCourseViews] = useState(null);

  useEffect(() => {
    const consulta = query(collection(DB, 'course_user'));

    const unsubscribe = onSnapshot(consulta, { includeMetadataChanges: true }, (snapshot) => {
      if (snapshot.docs.length > 0) {
        const counts = snapshot.docs.reduce((acc, doc) => {
          const { courseID } = doc.data();
          acc[courseID] = (acc[courseID] || 0) + 1;
          return acc;
        }, {});

        setCourseViews(counts);
      } else {
        setCourseViews(null);
      }
    });

    return () => unsubscribe();
  }, []);

  console.log(courseViews);

  return [courseViews];
};

export default useGetViewsOfCourse;
