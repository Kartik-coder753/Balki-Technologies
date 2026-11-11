import { SupportTicket } from '../types';

export const INITIAL_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 'tkt-1',
    ticketNumber: 'TKT-2026-4421',
    name: 'Dr. Ramesh Sharma',
    role: 'Principal / Management',
    institutionName: 'Kendriya Vidyalaya No. 1, Delhi Cantt',
    email: 'principal.kvdc@kvsedu.gov.in',
    phone: '+91 98110 44210',
    category: 'Hardware Defect & 12-Month Replacement',
    orderIdOrSku: 'ORD-2026-8831 / BALKI-ATL-5000',
    priority: 'Urgent (Classroom Paused)',
    subject: 'Ultrasonic Sensor & Motor Shield replacement under warranty',
    description: 'During the grade 8 tinkering period, 2 ultrasonic sensors (HC-SR04) and 1 motor driver shield stopped responding to trigger pulses. We request doorstep component replacement under the 12-month Balki school warranty.',
    attachmentName: 'lab_sensor_diagnostic_log.jpg',
    status: 'Resolved',
    assignedEngineer: 'Vikram Joshi (Senior Field Engineer - Delhi NCR)',
    slaHours: 24,
    createdAt: '2026-09-12T10:30:00Z',
    updatedAt: '2026-09-13T14:15:00Z',
    resolutionNotes: 'Field Engineer visited campus on 13th Sept. Replaced 2x HC-SR04 sensors and 1x L298N shield free of charge. Conducted 30-min student circuit demo.'
  },
  {
    id: 'tkt-2',
    ticketNumber: 'TKT-2026-5190',
    name: 'Meenakshi Iyer',
    role: 'ATL Lab In-Charge',
    institutionName: 'Delhi Public School, Sector 45 Gurgaon',
    email: 'meenakshi.atl@dpsgurgaon.edu.in',
    phone: '+91 98712 55432',
    category: 'ATL Lab Installation & Setup Support',
    orderIdOrSku: 'ORD-2026-9102 / BALKI-3DP-2026',
    priority: 'High (Upcoming Event)',
    subject: '3D Printer Z-axis auto-bed leveling recalibration for Annual Expo',
    description: 'Our annual school science exhibition is on 28th Sept. The 3D printer nozzle is scraping the PEI textured sheet on the left corner. We require on-site calibration or a remote video call with the technician.',
    attachmentName: 'bed_leveling_first_layer.png',
    status: 'Dispatched (Replacement)',
    assignedEngineer: 'Amanpreet Singh (Rapid Prototyping Specialist)',
    slaHours: 48,
    createdAt: '2026-09-14T08:15:00Z',
    updatedAt: '2026-09-15T11:45:00Z',
    resolutionNotes: 'Technician dispatched with replacement hardened nozzles and auto-leveling probe via Bluedart Air (AWB #8839201948). Scheduled campus visit tomorrow at 11 AM.'
  },
  {
    id: 'tkt-3',
    ticketNumber: 'TKT-2026-6012',
    name: 'Prof. Sandeep Kulkarni',
    role: 'STEM Teacher',
    institutionName: 'Bhartiya Vidya Bhavan Public School, Hyderabad',
    email: 'sandeep.stem@bvbhyd.ac.in',
    phone: '+91 94401 22987',
    category: 'Technical Wiring & Code Troubleshooting',
    orderIdOrSku: 'BALKI-ARM-6DOF',
    priority: 'Normal',
    subject: 'Python Kinematics API inverse angles telemetry drift',
    description: 'Students are programming the 6-DOF robotic arm for chess piece movement. When calculating inverse kinematics angles, servo 3 experiences a 4-degree offset. Need sample Python script and calibration coefficients.',
    attachmentName: 'kinematics_angle_error.txt',
    status: 'Engineer Assigned',
    assignedEngineer: 'Kavita Reddy (Robotics Firmware Architect)',
    slaHours: 12,
    createdAt: '2026-09-15T16:00:00Z',
    updatedAt: '2026-09-16T09:20:00Z',
    resolutionNotes: 'Firmware team verified calibration matrix. Custom Python script with calibrated servo offset patch sent to school email. Remote screen-sharing scheduled for 3:00 PM.'
  }
];

export interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export const SUPPORT_FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'Warranty & Replacement',
    question: 'How does the 12-Month Doorstep Replacement Warranty work for broken components?',
    answer: 'Every Balki Technologies ATL package and grade kit comes with a 12-Month Zero-Hassle Doorstep Replacement Warranty. If a sensor, microcontroller, motor driver, or 3D printer component becomes defective during normal classroom use, simply submit a ticket here with a photo. For metro areas, a field technician visits within 24–48 hours, or a pre-tested replacement unit is dispatched via expedited express courier.'
  },
  {
    id: 'faq-2',
    category: 'Installation & Training',
    question: 'Does Balki Technologies provide on-site ATL lab setup and educator training?',
    answer: 'Yes! For every ATL Master Tinkering Lab Setup Kit and school order exceeding ₹25,000, our certified STEM engineers visit your campus for turnkey lab assembly, equipment organization, and conduct an intensive 2-day hands-on teacher training workshop covering NEP 2020 modules and Atal Innovation Mission safety standards.'
  },
  {
    id: 'faq-3',
    category: 'Hardware Troubleshooting',
    question: 'What should I do if a Balki Uno R3 or ESP32 board is not detected by Arduino IDE on school computers?',
    answer: 'School lab computers often require the standard CH340 or CP2102 USB-to-UART driver. We provide pre-packaged driver installers for Windows 10/11 and Linux in our Technical Diagnostic Wizard. Also verify that you are using a shielded data-transfer USB cable (provided in the kit) rather than a charge-only cable.'
  },
  {
    id: 'faq-4',
    category: 'GeM & Invoicing',
    question: 'Can schools process orders through Government e-Marketplace (GeM) or Net-30 Purchase Orders?',
    answer: 'Absolutely. Balki Technologies Pvt. Ltd. is an authorized OEM on the GeM portal with full GST ITC compliance. We accept official signed school Purchase Orders (PO) with Net-30 payment terms for accredited schools, Kendriya Vidyalayas, Navodaya Vidyalayas, and state government institutions.'
  },
  {
    id: 'faq-5',
    category: 'Equipment Rentals',
    question: 'How are security deposits refunded when renting 3D printers, DSOs, or CNC rigs?',
    answer: 'Rental security deposits are 100% refundable. Once the equipment is returned in its protective shockproof flight case and checked by our inbound calibration engineers (within 48 hours of receipt), the entire deposit is credited back directly to your school bank account or original payment method.'
  },
  {
    id: 'faq-6',
    category: 'Curriculum & Certifications',
    question: 'How do students obtain their verifiable NEP 2020 course certificates?',
    answer: 'Students can access the interactive course player directly from our portal. Upon completing all grade-level lessons and scoring 80% or higher in the practical simulation quiz, an authenticated certificate signed by Balki Technologies STEM Board is generated with a unique verification QR code.'
  }
];

export interface DiagnosticGuide {
  id: string;
  title: string;
  category: string;
  symptoms: string;
  solutionSteps: string[];
  recommendedTool: string;
}

export const DIAGNOSTIC_GUIDES: DiagnosticGuide[] = [
  {
    id: 'diag-1',
    title: 'Microcontroller (Uno / ESP32) Not Recognized over USB',
    category: 'Microcontrollers & Firmware',
    symptoms: 'Arduino IDE displays "Port Busy" or COM port does not appear in Device Manager.',
    solutionSteps: [
      'Check if the board Power LED (PWR) turns solid green or amber when plugged in.',
      'Ensure the cable is a full 4-conductor USB data sync cable (included in the kit), not a 2-wire charge-only cable.',
      'Install the CH340G / CP2102 driver from Balki Resource Pack if using Windows 10/11.',
      'Press the physical reset button once right when "Uploading..." appears in the Arduino IDE console.',
      'Close any open Serial Monitor windows or Cura 3D printing software claiming the serial port.'
    ],
    recommendedTool: 'Balki USB Port Doctor & Driver Pack v2.4'
  },
  {
    id: 'diag-2',
    title: '3D Printer Extruder Clicking & Under-Extrusion',
    category: 'Prototyping & 3D Printing',
    symptoms: 'Clicking sound from extruder motor gear, incomplete infill layers, or no plastic extruding.',
    solutionSteps: [
      'Heat the hotend nozzle to 220°C (for PLA) and manually feed filament to check for smooth continuous bead.',
      'Perform an "Atomic / Cold Pull": heat nozzle to 200°C, push filament, let cool to 90°C, then pull firmly upward to remove debris.',
      'Inspect extruder brass gear teeth for ground plastic powder; clean with a brass wire brush.',
      'Verify the nozzle distance from the bed using an A4 paper sheet (should feel slight dragging friction).',
      'Replace nozzle with spare 0.4mm brass nozzle included in the maintenance flight case.'
    ],
    recommendedTool: '0.4mm Acupuncture Cleaning Needle & Brass Wire Brush'
  },
  {
    id: 'diag-3',
    title: 'Robotic Rover Motor Spinning Backward or Stalling',
    category: 'Robotics & Mechanics',
    symptoms: 'Rover spins in place or moves in reverse when code commands forward movement.',
    solutionSteps: [
      'Invert the two motor wires on the L298N terminal block (swap OUT1 and OUT2).',
      'Measure 18650 Li-Ion battery pack voltage using multimeter; voltage under load must be > 6.8V.',
      'Verify that the 5V Enable jumper on the L298N motor shield is installed.',
      'Ensure the Arduino Ground pin is connected to the Motor Shield Ground pin (Common Ground reference).'
    ],
    recommendedTool: 'Digital Multimeter & Terminal Screwdriver'
  },
  {
    id: 'diag-4',
    title: 'Autonomous Rover Sensor Telemetry & Heading Drift',
    category: 'Autonomous Systems & Robotics',
    symptoms: 'Autonomous rover veers off path or IMU heading angle drifts during straight-line navigation.',
    solutionSteps: [
      'Place rover on a flat, level surface and run the 6-axis IMU gyro zero-offset calibration routine.',
      'Keep magnetic motors and high-current battery wires at least 5cm away from the magnetometer/compass module.',
      'Check wheel encoder disc slots for dust or misaligned optical pickup sensors.',
      'Verify that left and right motor PWM speed calibration coefficients are balanced in firmware.'
    ],
    recommendedTool: 'Balki Robot Serial Telemetry Monitor & Calibrator'
  }
];
