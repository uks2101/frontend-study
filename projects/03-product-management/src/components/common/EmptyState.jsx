export default function EmptyState({ title, description, children }) {
  return (
    <div className="state-box">
      <p className="state-box__title">{title}</p>
      {description && <p className="state-box__desc">{description}</p>}
      {children}
    </div>
  );
}
