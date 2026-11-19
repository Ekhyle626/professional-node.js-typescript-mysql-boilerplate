import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from './BaseEntity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email!: string;

  @Column({ select: false })
  password!: string;

  @Column({ name: 'first_name', length: 100 })
  firstName!: string;

  @Column({ name: 'last_name', length: 100 })
  lastName!: string;

  @Column({ name: 'is_active', default: true })
  isActive!: boolean;

  @Column({ name: 'is_email_verified', default: false })
  isEmailVerified!: boolean;
}