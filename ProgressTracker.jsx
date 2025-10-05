import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, query, orderBy, getDocs, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';

export default function ProgressTracker() {
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [logs, setLogs] = useState([]);
  const [form, setForm] = useState({ poids: '', reps: '', series: '' });

  useEffect(() => { (async () => {
    const snapshot = await getDocs(collection(db, 'exercises'));
    setExercises(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  })(); }, []);

  const loadLogs = async (exerciseId) => {
    setSelectedExercise(exerciseId);
    if (!exerciseId) return setLogs([]);
    const q = query(collection(db, `exercises/${exerciseId}/progress`), orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    setLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!selectedExercise) return alert("Choisis un exercice d'abord !");
    const { poids, reps, series } = form;
    if (!poids || !reps || !series) return alert('Tous les champs sont requis.');
    await addDoc(collection(db, `exercises/${selectedExercise}/progress`), { poids, reps, series, date: serverTimestamp() });
    setForm({ poids: '', reps: '', series: '' });
    await loadLogs(selectedExercise);
  }

  async function handleDelete(id) {
    if (!confirm('Supprimer cette entrée ?')) return;
    await deleteDoc(doc(db, `exercises/${selectedExercise}/progress`, id));
    setLogs(prev => prev.filter(l => l.id !== id));
  }

  return (
    <div className="progress-container">
      <h2>Suivi de Progression</h2>
      <div className="form">
        <label>Choisir un exercice :</label>
        <select onChange={(e) => loadLogs(e.target.value)} value={selectedExercise}>
          <option value="">-- Sélectionne --</option>
          {exercises.map((ex) => (<option key={ex.id} value={ex.id}>{ex.name}</option>))}
        </select>

        {selectedExercise && (
          <form onSubmit={handleSubmit} className="form tracking-form">
            <input type="number" placeholder="Poids (kg)" value={form.poids} onChange={(e) => setForm({ ...form, poids: e.target.value })} required />
            <input type="number" placeholder="Répétitions" value={form.reps} onChange={(e) => setForm({ ...form, reps: e.target.value })} required />
            <input type="number" placeholder="Séries" value={form.series} onChange={(e) => setForm({ ...form, series: e.target.value })} required />
            <button className="btn-primary">💾 Enregistrer</button>
          </form>
        )}
      </div>

      {selectedExercise && (
        <div className="log-list">
          <h3>Historique de {exercises.find(ex => ex.id === selectedExercise)?.name}</h3>
          {logs.length === 0 ? (<p>Aucune donnée enregistrée.</p>) : (
            <ul>
              {logs.map(log => (<li key={log.id} className="log-item"><span><strong>{log.poids} kg</strong> — {log.reps} reps x {log.series} séries</span><button className="delete-btn" onClick={() => handleDelete(log.id)}>🗑️</button></li>))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
