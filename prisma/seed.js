// prisma/seed.js
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { prisma } from '../src/backend/services/prisma.js';

async function main() {
  console.log('🌱 Starting Prisma database seed...');

  // 1. Seed Admin
  const adminEmail = (process.env.ADMIN_EMAIL || 'Bhupendra8171121943@gmail.com').trim().toLowerCase();
  const adminPass = process.env.ADMIN_PASSWORD || 'Druhi@2011';
  const hashedPassword = await bcrypt.hash(adminPass, 10);

  const existingAdmin = await prisma.admin.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    await prisma.admin.create({
      data: {
        name: process.env.ADMIN_NAME || 'Bhupendra',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
      },
    });
    console.log(`✅ Admin created: ${adminEmail}`);
  } else {
    await prisma.admin.update({
      where: { email: adminEmail },
      data: { password: hashedPassword, name: 'Bhupendra' },
    });
    console.log(`✅ Admin updated: ${adminEmail}`);
  }

  // 2. Seed Site Settings
  const defaultSettings = [
    { key: 'site_title', value: 'GROWZYBYTES - Digital Growth & Web Agency' },
    { key: 'logo_name', value: 'GROWZYBYTES' },
    { key: 'tagline', value: 'We Build Growth Systems, Not Just Websites' },
    { key: 'email', value: 'contact@growzybytes.com' },
    { key: 'phone', value: '+91 81711 21943' },
    { key: 'address', value: 'New Delhi, India' },
    { key: 'hero_title', value: 'We Build High-Converting Web Platforms & Digital Funnels' },
    { key: 'hero_subtitle', value: 'Custom Web Apps, Technical SEO, Performance Marketing, & Growth Automation' },
    { key: 'footer_about', value: 'GROWZYBYTES is a modern digital growth agency helping brands scale with custom web development, SEO, paid ads, and automation.' },
    { key: 'social_facebook', value: 'https://facebook.com' },
    { key: 'social_instagram', value: 'https://instagram.com' },
    { key: 'social_linkedin', value: 'https://linkedin.com' },
    { key: 'social_twitter', value: 'https://twitter.com' },
  ];

  for (const item of defaultSettings) {
    await prisma.siteSetting.upsert({
      where: { key: item.key },
      update: { value: item.value },
      create: { key: item.key, value: item.value },
    });
  }
  console.log('✅ Site settings seeded');

  // 3. Seed Services
  const servicesData = [
    {
      title: 'Web Development',
      slug: 'web-development',
      category: 'Development',
      shortDesc: 'Custom MERN stack websites and landing pages engineered for blazing speed and high conversion rates.',
      fullDesc: 'We design and develop high-performance web applications using React, Node.js, and modern CSS frameworks. Our platforms are optimized for high search rankings, mobile responsiveness, and high conversion efficiency.',
      features: 'MERN Stack,Fast Loading,Responsive UI,SEO Friendly,Custom Admin Panel',
      displayOrder: 1,
      status: 'published',
      featured: true,
    },
    {
      title: 'SEO & Organic Growth',
      slug: 'seo-organic-growth',
      category: 'Marketing',
      shortDesc: 'Technical SEO, high-authority link building, and content strategies to dominate Google search results.',
      fullDesc: 'Comprehensive SEO strategy focusing on technical health, keyword mapping, on-page optimization, and high quality backlinks to deliver compounding organic revenue.',
      features: 'Technical Audit,Keyword Strategy,On-Page SEO,Authority Backlinks,GA4 Reporting',
      displayOrder: 2,
      status: 'published',
      featured: true,
    },
    {
      title: 'Performance Ads',
      slug: 'performance-ads',
      category: 'Marketing',
      shortDesc: 'Data-driven Meta & Google Ads campaigns with rigorous A/B testing to maximize your ROAS.',
      fullDesc: 'Full funnel paid advertising management across Meta, Google, and LinkedIn. We create ad creatives, set up conversion tracking, and continually optimize for lower CPA.',
      features: 'Meta & Google Ads,Creative Testing,Retargeting Funnels,Conversion Tracking,Weekly Reporting',
      displayOrder: 3,
      status: 'published',
      featured: true,
    },
    {
      title: 'Email & WhatsApp Automations',
      slug: 'email-whatsapp-automations',
      category: 'Automation',
      shortDesc: 'Advanced email sequences and WhatsApp funnels designed to recover carts and increase LTV.',
      fullDesc: 'Build automated customer journeys that convert leads into sales and retain buyers through personalized messaging.',
      features: 'Abandoned Cart Flows,Welcome Sequences,WhatsApp API Integration,Segmented Campaigns',
      displayOrder: 4,
      status: 'published',
      featured: true,
    },
  ];

  for (const s of servicesData) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    });
  }
  console.log('✅ Services seeded');

  // 4. Seed Projects
  const projectsData = [
    {
      title: 'TechNova App Build',
      slug: 'technova-app-build',
      category: 'App Dev',
      shortDesc: 'Built a scalable MERN stack application for a rising startup, improving load speeds by 60%.',
      fullDesc: 'TechNova required a complete web redesign and fast cloud backend architecture. We delivered a clean React interface with real-time analytics.',
      coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
      liveUrl: 'https://technova-example.com',
      githubUrl: 'https://github.com/example/technova',
      featured: true,
      displayOrder: 1,
      status: 'published',
      images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80'],
      technologies: ['React', 'Node.js', 'Express', 'Tailwind', 'MySQL'],
    },
    {
      title: 'Jagat-Education Portal',
      slug: 'jagat-education-portal',
      category: 'MERN Stack',
      shortDesc: 'Dynamic educational website featuring responsive hero section, course listings, and interactive UI components.',
      fullDesc: 'A comprehensive education management platform built for students and tutors to access interactive courses.',
      coverImage: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1200&auto=format&fit=crop',
      liveUrl: 'https://jagatverma142.github.io/Jagateducation/',
      githubUrl: 'https://github.com/jagatverma142/Jagateducation',
      featured: true,
      displayOrder: 2,
      status: 'published',
      images: ['https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1200&auto=format&fit=crop'],
      technologies: ['React', 'Vite', 'Tailwind', 'Express', 'MySQL'],
    },
    {
      title: 'Jagat-Med Health Portal',
      slug: 'jagat-med-health-portal',
      category: 'Healthcare',
      shortDesc: 'Responsive medical website with dynamic routing and service listings deployed on GitHub Pages.',
      fullDesc: 'Health portal allowing patients to browse services, search medical departments, and book appointments.',
      coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop',
      liveUrl: 'https://jagatverma142.github.io/jagat_med_web/',
      githubUrl: 'https://github.com/jagatverma142/jagat_med_web',
      featured: true,
      displayOrder: 3,
      status: 'published',
      images: ['https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop'],
      technologies: ['React', 'Vite', 'Tailwind', 'MySQL'],
    },
    {
      title: 'Awak Digital Agency',
      slug: 'awak-digital-agency',
      category: 'Marketing',
      shortDesc: 'Modern digital agency portfolio featuring services from UI/UX to SEO with performance-first interface.',
      fullDesc: 'Performance portfolio showcasing growth marketing, branding, and conversion rate optimization campaigns.',
      coverImage: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1200&auto=format&fit=crop',
      liveUrl: 'https://jagatverma142.github.io/Digital_Agency/',
      githubUrl: 'https://github.com/jagatverma142/Digital_Agency',
      featured: false,
      displayOrder: 4,
      status: 'published',
      images: ['https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1200&auto=format&fit=crop'],
      technologies: ['React', 'Framer Motion', 'Tailwind', 'MySQL'],
    },
  ];

  for (const p of projectsData) {
    const { images, technologies, ...projectFields } = p;
    const project = await prisma.project.upsert({
      where: { slug: p.slug },
      update: projectFields,
      create: projectFields,
    });

    // Clean old images & tech relations then re-add
    await prisma.projectImage.deleteMany({ where: { projectId: project.id } });
    await prisma.projectTechnology.deleteMany({ where: { projectId: project.id } });

    if (images && images.length) {
      await prisma.projectImage.createMany({
        data: images.map((img) => ({ projectId: project.id, imageUrl: img })),
      });
    }

    if (technologies && technologies.length) {
      await prisma.projectTechnology.createMany({
        data: technologies.map((t) => ({ projectId: project.id, techName: t })),
      });
    }
  }
  console.log('✅ Projects seeded');

  // 5. Seed Blogs
  const blogsData = [
    {
      title: 'How to Build a High-Converting Business Website in 2026',
      slug: 'how-to-build-a-high-converting-business-website-in-2026',
      category: 'Web Development',
      content: 'A strong business website is no longer just about design. It needs clear messaging, fast loading speed, mobile responsiveness, SEO-friendly structure, trust elements, strategic CTAs and lead capture systems. Businesses that align design with conversion usually get better quality inquiries and stronger brand trust.\n\nIn 2026, user patience is shorter than ever. Your site must load in under 2 seconds and present value immediately.',
      featuredImage: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1200&q=80',
      author: 'GROWZYBYTES Team',
      featured: true,
      displayOrder: 1,
      status: 'published',
      tags: ['React', 'UI/UX', 'Conversion', 'Business Website'],
    },
    {
      title: 'SEO Basics Every Small Business Should Understand',
      slug: 'seo-basics-every-small-business-should-understand',
      category: 'SEO',
      content: 'SEO helps businesses attract high-intent visitors without depending only on paid ads. The basics include keyword targeting, technical site health, on-page optimization, content clarity, internal linking and user-focused structure. When done correctly, SEO compounds over time and improves long-term visibility.\n\nFocus on search intent over simple volume to generate qualified leads.',
      featuredImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
      author: 'GROWZYBYTES Team',
      featured: true,
      displayOrder: 2,
      status: 'published',
      tags: ['SEO', 'Organic Growth', 'Keywords', 'Content'],
    },
    {
      title: 'Meta Ads vs Google Ads: Which One Should You Start With?',
      slug: 'meta-ads-vs-google-ads-which-one-should-you-start-with',
      category: 'Performance Marketing',
      content: 'Both ad platforms can work, but the better choice depends on buyer intent, product type, sales cycle and creative strength. Google Ads usually captures demand while Meta Ads can help create demand. Businesses should first decide their goal, funnel stage and budget before choosing a platform.',
      featuredImage: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=1200&q=80',
      author: 'GROWZYBYTES Team',
      featured: false,
      displayOrder: 3,
      status: 'published',
      tags: ['Meta Ads', 'Google Ads', 'PPC', 'Marketing'],
    },
  ];

  for (const b of blogsData) {
    const { tags, ...blogFields } = b;
    const blog = await prisma.blog.upsert({
      where: { slug: b.slug },
      update: blogFields,
      create: blogFields,
    });

    await prisma.blogTag.deleteMany({ where: { blogId: blog.id } });
    if (tags && tags.length) {
      await prisma.blogTag.createMany({
        data: tags.map((t) => ({ blogId: blog.id, tagName: t })),
      });
    }
  }
  console.log('✅ Blogs seeded');

  // 6. Seed Testimonials
  const testimonialsData = [
    {
      name: 'Ankit Sharma',
      role: 'CEO',
      company: 'D2C Apparel',
      quote: 'GROWZYBYTES redesigned our e-commerce platform and optimized our ad campaigns. Our monthly revenue grew by 4x in less than 5 months.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
      rating: 5,
      displayOrder: 1,
    },
    {
      name: 'Priya Patel',
      role: 'Founder',
      company: 'EdTech Academy',
      quote: 'The team built a blazing fast web app with automated enrollment funnels. The quality of execution and ongoing support is unmatched.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
      rating: 5,
      displayOrder: 2,
    },
    {
      name: 'Rahul Verma',
      role: 'Director',
      company: 'Global Real Estates',
      quote: 'Ranked on page 1 for 15+ real estate keywords within 4 months. Their technical SEO and content approach generates solid leads daily.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
      rating: 5,
      displayOrder: 3,
    },
  ];

  for (const t of testimonialsData) {
    const existing = await prisma.testimonial.findFirst({ where: { name: t.name } });
    if (!existing) {
      await prisma.testimonial.create({ data: t });
    }
  }
  console.log('✅ Testimonials seeded');

  // 7. Seed Team Members
  const teamData = [
    {
      name: 'Bhupendra Verma',
      role: 'Founder & Growth Strategist',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80',
      bio: 'Leads strategy, growth planning and client success across development and marketing.',
      displayOrder: 1,
    },
    {
      name: 'Druhi Verma',
      role: 'UI/UX & Brand Design',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&q=80',
      bio: 'Designs modern interfaces, landing pages and visual systems that improve trust and conversion.',
      displayOrder: 2,
    },
    {
      name: 'Shiva',
      role: 'Web & App Development',
      image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&q=80',
      bio: 'Builds fast, scalable products using modern frontend and backend technologies.',
      displayOrder: 3,
    },
    {
      name: 'Anisha',
      role: 'Ads & Analytics Lead',
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&q=80',
      bio: 'Handles paid media, conversion tracking, reporting and campaign optimization.',
      displayOrder: 4,
    },
  ];

  for (const tm of teamData) {
    const existing = await prisma.teamMember.findFirst({ where: { name: tm.name } });
    if (!existing) {
      await prisma.teamMember.create({ data: tm });
    }
  }
  console.log('✅ Team members seeded');

  // 8. Seed FAQs
  const faqsData = [
    {
      question: 'How soon can we start seeing results?',
      answer: 'For performance marketing (Ads), you can see initial traction within 7-14 days. For SEO and organic growth, it typically takes 3-6 months to build sustainable momentum.',
      category: 'General',
      displayOrder: 1,
    },
    {
      question: 'Do you work with startups or established brands?',
      answer: 'Both! Our Starter and Growth plans are perfect for funded startups looking for product-market fit, while our Scale plan acts as an outsourced CMO for 7-8 figure brands.',
      category: 'General',
      displayOrder: 2,
    },
    {
      question: 'Do you offer custom web development?',
      answer: 'Yes. We build high-speed, scalable applications using React, Node.js, and custom database backends tailored to your business goals.',
      category: 'Development',
      displayOrder: 3,
    },
    {
      question: 'Will I have a dedicated account manager?',
      answer: "Absolutely. You won't be passed around. You'll get a dedicated lead strategist and a direct channel with our core team.",
      category: 'Support',
      displayOrder: 4,
    },
  ];

  for (const f of faqsData) {
    const existing = await prisma.faq.findFirst({ where: { question: f.question } });
    if (!existing) {
      await prisma.faq.create({ data: f });
    }
  }
  console.log('✅ FAQs seeded');

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
