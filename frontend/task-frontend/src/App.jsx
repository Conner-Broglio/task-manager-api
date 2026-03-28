import { useEffect, useState } from "react";

const API_URL = "http://localhost:8000/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Edit state
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Fetch tasks
  const fetchTasks = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Create task
  const addTask = async () => {
    if (!title) return;

    await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title,
        description
      })
    });

    setTitle("");
    setDescription("");
    fetchTasks();
  };

  // Delete task
  const deleteTask = async (id) => {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    fetchTasks();
  };

  // Start editing
  const startEdit = (task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  // Update task
  const updateTask = async () => {
    if (!editingTask) return;

    await fetch(`${API_URL}/${editingTask.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: editTitle,
        description: editDescription
      })
    });

    setEditingTask(null);
    setEditTitle("");
    setEditDescription("");
    fetchTasks();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Task Manager</h1>

      {/* Create Task */}
      <div>
        <h2>Add Task</h2>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <br />
        <button onClick={addTask}>Add Task</button>
      </div>

      <hr />

      {/* Task List */}
      <h2>Tasks</h2>
      {tasks.map((task) => (
        <div key={task.id} style={{ marginBottom: "10px" }}>
          <strong>{task.title}</strong>
          <p>{task.description}</p>

          <button onClick={() => deleteTask(task.id)}>Delete</button>
          <button onClick={() => startEdit(task)}>Edit</button>
        </div>
      ))}

      <hr />

      {/* Edit Form */}
      {editingTask && (
        <div>
          <h2>Edit Task</h2>

          <input
            placeholder="Title"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <br />

          <input
            placeholder="Description"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          />
          <br />

          <button onClick={updateTask}>Save</button>
          <button onClick={() => setEditingTask(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default App;