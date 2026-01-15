export default ({ env }: { env: any }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  http: {
    serverOptions: {
      requestTimeout: 30 * 60 * 1000, // 30 minutes
    },
  },
});
