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
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-slate-50 via-gray-100 to-indigo-50/30 text-slate-900 font-sans selection:bg-indigo-100">
      <div className="max-w-2xl mx-auto px-6 py-20">
        
        {/* Large Centered Header */}
        <header className="mb-16 text-center">
          <h1 className="text-7xl font-black tracking-tighter text-slate-900 mb-2">
            TO DO
          </h1>
          <p className="text-slate-400 font-medium tracking-wide uppercase text-xs">
            Simplify your workflow
          </p>
        </header>

        {/* Modern Input Group */}
        <div className="relative mb-12 group">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addTask()}
            placeholder="What needs to be done?"
            className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-5 text-lg shadow-sm outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all placeholder:text-slate-300"
          />
          <button
            onClick={addTask}
            className="absolute right-3 top-3 bottom-3 bg-slate-900 text-white px-6 rounded-xl font-semibold hover:bg-indigo-600 transition-colors"
          >
            Add
          </button>
        </div>

        {/* Task List */}
        <ul className="space-y-3">
          {tasks.map((task: Task) => (
            <li
              key={task.id}
              className="group flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-indigo-200 hover:shadow-md transition-all"
            >
              {editingId === task.id ? (
                <div className="flex items-center gap-3 w-full">
                  <input
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter") saveEdit();
                      if (e.key === "Escape") setEditingId(null);
                    }}
                    className="flex-1 bg-slate-50 border-none rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-indigo-500"
                    autoFocus
                  />
                  <button onClick={saveEdit} className="text-indigo-600 font-bold text-sm">SAVE</button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4 flex-1">
                    <button 
                      onClick={() => toggleComplete(task.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        task.completed 
                        ? "bg-emerald-500 border-emerald-500" 
                        : "border-slate-200 hover:border-indigo-500"
                      }`}
                    >
                      {task.completed && <span className="text-white text-xs">✓</span>}
                    </button>
                    <span
                      className={`text-lg transition-all ${
                        task.completed ? "line-through text-slate-300" : "text-slate-700"
                      }`}
                    >
                      {task.text}
                    </span>
                  </div>

                  <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEditing(task.id, task.text)}
                      className="text-slate-400 hover:text-indigo-500 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>

        {/* Bottom Bar */}
        {tasks.length > 0 && (
          <div className="flex justify-between items-center mt-8 px-2 text-sm">
            <span className="text-slate-400 font-medium">
              <strong className="text-slate-900">{tasks.filter(t => !t.completed).length}</strong> items left
            </span>
            <button
              onClick={clearCompleted}
              className="text-slate-400 hover:text-red-500 font-medium transition-colors"
            >
              Clear Completed
            </button>
          </div>
        )}
      </div>
    </div>
  );
}