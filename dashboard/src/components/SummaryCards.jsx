export default function SummaryCards({ rooms, totalWatts, alerts }) {
  const devicesOn = rooms.reduce((sum, room) => sum + room.devices.filter((d) => d.status === 'on').length, 0);
  const activeRooms = rooms.filter((room) => room.devices.some((d) => d.status === 'on')).length;

  const cards = [
    { label: 'Devices ON', value: devicesOn },
    { label: 'Total Power', value: `${totalWatts}W` },
    { label: 'Active Alerts', value: alerts.length },
    { label: 'Active Rooms', value: `${activeRooms}/${rooms.length}` },
  ];

  return (
    <section className="summary-cards">
      {cards.map((card) => (
        <div key={card.label} className="summary-card">
          <span className="summary-card__value">{card.value}</span>
          <span className="summary-card__label">{card.label}</span>
        </div>
      ))}
    </section>
  );
}
