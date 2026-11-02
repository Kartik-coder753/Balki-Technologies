import { CompanyUpdate } from '../types';

export const INITIAL_COMPANY_UPDATES: CompanyUpdate[] = [
  {
    id: 'upd-robocup-hackathon',
    type: 'company',
    title: 'National ROBOCUP STEM Hackathon 2026-27 Announced!',
    subtitle: 'Autonomous Robotics, Maze Solvers, AI Vision & Drone Avionics Championship — Coming Soon!',
    badge: 'SPECIAL MENTION · ROBOCUP HACKATHON 2026-27',
    badgeColor: 'amber',
    date: 'Coming Soon (2026-27)',
    image: '/src/assets/images/robotic_arm_kit_1792086690563.jpg',
    description: 'Balki Technologies is proud to announce that the prestigious National ROBOCUP STEM Hackathon 2026-27 is currently being organized! Bringing together school tinkering teams, Atal Tinkering Labs, and budding young roboticists from across India to compete in autonomous robotics, AI computer vision, maze navigation, and drone avionics. Coming soon — be ready for updates!',
    highlights: [
      'Autonomous Maze Navigation & Ultrasonic Obstacle Avoidance Rover Track',
      'AI Edge Computer Vision & Robotic Arm Object Sorting Challenge',
      'Robo-Soccer Tournament: High-Torque Wireless Telemetry Arena',
      'Autonomous Quadcopter Precision Waypoint & Aerial Mapping Mission',
      'Over ₹10,00,000+ in STEM Innovation Grants, Medals & National Recognition'
    ],
    actionText: 'Be Ready For Updates · Pre-Register',
    featured: true,
    announcementDetails: {
      fullStory: 'Balki Technologies Pvt. Ltd. is thrilled to unveil the preliminary announcement for the National ROBOCUP STEM Hackathon 2026-27! Designed to ignite competitive tinkering and engineering rigor across India’s school network, this multi-stage national championship invites students from Classes 6 to 12 as well as polytechnic innovators to build, code, and deploy real-world autonomous hardware systems. Coming soon — keep your sensors calibrated, kits assembled, and stay tuned for the official rulebook and portal opening!',
      impactOnSchools: [
        'National Platform: Gives student tinkerers from Atal Tinkering Labs real-world exposure to competitive robotics and problem solving.',
        'Mentorship & Capacity Building: Free masterclass series on PID motor control, OpenCV computer vision, and ROS/ArduPilot tuning prior to the qualifiers.',
        'Institutional Accreditations: Participating schools earn national STEM Excellence badges, trophies, and hardware grant upgrades.'
      ],
      technicalHighlights: [
        'Competition Arenas: 4 specialized hardware tracks + 1 Open Green IoT Automation track',
        'Team Composition: 3 to 5 student innovators per squad + 1 school faculty mentor',
        'Hardware Guidelines: Compatible with Balki Technologies Pro-Robotics kits, Arduino UNO R3, ESP32, and Raspberry Pi platforms',
        'Timeline: Coming Soon — official registration portal, problem statements, and regional qualifier dates announcing shortly!'
      ],
      officialQuote: {
        text: 'The ROBOCUP Hackathon isn’t just a contest; it’s a national proving ground where school students transition from assembling kits to solving real physical-world challenges with intelligent autonomous hardware.',
        author: 'Er. R. Balki',
        designation: 'Managing Director & Chief of Lab Engineering, Balki Technologies'
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
      'Package B: 29 Items · Motors, Steppers, Drones, Relays & EV Kit (₹1,19,122 incl. GST)',
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
    title: 'Autonomous AI Edge Drone Lab Kit (Classes 11–12)',
    subtitle: 'NITI Aayog & DGCA Compliant Autonomous Quadcopter Prototyping Platform',
    badge: 'NEW HARDWARE LAUNCH',
    badgeColor: 'amber',
    date: 'September 2026',
    image: '/src/assets/images/programmable_drone_kit_1792018816391.jpg',
    description: 'Equipped with open-source ArduPilot avionics, 4K low-latency FPV telemetry, optical flow hovering, and obstacle sensing. Built specifically for high school and senior secondary students diving into aerial robotics and computer vision.',
    highlights: [
      'Carbon-fiber crash-resilient modular quadcopter airframe',
      'ArduPilot & Mission Planner autonomous waypoint programming',
      'Includes USB flight simulator dongle & RC 10-channel transmitter',
      'Accompanied by a 60-page bilingual teacher practical manual'
    ],
    productId: 'prod-7',
    courseId: 'course-4',
    actionText: 'View Drone Kit Specs & Pricing',
    featured: true,
    announcementDetails: {
      fullStory: 'Balki Technologies is proud to announce the commercial release of the Autonomous AI Edge Drone Lab Kit. Designed in response to the growing demand for drone technology education in senior secondary schools under NEP 2020 vocational skills frameworks. Unlike toy drones, this kit provides direct hands-on access to ESC motor telemetry, IMU sensor calibration, telemetry transceivers, and autonomous waypoint navigation.',
      impactOnSchools: [
        'Enables schools to launch a certified Drone & Aeronautics Club within 48 hours of kit delivery',
        'Includes 2-day onsite training for school physics and computer science educators',
        'Fully covered under Balki Technologies 12-month zero-hassle replacement warranty'
      ],
      technicalHighlights: [
        'Avionics: STM32F4-based flight controller with ArduCopter firmware',
        'Telemetry: 915MHz telemetry link with 1.2km ground range',
        'Power: Dual 3S 2200mAh LiPo batteries with balance safety charger',
        'Sensors: Dual barometers, optical flow camera, and ultrasonic altimeter'
      ],
      officialQuote: {
        text: 'Our goal with this kit is to transform Indian school students from mere consumer drone operators into real aerial aeronautical engineers and firmware programmers.',
        author: 'Er. R. Balki',
        designation: 'Head of Lab Engineering, Balki Technologies'
      }
    }
  },
  {
    id: 'upd-2',
    type: 'course',
    title: 'NEP 2020 Interactive Course: Autonomous Quadcopters & Drone Avionics',
    subtitle: 'Hands-on Aerodynamics, Waypoint Navigation & Safe Flight Dynamics',
    badge: 'NEW NEP 2020 COURSE',
    badgeColor: 'blue',
    date: 'September 2026',
    image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80',
    description: 'A structured 6-week curriculum with virtual aerodynamic simulations, interactive wiring diagrams, step-by-step ArduPilot tuning, and automated student certification.',
    highlights: [
      'Interactive Flight Simulator integrated directly in browser',
      'Step-by-step PID controller tuning and flight physics theory',
      'Earns verified Tinkering Passport certification upon quiz completion',
      'Approved for Classes 11–12 vocational STEM elective credits'
    ],
    courseId: 'course-4',
    productId: 'prod-7',
    actionText: 'Enroll in Course & Start Lesson',
    featured: false,
    announcementDetails: {
      fullStory: 'To support the physical Drone Lab Kit, Balki Technologies has launched a fully digital, self-paced interactive course. Students learn lift-to-drag ratios, gyroscopic precession, and fail-safe return-to-launch procedures before ever flying outdoors.',
      impactOnSchools: [
        'Empowers teachers without prior drone experience to guide students with confidence',
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
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
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
    image: 'https://images.unsplash.com/photo-1631557559471-ae60769556ff?auto=format&fit=crop&w=800&q=80',
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
        'Available instruments: CoreXY 3D Printers, 100MHz DSOs, Drone Rigs, Thermal Cameras, Bipedal Robots',
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
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
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
    badge: 'ROBOCUP HACKATHON',
    text: '🏆 National ROBOCUP STEM Hackathon 2026-27 is being organized! Autonomous rovers, AI vision & drones — Coming Soon, be ready for updates!',
    actionTab: 'home'
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
    text: 'Autonomous AI Edge Drone Lab Kit (Classes 11–12) now shipping with ArduPilot avionics & 4K FPV link.',
    actionTab: 'store',
    targetCategory: 'drone-3d'
  },
  {
    id: 'tick-2',
    badge: 'NEP 2020 COURSE',
    text: 'Interactive Drone Avionics & Waypoint Navigation course unlocked with virtual flight simulator.',
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
