import { createConnection } from 'typeorm'

export const postgresProviders = [
  {
    provide: 'POSTGRES_CONNECTION',
    // tslint:disable-next-line: arrow-return-shorthand
    useFactory: async () => {
      let theConnection
      try {
        theConnection = await createConnection({
          type: 'postgres',
          host: '127.0.0.1',
          port: 5432,
          username: 'p2p',
          password: 'mysecretpassword',
          database: 'p2p',
          entities: [
            // tslint:disable-next-line: prefer-template
            __dirname + '/../**/*.entity{.ts,.js}',
          ],
          synchronize: false,
        })
      } catch (error) {
        // tslint:disable-next-line: no-console
        console.log(error.message)
      }

      return theConnection
    },
  },
]
