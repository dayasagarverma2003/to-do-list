import TodoItem from './TodoItem'

function TodoList({ todos, onToggle, onDelete, onEdit }) {
    return (
        <div className="space-y-2">
            {todos.map((todo, index) => (
                <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={onToggle}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    style={{ animationDelay: `${index * 45}ms` }}
                />
            ))}
        </div>
    )
}

export default TodoList
