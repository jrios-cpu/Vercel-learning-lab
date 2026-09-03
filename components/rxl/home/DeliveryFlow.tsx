const steps = [
  ["01", "Requirements", "Define the application, constraints, interfaces, and delivery target."],
  ["02", "Engineering", "Translate requirements into coordinated, buildable infrastructure."],
  ["03", "Fabrication", "Move critical work into a controlled manufacturing environment."],
  ["04", "Integration", "Coordinate assemblies, accessories, documentation, and project interfaces."],
  ["05", "Quality", "Inspect the delivered system against the approved project requirements."],
  ["06", "Delivery", "Package and sequence equipment around installation and commissioning needs."],
  ["07", "Commissioning", "Support final field integration through a single engineering partner."],
] as const;

export function DeliveryFlow() {
  return (
    <div className="rxl-flow">
      {steps.map(([number, title, copy]) => (
        <article className="rxl-flow-step" key={number}>
          <span>{number}</span>
          <h3>{title}</h3>
          <p>{copy}</p>
        </article>
      ))}
    </div>
  );
}
