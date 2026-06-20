import { useState, useEffect } from 'react';
import { normalizeThemeKey } from './lib/theme';
import { recommendMethod, METHOD_META } from './lib/method';
import { useStore } from './store/useStore';

import Home          from './screens/Home';
import AddTask       from './screens/AddTask';
import Records       from './screens/Records';
import Profile       from './screens/Profile';
import MoodCheck     from './screens/MoodCheck';
import MethodChooser from './screens/MethodChooser';
import FlowA         from './screens/flows/FlowA';
import FlowB         from './screens/flows/FlowB';
import FlowC         from './screens/flows/FlowC';

export default function App() {
  const store = useStore();
  const { state } = store;
  const [nav, setNav] = useState({ tab: 'home', screen: 'tab', task: null, method: null, mood: null });

  const goTab  = (tab) => setNav({ tab, screen: 'tab', task: null, method: null, mood: null });
  const goHome = ()    => setNav({ tab: 'home', screen: 'tab', task: null, method: null, mood: null });

  useEffect(() => {
    document.documentElement.dataset.theme = normalizeThemeKey(state.theme);
  }, [state.theme]);

  if (nav.screen === 'tab') {
    if (nav.tab === 'records') return <Records history={state.history} streak={state.streak} tab="records" onTab={goTab} />;
    if (nav.tab === 'me') return (
      <Profile state={state} onReset={store.reset} onTheme={store.setTheme}
        onEdit={(task) => setNav({ tab: 'me', screen: 'edit', task })}
        onRemove={store.removeTask} tab="me" onTab={goTab} />
    );
    return (
      <Home tasks={state.tasks} theme={normalizeThemeKey(state.theme)} tab="home" onTab={goTab}
        onPick={(task) => setNav({ ...nav, screen: 'mood', task, mood: null })}
        onAdd={() => setNav({ ...nav, screen: 'add' })} />
    );
  }

  if (nav.screen === 'add') return (
    <AddTask onBack={goHome} onAdd={(data) => { store.addTask(data); goHome(); }} />
  );

  if (nav.screen === 'edit') return (
    <AddTask task={nav.task} onBack={() => goTab(nav.tab || 'home')}
      onAdd={(data) => { store.updateTask(nav.task.id, data); goTab(nav.tab || 'home'); }} />
  );

  if (nav.screen === 'mood') return (
    <MoodCheck task={nav.task} onBack={goHome}
      onSkip={() => setNav({ ...nav, screen: 'method', mood: null })}
      onConfirm={(mood) => { store.setMood(mood); setNav({ ...nav, screen: 'method', mood }); }} />
  );

  if (nav.screen === 'method') return (
    <MethodChooser task={nav.task} onBack={goHome}
      recommended={nav.mood ? recommendMethod(nav.mood) : null}
      onPick={(method) => setNav({ ...nav, screen: 'flow', method })} />
  );

  const FLOWS = { a: FlowA, b: FlowB, c: FlowC };
  const Flow  = FLOWS[nav.method];
  const label = (METHOD_META[nav.method] || {}).name;
  if (!Flow) return null;

  return (
    <Flow task={nav.task}
      onBack={() => setNav({ ...nav, screen: 'method' })}
      onHome={goHome}
      onComplete={(minutes) => store.completeSession(nav.task.t, nav.method, label, minutes, nav.task.estimate)} />
  );
}
