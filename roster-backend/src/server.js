import app from "./app.js";
import { env } from "./config/env.js";
import cors from "cors";

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   }),
// );
app.use(
  cors({
    origin:
      process.env.CLIENT_URL || "https://roster-backend-7vuh.onrender.com",
  }),
);
app.listen(env.port, () => {
  console.log(`Server running on port ${env.port}`);
});
