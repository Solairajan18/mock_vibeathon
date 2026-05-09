import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Create Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@bytebrains.com' },
    update: {},
    create: {
      email: 'admin@bytebrains.com',
      name: 'Agent Smith',
      role: 'ADMIN',
    },
  });

  const client1 = await prisma.user.upsert({
    where: { email: 'client1@example.com' },
    update: {},
    create: {
      email: 'client1@example.com',
      name: 'John Doe',
      role: 'CLIENT',
    },
  });

  const client2 = await prisma.user.upsert({
    where: { email: 'client2@example.com' },
    update: {},
    create: {
      email: 'client2@example.com',
      name: 'Jane Smith',
      role: 'CLIENT',
    },
  });

  console.log('Users created.');

  // Create Policies
  const policy1 = await prisma.policy.create({
    data: {
      userId: client1.id,
      type: 'Health',
      coverageAmount: 500000,
      renewalDate: new Date(new Date().setDate(new Date().getDate() + 15)), // 15 days from now
      status: 'Active',
    },
  });

  const policy2 = await prisma.policy.create({
    data: {
      userId: client1.id,
      type: 'Auto',
      coverageAmount: 200000,
      renewalDate: new Date(new Date().setDate(new Date().getDate() + 180)),
      status: 'Active',
    },
  });

  const policy3 = await prisma.policy.create({
    data: {
      userId: client2.id,
      type: 'Health',
      coverageAmount: 1000000,
      renewalDate: new Date(new Date().setDate(new Date().getDate() - 5)), // Expired 5 days ago
      status: 'Expired',
    },
  });

  console.log('Policies created.');

  // Create Claims
  await prisma.claim.create({
    data: {
      policyId: policy1.id,
      userId: client1.id,
      status: 'In Progress',
      description: 'Hospitalization for fever.',
    },
  });

  await prisma.claim.create({
    data: {
      policyId: policy2.id,
      userId: client1.id,
      status: 'Approved',
      description: 'Car bumper repair.',
    },
  });

  console.log('Claims created.');

  // Create Knowledge Base
  const faqs = [
    {
      question: 'How do I check my claim status?',
      answer: 'You can check your claim status by asking me directly or visiting the Dashboard under "Claims".',
      category: 'Claims',
    },
    {
      question: 'What is covered under my health policy?',
      answer: 'Standard health policies cover hospitalization, pre and post hospital care, and day care procedures. Dental is generally not covered unless specified.',
      category: 'Coverage',
    },
    {
      question: 'How can I renew my policy?',
      answer: 'You can renew your policy by clicking on the "Renew Policy" quick action or by navigating to the Renewals section on your dashboard.',
      category: 'Renewals',
    },
    {
      question: 'Where can I download my policy document?',
      answer: 'Policy documents can be downloaded from the "Documents" section on your dashboard.',
      category: 'Policies',
    },
  ];

  for (const faq of faqs) {
    await prisma.knowledgeBase.create({
      data: faq,
    });
  }

  console.log('Knowledge Base created.');
  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
