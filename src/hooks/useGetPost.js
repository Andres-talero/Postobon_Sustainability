import { useState, useEffect } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';
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
  }, [id]);

  console.log(post);

  return [post];
};

export default useGetPost;
