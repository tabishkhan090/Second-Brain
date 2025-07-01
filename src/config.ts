if (!process.env.JWT_USER_PASSWORD) {
  throw new Error("JWT_USER_PASSWORD is not defined in the environment variables");
}

export const JWT_USER_PASSWORD = process.env.JWT_USER_PASSWORD;