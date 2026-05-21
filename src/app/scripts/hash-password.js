// scripts/hash-password.js
// Utilisation : node scripts/hash-password.js
// Génère le hash bcrypt pour ADMIN_PASSWORD_HASH dans .env.local

const bcrypt = require("bcryptjs");
const readline = require("readline");

const rl = readline.createInterface({
  input:  process.stdin,
  output: process.stdout,
});

// Masque la saisie du mot de passe
rl.question("Entrez le mot de passe admin : ", async (password) => {
  rl.close();

  if (!password || password.length < 8) {
    console.error("❌ Le mot de passe doit contenir au moins 8 caractères.");
    process.exit(1);
  }

  console.log("\n⏳ Génération du hash (cost=12, ~1-2s)...");
  const hash = await bcrypt.hash(password, 12);

  console.log("\n Hash généré :");
  console.log(`\nADMIN_PASSWORD_HASH="${hash}"\n`);
  console.log("👉 Copiez cette ligne dans votre .env.local");
});