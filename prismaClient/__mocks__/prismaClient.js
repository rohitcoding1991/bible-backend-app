const prisma = {
  oAuthToken: {
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};

module.exports = prisma;
