import { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
  startAfter,
  where,
} from 'firebase/firestore';
import { DB } from '../auth/FirebaseContext';

const useGetAllCommentsByPost = (id) => {
  console.log(id);
  const [comments, setComments] = useState([]);
  const [ultimoDato, setUltimoDato] = useState(null);
  const [hayMasPorCargar, cambiarhayMasPorCargar] = useState(false);

  const obtenerMasComments = () => {
    const consultaMas = query(
      collection(DB, 'post_comments'),
      where('postID', '==', id),
      limit(10),
      startAfter(ultimoDato)
    );

    onSnapshot(consultaMas, (snapshot) => {
      if (snapshot.docs.length > 0) {
        setUltimoDato(snapshot.docs[snapshot.docs.length - 1]);
        setComments(
          comments.concat(snapshot.docs.map((cliente) => ({ ...cliente.data(), id: cliente.id })))
        );
      } else {
        cambiarhayMasPorCargar(false);
      }
    });
  };

  useEffect(() => {
    const consulta = query(collection(DB, 'post_comments'), where('postID', '==', id), limit(10));

    const unsuscribe = onSnapshot(consulta, { includeMetadataChanges: true }, (snapshot) => {
      if (snapshot.docs.length > 0) {
        setUltimoDato(snapshot.docs[snapshot.docs.length - 1]);
        cambiarhayMasPorCargar(true);
      } else {
        cambiarhayMasPorCargar(false);
      }
      setComments(snapshot.docs.map((cliente) => ({ ...cliente.data(), id: cliente.id })));
    });

    return unsuscribe;
  }, [id]);

  return [comments, obtenerMasComments, hayMasPorCargar];
};

export default useGetAllCommentsByPost;
