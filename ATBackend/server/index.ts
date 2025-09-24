import dotenv from "dotenv";
import path from "path";
dotenv.config({
  path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV || "development"}`)
})
import express, { type Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import https from "https";
import http from "http";
import fs from "fs";
import { registerRoutes } from "./routes";
import { log } from "./vite";
// Removed multi-frontend system for simplified single frontend architecture
import { registerDashaRoutes } from "./dasha-routes";
import cors from 'cors';

const app = express();
 app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, // allow cookies if needed
}));

import { fileURLToPath } from "url";

// resolve path correctly (works for TS/ESM)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// This fallback route is moved after static file setup below

// Trust proxy configuration for production deployment
if (process.env.NODE_ENV === "production") {
  // In production, trust only first proxy (load balancer)
  app.set("trust proxy", 1);
} else {
  // In development, trust localhost
  app.set("trust proxy", "loopback");
}

// Security and canonical URL middleware
app.use((req, res, next) => {
  const host = req.get("host") || "";
  const protocol = req.header("x-forwarded-proto") || req.protocol;

  // Force www to non-www redirect for canonical URLs
  if (
    host.startsWith("www.") &&
    !req.path.includes("/health") &&
    !req.path.includes("/api/system/health")
  ) {
    const redirectHost = host.replace("www.", "");
    return res.redirect(301, `${protocol}://${redirectHost}${req.url}`);
  }

  // Force HTTPS in production (except for health checks)
  if (
    process.env.NODE_ENV === "production" &&
    protocol !== "https" &&
    !req.path.includes("/health") &&
    !req.path.includes("/api/system/health")
  ) {
    return res.redirect(301, `https://${host}${req.url}`);
  }

  // Security headers
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // Fix MIME types for static assets
  if (req.path.endsWith(".css")) {
    res.setHeader("Content-Type", "text/css");
  } else if (req.path.endsWith(".js")) {
    res.setHeader("Content-Type", "application/javascript");
  } else if (req.path.endsWith(".json")) {
    res.setHeader("Content-Type", "application/json");
  }

  // HSTS header for HTTPS
  if (req.secure || protocol === "https") {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload",
    );
  }

  next();
});

// Simplified single frontend architecture - removed multi-domain routing
app.use((req, res, next) => {
  const host = (req.headers["x-forwarded-host"] || req.headers.host || "")
    .toString()
    .split(",")[0]
    .trim();
  const cleanHost = host.replace(/:\d+$/, "").toLowerCase();

  // Set headers for monitoring (using single client frontend)
  res.setHeader("X-Frontend-Host", cleanHost);
  res.setHeader("X-Selected-Frontend", "client");
  next();
});

// CORS configuration for single domain
app.use((req, res, next) => {
  const allowedOrigins = [
    "https://astrotick.com",
    "https://www.astrotick.com",
    "http://localhost:3000",
    "http://localhost:5173",
  ];

  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With",
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }

  next();
});

// Performance middleware for caching
import { cacheControlMiddleware } from "./middleware/performance";
app.use(cacheControlMiddleware);

// Increased body parser limits for premium report generation
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));
app.use(cookieParser());

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Register API routes first to ensure they're not intercepted by Vite
  const server = await registerRoutes(app);

  // Register additional dasha routes
  registerDashaRoutes(app);

  // Removed multi-frontend routing - using single client frontend only

  // Serve favicon.ico
  app.get("/favicon.ico", (req: Request, res: Response) => {
    const faviconPath = path.join(__dirname, "../client/public/favicon.ico");
    if (fs.existsSync(faviconPath)) {
      res.setHeader("Content-Type", "image/x-icon");
      res.sendFile(faviconPath);
    } else {
      res.status(404).send("Favicon not found");
    }
  });

  // Serve site.webmanifest
  app.get("/site.webmanifest", (req: Request, res: Response) => {
    const manifestPath = path.join(
      __dirname,
      "../client/public/site.webmanifest",
    );
    if (fs.existsSync(manifestPath)) {
      res.setHeader("Content-Type", "application/manifest+json");
      res.sendFile(manifestPath);
    } else {
      res.status(404).send("Manifest not found");
    }
  });

  // Serve uploaded images
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));

  // Add a catch-all for undefined API routes (commented out to allow custom endpoints)
  // app.use('/api/*', (req, res) => {
  //   res.status(404).json({ message: 'API endpoint not found' });
  // });

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Static file serving is already handled in registerRoutes() - no need for duplicates

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  // if (process.env.NODE_ENV === "development") {
  //   await setupVite(app, server);
  // } else {
  //   serveStatic(app);
  // }

  // SSL Certificate configuration
  const getSSLOptions = () => {
    try {
      // Check for SSL certificates in multiple locations
      const sslPaths = [
        {
          key: "/etc/ssl/private/server.key",
          cert: "/etc/ssl/certs/server.crt",
        },
        { key: "./ssl/server.key", cert: "./ssl/server.crt" },
        { key: "./certs/privkey.pem", cert: "./certs/fullchain.pem" },
      ];

      for (const paths of sslPaths) {
        if (fs.existsSync(paths.key) && fs.existsSync(paths.cert)) {
          return {
            key: fs.readFileSync(paths.key),
            cert: fs.readFileSync(paths.cert),
          };
        }
      }

      return null;
    } catch (error) {
      log(`SSL certificate loading error: ${error}`);
      return null;
    }
  };

  const sslOptions = getSSLOptions();
  const port = parseInt(process.env.PORT || "5000", 10);
  const httpsPort = parseInt(process.env.HTTPS_PORT || "5443", 10);

  // Create server (HTTP or HTTPS based on SSL availability)
  if (sslOptions && process.env.NODE_ENV === "production") {
    // HTTPS server for production with SSL certificates
    const httpsServer = https.createServer(sslOptions, app);

    // Also create HTTP server for redirects
    const httpServer = http.createServer((req, res) => {
      res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
      res.end();
    });

    httpServer.listen(port, "0.0.0.0", () => {
      log(`HTTP redirect server running on port ${port}`);
    });

    httpsServer.listen(httpsPort, "0.0.0.0", () => {
      log(`HTTPS server running on port ${httpsPort}`);
    });
  } else {
    // HTTP server for development or when no SSL certificates
    server.on("error", (err: any) => {
      if (err.code === "EADDRINUSE") {
        log(`Port ${port} is in use, attempting to restart...`);
        setTimeout(() => {
          server.close();
          server.listen(
            {
              port,
              host: "0.0.0.0",
            },
            () => {
              log(`HTTP server running on port ${port}`);
            },
          );
        }, 1000);
      } else {
        throw err;
      }
    });

    server.listen(
      {
        port,
        host: "0.0.0.0",
      },
      () => {
        log(`HTTP server running on port ${port}`);
      },
    );
  }
})();

// Routes are now registered via registerRoutes() function imported at the top
