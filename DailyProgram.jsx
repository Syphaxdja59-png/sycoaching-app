import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

export default function DailyProgram() {
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [exerciseDetails, setExerciseDetails] = useState([]);
  const [done, setDone] = useState(false);

  useEffect(() => { (async () => {
    const snapshot = await getDocs(collection(db, 'programs'));
    setPrograms(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  })(); }, []);

  const loadProgramDetails = async (programId) => {
    const program = programs.find(p => p.id === programId); if (!program) return;
    setSelectedProgram(program);
    const details = [];
    for (const exId of program.exercises) {
      const exSnap = await getDoc(doc(db, 'exercises', exId));
      if (exSnap.exists()) details.push({ id: exSnap.id, ...exSnap.data() });
    }
    setExerciseDetails(details); setCurrentExercise(0); setDone(false);
  };

  const handleNext = () => { if (currentExercise < exerciseDetails.length - 1) setCurrentExercise(c=>c+1); else setDone(true); };

  return (
    <div className="daily-container">
      <h2>Programme du Jour</h2>
      {programs.length > 0 ? (
        <div className="form">
          <label>Choisir un programme :</label>
          <select onChange={(e) => loadProgramDetails(e.target.value)} defaultValue="">
            <option value="" disabled>-- Sélectionne un programme --</option>
            {programs.map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}
          </select>
        </div>
      ) : (<p>Aucun programme. Crée-en un d'abord.</p>)}

      {selectedProgram && !done && exerciseDetails.length > 0 && (
        <div className="exercise-session">
          <h3>{selectedProgram.name}</h3>
          <div className="exercise-card">
            <img src={exerciseDetails[currentExercise].imageUrl || 'https://placehold.co/300x200'} alt={exerciseDetails[currentExercise].name} />
            <h4>{exerciseDetails[currentExercise].name}</h4>
            <p>{exerciseDetails[currentExercise].category}</p>
            <p><strong>Type :</strong> {exerciseDetails[currentExercise].type}</p>
            <button className="btn-primary" onClick={handleNext}>{currentExercise < exerciseDetails.length - 1 ? 'Exercice suivant ⏭️' : 'Terminer ✅'}</button>
          </div>
          <p>Progression : {currentExercise + 1}/{exerciseDetails.length}</p>
        </div>
      )}

      {done && (<div className="session-done"><h3>Programme terminé 🎉</h3></div>)}
    </div>
  );
}
