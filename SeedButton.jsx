import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { Plus } from 'lucide-react';

const PLACEHOLDER_IMAGE = "https://placehold.co/400x400/e2e8f0/64748b?text=Exercice";
const INITIAL_EXERCISES = [
  { name: "Squat Barre", category: "Jambes (Quads, Fessiers)", equipment: "Barre Libre", type: "Poly-articulaire", imageUrl: "https://hips.hearstapps.com/hmg-prod/images/workouts/2016/03/barbellsquat-1457044234.gif" },
  { name: "Soulevé de Terre (Deadlift)", category: "Jambes (Ischios, Dos)", equipment: "Barre Libre", type: "Poly-articulaire", imageUrl: "https://i.makeagif.com/media/11-19-2015/h30t_y.gif" },
  { name: "Développé Couché (Barre)", category: "Pectoraux, Triceps", equipment: "Barre, Banc", type: "Poly-articulaire", imageUrl: "https://hips.hearstapps.com/hmg-prod/images/workouts/2016/03/barbellbenchpress-1457044438.gif" }
];

export default function SeedButton() {
  const [busy, setBusy] = useState(false);

  async function handleSeed() {
    if (!db) return alert('Firestore non initialisé');
    if (!confirm('Importer la liste d’exercices ?')) return;

    setBusy(true);
    try {
      const collRef = collection(db, 'exercises');
      const existing = await getDocs(collRef);
      const batch = writeBatch(db);
      if (!existing.empty) {
        if (!confirm('La collection "exercises" contient déjà des données. Continuer ?')) { setBusy(false); return; }
      }
      const data = INITIAL_EXERCISES;
      data.forEach((ex, idx) => {
        const id = `${ex.name.replace(/\s+/g, '_').toLowerCase()}_${idx}`;
        batch.set(doc(db, 'exercises', id), { ...ex, createdAt: serverTimestamp() });
      });
      await batch.commit();
      alert('✅ Import terminé !');
    } catch (e) { console.error(e); alert('❌ Erreur lors de l’import.'); }
    finally { setBusy(false); }
  }

  return (<button className="btn-primary" onClick={handleSeed} disabled={busy}><Plus /> {busy ? 'Importation...' : 'Seed (Importer la liste)'}</button>);
}
