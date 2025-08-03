import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateUsersTable1700000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar',
          },
          {
            name: 'phoneNumber',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'emailVerified',
            type: 'boolean',
            isNullable: true,
          },
          {
            name: 'phoneVerified',
            type: 'boolean',
            isNullable: true,
          },
          {
            name: 'fullName',
            type: 'varchar',
          },
          {
            name: 'avatarUrl',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'bio',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'country',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'role',
            type: 'enum',
            enum: ['admin', 'user'],
            default: `'user'`,
          },
          {
            name: 'permissions',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'packageType',
            type: 'enum',
            enum: ['free', 'standard', 'premium'],
            default: `'free'`,
          },
          {
            name: 'packageExpiresAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'isSuspended',
            type: 'boolean',
            default: false,
          },
          {
            name: 'suspensionReason',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true
    );

    // 🔍 Indexes
    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'IDX_users_id',
        columnNames: ['id'],
      })
    );

    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'IDX_users_email',
        columnNames: ['email'],
      })
    );

    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'IDX_users_phoneNumber',
        columnNames: ['phoneNumber'],
      })
    );

    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'IDX_users_role',
        columnNames: ['role'],
      })
    );

    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'IDX_users_packageType',
        columnNames: ['packageType'],
      })
    );

    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'IDX_users_createdAt',
        columnNames: ['createdAt'],
      })
    );

    // 🧩 Compound Index (role + packageType)
    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'IDX_users_role_packageType',
        columnNames: ['role', 'packageType'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('users', 'IDX_users_role_packageType');
    await queryRunner.dropIndex('users', 'IDX_users_createdAt');
    await queryRunner.dropIndex('users', 'IDX_users_packageType');
    await queryRunner.dropIndex('users', 'IDX_users_role');
    await queryRunner.dropIndex('users', 'IDX_users_phoneNumber');
    await queryRunner.dropIndex('users', 'IDX_users_email');
    await queryRunner.dropIndex('users', 'IDX_users_id');
    await queryRunner.dropTable('users');
  }
}
