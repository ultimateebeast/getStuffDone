import React, { useEffect, useState } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const columns = [
  { id: "todo", title: "To-Do" },
  { id: "done", title: "Done" },
];

function KanbanBoard() {
  const [tasks, setTasks] = useState({ todo: [], done: [] });

  // Fetch all tasks and sort into columns
  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allTasks = res.data;
      setTasks({
        todo: allTasks.filter(
          (task) => !task.completed && (task.column === "todo" || !task.column)
        ),
        done: allTasks.filter((task) => task.completed),
      });
    };
    fetchTasks();
    const interval = setInterval(fetchTasks, 5000);
    return () => clearInterval(interval);
  }, []);

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const sourceCol = result.source.droppableId;
    const destCol = result.destination.droppableId;
    const token = localStorage.getItem("token");
    if (sourceCol !== destCol) {
      const task = tasks[sourceCol][result.source.index];
      // If moving to 'done', mark completed
      const update =
        destCol === "done"
          ? { column: destCol, completed: true }
          : { column: destCol, completed: false };
      await axios.put(`/api/tasks/${task._id}`, update, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Refetch tasks
      const res = await axios.get("/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allTasks = res.data;
      setTasks({
        todo: allTasks.filter(
          (task) => !task.completed && (task.column === "todo" || !task.column)
        ),
        done: allTasks.filter((task) => task.completed),
      });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        gap: 32,
        margin: "40px auto",
        maxWidth: 1300,
        justifyContent: "center",
        alignItems: "flex-start",
        fontFamily: "'Montserrat', 'Segoe UI', Arial, sans-serif",
      }}>
      <DragDropContext onDragEnd={onDragEnd}>
        {columns.map((col, colIdx) => (
          <Droppable droppableId={col.id} key={col.id}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  background:
                    "linear-gradient(135deg, #232526 0%, #414345 100%)",
                  borderRadius: 24,
                  padding: 32,
                  minWidth: 340,
                  minHeight: 500,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                  transition: "box-shadow 0.3s",
                  position: "relative",
                  overflow: "hidden",
                }}>
                <h2
                  style={{
                    color: "#ffd700",
                    textAlign: "center",
                    fontWeight: 800,
                    fontSize: 32,
                    marginBottom: 24,
                    letterSpacing: 2,
                    textShadow: "0 2px 8px #0002",
                    animation: `fadeInDown 0.8s ${colIdx * 0.2}s both`,
                  }}>
                  {col.title}
                </h2>
                {tasks[col.id].length === 0 && (
                  <div
                    style={{
                      color: "#bbb",
                      textAlign: "center",
                      marginTop: 40,
                      fontSize: 18,
                      opacity: 0.7,
                    }}>
                    No tasks here!
                  </div>
                )}
                {tasks[col.id].map((task, idx) => (
                  <Draggable key={task._id} draggableId={task._id} index={idx}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          background: "rgba(255,255,255,0.10)",
                          color: "#fff",
                          marginBottom: 20,
                          padding: "22px 24px",
                          borderRadius: 16,
                          boxShadow: "0 2px 16px rgba(0,0,0,0.12)",
                          position: "relative",
                          transition: "transform 0.2s, box-shadow 0.2s",
                          ...provided.draggableProps.style,
                          animation: `fadeInUp 0.7s ${idx * 0.1}s both`,
                        }}>
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: 22,
                            marginBottom: 8,
                          }}>
                          {task.text}
                        </div>
                        <div
                          style={{
                            fontSize: 16,
                            color: "#ffd700",
                            marginBottom: 6,
                          }}>
                          Due:{" "}
                          {task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString()
                            : "-"}
                          {task.dueDate &&
                            !task.completed &&
                            new Date(task.dueDate) < new Date() && (
                              <span
                                style={{
                                  color: "#e53935",
                                  fontWeight: 700,
                                  marginLeft: 8,
                                }}>
                                (Overdue)
                              </span>
                            )}
                        </div>
                        <div style={{ fontSize: 15, marginBottom: 4 }}>
                          Priority:{" "}
                          <span style={{ color: "#ffd700" }}>
                            {task.priority || "Medium"}
                          </span>
                        </div>
                        <div style={{ fontSize: 15 }}>
                          Labels:{" "}
                          <span style={{ color: "#ffd700" }}>
                            {task.labels && task.labels.length > 0
                              ? task.labels.join(", ")
                              : "None"}
                          </span>
                        </div>
                        {/* Add a subtle animated border for drag hover */}
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            borderRadius: 16,
                            pointerEvents: "none",
                            boxShadow: provided.isDragging
                              ? "0 0 0 4px #ffd70055"
                              : "none",
                            transition: "box-shadow 0.2s",
                          }}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                {/* Animated gradient border for each column */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    borderRadius: 24,
                    pointerEvents: "none",
                    border: "3px solid transparent",
                    background:
                      "linear-gradient(120deg, #ffd700 0%, #43a047 100%)",
                    opacity: 0.12,
                    zIndex: 0,
                  }}
                />
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 900px) {
          .kanban-board {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 18px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default KanbanBoard;
