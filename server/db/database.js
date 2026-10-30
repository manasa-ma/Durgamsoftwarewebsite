import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure server/data directory exists
const dataDir = path.resolve(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'durgamsoft.db');
const db = new DatabaseSync(dbPath);

// Enable WAL mode for better concurrency and reliability
db.exec('PRAGMA journal_mode = WAL;');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    passwordHash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    createdAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    department TEXT NOT NULL,
    location TEXT NOT NULL,
    jobType TEXT NOT NULL,
    experience TEXT NOT NULL,
    description TEXT NOT NULL,
    responsibilities TEXT NOT NULL,
    requirements TEXT NOT NULL,
    skills TEXT NOT NULL,
    salary TEXT,
    applicationLink TEXT,
    status TEXT NOT NULL CHECK(status IN ('draft', 'published', 'closed', 'deactivated', 'active', 'deactivate')),
    createdBy TEXT DEFAULT 'CEO',
    updatedBy TEXT DEFAULT 'CEO',
    statusChangedAt TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS applications (
    id TEXT PRIMARY KEY,
    jobId TEXT,
    jobTitle TEXT NOT NULL,
    candidateName TEXT NOT NULL,
    candidateEmail TEXT NOT NULL,
    candidatePhone TEXT NOT NULL,
    experience TEXT,
    resumeName TEXT,
    resumeData TEXT,
    resumeUrl TEXT,
    coverNote TEXT,
    isViewed INTEGER DEFAULT 0,
    viewedAt TEXT,
    createdAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS blogs (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    excerpt TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Technology',
    authorName TEXT NOT NULL DEFAULT 'CEO',
    authorRole TEXT DEFAULT 'Founder & CEO, Durgam Soft',
    authorAvatar TEXT,
    image TEXT,
    readTime TEXT DEFAULT '5 min read',
    content TEXT NOT NULL,
    externalLinks TEXT,
    tags TEXT,
    status TEXT NOT NULL DEFAULT 'published' CHECK(status IN ('published', 'draft', 'archived')),
    featured INTEGER DEFAULT 0,
    createdBy TEXT DEFAULT 'CEO',
    updatedBy TEXT DEFAULT 'CEO',
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS announcements (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'General Notice',
    priority TEXT NOT NULL DEFAULT 'Normal' CHECK(priority IN ('Urgent', 'High', 'Normal', 'Info')),
    date TEXT NOT NULL,
    author TEXT NOT NULL DEFAULT 'Venu Durgam (Managing Director)',
    summary TEXT,
    content TEXT NOT NULL,
    targetDepartment TEXT DEFAULT 'All Departments',
    isPinned INTEGER DEFAULT 0,
    createdBy TEXT DEFAULT 'CEO',
    updatedBy TEXT DEFAULT 'CEO',
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS employee_attendance (
    id TEXT PRIMARY KEY,
    employeeId TEXT NOT NULL,
    employeeName TEXT NOT NULL,
    department TEXT NOT NULL,
    date TEXT NOT NULL,
    day TEXT NOT NULL,
    checkIn TEXT NOT NULL,
    checkOut TEXT DEFAULT '--:--',
    workHours TEXT DEFAULT 'In Progress',
    status TEXT NOT NULL DEFAULT 'Present' CHECK(status IN ('Present', 'Late', 'Half Day', 'Work From Home', 'Absent')),
    punchInPhoto TEXT,
    punchOutPhoto TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS employee_leaves (
    id TEXT PRIMARY KEY,
    employeeId TEXT NOT NULL,
    employeeName TEXT NOT NULL,
    department TEXT NOT NULL,
    leaveType TEXT NOT NULL,
    fromDate TEXT NOT NULL,
    toDate TEXT NOT NULL,
    daysCount INTEGER NOT NULL DEFAULT 1,
    reason TEXT NOT NULL,
    appliedOn TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK(status IN ('Pending', 'Approved', 'Rejected')),
    managerRemarks TEXT,
    reviewedBy TEXT,
    reviewedAt TEXT,
    attachmentUrl TEXT,
    attachmentName TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS employees (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT DEFAULT 'password123',
    department TEXT NOT NULL,
    designation TEXT NOT NULL,
    phone TEXT,
    joiningDate TEXT,
    employmentType TEXT DEFAULT 'Full-time / Permanent',
    reportingManager TEXT DEFAULT 'Venu Durgam (Technical Director)',
    location TEXT DEFAULT 'Cherlapalli',
    workShift TEXT DEFAULT '9:00 AM - 6:00 PM',
    currentAddress TEXT,
    emergencyContactName TEXT,
    emergencyContactPhone TEXT,
    emergencyContactRelation TEXT,
    bloodGroup TEXT,
    dateOfBirth TEXT,
    gender TEXT,
    status TEXT NOT NULL DEFAULT 'Active' CHECK(status IN ('Active', 'Inactive', 'On Leave', 'Probation')),
    salary TEXT,
    photo TEXT,
    customColumns TEXT,
    skills TEXT,
    bankDetails TEXT,
    createdBy TEXT DEFAULT 'CEO',
    updatedBy TEXT DEFAULT 'CEO',
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );
`);

// Dynamic column and constraint migrations for pre-existing tables
try {
  // 1. Check if jobs.status CHECK constraint needs expansion for 'deactivated'
  const tableSqlRow = db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='jobs'").get();
  if (tableSqlRow && tableSqlRow.sql && !tableSqlRow.sql.includes('deactivated')) {
    db.exec('PRAGMA foreign_keys = OFF;');
    db.exec(`
      CREATE TABLE jobs_migrated (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        department TEXT NOT NULL,
        location TEXT NOT NULL,
        jobType TEXT NOT NULL,
        experience TEXT NOT NULL,
        description TEXT NOT NULL,
        responsibilities TEXT NOT NULL,
        requirements TEXT NOT NULL,
        skills TEXT NOT NULL,
        salary TEXT,
        applicationLink TEXT,
        status TEXT NOT NULL CHECK(status IN ('draft', 'published', 'closed', 'deactivated', 'active', 'deactivate')),
        createdBy TEXT DEFAULT 'HR',
        updatedBy TEXT DEFAULT 'HR',
        statusChangedAt TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );
    `);
    db.exec(`
      INSERT INTO jobs_migrated (
        id, title, department, location, jobType, experience,
        description, responsibilities, requirements, skills,
        salary, applicationLink, status, createdBy, updatedBy,
        statusChangedAt, createdAt, updatedAt
      )
      SELECT
        id, title, department, location, jobType, experience,
        description, responsibilities, requirements, skills,
        salary, applicationLink, status,
        COALESCE(createdBy, 'HR'),
        COALESCE(updatedBy, 'HR'),
        COALESCE(statusChangedAt, updatedAt, createdAt),
        createdAt, updatedAt
      FROM jobs;
    `);
    db.exec('DROP TABLE jobs;');
    db.exec('ALTER TABLE jobs_migrated RENAME TO jobs;');
    db.exec('PRAGMA foreign_keys = ON;');
    console.log('[DB] Upgraded jobs table schema with deactivated status support.');
  }

  // 2. Ensure extra columns exist on jobs table
  const jobColumns = db.prepare('PRAGMA table_info(jobs)').all().map((c) => c.name);
  if (!jobColumns.includes('statusChangedAt')) {
    db.exec('ALTER TABLE jobs ADD COLUMN statusChangedAt TEXT');
    db.exec('UPDATE jobs SET statusChangedAt = updatedAt WHERE statusChangedAt IS NULL');
  }
  if (!jobColumns.includes('createdBy')) {
    db.exec("ALTER TABLE jobs ADD COLUMN createdBy TEXT DEFAULT 'HR'");
    db.exec("UPDATE jobs SET createdBy = 'HR' WHERE createdBy IS NULL");
  }
  if (!jobColumns.includes('updatedBy')) {
    db.exec("ALTER TABLE jobs ADD COLUMN updatedBy TEXT DEFAULT 'HR'");
    db.exec("UPDATE jobs SET updatedBy = 'HR' WHERE updatedBy IS NULL");
  }

  // 3. Ensure resume & view tracking columns exist on applications table
  const appColumns = db.prepare('PRAGMA table_info(applications)').all().map((c) => c.name);
  if (!appColumns.includes('resumeData')) {
    db.exec('ALTER TABLE applications ADD COLUMN resumeData TEXT');
  }
  if (!appColumns.includes('resumeUrl')) {
    db.exec('ALTER TABLE applications ADD COLUMN resumeUrl TEXT');
  }
  if (!appColumns.includes('isViewed')) {
    db.exec('ALTER TABLE applications ADD COLUMN isViewed INTEGER DEFAULT 0');
    db.exec('UPDATE applications SET isViewed = 1 WHERE isViewed IS NULL');
  }
  if (!appColumns.includes('viewedAt')) {
    db.exec('ALTER TABLE applications ADD COLUMN viewedAt TEXT');
  }

  // 4. Ensure photo verification columns exist on employee_attendance table
  const attCols = db.prepare('PRAGMA table_info(employee_attendance)').all().map((c) => c.name);
  if (!attCols.includes('punchInPhoto')) {
    db.exec('ALTER TABLE employee_attendance ADD COLUMN punchInPhoto TEXT');
  }
  if (!attCols.includes('punchOutPhoto')) {
    db.exec('ALTER TABLE employee_attendance ADD COLUMN punchOutPhoto TEXT');
  }

  // 5. Ensure attachment columns exist on employee_leaves table
  const leaveCols = db.prepare('PRAGMA table_info(employee_leaves)').all().map((c) => c.name);
  if (!leaveCols.includes('attachmentUrl')) {
    db.exec('ALTER TABLE employee_leaves ADD COLUMN attachmentUrl TEXT');
  }
  if (!leaveCols.includes('attachmentName')) {
    db.exec('ALTER TABLE employee_leaves ADD COLUMN attachmentName TEXT');
  }
} catch (migErr) {
  console.warn('[DB] Migration note:', migErr.message);
}

// Minimal valid base64 PDF representation for candidate attachment previews
const SAMPLE_RESUME_BASE64 =
  'data:application/pdf;base64,JVBERi0xLjQKJcTl8uXrp/OgCjEgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDIgMCBSCj4+CmVuZG9iagoyIDAgb2JqCjw8Ci9UeXBlIC9QYWdlcwovS2lkcyBbMyAwIFJdCi9Db3VudCAxCj4+CmVuZG9iagozIDAgb2JqCjw8Ci9UeXBlIC9QYWdlCi9QYXJlbnQgMiAwIFIKL01lZGlhQm94IFswIDAgNjEyIDc5Ml0KL0NvbnRlbnRzIDQgMCBSCj4+CmVuZG9iago0IDAgb2JqCjw8Ci9MZW5ndGggNTYKPj4Kc3RyZWFtCkJUCi9GMSAxMiBUZgoxMDAgNzAwIFRkCihEdXJnYW1Tb2Z0IENhbmRpZGF0ZSBSZXN1bWUpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDUKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDE4IDAwMDAwIG4gCjAwMDAwMDAwNjggMDAwMDAgbiAKMDAwMDAwMDEyNSAwMDAwMCBuIAowMDAwMDAwMjE5IDAwMDAwIG4gCnRyYWlsZXIKPDwKL1NpemUgNQovUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKMzI2CiUlRU9G';

/**
 * Seed initial admin user if none exists
 */
export function seedAdminUser() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@durgamsoft.com';
  const rawPassword = process.env.ADMIN_INITIAL_PASSWORD || 'Admin@Durgam2026!';

  const existing = db.prepare('SELECT id, email, name FROM users WHERE email = ?').get(adminEmail.toLowerCase().trim());
  if (!existing) {
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(rawPassword, salt);
    const insert = db.prepare(`
      INSERT INTO users (id, name, email, passwordHash, role, createdAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    insert.run(
      'admin-' + Date.now(),
      'Admin',
      adminEmail.toLowerCase().trim(),
      passwordHash,
      'admin',
      new Date().toISOString()
    );
    console.log(`[DB] Default admin user initialized (${adminEmail})`);
  }

  // Also initialize CEO user if not exists
  const ceoEmail = 'ceo@durgamsoft.com';
  const existingCeo = db.prepare('SELECT id, email FROM users WHERE email = ?').get(ceoEmail);
  if (!existingCeo) {
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync('admin123', salt);
    const insert = db.prepare(`
      INSERT INTO users (id, name, email, passwordHash, role, createdAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    insert.run(
      'DS-CEO-001',
      'Venu Durgam',
      ceoEmail,
      passwordHash,
      'admin',
      new Date().toISOString()
    );
    console.log(`[DB] Default CEO user initialized (${ceoEmail})`);
  }

  // Also initialize default HR user if not exists
  const hrEmail = 'hr@durgamsoft.com';
  const existingHr = db.prepare('SELECT id, email FROM users WHERE email = ?').get(hrEmail);
  if (!existingHr) {
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(rawPassword, salt);
    const insert = db.prepare(`
      INSERT INTO users (id, name, email, passwordHash, role, createdAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    insert.run(
      'hr-user-1',
      'HR',
      hrEmail,
      passwordHash,
      'admin',
      new Date().toISOString()
    );
    console.log(`[DB] Default HR user initialized (${hrEmail})`);
  }
}

/**
 * Seed initial jobs from existing careers data if table is empty
 */
export async function seedInitialJobs() {
  const countRow = db.prepare('SELECT COUNT(*) as count FROM jobs').get();
  if (countRow && countRow.count > 0) {
    return; // Already populated
  }

  try {
    const careersModulePath = path.resolve(__dirname, '../../src/data/careers.js');
    if (fs.existsSync(careersModulePath)) {
      const { CAREERS_PAGE_DATA } = await import(`file://${careersModulePath}`);
      if (CAREERS_PAGE_DATA && Array.isArray(CAREERS_PAGE_DATA.positions)) {
        const insertJob = db.prepare(`
          INSERT INTO jobs (
            id, title, department, location, jobType, experience,
            description, responsibilities, requirements, skills,
            salary, applicationLink, status, createdBy, updatedBy,
            statusChangedAt, createdAt, updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        for (const p of CAREERS_PAGE_DATA.positions) {
          const now = new Date().toISOString();
          const locationStr = Array.isArray(p.locations) ? p.locations.join(', ') : (p.location || 'Hyderabad');
          const respStr = JSON.stringify(p.responsibilities || []);
          const reqStr = JSON.stringify(p.requirements || []);
          const skillsStr = JSON.stringify(p.preferredSkills || []);

          insertJob.run(
            p.id,
            p.title,
            p.department || 'Engineering & Tech',
            locationStr,
            p.employmentType || 'Full Time',
            p.experience || '1+ Years',
            p.overview || '',
            respStr,
            reqStr,
            skillsStr,
            p.salary || 'Competitive',
            'careers@durgamsoft.com',
            'published',
            'CEO',
            'CEO',
            now,
            now,
            now
          );
        }
        console.log(`[DB] Seeded ${CAREERS_PAGE_DATA.positions.length} existing jobs into database.`);
      }
    }
  } catch (err) {
    console.error('[DB] Error seeding initial jobs:', err.message);
  }
}

/**
 * Seed initial blogs if blogs table is empty
 */
export function seedInitialBlogs() {
  try {
    const countRow = db.prepare('SELECT COUNT(*) as count FROM blogs').get();
    if (countRow && countRow.count > 0) {
      return; // Already populated
    }

    const defaultArticles = [
      {
        id: 'how-technology-helps-small-businesses-grow',
        slug: 'how-technology-helps-small-businesses-grow',
        title: 'How Technology Helps Small Businesses Grow and Scale Faster',
        subtitle: 'From automated billing to real-time inventory tracking, simple digital workflows enable retail and service businesses to expand without ballooning overhead.',
        excerpt: 'Explore practical ways modern software tools help local businesses eliminate manual bottlenecks, speed up customer transactions, and make smarter daily decisions.',
        category: 'Business',
        authorName: 'Durgam Venu Gopal',
        authorRole: 'Founder & CEO, Durgam Soft',
        authorAvatar: '/images/about/testimonial-avatar-1.webp',
        image: '/images/blog/blog-business-growth.webp',
        readTime: '5 min read',
        tags: ['Business Growth', 'Retail Tech', 'Automation', 'Billmaster'],
        externalLinks: [
          { title: 'Billmaster Billing Software', url: 'https://www.durgamsoft.com/products/billmaster' },
          { title: 'Book an Interactive Demo', url: 'https://www.durgamsoft.com/demo' }
        ],
        content: 'Many small business owners find that reaching their first hundred customers is exciting, but scaling past that milestone brings unforeseen friction. Hand-written bills, manual cash registers, and physical stock registers quickly turn from charming routines into costly operational bottlenecks.\n\nThe first and most impactful technology upgrade a brick-and-mortar business can make is moving to a purpose-built Point of Sale (POS) system. Modern software like Billmaster allows cashiers to scan barcodes, apply promotional discounts, and generate GST-compliant thermal bills in under 10 seconds.\n\nKnowing exactly which products are flying off the shelves and which items are gathering dust is vital for healthy cash flow. Cloud-connected inventory software alerts store managers before high-demand items go out of stock.'
      },
      {
        id: 'how-billmaster-pos-powers-faster-checkout',
        slug: 'how-billmaster-pos-powers-faster-checkout',
        title: 'How Billmaster POS Powers 10-Second Checkout for 500+ Supermarkets',
        subtitle: 'A closer look at the offline-first engineering, thermal receipt speed, and barcode ergonomics behind Durgam Soft’s flagship retail POS platform.',
        excerpt: 'Learn how smart barcode indexing, instant shortcut keys, and robust offline data persistence eliminate billing delays during peak supermarket hours.',
        category: 'Technology',
        authorName: 'Durgam Venu Gopal',
        authorRole: 'Founder & CEO, Durgam Soft',
        authorAvatar: '/images/about/testimonial-avatar-1.webp',
        image: '/images/blog/blog-pos-checkout.webp',
        readTime: '6 min read',
        tags: ['POS Systems', 'Billmaster', 'Retail Speed', 'Thermal Printing'],
        externalLinks: [
          { title: 'Billmaster Hardware & POS Tills', url: 'https://www.durgamsoft.com/products' }
        ],
        content: 'Between 6:00 PM and 9:30 PM, supermarkets and grocery stores experience their highest footfall. A single cashier slowdown creates long checkout lines that spill into store aisles, testing customer patience.\n\nTraditional cloud-only billing software frequently stutters or freezes when the internet connection dips. Billmaster was engineered from the ground up to solve this exact vulnerability.\n\nBillmaster stores all pricing catalogs, tax tables, and customer ledgers in an ultra-fast local database. If the internet cable is unplugged or Wi-Fi fluctuates, billing never pauses for even a fraction of a second.\n\nThrough direct driver-level hardware communication, Billmaster sends print commands straight to 2-inch and 3-inch thermal printers without waiting for standard operating system print dialogs.'
      }
    ];

    const insert = db.prepare(`
      INSERT INTO blogs (
        id, slug, title, subtitle, excerpt, category, authorName, authorRole,
        authorAvatar, image, readTime, content, externalLinks, tags, status,
        featured, createdBy, updatedBy, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const art of defaultArticles) {
      const now = new Date().toISOString();
      insert.run(
        art.id,
        art.slug,
        art.title,
        art.subtitle,
        art.excerpt,
        art.category,
        art.authorName,
        art.authorRole,
        art.authorAvatar,
        art.image,
        art.readTime,
        art.content,
        JSON.stringify(art.externalLinks || []),
        JSON.stringify(art.tags || []),
        'published',
        1,
        'CEO',
        'CEO',
        now,
        now
      );
    }
    console.log(`[DB] Seeded initial blogs into database.`);
  } catch (err) {
    console.error('[DB] Error seeding initial blogs:', err.message);
  }
}

/**
 * Seed initial company announcements if announcements table is empty
 */
export function seedInitialAnnouncements() {
  try {
    const countRow = db.prepare('SELECT COUNT(*) as count FROM announcements').get();
    if (countRow && countRow.count > 0) {
      return; // Already populated
    }

    const defaultAnnouncements = [
      {
        id: 'ann-1',
        title: 'Diwali Festive Bonus & Extended Holiday Schedule 2026',
        category: 'Celebration & Holidays',
        priority: 'High',
        date: '2026-10-28',
        author: 'Venu Durgam (Managing Director)',
        summary: 'Durgam Soft is pleased to announce a special festive allowance and extended holiday dates for Diwali 2026 celebrations.',
        content: `Dear Team,

In appreciation of your exceptional dedication and outstanding accomplishments throughout this year, the management is delighted to announce a special Diwali Festive Bonus credited with October salaries.

Office Closure Schedule:
- Thursday, Nov 12, 2026: Dhanteras (Half-Day from 01:30 PM)
- Friday, Nov 13, 2026: Diwali Holiday (Office Closed)
- Monday, Nov 16, 2026: Govardhan Puja & Bhai Dooj (Office Closed)

Regular office operations will resume on Tuesday, Nov 17, 2026. Emergency client support rosters will be handled by designated standby leads. Wishing you and your families a joyous and prosperous festival of lights!`,
        targetDepartment: 'All Departments',
        isPinned: 1,
      },
      {
        id: 'ann-2',
        title: 'Billmaster POS 4.0 Milestone Release — Team Appreciation Dinner',
        category: 'Product Milestone',
        priority: 'Normal',
        date: '2026-10-22',
        author: 'Venu Durgam (Managing Director)',
        summary: 'Celebrating the successful roll-out of Billmaster POS 4.0 across 500+ supermarket and retail locations.',
        content: `Team Durgam Soft,

Huge congratulations to the Engineering, QA, Sales, and Hardware Integration teams on the stellar rollout of Billmaster POS 4.0. We have achieved sub-500ms billing times and 100% offline sync stability.

To celebrate this monumental company milestone, all employees are cordially invited to an appreciation dinner this Friday evening at 07:30 PM. Details have been shared via internal calendar invites. Let us celebrate our collective success!`,
        targetDepartment: 'All Departments',
        isPinned: 0,
      },
      {
        id: 'ann-3',
        title: 'Updated Biometric & Flexible Shift Attendance Guidelines',
        category: 'HR Policy & Operations',
        priority: 'Normal',
        date: '2026-10-15',
        author: 'HR Operations',
        summary: 'Refined 15-minute grace period policy and simplified regularisation requests via the Employee Portal.',
        content: `Dear Employees,

Please note the following enhancements to our general shift attendance system effective immediately:
1. Standard Morning Shift: 09:30 AM to 06:30 PM.
2. A 15-minute grace period (up to 09:45 AM) is permitted up to 3 times per calendar month without deduction.
3. If field duty or client site visits prevent standard biometric punch-in, submit your regularisation request via this portal before 07:00 PM on the same day.

Thank you for your punctuality and professionalism!`,
        targetDepartment: 'All Departments',
        isPinned: 0,
      },
    ];

    const insert = db.prepare(`
      INSERT INTO announcements (
        id, title, category, priority, date, author, summary, content,
        targetDepartment, isPinned, createdBy, updatedBy, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const a of defaultAnnouncements) {
      const now = new Date().toISOString();
      insert.run(
        a.id,
        a.title,
        a.category,
        a.priority,
        a.date,
        a.author,
        a.summary,
        a.content,
        a.targetDepartment,
        a.isPinned,
        'CEO',
        'CEO',
        now,
        now
      );
    }
    console.log(`[DB] Seeded ${defaultAnnouncements.length} initial announcements into database.`);
  } catch (err) {
    console.error('[DB] Error seeding initial announcements:', err.message);
  }
}

/**
 * Seed initial employee attendance if employee_attendance table is empty
 */
export function seedInitialEmployeeAttendance() {
  // Clean slate - attendance records are created dynamically when employees punch in/out
}

/**
 * Seed initial employee leaves if employee_leaves table is empty
 */
export function seedInitialEmployeeLeaves() {
  // Clean slate - leave requests are created dynamically when employees apply for leave
}

/**
 * Seed initial employees into employees table if empty
 */
function seedInitialEmployees() {
  try {
    const countRow = db.prepare('SELECT COUNT(*) as count FROM employees').get();
    if (countRow && countRow.count > 0) {
      return;
    }

    const initialEmployees = [
      {
        id: 'DS-SE-2023-018',
        name: 'Rahul Sharma',
        email: 'rahul.sharma@durgamsoft.com',
        department: 'Software Engineer',
        designation: 'Senior Frontend Engineer',
        phone: '+91 98765 43210',
        joiningDate: '15 Jan 2023',
        employmentType: 'Full-time / Permanent',
        reportingManager: 'Venu Durgam (Technical Director)',
        location: 'Cherlapalli',
        workShift: '9:00 AM - 6:00 PM',
        currentAddress: 'Flat 402, Sai Residency, Madhapur, Hyderabad, Telangana 500081',
        emergencyContactName: 'Sunita Sharma',
        emergencyContactPhone: '+91 98765 11223',
        emergencyContactRelation: 'Spouse',
        bloodGroup: 'B+',
        dateOfBirth: '14 Aug 1996',
        gender: 'Male',
        status: 'Active',
        salary: '₹ 12,50,000 / annum',
        skills: JSON.stringify(['React.js', 'TypeScript', 'Tailwind CSS', 'Vite', 'REST APIs', 'System Architecture']),
        customColumns: JSON.stringify([
          { id: 'col-1', label: 'Aadhaar / National ID', value: '•••• •••• 8912' },
          { id: 'col-2', label: 'PAN Card', value: 'ABCPS••••K' },
          { id: 'col-3', label: 'LinkedIn Profile', value: 'linkedin.com/in/rahulsharma-fe' },
        ]),
        bankDetails: JSON.stringify({
          bankName: 'HDFC Bank Ltd.',
          accountNumber: '•••• •••• •••• 4892',
          ifscCode: 'HDFC0001842',
          panNumber: 'ABCPS••••K',
          uanNumber: '1012••••9941',
        }),
      },
      {
        id: 'DS-HR-2022-007',
        name: 'Priya Patel',
        email: 'priya.patel@durgamsoft.com',
        department: 'HR',
        designation: 'Human Resources Lead',
        phone: '+91 98123 45678',
        joiningDate: '10 Aug 2022',
        employmentType: 'Full-time / Permanent',
        reportingManager: 'Venu Durgam (Managing Director)',
        location: 'Cherlapalli',
        workShift: '9:00 AM - 6:00 PM',
        currentAddress: 'Villa 18, Green Meadows, Kondapur, Hyderabad, Telangana 500084',
        emergencyContactName: 'Ramesh Patel',
        emergencyContactPhone: '+91 98123 99887',
        emergencyContactRelation: 'Father',
        bloodGroup: 'O+',
        dateOfBirth: '22 Mar 1994',
        gender: 'Female',
        status: 'Active',
        salary: '₹ 9,80,000 / annum',
        skills: JSON.stringify(['Talent Acquisition', 'HR Policies', 'Employee Relations', 'Payroll Management', 'Performance Appraisals']),
        customColumns: JSON.stringify([
          { id: 'col-1', label: 'Aadhaar / National ID', value: '•••• •••• 6721' },
          { id: 'col-2', label: 'PAN Card', value: 'BPYPP••••F' },
          { id: 'col-3', label: 'LinkedIn Profile', value: 'linkedin.com/in/priyapatel-hr' },
        ]),
        bankDetails: JSON.stringify({
          bankName: 'ICICI Bank Ltd.',
          accountNumber: '•••• •••• •••• 9104',
          ifscCode: 'ICIC0000241',
          panNumber: 'BPYPP••••F',
          uanNumber: '1008••••6721',
        }),
      },
      {
        id: 'DS-SL-2023-031',
        name: 'Amit Verma',
        email: 'amit.verma@durgamsoft.com',
        department: 'Sales',
        designation: 'Enterprise Account Manager',
        phone: '+91 97654 32109',
        joiningDate: '01 Nov 2023',
        employmentType: 'Full-time / Permanent',
        reportingManager: 'Corporate Sales Lead',
        location: 'Cherlapalli',
        workShift: '9:00 AM - 6:00 PM',
        currentAddress: 'Tower 3, Apt 1102, Gachibowli Heights, Hyderabad, Telangana 500032',
        emergencyContactName: 'Kavita Verma',
        emergencyContactPhone: '+91 97654 00112',
        emergencyContactRelation: 'Mother',
        bloodGroup: 'A+',
        dateOfBirth: '05 Nov 1995',
        gender: 'Male',
        status: 'Active',
        salary: '₹ 11,00,000 / annum + Incentives',
        skills: JSON.stringify(['B2B Sales', 'Client Engagement', 'ERP Solution Consulting', 'Negotiation', 'CRM Pipelines']),
        customColumns: JSON.stringify([
          { id: 'col-1', label: 'Aadhaar / National ID', value: '•••• •••• 3490' },
          { id: 'col-2', label: 'PAN Card', value: 'AXVPV••••R' },
          { id: 'col-3', label: 'LinkedIn Profile', value: 'linkedin.com/in/amitverma-sales' },
        ]),
        bankDetails: JSON.stringify({
          bankName: 'State Bank of India',
          accountNumber: '•••• •••• •••• 3317',
          ifscCode: 'SBIN0011562',
          panNumber: 'AXVPV••••R',
          uanNumber: '1015••••3490',
        }),
      },
      {
        id: 'DS-SL-2024-055',
        name: 'Karthik Nair',
        email: 'karthik.nair@durgamsoft.com',
        department: 'Sales',
        designation: 'Business Development Executive',
        phone: '+91 96543 21098',
        joiningDate: '12 Feb 2024',
        employmentType: 'Full-time / Permanent',
        reportingManager: 'Amit Verma (Enterprise Account Manager)',
        location: 'Cherlapalli',
        workShift: '9:00 AM - 6:00 PM',
        currentAddress: 'Plot 54, Sector 2, ECIL, Hyderabad, Telangana 500062',
        emergencyContactName: 'Suresh Nair',
        emergencyContactPhone: '+91 96543 88776',
        emergencyContactRelation: 'Brother',
        bloodGroup: 'AB+',
        dateOfBirth: '19 Jun 1998',
        gender: 'Male',
        status: 'Active',
        salary: '₹ 6,50,000 / annum',
        skills: JSON.stringify(['Lead Generation', 'Cold Calling', 'Product Demos', 'HubSpot CRM']),
        customColumns: JSON.stringify([
          { id: 'col-1', label: 'Aadhaar / National ID', value: '•••• •••• 1152' },
          { id: 'col-2', label: 'Blood Group', value: 'AB+' },
        ]),
        bankDetails: JSON.stringify({
          bankName: 'Axis Bank',
          accountNumber: '•••• •••• •••• 7712',
          ifscCode: 'UTIB0000452',
        }),
      },
      {
        id: 'DS-HW-2024-062',
        name: 'Sneha Reddy',
        email: 'sneha.reddy@durgamsoft.com',
        department: 'Hardware & POS Support',
        designation: 'POS Hardware Specialist',
        phone: '+91 95432 10987',
        joiningDate: '15 Mar 2024',
        employmentType: 'Full-time / Permanent',
        reportingManager: 'Technical Services Head',
        location: 'Cherlapalli',
        workShift: '9:00 AM - 6:00 PM',
        currentAddress: 'Flat 201, Balaji Enclave, Habsiguda, Hyderabad, Telangana 500007',
        emergencyContactName: 'Venkatesh Reddy',
        emergencyContactPhone: '+91 95432 99001',
        emergencyContactRelation: 'Father',
        bloodGroup: 'O+',
        dateOfBirth: '03 Oct 1997',
        gender: 'Female',
        status: 'Active',
        salary: '₹ 7,20,000 / annum',
        skills: JSON.stringify(['Thermal Printers', 'Barcode Scanners', 'Weighing Scale Integration', 'Billmaster Hardware Setup']),
        customColumns: JSON.stringify([
          { id: 'col-1', label: 'Field Support Certification', value: 'Level 2 Hardware Engineer' },
        ]),
        bankDetails: JSON.stringify({
          bankName: 'Kotak Mahindra Bank',
          accountNumber: '•••• •••• •••• 3341',
          ifscCode: 'KKBK0000215',
        }),
      },
    ];

    const insert = db.prepare(`
      INSERT INTO employees (
        id, name, email, department, designation, phone, joiningDate,
        employmentType, reportingManager, location, workShift, currentAddress,
        emergencyContactName, emergencyContactPhone, emergencyContactRelation,
        bloodGroup, dateOfBirth, gender, status, salary, skills,
        customColumns, bankDetails, createdBy, updatedBy, createdAt, updatedAt
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, 'CEO', 'CEO', ?, ?
      )
    `);

    for (const emp of initialEmployees) {
      const now = new Date().toISOString();
      insert.run(
        emp.id,
        emp.name,
        emp.email,
        emp.department,
        emp.designation,
        emp.phone,
        emp.joiningDate,
        emp.employmentType,
        emp.reportingManager,
        emp.location,
        emp.workShift,
        emp.currentAddress,
        emp.emergencyContactName,
        emp.emergencyContactPhone,
        emp.emergencyContactRelation,
        emp.bloodGroup,
        emp.dateOfBirth,
        emp.gender,
        emp.status,
        emp.salary,
        emp.skills,
        emp.customColumns,
        emp.bankDetails,
        now,
        now
      );
    }
    console.log(`[DB] Seeded ${initialEmployees.length} initial employee records.`);
  } catch (err) {
    console.error('[DB] Error seeding employees:', err.message);
  }
}

// Run initial seeds
seedAdminUser();
seedInitialJobs();
seedInitialBlogs();
seedInitialAnnouncements();
seedInitialEmployeeAttendance();
seedInitialEmployeeLeaves();
seedInitialEmployees();

export default db;
