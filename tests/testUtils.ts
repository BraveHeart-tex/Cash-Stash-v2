import { faker } from "@faker-js/faker";

export const getUserData = () => {
  return {
    email: faker.internet.email(),
    hashedPassword: faker.internet.password(),
    name: faker.person.firstName(),
  };
};
