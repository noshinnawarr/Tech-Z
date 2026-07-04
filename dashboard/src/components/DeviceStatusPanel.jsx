function deviceLabel(room, device) {
  const sameType = room.devices.filter((d) => d.type === device.type);
  const index = sameType.findIndex((d) => d.id === device.id) + 1;
  return `${device.type === 'fan' ? 'Fan' : 'Light'} ${index}`;
}

export default function DeviceStatusPanel({ rooms, alerts }) {
  return (
    <section className="panel device-panel">
      <h2>Live Device Status</h2>
      <div className="room-grid">
        {rooms.map((room) => {
          const activeCount = room.devices.filter((d) => d.status === 'on').length;
          const roomWatts = room.devices.reduce((sum, d) => sum + d.watts, 0);
          const hasAlert = alerts.some((alert) => alert.room === room.key);
          return (
            <div key={room.key} className="room-card">
              <div className="room-card__header">
                <h3>{room.name}</h3>
                <span className={`status-badge ${hasAlert ? 'status-badge--warning' : 'status-badge--healthy'}`}>
                  {hasAlert ? '⚠ Warning' : '✓ Healthy'}
                </span>
              </div>
              <div className="room-card__meta">
                <span>
                  Active devices: {activeCount}/{room.devices.length}
                </span>
                <span>{roomWatts}W</span>
              </div>
              <ul className="device-list">
                {room.devices.map((device) => (
                  <li key={device.id} className={`device-row device-row--${device.status}`}>
                    <span className={`status-dot status-dot--${device.status}`} />
                    <span className="device-label">{deviceLabel(room, device)}</span>
                    <span className="device-watts">{device.status === 'on' ? `${device.watts}W` : 'off'}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
