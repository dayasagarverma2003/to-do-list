import { useState, useRef, useEffect } from 'react'

const PRIORITIES = [
    { value: 'low', label: 'Low', color: 'text-blue-400', dot: 'bg-blue-400' },
    { value: 'normal', label: 'Normal', color: 'text-slate-300', dot: 'bg-slate-400' },
    { value: 'high', label: 'High', color: 'text-orange-400', dot: 'bg-orange-400' },
    { value: 'urgent', label: 'Urgent', color: 'text-red-400', dot: 'bg-red-400' },
]

function TodoInput({ onAdd }) {
    const [text, setText] = useState('')
    const [bulkText, setBulkText] = useState('')
    const [priority, setPriority] = useState('normal')
    const [showPriority, setShowPriority] = useState(false)
    const [bulkMode, setBulkMode] = useState(false)
    const [addedCount, setAddedCount] = useState(null)

    const inputRef = useRef(null)
    const textareaRef = useRef(null)
    const dropdownRef = useRef(null)

    useEffect(() => {
        inputRef.current?.focus()
    }, [])

    useEffect(() => {
        if (bulkMode) textareaRef.current?.focus()
        else inputRef.current?.focus()
    }, [bulkMode])

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowPriority(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    // Clear the "added" badge after 2s
    useEffect(() => {
        if (addedCount === null) return
        const t = setTimeout(() => setAddedCount(null), 2000)
        return () => clearTimeout(t)
    }, [addedCount])

    // ─── Single mode ────────────────────────────────────────────────────────────
    const handleSingleSubmit = (e) => {
        e.preventDefault()
        if (!text.trim()) return
        onAdd(text, priority)
        setText('')
        setPriority('normal')
        inputRef.current?.focus()
    }

    // ─── Bulk mode ───────────────────────────────────────────────────────────────
    const handleBulkSubmit = (e) => {
        e.preventDefault()
        const lines = bulkText
            .split('\n')
            .map(l => l.trim())
            .filter(Boolean)
        if (!lines.length) return
        lines.forEach(line => onAdd(line, priority))
        setAddedCount(lines.length)
        setBulkText('')
        textareaRef.current?.focus()
    }

    const bulkLineCount = bulkText.split('\n').filter(l => l.trim()).length

    const currentPriority = PRIORITIES.find(p => p.value === priority)

    return (
        <div className="glass rounded-2xl p-4 shadow-xl shadow-black/20 space-y-3">

            {/* ── Mode toggle ─────────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {/* Priority picker */}
                    <div className="relative flex-shrink-0" ref={dropdownRef}>
                        <button
                            type="button"
                            onClick={() => setShowPriority(v => !v)}
                            title="Set priority"
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200 group"
                        >
                            <span className={`w-2 h-2 rounded-full ${currentPriority.dot} flex-shrink-0`} />
                            <span className={`text-xs font-medium ${currentPriority.color} hidden sm:inline`}>{currentPriority.label}</span>
                            <svg className="w-3 h-3 text-slate-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {showPriority && (
                            <div className="absolute top-full left-0 mt-2 w-32 glass rounded-xl shadow-2xl shadow-black/40 overflow-hidden z-50 animate-scale-in">
                                {PRIORITIES.map(p => (
                                    <button
                                        key={p.value}
                                        type="button"
                                        onClick={() => { setPriority(p.value); setShowPriority(false) }}
                                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-white/10 transition-colors duration-150 ${priority === p.value ? 'bg-white/10' : ''}`}
                                    >
                                        <span className={`w-2 h-2 rounded-full ${p.dot}`} />
                                        <span className={p.color}>{p.label}</span>
                                        {priority === p.value && (
                                            <svg className="w-3 h-3 ml-auto text-violet-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Bulk mode toggle */}
                <button
                    type="button"
                    onClick={() => { setBulkMode(v => !v); setText(''); setBulkText('') }}
                    className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all duration-200
            ${bulkMode
                            ? 'bg-violet-600/30 border-violet-500/50 text-violet-300'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                        }
          `}
                >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M4 6h16M4 10h16M4 14h10" />
                    </svg>
                    {bulkMode ? 'Bulk Mode ON' : 'Bulk Add'}
                </button>
            </div>

            {/* ── Single input ─────────────────────────────────────────────────────── */}
            {!bulkMode && (
                <form onSubmit={handleSingleSubmit}>
                    <div className="flex items-center gap-3 bg-white/5 rounded-xl px-3 py-2.5 border border-white/8 focus-within:border-violet-500/40 transition-colors duration-200">
                        <input
                            ref={inputRef}
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="What needs to be done?"
                            className="flex-1 bg-transparent text-white placeholder-slate-500 text-sm font-medium outline-none caret-violet-400"
                        />
                        <button
                            type="submit"
                            disabled={!text.trim()}
                            className="flex-shrink-0 w-8 h-8 rounded-lg shimmer-btn flex items-center justify-center shadow-md shadow-purple-900/40 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:animate-none"
                        >
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </div>
                    <p className="text-xs text-slate-600 mt-2">Press Enter to add · Use <span className="text-violet-500">Bulk Add</span> to add multiple items at once</p>
                </form>
            )}

            {/* ── Bulk input ───────────────────────────────────────────────────────── */}
            {bulkMode && (
                <form onSubmit={handleBulkSubmit} className="space-y-3 animate-scale-in">
                    <div className="relative">
                        <textarea
                            ref={textareaRef}
                            value={bulkText}
                            onChange={(e) => setBulkText(e.target.value)}
                            placeholder={"Type one todo per line:\nBuy groceries\nCall the dentist\nFinish the report\nGo for a walk…"}
                            rows={5}
                            className="w-full bg-white/5 border border-white/10 focus:border-violet-500/50 rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm font-medium outline-none caret-violet-400 resize-none transition-colors duration-200 leading-relaxed custom-scrollbar"
                        />
                        {/* Line counter badge */}
                        {bulkLineCount > 0 && (
                            <div className="absolute top-2 right-2 bg-violet-600/80 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-bounce-in">
                                {bulkLineCount} item{bulkLineCount !== 1 ? 's' : ''}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={bulkLineCount === 0}
                            className="flex-1 py-2.5 rounded-xl shimmer-btn text-white text-sm font-semibold shadow-lg shadow-purple-900/40 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:animate-none flex items-center justify-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M12 4v16m8-8H4" />
                            </svg>
                            Add {bulkLineCount > 0 ? `${bulkLineCount} Task${bulkLineCount !== 1 ? 's' : ''}` : 'Tasks'}
                        </button>

                        {/* Success flash */}
                        {addedCount !== null && (
                            <div className="flex items-center gap-1.5 text-emerald-400 text-sm font-medium animate-scale-in">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                                {addedCount} added!
                            </div>
                        )}
                    </div>

                    <p className="text-xs text-slate-600">One task per line · All tasks get the selected priority</p>
                </form>
            )}
        </div>
    )
}

export default TodoInput
