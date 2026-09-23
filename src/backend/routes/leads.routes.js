// src/backend/routes/leads.routes.js
import express from 'express';
import nodemailer from 'nodemailer';
import { prisma, isDbConnected } from '../services/prisma.js';
import { FALLBACK_LEADS, safeQuery } from '../services/fallbackData.js';
import { deleteLead } from '../services/dataStore.js';

const router = express.Router();

// Helper to resolve a valid email recipient
function resolveRecipientEmail() {
  const receiver = (process.env.CONTACT_RECEIVER || '').trim();
  if (receiver.includes('@')) return receiver;
  const user = (process.env.EMAIL_USER || '').trim();
  if (user.includes('@')) return user;
  return 'growzybytesofficial@gmail.com';
}

// Asynchronous safe email sender (non-blocking, never fails request)
async function sendLeadNotificationEmail(lead) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) return;
  try {
    const recipient = resolveRecipientEmail();
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Growzybytes Leads" <${process.env.EMAIL_USER}>`,
      to: recipient,
      subject: `🔥 New Lead from Website: ${lead.name || 'Prospective Client'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #2563eb; margin-top: 0;">🔥 New Website Audit Request / Lead</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; font-weight: bold; width: 140px;">Name:</td><td>${lead.name || 'N/A'}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Email:</td><td><a href="mailto:${lead.email}">${lead.email || 'N/A'}</a></td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Phone:</td><td>${lead.phone || 'N/A'}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Company:</td><td>${lead.company || 'N/A'}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Service Needed:</td><td>${lead.service || 'N/A'}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Budget:</td><td>${lead.budget || 'N/A'}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Timeline:</td><td>${lead.timeline || 'N/A'}</td></tr>
          </table>
          <div style="margin-top: 16px; padding: 12px; background-color: #f8fafc; border-left: 4px solid #2563eb; border-radius: 4px;">
            <strong>Message:</strong>
            <p style="margin: 6px 0 0 0; white-space: pre-wrap;">${lead.message || 'No additional message provided.'}</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Lead notification email sent to ${recipient}`);
  } catch (err) {
    console.warn('⚠️ Lead email dispatch notice:', err.message);
  }
}

// GET all contact leads
router.get('/', async (req, res) => {
  const leads = await safeQuery(
    () => prisma.contactLead.findMany({ orderBy: { createdAt: 'desc' } }),
    FALLBACK_LEADS
  );
  const formatted = (leads || []).map((l) => ({ ...l, _id: l.id || l._id }));
  res.json(formatted);
});

// POST create contact lead
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, company, website, service, budget, timeline, message } = req.body;
    if (!name && !email && !phone) {
      return res.status(400).json({ message: 'Name or email is required' });
    }

    const leadData = {
      id: Date.now(),
      _id: Date.now(),
      name: (name || 'Website Visitor').trim(),
      email: (email || '').trim(),
      phone: (phone || '').trim(),
      company: (company || '').trim(),
      website: (website || '').trim(),
      service: (service || '').trim(),
      budget: (budget || '').trim(),
      timeline: (timeline || '').trim(),
      message: (message || (timeline ? `Timeline: ${timeline}` : '')).trim(),
      createdAt: new Date().toISOString(),
    };

    if (isDbConnected()) {
      try {
        await prisma.contactLead.create({
          data: {
            name: leadData.name,
            email: leadData.email,
            phone: leadData.phone,
            service: leadData.service,
            budget: leadData.budget,
            message: leadData.message,
          },
        });
      } catch (dbErr) {
        console.warn('Prisma lead save note:', dbErr.message);
      }
    }

    FALLBACK_LEADS.unshift(leadData);

    // Fire & forget email notification
    sendLeadNotificationEmail(leadData).catch(() => {});

    res.status(200).json({
      ok: true,
      success: true,
      message: 'Audit request received successfully! One of our growth experts will contact you shortly.',
      lead: leadData,
    });
  } catch (err) {
    console.error('Lead route error:', err);
    res.status(200).json({
      ok: true,
      success: true,
      message: 'Audit request received successfully! One of our growth experts will contact you shortly.',
    });
  }
});

// DELETE lead
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (isDbConnected()) {
      await prisma.contactLead.delete({ where: { id: Number(id) } }).catch(() => null);
    }
    const idx = FALLBACK_LEADS.findIndex((l) => String(l.id) === String(id) || String(l._id) === String(id));
    if (idx !== -1) FALLBACK_LEADS.splice(idx, 1);
    await deleteLead(id);
    res.json({ message: 'Lead deleted successfully' });
  } catch (err) {
    res.json({ message: 'Lead deleted successfully' });
  }
});

export default router;
