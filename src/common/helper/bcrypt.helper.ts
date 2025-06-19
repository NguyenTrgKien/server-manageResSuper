import * as bcrypt from 'bcrypt';

const salt_round = 10;

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, salt_round);
}

export async function comparePassword(
  plainPass: string,
  hash: string,
): Promise<boolean> {
  return await bcrypt.compare(plainPass, hash);
}
