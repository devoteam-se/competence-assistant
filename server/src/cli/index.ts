import dotenv from 'dotenv';
import { Command } from 'commander';
import AuthService from '../pkg/auth/firebase';
import { generateData } from './generateData';
import { createUser } from './createUser';
import { signIn } from './signIn';

dotenv.config();
const authService = new AuthService();
const program = new Command();

(async () => {
  program
    .command('create-user')
    .argument('name', 'name of the user')
    .argument('email', 'email of the user')
    .option('-a, --admin', 'creates admin user')
    .action(async (name, email, { admin }) => {
      try {
        const created = await createUser(authService, { name, email, password: 'password', admin });
        const idToken = await signIn(created.email, created.password);
        console.log(idToken);
        process.exit(0);
      } catch (err) {
        console.error(err);
        process.exit(1);
      }
    });
  program
    .command('jwt')
    .argument('email', 'email of the user')
    .action(async (email) => {
      try {
        const idToken = await signIn(email, 'password');
        console.log(idToken);
        process.exit(0);
      } catch (err) {
        console.error(err);
        process.exit(1);
      }
    });

  program.command('list-users').action(async () => {
    const users = await authService.listUsers();
    console.log(users);
    process.exit(0);
  });

  program.command('mock').action(async () => {
    try {
      await generateData(authService);
      process.exit(0);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  });

  program.parse(process.argv);
})();
