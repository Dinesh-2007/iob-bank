/**
 * Shared constants, formatters, and utility functions for AML Analyst Dashboard components
 */

export const SIDEBAR_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard/analyst' },
  { id: 'alerts', label: 'Alerts', path: '/dashboard/analyst/alerts' },
  { id: 'accounts', label: 'Accounts', path: '/dashboard/analyst/accounts' },
  { id: 'transactions', label: 'Transactions', path: '/dashboard/analyst/transactions' },
  { id: 'network', label: 'Network Analysis', path: '/dashboard/analyst/network' },
  { id: 'investigations', label: 'Investigations', path: '/dashboard/analyst/investigations' },
  { id: 'reports', label: 'Reports', path: '/dashboard/analyst/reports' }
];

export const DATE_RANGE_OPTIONS = [
  { value: '7d', label: 'Last 7 Days', days: 7 },
  { value: '30d', label: 'Last 30 Days', days: 30 },
  { value: '90d', label: 'Last 90 Days', days: 90 }
];

export const ALERT_TYPES = [
  'Cash Structuring',
  'Rapid In-Out',
  'Mule Funnel',
  'Dormant Reactivation',
  'Round Amount Spike',
  'High-Risk Counterparty'
];

export const ALERT_STATUSES = ['Open', 'In Review', 'Escalated', 'Closed'];
export const GEO_RISK_LEVELS = ['Low', 'Medium', 'High', 'Critical'];
export const ONBOARDING_CHANNELS = ['Branch', 'Mobile App', 'Internet Banking', 'RM Desk', 'Corporate Desk'];
export const PATTERN_TAGS = ['Rapid In-Out', 'Funnel Behavior', 'Round Amount', 'Smurfing', 'Dormant Reactivation'];
export const CASE_STATUSES = ['Open', 'In Progress', 'Escalated', 'STR Filed', 'Closed'];
export const DECISION_OPTIONS = ['Escalate', 'Freeze', 'Request KYC', 'File STR', 'Close Case'];
export const REPORT_PERIODS = ['Today', 'This Week', 'This Month', 'This Quarter'];

export const INDIA_STATE_DISTRICTS = {
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

// Formatters
export const numberFormatter = new Intl.NumberFormat('en-IN');
export const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
});

// Helper functions
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

export const formatDateTime = (dateValue) =>
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

export const getRiskBand = (score) => {
  if (score >= 85) return 'Critical';
  if (score >= 70) return 'High';
  if (score >= 40) return 'Medium';
  return 'Low';
};

const buildSingleDistrictData = (state, district, rangeValue) => {
  const seed = `${state}|${district}|${rangeValue}`;
  const now = new Date();
  const windowDays = getRangeDays(rangeValue);
  
  // Add district-specific characteristics for realistic variation
  const districtRiskProfile = seededNumber(`${seed}|district-risk`, 30, 90);
  const districtActivityLevel = seededNumber(`${seed}|activity-level`, 40, 95);
  
  // Vary account count by district (12-40 accounts for diversity)
  const accountCountMin = districtActivityLevel > 70 ? 25 : districtActivityLevel > 50 ? 18 : 12;
  const accountCountMax = districtActivityLevel > 70 ? 45 : districtActivityLevel > 50 ? 35 : 30;
  const accountCount = seededNumber(`${seed}|accounts`, accountCountMin, accountCountMax);

  const accounts = Array.from({ length: accountCount }, (_, index) => {
    const accountId = `AC-${toCode(state)}-${toCode(district)}-${String(index + 1).padStart(4, '0')}`;
    
    const riskMin = districtRiskProfile > 70 ? 45 : districtRiskProfile > 50 ? 35 : 28;
    const riskScore = seededNumber(`${seed}|account-risk|${index}`, riskMin, 97);
    
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

  // Generate alerts
  const alertCountMin = districtActivityLevel > 70 ? 50 : districtActivityLevel > 50 ? 30 : 15;
  const alertCountMax = districtActivityLevel > 70 ? 100 : districtActivityLevel > 50 ? 70 : 50;
  const alertCount = seededNumber(`${seed}|alerts`, alertCountMin, alertCountMax);
  
  const alerts = Array.from({ length: alertCount }, (_, index) => {
    const account = accounts[seededNumber(`${seed}|alert-account|${index}`, 0, accounts.length - 1)];
    
    const riskMin = districtRiskProfile > 70 ? 50 : districtRiskProfile > 50 ? 40 : 35;
    const riskScore = seededNumber(`${seed}|alert-risk|${index}`, riskMin, 99);
    
    const createdAt = new Date(
      now.getTime() - seededNumber(`${seed}|alert-hours|${index}`, 0, windowDays * 24 - 1) * 60 * 60 * 1000
    );
    
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

  // Generate transactions
  const txnCountMin = districtActivityLevel > 70 ? 80 : districtActivityLevel > 50 ? 50 : 30;
  const txnCountMax = districtActivityLevel > 70 ? 180 : districtActivityLevel > 50 ? 120 : 80;
  const transactionCount = seededNumber(`${seed}|transactions`, txnCountMin, txnCountMax);
  
  const transactions = Array.from({ length: transactionCount }, (_, index) => {
    const fromIndex = seededNumber(`${seed}|from|${index}`, 0, accounts.length - 1);
    let toIndex = seededNumber(`${seed}|to|${index}`, 0, accounts.length - 1);
    if (toIndex === fromIndex) toIndex = (toIndex + 1) % accounts.length;
    
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

  // Generate network clusters
  const clusterCountMin = districtActivityLevel > 70 ? 10 : districtActivityLevel > 50 ? 6 : 3;
  const clusterCountMax = districtActivityLevel > 70 ? 20 : districtActivityLevel > 50 ? 15 : 10;
  const clusterCount = seededNumber(`${seed}|network`, clusterCountMin, clusterCountMax);
  
  const clusters = Array.from({ length: clusterCount }, (_, index) => {
    const clusterSize = seededNumber(`${seed}|network-size|${index}`, 3, 13);
    const start = seededNumber(`${seed}|start|${index}`, 0, accounts.length - 1);
    const members = Array.from({ length: clusterSize }, (_, offset) => accounts[(start + offset) % accounts.length].accountId);
    
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

  // Generate investigations/cases
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
        slaHoursRemaining= seededNumber(`${seed}|sla|${index}`, 15, 96);
      } else {
        slaHoursRemaining = seededNumber(`${seed}|sla|${index}`, 9, 72);
      }
    }
    
    const riskScoreMin = seededNumber(`${seed}|riskmin`, 35, 50);
    const riskScore = seededNumber(`${seed}|case-risk|${index}`, riskScoreMin, 98);
    const patternType = PATTERN_TAGS[index % PATTERN_TAGS.length];

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

    const totalAmount = caseTransactions.reduce((sum, txn) => sum + txn.amount, 0);
    const deviceNote = sharedDevice 
      ? 'Hub and Transit accounts accessed from same device, indicating coordinated control.'
      : 'Multiple devices used, suggesting organized network activity.';
    
    const notes = `${patternType} pattern detected in ${cluster.clusterSize}-account network. ` +
      `Total flow: ${currencyFormatter.format(totalAmount)} across 4 transactions. ` +
      `Flow: ${cluster.hubAccount} → ${cluster.transitAccount} → ${cluster.controllerAccount} → back to Hub. ` +
      `${deviceNote} Risk Score: ${riskScore}/100. ${linkedAlertIds.length} linked alerts.`;

    const statusIndex = index % CASE_STATUSES.length;
    const caseStatus = CASE_STATUSES[statusIndex];
    
    const finalSlaHours = caseStatus === 'Closed' ? Math.abs(slaHoursRemaining) : slaHoursRemaining;
    
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

export const buildAnalystData = (state, district, rangeValue) => {
  const districts = district === 'All Districts' ? INDIA_STATE_DISTRICTS[state] || [] : [district];
  
  if (districts.length === 0) {
    return { accounts: [], alerts: [], transactions: [], clusters: [], investigations: [] };
  }
  
  const allData = districts.map(dist => buildSingleDistrictData(state, dist, rangeValue));
  
  return {
    accounts: allData.flatMap(d => d.accounts),
    alerts: allData.flatMap(d => d.alerts).sort((left, right) => right.createdAt - left.createdAt),
    transactions: allData.flatMap(d => d.transactions).sort((left, right) => right.createdAt - left.createdAt),
    clusters: allData.flatMap(d => d.clusters),
    investigations: allData.flatMap(d => d.investigations).sort((left, right) => right.riskScore - left.riskScore)
  };
};
