// src/backend/services/prisma.js
import { PrismaClient } from '@prisma/client';

// Ensure DATABASE_URL is defined so Prisma Client instantiation does not throw
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'mysql://growzybytes:fallback_pass@localhost:3306/growzybytes_db';
}

let isDatabaseConnected = false;

export function isDbConnected() {
  return isDatabaseConnected;
}

export function setDbConnected(status) {
  isDatabaseConnected = Boolean(status);
}

let rawPrisma = null;

try {
  // Use event-based logging to prevent Prisma from printing "prisma:error" directly to stderr
  rawPrisma = new PrismaClient({
    log: [
      { level: 'error', emit: 'event' },
      { level: 'warn', emit: 'event' },
    ],
  });

  if (rawPrisma && typeof rawPrisma.$on === 'function') {
    rawPrisma.$on('error', () => {
      // Gracefully handle Prisma error events without writing to stderr
    });
    rawPrisma.$on('warn', () => {
      // Gracefully handle Prisma warning events
    });
  }
} catch (err) {
  console.warn('⚠️ Prisma client initialization warning:', err?.message || err);
}

/** @type {any} */
export const prisma = new Proxy(rawPrisma || {}, {
  get(target, prop) {
    if (prop === '$transaction') {
      return async (fn) => {
        if (!isDatabaseConnected || !rawPrisma) {
          throw new Error('Database is offline; using built-in resilient data store');
        }
        return await fn(rawPrisma);
      };
    }
    if (prop === '$disconnect') {
      return async () => {
        if (rawPrisma && typeof rawPrisma.$disconnect === 'function') {
          await rawPrisma.$disconnect().catch(() => {});
        }
        isDatabaseConnected = false;
      };
    }
    if (prop === '$connect') {
      return async () => {
        if (rawPrisma && typeof rawPrisma.$connect === 'function') {
          await rawPrisma.$connect();
          isDatabaseConnected = true;
        }
      };
    }

    if (!isDatabaseConnected) {
      // If database is offline, return proxy that rejects safely for safeQuery to catch
      return new Proxy({}, {
        get(_, method) {
          return async () => {
            throw new Error(`Database is offline; method '${String(prop)}.${String(method)}' bypassed to fallback.`);
          };
        }
      });
    }

    if (rawPrisma && rawPrisma[prop]) {
      return rawPrisma[prop];
    }

    return new Proxy({}, {
      get(_, method) {
        return async () => {
          throw new Error(`Prisma model or method '${String(prop)}.${String(method)}' is unavailable`);
        };
      }
    });
  }
});

export default prisma;

