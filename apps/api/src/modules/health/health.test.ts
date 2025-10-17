import { build } from '../../utils/vitestHelper'

describe('HealthCheck test', () => {
  const app = build()

  test('HealthCheck', async () => {
    const res = await app.inject({
      url: '/health',
      method: 'GET',
      // headers: {
      //   authorization: `Bearer ${env.API_KEY}`,
      // },
    })
    expect(res.statusCode).toEqual(200)
    expect(res.json().status).toEqual('OK')
  })
})
