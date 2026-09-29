import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { neon } from '@neondatabase/serverless';

const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL is missing in .env.local');
  process.exit(1);
}

const sql = neon(url);

const TEMP_FEEDBACKS = [
  {
    category: 'feature_request',
    name: 'Doc Mel • PGH',
    slotNumber: 2,
    rating: 5,
    message: 'Can you add medical prescription refill reminders specifically for elderly maintenance medications? The dosage schedule in the demo looks promising.',
    hoursAgo: 1,
  },
  {
    category: 'review',
    name: 'Atty. Ramon G.',
    slotNumber: 4,
    rating: 5,
    message: 'Zero cloud architecture is the only reason I installed Pangly. Client confidentiality is non-negotiable for lawyers. Hardware Keystore AES-256 is top tier.',
    hoursAgo: 2,
  },
  {
    category: 'review',
    name: 'Bong • QC',
    slotNumber: 5,
    rating: 5,
    message: 'LTO OR/CR vehicle registration reminder notified me 30 days ahead based on plate ending number. Saved me from heavy late penalty fines at the district office!',
    hoursAgo: 3,
  },
  {
    category: 'feature_request',
    name: 'Engr. Mark C.',
    slotNumber: 7,
    rating: 4,
    message: 'Please add PRC Professional ID card OCR and CPD units renewal tracking for licensed civil engineers and architects in the Philippines.',
    hoursAgo: 5,
  },
  {
    category: 'bug_report',
    name: 'Jayson • Cebu',
    slotNumber: 8,
    rating: null,
    message: 'When taking photo of PhilID in low light conditions, auto-detection takes a few seconds longer. Pinch to zoom works fine though.',
    hoursAgo: 6,
  },
  {
    category: 'review',
    name: 'Elena S. • Iloilo',
    slotNumber: 9,
    rating: 5,
    message: 'Tested on airplane mode on my flight to Davao. The on-device neural assistant instantly retrieved my PhilHealth and SSS numbers without any internet connection.',
    hoursAgo: 8,
  },
  {
    category: 'feature_request',
    name: 'Tito Boy • Cavite',
    slotNumber: 11,
    rating: 5,
    message: 'Senior Citizen booklet with dosage tracker is a lifesaver for our lola. Would love a 1-tap share button directly to family Viber group.',
    hoursAgo: 10,
  },
  {
    category: 'general',
    name: 'Grace D.',
    slotNumber: null,
    rating: 5,
    message: 'Mascot is super cute! Love the Philippine pangolin design concept. Looking forward to the iOS testflight release when available.',
    hoursAgo: 12,
  },
  {
    category: 'feature_request',
    name: 'Capt. Noel • Pasay',
    slotNumber: 14,
    rating: 5,
    message: 'Requesting Maritime Seafarer’s Identification Document (SID / SRB) and STCW certificates auto-categorization for Filipino seafarers.',
    hoursAgo: 14,
  },
  {
    category: 'review',
    name: 'Kuya Dan',
    slotNumber: 15,
    rating: 5,
    message: 'Much faster and cleaner than Google Drive or photo gallery. Scanned my Driver’s License and PhilID in less than 30 seconds.',
    hoursAgo: 16,
  },
  {
    category: 'bug_report',
    name: 'Raffy T.',
    slotNumber: null,
    rating: null,
    message: 'Minor UI suggestion: font size on the export recovery key modal is slightly small on compact 6.1-inch screens.',
    hoursAgo: 18,
  },
  {
    category: 'feature_request',
    name: 'Ate Liza • Makati',
    slotNumber: 18,
    rating: 4,
    message: 'Please support Pag-IBIG MID / Loyalty Card Plus card scanning and MP2 savings account number storage.',
    hoursAgo: 20,
  },
  {
    category: 'review',
    name: 'Carlos V.',
    slotNumber: 21,
    rating: 5,
    message: 'Biometric fingerprint unlock on Android 14 works flawlessly. No login screen, no passwords sent to US servers. Pure local privacy.',
    hoursAgo: 22,
  },
  {
    category: 'general',
    name: 'Marites B.',
    slotNumber: null,
    rating: 4,
    message: 'Does this support dual SIM Wi-Fi router password storage? Very useful when sharing home fiber credentials with guests.',
    hoursAgo: 24,
  },
  {
    category: 'feature_request',
    name: 'Nurse Joy • Taguig',
    slotNumber: 23,
    rating: 5,
    message: 'PhilHealth MDR PDF parser would be wonderful for quick hospital admission clearance and claims submission.',
    hoursAgo: 26,
  },
  {
    category: 'review',
    name: 'Jerome • Bulacan',
    slotNumber: 25,
    rating: 5,
    message: 'Stored all our family vehicle registrations here (2 cars and 1 motorcycle). The automated renewal calendar saved our weekend.',
    hoursAgo: 28,
  },
  {
    category: 'bug_report',
    name: 'Dave M.',
    slotNumber: 27,
    rating: null,
    message: 'Dark mode toggle in Settings sometimes reverts to system default when rebooting phone on Samsung OneUI 6.',
    hoursAgo: 30,
  },
  {
    category: 'feature_request',
    name: 'Sheila • Pampanga',
    slotNumber: 29,
    rating: 5,
    message: 'Can we have encrypted offline backup export to USB OTG flash drive? For peace of mind during emergency typhoon evacuations.',
    hoursAgo: 32,
  },
  {
    category: 'review',
    name: 'Paolo R.',
    slotNumber: 31,
    rating: 5,
    message: 'Tested on Xiaomi Redmi Note 12 with 4GB RAM. Offline AI model responds in less than 300ms. Exceptional engineering.',
    hoursAgo: 36,
  },
  {
    category: 'general',
    name: 'Bea • Mandaluyong',
    slotNumber: null,
    rating: 5,
    message: 'Glad to see high quality offline tech built by Filipino developers. Will definitely recommend to my colleagues in fintech.',
    hoursAgo: 40,
  },
  {
    category: 'feature_request',
    name: 'Arch. Vincent',
    slotNumber: 34,
    rating: 4,
    message: 'High resolution pinch-to-zoom is crisp. Would appreciate batch export of selected IDs when applying for multiple bank visas.',
    hoursAgo: 44,
  },
  {
    category: 'review',
    name: 'Mang Tomas',
    slotNumber: 36,
    rating: 5,
    message: 'National ID card ePhilID paper printout scan worked surprisingly well. It recognized the 16-digit PhilSys Card Number automatically.',
    hoursAgo: 48,
  },
  {
    category: 'bug_report',
    name: 'Chris P.',
    slotNumber: 38,
    rating: null,
    message: 'On older Android 9 tablet, camera auto-focus took two taps to lock onto small passport text. Works great on newer phone though.',
    hoursAgo: 52,
  },
  {
    category: 'feature_request',
    name: 'Kiko • Pasig',
    slotNumber: 41,
    rating: 5,
    message: 'Please add RFID tollway tag storage (Autosweep and Easytrip account numbers and balance check reminders).',
    hoursAgo: 56,
  },
  {
    category: 'review',
    name: 'Eunice T.',
    slotNumber: 42,
    rating: 5,
    message: 'Cleanest privacy utility on Android. Zero ads, zero telemetry trackers found by DuckDuckGo App Tracking Protection.',
    hoursAgo: 60,
  },
  {
    category: 'feature_request',
    name: 'Coach Dennis',
    slotNumber: 45,
    rating: 4,
    message: 'PWD card booklet discount tracking for restaurants and medicine purchases would be super helpful for special education families.',
    hoursAgo: 64,
  },
  {
    category: 'review',
    name: 'Ronald • Batangas',
    slotNumber: 48,
    rating: 5,
    message: 'The AI Smart Context is genuinely offline. Turned off mobile data and Wi-Fi and asked "When does my license expire?" and it answered instantly.',
    hoursAgo: 70,
  },
  {
    category: 'bug_report',
    name: 'Leo B.',
    slotNumber: null,
    rating: null,
    message: 'Crash report: opening high-res 48MP raw photo caused memory warning on low-spec 2GB phone. Please consider automatic downscaling.',
    hoursAgo: 75,
  },
  {
    category: 'feature_request',
    name: 'Atty. Camille',
    slotNumber: 50,
    rating: 5,
    message: 'Encrypted notes section alongside IDs for storing confidential bank PINs and locker combinations. Excellent work team!',
    hoursAgo: 80,
  },
  {
    category: 'review',
    name: 'Francis • Davao',
    slotNumber: 52,
    rating: 5,
    message: 'Solid v1.3.20 release. Fast, lightweight, and actually respects our privacy. Salamat Pangly!',
    hoursAgo: 85,
  }
];

async function seedTempFeedbacks() {
  console.log(`Starting to seed ${TEMP_FEEDBACKS.length} temporary feedbacks...`);

  let count = 0;
  for (const item of TEMP_FEEDBACKS) {
    const createdAt = new Date(Date.now() - item.hoursAgo * 60 * 60 * 1000);
    await sql`
      INSERT INTO customer_feedbacks (
        category,
        rating,
        message,
        name,
        slot_number,
        ip_hash,
        author_token,
        created_at
      ) VALUES (
        ${item.category},
        ${item.rating},
        ${item.message},
        ${item.name},
        ${item.slotNumber},
        'temp_seed_30',
        ${'temp_token_' + Math.random().toString(36).substring(2, 10)},
        ${createdAt.toISOString()}
      );
    `;
    count++;
  }

  console.log(`✅ Successfully seeded ${count} temporary feedbacks tagged with ip_hash='temp_seed_30'.`);

  const summary = await sql`
    SELECT COUNT(*) as total,
           COUNT(*) FILTER (WHERE category = 'feature_request') as features,
           COUNT(*) FILTER (WHERE category = 'review') as reviews,
           COUNT(*) FILTER (WHERE category = 'bug_report') as bugs,
           COUNT(*) FILTER (WHERE category = 'general') as general
    FROM customer_feedbacks;
  `;
  console.log('Current DB Stats:', summary[0]);
}

seedTempFeedbacks().catch(console.error);
