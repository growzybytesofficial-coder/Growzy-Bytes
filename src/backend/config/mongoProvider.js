// backend/src/config/mongoProvider.js
// Provides a local MongoDB instance via mongodb-memory-server when
// the deployment environment does not include a real MongoDB server.
// In production, set USE_LOCAL_DB=false and provide a real MONGO_URI.

import "dotenv/config";
import mongoose from "mongoose";

let inMemoryServer = null;

export const ensureMongo = async () => {
  const explicitUri = process.env.MONGO_URI;
  const useLocal = process.env.USE_LOCAL_DB === "true";

  if (explicitUri && explicitUri !== "false" && !useLocal) {
    return explicitUri;
  }

  // Use in-memory MongoDB for local dev / preview.
  const mod = await import("mongodb-memory-server");
  const MongoMemoryServer = mod.MongoMemoryServer || mod.default;

  inMemoryServer = await MongoMemoryServer.create({
    binary: { version: process.env.MONGO_MEMORY_VERSION || "8.2.6" },
  });
  const uri = inMemoryServer.getUri();
  console.log(`✅ In-memory MongoDB ready at ${uri}`);
  return uri;
};

export const stopMongo = async () => {
  if (inMemoryServer) {
    await inMemoryServer.stop();
    inMemoryServer = null;
  }
  await mongoose.disconnect();
};
