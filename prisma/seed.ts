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

  // Create sample orders with line items
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");

  // Order 1: Robert - indoor delivery with 2 line items
  const order1 = await prisma.order.upsert({
    where: { orderNumber: `BLM-${dateStr}-001` },
    update: {},
    create: {
      orderNumber: `BLM-${dateStr}-001`,
      clientId: robert.id,
      recipientName: "Caroline Chen",
      recipientAddress: "123 Queen St W, Toronto",
      occasion: "Anniversary",
      locationType: "indoor",
      totalPrice: 215.0,
      paymentStatus: "paid",
      deliveryDate: today,
      deliveryTimeWindow: "AM",
      deliveryMethod: "delivery",
      deliveryAddress: "123 Queen St W, Toronto",
      status: "confirmed",
      createdBy: owner.id,
    },
  });
  await prisma.orderLineItem.createMany({
    data: [
      {
        orderId: order1.id,
        arrangementType: "Vase Arrangement",
        description: "24 red roses in crystal vase",
        flowers: JSON.stringify([{ variety: "Red Roses", color: "Red", qty: 24 }]),
        vaseOption: "our_vase",
        vaseDescription: "Large crystal cylinder",
        price: 150.0,
        sortOrder: 0,
      },
      {
        orderId: order1.id,
        arrangementType: "Bouquet",
        description: "Mixed seasonal bouquet",
        flowers: JSON.stringify([{ variety: "Mixed Seasonal", color: "Mixed", qty: 1 }]),
        wrapOption: "gift_wrap",
        cardRequired: true,
        cardMessage: "Happy Anniversary, my love!",
        price: 65.0,
        sortOrder: 1,
      },
    ],
  });

  // Order 2: Jake - indoor pickup, single item
  const order2 = await prisma.order.upsert({
    where: { orderNumber: `BLM-${dateStr}-002` },
    update: {},
    create: {
      orderNumber: `BLM-${dateStr}-002`,
      clientId: jake.id,
      recipientName: "Jake Gardener",
      occasion: "Just Because",
      locationType: "indoor",
      totalPrice: 85.0,
      paymentStatus: "paid",
      deliveryDate: today,
      deliveryTimeWindow: "10am-1pm",
      deliveryMethod: "pickup",
      status: "confirmed",
      createdBy: staff.id,
    },
  });
  await prisma.orderLineItem.create({
    data: {
      orderId: order2.id,
      arrangementType: "Bouquet",
      description: "Sunflower bouquet",
      flowers: JSON.stringify([{ variety: "Sunflowers", color: "Yellow", qty: 12 }]),
      wrapOption: "normal",
      price: 85.0,
      sortOrder: 0,
    },
  });

  // Order 3: Gary - outdoor delivery
  const order3 = await prisma.order.upsert({
    where: { orderNumber: `BLM-${dateStr}-003` },
    update: {},
    create: {
      orderNumber: `BLM-${dateStr}-003`,
      clientId: gary.id,
      recipientName: "Mrs. Carbell",
      recipientAddress: "789 Bloor St W, Toronto",
      occasion: "Birthday",
      locationType: "outdoor",
      totalPrice: 220.0,
      paymentStatus: "unpaid",
      deliveryDate: today,
      deliveryTimeWindow: "1pm-5pm",
      deliveryMethod: "delivery",
      deliveryAddress: "789 Bloor St W, Toronto",
      status: "confirmed",
      createdBy: owner.id,
    },
  });
  await prisma.orderLineItem.create({
    data: {
      orderId: order3.id,
      arrangementType: "Centerpiece",
      description: "Birthday centerpiece",
      flowers: JSON.stringify([
        { variety: "Peonies", color: "Pink", qty: 8 },
        { variety: "Eucalyptus", color: "Green", qty: 5 },
      ]),
      cardRequired: true,
      cardMessage: "Happy Birthday! With love from Gary",
      specialInstructions: "Use a low, round vessel for the table",
      price: 220.0,
      sortOrder: 0,
    },
  });

  // Order 4: Dylan - indoor delivery
  const order4 = await prisma.order.upsert({
    where: { orderNumber: `BLM-${dateStr}-004` },
    update: {},
    create: {
      orderNumber: `BLM-${dateStr}-004`,
      clientId: dylan.id,
      recipientName: "Sarah Cooper",
      recipientAddress: "321 Dundas St, Toronto",
      occasion: "Sympathy",
      locationType: "indoor",
      totalPrice: 175.0,
      paymentStatus: "partial",
      deliveryDate: today,
      deliveryTimeWindow: "AM",
      deliveryMethod: "delivery",
      deliveryAddress: "321 Dundas St, Toronto",
      status: "in_progress",
      createdBy: owner.id,
    },
  });
  await prisma.orderLineItem.create({
    data: {
      orderId: order4.id,
      arrangementType: "Basket",
      description: "Sympathy basket arrangement",
      flowers: JSON.stringify([
        { variety: "White Lilies", color: "White", qty: 10 },
        { variety: "White Roses", color: "White", qty: 6 },
      ]),
      cardRequired: true,
      cardMessage: "With deepest sympathy",
      price: 175.0,
      sortOrder: 0,
    },
  });

  // Order 5: David - outdoor delivery, 3 line items
  const order5 = await prisma.order.upsert({
    where: { orderNumber: `BLM-${dateStr}-005` },
    update: {},
    create: {
      orderNumber: `BLM-${dateStr}-005`,
      clientId: david.id,
      recipientName: "David Baron",
      occasion: "Corporate",
      locationType: "outdoor",
      totalPrice: 550.0,
      paymentStatus: "paid",
      deliveryDate: today,
      deliveryTimeWindow: "10am-1pm",
      deliveryMethod: "delivery",
      deliveryAddress: "654 Yonge St, Toronto",
      status: "confirmed",
      createdBy: owner.id,
    },
  });
  await prisma.orderLineItem.createMany({
    data: [
      {
        orderId: order5.id,
        arrangementType: "Vase Arrangement",
        description: "White orchid arrangement",
        flowers: JSON.stringify([{ variety: "Orchids", color: "White", qty: 3 }]),
        vaseOption: "our_vase",
        vaseDescription: "Tall white ceramic",
        price: 200.0,
        sortOrder: 0,
      },
      {
        orderId: order5.id,
        arrangementType: "Vase Arrangement",
        description: "Calla lily arrangement",
        flowers: JSON.stringify([{ variety: "Calla Lilies", color: "White", qty: 5 }]),
        vaseOption: "their_vase",
        price: 175.0,
        sortOrder: 1,
      },
      {
        orderId: order5.id,
        arrangementType: "Bouquet",
        description: "Seasonal greenery bouquet",
        flowers: JSON.stringify([{ variety: "Mixed Greens", color: "Green", qty: 1 }]),
        wrapOption: "wet_pack",
        cardRequired: true,
        cardMessage: "Thank you for your partnership",
        price: 175.0,
        sortOrder: 2,
      },
    ],
  });

  console.log("Created 5 orders with line items");

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
