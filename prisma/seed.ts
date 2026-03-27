import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Clear existing data
  await prisma.statistic.deleteMany();
  await prisma.diagnosticService.deleteMany();
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

  // Seed Diagnostic Services
  await prisma.diagnosticService.createMany({
    data: [
      {
        name: "Laboratory",
        title: "Laboratory Services",
        description:
          "Our laboratory provides accurate and timely diagnostic testing with modern analyzers, strict quality control, and experienced technicians to support reliable clinical decisions.",
        details:
          "From routine blood work to advanced pathology investigations, our team ensures dependable reports and smooth coordination with doctors for faster treatment planning.",
        image: "https://validthemes.net/site-template/medihub/assets/img/departments/1.jpg",
        sortOrder: 1,
        isActive: true,
      },
      {
        name: "CT Scan",
        title: "CT Scan Imaging",
        description:
          "CT scanning delivers fast, high-resolution cross-sectional imaging for emergency and routine diagnostics.",
        details:
          "Our imaging staff focuses on patient safety and comfort while delivering clear scans that support faster diagnosis.",
        image: "https://validthemes.net/site-template/medihub/assets/img/departments/2.jpg",
        sortOrder: 2,
        isActive: true,
      },
      {
        name: "X-Ray",
        title: "Digital X-Ray",
        description:
          "Digital X-Ray services provide quick and low-dose imaging for bones, chest, and joints.",
        details:
          "With rapid image processing and expert interpretation, we help clinicians make confident decisions.",
        image: "https://validthemes.net/site-template/medihub/assets/img/departments/3.jpg",
        sortOrder: 3,
        isActive: true,
      },
      {
        name: "Ultrasound",
        title: "Ultrasound Services",
        description:
          "Ultrasound offers safe, radiation-free imaging for abdominal organs and soft tissue evaluation.",
        details:
          "Real-time imaging performed by trained sonologists ensures dependable assessment for early diagnosis.",
        image: "https://validthemes.net/site-template/medihub/assets/img/departments/4.jpg",
        sortOrder: 4,
        isActive: true,
      },
      {
        name: "MRI",
        title: "MRI Diagnostics",
        description:
          "MRI provides detailed imaging of the brain, spine, joints, and soft tissues for complex cases.",
        details:
          "Our MRI workflow is designed for image clarity and patient care with highly detailed scans.",
        image: "https://validthemes.net/site-template/medihub/assets/img/departments/5.jpg",
        sortOrder: 5,
        isActive: true,
      },
      {
        name: "3D Vasculography",
        title: "3D Vasculography",
        description:
          "3D vasculography enables advanced visualization of blood vessels to evaluate vascular abnormalities.",
        details:
          "This specialized imaging supports targeted and timely interventions by specialist teams.",
        image: "https://validthemes.net/site-template/medihub/assets/img/departments/6.jpg",
        sortOrder: 6,
        isActive: true,
      },
      {
        name: "TMT",
        title: "Treadmill Test (TMT)",
        description:
          "TMT assesses heart function under controlled exercise to detect cardiovascular risk early.",
        details:
          "Conducted under expert supervision, the test supports personalized treatment recommendations.",
        image: "https://validthemes.net/site-template/medihub/assets/img/departments/7.jpg",
        sortOrder: 7,
        isActive: true,
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
