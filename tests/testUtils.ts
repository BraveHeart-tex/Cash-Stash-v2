import { faker } from "@faker-js/faker";

export const getUserData = () => {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    hashedPassword: faker.internet.password(),
    name: faker.person.firstName(),
  };
};
