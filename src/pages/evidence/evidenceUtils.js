export const SECTION_LINKS = [
  { id: 'relationship', label: 'Relationship Graph' },
  { id: 'behaviour', label: 'Behavioural Profiling' },
  { id: 'flow', label: 'Network Flow' },
  { id: 'risk', label: 'Risk Scoring' },
  { id: 'red-flags', label: 'Red Flags' },
  { id: 'devices', label: 'Device Analysis' },
  { id: 'alerts', label: 'Alert Priority' },
  { id: 'workflow', label: 'Workflow' }
];

export const RED_FLAG_TYPES = [
  'Immediate Withdrawal',
  'Shared Device',
  'High Velocity',
  'Round Amount Pattern',
  'Layered Transfers',
  'Dormant Reactivation'
];

export const RISK_COLORS = {
  Low: '#2f7d58',
  Medium: '#d38b2f',
  High: '#c85d33',
  Critical: '#b9403a'
};

export const ALERT_SEVERITY_COLORS = {
  High: '#be3f3f',
  Medium: '#cf8f30',
  Low: '#2f7d58'
};

export const PIE_COLORS = ['#2f6fa3', '#4e92cc', '#68b7b0', '#d48c2f', '#be5f36', '#8c567e'];

const RANGE_DAYS = {
  '7d': 7,
  '30d': 30,
  '90d': 90
};

export const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export const getRangeDays = (rangeValue) => RANGE_DAYS[rangeValue] || 30;

export const toCode = (value) =>
  value
    .split(/[\s-]+/)
    .map((token) => token[0] || '')
    .join('')
    .replace(/[^a-zA-Z]/g, '')
    .toUpperCase()
    .slice(0, 3);

export const toCssSlug = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-');

export const formatShortDate = (dateValue) =>
  dateValue.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short'
  });

export const formatCurrencyTick = (value) => `INR ${Math.round(value / 1000)}k`;
