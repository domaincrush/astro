import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { storage } from "./storage";
import { emailService } from "./email-service";

// Generate 6-digit PIN
export function generateSixDigitPin(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Hash PIN
export async function hashPin(pin: string): Promise<string> {
  return await bcrypt.hash(pin, 12);
}

// Verify PIN
export async function verifyPin(pin: string, hashedPin: string): Promise<boolean> {
  return await bcrypt.compare(pin, hashedPin);
}

// Generate OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// User signup with PIN
export async function signup(req: Request, res: Response) {
  try {
    const { username, email, pin, phone, dateOfBirth, timeOfBirth, placeOfBirth, latitude, longitude, timezone } = req.body;

    // Validate PIN
    if (!pin || pin.length !== 6 || !/^\d{6}$/.test(pin)) {
      return res.status(400).json({
        success: false,
        message: "PIN must be exactly 6 digits"
      });
    }

    // Check if user already exists
    const existingUser = await storage.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered"
      });
    }

    const existingUsername = await storage.getUserByUsername(username);
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: "Username already taken"
      });
    }

    // Hash PIN
    const pinHash = await hashPin(pin);

    // Create user
    const newUser = await storage.createUser({
      username,
      email,
      pinHash,
      phone,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      timeOfBirth,
      placeOfBirth,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      timezone,
      isEmailVerified: false,
      role: "user"
    });

    // Send welcome email
    await emailService.sendWelcomeEmail({
      name: username,
      email: email
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Account created successfully",
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        isEmailVerified: newUser.isEmailVerified
      }
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed. Please try again."
    });
  }
}

// User login with PIN
export async function loginWithPin(req: Request, res: Response) {
  try {
    const { email, pin } = req.body;
    console.log("🔐 PIN Login attempt:", { email, pinLength: pin?.length });

    // Validate input
    if (!email || !pin) {
      console.log("❌ Missing email or PIN");
      return res.status(400).json({
        success: false,
        message: "Email and PIN are required"
      });
    }

    if (pin.length !== 6 || !/^\d{6}$/.test(pin)) {
      console.log("❌ Invalid PIN format:", pin);
      return res.status(400).json({
        success: false,
        message: "PIN must be exactly 6 digits"
      });
    }

    // Find user
    const user = await storage.getUserByEmail(email);
    console.log("👤 User lookup:", { found: !!user, hasPinHash: !!user?.pinHash });
    if (!user) {
      console.log("❌ User not found");
      return res.status(401).json({
        success: false,
        message: "Invalid email or PIN"
      });
    }

    if (!user.pinHash) {
      console.log("❌ User has no PIN hash set");
      return res.status(401).json({
        success: false,
        message: "Invalid email or PIN"
      });
    }

    // Verify PIN
    console.log("🔒 Verifying PIN:", { pin, hashExists: !!user.pinHash });
    const isPinValid = await verifyPin(pin, user.pinHash);
    console.log("✅ PIN verification result:", isPinValid);
    if (!isPinValid) {
      console.log("❌ PIN verification failed");
      return res.status(401).json({
        success: false,
        message: "Invalid email or PIN"
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed. Please try again."
    });
  }
}

// Request OTP for login (when PIN is forgotten)
export async function requestLoginOTP(req: Request, res: Response) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    // Check if user exists
    const user = await storage.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email"
      });
    }

    // Generate OTP
    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in database
    await storage.createOtpCode({
      email,
      otpCode,
      purpose: "login",
      expiresAt
    });

    // Send OTP email
    await emailService.sendLoginOTP({
      userName: user.username,
      userEmail: email,
      otpCode,
      expiryMinutes: 10
    });

    res.json({
      success: true,
      message: "Login code sent to your email"
    });
  } catch (error) {
    console.error("Request login OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send login code. Please try again."
    });
  }
}

// Login with OTP
export async function loginWithOTP(req: Request, res: Response) {
  try {
    const { email, otpCode } = req.body;

    if (!email || !otpCode) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP code are required"
      });
    }

    if (otpCode.length !== 6 || !/^\d{6}$/.test(otpCode)) {
      return res.status(400).json({
        success: false,
        message: "OTP must be exactly 6 digits"
      });
    }

    // Verify OTP
    const validOtp = await storage.getValidOtpCode(email, otpCode, "login");
    if (!validOtp) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired OTP code"
      });
    }

    // Mark OTP as used
    await storage.markOtpAsUsed(validOtp.id);

    // Get user
    const user = await storage.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    console.error("OTP login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed. Please try again."
    });
  }
}

// Request PIN reset OTP
export async function requestPinResetOTP(req: Request, res: Response) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    // Check if user exists
    const user = await storage.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email"
      });
    }

    // Generate OTP
    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Store OTP in database
    await storage.createOtpCode({
      email,
      otpCode,
      purpose: "pin_reset",
      expiresAt
    });

    // Send PIN reset OTP email
    await emailService.sendPinResetOTP({
      userName: user.username,
      userEmail: email,
      otpCode,
      expiryMinutes: 15
    });

    res.json({
      success: true,
      message: "PIN reset code sent to your email"
    });
  } catch (error) {
    console.error("Request PIN reset OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send PIN reset code. Please try again."
    });
  }
}

// Reset PIN with OTP
export async function resetPinWithOTP(req: Request, res: Response) {
  try {
    const { email, otpCode, newPin } = req.body;

    if (!email || !otpCode || !newPin) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP code, and new PIN are required"
      });
    }

    if (otpCode.length !== 6 || !/^\d{6}$/.test(otpCode)) {
      return res.status(400).json({
        success: false,
        message: "OTP must be exactly 6 digits"
      });
    }

    if (newPin.length !== 6 || !/^\d{6}$/.test(newPin)) {
      return res.status(400).json({
        success: false,
        message: "New PIN must be exactly 6 digits"
      });
    }

    // Verify OTP
    const validOtp = await storage.getValidOtpCode(email, otpCode, "pin_reset");
    if (!validOtp) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired OTP code"
      });
    }

    // Mark OTP as used
    await storage.markOtpAsUsed(validOtp.id);

    // Get user
    const user = await storage.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Hash new PIN and update
    const newPinHash = await hashPin(newPin);
    await storage.updateUserPin(user.id, newPinHash);

    res.json({
      success: true,
      message: "PIN reset successfully"
    });
  } catch (error) {
    console.error("PIN reset error:", error);
    res.status(500).json({
      success: false,
      message: "PIN reset failed. Please try again."
    });
  }
}

// Change PIN (from dashboard - requires current PIN)
export async function changePin(req: Request, res: Response) {
  try {
    const { currentPin, newPin } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    if (!currentPin || !newPin) {
      return res.status(400).json({
        success: false,
        message: "Current PIN and new PIN are required"
      });
    }

    if (currentPin.length !== 6 || !/^\d{6}$/.test(currentPin)) {
      return res.status(400).json({
        success: false,
        message: "Current PIN must be exactly 6 digits"
      });
    }

    if (newPin.length !== 6 || !/^\d{6}$/.test(newPin)) {
      return res.status(400).json({
        success: false,
        message: "New PIN must be exactly 6 digits"
      });
    }

    if (currentPin === newPin) {
      return res.status(400).json({
        success: false,
        message: "New PIN must be different from current PIN"
      });
    }

    // Get user
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Verify current PIN
    const isCurrentPinValid = await verifyPin(currentPin, user.pinHash);
    if (!isCurrentPinValid) {
      return res.status(401).json({
        success: false,
        message: "Current PIN is incorrect"
      });
    }

    // Hash new PIN and update
    const newPinHash = await hashPin(newPin);
    await storage.updateUserPin(user.id, newPinHash);

    res.json({
      success: true,
      message: "PIN changed successfully"
    });
  } catch (error) {
    console.error("Change PIN error:", error);
    res.status(500).json({
      success: false,
      message: "PIN change failed. Please try again."
    });
  }
}