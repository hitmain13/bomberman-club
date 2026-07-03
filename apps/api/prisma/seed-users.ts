import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

interface UserSeed {
  username: string;
  email: string;
  password: string;
  role?: Role;
}

const users: UserSeed[] = [
  {
    username: "matsu-bombermanclub",
    email: "fabio.matsumoto.dev@gmail.com",
    password: "Onboard@8723",
  },
  {
    username: "hitmain13",
    email: "hide.fabio123@gmail.com",
    password: "Onboard@8723",
    role: Role.ADMIN,
  },
];

async function upsertUser(user: UserSeed): Promise<void> {
  const passwordHash = await Bun.password.hash(user.password, { algorithm: "argon2id" });
  const username = user.username.toLowerCase();
  const email = user.email.toLowerCase();
  const role = user.role ?? Role.USER;

  const existing =
    (await prisma.user.findUnique({ where: { username } })) ??
    (await prisma.user.findUnique({ where: { email } }));

  if (existing) {
    await prisma.user.update({
      where: { id: existing.id },
      data: { username, email, passwordHash, role, bannedAt: null },
    });
  } else {
    await prisma.user.create({
      data: { username, email, passwordHash, role },
    });
  }

  process.stdout.write(`User ready: @${username} (${role})\n`);
}

async function main(): Promise<void> {
  for (const user of users) {
    await upsertUser(user);
  }
}

main()
  .catch((error: unknown) => {
    process.stderr.write(
      `${error instanceof Error ? (error.stack ?? error.message) : String(error)}\n`,
    );
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
