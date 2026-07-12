import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import cors from "cors";
import { serve } from "inngest/express";
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { functions, inngest } from "./lib/inngest.js";
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../..");
const frontendDistPath = path.join(projectRoot, "frontend", "dist");

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
  if (fs.existsSync(frontendDistPath)) {
    console.log("Running in production mode with static frontend");
    app.use(express.static(frontendDistPath));
    app.get("/{*any}/", (req, res) => {
      res.sendFile(path.join(frontendDistPath, "index.html"));
    });
  } else {
    console.log("Running in production mode without static frontend build");
  }
}

const startServer = async () => {
  try {
    await connectDB();
    const port = Number(ENV.PORT) || 3000;
    app.listen(port, async () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("❌ Error starting the server", error);
    process.exit(1); // 0 means success, 1 means failure
  }
};

startServer();
