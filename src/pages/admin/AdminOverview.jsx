import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const kpiMetrics = [
  { label: 'Total Accounts', value: '184,260', delta: '+3.8% vs last month' },
  { label: 'High Risk Accounts', value: '8,942', delta: '+1.2% in 7 days' },
  { label: 'Suspected Mule Accounts', value: '1,487', delta: '+5.6% in 7 days' },
  { label: 'Active Alerts', value: '612', delta: '48 escalated today' },
  { label: 'STR Filed', value: '124', delta: '17 pending approval' },
  { label: 'Average Risk Score', value: '64.3', delta: '+2.1 score points' }
];

const analystWorkload = [
  { 
    analyst: 'Rajesh Kumar', 
    id: 'A001',
    team: 'Team Alpha',
    location: 'Mumbai',
    openCases: 21, 
    closedToday: 3,
    highRisk: 6, 
    mediumRisk: 9,
    lowRisk: 6,
    avgResolutionTime: '4.2 hrs',
    strFiled: 2,
    escalations: 1,
    efficiency: 87,
    status: '🟡 Moderate', 
    statusClass: 'moderate' 
  },
  { 
    analyst: 'Priya Sharma', 
    id: 'A002',
    team: 'Team Alpha',
    location: 'Chennai',
    openCases: 14, 
    closedToday: 5,
    highRisk: 3, 
    mediumRisk: 7,
    lowRisk: 4,
    avgResolutionTime: '3.1 hrs',
    strFiled: 1,
    escalations: 0,
    efficiency: 94,
    status: '🟢 Balanced', 
    statusClass: 'balanced' 
  },
  { 
    analyst: 'Amit Patel', 
    id: 'A003',
    team: 'Team Beta',
    location: 'Bengaluru',
    openCases: 32, 
    closedToday: 2,
    highRisk: 11, 
    mediumRisk: 14,
    lowRisk: 7,
    avgResolutionTime: '6.8 hrs',
    strFiled: 4,
    escalations: 3,
    efficiency: 68,
    status: '🔴 Overloaded', 
    statusClass: 'overloaded' 
  },
  { 
    analyst: 'Sneha Reddy', 
    id: 'A004',
    team: 'Team Beta',
    location: 'Hyderabad',
    openCases: 8, 
    closedToday: 4,
    highRisk: 2, 
    mediumRisk: 4,
    lowRisk: 2,
    avgResolutionTime: '2.8 hrs',
    strFiled: 0,
    escalations: 0,
    efficiency: 96,
    status: '🟢 Balanced', 
    statusClass: 'balanced' 
  },
  { 
    analyst: 'Vikram Singh', 
    id: 'A005',
    team: 'Team Alpha',
    location: 'Delhi',
    openCases: 26, 
    closedToday: 3,
    highRisk: 8, 
    mediumRisk: 11,
    lowRisk: 7,
    avgResolutionTime: '5.3 hrs',
    strFiled: 3,
    escalations: 2,
    efficiency: 78,
    status: '🟡 Moderate', 
    statusClass: 'moderate' 
  },
  { 
    analyst: 'Anjali Desai', 
    id: 'A006',
    team: 'Team Gamma',
    location: 'Pune',
    openCases: 17, 
    closedToday: 4,
    highRisk: 4, 
    mediumRisk: 8,
    lowRisk: 5,
    avgResolutionTime: '3.7 hrs',
    strFiled: 1,
    escalations: 1,
    efficiency: 89,
    status: '🟢 Balanced', 
    statusClass: 'balanced' 
  },
  { 
    analyst: 'Karthik Iyer', 
    id: 'A007',
    team: 'Team Gamma',
    location: 'Kochi',
    openCases: 29, 
    closedToday: 2,
    highRisk: 10, 
    mediumRisk: 12,
    lowRisk: 7,
    avgResolutionTime: '6.1 hrs',
    strFiled: 3,
    escalations: 2,
    efficiency: 72,
    status: '🔴 Overloaded', 
    statusClass: 'overloaded' 
  },
  { 
    analyst: 'Neha Gupta', 
    id: 'A008',
    team: 'Team Beta',
    location: 'Kolkata',
    openCases: 19, 
    closedToday: 4,
    highRisk: 5, 
    mediumRisk: 9,
    lowRisk: 5,
    avgResolutionTime: '4.0 hrs',
    strFiled: 2,
    escalations: 1,
    efficiency: 85,
    status: '🟡 Moderate', 
    statusClass: 'moderate' 
  },
  { 
    analyst: 'Rohit Mehta', 
    id: 'A009',
    team: 'Team Gamma',
    location: 'Ahmedabad',
    openCases: 11, 
    closedToday: 5,
    highRisk: 2, 
    mediumRisk: 6,
    lowRisk: 3,
    avgResolutionTime: '2.9 hrs',
    strFiled: 0,
    escalations: 0,
    efficiency: 93,
    status: '🟢 Balanced', 
    statusClass: 'balanced' 
  },
  { 
    analyst: 'Divya Krishnan', 
    id: 'A010',
    team: 'Team Alpha',
    location: 'Coimbatore',
    openCases: 23, 
    closedToday: 3,
    highRisk: 7, 
    mediumRisk: 10,
    lowRisk: 6,
    avgResolutionTime: '4.8 hrs',
    strFiled: 2,
    escalations: 1,
    efficiency: 82,
    status: '🟡 Moderate', 
    statusClass: 'moderate' 
  },
  { 
    analyst: 'Arjun Nair', 
    id: 'A011',
    team: 'Team Beta',
    location: 'Thiruvananthapuram',
    openCases: 15, 
    closedToday: 4,
    highRisk: 3, 
    mediumRisk: 8,
    lowRisk: 4,
    avgResolutionTime: '3.4 hrs',
    strFiled: 1,
    escalations: 0,
    efficiency: 91,
    status: '🟢 Balanced', 
    statusClass: 'balanced' 
  },
  { 
    analyst: 'Kavya Joshi', 
    id: 'A012',
    team: 'Team Gamma',
    location: 'Jaipur',
    openCases: 28, 
    closedToday: 2,
    highRisk: 9, 
    mediumRisk: 13,
    lowRisk: 6,
    avgResolutionTime: '5.9 hrs',
    strFiled: 3,
    escalations: 2,
    efficiency: 74,
    status: '🔴 Overloaded', 
    statusClass: 'overloaded' 
  }
];

// Indian States and Districts Risk Data
const indiaRiskData = {
  'Maharashtra': {
    'Mumbai': [
      { band: '0-20', value: 12 },
      { band: '21-40', value: 23 },
      { band: '41-60', value: 45 },
      { band: '61-75', value: 78 },
      { band: '76-85', value: 65 },
      { band: '86-95', value: 39 },
      { band: '96-100', value: 22 }
    ],
    'Pune': [
      { band: '0-20', value: 16 },
      { band: '21-40', value: 28 },
      { band: '41-60', value: 42 },
      { band: '61-75', value: 68 },
      { band: '76-85', value: 55 },
      { band: '86-95', value: 31 },
      { band: '96-100', value: 18 }
    ],
    'Nagpur': [
      { band: '0-20', value: 18 },
      { band: '21-40', value: 32 },
      { band: '41-60', value: 48 },
      { band: '61-75', value: 58 },
      { band: '76-85', value: 42 },
      { band: '86-95', value: 25 },
      { band: '96-100', value: 14 }
    ]
  },
  'Tamil Nadu': {
    'Chennai': [
      { band: '0-20', value: 10 },
      { band: '21-40', value: 20 },
      { band: '41-60', value: 38 },
      { band: '61-75', value: 82 },
      { band: '76-85', value: 70 },
      { band: '86-95', value: 42 },
      { band: '96-100', value: 25 }
    ],
    'Coimbatore': [
      { band: '0-20', value: 15 },
      { band: '21-40', value: 26 },
      { band: '41-60', value: 44 },
      { band: '61-75', value: 62 },
      { band: '76-85', value: 50 },
      { band: '86-95', value: 28 },
      { band: '96-100', value: 16 }
    ],
    'Madurai': [
      { band: '0-20', value: 19 },
      { band: '21-40', value: 30 },
      { band: '41-60', value: 46 },
      { band: '61-75', value: 55 },
      { band: '76-85', value: 45 },
      { band: '86-95', value: 24 },
      { band: '96-100', value: 13 }
    ],
    'Tiruchirappalli': [
      { band: '0-20', value: 17 },
      { band: '21-40', value: 28 },
      { band: '41-60', value: 45 },
      { band: '61-75', value: 58 },
      { band: '76-85', value: 48 },
      { band: '86-95', value: 26 },
      { band: '96-100', value: 14 }
    ],
    'Salem': [
      { band: '0-20', value: 16 },
      { band: '21-40', value: 27 },
      { band: '41-60', value: 44 },
      { band: '61-75', value: 60 },
      { band: '76-85', value: 51 },
      { band: '86-95', value: 29 },
      { band: '96-100', value: 16 }
    ],
    'Tirunelveli': [
      { band: '0-20', value: 18 },
      { band: '21-40', value: 29 },
      { band: '41-60', value: 46 },
      { band: '61-75', value: 56 },
      { band: '76-85', value: 47 },
      { band: '86-95', value: 26 },
      { band: '96-100', value: 14 }
    ],
    'Tiruppur': [
      { band: '0-20', value: 16 },
      { band: '21-40', value: 27 },
      { band: '41-60', value: 45 },
      { band: '61-75', value: 59 },
      { band: '76-85', value: 50 },
      { band: '86-95', value: 28 },
      { band: '96-100', value: 15 }
    ],
    'Erode': [
      { band: '0-20', value: 17 },
      { band: '21-40', value: 28 },
      { band: '41-60', value: 46 },
      { band: '61-75', value: 57 },
      { band: '76-85', value: 49 },
      { band: '86-95', value: 27 },
      { band: '96-100', value: 15 }
    ],
    'Vellore': [
      { band: '0-20', value: 16 },
      { band: '21-40', value: 27 },
      { band: '41-60', value: 44 },
      { band: '61-75', value: 61 },
      { band: '76-85', value: 52 },
      { band: '86-95', value: 29 },
      { band: '96-100', value: 16 }
    ],
    'Thanjavur': [
      { band: '0-20', value: 18 },
      { band: '21-40', value: 29 },
      { band: '41-60', value: 47 },
      { band: '61-75', value: 55 },
      { band: '76-85', value: 46 },
      { band: '86-95', value: 25 },
      { band: '96-100', value: 14 }
    ],
    'Dindigul': [
      { band: '0-20', value: 19 },
      { band: '21-40', value: 30 },
      { band: '41-60', value: 47 },
      { band: '61-75', value: 54 },
      { band: '76-85', value: 45 },
      { band: '86-95', value: 24 },
      { band: '96-100', value: 13 }
    ],
    'Kancheepuram': [
      { band: '0-20', value: 14 },
      { band: '21-40', value: 25 },
      { band: '41-60', value: 43 },
      { band: '61-75', value: 64 },
      { band: '76-85', value: 56 },
      { band: '86-95', value: 31 },
      { band: '96-100', value: 17 }
    ],
    'Thoothukudi': [
      { band: '0-20', value: 18 },
      { band: '21-40', value: 29 },
      { band: '41-60', value: 46 },
      { band: '61-75', value: 56 },
      { band: '76-85', value: 47 },
      { band: '86-95', value: 26 },
      { band: '96-100', value: 14 }
    ],
    'Cuddalore': [
      { band: '0-20', value: 19 },
      { band: '21-40', value: 30 },
      { band: '41-60', value: 48 },
      { band: '61-75', value: 54 },
      { band: '76-85', value: 45 },
      { band: '86-95', value: 24 },
      { band: '96-100', value: 13 }
    ],
    'Karur': [
      { band: '0-20', value: 18 },
      { band: '21-40', value: 29 },
      { band: '41-60', value: 47 },
      { band: '61-75', value: 55 },
      { band: '76-85', value: 46 },
      { band: '86-95', value: 25 },
      { band: '96-100', value: 14 }
    ],
    'Nagapattinam': [
      { band: '0-20', value: 20 },
      { band: '21-40', value: 31 },
      { band: '41-60', value: 48 },
      { band: '61-75', value: 52 },
      { band: '76-85', value: 43 },
      { band: '86-95', value: 23 },
      { band: '96-100', value: 12 }
    ],
    'Namakkal': [
      { band: '0-20', value: 18 },
      { band: '21-40', value: 29 },
      { band: '41-60', value: 47 },
      { band: '61-75', value: 56 },
      { band: '76-85', value: 47 },
      { band: '86-95', value: 26 },
      { band: '96-100', value: 14 }
    ],
    'Ramanathapuram': [
      { band: '0-20', value: 20 },
      { band: '21-40', value: 31 },
      { band: '41-60', value: 48 },
      { band: '61-75', value: 53 },
      { band: '76-85', value: 44 },
      { band: '86-95', value: 24 },
      { band: '96-100', value: 13 }
    ],
    'Virudhunagar': [
      { band: '0-20', value: 19 },
      { band: '21-40', value: 30 },
      { band: '41-60', value: 47 },
      { band: '61-75', value: 54 },
      { band: '76-85', value: 45 },
      { band: '86-95', value: 24 },
      { band: '96-100', value: 13 }
    ],
    'Sivaganga': [
      { band: '0-20', value: 20 },
      { band: '21-40', value: 31 },
      { band: '41-60', value: 48 },
      { band: '61-75', value: 52 },
      { band: '76-85', value: 43 },
      { band: '86-95', value: 23 },
      { band: '96-100', value: 12 }
    ],
    'Kanniyakumari': [
      { band: '0-20', value: 19 },
      { band: '21-40', value: 30 },
      { band: '41-60', value: 47 },
      { band: '61-75', value: 54 },
      { band: '76-85', value: 45 },
      { band: '86-95', value: 25 },
      { band: '96-100', value: 13 }
    ],
    'Pudukkottai': [
      { band: '0-20', value: 20 },
      { band: '21-40', value: 31 },
      { band: '41-60', value: 48 },
      { band: '61-75', value: 53 },
      { band: '76-85', value: 44 },
      { band: '86-95', value: 24 },
      { band: '96-100', value: 13 }
    ],
    'Theni': [
      { band: '0-20', value: 19 },
      { band: '21-40', value: 30 },
      { band: '41-60', value: 47 },
      { band: '61-75', value: 54 },
      { band: '76-85', value: 45 },
      { band: '86-95', value: 24 },
      { band: '96-100', value: 13 }
    ],
    'Dharmapuri': [
      { band: '0-20', value: 19 },
      { band: '21-40', value: 30 },
      { band: '41-60', value: 48 },
      { band: '61-75', value: 54 },
      { band: '76-85', value: 45 },
      { band: '86-95', value: 24 },
      { band: '96-100', value: 13 }
    ],
    'Krishnagiri': [
      { band: '0-20', value: 18 },
      { band: '21-40', value: 29 },
      { band: '41-60', value: 47 },
      { band: '61-75', value: 55 },
      { band: '76-85', value: 46 },
      { band: '86-95', value: 25 },
      { band: '96-100', value: 14 }
    ],
    'Ariyalur': [
      { band: '0-20', value: 20 },
      { band: '21-40', value: 31 },
      { band: '41-60', value: 49 },
      { band: '61-75', value: 52 },
      { band: '76-85', value: 43 },
      { band: '86-95', value: 23 },
      { band: '96-100', value: 12 }
    ],
    'Perambalur': [
      { band: '0-20', value: 20 },
      { band: '21-40', value: 31 },
      { band: '41-60', value: 49 },
      { band: '61-75', value: 52 },
      { band: '76-85', value: 43 },
      { band: '86-95', value: 23 },
      { band: '96-100', value: 12 }
    ],
    'Tiruvallur': [
      { band: '0-20', value: 13 },
      { band: '21-40', value: 24 },
      { band: '41-60', value: 42 },
      { band: '61-75', value: 66 },
      { band: '76-85', value: 58 },
      { band: '86-95', value: 33 },
      { band: '96-100', value: 18 }
    ],
    'Tiruvannamalai': [
      { band: '0-20', value: 18 },
      { band: '21-40', value: 29 },
      { band: '41-60', value: 47 },
      { band: '61-75', value: 56 },
      { band: '76-85', value: 47 },
      { band: '86-95', value: 26 },
      { band: '96-100', value: 14 }
    ],
    'Villupuram': [
      { band: '0-20', value: 19 },
      { band: '21-40', value: 30 },
      { band: '41-60', value: 48 },
      { band: '61-75', value: 54 },
      { band: '76-85', value: 45 },
      { band: '86-95', value: 24 },
      { band: '96-100', value: 13 }
    ],
    'Ranipet': [
      { band: '0-20', value: 17 },
      { band: '21-40', value: 28 },
      { band: '41-60', value: 46 },
      { band: '61-75', value: 58 },
      { band: '76-85', value: 49 },
      { band: '86-95', value: 27 },
      { band: '96-100', value: 15 }
    ],
    'Tirupathur': [
      { band: '0-20', value: 18 },
      { band: '21-40', value: 29 },
      { band: '41-60', value: 47 },
      { band: '61-75', value: 56 },
      { band: '76-85', value: 47 },
      { band: '86-95', value: 26 },
      { band: '96-100', value: 14 }
    ],
    'Chengalpattu': [
      { band: '0-20', value: 14 },
      { band: '21-40', value: 25 },
      { band: '41-60', value: 43 },
      { band: '61-75', value: 65 },
      { band: '76-85', value: 57 },
      { band: '86-95', value: 32 },
      { band: '96-100', value: 18 }
    ],
    'Tenkasi': [
      { band: '0-20', value: 19 },
      { band: '21-40', value: 30 },
      { band: '41-60', value: 47 },
      { band: '61-75', value: 54 },
      { band: '76-85', value: 46 },
      { band: '86-95', value: 25 },
      { band: '96-100', value: 14 }
    ],
    'Kallakurichi': [
      { band: '0-20', value: 19 },
      { band: '21-40', value: 30 },
      { band: '41-60', value: 48 },
      { band: '61-75', value: 54 },
      { band: '76-85', value: 45 },
      { band: '86-95', value: 24 },
      { band: '96-100', value: 13 }
    ],
    'Mayiladuthurai': [
      { band: '0-20', value: 20 },
      { band: '21-40', value: 31 },
      { band: '41-60', value: 48 },
      { band: '61-75', value: 52 },
      { band: '76-85', value: 43 },
      { band: '86-95', value: 23 },
      { band: '96-100', value: 12 }
    ]
  },
  'Karnataka': {
    'Bengaluru': [
      { band: '0-20', value: 13 },
      { band: '21-40', value: 24 },
      { band: '41-60', value: 43 },
      { band: '61-75', value: 72 },
      { band: '76-85', value: 62 },
      { band: '86-95', value: 35 },
      { band: '96-100', value: 20 }
    ],
    'Mysuru': [
      { band: '0-20', value: 17 },
      { band: '21-40', value: 29 },
      { band: '41-60', value: 47 },
      { band: '61-75', value: 60 },
      { band: '76-85', value: 48 },
      { band: '86-95', value: 27 },
      { band: '96-100', value: 15 }
    ],
    'Mangaluru': [
      { band: '0-20', value: 20 },
      { band: '21-40', value: 33 },
      { band: '41-60', value: 50 },
      { band: '61-75', value: 52 },
      { band: '76-85', value: 40 },
      { band: '86-95', value: 22 },
      { band: '96-100', value: 12 }
    ]
  },
  'Delhi': {
    'Central Delhi': [
      { band: '0-20', value: 11 },
      { band: '21-40', value: 22 },
      { band: '41-60', value: 40 },
      { band: '61-75', value: 75 },
      { band: '76-85', value: 68 },
      { band: '86-95', value: 38 },
      { band: '96-100', value: 23 }
    ],
    'South Delhi': [
      { band: '0-20', value: 14 },
      { band: '21-40', value: 25 },
      { band: '41-60', value: 43 },
      { band: '61-75', value: 70 },
      { band: '76-85', value: 60 },
      { band: '86-95', value: 33 },
      { band: '96-100', value: 19 }
    ],
    'North Delhi': [
      { band: '0-20', value: 16 },
      { band: '21-40', value: 27 },
      { band: '41-60', value: 45 },
      { band: '61-75', value: 65 },
      { band: '76-85', value: 54 },
      { band: '86-95', value: 30 },
      { band: '96-100', value: 17 }
    ]
  },
  'West Bengal': {
    'Kolkata': [
      { band: '0-20', value: 15 },
      { band: '21-40', value: 26 },
      { band: '41-60', value: 44 },
      { band: '61-75', value: 66 },
      { band: '76-85', value: 58 },
      { band: '86-95', value: 32 },
      { band: '96-100', value: 18 }
    ],
    'Howrah': [
      { band: '0-20', value: 17 },
      { band: '21-40', value: 28 },
      { band: '41-60', value: 46 },
      { band: '61-75', value: 60 },
      { band: '76-85', value: 52 },
      { band: '86-95', value: 29 },
      { band: '96-100', value: 16 }
    ],
    'Durgapur': [
      { band: '0-20', value: 19 },
      { band: '21-40', value: 31 },
      { band: '41-60', value: 49 },
      { band: '61-75', value: 54 },
      { band: '76-85', value: 44 },
      { band: '86-95', value: 24 },
      { band: '96-100', value: 13 }
    ]
  },
  'Gujarat': {
    'Ahmedabad': [
      { band: '0-20', value: 14 },
      { band: '21-40', value: 25 },
      { band: '41-60', value: 42 },
      { band: '61-75', value: 63 },
      { band: '76-85', value: 56 },
      { band: '86-95', value: 31 },
      { band: '96-100', value: 17 }
    ],
    'Surat': [
      { band: '0-20', value: 16 },
      { band: '21-40', value: 27 },
      { band: '41-60', value: 45 },
      { band: '61-75', value: 59 },
      { band: '76-85', value: 51 },
      { band: '86-95', value: 28 },
      { band: '96-100', value: 15 }
    ],
    'Vadodara': [
      { band: '0-20', value: 18 },
      { band: '21-40', value: 29 },
      { band: '41-60', value: 47 },
      { band: '61-75', value: 56 },
      { band: '76-85', value: 47 },
      { band: '86-95', value: 26 },
      { band: '96-100', value: 14 }
    ]
  },
  'Telangana': {
    'Hyderabad': [
      { band: '0-20', value: 13 },
      { band: '21-40', value: 24 },
      { band: '41-60', value: 41 },
      { band: '61-75', value: 64 },
      { band: '76-85', value: 57 },
      { band: '86-95', value: 32 },
      { band: '96-100', value: 18 }
    ],
    'Warangal': [
      { band: '0-20', value: 17 },
      { band: '21-40', value: 28 },
      { band: '41-60', value: 46 },
      { band: '61-75', value: 58 },
      { band: '76-85', value: 49 },
      { band: '86-95', value: 27 },
      { band: '96-100', value: 15 }
    ],
    'Nizamabad': [
      { band: '0-20', value: 19 },
      { band: '21-40', value: 30 },
      { band: '41-60', value: 48 },
      { band: '61-75', value: 53 },
      { band: '76-85', value: 43 },
      { band: '86-95', value: 24 },
      { band: '96-100', value: 13 }
    ]
  },
  'Kerala': {
    'Kochi': [
      { band: '0-20', value: 16 },
      { band: '21-40', value: 27 },
      { band: '41-60', value: 44 },
      { band: '61-75', value: 57 },
      { band: '76-85', value: 50 },
      { band: '86-95', value: 28 },
      { band: '96-100', value: 15 }
    ],
    'Thiruvananthapuram': [
      { band: '0-20', value: 18 },
      { band: '21-40', value: 29 },
      { band: '41-60', value: 46 },
      { band: '61-75', value: 54 },
      { band: '76-85', value: 46 },
      { band: '86-95', value: 26 },
      { band: '96-100', value: 14 }
    ],
    'Kozhikode': [
      { band: '0-20', value: 20 },
      { band: '21-40', value: 31 },
      { band: '41-60', value: 48 },
      { band: '61-75', value: 51 },
      { band: '76-85', value: 42 },
      { band: '86-95', value: 23 },
      { band: '96-100', value: 12 }
    ]
  },
  'Rajasthan': {
    'Jaipur': [
      { band: '0-20', value: 12 },
      { band: '21-40', value: 23 },
      { band: '41-60', value: 41 },
      { band: '61-75', value: 67 },
      { band: '76-85', value: 59 },
      { band: '86-95', value: 34 },
      { band: '96-100', value: 19 }
    ],
    'Udaipur': [
      { band: '0-20', value: 17 },
      { band: '21-40', value: 28 },
      { band: '41-60', value: 45 },
      { band: '61-75', value: 56 },
      { band: '76-85', value: 48 },
      { band: '86-95', value: 27 },
      { band: '96-100', value: 15 }
    ],
    'Jodhpur': [
      { band: '0-20', value: 19 },
      { band: '21-40', value: 30 },
      { band: '41-60', value: 47 },
      { band: '61-75', value: 53 },
      { band: '76-85', value: 44 },
      { band: '86-95', value: 25 },
      { band: '96-100', value: 14 }
    ]
  },
  'Uttar Pradesh': {
    'Lucknow': [
      { band: '0-20', value: 13 },
      { band: '21-40', value: 24 },
      { band: '41-60', value: 42 },
      { band: '61-75', value: 69 },
      { band: '76-85', value: 61 },
      { band: '86-95', value: 35 },
      { band: '96-100', value: 20 }
    ],
    'Kanpur': [
      { band: '0-20', value: 15 },
      { band: '21-40', value: 26 },
      { band: '41-60', value: 44 },
      { band: '61-75', value: 64 },
      { band: '76-85', value: 56 },
      { band: '86-95', value: 31 },
      { band: '96-100', value: 18 }
    ],
    'Varanasi': [
      { band: '0-20', value: 18 },
      { band: '21-40', value: 29 },
      { band: '41-60', value: 46 },
      { band: '61-75', value: 58 },
      { band: '76-85', value: 50 },
      { band: '86-95', value: 28 },
      { band: '96-100', value: 16 }
    ],
    'Agra': [
      { band: '0-20', value: 16 },
      { band: '21-40', value: 27 },
      { band: '41-60', value: 45 },
      { band: '61-75', value: 61 },
      { band: '76-85', value: 53 },
      { band: '86-95', value: 30 },
      { band: '96-100', value: 17 }
    ]
  },
  'Punjab': {
    'Chandigarh': [
      { band: '0-20', value: 14 },
      { band: '21-40', value: 25 },
      { band: '41-60', value: 43 },
      { band: '61-75', value: 65 },
      { band: '76-85', value: 57 },
      { band: '86-95', value: 32 },
      { band: '96-100', value: 18 }
    ],
    'Ludhiana': [
      { band: '0-20', value: 16 },
      { band: '21-40', value: 27 },
      { band: '41-60', value: 45 },
      { band: '61-75', value: 60 },
      { band: '76-85', value: 52 },
      { band: '86-95', value: 29 },
      { band: '96-100', value: 16 }
    ],
    'Amritsar': [
      { band: '0-20', value: 18 },
      { band: '21-40', value: 29 },
      { band: '41-60', value: 47 },
      { band: '61-75', value: 57 },
      { band: '76-85', value: 49 },
      { band: '86-95', value: 27 },
      { band: '96-100', value: 15 }
    ]
  },
  'Haryana': {
    'Gurugram': [
      { band: '0-20', value: 11 },
      { band: '21-40', value: 22 },
      { band: '41-60', value: 40 },
      { band: '61-75', value: 73 },
      { band: '76-85', value: 66 },
      { band: '86-95', value: 37 },
      { band: '96-100', value: 21 }
    ],
    'Faridabad': [
      { band: '0-20', value: 13 },
      { band: '21-40', value: 24 },
      { band: '41-60', value: 42 },
      { band: '61-75', value: 68 },
      { band: '76-85', value: 60 },
      { band: '86-95', value: 34 },
      { band: '96-100', value: 19 }
    ],
    'Rohtak': [
      { band: '0-20', value: 17 },
      { band: '21-40', value: 28 },
      { band: '41-60', value: 46 },
      { band: '61-75', value: 59 },
      { band: '76-85', value: 51 },
      { band: '86-95', value: 29 },
      { band: '96-100', value: 16 }
    ]
  },
  'Madhya Pradesh': {
    'Bhopal': [
      { band: '0-20', value: 15 },
      { band: '21-40', value: 26 },
      { band: '41-60', value: 44 },
      { band: '61-75', value: 62 },
      { band: '76-85', value: 54 },
      { band: '86-95', value: 30 },
      { band: '96-100', value: 17 }
    ],
    'Indore': [
      { band: '0-20', value: 14 },
      { band: '21-40', value: 25 },
      { band: '41-60', value: 43 },
      { band: '61-75', value: 64 },
      { band: '76-85', value: 56 },
      { band: '86-95', value: 31 },
      { band: '96-100', value: 18 }
    ],
    'Gwalior': [
      { band: '0-20', value: 18 },
      { band: '21-40', value: 29 },
      { band: '41-60', value: 47 },
      { band: '61-75', value: 58 },
      { band: '76-85', value: 49 },
      { band: '86-95', value: 27 },
      { band: '96-100', value: 15 }
    ]
  },
  'Andhra Pradesh': {
    'Visakhapatnam': [
      { band: '0-20', value: 16 },
      { band: '21-40', value: 27 },
      { band: '41-60', value: 45 },
      { band: '61-75', value: 61 },
      { band: '76-85', value: 53 },
      { band: '86-95', value: 30 },
      { band: '96-100', value: 17 }
    ],
    'Vijayawada': [
      { band: '0-20', value: 17 },
      { band: '21-40', value: 28 },
      { band: '41-60', value: 46 },
      { band: '61-75', value: 59 },
      { band: '76-85', value: 51 },
      { band: '86-95', value: 29 },
      { band: '96-100', value: 16 }
    ],
    'Tirupati': [
      { band: '0-20', value: 19 },
      { band: '21-40', value: 30 },
      { band: '41-60', value: 48 },
      { band: '61-75', value: 55 },
      { band: '76-85', value: 47 },
      { band: '86-95', value: 26 },
      { band: '96-100', value: 14 }
    ]
  },
  'Bihar': {
    'Patna': [
      { band: '0-20', value: 17 },
      { band: '21-40', value: 28 },
      { band: '41-60', value: 46 },
      { band: '61-75', value: 60 },
      { band: '76-85', value: 52 },
      { band: '86-95', value: 29 },
      { band: '96-100', value: 16 }
    ],
    'Gaya': [
      { band: '0-20', value: 19 },
      { band: '21-40', value: 30 },
      { band: '41-60', value: 48 },
      { band: '61-75', value: 56 },
      { band: '76-85', value: 48 },
      { band: '86-95', value: 27 },
      { band: '96-100', value: 15 }
    ],
    'Bhagalpur': [
      { band: '0-20', value: 20 },
      { band: '21-40', value: 31 },
      { band: '41-60', value: 49 },
      { band: '61-75', value: 54 },
      { band: '76-85', value: 46 },
      { band: '86-95', value: 25 },
      { band: '96-100', value: 14 }
    ]
  },
  'Odisha': {
    'Bhubaneswar': [
      { band: '0-20', value: 16 },
      { band: '21-40', value: 27 },
      { band: '41-60', value: 45 },
      { band: '61-75', value: 59 },
      { band: '76-85', value: 51 },
      { band: '86-95', value: 29 },
      { band: '96-100', value: 16 }
    ],
    'Cuttack': [
      { band: '0-20', value: 18 },
      { band: '21-40', value: 29 },
      { band: '41-60', value: 47 },
      { band: '61-75', value: 56 },
      { band: '76-85', value: 48 },
      { band: '86-95', value: 27 },
      { band: '96-100', value: 15 }
    ],
    'Rourkela': [
      { band: '0-20', value: 20 },
      { band: '21-40', value: 31 },
      { band: '41-60', value: 49 },
      { band: '61-75', value: 53 },
      { band: '76-85', value: 45 },
      { band: '86-95', value: 25 },
      { band: '96-100', value: 13 }
    ]
  }
};

const caseStatusData = [
  { label: '🟢 Closed Cases', value: 324, color: '#1ca66f' },
  { label: '🟡 In Progress', value: 87, color: '#cf9d18' },
  { label: '🔴 High Priority Open', value: 29, color: '#c83b3b' },
  { label: '🔵 Escalated', value: 18, color: '#2e79db' },
  { label: '🟣 STR Filed', value: 124, color: '#7b4ecf' }
];

const geoRiskIndex = [
  { location: 'Tamil Nadu - Chennai', score: 86 },
  { location: 'Maharashtra - Mumbai', score: 82 },
  { location: 'Delhi - Central', score: 79 },
  { location: 'Karnataka - Bengaluru', score: 74 },
  { location: 'West Bengal - Kolkata', score: 68 },
  { location: 'Gujarat - Ahmedabad', score: 63 },
  { location: 'Telangana - Hyderabad', score: 60 },
  { location: 'Kerala - Kochi', score: 52 }
];

const trendOptions = ['Last 7 days', 'Last 30 days', 'Quarterly'];

const caseTrendData = {
  'Last 7 days': [
    { label: 'D1', newCases: 41, closedCases: 32, escalations: 6 },
    { label: 'D2', newCases: 38, closedCases: 33, escalations: 5 },
    { label: 'D3', newCases: 44, closedCases: 35, escalations: 6 },
    { label: 'D4', newCases: 47, closedCases: 38, escalations: 7 },
    { label: 'D5', newCases: 42, closedCases: 36, escalations: 7 },
    { label: 'D6', newCases: 51, closedCases: 40, escalations: 9 },
    { label: 'D7', newCases: 49, closedCases: 41, escalations: 8 }
  ],
  'Last 30 days': [
    { label: 'W1', newCases: 182, closedCases: 164, escalations: 25 },
    { label: 'W2', newCases: 194, closedCases: 171, escalations: 29 },
    { label: 'W3', newCases: 207, closedCases: 183, escalations: 31 },
    { label: 'W4', newCases: 221, closedCases: 190, escalations: 34 }
  ],
  Quarterly: [
    { label: 'Q1', newCases: 610, closedCases: 584, escalations: 75 },
    { label: 'Q2', newCases: 652, closedCases: 601, escalations: 81 },
    { label: 'Q3', newCases: 684, closedCases: 628, escalations: 90 },
    { label: 'Q4', newCases: 711, closedCases: 645, escalations: 98 }
  ]
};

const AdminOverview = () => {
  const navigate = useNavigate();
  const [selectedTrend, setSelectedTrend] = useState('Last 7 days');
  const [selectedState, setSelectedState] = useState('Maharashtra');
  const [selectedDistrict, setSelectedDistrict] = useState('Mumbai');
  const [analystTeamFilter, setAnalystTeamFilter] = useState('All Teams');
  const [analystStatusFilter, setAnalystStatusFilter] = useState('All Status');
  const [analystLocationFilter, setAnalystLocationFilter] = useState('All Locations');

  const handleNavigateToAnalyst = () => {
    const params = new URLSearchParams({
      state: selectedState,
      district: selectedDistrict,
      range: '30d'
    });
    navigate(`/dashboard/analyst/dashboard?${params.toString()}`);
  };

  // Filter analyst workload
  const filteredAnalystWorkload = useMemo(() => {
    return analystWorkload.filter(analyst => {
      const teamMatch = analystTeamFilter === 'All Teams' || analyst.team === analystTeamFilter;
      const statusMatch = analystStatusFilter === 'All Status' || analyst.status === analystStatusFilter;
      const locationMatch = analystLocationFilter === 'All Locations' || analyst.location === analystLocationFilter;
      return teamMatch && statusMatch && locationMatch;
    });
  }, [analystTeamFilter, analystStatusFilter, analystLocationFilter]);

  // Calculate summary statistics for filtered analysts
  const analystSummary = useMemo(() => {
    const total = filteredAnalystWorkload.length;
    const totalOpen = filteredAnalystWorkload.reduce((sum, a) => sum + a.openCases, 0);
    const totalHighRisk = filteredAnalystWorkload.reduce((sum, a) => sum + a.highRisk, 0);
    const totalClosed = filteredAnalystWorkload.reduce((sum, a) => sum + a.closedToday, 0);
    const avgEfficiency = total > 0 ? Math.round(filteredAnalystWorkload.reduce((sum, a) => sum + a.efficiency, 0) / total) : 0;
    const balanced = filteredAnalystWorkload.filter(a => a.statusClass === 'balanced').length;
    const moderate = filteredAnalystWorkload.filter(a => a.statusClass === 'moderate').length;
    const overloaded = filteredAnalystWorkload.filter(a => a.statusClass === 'overloaded').length;
    
    return { total, totalOpen, totalHighRisk, totalClosed, avgEfficiency, balanced, moderate, overloaded };
  }, [filteredAnalystWorkload]);

  // Get unique teams and locations
  const teams = useMemo(() => ['All Teams', ...new Set(analystWorkload.map(a => a.team))], []);
  const locations = useMemo(() => ['All Locations', ...new Set(analystWorkload.map(a => a.location))], []);

  // Get current risk distribution based on selected state and district
  const riskDistribution = useMemo(() => {
    return indiaRiskData[selectedState]?.[selectedDistrict] || [];
  }, [selectedState, selectedDistrict]);

  // Calculate total accounts for tooltip
  const totalAccountsInRegion = useMemo(() => {
    const totalValue = riskDistribution.reduce((sum, item) => sum + item.value, 0);
    return Math.round((184260 * totalValue) / 700); // Scaled approximation
  }, [riskDistribution]);

  // Get available districts for selected state
  const availableDistricts = useMemo(() => {
    return Object.keys(indiaRiskData[selectedState] || {});
  }, [selectedState]);

  const totalCaseStatus = useMemo(
    () => caseStatusData.reduce((accumulator, item) => accumulator + item.value, 0),
    []
  );

  const caseStatusGradient = useMemo(() => {
    let runningPercent = 0;
    const segments = caseStatusData.map((item) => {
      const start = runningPercent;
      const width = (item.value / totalCaseStatus) * 100;
      runningPercent += width;
      return `${item.color} ${start}% ${runningPercent}%`;
    });
    return `conic-gradient(${segments.join(', ')})`;
  }, [totalCaseStatus]);

  const trendSeries = caseTrendData[selectedTrend];

  const trendMax = useMemo(() => {
    return Math.max(...trendSeries.map((item) => Math.max(item.newCases, item.closedCases, item.escalations)));
  }, [trendSeries]);

  const getLinePoints = (key) => {
    return trendSeries
      .map((point, index) => {
        const x = trendSeries.length === 1 ? 50 : (index / (trendSeries.length - 1)) * 100;
        const y = 100 - (point[key] / trendMax) * 100;
        return `${x},${y}`;
      })
      .join(' ');
  };

  const trendInsights = useMemo(() => {
    const totalNew = trendSeries.reduce((sum, point) => sum + point.newCases, 0);
    const totalClosed = trendSeries.reduce((sum, point) => sum + point.closedCases, 0);
    const backlogDelta = totalNew - totalClosed;
    const escalationDelta =
      trendSeries[trendSeries.length - 1].escalations - trendSeries[0].escalations;

    return [
      {
        label: 'Are analysts keeping up?',
        value: totalClosed >= totalNew ? 'Yes, closure pace is healthy' : 'No, new intake is outpacing closures'
      },
      {
        label: 'Is backlog growing?',
        value: backlogDelta > 0 ? `Yes, backlog +${backlogDelta}` : `No, backlog reduced ${Math.abs(backlogDelta)}`
      },
      {
        label: 'Is risk increasing?',
        value: escalationDelta > 0 ? `Yes, escalations up by ${escalationDelta}` : 'No, escalation trend is stable'
      }
    ];
  }, [trendSeries]);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h3>Executive Overview</h3>
        <p>Real-time AML posture with mule account concentration and risk spread analysis.</p>
      </div>

      <section className="kpi-grid">
        {kpiMetrics.map((metric) => (
          <article key={metric.label} className="admin-card kpi-card">
            <p className="kpi-label">{metric.label}</p>
            <p className="kpi-value">{metric.value}</p>
            <p className="kpi-delta">{metric.delta}</p>
          </article>
        ))}
      </section>

      <section className="dashboard-grid">
        <article className="admin-card chart-card">
          <div className="card-head card-head-responsive">
            <h4>Risk Score Distribution</h4>
            <div className="filter-group">
              <select 
                className="state-filter" 
                value={selectedState} 
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  const newDistricts = Object.keys(indiaRiskData[e.target.value] || {});
                  setSelectedDistrict(newDistricts[0] || '');
                }}
              >
                {Object.keys(indiaRiskData).map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              <select 
                className="district-filter" 
                value={selectedDistrict} 
                onChange={(e) => setSelectedDistrict(e.target.value)}
              >
                {availableDistricts.map((district) => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
              <button 
                className="analyst-view-btn" 
                onClick={handleNavigateToAnalyst}
                title="Open Analyst Dashboard with selected region"
              >
                View in Analyst Dashboard →
              </button>
            </div>
          </div>
          <div className="bar-chart">
            {riskDistribution.map((bar) => {
              const accountCount = Math.round((bar.value / 100) * totalAccountsInRegion);
              const tooltipText = `Score ${bar.band}: ${bar.value}% (${accountCount.toLocaleString()} accounts)`;
              return (
                <div key={bar.band} className="bar-item" data-tooltip={tooltipText}>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ height: `${bar.value}%` }} />
                  </div>
                  <p>{bar.band}</p>
                </div>
              );
            })}
          </div>
        </article>

        <article className="admin-card chart-card analyst-summary-card">
          <div className="card-head">
            <h4>Analyst Workload Status</h4>
            <Link to="/admin/user-management" className="view-full-link">View Full Dashboard →</Link>
          </div>
          <div className="analyst-status-grid">
            <div className="status-card balanced-card">
              <div className="status-icon">🟢</div>
              <div className="status-info">
                <span className="status-count">{analystSummary.balanced}</span>
                <span className="status-label">Balanced</span>
              </div>
            </div>
            <div className="status-card moderate-card">
              <div className="status-icon">🟡</div>
              <div className="status-info">
                <span className="status-count">{analystSummary.moderate}</span>
                <span className="status-label">Moderate Load</span>
              </div>
            </div>
            <div className="status-card overloaded-card">
              <div className="status-icon">🔴</div>
              <div className="status-info">
                <span className="status-count">{analystSummary.overloaded}</span>
                <span className="status-label">Overloaded</span>
              </div>
            </div>
          </div>
          {analystSummary.overloaded > 0 && (
            <div className="alert-section">
              <div className="alert-header">
                <span className="alert-icon">⚠️</span>
                <span className="alert-title">Attention Required</span>
              </div>
              <div className="overloaded-analysts-list">
                {analystWorkload
                  .filter(a => a.statusClass === 'overloaded')
                  .slice(0, 2)
                  .map(analyst => (
                    <div key={analyst.id} className="overloaded-analyst-item">
                      <span className="analyst-name-small">{analyst.analyst}</span>
                      <span className="analyst-cases-badge">{analyst.openCases} cases</span>
                      <span className="analyst-high-risk-badge">{analyst.highRisk} high risk</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </article>

        <article className="admin-card chart-card case-status-card span-two">
          <div className="card-head">
            <h4>Case Status Overview</h4>
            <span>Case Distribution</span>
          </div>
          <div className="case-status-layout">
            <div className="case-donut-panel">
              <div className="case-donut" style={{ background: caseStatusGradient }}>
                <div className="case-donut-center">
                  <strong>{totalCaseStatus}</strong>
                  <span>Total Cases</span>
                </div>
              </div>
              <div className="case-segment-bar">
                {caseStatusData.map((item) => (
                  <span
                    key={item.label}
                    style={{
                      width: `${(item.value / totalCaseStatus) * 100}%`,
                      backgroundColor: item.color
                    }}
                    title={`${item.label}: ${item.value}`}
                  />
                ))}
              </div>
            </div>

            <ul className="case-status-list">
              {caseStatusData.map((item) => (
                <li key={item.label}>
                  <div className="case-status-meta">
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                  <div className="geo-track case-track">
                    <div
                      className="geo-fill case-fill"
                      style={{
                        width: `${(item.value / totalCaseStatus) * 100}%`,
                        background: item.color
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </article>

        <article className="admin-card chart-card">
          <div className="card-head">
            <h4>Geo-risk Map</h4>
            <span>Location Index</span>
          </div>
          <ul className="geo-list">
            {geoRiskIndex.map((geo) => (
              <li key={geo.location}>
                <div className="geo-meta">
                  <p>{geo.location}</p>
                  <span>{geo.score}</span>
                </div>
                <div className="geo-track">
                  <div className="geo-fill" style={{ width: `${geo.score}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </article>

        <article className="admin-card chart-card">
          <div className="card-head card-head-responsive">
            <h4>Case Trend Timeline</h4>
            <div className="timeline-toggle" role="group" aria-label="Case trend range">
              {trendOptions.map((option) => (
                <button
                  key={option}
                  className={`timeline-toggle-btn${selectedTrend === option ? ' active' : ''}`}
                  onClick={() => setSelectedTrend(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          <p className="timeline-subtitle">Case Volume Over Time</p>
          <div className="timeline-legend">
            <span><i className="legend-bar" />New Cases (bar)</span>
          </div>

          <div className="timeline-chart">
            <div className="timeline-bars">
              {trendSeries.map((point) => (
                <div key={point.label} className="timeline-column">
                  <div className="timeline-bar-track">
                    <div
                      className="timeline-bar"
                      style={{ height: `${(point.newCases / trendMax) * 100}%` }}
                    />
                  </div>
                  <span>{point.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="timeline-insights">
            {trendInsights.map((insight) => (
              <article key={insight.label}>
                <h5>{insight.label}</h5>
                <p>{insight.value}</p>
              </article>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
};

export default AdminOverview;
