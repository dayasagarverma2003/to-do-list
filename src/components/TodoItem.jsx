import { useState, useRef, useEffect, useCallback } from 'react'

const PRIORITY_CONFIG = {
    low: { label: 'Low', dot: 'bg-blue-400', ring: 'ring-blue-400/30', text: 'text-blue-400' },
    normal: { label: 'Normal', dot: 'bg-slate-400', ring: 'ring-slate-400/30', text: 'text-slate-400' },
    high: { label: 'High', dot: 'bg-orange-400', ring: 'ring-orange-400/30', text: 'text-orange-400' },
    urgent: { label: 'Urgent', dot: 'bg-red-400', ring: 'ring-red-400/30', text: 'text-red-400' },
}

function TodoItem({ todo, onToggle, onDelete, onEdit, style }) {
    const [isEditing, setIsEditing] = useState(false)
    const [editText, setEditText] = useState(todo.text)
    const [isDeleting, setIsDeleting] = useState(false)
    const [ripples, setRipples] = useState([])
    const [justDone, setJustDone] = useState(false)

    const editRef = useRef(null)
    const checkboxRef = useRef(null)
    const p = PRIORITY_CONFIG[todo.priority] || PRIORITY_CONFIG.normal

    useEffect(() => {
        if (isEditing) editRef.current?.focus()
    }, [isEditing])

    const handleEditSubmit = () => {
        if (editText.trim()) {
            onEdit(todo.id, editText)
        } else {
            setEditText(todo.text)
        }
        setIsEditing(false)
    }

    const handleDelete = () => {
        setIsDeleting(true)
        setTimeout(() => onDelete(todo.id), 320)
    }

    const handleEditKeyDown = (e) => {
        if (e.key === 'Enter') handleEditSubmit()
        if (e.key === 'Escape') { setEditText(todo.text); setIsEditing(false) }
    }

    /** Ripple helper */
    const spawnRipple = useCallback((e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const id = Date.now()
        setRipples(prev => [...prev, { id, x, y }])
        setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 560)
    }, [])

    const handleCheckboxClick = (e) => {
        spawnRipple(e)
        if (!todo.completed) {
            setJustDone(true)
            setTimeout(() => setJustDone(false), 600)
        }
        onToggle(todo.id)
    }

    return (
        <div
            style={style}
            className={`
                group glass rounded-xl px-4 py-3.5 shadow-lg shadow-black/10
                flex items-center gap-3 transition-all duration-300
                hover:bg-white/8 hover:shadow-xl hover:shadow-violet-900/10 hover:border-white/15 hover:-translate-y-0.5
                ${isDeleting ? 'todo-exit' : 'todo-enter'}
                ${todo.completed ? 'opacity-60' : ''}
            `}
        >
            {/* Priority bar */}
            <div
                className={`w-1.5 h-8 rounded-full ${p.dot} flex-shrink-0 opacity-80 transition-all duration-300`}
                style={{ boxShadow: todo.completed ? 'none' : undefined }}
            />

            {/* Checkbox with ripple */}
            <button
                ref={checkboxRef}
                onClick={handleCheckboxClick}
                className={`
                    ripple-container flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all duration-300
                    flex items-center justify-center select-none
                    ${todo.completed
                        ? 'border-violet-500 bg-violet-500 shadow-[0_0_14px_rgba(139,92,246,0.55)]'
                        : `border-slate-600 hover:border-violet-400 ring-2 ring-transparent hover:${p.ring}`
                    }
                    ${justDone ? 'checkbox-burst' : ''}
                `}
                aria-label={todo.completed ? 'Mark as active' : 'Mark as complete'}
            >
                {/* Ripple elements */}
                {ripples.map(r => (
                    <span
                        key={r.id}
                        className="ripple"
                        style={{ left: r.x, top: r.y }}
                    />
                ))}

                {/* Checkmark */}
                {todo.completed && (
                    <svg className="w-3 h-3 text-white animate-bounce-in" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </button>

            {/* Text / Edit input */}
            <div className="flex-1 min-w-0">
                {isEditing ? (
                    <input
                        ref={editRef}
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onBlur={handleEditSubmit}
                        onKeyDown={handleEditKeyDown}
                        className="w-full bg-white/10 text-white text-sm font-medium px-2 py-1 rounded-lg outline-none border border-violet-500/50 focus:border-violet-400 animate-scale-in"
                    />
                ) : (
                    <div className="relative">
                        <span
                            className={`
                                text-sm font-medium block truncate transition-all duration-300
                                ${todo.completed
                                    ? 'text-slate-500 line-through decoration-slate-500/50 line-through-animated'
                                    : 'text-slate-100'
                                }
                            `}
                        >
                            {todo.text}
                        </span>
                        {todo.priority !== 'normal' && (
                            <span className={`text-xs ${p.text} font-medium animate-fade-in-up`}>
                                {p.label}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
                {/* Edit */}
                {!todo.completed && (
                    <button
                        onClick={() => setIsEditing(v => !v)}
                        title="Edit"
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-violet-400 hover:bg-white/10 transition-all duration-150 hover:scale-110 active:scale-95"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </button>
                )}
                {/* Delete */}
                <button
                    onClick={handleDelete}
                    title="Delete"
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all duration-150 hover:scale-110 active:scale-95"
                >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        </div>
    )
}

export default TodoItem
