// config/index.js
const dotenv = require("dotenv");
const path = require("path");
const Joi = require("joi");
const logger = require("../utils/logger"); // Assuming logger is setup early or use console

// Determine environment and load corresponding .env file
const env = process.env.NODE_ENV || "development";
const envPath = path.resolve(__dirname, `../.env.${env}`);

const loadResult = dotenv.config({ path: envPath });

if (loadResult.error && env !== "production") {
  console.warn(
    `⚠️ Could not find ${envPath} file, relying on system environment variables.`
  );
} else if (loadResult.error) {
  // In production, we might rely solely on system env vars, so failure to load file might be ok
  // If loading the file IS required in production, uncomment the throw below
  // throw new Error(`FATAL: Could not load environment variables from ${envPath}. Error: ${loadResult.error}`);
  console.warn(
    `⚠️ Could not load environment variables from ${envPath}. Relying on system env vars. Error: ${
      loadResult.error ? loadResult.error.message : "Unknown Error"
    }`
  );
}

// --- IMPORTANT ---
// You MUST add your MongoDB cluster URL/hostname to your .env files
// Example: DB_CLUSTER_URL=cluster0.mdhqaux.mongodb.net

// Define validation schema for environment variables
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("development"),
  PORT: Joi.number().default(5432), // Default matches your dev env example

  // Database Credentials
  DB_USER: Joi.string().required().description("MongoDB database user"),
  DB_PASSWORD: Joi.string().required().description("MongoDB database password"),
  DB_NAME: Joi.string().required().description("MongoDB database name"),
  DB_CLUSTER_URL: Joi.string()
    .required()
    .description("MongoDB cluster URL (e.g., cluster0.xxxxx.mongodb.net)"),

  // JWT
  JWT_KEY: Joi.string().required().description("JWT secret key"), // Renamed from JWT_SECRET
  JWT_EXPIRES_IN: Joi.string().default("1h").description("JWT expiration time"),

  // Security
  BCRYPT_SALT_ROUNDS: Joi.number().integer().min(10).max(14).default(12),
  CORS_ALLOWED_ORIGINS: Joi.string()
    .allow("")
    .description("Comma-separated list of allowed CORS origins for production"),
}).unknown(); // Allow other env variables not defined in the schema

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`❌ Environment variable validation error: ${error.message}`);
}

// --- Construct MongoDB URI ---
const MONGODB_URI = `mongodb+srv://${envVars.DB_USER}:${envVars.DB_PASSWORD}@${envVars.DB_CLUSTER_URL}/${envVars.DB_NAME}?retryWrites=true&w=majority`;

// --- Security Warning for JWT Key ---
if (envVars.NODE_ENV === "production" && envVars.JWT_KEY.length < 32) {
  // Use logger if available early, otherwise console
  const logFn = typeof logger !== "undefined" ? logger.warn : console.warn;
  logFn(
    "SECURITY WARNING: JWT_KEY in production is less than 32 characters long. Please use a strong, cryptographically random secret!"
  );
}

// --- Final Config Object ---
const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: MONGODB_URI, // Use the constructed URI
    options: {
      serverSelectionTimeoutMS: 5000,
    },
    debug: envVars.NODE_ENV === "development",
  },
  jwt: {
    secret: envVars.JWT_KEY, // Map JWT_KEY to secret
    expiresIn: envVars.JWT_EXPIRES_IN,
  },
  bcrypt: {
    saltRounds: envVars.BCRYPT_SALT_ROUNDS,
  },
  corsAllowedOrigins: envVars.CORS_ALLOWED_ORIGINS
    ? envVars.CORS_ALLOWED_ORIGINS.split(",")
    : [],
};

console.log(`🔧 Configuration loaded for environment: ${config.env}`);
// Avoid logging sensitive info like the full MONGODB_URI or JWT secret in production logs
// console.log('🔧 Loaded Config:', JSON.stringify({...config, jwt: { secret: '***' }, mongoose: { url: '***' } }, null, 2));

module.exports = config;
