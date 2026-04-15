import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addTodo,
  toggleTodo,
  toggleImportant,
  deleteTodo,
  clearCompleted,
  setTodosFromStorage,
  editTodo,
  moveTodo,
} from "./store/todoSlice";
import "./App.css";

export default function App() {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.todos || []);

  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");

  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  const [dragIndex, setDragIndex] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        dispatch(setTodosFromStorage(parsed));
      }
    } catch {}
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAdd = () => {
    if (!input.trim()) return;
    dispatch(addTodo(input.trim()));
    setInput("");
  };

  const filtered = tasks.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const importantTasks = filtered.filter((t) => t.important);
  const normalTasks = filtered.filter((t) => !t.important);

  const startEdit = (task) => {
    setEditId(task.id);
    setEditText(task.text);
  };

  const saveEdit = (id) => {
    dispatch(editTodo({ id, text: editText }));
    setEditId(null);
    setEditText("");
  };

  const onDragStart = (index) => setDragIndex(index);

  const onDrop = (index) => {
    if (dragIndex === null) return;
    dispatch(moveTodo({ fromIndex: dragIndex, toIndex: index }));
    setDragIndex(null);
  };

  const renderTask = (task, index) => (
    <li
      key={task.id}
      className={`todo-item ${task.completed ? "completed" : ""} ${
        task.important ? "important" : ""
      }`}
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => onDrop(index)}
      onDoubleClick={() => dispatch(toggleImportant(task.id))}
    >
      {editId === task.id ? (
        <input
          className="todo-input"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={() => saveEdit(task.id)}
          onKeyDown={(e) => e.key === "Enter" && saveEdit(task.id)}
          autoFocus
        />
      ) : (
        <span onClick={() => startEdit(task)}>{task.text}</span>
      )}

      <div className="todo-actions">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => dispatch(toggleTodo(task.id))}
        />

        <button
          className="delete-btn"
          onClick={() => dispatch(deleteTodo(task.id))}
        >
          ✖
        </button>
      </div>
    </li>
  );

  const total = tasks.length;
  const done = tasks.filter((t) => t.completed).length;

  return (
    <div className="app-container">
      <h1>ToDo List</h1>

      <div className="menu">
        <div className="menu-group">
          <span>Фильтр</span>
          <select
            className="dropdown"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Все</option>
            <option value="active">Активные</option>
            <option value="completed">Выполненные</option>
          </select>
        </div>
      </div>

      <div className="todo-form">
        <input
          className="todo-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Введите задачу..."
        />
        <button className="add-btn" onClick={handleAdd}>
          Добавить
        </button>
      </div>

      <div className="progress-container">
        <span>
          {done} / {total}
        </span>
      </div>

      <h3 className="section-title">📋 Задачи</h3>
      <ul className="todo-list">{normalTasks.map(renderTask)}</ul>

      {importantTasks.length > 0 && (
        <>
          <h3 className="section-title">⭐ Важные</h3>
          <ul className="todo-list">{importantTasks.map(renderTask)}</ul>
        </>
      )}

      <button className="clear-btn" onClick={() => dispatch(clearCompleted())}>
        Очистить выполненные
      </button>
    </div>
  );
}