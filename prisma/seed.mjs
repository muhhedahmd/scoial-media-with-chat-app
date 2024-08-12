import { Gender, ReactionType, Role } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client/extension';

const prisma = new PrismaClient()
async function main() {
  // Create 60 users with profiles
  for (let i = 0; i < 60; i++) {
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        first_name: faker.name.firstName(),
        role: Role.user,
        password: 'password',
        profile: {
          create: {
            bio: faker.lorem.sentences(),
            profile_picture: faker.image.avatar(),
            cover_picture: faker.image.imageUrl(),
            location: faker.address.city(),
            website: faker.internet.url(),
            birthdate: faker.date.past(),
            gender: Gender.MALE,
          },
        },
      },
    });

    // Create 10 posts for each user
    for (let j = 0; j < 10; j++) {
      await prisma.post.create({
        data: {
          author_id: user.id,
          title: faker.lorem.sentence(),
          published: faker.datatype.boolean(),
          post_image: {
            create: [
              {
                img_path: faker.image.imageUrl(),
              },
            ],
          },
          categories: {
            create: [
              {
                category: {
                  create: {
                    name: faker.lorem.word(),
                  },
                },
              },
            ],
          },
          Comment: {
            create: [
              {
                content: faker.lorem.sentences(),
                author_id: user.id,
                replay: {
                  create: [
                    {
                      content: faker.lorem.sentences(),
                      author_id: user.id,
                    },
                  ],
                },
              },
            ],
          },
          reaction: {
            create: [
              {
                type: ReactionType.like,
                count: faker.datatype.number({ min: 1, max: 100 }),
              },
              {
                type: ReactionType.angry,
                count: faker.datatype.number({ min: 1, max: 100 }),
              },
            ],
          },
        },
      });
    }
  }
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
