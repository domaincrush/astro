import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import bcrypt from "bcryptjs";

export async function registerRoutes() { return {}; }
