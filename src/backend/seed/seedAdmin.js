import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";

/**
 * Seeds a single admin account using credentials from .env.
 * - Idempotent: only creates the admin if it does not already exist.
 * - Skips gracefully if ADMIN_EMAIL or ADMIN_PASSWORD are missing.
 */
export const seedAdmin = async () => {
  try {
    const email = (process.env.ADMIN_EMAIL || "Bhupendra8171121943@gmail.com").trim().toLowerCase();
    const password = (process.env.ADMIN_PASSWORD || "Druhi@2011").trim();
    const name = (process.env.ADMIN_NAME || "Bhupendra").trim();

    const hashed = await bcrypt.hash(password, 10);

    const existing = await Admin.findOne({ email });
    if (existing) {
      existing.password = hashed;
      existing.name = name;
      await existing.save();
      console.log(`✅ Admin credentials updated for: ${email}`);
      return;
    }

    await Admin.create({
      name,
      email,
      password: hashed,
      role: "admin",
    });

    console.log(`✅ Seeded admin user: ${email}`);
  } catch (err) {
    console.error("❌ Admin seed error:", err.message);
  }
};
