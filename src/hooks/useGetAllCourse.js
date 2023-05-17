import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, limit, startAfter } from 'firebase/firestore';
import { DB } from '../auth/FirebaseContext';

const useGetAllcourse = () => {
  const [courses, setCourses] = useState([]);
  const [ultimoDato, setUltimoDato] = useState(null);
  const [hayMasPorCargar, cambiarhayMasPorCargar] = useState(false);

  const obtenerMasPost = () => {
    const consultaMas = query(collection(DB, 'course'), limit(25), startAfter(ultimoDato));

    onSnapshot(consultaMas, (snapshot) => {
      if (snapshot.docs.length > 0) {
        setUltimoDato(snapshot.docs[snapshot.docs.length - 1]);
        setCourses(
          courses.concat(snapshot.docs.map((cliente) => ({ ...cliente.data(), id: cliente.id })))
        );
      } else {
        cambiarhayMasPorCargar(false);
      }
    });
  };

  useEffect(() => {
    const consulta = query(collection(DB, 'course'), limit(25));

    const unsuscribe = onSnapshot(consulta, { includeMetadataChanges: true }, (snapshot) => {
      if (snapshot.docs.length > 0) {
        setUltimoDato(snapshot.docs[snapshot.docs.length - 1]);
        cambiarhayMasPorCargar(true);
      } else {
        cambiarhayMasPorCargar(false);
      }
      setCourses(snapshot.docs.map((cliente) => ({ ...cliente.data(), id: cliente.id })));
    });

    return unsuscribe;
  }, []);

  return [courses, obtenerMasPost, hayMasPorCargar];
};

export default useGetAllcourse;
