import React, { useEffect, useState } from 'react';
import { auth, firebaseInitialized, signInAnonymously, onAuthStateChanged } from './firebase';
import ExerciseList from './components/ExerciseList.jsx';
import SeedButton from './components/SeedButton.jsx';
import AddExercise from './components/AddExercise.jsx';
import Programs from './components/Programs.jsx';
import DailyProgram from './components/DailyProgram.jsx';
import ProgressTracker from './components/ProgressTracker.jsx';
import ProgressChart from './components/ProgressChart.jsx';
import { LayoutDashboard, Loader, User, Dumbbell } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [tab, setTab] = useState('home');

  useEffect(() => {
    if (!firebaseInitialized) return;
    signInAnonymously(auth).catch(console.warn);
    const unsub = onAuthStateChanged(auth, (u) => { setUser(u); setAuthReady(true); });
    return () => unsub();
  }, []);

  return (
    <div className="app">
      <header className="hero">
        <div className="hero-left">
          <LayoutDashboard size={28} />
          <h1>SyCoaching — Coach Digital</h1>
        </div>
        <div className="hero-right">
          {!authReady ? <Loader className="spin" /> : user ? (<><User /> <span className="small">Connecté·e</span></>) : <span>Non connecté</span>}
        </div>
      </header>

      <main>
        <nav className="tabs">
          <button className={tab === 'home' ? 'tab active' : 'tab'} onClick={() => setTab('home')}>🏠 Accueil</button>
          <button className={tab === 'list' ? 'tab active' : 'tab'} onClick={() => setTab('list')}>🏋️ Exercices</button>
          <button className={tab === 'add' ? 'tab active' : 'tab'} onClick={() => setTab('add')}>➕ Ajouter</button>
          <button className={tab === 'programs' ? 'tab active' : 'tab'} onClick={() => setTab('programs')}>📋 Programmes</button>
          <button className={tab === 'daily' ? 'tab active' : 'tab'} onClick={() => setTab('daily')}>🕒 Programme du jour</button>
          <button className={tab === 'progress' ? 'tab active' : 'tab'} onClick={() => setTab('progress')}>📈 Progression</button>
          <button className={tab === 'chart' ? 'tab active' : 'tab'} onClick={() => setTab('chart')}>📊 Tableau de Bord</button>
        </nav>

        {tab === 'home' && (
          <section className="landing">
            <div className="landing-card">
              <Dumbbell size={48} />
              <h2>Bienvenue sur SyCoaching</h2>
              <p>Crée, suis et visualise tes entraînements. Clique sur <strong>Seed</strong> pour importer une bibliothèque d'exercices.</p>
              <div style={{display:'flex', gap:8, justifyContent:'center'}}>
                <button className="btn-primary" onClick={() => setTab('list')}>Voir les exercices</button>
                <button className="btn" onClick={() => setTab('programs')}>Créer un programme</button>
              </div>
            </div>
          </section>
        )}

        {tab === 'list' && (<><section className="controls"><SeedButton /></section><ExerciseList /></>)}
        {tab === 'add' && <AddExercise />}
        {tab === 'programs' && <Programs />}
        {tab === 'daily' && <DailyProgram />}
        {tab === 'progress' && <ProgressTracker />}
        {tab === 'chart' && <ProgressChart />}
      </main>

      <footer className="footer">© {new Date().getFullYear()} SyCoaching</footer>
    </div>
  );
}
