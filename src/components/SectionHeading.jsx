export default function SectionHeading({ title, action, onAction }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="font-display text-xl text-ink sm:text-[22px]">{title}</h2>
      {action && (
        <button onClick={onAction} className="shrink-0 text-xs font-semibold text-accent transition hover:text-ink sm:text-sm">
          {action}
        </button>
      )}
    </div>
  )
}
