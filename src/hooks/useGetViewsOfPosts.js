import { useState, useEffect } from 'react';
import { onSnapshot, query, collection, getDoc, doc } from 'firebase/firestore';
import { DB } from '../auth/FirebaseContext';

const useGetViewsOfPosts = () => {
  const [postsViews, setPostsViews] = useState(null);

  useEffect(() => {
    const consulta = query(collection(DB, 'post_user'));

    const unsubscribe = onSnapshot(consulta, { includeMetadataChanges: true }, async(snapshot) => {
      if (snapshot.docs.length > 0) {
        const counts = await snapshot.docs.reduce(async (acc, docs) => {
          const { postID } = docs.data();
          const courseData = await getDoc(doc(DB, 'posts', postID));
          const postName = courseData.data().title;
          const course = await acc;
          if (course[postName]) {
            course[postName] += 1;
          } else {
            course[postName] = 1;
          }
          return acc;
        }, []);

        const counts2 = Object.keys(counts).map((key) => ({ name: key, value: counts[key] }));

        setPostsViews(counts2);
      } else {
        setPostsViews(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return [postsViews];
};

export default useGetViewsOfPosts;
