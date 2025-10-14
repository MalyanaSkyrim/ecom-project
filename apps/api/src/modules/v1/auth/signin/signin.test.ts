import { build } from '../../../../utils/vitestHelper'

describe('Signin test', () => {
  const app = build()

  test('Signin', async () => {
    const res = await app.inject({
      url: '/v1/auth/signin',
      method: 'POST',
      body: {
        email: 'aa@mail.com',
        password: '12345678',
      },
    })
    // Should return 401 for invalid credentials
    expect(res.statusCode).toEqual(401)
    const response = res.json()
    expect(response).toHaveProperty('message')
  })
})
