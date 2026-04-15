import { useDispatch } from "react-redux";
import {
  toggleTodo,
  deleteTodo,
  toggleImportant,
} from "../store/todoSlice";

function TodoItem({ todo }) {
  const dispatch = useDispatch();

  return (
    <li
      className={`todo-item 
        ${todo.completed ? "completed" : ""} 
        ${todo.important ? "important" : ""}`}
    >
      <span>{todo.text}</span>

      <div className="todo-actions">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => dispatch(toggleTodo(todo.id))}
        />

        <button
          onClick={() => dispatch(toggleImportant(todo.id))}
          className="important-btn"
        >
          ⭐
        </button>

        <button
          className="delete-btn"
          onClick={() => dispatch(deleteTodo(todo.id))}
        >
          ❌
        </button>
      </div>
    </li>
  );
}

export default TodoItem;