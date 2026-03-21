import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Clear existing data
  await prisma.statistic.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.blog.deleteMany();

  // Seed Blogs
  await prisma.blog.createMany({
    data: [
      {
        title: "Understanding Heart Health",
        slug: "understanding-heart-health",
        excerpt: "Learn about the importance of cardiovascular health and how to maintain a healthy heart.",
        content: `## Introduction to Heart Health

Cardiovascular health is crucial for overall well-being. Your heart works tirelessly to pump blood throughout your body, delivering oxygen and nutrients to every cell.

### Key Points About Heart Health

**Important factors that affect your heart:**

- Regular physical activity
- Balanced diet rich in nutrients
- Stress management
- Regular health check-ups
- Adequate sleep

### Common Heart Conditions

1. **Coronary Artery Disease** - The most common type of heart disease
2. **Heart Failure** - When the heart can't pump enough blood
3. **Arrhythmias** - Irregular heartbeats
4. **Heart Valve Problems** - Issues with heart valves

> "Prevention is better than cure. Taking care of your heart today ensures a healthier tomorrow."`,
        author: "Dr. Smith",
        category: "Cardiology",
        image: "https://validthemes.net/site-template/medihub/assets/img/blog/1.jpg",
        status: "published",
        archived: false,
      },
      {
        title: "Mental Health Awareness",
        slug: "mental-health-awareness",
        excerpt: "Breaking the stigma around mental health and understanding its importance in overall wellness.",
        content: `## Understanding Mental Health

Mental health is just as important as physical health. It affects how we think, feel, and act in our daily lives.

### Why Mental Health Matters

Mental health influences:

- How we handle stress
- Our relationships with others
- Decision-making abilities
- Overall quality of life`,
        author: "Dr. Johnson",
        category: "Mental Health",
        image: "https://validthemes.net/site-template/medihub/assets/img/blog/2.jpg",
        status: "published",
        archived: false,
      },
    ],
  });

  // Seed Doctors
  await prisma.doctor.createMany({
    data: [
      {
        name: "Jessica Jones",
        designation: "Cardiologist",
        email: "jessica.jones@kgh.com",
        phone: "+1234567890",
        facebook: "https://facebook.com/jessicajones",
        linkedin: "https://linkedin.com/in/jessicajones",
        image: "https://validthemes.net/site-template/medihub/assets/img/team/1.jpg",
      },
      {
        name: "Dr. Sarah Johnson",
        designation: "Neurologist",
        email: "sarah.johnson@kgh.com",
        phone: "+1234567891",
        linkedin: "https://linkedin.com/in/sarahjohnson",
        image: "https://validthemes.net/site-template/medihub/assets/img/team/2.jpg",
      },
    ],
  });

  // Seed Testimonials
  await prisma.testimonial.createMany({
    data: [
      {
        name: "John Doe",
        designation: "Patient",
        content: "Excellent service and care. The doctors are very professional and caring. I highly recommend this hospital.",
        rating: 5,
        image: "https://validthemes.net/site-template/medihub/assets/img/team/3.jpg",
      },
      {
        name: "Jane Smith",
        designation: "Patient",
        content: "Great experience. The staff was friendly and the facilities are top-notch. Thank you for taking care of me.",
        rating: 5,
        image: "https://validthemes.net/site-template/medihub/assets/img/team/4.jpg",
      },
    ],
  });

  // Seed Statistics
  await prisma.statistic.createMany({
    data: [
      {
        label: "Satisfied Patients",
        value: "230",
        icon: "fas fa-smile",
        category: "patients",
      },
      {
        label: "Regular Doctors",
        value: "89",
        icon: "fas fa-user-doctor",
        category: "doctors",
      },
      {
        label: "Departments",
        value: "50",
        icon: "fas fa-hospital",
        category: "departments",
      },
      {
        label: "Servant",
        value: "2348",
        icon: "fas fa-users",
        category: "staff",
      },
    ],
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
