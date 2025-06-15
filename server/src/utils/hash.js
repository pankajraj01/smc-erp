const bcrypt = require("bcryptjs");

const run = async () => {
  const plainPassword = "1234";
  const hashedPassword = await bcrypt.hash(plainPassword, 12);
  console.log("Hashed Password:", hashedPassword);
};

run();
