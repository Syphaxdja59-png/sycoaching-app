import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function AddExercise() {
  const [form, setForm] = useState({ name: '', category: '', equipment: '', type: '', imageUrl: '' });

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return alert("Le nom est obligatoire.");
    await addDoc(collection(db, 'exercises'), { ...form, createdAt: serverTimestamp() });
    setForm({ name: '', category: '', equipment: '', type: '', imageUrl: '' });
    alert('Exercice ajouté !');
  }

  return (
    <div className="card" style={{ maxWidth: 540, margin: '0 auto' }}>
      <div className="card-body">
        <h2>Ajouter un Exercice</h2>
        <form onSubmit={handleSubmit} className="form">
          <input placeholder="Nom *" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
          <input placeholder="Catégorie" value={form.category} onChange={e=>setForm({...form, category:e.target.value})} />
          <input placeholder="Équipement" value={form.equipment} onChange={e=>setForm({...form, equipment:e.target.value})} />
          <input placeholder="Type" value={form.type} onChange={e=>setForm({...form, type:e.target.value})} />
          <input placeholder="Image URL" value={form.imageUrl} onChange={e=>setForm({...form, imageUrl:e.target.value})} />
          <button className="btn-primary">Ajouter</button>
        </form>
      </div>
    </div>
  );
}
