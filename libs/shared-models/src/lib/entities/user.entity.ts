import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export enum PackageType {
  FREE = 'free',
  STANDARD = 'standard',
  PREMIUM = 'premium',
}

@Entity({ name: 'users' })
@Index(['role', 'packageType']) // compound index (useful for filters and dashboards)
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Index() // Index on ID for faster lookups (redundant if UUID PK is default indexed, but explicit helps clarity)
  id!: string;

  @Column({ unique: true })
  @Index() // Unique index on email (enforced automatically)
  email!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  @Index() // Phone-based lookups (optional)
  phoneNumber?: string;

  @Column({ nullable: true })
  emailVerified?: boolean;

  @Column({ nullable: true })
  phoneVerified?: boolean;

  @Column()
  fullName!: string;

  @Column({ nullable: true })
  avatarUrl?: string;

  @Column({ nullable: true })
  bio?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  @Index()
  role!: UserRole;

  @Column('simple-array', { nullable: true })
  permissions?: string[];

  @Column({ type: 'enum', enum: PackageType, default: PackageType.FREE })
  @Index()
  packageType!: PackageType;

  @Column({ type: 'timestamp', nullable: true })
  packageExpiresAt?: Date;

  @Column({ default: false })
  isSuspended!: boolean;

  @Column({ nullable: true })
  suspensionReason?: string;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  @Index() // Allows querying users by creation date (e.g., for analytics, sorting)
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
