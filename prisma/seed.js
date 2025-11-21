// prisma/seed.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const provinces = [
  { name: "Koshi", districts: ["Taplejung","Sankhuwasabha","Solukhumbu","Okhaldhunga","Khotang","Bhojpur","Dhankuta","Terhathum","Panchthar","Ilam","Jhapa","Morang","Sunsari","Udayapur"] },
  { name: "Madhesh Province", districts: ["Saptari","Siraha","Dhanusha","Mahottari","Sarlahi","Rautahat","Bara","Parsa"] },
  { name: "Bagmati Province", districts: ["Sindhuli","Ramechhap","Dolakha","Bhaktapur","Dhading","Kathmandu","Kavrepalanchok","Lalitpur","Nuwakot","Rasuwa","Sindhupalchok","Chitwan","Makwanpur"] },
  { name: "Gandaki Province", districts: ["Gorkha","Kaski","Lamjung","Manang","Mustang","Myagdi","Nawalpur","Parbat","Syangja","Baglung","Tanahun"] },
  { name: "Lumbini Province", districts: ["Kapilvastu","Parasi","Rupandehi","Arghakhanchi","Gulmi","Palpa","Dang","Pyuthan","Rolpa","Eastern Rukum","Banke","Bardiya"] },
  { name: "Karnali Province", districts: ["Western Rukum","Salyan","Dolpa","Humla","Jumla","Kalikot","Mugu","Surkhet","Dailekh","Jajarkot"] },
  { name: "Sudurpashchim Province", districts: ["Kailali","Kanchanpur","Dadeldhura","Baitadi","Darchula","Bajhang","Bajura","Achham","Doti"] }
];

async function main() {
  console.log("🌍 Seeding provinces and districts...");
  for (const p of provinces) {
    const province = await prisma.province.upsert({
      where: { name: p.name },
      update: {},
      create: { name: p.name },
    });

    for (const d of p.districts) {
      await prisma.district.upsert({
        where: { name: d },
        update: {},
        create: { name: d, provinceId: province.id },
      });
    }
  }
  console.log("✔ Seed Complete!");
}

main()
  .then(() => prisma.$disconnect())
  .catch((err) => {
    console.error(err);
    prisma.$disconnect();
  });
