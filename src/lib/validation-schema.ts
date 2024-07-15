import { z } from "zod";

const googleTokenSchema = z.object({
  access_token: z.string(),
  id_token: z.string(),
});

const googleProfileInfo = z.object({
  email: z.string(),
  name: z.string(),
  picture: z.string(),
});

const appBuildSchema = z.object({
  appName: z.string(),
  upload: z.string(),
  instances: z.string(),
  gpuType: z.string(),
  pricing: z.string(),
  port: z.string(),
});

const connectBody = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Must be of 6 letters"),
});

const paymentsFieldSchema = z.object({
  currency_code: z.string(),
  value: z.string(),
  buildName: z.string(),
});

const authTokenSchema = z.object({
  userId: z.string(),
  provider: z.string(),
  role: z.string(),
});

export const validation = {
  googleTokens: googleTokenSchema,
  googleProfile: googleProfileInfo,
  payment: paymentsFieldSchema,
  authToken: authTokenSchema,
  connectBody,
  appBuildSchema,
};
