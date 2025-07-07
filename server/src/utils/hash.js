const bcrypt = require("bcryptjs");

const run = async () => {
  const plainPassword = "CHAGAN";
  const hashedPassword = await bcrypt.hash(plainPassword, 12);
  console.log("Hashed Password:", hashedPassword);
};

run();
