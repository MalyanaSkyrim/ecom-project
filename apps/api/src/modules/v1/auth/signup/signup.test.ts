import { build } from '../../../../utils/vitestHelper'

describe('Signup test', () => {
  const app = build()

  test('Signup', async () => {
    const res = await app.inject({
      url: '/v1/auth/signup',
      method: 'POST',
      body: {
        email: `test-${Date.now()}@mail.com`, // Unique email
        password: '12345678',
        firstName: 'Test',
        lastName: 'User',
      },
    })
    // Should return 200 for successful signup
    expect(res.statusCode).toEqual(200)
    const response = res.json()
    expect(response).toHaveProperty('user')
  })
})
