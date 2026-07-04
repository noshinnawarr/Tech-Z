import { useEffect, useState } from 'react';

const FAN_WATTS = 60;
const LIGHT_WATTS = 15;

function maxPossibleWatts(room) {
  const fans = room.devices.filter((d) => d.type === 'fan').length;
  const lights = room.devices.filter((d) => d.type === 'light').length;
  return fans * FAN_WATTS + lights * LIGHT_WATTS;
}

export default function PowerMeter({ totalWatts, todayKwh, byRoom, rooms, lastUpdated }) {
  const [, forceTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => forceTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const elapsedSeconds = lastUpdated ? Math.max(0, Math.floor((Date.now() - lastUpdated.getTime()) / 1000)) : null;

  return (
    <section className="panel power-panel">
      <h2>Live Power Consumption</h2>
      <div className="power-total">
        <span className="power-total__value">{totalWatts}W</span>
        <span className="power-total__label">
          {elapsedSeconds !== null ? `Updated ${elapsedSeconds}s ago` : ''}
        </span>
      </div>
      <p className="power-today">
        Today&apos;s estimated usage: <strong>{todayKwh} kWh</strong>
      </p>
      <div className="power-breakdown">
        {rooms.map((room) => {
          const max = Math.max(1, maxPossibleWatts(room));
          return (
            <div key={room.key} className="power-bar-row">
              <span className="power-bar-label">{room.name}</span>
              <div className="power-bar-track">
                <div
                  className="power-bar-fill"
                  style={{ width: `${(byRoom[room.key] / max) * 100}%` }}
                />
              </div>
              <span className="power-bar-value">{byRoom[room.key]}W</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
