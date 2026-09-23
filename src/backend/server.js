import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import nodemailer from "nodemailer"; // Nodemailer import kiya
import { connectDB } from "./config/db.js";

// Routes imports
import authRoutes from "./routes/auth.routes.js";
import leadsRoutes from "./routes/leads.routes.js";
import servicesRoutes from "./routes/services.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import projectRoutes from "./routes/project.routes.js";
import teamRoutes from "./routes/team.routes.js";
import testimonialRoutes from "./routes/testimonials.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import pageImageRoutes from "./routes/pageImage.routes.js";

const app = express();

// Middlewares
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "5mb" }));
app.use(morgan("dev"));

// --- EMAIL / LEADS ROUTE LOGIC ---
app.post("/api/leads", async (req, res) => {
  const { name, email, phone, company, service, budget, timeline, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD, // Aapka 16-digit password (no spaces)
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.CONTACT_RECEIVER,
      subject: `🔥 New Lead from Website: ${name}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Company:</strong> ${company || "N/A"}</p>
        <p><strong>Service Needed:</strong> ${service || "N/A"}</p>
        <p><strong>Budget:</strong> ${budget || "N/A"}</p>
        <p><strong>Timeline:</strong> ${timeline || "N/A"}</p>
        <p><strong>Message:</strong><br/> ${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ ok: true, message: "Audit request received successfully!" });
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({ error: "Failed to send email." });
  }
});
// --------------------------------

// Health route
app.get("/api/health", (req, res) => {
  res.json({ ok: true });
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

const port = process.env.PORT || 8080;

// DB Connection & Server Start
connectDB(process.env.MONGO_URI)
  .then(() => {
    app.listen(port, () => {
      console.log(`🚀 API running on :${port}`);
    });
  })
  .catch((err) => {
    console.error("DB connection error:", err);
    process.exit(1);
  });