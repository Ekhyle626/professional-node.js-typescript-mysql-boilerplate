import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';
import {
  NotFoundError,
  ConflictError,
  ValidationError,
} from '../utils/errors';
import { createLogger } from '../utils/logger';

const logger = createLogger('UserService');

export interface CreateUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UpdateUserInput {
  email?: string;
  firstName?: string;
  lastName?: string;
}

export class UserService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  async createUser(input: CreateUserInput): Promise<Omit<User, 'password'>> {
    const existingUser = await this.userRepository.findOne({
      where: { email: input.email.toLowerCase() },
    });

    if (existingUser) {
      logger.warn(`Attempt to create user with existing email: ${input.email}`);
      throw new ConflictError('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(input.password, 12);

    const user = this.userRepository.create({
      email: input.email.toLowerCase(),
      password: hashedPassword,
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
    });

    const savedUser = await this.userRepository.save(user);
    logger.info(`User created successfully: ${savedUser.id}`);

    const { password: _, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  async getUserById(id: string): Promise<Omit<User, 'password'>> {
    if (!id || typeof id !== 'string') {
      throw new ValidationError('Invalid user ID');
    }

    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundError('User', id);
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getAllUsers(
    page = 1,
    limit = 10
  ): Promise<{
    users: Omit<User, 'password'>[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(100, Math.max(1, limit));
    const skip = (safePage - 1) * safeLimit;

    const [users, total] = await this.userRepository.findAndCount({
      skip,
      take: safeLimit,
      order: { createdAt: 'DESC' },
    });

    return {
      users,
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit),
    };
  }

  async updateUser(
    id: string,
    input: UpdateUserInput
  ): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundError('User', id);
    }

    if (input.email && input.email.toLowerCase() !== user.email) {
      const existingEmail = await this.userRepository.findOne({
        where: { email: input.email.toLowerCase() },
      });

      if (existingEmail) {
        throw new ConflictError('Email already in use');
      }
      user.email = input.email.toLowerCase();
    }

    if (input.firstName !== undefined) {
      user.firstName = input.firstName.trim();
    }

    if (input.lastName !== undefined) {
      user.lastName = input.lastName.trim();
    }

    const updatedUser = await this.userRepository.save(user);
    logger.info(`User updated successfully: ${updatedUser.id}`);

    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundError('User', id);
    }

    await this.userRepository.softDelete(id);
    logger.info(`User soft deleted: ${id}`);
  }
}