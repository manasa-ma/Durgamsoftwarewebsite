/**
 * Mock data for Durgam Soft Employee Portal
 * Department types: 'Software Engineer' | 'HR' | 'Sales'
 */

export const DEPARTMENTS = [
  'Software Engineer',
  'HR',
  'Sales',
];

export const DEMO_EMPLOYEES = {};

export const INITIAL_ATTENDANCE_HISTORY = [];

export const INITIAL_LEAVE_BALANCES = {
  paid: {
    available: 10,
    accrued: 10,
    used: 0,
    total: 12,
    rate: '1 day per month',
    label: 'Paid Leave',
  },
};

export const INITIAL_LEAVE_REQUESTS = [];

export const INITIAL_ANNOUNCEMENTS = [
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
  },
  {
    id: 'ann-2',
    title: 'Enhanced Group Medical Insurance Policy & Dependents Coverage',
    category: 'HR Policy',
    priority: 'Urgent',
    date: '2026-10-22',
    author: 'Human Resources Department',
    summary: 'Annual renewal and sum insured upgrade to ₹7,50,000 per employee family floater. Submit dependent details by Nov 05.',
    content: `All employees are requested to review the upgraded corporate medical insurance coverage for 2026-2027:
- Family Floater coverage increased from ₹5 Lakhs to ₹7.5 Lakhs.
- Includes cashless hospitalization at over 8,500 network hospitals across India.
- OPD coverage up to ₹15,000 annually for preventive dental and vision checks.
- Please verify your dependent nominations via the HR portal before November 5, 2026.`,
  },
  {
    id: 'ann-3',
    title: 'Q3 Enterprise Product Milestone: Billmaster 4.0 Deployment',
    category: 'Company Update',
    priority: 'Normal',
    date: '2026-10-15',
    author: 'Engineering Leadership',
    summary: 'Billmaster POS 4.0 has officially rolled out to 120+ retail clients with zero downtime. Hearty congratulations to the engineering squad!',
    content: `We are thrilled to share that our flagship product Billmaster 4.0 has successfully concluded its phase-1 enterprise rollout with rave reviews from retail clients across Telangana and Andhra Pradesh. 

Key metrics achieved:
- 35% faster barcode checkout processing.
- Integrated GST e-invoicing real-time synchronization.
- 99.98% cloud uptime SLA.

Special congratulations to our Frontend, Backend, QA, and Support engineering teams for this stellar milestone!`,
  },
  {
    id: 'ann-4',
    title: 'Information Security & Clean Desk Protocol Refresh',
    category: 'IT & Security',
    priority: 'Normal',
    date: '2026-10-08',
    author: 'Information Security Office',
    summary: 'Quarterly compliance reminder: lock workstations when away, never share MFA codes, and securely shred printed customer reports.',
    content: `As part of ISO 27001 compliance, all employees across Software Engineering, HR, and Sales must adhere to our standard security directives:
1. Always lock screens (Win+L / Cmd+Ctrl+Q) when leaving desks.
2. Two-factor authentication (2FA) is mandatory across all internal tools.
3. Customer financial data and client contracts must never be stored on local drives.
4. Report any phishing attempts or suspicious email links immediately to security@durgamsoft.com.`,
  },
  {
    id: 'ann-5',
    title: 'Durgam Soft Annual Hackathon & Innovation Showcase 2026',
    category: 'Team Event',
    priority: 'Exciting',
    date: '2026-09-28',
    author: 'Culture & Innovation Committee',
    summary: '48-hour internal hackathon scheduled for December 4-5 with attractive cash prizes, prototypes showcase, and team banquet.',
    content: `Gear up for our annual 48-Hour Innovation Hackathon! Cross-functional squads across Engineering, Sales, and Product are encouraged to team up and build breakthrough AI utilities, workflow automations, or customer delight tools. Cash prizes worth ₹1,50,000 for top 3 winning projects! Registration opens next Monday.`,
  },
];
