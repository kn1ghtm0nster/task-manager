import express from "express";
import dotenv from "dotenv";

import taskRoutes from "./routes/taskRoutes";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/api", taskRoutes); // This is the entry point for all task routes inside taskController.ts

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
