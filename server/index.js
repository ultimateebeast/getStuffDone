const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const tasksRouter = require("./routes/tasks");
const usersRouter = require("./routes/users");
const subTasksRouter = require("./routes/subtasks");
const commentsRouter = require("./routes/comments");
const attachmentsRouter = require("./routes/attachments");
const kanbanRouter = require("./routes/kanban");
const calendarRouter = require("./routes/calendar");
const analyticsRouter = require("./routes/analytics");
const remindersRouter = require("./routes/reminders");
const notificationsRouter = require("./routes/notifications");
const realtimeRouter = require("./routes/realtime");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" }));

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.use("/api/tasks", tasksRouter);
app.use("/api/users", usersRouter);
app.use("/api/subtasks", subTasksRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/attachments", attachmentsRouter);
app.use("/api/kanban", kanbanRouter);
app.use("/api/calendar", calendarRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/reminders", remindersRouter);
app.use("/api/notifications", notificationsRouter);
app.use("/api/realtime", realtimeRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
