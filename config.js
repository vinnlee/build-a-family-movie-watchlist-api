export const getJwtSecret = () =>
  process.env.JWT_SECRET || "dev-only-secret";
export const getJwtExpiresIn = () => process.env.JWT_EXPIRES_IN || "1h";