import MasterStore from "../database/schema/master/master.store";
import requesHandler from "../lib/request-handler";

import { boolean, z } from "zod";
import Hash from "../services/hash.service";
import NodeMail from "../services/mail.service";
import ApiResponse from "../lib/api-response";
import { JwtService } from "../services/jwt.service";
import { getFromObject } from "../lib/utils";
import { Roles } from "../lib/types";

const createValidation = z.object({
  email: z.string().email(),
  name: z.string().min(3).max(20),
  password: z.string(),
});

const verificationValidation = z.object({
  email: z.string().email(),
  otp: z
    .string()
    .min(6, "Must be 6-digit otp")
    .max(6, "Must be a six digit otp"),
});

const create = requesHandler(async (req, res, next) => {
  const { email, name, password } = createValidation.parse(req.body);

  const verificationCode = Math.floor(100000 + Math.random() * 900000);
  const verificationExpiration = new Date(new Date().getTime() + 5 * 60 * 1000);
  const passwordHashed = await Hash.service.hash(password);

  const masterUser = await MasterStore.create({
    email,
    name,
    verificationCode,
    verificationExpiration,
    password: passwordHashed,
  });

  const mailService = await NodeMail.service.initiateOTP({
    mail: email,
    otp: verificationCode,
  });

  res.status(201).send(new ApiResponse(201, "Verification code sent"));
});

const verify = requesHandler(async (req, res, next) => {
  const { email, otp } = verificationValidation.parse(req.body);

  const master = await MasterStore.get(
    { email: email },
    { select: ["verificationCode", "verificationExpiration"] }
  );

  console.log(master);

  if (
    !master ||
    typeof master?.verificationExpiration === "undefined" ||
    master.verificationExpiration <= new Date()
  ) {
    res.status(400).send(new ApiResponse(400, "Wrong otp", null, null));
    return;
  }

  if (!(master.verificationCode === parseInt(otp))) {
    res.status(400).send(new ApiResponse(400, "Wrong otp", null, null));
    return;
  }

  master.verified = true;
  const token = JwtService.genToken({ userId: master.id, role: Roles.Master });

  await master.save();

  res.status(200).send(new ApiResponse(200, "User Verified", { token: token }));
});

const me = requesHandler(async (req, res, next) => {
  const userId = getFromObject(res, "userId");

  const master = await MasterStore.get(
    { id: userId },
    { select: ["email", "games"] }
  );

  res.status(200).send(new ApiResponse(200, "Master Details", { master }));
});

const masterController = {
  create,
  verify,
  me,
};

export default masterController;
