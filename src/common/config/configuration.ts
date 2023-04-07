export default (): Configuration => ({
  port: parseInt(process.env.PORT, 10) || 3333,
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: String(process.env.JWT_SECRET),
    expiresIn: String(process.env.JWT_EXPIRES_IN),
  },
});

export const config: Configuration = {
  port: parseInt(process.env.PORT, 10) || 3333,
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: String(process.env.JWT_SECRET),
    expiresIn: String(process.env.JWT_EXPIRES_IN),
  },
};

type Configuration = {
  port: number;
  database: Database;
  jwt: JWT;
};

type Database = {
  url: string;
};

type JWT = {
  secret: string;
  expiresIn: string;
};
