import { useEffect, useState } from 'react';
import { useLiveState } from './api/socket.js';
import { getInitialSnapshot } from './api/client.js';
import OfficeLayout from './components/OfficeLayout.jsx';
import SummaryCards from './components/SummaryCards.jsx';
import DeviceStatusPanel from './components/DeviceStatusPanel.jsx';
import PowerMeter from './components/PowerMeter.jsx';
import AlertsPanel from './components/AlertsPanel.jsx';

function formatClock(date) {
  if (!date) return '--:--:--';
  return date.toLocaleTimeString([], { hour12: false });
}

export default function App() {
  const { state: liveState, connected, lastUpdated } = useLiveState();
  const [initialState, setInitialState] = useState(null);

  useEffect(() => {
    getInitialSnapshot().then(setInitialState).catch(() => {});
  }, []);

  const state = liveState || initialState;

  return (
    <div className="app">
      <header className="app-header">
        <h1>Tech-Z Office Dashboard</h1>
        <div className="live-status">
          <span className={`conn-dot ${connected ? 'conn-dot--live' : 'conn-dot--down'}`} />
          <span className="live-status__label">{connected ? 'Live' : 'Reconnecting...'}</span>
          <span className="live-status__updated">Last Updated: {formatClock(lastUpdated)}</span>
        </div>
      </header>

      {!state ? (
        <p className="loading">Loading office state...</p>
      ) : (
        <main className="app-main">
          <SummaryCards rooms={state.rooms} totalWatts={state.totalWatts} alerts={state.alerts} />
          <OfficeLayout rooms={state.rooms} />
          <div className="app-columns">
            <DeviceStatusPanel rooms={state.rooms} alerts={state.alerts} />
            <div className="app-side">
              <PowerMeter
                totalWatts={state.totalWatts}
                todayKwh={state.todayKwh}
                byRoom={state.byRoom}
                rooms={state.rooms}
                lastUpdated={lastUpdated}
              />
              <AlertsPanel alerts={state.alerts} />
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
