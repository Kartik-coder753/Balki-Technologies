import { CompanyUpdate } from '../types';

export const INITIAL_COMPANY_UPDATES: CompanyUpdate[] = [
  {
    id: 'upd-robocup-hackathon',
    type: 'company',
    title: 'Balki RoboCup Hackathon 2027: "Build it. Code it. Win it!"',
    subtitle: '10 Robots • 1 Sealed Box • 60 Minutes — India\'s Most Rigorous At-Home STEM Robotics Championship',
    badge: 'NATIONAL REMOTE EDITION · ROBOCUP 2027',
    badgeColor: 'amber',
    date: 'Finals: 9–10 Jan 2027 (Reg: 1 Nov – 15 Dec 2026)',
    image: '/hackathon/Screenshot_2026-10-30_142603_66930140.png',
    description: 'Balki Technologies officially unveils the Balki RoboCup Hackathon 2027! For students in Grades 8 to 12 competing Solo or Duo. Receive a tamper-evident sealed kit delivered to your doorstep with components to build any of 10 championship robots. Join a live 1-on-1 Google Meet proctored slot, unbox on camera, build in 35 minutes, code, and execute on the 2400x1200mm arena mat! 1st Place wins ₹10,000 Cash + Autonomous AI Smart Rover Kit, Top 5 get founder mentorship, Top 20 get R&D internships, and all participants keep their kit forever!',
    highlights: [
      '10 Possible Robotics Experiments inside 1 tamper-evident mystery sealed kit',
      'Live 1-on-1 Google Meet Proctored 60-Minute Slot with certified robotics judges',
      '1st Place Champion: ₹10,000 Cash Prize + Balki Autonomous AI Smart Rover Kit',
      'Top 5 Teams: 1-Month 1-on-1 Mentorship directly with Founder Phanindra Balki',
      'Top 20 Teams: 1-Month Remote R&D Internship with Balki Technologies Engineering Lab',
      'Grades 8–12: Solo (₹1,800 Early Bird / ₹2,500 Regular) or Duo (₹2,500 Early Bird / ₹3,000 Regular)',
      '100% Kit Retention: Keep the entire robot hardware, sensors, tools, and arena mat forever!'
    ],
    actionText: 'Explore Official Hackathon Hub (Rules & Experiments)',
    featured: true,
    announcementDetails: {
      fullStory: 'Balki Technologies Pvt. Ltd. is thrilled to officially publish the complete brochure, remote edition rulebook, and curriculum compendium for the Balki RoboCup Hackathon 2027! India\'s most rigorous at-home robotics championship brings school innovators from across the country into live competition via Google Meet. Equipped with an official 2400mm x 1200mm arena challenge mat and a tamper-evident sealed box containing parts for 10 possible robots, students unbox live on camera, assemble their assigned mystery robot in under 35 minutes, and compete across 3 scored field tasks. Registration is open from 1st November to 15th December 2026, with the live national finals on 9th–10th January 2027.',
      impactOnSchools: [
        'National Accreditation: Direct recognition for school Atal Tinkering Labs and student tinkering clubs across all Indian states & UTs.',
        'Mentorship & Industry Exposure: Top 5 teams receive direct 1-month mentorship with Balki Technologies Founder Phanindra Balki, and Top 20 teams earn remote R&D internships.',
        'Zero Kit Return Friction: Every team retains the complete hardware kit, electronic components, and heavy-duty 2400x1200mm arena mat forever for ongoing laboratory tinkering.'
      ],
      technicalHighlights: [
        'The 10 Robots: Autonomous Line & Obstacle Rover, RC Bluetooth Car, ESP32 Wi-Fi Surveillance Bot, 4-DOF Robotic Arm, Soccer Goalkeeper Deflection Bot, Rescue Victim Sorter, Rescue Victim Payload Gripper, Gesture Controlled Rover, Self-Balancing Inverted Pendulum, and Agri-Tech RF Swarm Defender.',
        'Official 100-Point Scorecard: 40 points assembly craftsmanship & speed (under 20 mins = 15 pts, first-time-right = 10 pts, wire hygiene = 10 pts, teamwork = 5 pts) + 60 points task performance (3 tasks @ 20 pts each).',
        'Remote Proctoring Rigor: Dual-camera Google Meet layout (Overhead arena mat view via phone + student workbench view via laptop) with certified live proctor.'
      ],
      officialQuote: {
        text: 'True engineering isn’t following pre-baked cookbook instructions over weeks. It’s opening a box of real sensors, motors, and controllers, understanding circuit topology under the clock, and making intelligent machines solve physical tasks.',
        author: 'Phanindra Balki',
        designation: 'Founder & Chief of Engineering, Balki Technologies'
      }
    }
  },
  {
    id: 'upd-atl-packages',
    type: 'product',
    title: 'Official AIM ATL Equipment Packages & Quotations Published (Packages A, B, C, D & E)',
    subtitle: 'Complete 169-Line Item Lab Hardware Architecture Approved Under NITI Aayog 2026 Guidelines',
    badge: 'OFFICIAL ATL PACKAGES',
    badgeColor: 'blue',
    date: 'October 2026',
    image: '/src/assets/images/atl_turnkey_lab_1792018813842.jpg',
    description: 'Balki Technologies has officially published the comprehensive 2026-27 Atal Tinkering Lab equipment quotations. Covering 169 verified materials across Electronics & IoT (111 items), Robotics & Automation (29 items), AI/ML & Computer Vision (7 items), 3D Printing & Prototyping (22 items), and the Master Turnkey Package E (₹6,97,334 incl. 18% GST).',
    highlights: [
      'Package A: 111 Items · Electronics, Microcontrollers & IoT (₹2,25,414 incl. GST)',
      'Package B: 29 Items · Motors, Steppers, Autonomous Rovers, Relays & EV Kit (₹1,19,122 incl. GST)',
      'Package C: 7 Items · Raspberry Pi 5 8GB, Meta Quest 3S VR & TinyML Kits (₹2,14,766 incl. GST)',
      'Package D: 22 Items · Creality K1C CoreXY 3D Printer, Artis UPS, 3D Pens & Tools (₹1,38,031 incl. GST)',
      'Package E: Turnkey 169-Item Master Lab Consignment with 2-day onsite educator training'
    ],
    productId: 'pkg-prod-e',
    actionText: 'Explore Official ATL Quotation Packages',
    featured: false,
    announcementDetails: {
      fullStory: 'In strict conformance with NITI Aayog\'s Atal Innovation Mission (AIM) equipment guidelines for 2026, Balki Technologies Pvt. Ltd. has formally released the complete educational laboratory hardware procurement packages. Designed to eliminate multi-vendor friction for schools, each package provides 100% itemized transparency with unit rates, quantities, HSN compliance, and 18% GST calculation.',
      impactOnSchools: [
        'Turnkey Lab Setup: School Atal Tinkering Labs can be fully commissioned within 14–21 days of Purchase Order approval.',
        '100% AIM Guidelines Compliance: Every single component is benchmarked against the official NITI Aayog equipment schedule.',
        'Institutional Warranty & Support: 12-Month zero-hassle replacement warranty with complimentary educator capacity building workshops.'
      ],
      technicalHighlights: [
        'Total Line Items: 169 distinct educational components & machines',
        'Turnkey Budget: ₹5,90,960.62 Subtotal + ₹1,06,372.91 GST (18%) = ₹6,97,334.00 Total',
        'Official Reference: BT/ATL/2026-27/E-001 valid across all Indian states and Union Territories'
      ],
      officialQuote: {
        text: 'With this 169-item curriculum architecture, every Atal Tinkering Lab in India receives industrial-grade microcontrollers, AI vision processors, and CoreXY 3D printers rather than flimsy hobby kits.',
        author: 'Er. R. Balki',
        designation: 'Managing Director & Chief of Lab Engineering, Balki Technologies'
      }
    }
  },
  {
    id: 'upd-1',
    type: 'product',
    title: 'Autonomous AI Edge Mobile Robotics Lab Kit (Classes 11–12)',
    subtitle: 'NITI Aayog & NEP Compliant Autonomous Ground Robotics & Computer Vision Platform',
    badge: 'NEW HARDWARE LAUNCH',
    badgeColor: 'amber',
    date: 'September 2026',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    description: 'Equipped with dual-core ESP32 and edge AI vision, 2D LiDAR navigation, ultrasonic distance mapping, and closed-loop motor telemetry. Built specifically for high school and senior secondary students diving into autonomous robotics and smart edge engineering.',
    highlights: [
      'Anodized aluminum alloy crash-resilient modular rover chassis',
      'ROS & Python autonomous waypoint trajectory navigation',
      'Includes high-resolution LiDAR scanner and wireless telemetry module',
      'Accompanied by a 60-page bilingual teacher practical manual'
    ],
    productId: 'mat-prod-134',
    courseId: 'course-4',
    actionText: 'View Autonomous Rover Specs & Pricing',
    featured: true,
    announcementDetails: {
      fullStory: 'Balki Technologies is proud to announce the commercial release of the Autonomous AI Edge Mobile Robotics Lab Kit. Designed in response to the growing demand for hands-on artificial intelligence and mechatronics education in senior secondary schools under NEP 2020 vocational skills frameworks. Unlike toy robotics sets, this kit provides direct hands-on access to closed-loop motor telemetry, IMU orientation calibration, LiDAR mapping, and autonomous obstacle navigation.',
      impactOnSchools: [
        'Enables schools to launch a certified AI Robotics & Automation Club within 48 hours of kit delivery',
        'Includes 2-day onsite training for school physics and computer science educators',
        'Fully covered under Balki Technologies 12-month zero-hassle replacement warranty'
      ],
      technicalHighlights: [
        'Compute: Dual-Core 240MHz ESP32-S3 with edge AI machine vision module',
        'Telemetry: Wi-Fi and Bluetooth BLE real-time sensor telemetry dashboard',
        'Power: High-capacity rechargeable lithium battery pack with smart BMS protection',
        'Sensors: 2D 360° LiDAR, dual ultrasonic sonar rangefinders, and 9-DOF IMU motion sensor'
      ],
      officialQuote: {
        text: 'Our goal with this kit is to transform Indian school students from passive technology consumers into real autonomous robotics and control systems engineers.',
        author: 'Er. R. Balki',
        designation: 'Head of Lab Engineering, Balki Technologies'
      }
    }
  },
  {
    id: 'upd-2',
    type: 'course',
    title: 'NEP 2020 Interactive Course: Autonomous Robotics & Kinematics Control',
    subtitle: 'Hands-on Closed-Loop Control, IMU Feedback & Dynamic Balance Dynamics',
    badge: 'NEW NEP 2020 COURSE',
    badgeColor: 'blue',
    date: 'September 2026',
    image: 'https://images.unsplash.com/photo-1506947411487-a56738267384?auto=format&fit=crop&w=800&q=80',
    description: 'A structured 6-week curriculum with virtual kinematics simulations, interactive wiring diagrams, step-by-step PID motor tuning, and automated student certification.',
    highlights: [
      'Interactive Robotics Simulator integrated directly in browser',
      'Step-by-step PID controller tuning and balance physics theory',
      'Earns verified Tinkering Passport certification upon quiz completion',
      'Approved for Classes 11–12 vocational STEM elective credits'
    ],
    courseId: 'course-4',
    productId: 'mat-prod-134',
    actionText: 'Enroll in Course & Start Lesson',
    featured: false,
    announcementDetails: {
      fullStory: 'To support hands-on robotics education, Balki Technologies has launched a fully digital, self-paced interactive course. Students learn kinematic degrees of freedom, IMU sensor fusion, and closed-loop motor control algorithms.',
      impactOnSchools: [
        'Empowers teachers without prior robotics experience to guide students with confidence',
        'Provides instant objective grading on flight physics quizzes and safety protocols',
        'Tracks Tinkering Hours automatically into each student\'s Passport'
      ],
      technicalHighlights: [
        'Includes 4 multi-chapter lessons with embedded code snippets',
        'Interactive simulation with throttle, pitch, and roll telemetry charts',
        'Automated digital certificate generation with verifiable QR code'
      ]
    }
  },
  {
    id: 'upd-3',
    type: 'product',
    title: 'SRROBOTICS Single Axis Solar Tracking System (100% Working Hands-On Project)',
    subtitle: 'Active Photovoltaic LDR Solar Tracking with Arduino UNO & Dual Sensors',
    badge: 'CLEAN ENERGY HARDWARE',
    badgeColor: 'emerald',
    date: 'August 2026',
    image: '/products/solar_tracker_clean_energy.png',
    description: 'Balki Technologies introduces our flagship single-axis solar tracking project. Features dual Light Dependent Resistors (LDRs), SG90 servo motor pivot, and real-time photovoltaic energy generation telemetry.',
    highlights: [
      'Increases solar panel power harvesting efficiency by up to 40%',
      'Dual-LDR differential optical comparator circuit',
      'Pre-calibrated servo swivel mechanism on eco-friendly stand',
      '12-Month onsite institutional warranty'
    ],
    productId: 'prod-11',
    actionText: 'Inspect Solar Tracker Specifications',
    featured: false,
    announcementDetails: {
      fullStory: 'In response to green energy and sustainability goals in NEP 2020, Balki Technologies launched the SRROBOTICS Single Axis Solar Tracker. Students directly observe and measure the power difference between fixed stationary solar arrays and dynamic sun-tracking arrays.',
      impactOnSchools: [
        'Standard equipment for school environmental clubs and science fair exhibitions',
        'Comes with complete teacher guide on photovoltaic physics and angle of incidence',
        'Equipped with digital voltmeter to record live experimental data'
      ],
      technicalHighlights: [
        'Panel: 6V 150mA Monocrystalline high-efficiency solar panel',
        'Sensors: Dual calibrated cadmium-sulfide LDRs with light partition',
        'Controller: Arduino UNO R3 with smooth servo interpolation'
      ]
    }
  },
  {
    id: 'upd-4',
    type: 'rental',
    title: 'Lab Equipment Rental Fleet: High-Speed 3D Printers & 100MHz DSOs',
    subtitle: 'Zero Capital Lockup: Rent Calibrated Equipment for Science Expos & ATL Marathons',
    badge: 'NEW SERVICE LAUNCHED',
    badgeColor: 'purple',
    date: 'August 2026',
    image: '/products/lab_rental_fleet_3d_dso.png',
    description: 'Schools and student teams preparing for national science fairs can now rent pre-calibrated Bambu CoreXY 3D printers, dual-channel 100MHz digital storage oscilloscopes, and FLIR thermal imagers starting at just ₹650/day.',
    highlights: [
      'Doorstep dispatch in shockproof military-grade flight cases',
      'Includes PLA spools, spare nozzles, and NABL calibration certificates',
      'Complimentary virtual slicing and hardware onboarding session',
      'Flexible rental periods from 2 days to 3 months with easy return'
    ],
    rentalId: 'rent-1',
    actionText: 'Browse Rental Equipment Fleet',
    featured: false,
    announcementDetails: {
      fullStory: 'Recognizing that many schools have temporary need for high-end instruments during annual science exhibitions and ATL Marathons, Balki Technologies has introduced India\'s first verified educational equipment rental service.',
      impactOnSchools: [
        'Saves schools up to 85% compared to purchasing capital-intensive machinery',
        'Zero maintenance or obsolescence worries — all units are latest-generation and serviced',
        'Students get hands-on experience with professional-grade test & measurement gear'
      ],
      technicalHighlights: [
        'Available instruments: CoreXY 3D Printers, 100MHz DSOs, Desktop CNC Rigs, Thermal Cameras, Bipedal Robots',
        'Full insurance coverage and transit damage protection included'
      ]
    }
  },
  {
    id: 'upd-5',
    type: 'company',
    title: 'Government e-Marketplace (GeM) Direct Supplier Certification',
    subtitle: 'Direct Institutional Procurement with Net-30 Terms for Public & KV Schools',
    badge: 'INSTITUTIONAL MILESTONE',
    badgeColor: 'emerald',
    date: 'August 2026',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    description: 'Balki Technologies is now officially verified on the GeM Portal as a certified OEM/Direct Supplier for Atal Tinkering Lab hardware, composite science packages, and robotics modules. Instant PFMS-compliant purchase orders with 30-day institutional credit.',
    highlights: [
      'Registered under GeM Category: Scientific & Educational Laboratory Equipment',
      'Official Net-30 credit terms available for verified educational institutions',
      'Automated GST B2B invoice generation with direct HSN/SAC code compliance',
      'Dedicated institutional relationship desk for quotation requests'
    ],
    actionText: 'Request Institutional GeM Rate Card',
    featured: false,
    announcementDetails: {
      fullStory: 'Government schools, Kendriya Vidyalayas, Navodaya Vidyalayas, and state educational boards can now procure all Balki Technologies kits and replacement components directly through the GeM Portal without complex multi-vendor bidding hurdles.',
      impactOnSchools: [
        'Guaranteed transparent price parity with official NITI Aayog guidelines',
        'Speedy procurement turnaround with Pan-India dispatch from Ambala & Hyderabad hubs',
        'Direct access to all 4 ATL reference packages (P1, P2, P3, P4)'
      ],
      technicalHighlights: [
        'GeM Seller ID: GEM-OEM-BALKI-2026',
        'PFMS (Public Financial Management System) vendor registered'
      ]
    }
  },
  {
    id: 'upd-6',
    type: 'course',
    title: 'Embedded AI & Edge TinyML with ESP32 (Classes 9–10)',
    subtitle: 'Computer Vision, Sensor Fusion & Voice Recognition for High Schoolers',
    badge: 'NEW CURRICULUM MODULE',
    badgeColor: 'blue',
    date: 'July 2026',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    description: 'Train machine learning classification models on your computer and deploy them directly onto tiny microcontrollers. Students build intelligent smart waste sorters, gesture-controlled lights, and voice-activated lab alarms.',
    highlights: [
      'Interactive visual Edge Impulse machine learning workflow',
      'Teaches sensor data collection, feature extraction, and neural inference',
      'Complete with 15 downloadable Arduino/C++ code projects',
      'Balki Certificate of Excellence in Edge AI Prototyping'
    ],
    courseId: 'course-3',
    productId: 'prod-4',
    actionText: 'Open Course & Code Simulator',
    featured: false
  },
  {
    id: 'upd-7',
    type: 'company',
    title: 'National School Tinkering Hackathon 2026 Announced',
    subtitle: '₹5 Lakh Innovation Grant Pool for Class 3–12 Student Creators Across India',
    badge: 'NATIONWIDE INITIATIVE',
    badgeColor: 'rose',
    date: 'July 2026',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    description: 'Registrations are now open for the annual Balki National Tinkering Olympiad. Partner school teams receive free prototyping hardware credits, virtual mentorship from senior IIT and industry engineers, and a chance to win school lab upgrade grants.',
    highlights: [
      'Themes: Sustainable Green Tech, Healthcare Prototyping, Agritech IoT, and Smart Cities',
      'Free component kits sent to the top 100 shortlisted school teams',
      'Grand finale judged by eminent scientists from NITI Aayog and CSIR',
      'School registration is 100% free for verified ATL partner institutions'
    ],
    actionText: 'Register School for Hackathon',
    featured: false,
    announcementDetails: {
      fullStory: 'The Balki National Tinkering Hackathon brings together over 10,000 students from government and private schools across 28 states. Teams build working prototypes solving community problems using Balki sensors, microcontrollers, and recycled materials.',
      impactOnSchools: [
        'Showcase school innovation on national educational media platforms',
        'Top 3 schools receive a fully funded ATL Prototyping Upgrade package worth ₹1.5 Lakhs',
        'Every participant receives an official verified Certificate of Merit'
      ],
      technicalHighlights: [
        'Submission portal opens: October 15, 2026',
        'Mentorship phase: 4 weeks with weekly live engineering Q&A sessions'
      ]
    }
  }
];

export const LIVE_TICKER_ITEMS = [
  {
    id: 'tick-robocup-hackathon',
    badge: 'ROBOCUP 2027',
    text: '🏆 Balki RoboCup Hackathon 2027: "Build it. Code it. Win it!" 10 Robots • 1 Sealed Box • 60 Mins. ₹10,000 + Rover Kit. Registrations Open!',
    actionTab: 'hackathon'
  },
  {
    id: 'tick-atl-1',
    badge: '169-ITEM DOSSIER',
    text: 'Official AIM ATL 2026-27 Equipment Quotations Published: 169 items across Packages A, B, C, D & E with full GST breakdowns.',
    actionTab: 'quotations',
    targetCategory: 'atl-packages'
  },
  {
    id: 'tick-atl-2',
    badge: 'PACKAGE E TURNKEY',
    text: 'Master ATL Turnkey Lab Consignment covers Electronics, Robotics, TinyML AI, and Creality K1C 3D Printing with 12M warranty.',
    actionTab: 'store',
    targetCategory: 'atl-packages'
  },
  {
    id: 'tick-atl-3',
    badge: 'PACKAGE C AI/ML',
    text: 'Raspberry Pi 5 8GB, Meta Quest 3S VR, and Arduino TinyML kits available for immediate school dispatch.',
    actionTab: 'store',
    targetCategory: 'microcontrollers'
  },
  {
    id: 'tick-1',
    badge: 'NEW HARDWARE',
    text: 'Autonomous AI Edge Mobile Robotics Lab Kit (Classes 11–12) now shipping with ROS navigation & LiDAR scanner.',
    actionTab: 'store',
    targetCategory: 'robotics-mechanics'
  },
  {
    id: 'tick-2',
    badge: 'NEP 2020 COURSE',
    text: 'Interactive Robotics Kinematics & Dynamic Balance course unlocked with virtual simulator.',
    actionTab: 'courses',
    targetCourseId: 'course-4'
  },
  {
    id: 'tick-3',
    badge: 'PRECISION OPTICS',
    text: 'Ambala Cantt factory restock: 1000x Compound Microscopes with dual LED & 50 prepared slides.',
    actionTab: 'store',
    targetCategory: 'microscopes-optics'
  },
  {
    id: 'tick-4',
    badge: 'NEW SERVICE',
    text: 'Lab Equipment Rentals launched: Rent CoreXY 3D Printers, DSOs, and Thermal Cameras from ₹650/day.',
    actionTab: 'rentals'
  },
  {
    id: 'tick-5',
    badge: 'GeM PORTAL',
    text: 'Official Government e-Marketplace vendor certification active with Net-30 terms for public schools.',
    actionModal: 'b2b'
  }
];
