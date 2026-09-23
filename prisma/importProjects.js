// prisma/importProjects.js
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { prisma } from '../src/backend/services/prisma.js';

function generateSlug(text) {
  if (!text) return `project-${Date.now()}`;
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

async function importProjects() {
  console.log('🚀 Starting Projects Data Import...');

  const overwrite = process.argv.includes('--overwrite');
  if (overwrite) {
    console.log('⚠️ Overwrite mode enabled: Existing records with matching slugs will be overwritten.');
  } else {
    console.log('ℹ️ Default mode: Preserving existing records if already in database.');
  }

  const jsonPath = path.join(__dirname, 'data', 'projects.json');
  if (!fs.existsSync(jsonPath)) {
    console.error(`❌ Data file not found at: ${jsonPath}`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(jsonPath, 'utf8');
  const projects = JSON.parse(rawData);

  if (!Array.isArray(projects)) {
    console.error('❌ Expected projects.json to contain an array of projects');
    process.exit(1);
  }

  console.log(`📂 Found ${projects.length} project records in JSON.`);

  let importedCount = 0;
  let skippedCount = 0;
  let updatedCount = 0;

  for (const item of projects) {
    const slug = item.slug ? generateSlug(item.slug) : generateSlug(item.title);
    const title = item.title || 'Untitled Project';
    const category = item.category || 'Web Development';
    const shortDesc = item.short_description || item.shortDesc || item.description || '';
    const fullDesc = item.full_description || item.fullDesc || shortDesc;
    const coverImage = item.cover_image || item.coverImage || item.image || '';
    const liveUrl = item.live_url || item.liveUrl || item.liveLink || '';
    const githubUrl = item.github_url || item.githubUrl || item.repoLink || '';
    const clientName = item.client_name || item.clientName || '';
    const completedDate = item.completed_date || item.completedDate || '';
    const featured = Boolean(item.featured);
    const displayOrder = Number(item.display_order ?? item.displayOrder ?? 0);
    const status = item.status || 'published';

    // Parse technologies array
    let techArray = [];
    if (Array.isArray(item.technologies)) {
      techArray = item.technologies;
    } else if (typeof item.technologies === 'string') {
      techArray = item.technologies.split(',').map((t) => t.trim()).filter(Boolean);
    } else if (typeof item.tech === 'string') {
      techArray = item.tech.split(',').map((t) => t.trim()).filter(Boolean);
    }

    // Parse gallery / images array
    let galleryArray = [];
    if (Array.isArray(item.gallery)) {
      galleryArray = item.gallery.map((g, idx) => ({
        imageUrl: typeof g === 'string' ? g : g.image_url || g.imageUrl,
        altText: typeof g === 'object' ? g.alt_text || g.altText || title : title,
        displayOrder: typeof g === 'object' ? Number(g.display_order || g.displayOrder || idx + 1) : idx + 1,
      }));
    } else if (Array.isArray(item.images)) {
      galleryArray = item.images.map((g, idx) => ({
        imageUrl: typeof g === 'string' ? g : g.image_url || g.imageUrl,
        altText: typeof g === 'object' ? g.alt_text || g.altText || title : title,
        displayOrder: typeof g === 'object' ? Number(g.display_order || g.displayOrder || idx + 1) : idx + 1,
      }));
    } else if (coverImage) {
      galleryArray = [{ imageUrl: coverImage, altText: title, displayOrder: 1 }];
    }

    try {
      const existing = await prisma.project.findUnique({
        where: { slug },
      });

      if (existing && !overwrite) {
        console.log(`⏩ Skipping existing project: "${title}" (slug: ${slug})`);
        skippedCount++;
        continue;
      }

      if (existing && overwrite) {
        // Delete old relations then update project
        await prisma.$transaction([
          prisma.projectImage.deleteMany({ where: { projectId: existing.id } }),
          prisma.projectTechnology.deleteMany({ where: { projectId: existing.id } }),
          prisma.project.update({
            where: { id: existing.id },
            data: {
              title,
              category,
              shortDesc,
              fullDesc,
              coverImage,
              liveUrl,
              githubUrl,
              clientName,
              completedDate,
              featured,
              displayOrder,
              status,
              images: {
                create: galleryArray,
              },
              technologies: {
                create: techArray.map((t) => ({ techName: t })),
              },
            },
          }),
        ]);
        console.log(`🔄 Updated project: "${title}" (slug: ${slug})`);
        updatedCount++;
      } else {
        // Create new project
        await prisma.project.create({
          data: {
            title,
            slug,
            category,
            shortDesc,
            fullDesc,
            coverImage,
            liveUrl,
            githubUrl,
            clientName,
            completedDate,
            featured,
            displayOrder,
            status,
            images: {
              create: galleryArray,
            },
            technologies: {
              create: techArray.map((t) => ({ techName: t })),
            },
          },
        });
        console.log(`✅ Created project: "${title}" (slug: ${slug})`);
        importedCount++;
      }
    } catch (err) {
      console.error(`❌ Error importing project "${title}":`, err.message || err);
    }
  }

  console.log('\n==========================================');
  console.log(`🎉 Import Summary:`);
  console.log(`   - Created:   ${importedCount}`);
  console.log(`   - Updated:   ${updatedCount}`);
  console.log(`   - Skipped:   ${skippedCount}`);
  console.log('==========================================\n');
}

importProjects()
  .catch((e) => {
    console.error('Fatal import error:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
