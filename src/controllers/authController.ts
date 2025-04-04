import { Request, Response, NextFunction } from 'express';
import { prisma } from '../server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validateToken, revokeToken, isTokenRevoked } from '../utils/token';
import { generateTokensMiddleware } from '../middleware/token';

const isPasswordStrong = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    console.log("Received password:", password); // Debugging

    if (!isPasswordStrong(password)) {
      console.log("Weak password detected, rejecting request."); // Debugging
      return res.status(400).json({
        error: 'Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.',
      });
    }

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error('Error details:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};



export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    req.body.userId = user.id;
    req.body.firstName = user.firstName;
    req.body.lastName = user.lastName;

    return generateTokensMiddleware(req, res);
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    const { refreshToken, userId } = req.body;

    if (!refreshToken || typeof userId !== 'number') {
      return res.status(400).json({ error: 'Refresh token and valid user ID are required' });
    }

    await revokeToken(refreshToken, userId, new Date());

    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error during logout:', error.message);
      return res.status(400).json({ error: error.message });
    } else {
      console.error('Unexpected error during logout:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};
