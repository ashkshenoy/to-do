import { useState, useEffect } from "react";

type Task = {
  id: number;
  text: string;
  completed: boolean;
};

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) as Task[] : [];
  });
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!input.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: input, completed: false }]);
    setInput("");
  };

  const toggleComplete = (id: number) => {
    setTasks(tasks.map((t: Task) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((t: Task) => t.id !== id));
  };

  const startEditing = (id: number, text: string) => {
    setEditingId(id);
    setEditValue(text);
  };

  const saveEdit = () => {
    setTasks(tasks.map((t: Task) =>
      t.id === editingId ? { ...t, text: editValue } : t
    ));
    setEditingId(null);
    setEditValue("");
  };

  const clearCompleted = () => {
    setTasks(tasks.filter((t: Task) => !t.completed));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">To-Do</h1>

        <div className="flex gap-2 mb-4">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addTask()}
            placeholder="Add a task..."
            className="flex-1 border rounded-lg px-3 py-2 outline-none focus:ring focus:border-blue-300"
          />
          <button
            onClick={addTask}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Add
          </button>
        </div>

        <ul className="space-y-2">
          {tasks.map((task: Task) => (
            <li
              key={task.id}
              className="flex items-center justify-between p-2 border rounded-lg"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleComplete(task.id)}
                />
                {editingId === task.id ? (
                  <input
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter") saveEdit();
                      if (e.key === "Escape") setEditingId(null);
                    }}
                    className="border rounded px-2 py-1"
                    autoFocus
                  />
                ) : (
                  <span
                    className={`${
                      task.completed ? "line-through text-gray-400" : ""
                    }`}
                  >
                    {task.text}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                {editingId === task.id ? (
                  <button
                    onClick={saveEdit}
                    className="text-green-500 hover:text-green-700"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => startEditing(task.id, task.text)}
                    className="text-yellow-500 hover:text-yellow-700"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>

        {tasks.length > 0 && (
          <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
            <span>{tasks.filter(t => !t.completed).length} tasks left</span>
            <button
              onClick={clearCompleted}
              className="text-red-500 hover:text-red-700"
            >
              Clear Completed
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
