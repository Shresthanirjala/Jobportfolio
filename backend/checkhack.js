import bcrypt from 'bcrypt';

const storedHash = "$2b$10$4pFLOOjkg4oOdE8LSB6aTuJp7uEeqMcuRjQGm05uQtLmtD7rLDZX6";
const enteredPassword = "admin1234";  // The password you're testing

bcrypt.compare(enteredPassword, storedHash).then((result) => {
  console.log("Password match:", result);  // It should log true if they match
}).catch(err => {
  console.error(err);
});
