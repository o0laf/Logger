const express = require("express");
const winston = require("winston");

const app = express();
const PORT = 3000;

// Base de datos simulada
let database = [];

// Middleware para leer JSON
app.use(express.json());

/* =========================
   CONFIGURACION WINSTON
========================= */

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
  ],
});

/* =========================
   ENDPOINTS
========================= */

// GET /status/200
app.get("/status/200", (req, res) => {
  try {
    logger.info("Endpoint /status/200 ejecutado correctamente");

    res.status(200).json({
      message: "hola mundo",
    });

  } catch (error) {
    logger.error(`Error en /status/200: ${error.message}`);

    res.status(500).json({
      error: "internal server error",
    });
  }
});

// GET /status/500
app.get("/status/500", (req, res) => {
  try {
    logger.error("Endpoint /status/500 devolvio error 500");

    res.status(500).json({
      message: "internal server error",
    });

  } catch (error) {
    logger.error(`Error en /status/500: ${error.message}`);

    res.status(500).json({
      error: "internal server error",
    });
  }
});

// GET /status/429
app.get("/status/429", (req, res) => {
  try {
    logger.warn("Endpoint /status/429 devolvio error 429");

    res.status(429).json({
      message: "too many requests",
    });

  } catch (error) {
    logger.error(`Error en /status/429: ${error.message}`);

    res.status(500).json({
      error: "internal server error",
    });
  }
});

// POST /status/save
app.post("/status/save", (req, res) => {
  try {

    // Probabilidad 50% de error
    const random = Math.random();

    if (random < 0.5) {
      logger.error("Error simulado de base de datos");

      return res.status(500).json({
        message: "database error",
      });
    }

    // Guardar dato
    database.push(req.body);

    logger.info(`Dato guardado correctamente: ${JSON.stringify(req.body)}`);

    res.status(200).json({
      message: "saved successfully",
      data: req.body,
    });

  } catch (error) {
    logger.error(`Error en POST /status/save: ${error.message}`);

    res.status(500).json({
      error: "internal server error",
    });
  }
});

// GET /status/save
app.get("/status/save", (req, res) => {
  try {

    logger.info("Consulta de registros guardados");

    res.status(200).json({
      total: database.length,
      data: database,
    });

  } catch (error) {
    logger.error(`Error en GET /status/save: ${error.message}`);

    res.status(500).json({
      error: "internal server error",
    });
  }
});

/* =========================
   MANEJO GENERAL DE ERRORES
========================= */

app.use((err, req, res, next) => {
  logger.error(`Error global: ${err.message}`);

  res.status(500).json({
    error: "unexpected server error",
  });
});

/* =========================
   SERVER
========================= */

app.listen(PORT, () => {
  logger.info(`Servidor ejecutandose en http://localhost:${PORT}`);
});