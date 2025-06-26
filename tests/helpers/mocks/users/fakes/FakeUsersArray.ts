import { FakeUserFactory } from "./FakeUserFactory";

const fakeUsersSeed = [
  {
    name: "Lucas Andrade",
    email: "lucas.andrade@example.com",
    password: "Dev123!@",
    alias: "lucas_dev42",
  },
  {
    name: "Ana Moura",
    email: "ana.moura@example.com",
    password: "AnaTest1!",
    alias: "ana.moura!",
  },
  {
    name: "João Ferreira",
    email: "joao.ferreira@example.com",
    password: "Joao123#",
    alias: "joao-doido7",
  },
  {
    name: "Bruna Silva",
    email: "bruna.silva@example.com",
    password: "TopBruna9?",
    alias: "bruna?top",
  },
  {
    name: "Carlos Teste",
    email: "carlos.teste@example.com",
    password: "Carlos!5A",
    alias: "user_test123",
  },
];

export const fakeUsersArray = fakeUsersSeed.map(
  ({ alias, email, name, password }) =>
    FakeUserFactory.createUser({
      alias,
      email,
      name,
      password,
    }),
);
