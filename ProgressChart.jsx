import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function ProgressChart() {
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { (async () => {
    const snapshot = await getDocs(collection(db, 'exercises'));
    setExercises(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  })(); }, []);

  const loadProgress = async (exerciseId) => {
    if (!exerciseId) return setProgressData([]);
    setLoading(true);
    const q = query(collection(db, `exercises/${exerciseId}/progress`), orderBy('date', 'asc'));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProgressData(data); setLoading(false);
  };

  const chartData = {
    labels: progressData.map((_, i) => `#${i + 1}`),
    datasets: [
      { label: 'Poids (kg)', data: progressData.map(d => Number(d.poids)), borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,.2)', tension: .3 },
      { label: 'Répétitions', data: progressData.map(d => Number(d.reps)), borderColor: '#f97316', backgroundColor: 'rgba(249,115,22,.2)', tension: .3 },
      { label: 'Séries', data: progressData.map(d => Number(d.series)), borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,.2)', tension: .3 }
    ]
  };

  return (
    <div className="chart-container">
      <h2>Tableau de Bord</h2>
      <div className="form">
        <label>Choisir un exercice :</label>
        <select value={selectedExercise} onChange={e => { setSelectedExercise(e.target.value); loadProgress(e.target.value); }}>
          <option value="">-- Sélectionne un exercice --</option>
          {exercises.map(ex => (<option key={ex.id} value={ex.id}>{ex.name}</option>))}
        </select>
      </div>
      {loading && <p>Chargement des données...</p>}
      {!loading && progressData.length > 0 && (<div className="chart-wrapper"><Line data={chartData} options={{ responsive:true, plugins:{ legend:{ position:'bottom' }}, scales:{ y:{ beginAtZero:true }}}} /></div>)}
      {!loading && selectedExercise && progressData.length === 0 && (<p>Aucune donnée enregistrée pour cet exercice.</p>)}
    </div>
  );
}
