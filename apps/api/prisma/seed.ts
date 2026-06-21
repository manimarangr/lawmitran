import { PrismaClient, UserRole, VerificationStatus } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

const practiceAreas = [
  ["Family Law", "Marriage, adoption, guardianship, and family disputes."],
  ["Divorce Law", "Mutual consent divorce, alimony, and custody matters."],
  [
    "Property Law",
    "Title checks, registration, tenancy, and property disputes.",
  ],
  ["Criminal Law", "Bail, FIR, trial strategy, and criminal defense."],
  ["Corporate Law", "Contracts, compliance, governance, and transactions."],
  ["Consumer Law", "Consumer complaints, product disputes, and compensation."],
  ["Labour Law", "Employment disputes, wages, termination, and policies."],
  ["Startup Law", "Incorporation, founder agreements, IP, and fundraising."],
];

async function main() {
  for (const [name, description] of practiceAreas) {
    await prisma.practiceArea.upsert({
      where: { name },
      update: { description },
      create: { name, description },
    });
  }

  const password = await bcrypt.hash("Password123!", 12);

  await prisma.user.upsert({
    where: { email: "admin@lawmitran.test" },
    update: {},
    create: {
      name: "Lawmitran Admin",
      email: "admin@lawmitran.test",
      phone: "+919000000001",
      role: UserRole.ADMIN,
      password,
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "customer@lawmitran.test" },
    update: {},
    create: {
      name: "Asha Sharma",
      email: "customer@lawmitran.test",
      phone: "+919000000002",
      role: UserRole.CUSTOMER,
      password,
    },
  });

  const lawyerUsers = await Promise.all(
    [
      {
        name: "Adv. Rohan Mehta",
        email: "rohan@lawmitran.test",
        phone: "+919000000011",
        bar: "DL/LAW/1201",
        city: "Delhi",
        experience: 12,
        fee: 1500,
        bio: "Family and property lawyer focused on practical settlement-first advice.",
        languages: ["English", "Hindi"],
        areas: ["Family Law", "Property Law"],
      },
      {
        name: "Adv. Nisha Iyer",
        email: "nisha@lawmitran.test",
        phone: "+919000000012",
        bar: "MH/LAW/2044",
        city: "Mumbai",
        experience: 9,
        fee: 2200,
        bio: "Corporate and startup counsel for founders, SMEs, and digital businesses.",
        languages: ["English", "Hindi", "Marathi"],
        areas: ["Corporate Law", "Startup Law"],
      },
      {
        name: "Adv. Kabir Khan",
        email: "kabir@lawmitran.test",
        phone: "+919000000013",
        bar: "KA/LAW/3310",
        city: "Bengaluru",
        experience: 15,
        fee: 2500,
        bio: "Criminal defense and consumer litigation lawyer with trial experience.",
        languages: ["English", "Hindi", "Kannada"],
        areas: ["Criminal Law", "Consumer Law"],
      },
    ].map(async (lawyer) => {
      const user = await prisma.user.upsert({
        where: { email: lawyer.email },
        update: {},
        create: {
          name: lawyer.name,
          email: lawyer.email,
          phone: lawyer.phone,
          role: UserRole.LAWYER,
          password,
        },
      });

      await prisma.lawyer.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          userId: user.id,
          barCouncilNumber: lawyer.bar,
          city: lawyer.city,
          experience: lawyer.experience,
          consultationFee: lawyer.fee,
          bio: lawyer.bio,
          languages: lawyer.languages,
          verificationStatus: VerificationStatus.VERIFIED,
          practiceAreas: { connect: lawyer.areas.map((name) => ({ name })) },
          educations: {
            create: [
              {
                degree: "LL.B.",
                institute: "National Law University",
                year: 2010,
              },
            ],
          },
          experiences: {
            create: [
              {
                title: "Partner",
                institution: "Independent Practice",
                years: lawyer.experience,
              },
            ],
          },
          availability: {
            create: [
              { dayOfWeek: 1, startTime: "10:00", endTime: "13:00" },
              { dayOfWeek: 3, startTime: "15:00", endTime: "18:00" },
            ],
          },
        },
      });
      return user;
    }),
  );

  const firstLawyer = await prisma.lawyer.findUniqueOrThrow({
    where: { userId: lawyerUsers[0].id },
  });
  await prisma.review.upsert({
    where: {
      customerId_lawyerId: {
        customerId: customer.id,
        lawyerId: firstLawyer.id,
      },
    },
    update: {},
    create: {
      customerId: customer.id,
      lawyerId: firstLawyer.id,
      rating: 5,
      comment: "Clear advice, transparent fees, and quick follow-up.",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
