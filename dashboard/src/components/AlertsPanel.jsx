export default function AlertsPanel({ alerts }) {
  const sorted = [...alerts].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  return (
    <section className="panel alerts-panel">
      <h2>Active Alerts</h2>
      {sorted.length === 0 ? (
        <div className="alerts-empty">
          <span className="alerts-empty__icon">✅</span>
          <div>
            <span className="alerts-empty__title">No active alerts</span>
            <span className="alerts-empty__subtitle">Office operating normally</span>
          </div>
        </div>
      ) : (
        <ul className="alerts-list">
          {sorted.map((alert) => (
            <li key={alert.id} className={`alert-row alert-row--${alert.type}`}>
              <span className="alert-room">⚠ {alert.roomName || 'Office'}</span>
              <span className="alert-message">{alert.message}</span>
              <time className="alert-time">{new Date(alert.timestamp).toLocaleString()}</time>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
