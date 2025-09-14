import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { format, parseISO } from "date-fns";
import MediaUpload from "./MediaUpload";

function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [media, setMedia] = useState(null);

  useEffect(() => {
    axios.get("/api/tasks").then((res) => setTasks(res.data));
  }, []);

  const addTask = async () => {
    if (!newTask.trim()) return;
    const res = await axios.post("/api/tasks", {
      text: newTask,
      dueDate,
      media,
    });
    setTasks([...tasks, res.data]);
    setNewTask("");
    setDueDate("");
    setMedia(null);
  };

  const deleteTask = async (id) => {
    await axios.delete(`/api/tasks/${id}`);
    setTasks(tasks.filter((t) => t._id !== id));
  };

  const startEdit = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = async (id) => {
    const res = await axios.put(`/api/tasks/${id}`, { text: editText });
    setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
    setEditingId(null);
    setEditText("");
  };

  const toggleComplete = async (id, completed) => {
    const res = await axios.put(`/api/tasks/${id}`, { completed: !completed });
    setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(tasks);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setTasks(reordered);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        maxWidth: 600,
        margin: "40px auto",
        padding: 30,
        borderRadius: 24,
        background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
        color: "#fff",
        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        fontFamily: "'Montserrat', 'Segoe UI', Arial, sans-serif",
      }}>
      <h1
        style={{
          textAlign: "center",
          fontWeight: 800,
          fontSize: 40,
          marginBottom: 24,
          letterSpacing: 2,
          textShadow: "0 2px 8px #0002",
        }}>
        <span style={{ color: "#ffd700" }}>✨</span> To-Do List{" "}
        <span style={{ color: "#ffd700" }}>✨</span>
      </h1>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: 16,
          alignItems: "center",
        }}>
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
          style={{
            flex: 2,
            minWidth: 180,
            padding: 12,
            borderRadius: 12,
            border: "none",
            fontSize: 18,
          }}
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          style={{
            flex: 1,
            minWidth: 120,
            padding: 12,
            borderRadius: 12,
            border: "none",
            fontSize: 16,
          }}
        />
        <MediaUpload onUpload={setMedia} />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={addTask}
          style={{
            padding: "12px 24px",
            borderRadius: 12,
            background: "#ffd700",
            color: "#222",
            border: "none",
            fontWeight: 700,
            fontSize: 18,
            boxShadow: "0 2px 8px #0002",
          }}>
          Add
        </motion.button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <ul
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{ listStyle: "none", padding: 0 }}>
              <AnimatePresence>
                {tasks
                  .filter((task) => !task.completed)
                  .map((task, idx) => (
                    <Draggable
                      key={task._id}
                      draggableId={task._id}
                      index={idx}>
                      {(provided) => (
                        <motion.li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 16,
                            background: "rgba(255,255,255,0.08)",
                            marginBottom: 14,
                            padding: "18px 20px",
                            borderRadius: 16,
                            boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
                            flexWrap: "wrap",
                            ...provided.draggableProps.style,
                          }}>
                          <motion.input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() =>
                              toggleComplete(task._id, task.completed)
                            }
                            whileTap={{ scale: 1.2 }}
                            style={{ width: 24, height: 24 }}
                          />
                          {editingId === task._id ? (
                            <>
                              <input
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                style={{
                                  flex: 1,
                                  minWidth: 120,
                                  padding: 10,
                                  borderRadius: 10,
                                  border: "none",
                                  fontSize: 18,
                                }}
                              />
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => saveEdit(task._id)}
                                style={{
                                  padding: "8px 16px",
                                  borderRadius: 10,
                                  background: "#43a047",
                                  color: "#fff",
                                  border: "none",
                                  fontWeight: 600,
                                }}>
                                Save
                              </motion.button>
                            </>
                          ) : (
                            <>
                              <span
                                style={{
                                  flex: 2,
                                  minWidth: 120,
                                  textDecoration: task.completed
                                    ? "line-through"
                                    : "none",
                                  fontSize: 20,
                                  fontWeight: 600,
                                }}>
                                {task.text}
                              </span>
                              {task.dueDate && (
                                <span
                                  style={{
                                    fontSize: 16,
                                    color: "#ffd700",
                                    fontWeight: 500,
                                  }}>
                                  Due:{" "}
                                  {format(
                                    parseISO(task.dueDate),
                                    "MMM d, yyyy"
                                  )}
                                </span>
                              )}
                              {task.media && (
                                <span
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                  }}>
                                  {task.media.url &&
                                    task.media.url.startsWith("data:image") && (
                                      <img
                                        src={task.media.url}
                                        alt={task.media.name}
                                        style={{
                                          maxWidth: 80,
                                          maxHeight: 80,
                                          borderRadius: 8,
                                          boxShadow: "0 2px 8px #0002",
                                        }}
                                      />
                                    )}
                                  {task.media.url &&
                                    task.media.url.startsWith("data:video") && (
                                      <video
                                        src={task.media.url}
                                        controls
                                        style={{
                                          maxWidth: 120,
                                          maxHeight: 80,
                                          borderRadius: 8,
                                          boxShadow: "0 2px 8px #0002",
                                        }}
                                      />
                                    )}
                                </span>
                              )}
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => startEdit(task._id, task.text)}
                                style={{
                                  padding: "8px 16px",
                                  borderRadius: 10,
                                  background: "#ffa726",
                                  color: "#fff",
                                  border: "none",
                                  fontWeight: 600,
                                }}>
                                Edit
                              </motion.button>
                            </>
                          )}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => deleteTask(task._id)}
                            style={{
                              padding: "8px 16px",
                              borderRadius: 10,
                              background: "#e53935",
                              color: "#fff",
                              border: "none",
                              fontWeight: 600,
                            }}>
                            Delete
                          </motion.button>
                        </motion.li>
                      )}
                    </Draggable>
                  ))}
              </AnimatePresence>
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
      <style>{`
        @media (max-width: 700px) {
          .todo-app {
            max-width: 98vw !important;
            padding: 10vw !important;
          }
          .todo-task {
            flex-direction: column !important;
            padding: 6vw !important;
          }
        }
      `}</style>
    </motion.div>
  );
}

export default TodoApp;
