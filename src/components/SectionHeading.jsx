export default function SectionHeading({ title, action, onAction }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="font-display text-xl text-ink sm:text-[22px]">{title}</h2>
      {action && (
        <button onClick={onAction} className="shrink-0 text-xs font-semibold text-lilac transition hover:text-[#5140aa] sm:text-sm">
          {action}
        </button>
      )}
    </div>
  )
}
