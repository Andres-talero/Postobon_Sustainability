import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, limit, startAfter } from 'firebase/firestore';
import { DB } from '../auth/FirebaseContext';

const useGetAllPost = () => {
  const [posts, cambiarClientes] = useState([]);
  const [ultimoDato, setUltimoDato] = useState(null);
  const [hayMasPorCargar, cambiarhayMasPorCargar] = useState(false);

  const obtenerMasPost = () => {
    const consultaMas = query(collection(DB, 'posts'), limit(10), startAfter(ultimoDato));

    onSnapshot(consultaMas, (snapshot) => {
      if (snapshot.docs.length > 0) {
        setUltimoDato(snapshot.docs[snapshot.docs.length - 1]);
        cambiarClientes(
          posts.concat(snapshot.docs.map((cliente) => ({ ...cliente.data(), id: cliente.id })))
        );
      } else {
        cambiarhayMasPorCargar(false);
      }
    });
  };

  useEffect(() => {
    const consulta = query(collection(DB, 'posts'), limit(10));

    const unsuscribe = onSnapshot(consulta, { includeMetadataChanges: true }, (snapshot) => {
      if (snapshot.docs.length > 0) {
        setUltimoDato(snapshot.docs[snapshot.docs.length - 1]);
        cambiarhayMasPorCargar(true);
      } else {
        cambiarhayMasPorCargar(false);
      }
      cambiarClientes(snapshot.docs.map((cliente) => ({ ...cliente.data(), id: cliente.id })));
    });

    return unsuscribe;
  }, []);

  return [posts, obtenerMasPost, hayMasPorCargar];
};

export default useGetAllPost;
