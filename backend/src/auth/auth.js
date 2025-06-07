import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Email transporter configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// In-memory OTP store (for production, use a database)
const otpStore = {};

/**
 * Handle User Signup
 */
export const handleSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const username = email.split('@')[0];

    const user = await prisma.user.create({
      data: { name, email, username, password: hashedPassword },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '10d' }
    );

    const options = {
      expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    };

    res.status(201).cookie('token', token, options).json({
      message: 'Registration successful',
      user,
    });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

/**
 * Handle User Login
 */
export const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '10d' }
    );

    const options = {
      expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    };

    res.status(200).cookie('token', token, options).json({
      message: 'Login successful',
      user,
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: `Login failed: ${error}` });
  }
};

/**
 * Handle User Logout
 */
export const handleLogoutUser = async (_req, res) => {
  try {
    res.status(200).cookie('token', null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    }).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occured',
    });
  }
};

/**
 * Handle Google Authentication
 */
export const handleGoogleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({ error: 'Invalid Google token' });
    }

    const { sub: googleId, email, name } = payload;

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      const randomPassword = email.split('@')[0];
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = await prisma.user.create({
        data: {
          email,
          name,
          token: googleId,
          password: hashedPassword,
          username: email.split('@')[0],
        },
      });
    }

    const jwtToken = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '10d' }
    );

    const options = {
      expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    };

    res.status(200).cookie('token', jwtToken, options).json({
      message: 'Login successful',
      user,
    });
  } catch (error) {
    console.error('Google authentication error:', error);
    res.status(400).json({ error: 'Invalid Google token' });
  }
};

/**
 * Validate User Token
 */
export const handleValidation = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized: No user information found' });
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) {
      return res.status(404).json({ message: 'No user found for the given token' });
    }

    res.status(200).json({
      message: 'Validation successful',
      user,
    });
  } catch (error) {
    console.error('Token validation failed:', error);
    res.status(500).json({ error: 'Server error during validation' });
  }
};

/**
 * Handle OTP Sending
 */
export const handleSendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      return res.status(409).json({ error: 'User already exists!!' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 10 * 60 * 1000;

    otpStore[email] = { otp, expiry };

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Your OTP for Signup',
      html: `<p>Your OTP is <strong>${otp}</strong>. It will expire in 10 minutes.</p>`,
    });

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};

/**
 * Handle OTP Verification
 */
export const handleVerifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const storedOTP = otpStore[email];
  if (!storedOTP || storedOTP.otp !== otp || Date.now() > storedOTP.expiry) {
    return res.status(400).json({ error: 'Invalid or expired OTP' });
  }

  delete otpStore[email];
  res.status(200).json({ message: 'OTP verified successfully' });
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user?.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const validPassword = await bcrypt.compare(oldPassword, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
