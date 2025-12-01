export interface Startup {
  id: string;
  name: string;
  tagline: string;
  sector: string;
  stage: string;
  location: string;
  score: number;
  scoreBreakdown: {
    team: number;
    traction: number;
    market: number;
    fit: number;
  };
  founders: {
    name: string;
    role: string;
    linkedin: string;
    background: string;
  }[];
  metrics: {
    revenue: string;
    growth: string;
    users: string;
    funding: string;
  };
  signals: string[];
  sources: string[];
  lastUpdated: string;
  description: string;
  investorFit: string;
  dealStatus: 'new' | 'contacted' | 'meeting' | 'diligence' | 'passed' | 'invested';
  mutualConnections: number;
  unicornProbability?: number;
}

export const mockStartups: Startup[] = [
  {
    id: '1',
    name: 'Quantum Health AI',
    tagline: 'AI-powered drug discovery platform reducing R&D time by 10x',
    sector: 'HealthTech',
    stage: 'Series A',
    location: 'San Francisco, CA',
    score: 94,
    scoreBreakdown: {
      team: 96,
      traction: 89,
      market: 95,
      fit: 96
    },
    founders: [
      {
        name: 'Dr. Sarah Chen',
        role: 'CEO & Co-founder',
        linkedin: 'linkedin.com/in/sarahchen',
        background: 'PhD Stanford, Ex-Google Health, 2x Bio exits'
      },
      {
        name: 'Michael Roberts',
        role: 'CTO & Co-founder',
        linkedin: 'linkedin.com/in/mroberts',
        background: 'MIT CS, Ex-DeepMind, Published researcher'
      }
    ],
    metrics: {
      revenue: '$2.4M ARR',
      growth: '+340% YoY',
      users: '12 pharma clients',
      funding: '$8M raised'
    },
    signals: [
      'Featured in Nature Journal',
      'Partnership with Pfizer announced',
      'Team grew 200% in 6 months',
      'Y Combinator S23'
    ],
    sources: ['Crunchbase', 'LinkedIn', 'AngelList', 'YC'],
    lastUpdated: '2 hours ago',
    description: 'Quantum Health AI uses quantum computing and machine learning to accelerate drug discovery. Their platform has already identified 3 promising compounds now in clinical trials. The team combines deep expertise in computational biology, quantum computing, and pharmaceutical development.',
    investorFit: 'Perfect match: HealthTech thesis, Series A stage, SF-based, strong technical team with domain expertise',
    dealStatus: 'new',
    mutualConnections: 8,
    unicornProbability: 87
  },
  {
    id: '2',
    name: 'SupplyChain.ai',
    tagline: 'Real-time supply chain optimization using predictive AI',
    sector: 'Enterprise SaaS',
    stage: 'Seed',
    location: 'Austin, TX',
    score: 91,
    scoreBreakdown: {
      team: 88,
      traction: 92,
      market: 90,
      fit: 94
    },
    founders: [
      {
        name: 'James Park',
        role: 'CEO',
        linkedin: 'linkedin.com/in/jamespark',
        background: 'Ex-Amazon logistics VP, MBA Wharton'
      },
      {
        name: 'Lisa Zhang',
        role: 'CPO',
        linkedin: 'linkedin.com/in/lisazhang',
        background: 'Ex-Shopify, Serial entrepreneur'
      }
    ],
    metrics: {
      revenue: '$1.8M ARR',
      growth: '+280% YoY',
      users: '45 enterprise clients',
      funding: '$4.5M raised'
    },
    signals: [
      'Closed 3 Fortune 500 clients last quarter',
      'NRR: 145%',
      'Featured in TechCrunch',
      'Hiring aggressively'
    ],
    sources: ['Crunchbase', 'ProductHunt', 'LinkedIn'],
    lastUpdated: '5 hours ago',
    description: 'SupplyChain.ai helps enterprises optimize their supply chain operations with predictive AI that forecasts disruptions before they happen. Strong product-market fit with impressive enterprise traction.',
    investorFit: 'Strong fit: Enterprise SaaS focus, proven GTM motion, large TAM ($50B+)',
    dealStatus: 'contacted',
    mutualConnections: 5,
    unicornProbability: 72
  },
  {
    id: '3',
    name: 'ClimateCarbon',
    tagline: 'Carbon credit marketplace powered by satellite verification',
    sector: 'Climate Tech',
    stage: 'Series A',
    location: 'London, UK',
    score: 89,
    scoreBreakdown: {
      team: 85,
      traction: 88,
      market: 94,
      fit: 89
    },
    founders: [
      {
        name: 'Emma Williams',
        role: 'CEO',
        linkedin: 'linkedin.com/in/emmawilliams',
        background: 'Ex-Tesla, Imperial College PhD'
      }
    ],
    metrics: {
      revenue: '$5.2M ARR',
      growth: '+180% YoY',
      users: '$120M in carbon credits traded',
      funding: '$12M raised'
    },
    signals: [
      'Regulatory approval in EU',
      'Partnership with Microsoft',
      'Revenue milestone hit',
      'Expanding to US market'
    ],
    sources: ['Crunchbase', 'LinkedIn', 'Twitter'],
    lastUpdated: '1 day ago',
    description: 'ClimateCarbon is building the most trusted carbon credit marketplace using satellite imagery and AI to verify carbon sequestration. Growing regulatory tailwinds and enterprise demand.',
    investorFit: 'Good fit: Climate tech thesis aligned, though outside primary geography',
    dealStatus: 'meeting',
    mutualConnections: 12,
    unicornProbability: 65
  },
  {
    id: '4',
    name: 'DevSecure',
    tagline: 'Automated security testing for DevOps pipelines',
    sector: 'Cybersecurity',
    stage: 'Seed',
    location: 'Palo Alto, CA',
    score: 88,
    scoreBreakdown: {
      team: 92,
      traction: 82,
      market: 88,
      fit: 90
    },
    founders: [
      {
        name: 'Alex Kumar',
        role: 'CEO',
        linkedin: 'linkedin.com/in/alexkumar',
        background: 'Ex-Datadog, Security expert'
      },
      {
        name: 'Rachel Green',
        role: 'CTO',
        linkedin: 'linkedin.com/in/rachelgreen',
        background: 'Ex-Cisco, OSS contributor'
      }
    ],
    metrics: {
      revenue: '$800K ARR',
      growth: '+420% YoY',
      users: '180 dev teams',
      funding: '$3M raised'
    },
    signals: [
      'GitHub stars: 12K+',
      'Top 10 on ProductHunt',
      'Strong community growth',
      'Usage-based model scaling'
    ],
    sources: ['GitHub', 'ProductHunt', 'Crunchbase'],
    lastUpdated: '3 hours ago',
    description: 'DevSecure automates security testing directly in CI/CD pipelines, making it easy for developers to ship secure code. Bottom-up adoption model with strong viral growth.',
    investorFit: 'Excellent fit: Cybersecurity thesis, developer tools, PLG motion',
    dealStatus: 'new',
    mutualConnections: 3,
    unicornProbability: 68
  },
  {
    id: '5',
    name: 'FinFlow',
    tagline: 'Embedded finance platform for vertical SaaS',
    sector: 'FinTech',
    stage: 'Pre-seed',
    location: 'New York, NY',
    score: 86,
    scoreBreakdown: {
      team: 90,
      traction: 78,
      market: 89,
      fit: 88
    },
    founders: [
      {
        name: 'David Lee',
        role: 'CEO',
        linkedin: 'linkedin.com/in/davidlee',
        background: 'Ex-Stripe, Ex-Square'
      }
    ],
    metrics: {
      revenue: '$400K ARR',
      growth: '+500% YoY',
      users: '23 SaaS platforms',
      funding: '$2M raised'
    },
    signals: [
      'Stripe partnership announced',
      'Strong founder reputation',
      'Early customer love',
      'Fast integration times'
    ],
    sources: ['AngelList', 'Twitter', 'LinkedIn'],
    lastUpdated: '4 hours ago',
    description: 'FinFlow enables vertical SaaS companies to embed financial services into their platforms with a single API. Huge market opportunity as SaaS platforms monetize through fintech.',
    investorFit: 'Strong fit: FinTech focus, experienced founder, early but promising traction',
    dealStatus: 'diligence',
    mutualConnections: 15,
    unicornProbability: 58
  },
  {
    id: '6',
    name: 'EduTech Pro',
    tagline: 'AI tutor for personalized learning',
    sector: 'EdTech',
    stage: 'Seed',
    location: 'Boston, MA',
    score: 78,
    scoreBreakdown: {
      team: 75,
      traction: 80,
      market: 78,
      fit: 72
    },
    founders: [
      {
        name: 'Maria Garcia',
        role: 'CEO',
        linkedin: 'linkedin.com/in/mariagarcia',
        background: 'Ex-teacher, EdTech entrepreneur'
      }
    ],
    metrics: {
      revenue: '$600K ARR',
      growth: '+150% YoY',
      users: '50K students',
      funding: '$2.5M raised'
    },
    signals: [
      'Used in 200+ schools',
      'Positive learning outcomes',
      'Expanding to corporate',
      'Platform adoption growing'
    ],
    sources: ['Crunchbase', 'ProductHunt'],
    lastUpdated: '1 day ago',
    description: 'EduTech Pro provides AI-powered personalized tutoring for K-12 students. Strong mission-driven founder with education background, though outside primary investment thesis.',
    investorFit: 'Moderate fit: Outside core thesis (EdTech not primary focus), but interesting model',
    dealStatus: 'passed',
    mutualConnections: 2
  }
];

export const dealPipeline = {
  new: mockStartups.filter(s => s.dealStatus === 'new'),
  contacted: mockStartups.filter(s => s.dealStatus === 'contacted'),
  meeting: mockStartups.filter(s => s.dealStatus === 'meeting'),
  diligence: mockStartups.filter(s => s.dealStatus === 'diligence'),
  passed: mockStartups.filter(s => s.dealStatus === 'passed'),
  invested: mockStartups.filter(s => s.dealStatus === 'invested')
};
