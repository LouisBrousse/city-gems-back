import jwt from 'jsonwebtoken';
import { prisma } from '../server';


const jwtKey = process.env.JWT_KEY;
const jwtRefreshKey = process.env.JWT_REFRESH_KEY;

if (!jwtKey) {
  throw new Error('JWT_KEY is not defined in environment variables');
}

if (!jwtRefreshKey) {
  throw new Error('JWT_REFRESH_KEY is not defined in environment variables');
}


export const generateAccessToken = (userId: number) => {
  return jwt.sign({ userId }, jwtKey);
};


export const generateRefreshToken = (userId: number, jti: string) => {
  return jwt.sign({ userId, jti }, jwtRefreshKey);
};


export const validateToken = (token: string, secret: string) => {
  try {
    return jwt.verify(token, secret) as jwt.JwtPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export async function revokeToken(token: string, userId: number, expires_at: Date) {
  try {
  
    const decoded = validateToken(token, jwtRefreshKey as string);

    if (!decoded || decoded.userId !== userId) {
      throw new Error('Invalid token or user ID mismatch');
    }

    const existingToken = await prisma.revokedToken.findFirst({
      where: { token },
    });

    if (existingToken) {
      throw new Error('Token has already been revoked');
    }

    await prisma.revokedToken.create({
      data: {
        token,
        userId,
        expires_at,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error blacklisting token:', error.message);
      throw new Error(error.message || 'Could not blacklist the token');
    } else {
      console.error('Unexpected error:', error);
      throw new Error('Could not blacklist the token');
    }
  }
}

export async function isTokenRevoked(token: string): Promise<boolean> {
  try {
    const blacklistedToken = await prisma.revokedToken.findFirst({
      where: { token },
    });

    return blacklistedToken !== null;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error checking token blacklist status:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    throw new Error('Could not check the token status');
  }
}
