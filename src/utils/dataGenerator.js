// Shared data generation utilities for AML Dashboard

export const DATE_RANGE_OPTIONS = [
  { value: '7d', label: 'Last 7 Days', days: 7 },
  { value: '30d', label: 'Last 30 Days', days: 30 },
  { value: '90d', label: 'Last 90 Days', days: 90 }
];

export const INDIA_STATE_DISTRICTS = {
  'Andaman and Nicobar Islands': ['South Andaman', 'Nicobar', 'North and Middle Andaman'],
  'Andhra Pradesh': ['Visakhapatnam', 'East Godavari', 'West Godavari', 'Krishna', 'Guntur', 'Prakasam', 'Nellore', 'Chittoor', 'Kadapa', 'Anantapur', 'Kurnool', 'Srikakulam', 'Vizianagaram'],
  'Tamil Nadu': ['Chennai', 'Tiruvallur', 'Kanchipuram', 'Chengalpattu', 'Vellore', 'Ranipet', 'Tirupathur', 'Tiruvannamalai', 'Villupuram', 'Kallakurichi', 'Cuddalore', 'Salem', 'Namakkal', 'Dharmapuri', 'Krishnagiri', 'Erode', 'Tiruppur', 'Coimbatore', 'Nilgiris', 'Karur', 'Tiruchirappalli', 'Perambalur', 'Ariyalur', 'Thanjavur', 'Tiruvarur', 'Nagapattinam', 'Pudukkottai', 'Madurai', 'Theni', 'Dindigul', 'Ramanathapuram', 'Sivaganga', 'Virudhunagar', 'Thoothukudi', 'Tirunelveli', 'Tenkasi', 'Kanyakumari'],
  // Add other states as needed...
};

export const ALERT_TYPES = [
  'Cash Structuring',
  'Rapid In-Out',
  'Mule Funnel',
  'Dormant Reactivation',
  'Round Amount Spike',
  'High-Risk Counterparty'
];

export const ALERT_STATUSES = ['Open', 'In Review', 'Escalated', 'Closed'];
export const CASE_STATUSES = ['Open', 'In Progress', 'Escalated', 'STR Filed', 'Closed'];
export const DECISION_OPTIONS = ['Escalate', 'Freeze', 'Request KYC', 'File STR', 'Close Case'];
export const PATTERN_TAGS = ['Rapid In-Out', 'Funnel Behavior', 'Round Amount', 'Smurfing', 'Dormant Reactivation'];
export const GEO_RISK_LEVELS = ['Low', 'Medium', 'High', 'Critical'];
export const ONBOARDING_CHANNELS = ['Branch', 'Mobile App', 'Internet Banking', 'RM Desk', 'Corporate Desk'];

export const FIRST_NAMES = [
  'Rajesh',
  'Priya',
  'Amit',
  'Sneha',
  'Vikram',
  'Anjali',
  'Karthik',
  'Neha',
  'Rohit',
  'Divya',
  'Arjun',
  'Kavya'
];

export const LAST_NAMES = ['Kumar', 'Sharma', 'Patel', 'Reddy', 'Singh', 'Desai', 'Iyer', 'Gupta', 'Mehta', 'Nair'];

export const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
});

export const hashSeed = (value) => {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = ((hash << 5) - hash + value.charCodeAt(index)) >>> 0;
  }
  return hash;
};

export const seededNumber = (seed, min, max) => min + (hashSeed(seed) % (max - min + 1));
export const seededBoolean = (seed, truthyPercent = 50) => seededNumber(seed, 1, 100) <= truthyPercent;
export const seededChoice = (seed, array) => array[seededNumber(seed, 0, array.length - 1)];

export const toCode = (value) =>
  value
    .split(/[\s-]+/)
    .map((token) => token[0] || '')
    .join('')
    .replace(/[^a-zA-Z]/g, '')
    .toUpperCase()
    .slice(0, 3);

export const getRangeDays = (rangeValue) => DATE_RANGE_OPTIONS.find((option) => option.value === rangeValue)?.days || 30;

export const formatDateTime = (dateValue) =>
  dateValue.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

export const isSameDate = (leftDate, rightDate) =>
  leftDate.getFullYear() === rightDate.getFullYear() &&
  leftDate.getMonth() === rightDate.getMonth() &&
  leftDate.getDate() === rightDate.getDate();

export const getRiskBand = (score) => {
  if (score >= 85) return 'Critical';
  if (score >= 70) return 'High';
  if (score >= 40) return 'Medium';
  return 'Low';
};

// Function to get specific case by ID from generated investigations
export const getCaseById = (caseId, state, district, rangeValue = '30d') => {
  const seed = `${state}|${district}|${rangeValue}`;
  const windowDays = getRangeDays(rangeValue);
  const now = new Date();
  
  // Parse case ID to get index: CASE-TN-0003 -> index 2
  const match = caseId.match(/CASE-[A-Z]+-(\d+)/);
  if (!match) return null;
  
  const index = parseInt(match[1], 10) - 1;
  
  // Generate minimal data needed for this specific case
  const districtRiskProfile = seededNumber(`${seed}|district-risk`, 30, 90);
  const districtActivityLevel = seededNumber(`${seed}|activity-level`, 40, 95);
  
  const accountCountMin = districtActivityLevel > 70 ? 25 : districtActivityLevel > 50 ? 18 : 12;
  const accountCountMax = districtActivityLevel > 70 ? 45 : districtActivityLevel > 50 ? 35 : 30;
  const accountCount = seededNumber(`${seed}|accounts`, accountCountMin, accountCountMax);
  
  // Generate accounts for this district
  const accounts = Array.from({ length: accountCount }, (_, accIndex) => {
    const accountId = `AC-${toCode(state)}-${toCode(district)}-${String(accIndex + 1).padStart(4, '0')}`;
    return { accountId };
  });
  
  // Generate cluster for this case
  const clusterIndex = seededNumber(`${seed}|case-cluster|${index}`, 0, 20);
  const clusterSize = seededNumber(`${seed}|network-size|${clusterIndex}`, 3, 13);
  const start = seededNumber(`${seed}|start|${clusterIndex}`, 0, accounts.length - 1);
  const members = Array.from({ length: clusterSize }, (_, offset) => accounts[(start + offset) % accounts.length].accountId);
  
  const cluster = {
    clusterId: `CL-${toCode(state)}-${String(clusterIndex + 1).padStart(3, '0')}`,
    clusterSize,
    hubAccount: members[0],
    transitAccount: members[Math.min(1, members.length - 1)],
    controllerAccount: members[Math.min(2, members.length - 1)]
  };
  
  // Generate case data
  const riskScoreMin = seededNumber(`${seed}|riskmin`, 35, 50);
  const riskScore = seededNumber(`${seed}|case-risk|${index}`, riskScoreMin, 98);
  const patternType = PATTERN_TAGS[index % PATTERN_TAGS.length];
  
  const openedAt = new Date(
    now.getTime() - seededNumber(`${seed}|opened|${index}`, 2, windowDays * 24 - 1) * 60 * 60 * 1000
  );
  
  // Generate transactions
  const caseTransactions = [
    {
      transactionId: `TXN-${toCode(state)}-C${index}-001`,
      fromAccount: cluster.hubAccount,
      toAccount: cluster.transitAccount,
      amount: seededNumber(`${seed}|txn-amt-1|${index}`, 250000, 850000),
      direction: 'Outbound',
      patternTag: patternType,
      createdAt: new Date(openedAt.getTime() - 48 * 60 * 60 * 1000)
    },
    {
      transactionId: `TXN-${toCode(state)}-C${index}-002`,
      fromAccount: cluster.transitAccount,
      toAccount: cluster.controllerAccount,
      amount: seededNumber(`${seed}|txn-amt-2|${index}`, 200000, 800000),
      direction: 'Outbound',
      patternTag: patternType,
      createdAt: new Date(openedAt.getTime() - 36 * 60 * 60 * 1000)
    },
    {
      transactionId: `TXN-${toCode(state)}-C${index}-003`,
      fromAccount: cluster.controllerAccount,
      toAccount: cluster.hubAccount,
      amount: seededNumber(`${seed}|txn-amt-3|${index}`, 150000, 750000),
      direction: 'Inbound',
      patternTag: patternType,
      createdAt: new Date(openedAt.getTime() - 24 * 60 * 60 * 1000)
    },
    {
      transactionId: `TXN-${toCode(state)}-C${index}-004`,
      fromAccount: cluster.hubAccount,
      toAccount: accounts[seededNumber(`${seed}|external|${index}`, 0, accounts.length - 1)].accountId,
      amount: seededNumber(`${seed}|txn-amt-4|${index}`, 100000, 900000),
      direction: 'Outbound',
      patternTag: patternType,
      createdAt: new Date(openedAt.getTime() - 12 * 60 * 60 * 1000)
    }
  ];
  
  // Generate device history
  const hubDeviceId = `DV-${seededNumber(`${seed}|hub-device|${index}`, 10000, 89999)}`;
  const transitDeviceId = `DV-${seededNumber(`${seed}|transit-device|${index}`, 10000, 89999)}`;
  const controllerDeviceId = `DV-${seededNumber(`${seed}|ctrl-device|${index}`, 10000, 89999)}`;
  
  const sharedDevice = seededBoolean(`${seed}|shared|${index}`, 40);
  const deviceHistory = sharedDevice 
    ? [
        { deviceId: hubDeviceId, account: cluster.hubAccount, note: 'Hub Account' },
        { deviceId: hubDeviceId, account: cluster.transitAccount, note: 'Transit Account - SHARED DEVICE' },
        { deviceId: transitDeviceId, account: cluster.controllerAccount, note: 'Controller Account' }
      ]
    : [
        { deviceId: hubDeviceId, account: cluster.hubAccount, note: 'Hub Account' },
        { deviceId: transitDeviceId, account: cluster.transitAccount, note: 'Transit Account' },
        { deviceId: controllerDeviceId, account: cluster.controllerAccount, note: 'Controller Account' }
      ];
  
  // Generate timeline
  const timelineEvents = [
    { event: 'Case Created', at: openedAt },
    { event: `First Suspicious Transaction: ${caseTransactions[0].transactionId}`, at: caseTransactions[0].createdAt },
    { event: `Transit Flow Detected: ${caseTransactions[1].transactionId}`, at: caseTransactions[1].createdAt },
    { event: 'Network Analysis Completed', at: new Date(openedAt.getTime() + 2 * 60 * 60 * 1000) },
    { event: `Return Flow Identified: ${caseTransactions[2].transactionId}`, at: caseTransactions[2].createdAt },
    { event: sharedDevice ? 'Shared Device Pattern Confirmed' : 'Multiple Devices Detected', at: new Date(openedAt.getTime() + 6 * 60 * 60 * 1000) },
    { event: `Latest Transaction: ${caseTransactions[3].transactionId}`, at: caseTransactions[3].createdAt },
    { event: 'Alert Linkage Completed', at: new Date(openedAt.getTime() + 10 * 60 * 60 * 1000) }
  ].sort((a, b) => a.at - b.at);
  
  // Generate notes
  const totalAmount = caseTransactions.reduce((sum, txn) => sum + txn.amount, 0);
  const deviceNote = sharedDevice 
    ? 'Hub and Transit accounts accessed from same device, indicating coordinated control.'
    : 'Multiple devices used, suggesting organized network activity.';
  
  const linkedAlertIds = Array.from({ length: seededNumber(`${seed}|case-start|${index}`, 2, 5) }, (_, aIndex) => 
    `ALT-${toCode(state)}-${toCode(district)}-${String(seededNumber(`${seed}|alert|${index}|${aIndex}`, 1, 9999)).padStart(4, '0')}`
  );
  
  const notes = `${patternType} pattern detected in ${cluster.clusterSize}-account network. ` +
    `Total flow: ${currencyFormatter.format(totalAmount)} across 4 transactions. ` +
    `Flow: ${cluster.hubAccount} → ${cluster.transitAccount} → ${cluster.controllerAccount} → back to Hub. ` +
    `${deviceNote} Risk Score: ${riskScore}/100. ${linkedAlertIds.length} linked alerts.`;
  
  // Generate SLA
  const districtUrgency = seededNumber(`${seed}|urgency`, 0, 100);
  let slaHoursRemaining;
  if (index % 2 === 0) {
    if (districtUrgency > 70) {
      slaHoursRemaining = seededNumber(`${seed}|sla|${index}`, -10, 6);
    } else {
      slaHoursRemaining = seededNumber(`${seed}|sla|${index}`, -5, 8);
    }
  } else {
    if (districtUrgency < 30) {
      slaHoursRemaining = seededNumber(`${seed}|sla|${index}`, 15, 96);
    } else {
      slaHoursRemaining = seededNumber(`${seed}|sla|${index}`, 9, 72);
    }
  }
  
  const statusIndex = index % CASE_STATUSES.length;
  const caseStatus = CASE_STATUSES[statusIndex];
  const finalSlaHours = caseStatus === 'Closed' ? Math.abs(slaHoursRemaining) : slaHoursRemaining;
  
  const decisionIndex = Math.floor(index / CASE_STATUSES.length) % DECISION_OPTIONS.length;
  const recommendedAction = DECISION_OPTIONS[decisionIndex];
  
  return {
    caseId,
    linkedAlertIds,
    riskScore,
    clusterId: cluster.clusterId,
    status: caseStatus,
    openedAt,
    dueAt: new Date(now.getTime() + finalSlaHours * 60 * 60 * 1000),
    slaHoursRemaining: finalSlaHours,
    closureHours: seededNumber(`${seed}|closure|${index}`, 4, 62),
    recommendedAction,
    evidence: {
      transactions: caseTransactions,
      network: {
        hubAccount: cluster.hubAccount,
        transitAccount: cluster.transitAccount,
        controllerAccount: cluster.controllerAccount,
        clusterSize: cluster.clusterSize
      },
      deviceHistory,
      timeline: timelineEvents,
      notes
    }
  };
};
