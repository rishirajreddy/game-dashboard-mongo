import bcrypt from "bcrypt";

async function hash(pass: string) {
  const salts = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(pass, salts);

  return hash;
}

async function compare(pass: string, dbPass: string) {
  const compare = await bcrypt.compare(pass, dbPass);

  return compare;
}

const Hash = {
  service: {
    hash,
    compare,
  },
};

export default Hash;
