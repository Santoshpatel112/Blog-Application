import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create a dummy user first
  const user = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      email: 'john@example.com',
      name: 'John Doe',
      clearkUserId: 'user_dummy123',
      imageURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    },
  });

  console.log('Created user:', user);

  // Create 3 dummy articles
  const articles = await Promise.all([
    prisma.article.create({
      data: {
        title: 'Getting Started with Next.js 16',
        content: 'Next.js 16 brings amazing new features including improved performance, better developer experience, and enhanced routing capabilities. Learn how to build modern web applications with the latest version.',
        category: 'Technology',
        featuredImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
        authorId: user.id,
      },
    }),
    prisma.article.create({
      data: {
        title: 'The Future of Web Development',
        content: 'Explore the cutting-edge trends shaping the future of web development. From AI integration to serverless architectures, discover what\'s next in the world of web technologies.',
        category: 'Web Development',
        featuredImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
        authorId: user.id,
      },
    }),
    prisma.article.create({
      data: {
        title: 'Mastering TypeScript in 2024',
        content: 'TypeScript has become essential for modern JavaScript development. This comprehensive guide covers advanced patterns, best practices, and tips to level up your TypeScript skills.',
        category: 'Programming',
        featuredImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
        authorId: user.id,
      },
    }),
  ]);

  console.log('Created articles:', articles.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
