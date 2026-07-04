function FanIcon({ spinning }) {
  return (
    <svg
      className={`fan-icon ${spinning ? 'fan-icon--spinning' : ''}`}
      viewBox="0 0 40 40"
      width="30"
      height="30"
      aria-hidden="true"
    >
      <g className="fan-icon__blades">
        <ellipse cx="20" cy="10" rx="5" ry="9" opacity="0.85" />
        <ellipse cx="28" cy="26" rx="5" ry="9" opacity="0.85" transform="rotate(120 20 20)" />
        <ellipse cx="12" cy="26" rx="5" ry="9" opacity="0.85" transform="rotate(240 20 20)" />
      </g>
      <circle cx="20" cy="20" r="3" />
    </svg>
  );
}

function Light({ device }) {
  return <span className={`light-bulb ${device.status === 'on' ? 'light-bulb--on' : ''}`} />;
}

function Workstation() {
  return (
    <span className="furniture furniture--desk" title="Desk" aria-hidden="true">
      <span className="furniture--screen" />
      <span className="furniture furniture--chair" />
    </span>
  );
}

export default function OfficeLayout({ rooms }) {
  return (
    <section className="panel layout-panel">
      <h2>Office Layout — Top View</h2>
      <div className="office-floorplan">
        <div className="office-floorplan__rooms">
          {rooms.map((room) => {
            const fans = room.devices.filter((d) => d.type === 'fan');
            const lights = room.devices.filter((d) => d.type === 'light');
            const isDrawing = room.key === 'drawing';

            return (
              <div key={room.key} className={`floorplan-room floorplan-room--${room.key}`}>
                <div className="floorplan-room__row floorplan-room__row--top">
                  {lights[0] && <Light device={lights[0]} />}
                  <FanIcon spinning={fans[0]?.status === 'on'} />
                  {lights[1] && <Light device={lights[1]} />}
                </div>

                <span className="floorplan-room__title">{room.name}</span>

                {isDrawing ? (
                  <div className="furniture-cluster furniture-cluster--drawing" aria-hidden="true">
                    <span className="furniture furniture--armchair" title="Armchair" />
                    <div className="furniture-stack">
                      <span className="furniture furniture--sofa" title="Sofa" />
                      <span className="furniture furniture--table" title="Coffee table" />
                    </div>
                    <FanIcon spinning={fans[1]?.status === 'on'} />
                  </div>
                ) : (
                  <>
                    <div className="furniture-cluster furniture-cluster--work" aria-hidden="true">
                      <Workstation />
                      <Workstation />
                    </div>
                    <div className="furniture-cluster furniture-cluster--work" aria-hidden="true">
                      <Workstation />
                      <FanIcon spinning={fans[1]?.status === 'on'} />
                      <Workstation />
                    </div>
                  </>
                )}

                <div className="floorplan-room__row floorplan-room__row--bottom">
                  {lights[2] && <Light device={lights[2]} />}
                </div>

                <span className="deco-door-swing" title="Door" aria-hidden="true" />
              </div>
            );
          })}
        </div>

        <div className="office-floorplan__corridor" aria-hidden="true" />

        <div className="office-floorplan__entry" aria-hidden="true">
          <span className="entry-door" />
          <span className="entry-arrow">↑</span>
          <span className="entry-label">ENTRY</span>
        </div>
      </div>
    </section>
  );
}
