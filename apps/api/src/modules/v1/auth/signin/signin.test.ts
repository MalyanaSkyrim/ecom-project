import { build } from '../../../../utils/vitestHelper'

describe('Signin test', () => {
  const app = build()

  test('Signin', async () => {
    const res = await app.inject({
      url: '/signin',
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
