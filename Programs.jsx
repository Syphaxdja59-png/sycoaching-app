import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';

export default function Programs() {
  const [exercises, setExercises] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [programName, setProgramName] = useState('');
  const [programs, setPrograms] = useState([]);

  useEffect(() => { (async () => {
    const snapshot = await getDocs(collection(db, 'exercises'));
    setExercises(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    const psnap = await getDocs(collection(db, 'programs'));
    setPrograms(psnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  })(); }, []);

  const toggleExercise = (id) => setSelectedExercises(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);

  async function handleSave(e) {
    e.preventDefault();
    if (!programName.trim() || selectedExercises.length === 0) return alert('Nom + 1 exercice minimum');
    await addDoc(collection(db, 'programs'), { name: programName, exercises: selectedExercises, createdAt: serverTimestamp() });
    setProgramName(''); setSelectedExercises([]);
    const psnap = await getDocs(collection(db, 'programs')); setPrograms(psnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    alert('Programme enregistré !');
  }

  async function handleDelete(id) {
    if (!confirm('Supprimer ?')) return;
    await deleteDoc(doc(db, 'programs', id));
    setPrograms(prev => prev.filter(p=>p.id!==id));
  }

  return (
    <div className="programs-container">
      <h2>Créer un Programme</h2>
      <form onSubmit={handleSave} className="form">
        <input placeholder="Nom du programme" value={programName} onChange={e=>setProgramName(e.target.value)} />
        <div className="exercise-grid">
          {exercises.map(ex => (
            <div key={ex.id} className={`exercise-item ${selectedExercises.includes(ex.id) ? 'selected' : ''}`} onClick={()=>toggleExercise(ex.id)}>
              <img src={ex.imageUrl || 'https://placehold.co/150'} alt={ex.name} />
              <p>{ex.name}</p>
            </div>
          ))}
        </div>
        <button className="btn-primary">💾 Sauvegarder le programme</button>
      </form>

      <h3 style={{marginTop:20}}>Programmes enregistrés</h3>
      <ul className="program-list">
        {programs.map(p => (<li key={p.id} className="program-item"><strong>{p.name}</strong> ({p.exercises.length} exos) <button className="delete-btn" onClick={()=>handleDelete(p.id)}>🗑️</button></li>))}
      </ul>
    </div>
  );
}
