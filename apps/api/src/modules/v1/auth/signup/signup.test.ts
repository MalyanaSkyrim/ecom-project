import { build } from '../../../../utils/vitestHelper'

describe('Signup test', () => {
  const app = build()

  test('Signup', async () => {
    const res = await app.inject({
      url: '/signup',
      method: 'POST',
      body: {
        email: 'aa@mail.com',
        password: '12345678',
      },
    })
    expect(res.statusCode).toEqual(401)
    expect(res.json().status).toEqual('Unauthorized')
  })
})
