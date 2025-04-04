import { Request, Response, NextFunction } from 'express';
import { prisma } from '../server';
import { revokeToken } from '../utils/token';
import { generateTokensMiddleware } from '../middleware/token';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const userExists = await prisma.user.findUnique({ where: { email } });

    if (userExists) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password,
      },
    });
    console.log(user);

    return res.status(201).json(user);
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

    // ❌ WARNING: Vulnerable to SQL injection (for testing only)
    const query = `SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`;
    const user: any[] = await prisma.$queryRawUnsafe(query);

    if (!user || user.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const foundUser = user[0];

    req.body.userId = foundUser.id;
    req.body.firstName = foundUser.firstName;
    req.body.lastName = foundUser.lastName;

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
