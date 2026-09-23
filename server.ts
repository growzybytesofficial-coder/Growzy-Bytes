import "dotenv/config";
import express from "express";
import path from "path";
import fs from "fs";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import nodemailer from "nodemailer";
import { createServer as createViteServer } from "vite";

import { prisma, setDbConnected } from "./src/backend/services/prisma.js";

// Routes imports
import authRoutes from "./src/backend/routes/auth.routes.js";
import leadsRoutes from "./src/backend/routes/leads.routes.js";
import servicesRoutes from "./src/backend/routes/services.routes.js";
import blogRoutes from "./src/backend/routes/blog.routes.js";
import projectRoutes from "./src/backend/routes/project.routes.js";
import teamRoutes from "./src/backend/routes/team.routes.js";
import testimonialRoutes from "./src/backend/routes/testimonials.routes.js";
import uploadRoutes from "./src/backend/routes/upload.routes.js";
import pageImageRoutes from "./src/backend/routes/pageImage.routes.js";
import publicRoutes from "./src/backend/routes/public.routes.js";
import adminRoutes from "./src/backend/routes/admin.routes.js";

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 3000);

  // Verify Prisma / Database connectivity
  try {
    const dbUrl = process.env.DATABASE_URL;
    const isRealConfiguredUrl = dbUrl && !dbUrl.includes('fallback_pass') && !dbUrl.includes('localhost:3306');
    if (isRealConfiguredUrl) {
      await prisma.$connect();
      setDbConnected(true);
      console.log("✅ Database connected via Prisma ORM");
    } else {
      setDbConnected(false);
      console.log("ℹ️ Running in resilient mode with built-in data store");
    }
  } catch (err: any) {
    setDbConnected(false);
    console.log("ℹ️ Running in resilient mode with built-in data store");
  }

  // Middlewares
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: "cross-origin" },
      crossOriginEmbedderPolicy: false,
    })
  );
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.use(morgan("dev"));

  // Ensure and serve static uploads directory
  const uploadsDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const staticUploadsMiddleware = [
    (req: any, res: any, next: any) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      next();
    },
    express.static(uploadsDir, { maxAge: "1d" }),
  ];

  app.use("/uploads", ...staticUploadsMiddleware);
  app.use("/api/uploads", ...staticUploadsMiddleware);

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ ok: true, name: "GROWZYBYTES API", orm: "Prisma", database: "MySQL" });
  });

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/leads", leadsRoutes);
  app.use("/api/services", servicesRoutes);
  app.use("/api/blogs", blogRoutes);
  app.use("/api/projects", projectRoutes);
  app.use("/api/team", teamRoutes);
  app.use("/api/testimonials", testimonialRoutes);
  app.use("/api/upload", uploadRoutes);
  app.use("/api/pageImages", pageImageRoutes);

  // Dedicated Public & Admin Routes
  app.use("/api", publicRoutes);
  app.use("/api/admin", adminRoutes);

  // Vite Middleware / Static Asset Serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false, ws: false },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 GROWZYBYTES Server running at http://0.0.0.0:${PORT}`);
  });

  server.on("error", (error: NodeJS.ErrnoException) => {
    if (error.code === "EADDRINUSE") {
      console.error(`⚠️ Port ${PORT} is already in use. Stop the existing server or run with another PORT.`);
      server.close(() => process.exit(1));
      return;
    }

    throw error;
  });
}

startServer();
