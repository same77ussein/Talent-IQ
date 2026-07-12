import express from "express";
import path from "path";
import cors from "cors";
import { serve } from "inngest/express";
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { functions, inngest } from "./lib/inngest.js";
const app = express();

const __dirname = path.resolve();

// middleware
app.use(express.json());

// Enable CORS for the specified client URL and allow credentials
// Credentials are necessary for cookies and authentication headers to be sent in cross-origin requests
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));

app.use("/api/inngest", serve({ client: inngest, functions }));

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

// Serve static files and handle routing for production
if (ENV.NODE_ENV === "production") {
  console.log("Running in production mode");
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("/{*any}/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, async () => {
      console.log(`Server is running on port ${ENV.PORT}`);
    });
  } catch (error) {
    console.error("❌ Error starting the server", error);
    process.exit(1); // 0 means success, 1 means failure
  }
};

startServer();
