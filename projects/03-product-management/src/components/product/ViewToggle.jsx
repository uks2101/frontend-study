const VIEW_OPTIONS = [
  { value: 'grid', label: '그리드 보기', icon: '▦' },
  { value: 'list', label: '리스트 보기', icon: '☰' }
];

export default function ViewToggle({ value, onChange }) {
  return (
    <div className="view-toggle" role="group" aria-label="보기 방식">
      {VIEW_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className="view-toggle__button"
          aria-pressed={value === option.value}
          aria-label={option.label}
          title={option.label}
          onClick={() => onChange(option.value)}
        >
          <span aria-hidden="true">{option.icon}</span>
        </button>
      ))}
    </div>
  )
}