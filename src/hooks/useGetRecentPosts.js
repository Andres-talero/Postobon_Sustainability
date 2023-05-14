import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, limit, startAfter } from 'firebase/firestore';
import { DB } from '../auth/FirebaseContext';

const useGetRecentPosts = () => {
  const [posts, setPosts] = useState([]);
  const [ultimoDato, setUltimoDato] = useState(null);
  const [hayMasPorCargar, cambiarhayMasPorCargar] = useState(false);

  useEffect(() => {
    const consulta = query(collection(DB, 'posts'), limit(4));

    const unsuscribe = onSnapshot(consulta, { includeMetadataChanges: true }, (snapshot) => {
      if (snapshot.docs.length > 0) {
        setUltimoDato(snapshot.docs[snapshot.docs.length - 1]);
      }
      setPosts(snapshot.docs.map((cliente) => ({ ...cliente.data(), id: cliente.id })));
    });

    return unsuscribe;
  }, []);

  return [posts];
};

export default useGetRecentPosts;
