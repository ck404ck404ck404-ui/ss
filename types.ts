
export interface EmailHistory {
  id: string;
  subject: string;
  sentAt: string;
  status: 'sent' | 'opened' | 'clicked' | 'failed';
  senderName: string;
}

export interface Contact {
  id: string;
  email: string;
  name: string;
  group: string;
  status: 'active' | 'unsubscribed' | 'bounced';
  customFields: Record<string, string>;
  history?: EmailHistory[];
}

export interface SendingStats {
  daily: { sent: number; failed: number };
  monthly: { sent: number; failed: number };
  total: { sent: number; failed: number };
}

export interface SMTPServer {
  id: string;
  name: string;
  host: string;
  port: number;
  user: string;
  pass: string;
  status: 'online' | 'offline' | 'cooldown';
  priority: number;
  limit: number;
  throttleLimit: number;
  isWarmupEnabled: boolean;
  healthScore: number;
  deliveryRate: number;
  bounceRate: number;
  lastChecked: string;
  stats: SendingStats;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html: string;
  usageCount: number;
  lastUsed?: string;
}

// Rename object to VIEW_TYPES to avoid collision with the type ViewType in Babel
export const VIEW_TYPES = {
  DASHBOARD: 'DASHBOARD',
  CAMPAIGNS: 'CAMPAIGNS',
  CONTACTS: 'CONTACTS',
  SENDERS: 'SENDERS',
  TEMPLATES: 'TEMPLATES',
  ANALYTICS: 'ANALYTICS',
  AI_TOOLS: 'AI_TOOLS',
  LIVE_MONITOR: 'LIVE_MONITOR',
  BUSINESS: 'BUSINESS',
  ACCOUNT: 'ACCOUNT'
} as const;

export type ViewType = typeof VIEW_TYPES[keyof typeof VIEW_TYPES];

export interface FollowUp {
  id: string;
  delayDays: number;
  subject: string;
  body: string;
  condition: 'if_not_opened' | 'if_not_clicked' | 'always';
}

export interface Campaign {
  id: string;
  name: string;
  subject: string;
  altSubjects?: string[];
  body: string;
  status: 'draft' | 'scheduled' | 'sending' | 'paused' | 'completed';
  scheduledAt?: string;
  timezone?: string;
  sendingSpeed: number;
  useRandomDelay: boolean;
  smtpPoolIds: string[];
  contacts: string[];
  followUps?: FollowUp[];
  stats: {
    sent: number;
    failed: number;
    opened: number;
    clicked: number;
  };
}
