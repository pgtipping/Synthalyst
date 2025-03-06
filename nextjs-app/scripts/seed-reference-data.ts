import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding reference data...");

  // Seed industries
  const industries = [
    {
      name: "Technology",
      description:
        "Companies focused on creating and selling technology products and services",
    },
    {
      name: "Healthcare",
      description:
        "Organizations providing medical services, pharmaceuticals, and healthcare solutions",
    },
    {
      name: "Finance",
      description:
        "Financial services, banking, insurance, and investment companies",
    },
    {
      name: "Education",
      description:
        "Educational institutions, e-learning platforms, and educational technology",
    },
    {
      name: "Manufacturing",
      description: "Companies that produce physical goods and products",
    },
    {
      name: "Retail",
      description: "Businesses selling products directly to consumers",
    },
    {
      name: "Government",
      description: "Public sector organizations and government agencies",
    },
    {
      name: "Non-profit",
      description: "Organizations focused on social impact rather than profit",
    },
  ];

  for (const industry of industries) {
    const existingIndustry = await prisma.industry.findUnique({
      where: { name: industry.name },
    });

    if (!existingIndustry) {
      await prisma.industry.create({
        data: industry,
      });
      console.log(`Created industry: ${industry.name}`);
    } else {
      console.log(`Industry already exists: ${industry.name}`);
    }
  }

  // Seed competency categories
  const categories = [
    {
      name: "Technical Skills",
      description:
        "Specific abilities related to technical knowledge and expertise",
    },
    {
      name: "Soft Skills",
      description:
        "Interpersonal abilities that enable effective interaction with others",
    },
    {
      name: "Leadership",
      description:
        "Abilities related to guiding, influencing, and managing others",
    },
    {
      name: "Core/Organizational",
      description:
        "Competencies aligned with organizational values and culture",
    },
    {
      name: "Industry-Specific",
      description:
        "Specialized knowledge and skills unique to a particular industry",
    },
    {
      name: "Role-Specific",
      description:
        "Competencies required for success in a specific role or position",
    },
  ];

  for (const category of categories) {
    const existingCategory = await prisma.competencyCategory.findUnique({
      where: { name: category.name },
    });

    if (!existingCategory) {
      await prisma.competencyCategory.create({
        data: category,
      });
      console.log(`Created category: ${category.name}`);
    } else {
      console.log(`Category already exists: ${category.name}`);
    }
  }

  // Seed job levels
  const jobLevels = [
    {
      name: "Entry Level",
      code: "L1",
      description: "Beginning level positions requiring minimal experience",
      order: 1,
    },
    {
      name: "Junior",
      code: "L2",
      description: "Early career positions with some experience",
      order: 2,
    },
    {
      name: "Mid-Level",
      code: "L3",
      description: "Positions requiring moderate experience and expertise",
      order: 3,
    },
    {
      name: "Senior",
      code: "L4",
      description:
        "Advanced positions requiring significant experience and expertise",
      order: 4,
    },
    {
      name: "Lead",
      code: "L5",
      description: "Leadership positions with responsibility for guiding teams",
      order: 5,
    },
    {
      name: "Manager",
      code: "L6",
      description:
        "Management positions with responsibility for people and resources",
      order: 6,
    },
    {
      name: "Director",
      code: "L7",
      description:
        "Senior leadership positions with strategic responsibilities",
      order: 7,
    },
    {
      name: "Executive",
      code: "L8",
      description:
        "Top-level positions with organizational leadership responsibilities",
      order: 8,
    },
  ];

  for (const level of jobLevels) {
    const existingLevel = await prisma.jobLevel.findFirst({
      where: { name: level.name },
    });

    if (!existingLevel) {
      await prisma.jobLevel.create({
        data: level,
      });
      console.log(`Created job level: ${level.name}`);
    } else {
      console.log(`Job level already exists: ${level.name}`);
    }
  }

  // Seed job families
  const jobFamilies = [
    {
      name: "Engineering",
      description:
        "Roles focused on designing, building, and maintaining technical systems",
    },
    {
      name: "Marketing",
      description:
        "Roles focused on promoting products, services, and brand awareness",
    },
    {
      name: "Sales",
      description:
        "Roles focused on selling products and services to customers",
    },
    {
      name: "Customer Service",
      description: "Roles focused on supporting and assisting customers",
    },
    {
      name: "Operations",
      description:
        "Roles focused on managing and optimizing business processes",
    },
    {
      name: "Human Resources",
      description:
        "Roles focused on managing personnel and organizational culture",
    },
    {
      name: "Finance",
      description: "Roles focused on financial management and accounting",
    },
    {
      name: "Product",
      description: "Roles focused on product development and management",
    },
    {
      name: "Design",
      description:
        "Roles focused on visual, interaction, and user experience design",
    },
    {
      name: "Data",
      description: "Roles focused on data analysis, management, and insights",
    },
  ];

  for (const family of jobFamilies) {
    const existingFamily = await prisma.jobFamily.findFirst({
      where: { name: family.name },
    });

    if (!existingFamily) {
      await prisma.jobFamily.create({
        data: family,
      });
      console.log(`Created job family: ${family.name}`);
    } else {
      console.log(`Job family already exists: ${family.name}`);
    }
  }

  console.log("Reference data seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
