const steps = [
  ["01", "Client Requirements", "Intake of site drawings, load profiles, and schedule constraints. Nothing moves until the requirement set is signed."],
  ["02", "Engineering Review", "Our engineers validate feasibility against the physical envelope and flag conflicts before design begins."],
  ["03", "CAD Design", "Full 3D models and fabrication drawings produced in house, reviewed with the client before release."],
  ["04", "Fabrication", "Precision forming, welding, and finishing on our own floor. No outsourced tolerance surprises."],
  ["05", "Factory Integration", "Components assembled and tested as a complete system before anything ships to site."],
  ["06", "Installation", "RXL crews install to the released drawings and coordinate directly with the trades on site."],
  ["07", "Project Completion", "Commissioning, as-built documentation, and formal handover to the operations team."],
] as const;

export function DeliveryFlow() {
  return (
    <div className="rxl-flow-wrap">
      <div className="rxl-flow rxl-flow-primary">
        {steps.slice(0, 4).map(([number, title, copy]) => (
          <article className="rxl-flow-step" key={number}>
            <span>{number}</span><h3>{title}</h3><p>{copy}</p>
          </article>
        ))}
      </div>
      <div className="rxl-flow rxl-flow-secondary">
        {steps.slice(4).map(([number, title, copy]) => (
          <article className="rxl-flow-step" key={number}>
            <span>{number}</span><h3>{title}</h3><p>{copy}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
