import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create owner account
  const ownerPassword = await bcrypt.hash("Bloom2026!", 10);
  const owner = await prisma.profile.upsert({
    where: { email: "owner@marketfourseasons.com" },
    update: {},
    create: {
      email: "owner@marketfourseasons.com",
      password: ownerPassword,
      name: "Market Four Seasons",
      role: "owner",
    },
  });
  console.log("Created owner:", owner.email);

  // Create staff account
  const staffPassword = await bcrypt.hash("BloomStaff2026!", 10);
  const staff = await prisma.profile.upsert({
    where: { email: "staff@marketfourseasons.com" },
    update: {},
    create: {
      email: "staff@marketfourseasons.com",
      password: staffPassword,
      name: "Staff Member",
      role: "staff",
    },
  });
  console.log("Created staff:", staff.email);

  // Create test account for QA / demo
  const testPassword = await bcrypt.hash("123456789", 10);
  const testUser = await prisma.profile.upsert({
    where: { email: "test@testemail.com" },
    update: { password: testPassword },
    create: {
      email: "test@testemail.com",
      password: testPassword,
      name: "Test User",
      role: "owner",
    },
  });
  console.log("Created test user:", testUser.email);

  // Create sample clients
  const robert = await prisma.client.upsert({
    where: { id: "client-robert" },
    update: {},
    create: {
      id: "client-robert",
      name: "Robert Chen",
      phone: "416-555-0101",
      email: "robert@example.com",
      address: "123 Queen St W",
      city: "Toronto",
      postal: "M5H 2M9",
      preferences: JSON.stringify(["Prefers roses", "No lilies"]),
    },
  });

  const jake = await prisma.client.upsert({
    where: { id: "client-jake" },
    update: {},
    create: {
      id: "client-jake",
      name: "Jake Gardener",
      phone: "416-555-0102",
      email: "jake@example.com",
      address: "456 King St E",
      city: "Toronto",
      postal: "M5A 1L6",
      preferences: JSON.stringify(["Loves sunflowers"]),
    },
  });

  const gary = await prisma.client.upsert({
    where: { id: "client-gary" },
    update: {},
    create: {
      id: "client-gary",
      name: "Gary Carbell",
      phone: "416-555-0103",
      address: "789 Bloor St W",
      city: "Toronto",
      postal: "M6G 1L5",
      preferences: JSON.stringify([]),
    },
  });

  const dylan = await prisma.client.upsert({
    where: { id: "client-dylan" },
    update: {},
    create: {
      id: "client-dylan",
      name: "Dylan Cooper",
      phone: "416-555-0104",
      address: "321 Dundas St",
      city: "Toronto",
      postal: "M5B 1T3",
      preferences: JSON.stringify(["Prefers pink"]),
    },
  });

  const david = await prisma.client.upsert({
    where: { id: "client-david" },
    update: {},
    create: {
      id: "client-david",
      name: "David Baron",
      phone: "416-555-0105",
      email: "david@example.com",
      address: "654 Yonge St",
      city: "Toronto",
      postal: "M4Y 1Z8",
      preferences: JSON.stringify(["No carnations", "Prefers white arrangements"]),
    },
  });

  console.log("Created 5 clients");

  // Create sample orders
  const today = new Date();
  const orders = [
    {
      orderNumber: `BLM-${today.toISOString().slice(0, 10).replace(/-/g, "")}-001`,
      clientId: robert.id,
      recipientName: "Caroline Chen",
      recipientAddress: "123 Queen St W, Toronto",
      occasion: "Anniversary",
      arrangementType: "Vase Arrangement",
      flowers: JSON.stringify([{ variety: "Red Roses", color: "Red", qty: 24 }]),
      price: 150.0,
      paymentStatus: "paid",
      deliveryDate: today,
      deliveryTimeWindow: "AM",
      deliveryMethod: "delivery",
      deliveryAddress: "123 Queen St W, Toronto",
      status: "confirmed",
    },
    {
      orderNumber: `BLM-${today.toISOString().slice(0, 10).replace(/-/g, "")}-002`,
      clientId: jake.id,
      recipientName: "Jake Gardener",
      occasion: "Just Because",
      arrangementType: "Bouquet",
      flowers: JSON.stringify([{ variety: "Sunflowers", color: "Yellow", qty: 12 }]),
      price: 85.0,
      paymentStatus: "paid",
      deliveryDate: today,
      deliveryTimeWindow: "10am-1pm",
      deliveryMethod: "pickup",
      status: "confirmed",
    },
    {
      orderNumber: `BLM-${today.toISOString().slice(0, 10).replace(/-/g, "")}-003`,
      clientId: gary.id,
      recipientName: "Mrs. Carbell",
      recipientAddress: "789 Bloor St W, Toronto",
      occasion: "Birthday",
      arrangementType: "Centerpiece",
      flowers: JSON.stringify([
        { variety: "Peonies", color: "Pink", qty: 8 },
        { variety: "Eucalyptus", color: "Green", qty: 5 },
      ]),
      price: 220.0,
      paymentStatus: "unpaid",
      deliveryDate: today,
      deliveryTimeWindow: "1pm-5pm",
      deliveryMethod: "delivery",
      deliveryAddress: "789 Bloor St W, Toronto",
      status: "confirmed",
    },
    {
      orderNumber: `BLM-${today.toISOString().slice(0, 10).replace(/-/g, "")}-004`,
      clientId: dylan.id,
      recipientName: "Sarah Cooper",
      recipientAddress: "321 Dundas St, Toronto",
      occasion: "Sympathy",
      arrangementType: "Basket",
      flowers: JSON.stringify([
        { variety: "White Lilies", color: "White", qty: 10 },
        { variety: "White Roses", color: "White", qty: 6 },
      ]),
      price: 175.0,
      paymentStatus: "partial",
      deliveryDate: today,
      deliveryTimeWindow: "AM",
      deliveryMethod: "delivery",
      deliveryAddress: "321 Dundas St, Toronto",
      status: "in_progress",
    },
    {
      orderNumber: `BLM-${today.toISOString().slice(0, 10).replace(/-/g, "")}-005`,
      clientId: david.id,
      recipientName: "David Baron",
      occasion: "Corporate",
      arrangementType: "Vase Arrangement",
      flowers: JSON.stringify([
        { variety: "Orchids", color: "White", qty: 3 },
        { variety: "Calla Lilies", color: "White", qty: 5 },
      ]),
      price: 350.0,
      paymentStatus: "paid",
      deliveryDate: today,
      deliveryTimeWindow: "10am-1pm",
      deliveryMethod: "delivery",
      deliveryAddress: "654 Yonge St, Toronto",
      status: "confirmed",
    },
  ];

  for (const order of orders) {
    await prisma.order.upsert({
      where: { orderNumber: order.orderNumber },
      update: {},
      create: order,
    });
  }
  console.log("Created 5 orders");

  // Create a subscription
  await prisma.subscription.upsert({
    where: { id: "sub-robert-weekly" },
    update: {},
    create: {
      id: "sub-robert-weekly",
      clientId: robert.id,
      frequency: "weekly",
      startDate: today,
      arrangementType: "Bouquet",
      flowers: JSON.stringify([{ variety: "Mixed Seasonal", color: "Mixed", qty: 1 }]),
      deliveryMethod: "delivery",
      deliveryAddress: "123 Queen St W, Toronto",
      price: 65.0,
      status: "active",
      nextOrderDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
    },
  });
  console.log("Created 1 subscription");

  // Create default settings
  const settings = [
    { key: "shop_name", value: "Market Four Seasons" },
    { key: "shop_address", value: "Toronto, ON" },
    { key: "shop_phone", value: "416-555-0100" },
    { key: "shop_email", value: "info@marketfourseasons.com" },
    { key: "hst_number", value: "123456789RT0001" },
    { key: "large_order_threshold", value: "200" },
    { key: "label_layout", value: "2-up" },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }
  console.log("Created default settings");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
