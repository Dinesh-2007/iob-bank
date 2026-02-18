import { useMemo, useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import './Dashboard.css';

const SIDEBAR_ITEMS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'alerts', label: 'Alerts' },
  { id: 'accounts', label: 'Accounts' },
  { id: 'transactions', label: 'Transactions' },
  { id: 'network', label: 'Network Analysis' },
  { id: 'investigations', label: 'Investigations' },
  { id: 'reports', label: 'Reports' }
];

const DATE_RANGE_OPTIONS = [
  { value: '7d', label: 'Last 7 Days', days: 7 },
  { value: '30d', label: 'Last 30 Days', days: 30 },
  { value: '90d', label: 'Last 90 Days', days: 90 }
];

const ALERT_TYPES = [
  'Cash Structuring',
  'Rapid In-Out',
  'Mule Funnel',
  'Dormant Reactivation',
  'Round Amount Spike',
  'High-Risk Counterparty'
];

const ALERT_STATUSES = ['Open', 'In Review', 'Escalated', 'Closed'];
const GEO_RISK_LEVELS = ['Low', 'Medium', 'High', 'Critical'];
const ONBOARDING_CHANNELS = ['Branch', 'Mobile App', 'Internet Banking', 'RM Desk', 'Corporate Desk'];
const PATTERN_TAGS = ['Rapid In-Out', 'Funnel Behavior', 'Round Amount', 'Smurfing', 'Dormant Reactivation'];
const CASE_STATUSES = ['Open', 'In Progress', 'Escalated', 'STR Filed', 'Closed'];
const DECISION_OPTIONS = ['Escalate', 'Freeze', 'Request KYC', 'File STR', 'Close Case'];
const REPORT_PERIODS = ['Today', 'This Week', 'This Month', 'This Quarter'];

const INDIA_STATE_DISTRICTS = {
  'Andaman and Nicobar Islands': ['South Andaman', 'Nicobar', 'North and Middle Andaman'],
  'Andhra Pradesh': ['Visakhapatnam', 'East Godavari', 'West Godavari', 'Krishna', 'Guntur', 'Prakasam', 'Nellore', 'Chittoor', 'Kadapa', 'Anantapur', 'Kurnool', 'Srikakulam', 'Vizianagaram'],
  'Arunachal Pradesh': ['Tawang', 'West Kameng', 'East Kameng', 'Papum Pare', 'Kurung Kumey', 'Kra Daadi', 'Lower Subansiri', 'Upper Subansiri', 'West Siang', 'East Siang', 'Siang', 'Upper Siang', 'Lower Siang', 'Lower Dibang Valley', 'Dibang Valley', 'Anjaw', 'Lohit', 'Namsai', 'Changlang', 'Tirap', 'Longding'],
  Assam: ['Kamrup Metropolitan', 'Kamrup', 'Nalbari', 'Barpeta', 'Darrang', 'Udalguri', 'Sonitpur', 'Lakhimpur', 'Dhemaji', 'Tinsukia', 'Dibrugarh', 'Sivasagar', 'Jorhat', 'Golaghat', 'Karbi Anglong', 'Dima Hasao', 'Cachar', 'Karimganj', 'Hailakandi', 'Kokrajhar', 'Chirang', 'Bongaigaon', 'Goalpara', 'Dhubri', 'South Salmara-Mankachar', 'Morigaon', 'Nagaon', 'Hojai', 'Karbi Anglong West', 'Bajali', 'Baksa', 'Tamulpur', 'Majuli', 'Biswanath', 'Charaideo'],
  Bihar: ['Patna', 'Nalanda', 'Bhojpur', 'Rohtas', 'Kaimur', 'Buxar', 'Gaya', 'Jehanabad', 'Arwal', 'Aurangabad', 'Nawada', 'Jamui', 'Munger', 'Lakhisarai', 'Sheikhpura', 'Begusarai', 'Khagaria', 'Bhagalpur', 'Banka', 'Saharsa', 'Madhepura', 'Supaul', 'Araria', 'Purnia', 'Katihar', 'Kishanganj', 'Muzaffarpur', 'Vaishali', 'Saran', 'Siwan', 'Gopalganj', 'East Champaran', 'West Champaran', 'Sitamarhi', 'Sheohar', 'Madhubani', 'Darbhanga', 'Samastipur'],
  Chandigarh: ['Chandigarh'],
  Chhattisgarh: ['Raipur', 'Durg', 'Rajnandgaon', 'Balod', 'Baloda Bazar', 'Bemetara', 'Bilaspur', 'Korba', 'Janjgir-Champa', 'Raigarh', 'Jashpur', 'Surguja', 'Surajpur', 'Balrampur', 'Korea', 'Dantewada', 'Bastar', 'Kondagaon', 'Narayanpur', 'Kanker', 'Kabirdham', 'Mungeli', 'Gariaband', 'Mahasamund', 'Dhamtari', 'Sukma', 'Bijapur'],
  'Dadra and Nagar Haveli and Daman and Diu': ['Dadra and Nagar Haveli', 'Daman', 'Diu'],
  Delhi: ['Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi', 'North East Delhi', 'North West Delhi', 'Shahdara', 'South Delhi', 'South East Delhi', 'South West Delhi', 'West Delhi'],
  Goa: ['North Goa', 'South Goa'],
  Gujarat: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Kutch', 'Gandhinagar', 'Mehsana', 'Patan', 'Banaskantha', 'Sabarkantha', 'Aravalli', 'Mahisagar', 'Panchmahal', 'Dahod', 'Kheda', 'Anand', 'Narmada', 'Bharuch', 'Tapi', 'Navsari', 'Valsad', 'Dang', 'Amreli', 'Gir Somnath', 'Porbandar', 'Devbhumi Dwarka', 'Morbi', 'Surendranagar', 'Botad'],
  Haryana: ['Gurugram', 'Faridabad', 'Palwal', 'Nuh', 'Rewari', 'Mahendragarh', 'Bhiwani', 'Charkhi Dadri', 'Rohtak', 'Jhajjar', 'Sonipat', 'Panipat', 'Karnal', 'Kaithal', 'Kurukshetra', 'Yamunanagar', 'Ambala', 'Panchkula', 'Hisar', 'Fatehabad', 'Sirsa', 'Jind'],
  'Himachal Pradesh': ['Shimla', 'Solan', 'Sirmaur', 'Una', 'Hamirpur', 'Kangra', 'Mandi', 'Bilaspur', 'Kullu', 'Chamba', 'Kinnaur', 'Lahaul and Spiti'],
  'Jammu and Kashmir': ['Srinagar', 'Ganderbal', 'Budgam', 'Anantnag', 'Kulgam', 'Pulwama', 'Shopian', 'Baramulla', 'Bandipora', 'Kupwara', 'Jammu', 'Samba', 'Kathua', 'Udhampur', 'Reasi', 'Rajouri', 'Poonch', 'Doda', 'Ramban', 'Kishtwar'],
  Jharkhand: ['Ranchi', 'Lohardaga', 'Gumla', 'Simdega', 'Khunti', 'West Singhbhum', 'Saraikela Kharsawan', 'East Singhbhum', 'Bokaro', 'Dhanbad', 'Giridih', 'Hazaribagh', 'Chatra', 'Koderma', 'Ramgarh', 'Dumka', 'Jamtara', 'Deoghar', 'Godda', 'Sahibganj', 'Pakur', 'Palamu', 'Latehar', 'Garhwa'],
  Karnataka: ['Bengaluru Urban', 'Bengaluru Rural', 'Ramanagara', 'Mandya', 'Mysuru', 'Chamarajanagar', 'Hassan', 'Chikkamagaluru', 'Kodagu', 'Tumkur', 'Chitradurga', 'Davanagere', 'Shivamogga', 'Udupi', 'Dakshina Kannada', 'Uttara Kannada', 'Belagavi', 'Vijayapura', 'Bagalkot', 'Dharwad', 'Gadag', 'Haveri', 'Kalaburagi', 'Bidar', 'Yadgir', 'Raichur', 'Ballari', 'Koppal', 'Kolar', 'Chikkaballapura', 'Vijayanagara'],
  Kerala: ['Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha', 'Kottayam', 'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad', 'Malappuram', 'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod'],
  Ladakh: ['Leh', 'Kargil'],
  Lakshadweep: ['Lakshadweep'],
  'Madhya Pradesh': ['Bhopal', 'Sehore', 'Raisen', 'Rajgarh', 'Vidisha', 'Indore', 'Dhar', 'Khargone', 'Barwani', 'Jhabua', 'Alirajpur', 'Ujjain', 'Ratlam', 'Mandsaur', 'Neemuch', 'Dewas', 'Shajapur', 'Agar Malwa', 'Gwalior', 'Shivpuri', 'Guna', 'Ashoknagar', 'Datia', 'Bhind', 'Morena', 'Sheopur', 'Jabalpur', 'Narsinghpur', 'Katni', 'Chhindwara', 'Seoni', 'Mandla', 'Balaghat', 'Dindori', 'Sagar', 'Damoh', 'Panna', 'Chhatarpur', 'Tikamgarh', 'Niwari', 'Satna', 'Rewa', 'Umaria', 'Sidhi', 'Singrauli', 'Shahdol', 'Anuppur', 'Betul', 'Harda', 'Hoshangabad', 'Burhanpur', 'Khandwa'],
  Maharashtra: ['Mumbai City', 'Mumbai Suburban', 'Thane', 'Palghar', 'Raigad', 'Ratnagiri', 'Sindhudurg', 'Pune', 'Satara', 'Sangli', 'Kolhapur', 'Solapur', 'Nashik', 'Dhule', 'Nandurbar', 'Jalgaon', 'Ahmednagar', 'Aurangabad', 'Jalna', 'Beed', 'Latur', 'Osmanabad', 'Parbhani', 'Hingoli', 'Nanded', 'Akola', 'Washim', 'Amravati', 'Buldhana', 'Yavatmal', 'Wardha', 'Nagpur', 'Bhandara', 'Gondia', 'Chandrapur', 'Gadchiroli'],
  Manipur: ['Imphal West', 'Imphal East', 'Bishnupur', 'Thoubal', 'Kakching', 'Ukhrul', 'Chandel', 'Tengnoupal', 'Churachandpur', 'Pherzawl', 'Kangpokpi', 'Jiribam', 'Tamenglong', 'Noney', 'Senapati', 'Kamjong'],
  Meghalaya: ['East Khasi Hills', 'West Khasi Hills', 'South West Khasi Hills', 'Eastern West Khasi Hills', 'Ri Bhoi', 'West Garo Hills', 'East Garo Hills', 'North Garo Hills', 'South Garo Hills', 'South West Garo Hills', 'West Jaintia Hills', 'East Jaintia Hills'],
  Mizoram: ['Aizawl', 'Lunglei', 'Champhai', 'Serchhip', 'Kolasib', 'Lawngtlai', 'Mamit', 'Saiha', 'Hnahthial', 'Saitual', 'Khawzawl'],
  Nagaland: ['Kohima', 'Dimapur', 'Peren', 'Phek', 'Wokha', 'Zunheboto', 'Mon', 'Tuensang', 'Longleng', 'Kiphire', 'Mokokchung', 'Noklak'],
  Odisha: ['Khordha', 'Cuttack', 'Jagatsinghpur', 'Puri', 'Nayagarh', 'Ganjam', 'Gajapati', 'Kandhamal', 'Boudh', 'Kalahandi', 'Rayagada', 'Nabarangpur', 'Koraput', 'Malkangiri', 'Balangir', 'Nuapada', 'Subarnapur', 'Bargarh', 'Jharsuguda', 'Sambalpur', 'Debagarh', 'Sundargarh', 'Kendrapara', 'Jajpur', 'Bhadrak', 'Balasore', 'Mayurbhanj', 'Keonjhar', 'Dhenkanal', 'Angul'],
  Puducherry: ['Puducherry', 'Karaikal', 'Mahe', 'Yanam'],
  Punjab: ['Amritsar', 'Tarn Taran', 'Pathankot', 'Gurdaspur', 'Batala', 'Kapurthala', 'Jalandhar', 'Hoshiarpur', 'Nawanshahr', 'Rupnagar', 'Mohali', 'Ludhiana', 'Firozpur', 'Fazilka', 'Faridkot', 'Muktsar', 'Moga', 'Bathinda', 'Mansa', 'Sangrur', 'Barnala', 'Patiala', 'Fatehgarh Sahib', 'Malerkotla'],
  Rajasthan: ['Jaipur', 'Sikar', 'Jhunjhunu', 'Alwar', 'Bharatpur', 'Dholpur', 'Karauli', 'Dausa', 'Sawai Madhopur', 'Tonk', 'Ajmer', 'Nagaur', 'Bikaner', 'Churu', 'Hanumangarh', 'Sri Ganganagar', 'Jodhpur', 'Jaisalmer', 'Barmer', 'Jalore', 'Sirohi', 'Pali', 'Udaipur', 'Rajsamand', 'Dungarpur', 'Banswara', 'Chittorgarh', 'Pratapgarh', 'Bhilwara', 'Bundi', 'Kota', 'Baran', 'Jhalawar'],
  Sikkim: ['East Sikkim', 'West Sikkim', 'North Sikkim', 'South Sikkim', 'Pakyong', 'Soreng'],
  'Tamil Nadu': ['Chennai', 'Tiruvallur', 'Kanchipuram', 'Chengalpattu', 'Vellore', 'Ranipet', 'Tirupathur', 'Tiruvannamalai', 'Villupuram', 'Kallakurichi', 'Cuddalore', 'Salem', 'Namakkal', 'Dharmapuri', 'Krishnagiri', 'Erode', 'Tiruppur', 'Coimbatore', 'Nilgiris', 'Karur', 'Tiruchirappalli', 'Perambalur', 'Ariyalur', 'Thanjavur', 'Tiruvarur', 'Nagapattinam', 'Pudukkottai', 'Madurai', 'Theni', 'Dindigul', 'Ramanathapuram', 'Sivaganga', 'Virudhunagar', 'Thoothukudi', 'Tirunelveli', 'Tenkasi', 'Kanyakumari'],
  Telangana: ['Hyderabad', 'Ranga Reddy', 'Medchal-Malkajgiri', 'Vikarabad', 'Sangareddy', 'Medak', 'Kamareddy', 'Nizamabad', 'Jagitial', 'Peddapalli', 'Karimnagar', 'Rajanna Sircilla', 'Warangal Urban', 'Warangal Rural', 'Jangaon', 'Jayashankar', 'Mahabubabad', 'Hanumakonda', 'Siddipet', 'Yadadri Bhuvanagiri', 'Suryapet', 'Khammam', 'Bhadradri Kothagudem', 'Nalgonda', 'Nagarkurnool', 'Wanaparthy', 'Mahbubnagar', 'Jogulamba Gadwal', 'Adilabad', 'Kumuram Bheem', 'Mancherial', 'Nirmal', 'Asifabad'],
  Tripura: ['West Tripura', 'South Tripura', 'Dhalai', 'North Tripura', 'Khowai', 'Gomati', 'Sepahijala', 'Unakoti'],
  'Uttar Pradesh': ['Lucknow', 'Unnao', 'Rae Bareli', 'Hardoi', 'Lakhimpur Kheri', 'Sitapur', 'Kanpur Nagar', 'Kanpur Dehat', 'Jalaun', 'Jhansi', 'Lalitpur', 'Hamirpur', 'Mahoba', 'Banda', 'Chitrakoot', 'Fatehpur', 'Pratapgarh', 'Kaushambi', 'Prayagraj', 'Varanasi', 'Chandauli', 'Ghazipur', 'Jaunpur', 'Azamgarh', 'Mau', 'Ballia', 'Mirzapur', 'Sonbhadra', 'Bhadohi', 'Gorakhpur', 'Kushinagar', 'Deoria', 'Maharajganj', 'Sant Kabir Nagar', 'Basti', 'Siddharthnagar', 'Faizabad', 'Ambedkar Nagar', 'Sultanpur', 'Bahraich', 'Shrawasti', 'Balrampur', 'Gonda', 'Bareilly', 'Pilibhit', 'Shahjahanpur', 'Budaun', 'Moradabad', 'Rampur', 'Bijnor', 'Sambhal', 'Amroha', 'Meerut', 'Baghpat', 'Ghaziabad', 'Gautam Buddha Nagar', 'Hapur', 'Bulandshahr', 'Aligarh', 'Hathras', 'Mathura', 'Agra', 'Firozabad', 'Mainpuri', 'Etah', 'Kasganj', 'Etawah', 'Auraiya', 'Farrukhabad', 'Kannauj', 'Saharanpur', 'Muzaffarnagar', 'Shamli', 'Mathura'],
  Uttarakhand: ['Dehradun', 'Haridwar', 'Tehri Garhwal', 'Uttarkashi', 'Chamoli', 'Rudraprayag', 'Pauri Garhwal', 'Almora', 'Bageshwar', 'Champawat', 'Nainital', 'Pithoragarh', 'Udham Singh Nagar'],
  'West Bengal': ['Kolkata', 'Howrah', 'Hooghly', 'North 24 Parganas', 'South 24 Parganas', 'Purba Medinipur', 'Paschim Medinipur', 'Jhargram', 'Purba Bardhaman', 'Paschim Bardhaman', 'Nadia', 'Murshidabad', 'Birbhum', 'Bankura', 'Purulia', 'Darjeeling', 'Kalimpong', 'Jalpaiguri', 'Alipurduar', 'Cooch Behar', 'Uttar Dinajpur', 'Dakshin Dinajpur', 'Malda']
};

const FIRST_NAMES = [
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

const LAST_NAMES = ['Kumar', 'Sharma', 'Patel', 'Reddy', 'Singh', 'Desai', 'Iyer', 'Gupta', 'Mehta', 'Nair'];

const numberFormatter = new Intl.NumberFormat('en-IN');
const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
});

const hashSeed = (value) => {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = ((hash << 5) - hash + value.charCodeAt(index)) >>> 0;
  }
  return hash;
};

const seededNumber = (seed, min, max) => min + (hashSeed(seed) % (max - min + 1));
const seededBoolean = (seed, truthyPercent = 50) => seededNumber(seed, 1, 100) <= truthyPercent;

const toCode = (value) =>
  value
    .split(/[\s-]+/)
    .map((token) => token[0] || '')
    .join('')
    .replace(/[^a-zA-Z]/g, '')
    .toUpperCase()
    .slice(0, 3);

const getRangeDays = (rangeValue) => DATE_RANGE_OPTIONS.find((option) => option.value === rangeValue)?.days || 30;

const formatDateTime = (dateValue) =>
  dateValue.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

const isSameDate = (leftDate, rightDate) =>
  leftDate.getFullYear() === rightDate.getFullYear() &&
  leftDate.getMonth() === rightDate.getMonth() &&
  leftDate.getDate() === rightDate.getDate();

const getRiskBand = (score) => {
  if (score >= 85) return 'Critical';
  if (score >= 70) return 'High';
  if (score >= 40) return 'Medium';
  return 'Low';
};

const buildAnalystData = (state, district, rangeValue) => {
  // Handle "All Districts" by aggregating data from all districts in the state
  const districts = district === 'All Districts' ? INDIA_STATE_DISTRICTS[state] || [] : [district];
  
  if (districts.length === 0) {
    return { accounts: [], alerts: [], transactions: [], clusters: [], investigations: [] };
  }
  
  // Aggregate data from all districts
  const allData = districts.map(dist => buildSingleDistrictData(state, dist, rangeValue));
  
  return {
    accounts: allData.flatMap(d => d.accounts),
    alerts: allData.flatMap(d => d.alerts).sort((left, right) => right.createdAt - left.createdAt),
    transactions: allData.flatMap(d => d.transactions).sort((left, right) => right.createdAt - left.createdAt),
    clusters: allData.flatMap(d => d.clusters),
    investigations: allData.flatMap(d => d.investigations).sort((left, right) => right.riskScore - left.riskScore)
  };
};

const buildSingleDistrictData = (state, district, rangeValue) => {
  const seed = `${state}|${district}|${rangeValue}`;
  const now = new Date();
  const windowDays = getRangeDays(rangeValue);
  
  // Add district-specific characteristics for realistic variation
  const districtRiskProfile = seededNumber(`${seed}|district-risk`, 30, 90);
  const districtActivityLevel = seededNumber(`${seed}|activity-level`, 40, 95);
  
  // Vary account count by district (12-40 accounts for diversity)
  // Higher activity districts have more accounts
  const accountCountMin = districtActivityLevel > 70 ? 25 : districtActivityLevel > 50 ? 18 : 12;
  const accountCountMax = districtActivityLevel > 70 ? 45 : districtActivityLevel > 50 ? 35 : 30;
  const accountCount = seededNumber(`${seed}|accounts`, accountCountMin, accountCountMax);

  const accounts = Array.from({ length: accountCount }, (_, index) => {
    const accountId = `AC-${toCode(state)}-${toCode(district)}-${String(index + 1).padStart(4, '0')}`;
    
    // Higher risk districts have higher baseline risk scores
    const riskMin = districtRiskProfile > 70 ? 45 : districtRiskProfile > 50 ? 35 : 28;
    const riskScore = seededNumber(`${seed}|account-risk|${index}`, riskMin, 97);
    
    // Higher activity districts have larger transaction volumes
    const volumeMultiplier = districtActivityLevel > 70 ? 2 : districtActivityLevel > 50 ? 1.5 : 1;
    const inflow = Math.round(seededNumber(`${seed}|inflow|${index}`, 280000, 6200000) * volumeMultiplier);
    const outflow = Math.round(seededNumber(`${seed}|outflow|${index}`, 240000, 5900000) * volumeMultiplier);

    return {
      accountId,
      holderName: `${FIRST_NAMES[index % FIRST_NAMES.length]} ${LAST_NAMES[seededNumber(`${seed}|last|${index}`, 0, LAST_NAMES.length - 1)]}`,
      riskScore,
      kycLevel: riskScore > 80 ? 'Enhanced KYC' : riskScore > 60 ? 'Full KYC' : 'Standard KYC',
      accountAgeMonths: seededNumber(`${seed}|age|${index}`, 2, 120),
      onboardingChannel: ONBOARDING_CHANNELS[seededNumber(`${seed}|channel|${index}`, 0, ONBOARDING_CHANNELS.length - 1)],
      riskIndicators: {
        rapidMovement: seededBoolean(`${seed}|rapid|${index}`, riskScore > 75 ? 70 : 26),
        structuringPattern: seededBoolean(`${seed}|struct|${index}`, riskScore > 80 ? 65 : 22),
        dormantReactivation: seededBoolean(`${seed}|dormant|${index}`, 24),
        deviceSharing: seededBoolean(`${seed}|device|${index}`, riskScore > 70 ? 60 : 18),
        geoMismatch: seededBoolean(`${seed}|geo|${index}`, riskScore > 68 ? 56 : 20)
      },
      transactionSummary: {
        totalInflow: inflow,
        totalOutflow: outflow,
        velocity: seededNumber(`${seed}|velocity|${index}`, 2, 24),
        avgTransactionAmount: Math.round((inflow + outflow) / seededNumber(`${seed}|avg|${index}`, 30, 140))
      }
    };
  });

  // Vary alert count by district activity level (15-100 alerts for diversity)
  // Higher activity districts generate more alerts
  const alertCountMin = districtActivityLevel > 70 ? 50 : districtActivityLevel > 50 ? 30 : 15;
  const alertCountMax = districtActivityLevel > 70 ? 100 : districtActivityLevel > 50 ? 70 : 50;
  const alertCount = seededNumber(`${seed}|alerts`, alertCountMin, alertCountMax);
  
  const alerts = Array.from({ length: alertCount }, (_, index) => {
    const account = accounts[seededNumber(`${seed}|alert-account|${index}`, 0, accounts.length - 1)];
    
    // Higher risk districts have higher baseline risk scores
    const riskMin = districtRiskProfile > 70 ? 50 : districtRiskProfile > 50 ? 40 : 35;
    const riskScore = seededNumber(`${seed}|alert-risk|${index}`, riskMin, 99);
    
    const createdAt = new Date(
      now.getTime() - seededNumber(`${seed}|alert-hours|${index}`, 0, windowDays * 24 - 1) * 60 * 60 * 1000
    );
    
    // Higher risk districts tend to have larger transaction amounts
    const amountMultiplier = districtRiskProfile > 70 ? 2.5 : districtRiskProfile > 50 ? 1.5 : 1;
    const baseAmount = seededNumber(`${seed}|amount|${index}`, 12000, 940000);
    const amount = Math.round(baseAmount * amountMultiplier);

    return {
      alertId: `ALT-${toCode(state)}-${toCode(district)}-${String(index + 1).padStart(4, '0')}`,
      accountId: account.accountId,
      riskScore,
      alertType: ALERT_TYPES[seededNumber(`${seed}|alert-type|${index}`, 0, ALERT_TYPES.length - 1)],
      clusterId: `CL-${toCode(state)}-${String(seededNumber(`${seed}|cluster|${index}`, 101, 899))}`,
      triggeredRule: `RULE-${String(seededNumber(`${seed}|rule|${index}`, 100, 499))}`,
      amount,
      clusterSize: seededNumber(`${seed}|cluster-size|${index}`, 2, 18),
      sharedDeviceFlag: account.riskIndicators.deviceSharing || seededBoolean(`${seed}|shared-device|${index}`, 35),
      geoRisk: riskScore >= 86 ? 'Critical' : riskScore >= 70 ? 'High' : riskScore >= 50 ? 'Medium' : 'Low',
      createdAt,
      status: riskScore > 92 ? 'Escalated' : riskScore < 42 ? 'Closed' : ALERT_STATUSES[seededNumber(`${seed}|status|${index}`, 0, ALERT_STATUSES.length - 1)]
    };
  }).sort((left, right) => right.createdAt - left.createdAt);

  // Vary transaction count by district activity level (30-180 transactions for diversity)
  // Higher activity districts have more transactions
  const txnCountMin = districtActivityLevel > 70 ? 80 : districtActivityLevel > 50 ? 50 : 30;
  const txnCountMax = districtActivityLevel > 70 ? 180 : districtActivityLevel > 50 ? 120 : 80;
  const transactionCount = seededNumber(`${seed}|transactions`, txnCountMin, txnCountMax);
  
  const transactions = Array.from({ length: transactionCount }, (_, index) => {
    const fromIndex = seededNumber(`${seed}|from|${index}`, 0, accounts.length - 1);
    let toIndex = seededNumber(`${seed}|to|${index}`, 0, accounts.length - 1);
    if (toIndex === fromIndex) toIndex = (toIndex + 1) % accounts.length;
    
    // Higher risk/activity districts have larger transaction amounts
    const txnMultiplier = Math.max(districtRiskProfile, districtActivityLevel) > 70 ? 2.2 : Math.max(districtRiskProfile, districtActivityLevel) > 50 ? 1.6 : 1;
    const baseAmount = seededNumber(`${seed}|txn-amount|${index}`, 5000, 760000);
    const amount = Math.round(baseAmount * txnMultiplier);

    return {
      transactionId: `TXN-${toCode(state)}-${String(index + 1).padStart(5, '0')}`,
      fromAccount: accounts[fromIndex].accountId,
      toAccount: accounts[toIndex].accountId,
      amount,
      direction: seededBoolean(`${seed}|dir|${index}`, 50) ? 'Inbound' : 'Outbound',
      patternTag: PATTERN_TAGS[seededNumber(`${seed}|pattern|${index}`, 0, PATTERN_TAGS.length - 1)],
      createdAt: new Date(
        now.getTime() - seededNumber(`${seed}|txn-minutes|${index}`, 0, windowDays * 24 * 60 - 1) * 60 * 1000
      )
    };
  }).sort((left, right) => right.createdAt - left.createdAt);

  // Vary cluster count by district activity level (3-20 clusters for diversity)
  // Higher activity districts have more network clusters
  const clusterCountMin = districtActivityLevel > 70 ? 10 : districtActivityLevel > 50 ? 6 : 3;
  const clusterCountMax = districtActivityLevel > 70 ? 20 : districtActivityLevel > 50 ? 15 : 10;
  const clusterCount = seededNumber(`${seed}|network`, clusterCountMin, clusterCountMax);
  
  const clusters = Array.from({ length: clusterCount }, (_, index) => {
    const clusterSize = seededNumber(`${seed}|network-size|${index}`, 3, 13);
    const start = seededNumber(`${seed}|start|${index}`, 0, accounts.length - 1);
    const members = Array.from({ length: clusterSize }, (_, offset) => accounts[(start + offset) % accounts.length].accountId);
    
    // Higher risk districts have higher average risk in clusters
    const avgRiskMin = districtRiskProfile > 70 ? 55 : districtRiskProfile > 50 ? 48 : 42;
    const avgRisk = seededNumber(`${seed}|avg-risk|${index}`, avgRiskMin, 95);

    return {
      clusterId: `CL-${toCode(state)}-${String(index + 1).padStart(3, '0')}`,
      clusterSize,
      avgRisk,
      sharedDeviceCount: seededNumber(`${seed}|shared-count|${index}`, 0, clusterSize),
      sharedBeneficiary: seededBoolean(`${seed}|beneficiary|${index}`, 42),
      hubAccount: members[0],
      transitAccount: members[Math.min(1, members.length - 1)],
      controllerAccount: members[Math.min(2, members.length - 1)]
    };
  });

  // Generate cases based on district characteristics
  // Higher activity/risk districts have more cases (40-200 cases)
  // Each status-decision cycle is 25 cases; minimum 50 ensures 10+ of each combo
  const caseCountMin = Math.max(districtActivityLevel, districtRiskProfile) > 70 ? 100 : Math.max(districtActivityLevel, districtRiskProfile) > 50 ? 70 : 50;
  const caseCountMax = Math.max(districtActivityLevel, districtRiskProfile) > 70 ? 200 : Math.max(districtActivityLevel, districtRiskProfile) > 50 ? 140 : 100;
  const caseCount = seededNumber(`${seed}|casecount`, caseCountMin, caseCountMax);
  
  const investigations = Array.from({ length: caseCount }, (_, index) => {
    const cluster = clusters[seededNumber(`${seed}|case-cluster|${index}`, 0, clusters.length - 1)];
    const linkedAlertIds = alerts
      .slice(seededNumber(`${seed}|case-start|${index}`, 0, Math.max(0, alerts.length - 3)), seededNumber(`${seed}|case-start|${index}`, 0, Math.max(0, alerts.length - 3)) + 3)
      .map((alert) => alert.alertId);
    const openedAt = new Date(
      now.getTime() - seededNumber(`${seed}|opened|${index}`, 2, windowDays * 24 - 1) * 60 * 60 * 1000
    );
    
    // Add district-specific variation to SLA urgency
    // Some districts are more urgent than others based on seed
    const districtUrgency = seededNumber(`${seed}|urgency`, 0, 100);
    
    // Structured SLA distribution with district variation
    // 50% Breach Risk (<=8 hours), 50% Within SLA (>8 hours)
    let slaHoursRemaining;
    if (index % 2 === 0) {
      // Breach risk cases: <=8 hours remaining
      // More urgent districts have more negative hours
      if (districtUrgency > 70) {
        slaHoursRemaining = seededNumber(`${seed}|sla|${index}`, -10, 6);
      } else {
        slaHoursRemaining = seededNumber(`${seed}|sla|${index}`, -5, 8);
      }
    } else {
      // Within SLA cases: >8 hours remaining
      // Less urgent districts have more comfortable SLA
      if (districtUrgency < 30) {
        slaHoursRemaining = seededNumber(`${seed}|sla|${index}`, 15, 96);
      } else {
        slaHoursRemaining = seededNumber(`${seed}|sla|${index}`, 9, 72);
      }
    }
    
    // Vary risk score range by district for more diversity
    const riskScoreMin = seededNumber(`${seed}|riskmin`, 35, 50);
    const riskScore = seededNumber(`${seed}|case-risk|${index}`, riskScoreMin, 98);
    const patternType = PATTERN_TAGS[index % PATTERN_TAGS.length];

    // INTERLINKED EVIDENCE: Create transactions involving the network accounts
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

    // INTERLINKED DEVICES: Based on the accounts involved
    const hubDeviceId = `DV-${seededNumber(`${seed}|hub-device|${index}`, 10000, 89999)}`;
    const transitDeviceId = `DV-${seededNumber(`${seed}|transit-device|${index}`, 10000, 89999)}`;
    const controllerDeviceId = `DV-${seededNumber(`${seed}|ctrl-device|${index}`, 10000, 89999)}`;
    
    // Show device sharing pattern (key evidence of coordination)
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

    // INTERLINKED TIMELINE: Based on actual transaction times
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

    // INTERLINKED NOTES: Describe what actually happened
    const totalAmount = caseTransactions.reduce((sum, txn) => sum + txn.amount, 0);
    const deviceNote = sharedDevice 
      ? 'Hub and Transit accounts accessed from same device, indicating coordinated control.'
      : 'Multiple devices used, suggesting organized network activity.';
    
    const notes = `${patternType} pattern detected in ${cluster.clusterSize}-account network. ` +
      `Total flow: ${currencyFormatter.format(totalAmount)} across 4 transactions. ` +
      `Flow: ${cluster.hubAccount} → ${cluster.transitAccount} → ${cluster.controllerAccount} → back to Hub. ` +
      `${deviceNote} Risk Score: ${riskScore}/100. ${linkedAlertIds.length} linked alerts.`;

    // Ensure good distribution across all status types
    // CASE_STATUSES: ['Open', 'In Progress', 'Escalated', 'STR Filed', 'Closed']
    const statusIndex = index % CASE_STATUSES.length;
    const caseStatus = CASE_STATUSES[statusIndex];
    
    // Closed cases shouldn't have breach risk
    const finalSlaHours = caseStatus === 'Closed' ? Math.abs(slaHoursRemaining) : slaHoursRemaining;
    
    // Ensure distribution across all decision options
    // DECISION_OPTIONS: ['Escalate', 'Freeze', 'Request KYC', 'File STR', 'Close Case']
    // Cycle through all 5 decisions for each status group
    const decisionIndex = Math.floor(index / CASE_STATUSES.length) % DECISION_OPTIONS.length;
    const recommendedAction = DECISION_OPTIONS[decisionIndex];

    return {
      caseId: `CASE-${toCode(state)}-${String(index + 1).padStart(4, '0')}`,
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
  }).sort((left, right) => right.riskScore - left.riskScore);

  return { accounts, alerts, transactions, clusters, investigations };
};

const AMLAnalystDashboard = () => {
  const navigate = useNavigate();
  const { section } = useParams();
  const [searchParams] = useSearchParams();
  const stateOptions = useMemo(() => Object.keys(INDIA_STATE_DISTRICTS), []);

  const activeSection = section || 'dashboard';

  // Get initial values from URL params or defaults
  const urlState = searchParams.get('state');
  const urlDistrict = searchParams.get('district');
  const urlRange = searchParams.get('range');

  // Redirect to default section if on base URL
  useEffect(() => {
    if (!section) {
      navigate('/dashboard/analyst/dashboard', { replace: true });
    }
  }, [section, navigate]);
  
  const [selectedState, setSelectedState] = useState(urlState || 'Tamil Nadu');
  const [selectedDistrict, setSelectedDistrict] = useState(urlDistrict || 'Chennai');
  const [selectedRange, setSelectedRange] = useState(urlRange || '30d');

  const [alertFilters, setAlertFilters] = useState({
    riskMin: 0,
    riskMax: 100,
    alertType: 'All',
    minAmount: '',
    maxAmount: '',
    clusterMin: '',
    clusterMax: '',
    sharedDeviceFlag: 'All',
    geoRisk: 'All',
    status: 'All',
    dateWindow: 'All'
  });

  const [accountFilters, setAccountFilters] = useState({
    onboarding: 'All',
    riskBand: 'All',
    rapidMovement: 'All',
    deviceSharing: 'All'
  });

  const [transactionFilters, setTransactionFilters] = useState({
    patternTag: 'All',
    direction: 'All',
    minAmount: '',
    maxAmount: ''
  });

  const [networkFilters, setNetworkFilters] = useState({
    minClusterSize: 0,
    minAvgRisk: 0,
    sharedDeviceOnly: false
  });

  const [caseFilters, setCaseFilters] = useState({
    status: 'All',
    slaRisk: 'All',
    decision: 'All'
  });

  const [reportFilters, setReportFilters] = useState({
    reportType: 'All',
    period: 'This Week'
  });

  const [selectedAccountId, setSelectedAccountId] = useState('');

  const availableDistricts = useMemo(() => ['All Districts', ...(INDIA_STATE_DISTRICTS[selectedState] || [])], [selectedState]);
  const effectiveDistrict = availableDistricts.includes(selectedDistrict) ? selectedDistrict : availableDistricts[1] || 'All Districts';

  const analystData = useMemo(
    () => buildAnalystData(selectedState, effectiveDistrict, selectedRange),
    [effectiveDistrict, selectedRange, selectedState]
  );

  const { accounts, alerts, transactions, clusters, investigations } = analystData;

  const globalSummary = useMemo(
    () => ({
      alerts: alerts.length,
      accounts: accounts.length,
      transactions: transactions.length,
      investigations: investigations.length
    }),
    [accounts.length, alerts.length, investigations.length, transactions.length]
  );

  const filteredAlerts = useMemo(() => {
    const now = new Date();
    return alerts.filter((alert) => {
      if (alert.riskScore < Number(alertFilters.riskMin)) return false;
      if (alert.riskScore > Number(alertFilters.riskMax)) return false;
      if (alertFilters.alertType !== 'All' && alert.alertType !== alertFilters.alertType) return false;
      if (alertFilters.status !== 'All' && alert.status !== alertFilters.status) return false;
      if (alertFilters.geoRisk !== 'All' && alert.geoRisk !== alertFilters.geoRisk) return false;
      if (alertFilters.sharedDeviceFlag === 'Yes' && !alert.sharedDeviceFlag) return false;
      if (alertFilters.sharedDeviceFlag === 'No' && alert.sharedDeviceFlag) return false;
      if (alertFilters.minAmount && alert.amount < Number(alertFilters.minAmount)) return false;
      if (alertFilters.maxAmount && alert.amount > Number(alertFilters.maxAmount)) return false;
      if (alertFilters.clusterMin && alert.clusterSize < Number(alertFilters.clusterMin)) return false;
      if (alertFilters.clusterMax && alert.clusterSize > Number(alertFilters.clusterMax)) return false;

      if (alertFilters.dateWindow === 'Today' && !isSameDate(alert.createdAt, now)) return false;
      if (alertFilters.dateWindow === 'Last 7 Days') {
        const ageHours = (now.getTime() - alert.createdAt.getTime()) / (1000 * 60 * 60);
        if (ageHours > 24 * 7) return false;
      }
      if (alertFilters.dateWindow === 'Last 30 Days') {
        const ageHours = (now.getTime() - alert.createdAt.getTime()) / (1000 * 60 * 60);
        if (ageHours > 24 * 30) return false;
      }
      return true;
    });
  }, [alerts, alertFilters]);

  const filteredAccounts = useMemo(() => {
    return accounts.filter((account) => {
      if (accountFilters.onboarding !== 'All' && account.onboardingChannel !== accountFilters.onboarding) {
        return false;
      }
      if (accountFilters.riskBand !== 'All' && getRiskBand(account.riskScore) !== accountFilters.riskBand) {
        return false;
      }
      if (accountFilters.rapidMovement === 'Yes' && !account.riskIndicators.rapidMovement) return false;
      if (accountFilters.rapidMovement === 'No' && account.riskIndicators.rapidMovement) return false;
      if (accountFilters.deviceSharing === 'Yes' && !account.riskIndicators.deviceSharing) return false;
      if (accountFilters.deviceSharing === 'No' && account.riskIndicators.deviceSharing) return false;
      return true;
    });
  }, [accountFilters, accounts]);

  const activeAccountId = filteredAccounts.some((account) => account.accountId === selectedAccountId)
    ? selectedAccountId
    : filteredAccounts[0]?.accountId || '';

  const selectedAccount = useMemo(
    () => filteredAccounts.find((account) => account.accountId === activeAccountId) || null,
    [activeAccountId, filteredAccounts]
  );

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      if (transactionFilters.patternTag !== 'All' && transaction.patternTag !== transactionFilters.patternTag) {
        return false;
      }
      if (transactionFilters.direction !== 'All' && transaction.direction !== transactionFilters.direction) {
        return false;
      }
      if (transactionFilters.minAmount && transaction.amount < Number(transactionFilters.minAmount)) return false;
      if (transactionFilters.maxAmount && transaction.amount > Number(transactionFilters.maxAmount)) return false;
      return true;
    });
  }, [transactionFilters, transactions]);

  const filteredClusters = useMemo(() => {
    return clusters.filter((cluster) => {
      if (cluster.clusterSize < Number(networkFilters.minClusterSize)) return false;
      if (cluster.avgRisk < Number(networkFilters.minAvgRisk)) return false;
      if (networkFilters.sharedDeviceOnly && cluster.sharedDeviceCount === 0) return false;
      return true;
    });
  }, [clusters, networkFilters]);

  const filteredInvestigations = useMemo(() => {
    return investigations.filter((investigation) => {
      if (caseFilters.status !== 'All' && investigation.status !== caseFilters.status) return false;
      if (caseFilters.decision !== 'All' && investigation.recommendedAction !== caseFilters.decision) return false;
      if (caseFilters.slaRisk === 'Breach Risk') {
        if (!(investigation.slaHoursRemaining <= 8 && investigation.status !== 'Closed')) return false;
      }
      if (caseFilters.slaRisk === 'Within SLA') {
        if (investigation.slaHoursRemaining <= 8 && investigation.status !== 'Closed') return false;
      }
      return true;
    });
  }, [caseFilters, investigations]);

  const flowSummary = useMemo(() => {
    const routes = new Map();
    filteredTransactions.forEach((transaction) => {
      const key = `${transaction.fromAccount} -> ${transaction.toAccount}`;
      routes.set(key, (routes.get(key) || 0) + transaction.amount);
    });
    return [...routes.entries()]
      .map(([path, amount]) => ({ path, amount }))
      .sort((left, right) => right.amount - left.amount)
      .slice(0, 8);
  }, [filteredTransactions]);

  const patternSummary = useMemo(
    () =>
      PATTERN_TAGS.map((tag) => ({
        tag,
        count: filteredTransactions.filter((transaction) => transaction.patternTag === tag).length
      })),
    [filteredTransactions]
  );

  const myWorkSummary = useMemo(() => {
    const now = new Date();
    const openCases = investigations.filter((investigation) => investigation.status !== 'Closed').length;
    const highPriority = investigations.filter(
      (investigation) => investigation.riskScore >= 82 && investigation.status !== 'Closed'
    ).length;
    const dueToday = investigations.filter(
      (investigation) => investigation.status !== 'Closed' && isSameDate(investigation.dueAt, now)
    ).length;
    const slaRisk = investigations.filter(
      (investigation) => investigation.status !== 'Closed' && investigation.slaHoursRemaining <= 8
    ).length;
    const closedCases = investigations.filter((investigation) => investigation.status === 'Closed');
    const avgClosure = closedCases.length
      ? (
          closedCases.reduce((sum, investigation) => sum + investigation.closureHours, 0) / closedCases.length
        ).toFixed(1)
      : '0.0';

    return [
      { label: 'My Open Cases', value: openCases },
      { label: 'High Priority Assigned', value: highPriority },
      { label: 'Cases Due Today', value: dueToday },
      { label: 'SLA Breach Risk', value: slaRisk },
      { label: 'Avg Closure Time (Hrs)', value: avgClosure }
    ];
  }, [investigations]);

  const alertActivityTrend = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 7 }, (_, offset) => {
      const date = new Date(now);
      date.setDate(now.getDate() - (6 - offset));
      const dailyAlerts = alerts.filter((alert) => isSameDate(alert.createdAt, date));
      const escalations = dailyAlerts.filter((alert) => alert.status === 'Escalated').length;
      const strFiled = investigations.filter(
        (investigation) => investigation.status === 'STR Filed' && isSameDate(investigation.openedAt, date)
      ).length;

      return {
        label: date.toLocaleDateString('en-IN', { weekday: 'short' }),
        alerts: dailyAlerts.length,
        escalations,
        strFiled
      };
    });
  }, [alerts, investigations]);

  const riskComposition = useMemo(() => {
    const deviceRaw =
      accounts.filter((account) => account.riskIndicators.deviceSharing || account.riskIndicators.geoMismatch).length + 1;
    const transactionRaw =
      transactions.filter((transaction) => transaction.patternTag === 'Rapid In-Out' || transaction.patternTag === 'Smurfing')
        .length + 1;
    const networkRaw =
      clusters.filter((cluster) => cluster.avgRisk >= 75 || cluster.sharedDeviceCount > 2).length + 1;
    const behaviorRaw =
      accounts.filter((account) => account.riskIndicators.rapidMovement || account.riskIndicators.structuringPattern).length + 1;
    const total = deviceRaw + transactionRaw + networkRaw + behaviorRaw;
    const device = Math.round((deviceRaw / total) * 100);
    const transaction = Math.round((transactionRaw / total) * 100);
    const network = Math.round((networkRaw / total) * 100);
    const behavior = Math.max(0, 100 - (device + transaction + network));

    return [
      { label: 'Device Risk', value: device, color: '#d3564d' },
      { label: 'Transaction Risk', value: transaction, color: '#2f7fd8' },
      { label: 'Network Risk', value: network, color: '#c79627' },
      { label: 'Behavioral Risk', value: behavior, color: '#2c9c7b' }
    ];
  }, [accounts, clusters, transactions]);

  const riskCompositionGradient = useMemo(() => {
    let pointer = 0;
    const segments = riskComposition.map((item) => {
      const start = pointer;
      const end = pointer + item.value;
      pointer = end;
      return `${item.color} ${start}% ${end}%`;
    });
    return `conic-gradient(${segments.join(', ')})`;
  }, [riskComposition]);

  const reportRows = useMemo(() => {
    const strDraftCount = investigations.filter(
      (investigation) => investigation.status === 'STR Filed' || investigation.recommendedAction === 'File STR'
    ).length;
    const caseReportCount = investigations.length;
    const activityCount = Math.round((alerts.length + investigations.length + transactions.length) / 3);
    const compliancePct = investigations.length
      ? Math.round(
          (investigations.filter((investigation) => investigation.status === 'Closed').length / investigations.length) * 100
        )
      : 0;

    const rows = [
      {
        type: 'STR Draft',
        total: strDraftCount,
        owner: 'AML Team',
        status: 'Ready for Review',
        description: 'Draft suspicious transaction reports pending compliance review.'
      },
      {
        type: 'Export Case Report',
        total: caseReportCount,
        owner: 'Case Management',
        status: 'Export Available',
        description: 'Case packets with linked alerts, evidence, and analyst actions.'
      },
      {
        type: 'Analyst Activity Report',
        total: activityCount,
        owner: 'Operations Governance',
        status: 'Daily Refresh',
        description: 'Analyst throughput, closure pace, and escalation trend.'
      },
      {
        type: 'Compliance Summary',
        total: compliancePct,
        owner: 'Compliance Office',
        status: 'Monthly Certified',
        description: 'Closure ratio, SLA adherence, and STR conversion metrics.'
      }
    ];

    return rows.filter((row) => reportFilters.reportType === 'All' || row.type === reportFilters.reportType);
  }, [alerts.length, investigations, reportFilters.reportType, transactions.length]);

  const renderDashboardSection = () => (
    <section className="analyst-section">
      <div className="section-heading">
        <h2>Dashboard Overview</h2>
        <p>Personal work summary and live alert intelligence for {effectiveDistrict}, {selectedState}.</p>
      </div>

      <div className="metric-grid">
        {myWorkSummary.map((item) => (
          <article key={item.label} className="analyst-card metric-card">
            <p>{item.label}</p>
            <strong>{item.value}</strong>
          </article>
        ))}
      </div>

      <div className="split-grid">
        <article className="analyst-card">
          <div className="card-headline">
            <h3>Alert Activity Trend</h3>
            <span>Last 7 Days</span>
          </div>
          <div className="trend-grid">
            {alertActivityTrend.map((point) => (
              <div key={point.label} className="trend-col">
                <p className="trend-day">{point.label}</p>
                <div className="trend-values">
                  <span>A {point.alerts}</span>
                  <span>E {point.escalations}</span>
                  <span>STR {point.strFiled}</span>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="analyst-card">
          <div className="card-headline">
            <h3>Risk Composition</h3>
            <span>Component Breakdown</span>
          </div>
          <div className="composition-wrap">
            <div className="composition-donut" style={{ background: riskCompositionGradient }}>
              <div className="composition-center">{riskComposition.reduce((sum, item) => sum + item.value, 0)}%</div>
            </div>
            <ul className="composition-list">
              {riskComposition.map((item) => (
                <li key={item.label}>
                  <span className="dot" style={{ backgroundColor: item.color }} />
                  <p>{item.label}</p>
                  <strong>{item.value}%</strong>
                </li>
              ))}
            </ul>
          </div>
        </article>
      </div>
    </section>
  );

  const renderAlertsSection = () => (
    <section className="analyst-section">
      <div className="section-heading">
        <h2>Alerts</h2>
        <p>Main operational queue with advanced risk filters and prioritization logic.</p>
      </div>
      <div className="section-layout">
        <aside className="analyst-card filter-panel">
          <h3>Advanced Filters</h3>

          <label>
            Risk Score Range
            <div className="inline-field">
              <input
                type="number"
                min="0"
                max="100"
                value={alertFilters.riskMin}
                onChange={(event) =>
                  setAlertFilters((previous) => ({ ...previous, riskMin: Math.min(Number(event.target.value), previous.riskMax) }))
                }
              />
              <input
                type="number"
                min="0"
                max="100"
                value={alertFilters.riskMax}
                onChange={(event) =>
                  setAlertFilters((previous) => ({ ...previous, riskMax: Math.max(Number(event.target.value), previous.riskMin) }))
                }
              />
            </div>
          </label>

          <label>
            Alert Type
            <select
              value={alertFilters.alertType}
              onChange={(event) => setAlertFilters((previous) => ({ ...previous, alertType: event.target.value }))}
            >
              <option value="All">All</option>
              {ALERT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <label>
            Transaction Amount
            <div className="inline-field">
              <input
                type="number"
                placeholder="Min"
                value={alertFilters.minAmount}
                onChange={(event) => setAlertFilters((previous) => ({ ...previous, minAmount: event.target.value }))}
              />
              <input
                type="number"
                placeholder="Max"
                value={alertFilters.maxAmount}
                onChange={(event) => setAlertFilters((previous) => ({ ...previous, maxAmount: event.target.value }))}
              />
            </div>
          </label>

          <label>
            Cluster Size
            <div className="inline-field">
              <input
                type="number"
                placeholder="Min"
                value={alertFilters.clusterMin}
                onChange={(event) => setAlertFilters((previous) => ({ ...previous, clusterMin: event.target.value }))}
              />
              <input
                type="number"
                placeholder="Max"
                value={alertFilters.clusterMax}
                onChange={(event) => setAlertFilters((previous) => ({ ...previous, clusterMax: event.target.value }))}
              />
            </div>
          </label>

          <label>
            Shared Device Flag
            <select
              value={alertFilters.sharedDeviceFlag}
              onChange={(event) => setAlertFilters((previous) => ({ ...previous, sharedDeviceFlag: event.target.value }))}
            >
              <option value="All">All</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </label>

          <label>
            Geo Risk
            <select
              value={alertFilters.geoRisk}
              onChange={(event) => setAlertFilters((previous) => ({ ...previous, geoRisk: event.target.value }))}
            >
              <option value="All">All</option>
              {GEO_RISK_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </label>

          <label>
            Date Range
            <select
              value={alertFilters.dateWindow}
              onChange={(event) => setAlertFilters((previous) => ({ ...previous, dateWindow: event.target.value }))}
            >
              <option value="All">All</option>
              <option value="Today">Today</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
            </select>
          </label>

          <label>
            Status
            <select
              value={alertFilters.status}
              onChange={(event) => setAlertFilters((previous) => ({ ...previous, status: event.target.value }))}
            >
              <option value="All">All</option>
              {ALERT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
        </aside>

        <article className="analyst-card table-card">
          <div className="card-headline">
            <h3>Alert Queue</h3>
            <span>{filteredAlerts.length} records</span>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Alert ID</th>
                  <th>Account ID</th>
                  <th>Risk Score</th>
                  <th>Alert Type</th>
                  <th>Cluster ID</th>
                  <th>Triggered Rule</th>
                  <th>Amount</th>
                  <th>Created Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAlerts.map((alert) => (
                  <tr key={alert.alertId}>
                    <td>{alert.alertId}</td>
                    <td>{alert.accountId}</td>
                    <td>{alert.riskScore}</td>
                    <td>{alert.alertType}</td>
                    <td>{alert.clusterId}</td>
                    <td>{alert.triggeredRule}</td>
                    <td>{currencyFormatter.format(alert.amount)}</td>
                    <td>{formatDateTime(alert.createdAt)}</td>
                    <td>{alert.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </div>
    </section>
  );

  const renderAccountsSection = () => (
    <section className="analyst-section">
      <div className="section-heading">
        <h2>Accounts</h2>
        <p>Account-level intelligence with risk indicators and transaction summaries.</p>
      </div>
      <div className="split-grid">
        <article className="analyst-card table-card">
          <div className="card-headline">
            <h3>Account Universe</h3>
            <span>{filteredAccounts.length} accounts</span>
          </div>

          <div className="table-filters">
            <label>
              Onboarding
              <select
                value={accountFilters.onboarding}
                onChange={(event) => setAccountFilters((previous) => ({ ...previous, onboarding: event.target.value }))}
              >
                <option value="All">All</option>
                {ONBOARDING_CHANNELS.map((channel) => (
                  <option key={channel} value={channel}>
                    {channel}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Risk Band
              <select
                value={accountFilters.riskBand}
                onChange={(event) => setAccountFilters((previous) => ({ ...previous, riskBand: event.target.value }))}
              >
                <option value="All">All</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </label>

            <label>
              Rapid Movement
              <select
                value={accountFilters.rapidMovement}
                onChange={(event) =>
                  setAccountFilters((previous) => ({ ...previous, rapidMovement: event.target.value }))
                }
              >
                <option value="All">All</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </label>

            <label>
              Device Sharing
              <select
                value={accountFilters.deviceSharing}
                onChange={(event) =>
                  setAccountFilters((previous) => ({ ...previous, deviceSharing: event.target.value }))
                }
              >
                <option value="All">All</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </label>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Account ID</th>
                  <th>Holder</th>
                  <th>Risk Score</th>
                  <th>KYC</th>
                  <th>Age (Months)</th>
                  <th>Onboarding</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.map((account) => (
                  <tr
                    key={account.accountId}
                    onClick={() => setSelectedAccountId(account.accountId)}
                    className={activeAccountId === account.accountId ? 'active-row' : ''}
                  >
                    <td>{account.accountId}</td>
                    <td>{account.holderName}</td>
                    <td>{account.riskScore}</td>
                    <td>{account.kycLevel}</td>
                    <td>{account.accountAgeMonths}</td>
                    <td>{account.onboardingChannel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="analyst-card">
          <div className="card-headline">
            <h3>Account Profile</h3>
            <span>{selectedAccount ? selectedAccount.accountId : 'No selection'}</span>
          </div>
          {selectedAccount ? (
            <>
              <div className="profile-row"><p>KYC Info</p><strong>{selectedAccount.kycLevel}</strong></div>
              <div className="profile-row"><p>Risk Score</p><strong>{selectedAccount.riskScore}</strong></div>
              <div className="profile-row"><p>Account Age</p><strong>{selectedAccount.accountAgeMonths} months</strong></div>
              <div className="profile-row"><p>Onboarding Channel</p><strong>{selectedAccount.onboardingChannel}</strong></div>

              <h4>Risk Indicators</h4>
              <ul className="indicator-list">
                <li><span>Rapid Movement Flag</span><strong>{selectedAccount.riskIndicators.rapidMovement ? 'Yes' : 'No'}</strong></li>
                <li><span>Structuring Pattern</span><strong>{selectedAccount.riskIndicators.structuringPattern ? 'Yes' : 'No'}</strong></li>
                <li><span>Dormant Reactivation</span><strong>{selectedAccount.riskIndicators.dormantReactivation ? 'Yes' : 'No'}</strong></li>
                <li><span>Device Sharing</span><strong>{selectedAccount.riskIndicators.deviceSharing ? 'Yes' : 'No'}</strong></li>
                <li><span>Geo Mismatch</span><strong>{selectedAccount.riskIndicators.geoMismatch ? 'Yes' : 'No'}</strong></li>
              </ul>

              <h4>Transaction Summary</h4>
              <div className="metric-grid compact">
                <article className="metric-card"><p>Total Inflow</p><strong>{currencyFormatter.format(selectedAccount.transactionSummary.totalInflow)}</strong></article>
                <article className="metric-card"><p>Total Outflow</p><strong>{currencyFormatter.format(selectedAccount.transactionSummary.totalOutflow)}</strong></article>
                <article className="metric-card"><p>Velocity</p><strong>{selectedAccount.transactionSummary.velocity} tx/day</strong></article>
                <article className="metric-card"><p>Avg Txn Amount</p><strong>{currencyFormatter.format(selectedAccount.transactionSummary.avgTransactionAmount)}</strong></article>
              </div>
            </>
          ) : (
            <p>No account available for current filters.</p>
          )}
        </article>
      </div>
    </section>
  );

  const renderTransactionsSection = () => (
    <section className="analyst-section">
      <div className="section-heading">
        <h2>Transactions</h2>
        <p>Pattern detection with timeline flow, directional visibility, and tag analytics.</p>
      </div>
      <article className="analyst-card">
        <div className="table-filters">
          <label>
            Pattern Tag
            <select
              value={transactionFilters.patternTag}
              onChange={(event) =>
                setTransactionFilters((previous) => ({ ...previous, patternTag: event.target.value }))
              }
            >
              <option value="All">All</option>
              {PATTERN_TAGS.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </label>

          <label>
            Direction
            <select
              value={transactionFilters.direction}
              onChange={(event) =>
                setTransactionFilters((previous) => ({ ...previous, direction: event.target.value }))
              }
            >
              <option value="All">All</option>
              <option value="Inbound">Inbound</option>
              <option value="Outbound">Outbound</option>
            </select>
          </label>

          <label>
            Min Amount
            <input
              type="number"
              value={transactionFilters.minAmount}
              onChange={(event) =>
                setTransactionFilters((previous) => ({ ...previous, minAmount: event.target.value }))
              }
            />
          </label>

          <label>
            Max Amount
            <input
              type="number"
              value={transactionFilters.maxAmount}
              onChange={(event) =>
                setTransactionFilters((previous) => ({ ...previous, maxAmount: event.target.value }))
              }
            />
          </label>
        </div>

        <div className="split-grid">
          <div>
            <div className="card-headline">
              <h3>Transaction Timeline</h3>
              <span>{filteredTransactions.length} records</span>
            </div>
            <ul className="timeline-list">
              {filteredTransactions.slice(0, 12).map((transaction) => (
                <li key={transaction.transactionId}>
                  <div>
                    <strong>{transaction.transactionId}</strong>
                    <p>{transaction.fromAccount} {'->'} {transaction.toAccount}</p>
                  </div>
                  <div>
                    <strong>{currencyFormatter.format(transaction.amount)}</strong>
                    <p>{formatDateTime(transaction.createdAt)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="card-headline">
              <h3>Flow Visualization</h3>
              <span>Top directional routes</span>
            </div>
            <ul className="flow-list">
              {flowSummary.map((flow) => (
                <li key={flow.path}>
                  <div className="flow-meta">
                    <span>{flow.path}</span>
                    <strong>{currencyFormatter.format(flow.amount)}</strong>
                  </div>
                  <div className="track">
                    <div
                      className="fill"
                      style={{ width: `${Math.max(6, Math.round((flow.amount / flowSummary[0].amount) * 100))}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pattern-grid">
          {patternSummary.map((pattern) => (
            <article key={pattern.tag} className="pattern-card">
              <p>{pattern.tag}</p>
              <strong>{pattern.count}</strong>
            </article>
          ))}
        </div>
      </article>
    </section>
  );

  const renderNetworkSection = () => (
    <section className="analyst-section">
      <div className="section-heading">
        <h2>Network Analysis</h2>
        <p>Cluster detection with central node analytics and relationship mapping.</p>
      </div>
      <article className="analyst-card">
        <div className="table-filters">
          <label>
            Min Cluster Size
            <input
              type="number"
              min="0"
              value={networkFilters.minClusterSize}
              onChange={(event) =>
                setNetworkFilters((previous) => ({ ...previous, minClusterSize: Number(event.target.value || 0) }))
              }
            />
          </label>

          <label>
            Min Avg Risk
            <input
              type="number"
              min="0"
              max="100"
              value={networkFilters.minAvgRisk}
              onChange={(event) =>
                setNetworkFilters((previous) => ({ ...previous, minAvgRisk: Number(event.target.value || 0) }))
              }
            />
          </label>

          <label className="inline-checkbox">
            <input
              type="checkbox"
              checked={networkFilters.sharedDeviceOnly}
              onChange={(event) =>
                setNetworkFilters((previous) => ({ ...previous, sharedDeviceOnly: event.target.checked }))
              }
            />
            Shared Device Only
          </label>
        </div>

        <div className="split-grid">
          <div>
            <div className="card-headline">
              <h3>Relationship Graph</h3>
              <span>Nodes and edges by cluster</span>
            </div>
            <ul className="relationship-list">
              {filteredClusters.slice(0, 8).map((cluster) => (
                <li key={cluster.clusterId}>
                  <strong>{cluster.clusterId}</strong>
                  <p>{cluster.hubAccount} {'->'} {cluster.transitAccount} {'->'} {cluster.controllerAccount}</p>
                  <span>{cluster.clusterSize} linked accounts</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="card-headline">
              <h3>Central Node Detection</h3>
              <span>Hub / transit / controller</span>
            </div>
            <ul className="central-node-list">
              {filteredClusters.slice(0, 8).map((cluster) => (
                <li key={`${cluster.clusterId}-central`}>
                  <p>{cluster.clusterId}</p>
                  <small>Hub: {cluster.hubAccount}</small>
                  <small>Transit: {cluster.transitAccount}</small>
                  <small>Controller: {cluster.controllerAccount}</small>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Cluster ID</th>
                <th>Cluster Size</th>
                <th>Avg Risk</th>
                <th>Shared Device Count</th>
                <th>Shared Beneficiary</th>
              </tr>
            </thead>
            <tbody>
              {filteredClusters.map((cluster) => (
                <tr key={cluster.clusterId}>
                  <td>{cluster.clusterId}</td>
                  <td>{cluster.clusterSize}</td>
                  <td>{cluster.avgRisk}</td>
                  <td>{cluster.sharedDeviceCount}</td>
                  <td>{cluster.sharedBeneficiary ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );

  const renderInvestigationsSection = () => (
    <section className="analyst-section">
      <div className="section-heading">
        <h2>Investigations</h2>
        <p>Case workflow with evidence panels, SLA monitoring, and decisions.</p>
      </div>
      <article className="analyst-card table-card">
        <div className="card-headline">
          <h3>Case Overview</h3>
          <span>{filteredInvestigations.length} cases</span>
        </div>

        <div className="table-filters">
          <label>
            Status
            <select
              value={caseFilters.status}
              onChange={(event) => setCaseFilters((previous) => ({ ...previous, status: event.target.value }))}
            >
              <option value="All">All</option>
              {CASE_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <label>
            SLA
            <select
              value={caseFilters.slaRisk}
              onChange={(event) => setCaseFilters((previous) => ({ ...previous, slaRisk: event.target.value }))}
            >
              <option value="All">All</option>
              <option value="Breach Risk">Breach Risk</option>
              <option value="Within SLA">Within SLA</option>
            </select>
          </label>

          <label>
            Decision
            <select
              value={caseFilters.decision}
              onChange={(event) => setCaseFilters((previous) => ({ ...previous, decision: event.target.value }))}
            >
              <option value="All">All</option>
              {DECISION_OPTIONS.map((decision) => (
                <option key={decision} value={decision}>
                  {decision}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Linked Alerts</th>
                <th>Risk Score</th>
                <th>Cluster ID</th>
                <th>Status</th>
                <th>SLA</th>
                <th>Investigate</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvestigations.map((investigation) => (
                <tr
                  key={investigation.caseId}
                >
                  <td>{investigation.caseId}</td>
                  <td>{investigation.linkedAlertIds.length}</td>
                  <td>{investigation.riskScore}</td>
                  <td>{investigation.clusterId}</td>
                  <td>{investigation.status}</td>
                  <td>{investigation.slaHoursRemaining}h</td>
                  <td>
                    <button
                      type="button"
                      className="action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/case/${investigation.caseId}/evidence?state=${selectedState}&district=${effectiveDistrict}&range=${selectedRange}`);
                      }}
                    >
                      Investigate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );

  const renderReportsSection = () => (
    <section className="analyst-section">
      <div className="section-heading">
        <h2>Reports</h2>
        <p>Regulatory output and compliance summary generation.</p>
      </div>
      <article className="analyst-card">
        <div className="table-filters">
          <label>
            Report Type
            <select
              value={reportFilters.reportType}
              onChange={(event) =>
                setReportFilters((previous) => ({ ...previous, reportType: event.target.value }))
              }
            >
              <option value="All">All</option>
              <option value="STR Draft">STR Draft</option>
              <option value="Export Case Report">Export Case Report</option>
              <option value="Analyst Activity Report">Analyst Activity Report</option>
              <option value="Compliance Summary">Compliance Summary</option>
            </select>
          </label>

          <label>
            Period
            <select
              value={reportFilters.period}
              onChange={(event) => setReportFilters((previous) => ({ ...previous, period: event.target.value }))}
            >
              {REPORT_PERIODS.map((period) => (
                <option key={period} value={period}>
                  {period}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="report-grid">
          {reportRows.map((report) => (
            <article key={report.type} className="report-card">
              <p>{report.type}</p>
              <strong>{report.type === 'Compliance Summary' ? `${report.total}%` : numberFormatter.format(report.total)}</strong>
              <span>{report.description}</span>
              <div className="report-meta">
                <small>{selectedState} / {effectiveDistrict}</small>
                <small>{reportFilters.period}</small>
              </div>
            </article>
          ))}
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Report</th>
                <th>Owner</th>
                <th>Status</th>
                <th>Region</th>
                <th>Period</th>
              </tr>
            </thead>
            <tbody>
              {reportRows.map((report) => (
                <tr key={`${report.type}-row`}>
                  <td>{report.type}</td>
                  <td>{report.owner}</td>
                  <td>{report.status}</td>
                  <td>{selectedState} / {effectiveDistrict}</td>
                  <td>{reportFilters.period}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );

  const renderSectionContent = () => {
    if (activeSection === 'dashboard') return renderDashboardSection();
    if (activeSection === 'alerts') return renderAlertsSection();
    if (activeSection === 'accounts') return renderAccountsSection();
    if (activeSection === 'transactions') return renderTransactionsSection();
    if (activeSection === 'network') return renderNetworkSection();
    if (activeSection === 'investigations') return renderInvestigationsSection();
    return renderReportsSection();
  };

  const handleLogout = () => navigate('/');

  return (
    <div className="analyst-dashboard">
      <header className="analyst-topbar">
        <div>
          <h1>AML Analyst Command Center</h1>
          <p>Onboarding Risk to Transaction Monitoring to Network Analysis to Investigation to STR Filing</p>
        </div>
        <button type="button" onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </header>

      <div className="analyst-shell">
        <aside className="analyst-sidebar">
          <h2>Analyst Views</h2>
          <nav>
            {SIDEBAR_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={activeSection === item.id ? 'active' : ''}
                onClick={() => navigate(`/dashboard/analyst/${item.id}`)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="analyst-content">
          <section className="analyst-card global-filter-card">
            <div className="table-filters">
              <label>
                State
                <select
                  value={selectedState}
                  onChange={(event) => {
                    const nextState = event.target.value;
                    setSelectedState(nextState);
                    setSelectedDistrict('All Districts');
                  }}
                >
                  {stateOptions.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                District
                <select value={effectiveDistrict} onChange={(event) => setSelectedDistrict(event.target.value)}>
                  {availableDistricts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Monitoring Window
                <select value={selectedRange} onChange={(event) => setSelectedRange(event.target.value)}>
                  {DATE_RANGE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="summary-strip">
              <article><p>Alerts</p><strong>{numberFormatter.format(globalSummary.alerts)}</strong></article>
              <article><p>Accounts</p><strong>{numberFormatter.format(globalSummary.accounts)}</strong></article>
              <article><p>Transactions</p><strong>{numberFormatter.format(globalSummary.transactions)}</strong></article>
              <article><p>Investigations</p><strong>{numberFormatter.format(globalSummary.investigations)}</strong></article>
            </div>
          </section>

          {renderSectionContent()}
        </main>
      </div>
    </div>
  );
};

export default AMLAnalystDashboard;
