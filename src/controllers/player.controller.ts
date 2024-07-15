import { z } from "zod";
import requestHandler from "../lib/request-handler";
import generateUID from "../lib/uid";
import PlayerStore from "../database/schema/player/player.store";
import Hash from "../services/hash.service";
import { JwtService } from "../services/jwt.service";
import ApiResponse from "../lib/api-response";
import { Roles } from "../lib/types";

const createValidation = z.object({
  email: z.string().email(),
  password: z.string(),
  name: z.string(),
});

const loginValidation = z.object({
  email: z.string().email(),
  password: z.string(),
});

const create = requestHandler(async (req, res, next) => {
  const { email, password, name } = createValidation.parse(req.body);

  const uid = parseInt(generateUID());
  const hashedPassword = await Hash.service.hash(password);
  const user = await PlayerStore.create({
    email,
    password: hashedPassword,
    name,
    uid,
  });

  const userToken = JwtService.genToken({
    userId: user.id,
    role: Roles.Player,
  });

  res
    .status(200)
    .send(
      new ApiResponse(200, "Player created successfully", { token: userToken })
    );
});

const login = requestHandler(async (req, res, next) => {
  const { email, password } = loginValidation.parse(req.body);

  const player = await PlayerStore.get(
    { email: email },
    { select: ["_id", "email", "password"] }
  );

  if (!player) {
    res.status(403).send(new ApiResponse(403, "Wrong credentials"));
    return;
  }

  const isPasswordCorrect = await Hash.service.compare(
    password,
    player.password || ""
  );

  if (!isPasswordCorrect) {
    res.status(403).send(new ApiResponse(403, "Wrong credentials"));
    return;
  }

  const token = JwtService.genToken({ userId: player.id, role: Roles.Player });

  res
    .status(200)
    .send(new ApiResponse(200, "Logged in successfully", { token }));
});

const forgotPassword = requestHandler(async (req, res, next) => {
  
})

const playerController = {
  login,
  create,
};

export default playerController;
