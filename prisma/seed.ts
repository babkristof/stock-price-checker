import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.stock.upsert({
    where: { symbol: 'AAPL' },
    update: {},
    create: {
      symbol: 'AAPL',
      displaySymbol: 'AAPL',
      description: 'APPLE INC',
      figi: 'BBG000B9XRY4',
      mic: 'XNAS',
      currency: 'USD',
      type: 'COMMON_STOCK',
      prices: {
        create: [],
      },
    },
  });

  await prisma.stock.upsert({
    where: { symbol: 'AMZN' },
    update: {},
    create: {
      symbol: 'AMZN',
      displaySymbol: 'AMZN',
      description: 'AMAZON.COM INC',
      figi: 'BBG000BVPV84',
      mic: 'XNAS',
      currency: 'USD',
      type: 'COMMON_STOCK',
      prices: {
        create: [],
      },
    },
  });

  console.log('Stocks have been seeded.');
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })