import { Pool, PoolClient } from 'pg';

export class DatabaseHelper {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: 'localhost',
      port: 5432,
      database: 'scrub_db',
      user: 'scrub_user',
      password: 'scrub_password',
    });
  }

  // Get user by email
  async getUserByEmail(email: string) {
    const client = await this.pool.connect();
    try {
      const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // Create test user
  async createTestUser(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: string;
  }) {
    const client = await this.pool.connect();
    try {
      const userId = `test-user-${Date.now()}`;
      const result = await client.query(
        `INSERT INTO users (id, email, password, first_name, last_name, role, created_at, updated_at) 
         VALUES ($1, $2, $3, $4, $5, $6, now(), now()) 
         RETURNING *`,
        [userId, userData.email, userData.password, userData.firstName, userData.lastName, userData.role || 'client']
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Delete test user
  async deleteTestUser(email: string) {
    const client = await this.pool.connect();
    try {
      await client.query('DELETE FROM users WHERE email = $1', [email]);
    } finally {
      client.release();
    }
  }

  // Clean up all test users
  async cleanupTestUsers() {
    const client = await this.pool.connect();
    try {
      await client.query("DELETE FROM users WHERE id LIKE 'test-user-%'");
    } finally {
      client.release();
    }
  }

  // Get all users
  async getAllUsers() {
    const client = await this.pool.connect();
    try {
      const result = await client.query('SELECT id, email, first_name, last_name, role FROM users');
      return result.rows;
    } finally {
      client.release();
    }
  }

  // Close connection pool
  async close() {
    await this.pool.end();
  }
}
