import React from 'react';
import { Trash2, Eye } from 'lucide-react';

export default function ExerciseCard({ ex, onDelete }) {
  return (
    <div className="card">
      <div className="card-img"><img src={ex.imageUrl || 'https://placehold.co/400x400/e2e8f0/64748b?text=Exercice'} alt={ex.name} /></div>
      <div className="card-body">
        <h3>{ex.name}</h3>
        <p className="muted small">{ex.category} • {ex.equipment} • {ex.type}</p>
        <div className="card-actions">
          <button className="btn" onClick={() => window.open(ex.imageUrl || '', '_blank')}><Eye size={16}/> Voir</button>
          <button className="btn-danger" onClick={onDelete}><Trash2 size={16}/> Supprimer</button>
        </div>
      </div>
    </div>
  );
}
