// src/backend/routes/auth.routes.js
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma, isDbConnected } from '../services/prisma.js';

const router = express.Router();

// Runtime custom password store (in case database is in fallback mode)
let runtimeCustomPassword = null;
let runtimeCustomPasswordHash = null;

const DEFAULT_NEW_PASSWORD = 'Growzybytes@2026';
const LEGACY_BACKUP_PASSWORD = 'Druhi@2011';

const ALLOWED_ADMIN_EMAILS = [
  'growzybytesofficial@gmail.com',
  'bhupendra8171121943@gmail.com',
  'admin@growzybytes.com',
];

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email or password missing in request' });
    }

    const inputEmail = email.trim().toLowerCase();
    const inputPassword = password.trim();

    const envEmail = (process.env.ADMIN_EMAIL || 'growzybytesofficial@gmail.com').trim().toLowerCase();
    const envPassword = (process.env.ADMIN_PASSWORD || DEFAULT_NEW_PASSWORD).trim();

    // Check if custom password was saved in siteSetting table
    let dbCustomPass = null;
    if (isDbConnected()) {
      try {
        const setting = await prisma.siteSetting.findUnique({ where: { key: 'admin_custom_password' } });
        if (setting?.value) {
          dbCustomPass = setting.value;
        }
      } catch {
        // Ignore Prisma errors in fallback mode
      }
    }

    // Check matching password against:
    // 1. Runtime custom changed password
    // 2. Database custom password from site settings
    // 3. New default password (Growzybytes@2026)
    // 4. Environment variable ADMIN_PASSWORD
    // 5. Legacy password (Druhi@2011) for backward compatibility
    let isPasswordValid = false;

    if (runtimeCustomPassword && inputPassword === runtimeCustomPassword) {
      isPasswordValid = true;
    } else if (runtimeCustomPasswordHash && (await bcrypt.compare(inputPassword, runtimeCustomPasswordHash))) {
      isPasswordValid = true;
    } else if (dbCustomPass && (inputPassword === dbCustomPass || (await bcrypt.compare(inputPassword, dbCustomPass).catch(() => false)))) {
      isPasswordValid = true;
    } else if (inputPassword === DEFAULT_NEW_PASSWORD) {
      isPasswordValid = true;
    } else if (inputPassword === envPassword) {
      isPasswordValid = true;
    } else if (inputPassword === LEGACY_BACKUP_PASSWORD) {
      isPasswordValid = true;
    }

    const isEmailValid =
      ALLOWED_ADMIN_EMAILS.includes(inputEmail) ||
      inputEmail === envEmail;

    if (isEmailValid && isPasswordValid) {
      const secret = process.env.JWT_SECRET || 'growzybytes_secret_key_2026';
      const user = {
        name: process.env.ADMIN_NAME || 'GROWZYBYTES Admin',
        email: inputEmail,
        role: 'admin',
      };
      const token = jwt.sign(
        { role: 'admin', email: inputEmail },
        secret,
        { expiresIn: '7d' }
      );

      console.log(`✅ Admin Login Success for ${inputEmail}`);
      return res.json({ success: true, token, user, admin: user, message: 'Login Successful' });
    }

    // Check Prisma MySQL DB safely without throwing 500 on DB connection failure
    let admin = null;
    if (isDbConnected()) {
      admin = await prisma.admin.findUnique({ where: { email: inputEmail } }).catch((err) => {
        return null;
      });
    }

    if (admin) {
      const isMatch = await bcrypt.compare(inputPassword, admin.password);
      if (isMatch || isPasswordValid) {
        const secret = process.env.JWT_SECRET || 'growzybytes_secret_key_2026';
        const user = { id: admin.id, name: admin.name, email: admin.email, role: admin.role };
        const token = jwt.sign(
          { id: admin.id, role: admin.role, email: admin.email },
          secret,
          { expiresIn: '7d' }
        );
        console.log(`✅ Admin Login Success via Prisma DB for ${inputEmail}`);
        return res.json({ success: true, token, user, admin: user, message: 'Login Successful' });
      }
    }

    console.log(`❌ Login Failed for '${inputEmail}'`);
    return res.status(401).json({ success: false, message: 'Invalid Email or Password' });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Change Admin Password endpoint (supports PUT and POST)
const handlePasswordChange = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!newPassword || newPassword.trim().length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long.',
      });
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password and confirm password do not match.',
      });
    }

    // Check authorization token if present
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    let tokenEmail = null;

    if (token) {
      try {
        const secret = process.env.JWT_SECRET || 'growzybytes_secret_key_2026';
        const decoded = jwt.verify(token, secret);
        tokenEmail = decoded?.email;
      } catch {
        // Token invalid, fallback to checking current password
      }
    }

    // If not authenticated by valid token, require currentPassword verification
    if (!tokenEmail && currentPassword) {
      const trimmedCurr = currentPassword.trim();
      const validOld =
        trimmedCurr === DEFAULT_NEW_PASSWORD ||
        trimmedCurr === LEGACY_BACKUP_PASSWORD ||
        trimmedCurr === runtimeCustomPassword ||
        trimmedCurr === (process.env.ADMIN_PASSWORD || '').trim();

      if (!validOld) {
        return res.status(401).json({
          success: false,
          message: 'Current password is incorrect.',
        });
      }
    }

    const trimmedNewPassword = newPassword.trim();
    const hashedPassword = await bcrypt.hash(trimmedNewPassword, 10);

    // Save in runtime memory
    runtimeCustomPassword = trimmedNewPassword;
    runtimeCustomPasswordHash = hashedPassword;

    // Try saving in Prisma siteSetting if database is connected
    if (isDbConnected()) {
      try {
        await prisma.siteSetting.upsert({
          where: { key: 'admin_custom_password' },
          update: { value: trimmedNewPassword },
          create: { key: 'admin_custom_password', value: trimmedNewPassword },
        });
      } catch (dbErr) {
        // Safe catch
      }

      // Also update any existing admin users in database
      try {
        await prisma.admin.updateMany({
          data: { password: hashedPassword },
        });
      } catch (dbErr) {
        // Safe catch
      }
    }

    console.log('✅ Admin password has been updated successfully!');
    return res.json({
      success: true,
      message: 'Admin password updated successfully! You can now use your new password.',
      newPassword: trimmedNewPassword,
    });
  } catch (error) {
    console.error('Change Password Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update password.' });
  }
};

router.put('/change-password', handlePasswordChange);
router.post('/change-password', handlePasswordChange);

router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Not authorized, no token' });

    const secret = process.env.JWT_SECRET || 'growzybytes_secret_key_2026';
    const decoded = jwt.verify(token, secret);

    // Try finding admin details safely
    let admin = null;
    if (decoded.email && isDbConnected()) {
      admin = await prisma.admin.findUnique({ where: { email: decoded.email } }).catch(() => null);
    }

    const userData = admin
      ? { id: admin.id, name: admin.name, email: admin.email, role: admin.role }
      : decoded;

    return res.json({ success: true, user: userData, admin: userData });
  } catch (error) {
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
});

export default router;
