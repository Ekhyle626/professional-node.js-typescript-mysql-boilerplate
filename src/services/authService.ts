import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';
import { UnauthorizedError } from '../utils/errors';
import { config } from '../config/env';
import { createLogger } from '../utils/logger';

const logger = createLogger('AuthService');
const userRepository = AppDataSource.getRepository(User);

interface LoginInput {
  email: string;
  password: string;
}

interface TokenPayload {
  userId: string;
  email: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export class AuthService {
  /**
   * Login user and generate JWT token
   */
  static async login(input: LoginInput): Promise<AuthResponse> {
    const { email, password } = input;

    // 1. Find user by email (explicitly select password since User has select: false)
    const user = await userRepository.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        password: true,
        isActive: true,
      },
    });

    if (!user) {
      logger.warn('Login attempt with non-existent email', { email });
      throw new UnauthorizedError('Invalid email or password');
    }

    // 2. Check if user is active
    if (!user.isActive) {
      logger.warn('Login attempt for inactive account', { email });
      throw new UnauthorizedError('Account is deactivated');
    }

    // 3. Compare plain password with hashed password in DB
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      logger.warn('Login attempt with wrong password', { email });
      throw new UnauthorizedError('Invalid email or password');
    }

    // 4. Generate JWT token
    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
    };

    const token = jwt.sign(tokenPayload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn as jwt.SignOptions['expiresIn'],
    });

    logger.info('User logged in successfully', { userId: user.id, email });

    // 5. Return token and safe user data
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  /**
   * Verify JWT token and return decoded payload
   */
  static async verifyToken(token: string): Promise<TokenPayload> {
    try {
      const decoded = jwt.verify(token, config.jwt.secret, {
        algorithms: ['HS256'],
      }) as TokenPayload;
      return decoded;
    } catch (error) {
      const err = error as { name?: string };
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedError('Token has expired');
      }
      if (err.name === 'JsonWebTokenError') {
        throw new UnauthorizedError('Invalid token');
      }
      throw new UnauthorizedError('Authentication failed');
    }
  }

  /**
   * Get user from token
   */
  static async getUserFromToken(token: string): Promise<User> {
    const decoded = await this.verifyToken(token);

    const user = await userRepository.findOne({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('Account is deactivated');
    }

    return user;
  }
}