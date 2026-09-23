import { test, expect } from '@playwright/test';

test.describe('Login API', () => {
  test('should login successfully with valid credentials', async ({ request }) => {
    const response = await request.post('/auth/login', {
      data: {
        email: 'client@example.com',
        password: 'password123'
      }
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    
    expect(body.success).toBe(true);
    expect(body.data).toHaveProperty('accessToken');
    expect(body.data.user).toHaveProperty('email', 'client@example.com');
  });

  test('should return 401 with invalid credentials', async ({ request }) => {
    const response = await request.post('/auth/login', {
      data: {
        email: 'client@example.com',
        password: 'wrongpassword'
      }
    });

    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.success).toBe(false);
  });
});
