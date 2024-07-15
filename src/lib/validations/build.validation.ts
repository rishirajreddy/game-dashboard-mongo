import { z } from "zod";

const name = z.object({
  name: z.string(),
  update: z.string()
});

const buildValidation = {
  name,
};

export default buildValidation;
