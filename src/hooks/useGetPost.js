import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, orderBy, limit, startAfter } from 'firebase/firestore';
import { DB } from '../auth/FirebaseContext';

const useGetPost = ({ id }) => {
  const [post, setPost] = useState(null);

  useEffect(() => {
    const unsuscribe = onSnapshot(doc(DB, 'posts', id), (snapshot) => {
      if (snapshot.exists()) {
        setPost({ ...snapshot.data(), id: snapshot.id });
      } else {
        setPost(null);
      }
    });

    return unsuscribe;
  }, []);

  console.log(post);

  return [post];
};

export default useGetPost;
