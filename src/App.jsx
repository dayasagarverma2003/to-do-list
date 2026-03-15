import { useState, useEffect, useCallback } from 'react'
import Header from './components/Header'
import TodoInput from './components/TodoInput'
import FilterBar from './components/FilterBar'
import TodoList from './components/TodoList'
import StatsBar from './components/StatsBar'
import EmptyState from './components/EmptyState'

const FILTERS = { ALL: 'all', ACTIVE: 'active', COMPLETED: 'completed' }

function App() {
    const [todos, setTodos] = useState(() => {
        try {
            const saved = localStorage.getItem('todoflow-todos')
            return saved ? JSON.parse(saved) : []
        } catch {
            return []
        }
    })
    const [filter, setFilter] = useState(FILTERS.ALL)

    // Persist to localStorage
    useEffect(() => {
        localStorage.setItem('todoflow-todos', JSON.stringify(todos))
    }, [todos])

    const addTodo = useCallback((text, priority = 'normal') => {
        if (!text.trim()) return
        setTodos(prev => [
            {
                id: crypto.randomUUID(),
                text: text.trim(),
                completed: false,
                priority,
                createdAt: Date.now(),
            },
            ...prev,
        ])
    }, [])

    const toggleTodo = useCallback((id) => {
        setTodos(prev =>
            prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
        )
    }, [])

    const deleteTodo = useCallback((id) => {
        setTodos(prev => prev.filter(t => t.id !== id))
    }, [])

    const editTodo = useCallback((id, newText) => {
        if (!newText.trim()) return
        setTodos(prev =>
            prev.map(t => t.id === id ? { ...t, text: newText.trim() } : t)
        )
    }, [])

    const clearCompleted = useCallback(() => {
        setTodos(prev => prev.filter(t => !t.completed))
    }, [])
//button to toggle all todos as completed or active
    const toggleAll = useCallback(() => {
        const allDone = todos.every(t => t.completed)
        setTodos(prev => prev.map(t => ({ ...t, completed: !allDone })))
    }, [todos])

    const reorderTodos = useCallback((newOrder) => {
        setTodos(newOrder)
    }, [])

    const filteredTodos = todos.filter(t => {
        if (filter === FILTERS.ACTIVE) return !t.completed
        if (filter === FILTERS.COMPLETED) return t.completed
        return true
    })

    const activeCount = todos.filter(t => !t.completed).length
    const completedCount = todos.filter(t => t.completed).length

    const progressPct = todos.length === 0 ? 0 : Math.round((completedCount / todos.length) * 100)

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 relative overflow-hidden">
            {/* Animated background blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl animate-blob" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl animate-blob-delay-2" />
                <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] rounded-full bg-violet-800/10 blur-3xl animate-blob-delay-4" />
                {/* Grid pattern */}
                <div
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: `linear-gradient(rgba(139,92,246,0.3) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(139,92,246,0.3) 1px, transparent 1px)`,
                        backgroundSize: '40px 40px',
                    }}
                />
            </div>

            {/* Main content */}
            <div className="relative z-10 max-w-2xl mx-auto px-4 py-10">
                <Header />

                <div className="mt-8 space-y-4 animate-fade-in-up">
                    <TodoInput onAdd={addTodo} />

                    {todos.length > 0 && (
                        <>
                            <StatsBar
                                total={todos.length}
                                active={activeCount}
                                completed={completedCount}
                                onToggleAll={toggleAll}
                                allDone={todos.every(t => t.completed)}
                            />

                            {/* Animated progress bar */}
                            <div className="glass rounded-xl px-4 py-3">
                                <div className="flex justify-between text-xs text-slate-400 mb-2">
                                    <span>Progress</span>
                                    <span
                                        className="font-semibold text-violet-400 transition-all duration-500"
                                        key={progressPct}
                                    >
                                        {progressPct}%
                                    </span>
                                </div>
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        key={progressPct}
                                        className="h-full rounded-full shimmer-btn progress-bar"
                                        style={{ '--progress': `${progressPct}%` }}
                                    />
                                </div>
                            </div>

                            <FilterBar filter={filter} setFilter={setFilter} />
                        </>
                    )}

                    {filteredTodos.length === 0 ? (
                        <EmptyState filter={filter} hasTodos={todos.length > 0} />
                    ) : (
                        <TodoList
                            todos={filteredTodos}
                            onToggle={toggleTodo}
                            onDelete={deleteTodo}
                            onEdit={editTodo}
                            onReorder={reorderTodos}
                        />
                    )}

                    {completedCount > 0 && (
                        <div className="flex justify-end animate-fade-in-up">
                            <button
                                onClick={clearCompleted}
                                className="text-sm text-slate-400 hover:text-red-400 transition-all duration-200 flex items-center gap-1.5 group hover:scale-105 active:scale-95"
                            >
                                <svg className="w-4 h-4 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Clear completed ({completedCount})
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <footer className="mt-16 text-center text-slate-600 text-xs">
                    <p>TodoFlow — Built with ❤️ using React &amp; Tailwind CSS</p>
                </footer>
            </div>
        </div>
    )
}

export default App
