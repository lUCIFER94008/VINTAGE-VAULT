import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'vintage_vault_super_secret_jwt_key_2026_fashion';

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'customer' | 'admin';
  name: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(password, hashed);
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

export function getUserFromRequest(req: NextRequest): TokenPayload | null {
  // Check authorization header
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    return verifyToken(token);
  }

  // Check cookies
  const cookieToken = req.cookies.get('vv_token')?.value;
  if (cookieToken) {
    return verifyToken(cookieToken);
  }

  return null;
}

export function requireAdmin(req: NextRequest): { user: TokenPayload | null; errorResponse: NextResponse | null } {
  const user = getUserFromRequest(req);
  if (!user || user.role !== 'admin') {
    return {
      user: null,
      errorResponse: NextResponse.json(
        { success: false, message: 'Unauthorized: Admin access required.' },
        { status: 403 }
      ),
    };
  }
  return { user, errorResponse: null };
}
