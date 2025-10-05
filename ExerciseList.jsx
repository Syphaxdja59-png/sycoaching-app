import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import ExerciseCard from './ExerciseCard.jsx';

export default function ExerciseList() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, 'exercises'), orderBy('name'));
    const unsub = onSnapshot(q, (snap) => {
      const arr = [];
      snap.forEach(d => arr.push({ id: d.id, ...d.data() }));
      setExercises(arr); setLoading(false);
    }, () => setLoading(false));
    return () => unsub();
  }, []);

  async function handleDelete(id) {
    if (!confirm('Supprimer cet exercice ?')) return;
    await deleteDoc(doc(db, 'exercises', id));
  }

  if (loading) return <div className="center">Chargement...</div>;
  if (!exercises.length) return <div className="center muted">Aucun exercice. Clique sur "Seed" pour importer la liste initiale.</div>;

  return (<div className="grid">{exercises.map(ex => (<ExerciseCard key={ex.id} ex={ex} onDelete={() => handleDelete(ex.id)} />))}</div>);
}
