export interface HackathonExperiment {
  id: number;
  number: string;
  title: string;
  category: string;
  tagline: string;
  image: string;
  secondaryImage?: string;
  hardware: string[];
  whatYouWillDo: string[];
  tasks: {
    id: number;
    title: string;
    points: number;
    description: string;
    criteria: string;
  }[];
  skillsGained: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  timeEstimate: string;
}

export interface HackathonTimelineStep {
  date: string;
  title: string;
  subtitle: string;
  iconName: string;
  status: 'upcoming' | 'active' | 'completed';
}

export interface HackathonDoc {
  id: string;
  title: string;
  filename: string;
  size: string;
  description: string;
  path: string;
  badge: string;
}

export const HACKATHON_METADATA = {
  edition: 'National Remote Edition 2026-27',
  brandName: 'Balki RoboCup Hackathon 2027',
  tagline: 'Build it. Code it. Win it!',
  subtagline: "India's Most Rigorous At-Home STEM Robotics Championship",
  format: '10 Robots • 1 Mystery Sealed Kit • 60-Minute Live Build',
  eligibility: 'Grades 8 to 12 (Solo or Duo Innovation Teams)',
  proctoringPlatform: 'Google Meet Live Dual-Camera Proctoring',
  dates: {
    registrationStart: '1st November 2026',
    earlyBirdEnd: '30th November 2026',
    registrationEnd: '15th December 2026',
    dispatchStart: '16th December 2026',
    finalsDates: '9th – 10th January 2027',
    resultsDate: '16th – 17th January 2027'
  },
  pricing: {
    solo: {
      regular: 2500,
      earlyBird: 1800,
      label: 'Solo Innovator (1 Student)'
    },
    duo: {
      regular: 3000,
      earlyBird: 2500,
      label: 'Duo Team (2 Students)'
    },
    includes: [
      'Complete hardware kit with parts to build all 10 robotics experiments',
      'Official 2400mm x 1200mm printed arena & challenge mat',
      'Essential screwdrivers, jumper wires & battery packs',
      'Live 1-on-1 certified Google Meet judge proctoring slot',
      'Students KEEP their robotics kit forever after the hackathon',
      'Government / AIM-recognized participation certificates for all participants'
    ]
  },
  prizes: [
    {
      place: '1st Place Champion',
      cash: '₹10,000 Cash Prize',
      hardware: 'Balki Q250 Quadcopter Drone Kit',
      badge: 'NATIONAL CHAMPION · 1ST PRIZE',
      perks: '₹10,000 Direct Cash Transfer + Complete Balki Q250 DIY Drone Flight Kit + Official National Gold Champion Trophy & Accreditation.',
      detailedBenefits: [
        'Direct cash award of ₹10,000 to the winning student or duo team',
        'Balki Q250 DIY Quadcopter Drone Kit with flight controller, brushless motors & ESCs',
        'National Champion Trophy & Certificates recognized across India',
        'Spotlight interview featured on Balki Technologies National STEM Network'
      ],
      highlight: true,
      color: 'amber'
    },
    {
      place: 'Top 5 Finalist Teams',
      cash: '1-Month Founder Mentorship',
      hardware: '1-on-1 Direct Access',
      badge: 'EXECUTIVE INCUBATION · TOP 5',
      perks: '1-Month Intensive 1-on-1 Engineering & Career Mentorship directly with Founder & Chief Engineer Phanindra Balki.',
      detailedBenefits: [
        'Weekly 1-on-1 private video mentorship sessions with founder Phanindra Balki',
        'Project incubation & guidance on transforming prototypes into real tech startups or patents',
        'Personalized engineering roadmap, portfolio review, and prestigious college application guidance',
        'Direct access to Balki Technologies senior lab engineers for hardware/software architecture'
      ],
      highlight: true,
      color: 'cyan'
    },
    {
      place: 'Top 20 Innovative Teams',
      cash: '1-Month Remote R&D Internship',
      hardware: 'Lab Industry Placement',
      badge: 'INDUSTRY EXPERIENCE · TOP 20',
      perks: '1-Month Remote Research & Development (R&D) Internship with Balki Technologies Engineering Laboratory.',
      detailedBenefits: [
        'Official 1-Month Remote R&D Internship working on real robotics & edge AI firmware',
        'Hands-on engineering experience contributing to open-source hardware and IoT firmware',
        'Verified Certificate of Internship Completion and Official Letter of Recommendation (LOR)',
        'Priority evaluation for future hardware research grants and STEM ambassador fellowships'
      ],
      highlight: true,
      color: 'blue'
    }
  ],
  arenaSpecs: {
    matDimensions: '2400 mm x 1200 mm Heavy Flex Mat',
    surfaces: 'Matte anti-reflective white vinyl with 19mm high-contrast black guidance tape',
    keyFeatures: [
      { name: 'Comb Obstacle Course', desc: 'Tight S-curve line with rapid alternating left/right sweeps' },
      { name: 'Straight Dash 1200mm', desc: 'Maximum velocity stability corridor' },
      { name: 'Fork Decision Junction', desc: 'Dual-path branching requiring autonomous direction logic' },
      { name: 'Line Gaps (100mm)', desc: 'Sensor blind spots testing inertial dead-reckoning' },
      { name: 'See-Saw Ramp Section', desc: 'Inclined dynamic tilt platform testing torque & center of gravity' },
      { name: 'Balls in Hole Hazard', desc: 'Target collection / deflection well' },
      { name: 'Axe Gate Obstacle', desc: 'Narrow mechanical portal clearance zone' },
      { name: 'Luggage Pedestal & Sorting X', desc: 'Elevation platform for robotic arm pick, sort, and place' },
      { name: 'ArUco Vision Markers', desc: 'Dictionary 4x4_50 fiducial markers for ESP32 optical localization' }
    ]
  },
  slotStructure: [
    {
      time: '00:00 – 05:00',
      title: 'Kit Inspection & Unboxing',
      desc: 'Judge inspects tamper-evident security seal over camera. Mystery challenge assignment revealed live.'
    },
    {
      time: '05:00 – 35:00',
      title: 'Live Mechanical & Electrical Assembly',
      desc: '30-minute high-speed assembly. Fastening motors, mounting sensors, wiring breadboards and microcontrollers.'
    },
    {
      time: '35:00 – 38:00',
      title: 'Judge Technical Assembly Check',
      desc: 'Judge verifies wiring safety, ground lines, and polarity before the robot is powered on for the first time.'
    },
    {
      time: '38:00 – 55:00',
      title: 'Calibration & 2 Official Task Attempts',
      desc: 'Code flashing, PID sensor calibration, and 2 official runs on the 2400x1200mm arena mat.'
    },
    {
      time: '55:00 – 60:00',
      title: 'Final Scorecard Tally & Signoff',
      desc: 'Judge audits task completion points, applies time bonuses and penalties, locks official scoresheet.'
    }
  ],
  scorecard: {
    assemblyPoints: 40,
    taskPoints: 60,
    totalPoints: 100,
    breakdown: [
      {
        category: 'Assembly Speed & Efficiency',
        maxPoints: 15,
        criteria: '< 20 mins: 15 pts | 20–30 mins: 12 pts | 30–40 mins: 8 pts | 40–50 mins: 4 pts | > 50 mins: 0 pts'
      },
      {
        category: 'First-Time-Right Verification',
        maxPoints: 10,
        criteria: 'Full 10 pts if board boots and all motors/sensors respond without rewiring on initial power-up'
      },
      {
        category: 'Build Quality & Wire Management',
        maxPoints: 10,
        criteria: 'Neat zip-ties, zero loose dangling jumper wires, solid fastener rigidity and chassis symmetry'
      },
      {
        category: 'Teamwork & Workbench Discipline',
        maxPoints: 5,
        criteria: 'Organized tool placement, ESD safety awareness, clear communication between duo team members'
      },
      {
        category: 'Task 1: Baseline Autonomous Navigation',
        maxPoints: 20,
        criteria: 'Successful completion of core track objective or initial sensor maneuver'
      },
      {
        category: 'Task 2: Dynamic Obstacle / Decision Handling',
        maxPoints: 20,
        criteria: 'Accurate deflection, sorting, gesture response, or bypass without track departure'
      },
      {
        category: 'Task 3: Precision Target / Speed Challenge',
        maxPoints: 20,
        criteria: 'Flawless precision stop, multi-cube vertical stack, or high-speed run within time allowance'
      }
    ],
    penalties: [
      { label: 'Manual Intervention (Touching robot during live run)', penalty: '-5 points per occurrence' },
      { label: 'Full Arena Mat Boundary Departure', penalty: '-3 points per occurrence' },
      { label: 'Sensor Cable Disconnect in Motion', penalty: '-2 points per occurrence' }
    ]
  }
};

export const HACKATHON_DOCUMENTS: HackathonDoc[] = [
  {
    id: 'doc-brochure',
    title: 'Official RoboCup Hackathon 2027 Brochure',
    filename: 'RoboCup_Hackathon_2027_Brochure__1__2f828f38.pdf',
    size: '1.8 MB PDF',
    badge: 'Official Brochure',
    description: 'Complete visual brochure featuring theme "Build it. Code it. Win it!", eligibility, cash prizes, dates, sealed box format, and mentorship perks.',
    path: '/hackathon/RoboCup_Hackathon_2027_Brochure__1__2f828f38.pdf'
  },
  {
    id: 'doc-rulebook',
    title: 'Balki RoboCup Remote Edition Official Rulebook',
    filename: 'Balki_Robocup_2026_Remote_Edition_Rulebook__2__d0597cfb.pdf',
    size: '850 KB PDF',
    badge: 'Official Rulebook',
    description: 'Detailed remote edition rules, dual-camera Google Meet setup, tamper-evident sealed box protocol, 1-hour schedule, and scoring manual.',
    path: '/hackathon/Balki_Robocup_2026_Remote_Edition_Rulebook__2__d0597cfb.pdf'
  },
  {
    id: 'doc-tasks',
    title: 'Test & Task Summary Specification (v2)',
    filename: 'Balki_Robocup_Test_and_Task_Summary_v2.docx_4e196d44.pdf',
    size: '420 KB PDF',
    badge: 'Task Summary',
    description: 'Technical task rubric for each robot, 60-point task evaluation breakdowns, arena dimensions, tolerances, and scoring penalty criteria.',
    path: '/hackathon/Balki_Robocup_Test_and_Task_Summary_v2.docx_4e196d44.pdf'
  },
  {
    id: 'doc-experiments',
    title: 'Comprehensive Robotics Experiments Compendium',
    filename: 'Experiments_e7ab21d5.pdf',
    size: '2.1 MB PDF',
    badge: 'Experiments Guide',
    description: 'Hardware circuit schematics, wiring pinouts, sensor operational principles, and algorithm descriptions for all 10 hackathon robots.',
    path: '/hackathon/Experiments_e7ab21d5.pdf'
  }
];

export const HACKATHON_EXPERIMENTS: HackathonExperiment[] = [
  {
    id: 1,
    number: '01',
    title: 'The Autonomous Line-Follower & Obstacle Bot',
    category: 'Autonomous Mobile Robotics',
    tagline: 'Precision PID line-tracking with ultrasonic dynamic obstacle detour',
    image: '/hackathon/Screenshot_2026-10-30_142603_66930140.png',
    secondaryImage: '/hackathon/Screenshot_2026-10-30_144404_64df2d59.png',
    hardware: [
      'Arduino UNO R3 / Nano Microcontroller',
      'Dual TCRT5000 IR Line Sensor Array',
      'HC-SR04 Ultrasonic Sonar Distance Sensor',
      'L298N / Dual H-Bridge DC Motor Driver Shield',
      'High-Torque 300 RPM Bo Motors with Grippy Rubber Wheels',
      '2x 18650 3.7V Li-ion Battery Power Array with DC Jack'
    ],
    whatYouWillDo: [
      'Mount the dual reflectance infrared sensors 8mm above the mat surface for optimal analog thresholds',
      'Program a differential steering PID loop to lock onto the 19mm black guideline around high-g curves',
      'Integrate HC-SR04 sonar interrupt to halt 12cm before an obstacle, execute an arc detour, and reacquire the line',
      'Calibrate stop sensor logic to halt precisely within the yellow checkered arrival bay'
    ],
    tasks: [
      {
        id: 1,
        title: 'Task 1: Continuous Line Following Through 90° Bends',
        points: 20,
        description: 'Robot must traverse 2.4m track including sharp 90-degree corners without losing tracking line.',
        criteria: '20 pts for full unbroken run; -5 pts for each line loss recovery.'
      },
      {
        id: 2,
        title: 'Task 2: Dynamic Ultrasonic Obstacle Detour',
        points: 20,
        description: 'Detect wooden obstacle block placed randomly, execute semicircular detour, re-lock onto track within 30cm.',
        criteria: '20 pts if zero collision and smooth re-lock; -10 pts if obstacle is displaced.'
      },
      {
        id: 3,
        title: 'Task 3: High-Precision Terminal Braking',
        points: 20,
        description: 'Detect arrival marker and execute emergency motor brake completely inside the 15x15cm finish box.',
        criteria: '20 pts for all 4 wheels inside stop box; 10 pts if front axle only inside.'
      }
    ],
    skillsGained: ['PID Closed-Loop Tuning', 'Ultrasonic Ping Timing', 'Differential Steering Kinetics', 'PWM Speed Modulation'],
    difficulty: 'Intermediate',
    timeEstimate: '35 mins assembly • 15 mins calibration'
  },
  {
    id: 2,
    number: '02',
    title: 'RC Bluetooth Smart Car / Telemetry Car',
    category: 'Wireless Teleoperation',
    tagline: 'High-speed wireless maneuvering with custom mobile telemetry control',
    image: '/hackathon/Screenshot_2026-10-30_144404_64df2d59.png',
    secondaryImage: '/hackathon/Screenshot_2026-10-30_142603_66930140.png',
    hardware: [
      'HC-05 / HC-06 Bluetooth 2.0+EDR Wireless Module',
      'Arduino UNO Controller Core',
      '4WD Acrylic Heavy-Duty Chassis',
      'L298N High-Current Dual H-Bridge Driver',
      'RGB Status LED Indicator for Bluetooth Pairing & Speed States'
    ],
    whatYouWillDo: [
      'Wire the HC-05 TX/RX pins with a 3.3V resistor voltage divider for safe TTL communication',
      'Develop an asynchronous UART packet listener parsing single-byte drive commands ("F", "B", "L", "R", "S")',
      'Pair smartphone app over Bluetooth and tune responsive steering curves and brake damping',
      'Navigate the reverse parking challenge into a narrow parallel parking bay with tight tolerances'
    ],
    tasks: [
      {
        id: 1,
        title: 'Task 1: Pairing & Slalom Agility Course',
        points: 20,
        description: 'Pair within 60 seconds and complete an S-bend slalom course weaving between 4 pylon markers.',
        criteria: '20 pts for clean run under 25s; -2 pts for each knocked pylon.'
      },
      {
        id: 2,
        title: 'Task 2: Blind-Zone Reverse Parallel Parking',
        points: 20,
        description: 'Back the 4WD chassis into the 20x25cm parking bay using only mirror/rear phone steering.',
        criteria: '20 pts for centered parking with < 2cm gap from curb; 10 pts if slightly angled.'
      },
      {
        id: 3,
        title: 'Task 3: Sprint & Instant E-Brake Deceleration',
        points: 20,
        description: 'Accelerate at 100% throttle across the 1200mm straight dash and lock brakes before danger line.',
        criteria: '20 pts for stopping within 10cm before line; 0 pts if chassis crosses danger line.'
      }
    ],
    skillsGained: ['UART Serial Communication', 'Wireless Telemetry', 'Baud Rate Synchronization', 'Mobile App Protocol Design'],
    difficulty: 'Beginner',
    timeEstimate: '25 mins assembly • 10 mins calibration'
  },
  {
    id: 3,
    number: '03',
    title: 'ESP32 Wi-Fi Surveillance / Web-Controlled Bot',
    category: 'IoT & Remote Video Telepresence',
    tagline: 'Live camera streaming, remote driving, maze navigation and target identification',
    image: '/hackathon/Screenshot_2026-10-30_143005_19b6e0a0.png',
    hardware: [
      'ESP32-CAM AI-Thinker Board with OV2640 2MP Camera Sensor',
      'Dual Core 240MHz Xtensa Processor with Onboard Wi-Fi & Bluetooth',
      'Micro-Servo Pan-Tilt Gimbal for Camera Elevation',
      'High-Brightness Night Vision Flash LED',
      'Compact 4WD Chassis with Independent Motor Control'
    ],
    whatYouWillDo: [
      'Flash asynchronous MJPEG video streaming server firmware hosting web controls directly on ESP32',
      'Connect operator laptop to ESP32 Wi-Fi Access Point to access live dashboard UI with virtual joystick',
      'Drive the bot from behind a visual partition solely by observing the live video feed',
      'Locate and decode hidden ArUco target markers scattered within the labyrinth'
    ],
    tasks: [
      {
        id: 1,
        title: 'Task 1: Video Telepresence Feed Initiation',
        points: 20,
        description: 'Boot web server, project live 15+ FPS video to judge screen, and toggle onboard searchlight.',
        criteria: '20 pts for clear latency-free stream established under 3 minutes.'
      },
      {
        id: 2,
        title: 'Task 2: Blind Maze Navigation Via Live Feed',
        points: 20,
        description: 'Pilot robot through blind walled maze with student turned away from arena, relying 100% on camera.',
        criteria: '20 pts for maze exit under 90s; -5 pts for wall collisions.'
      },
      {
        id: 3,
        title: 'Task 3: Optical Target Identification & Code Readout',
        points: 20,
        description: 'Aim pan-tilt camera at distant target symbol, identify character/ArUco ID, and vocalize to judge.',
        criteria: '20 pts for exact character match on first attempt.'
      }
    ],
    skillsGained: ['Embedded Web Server Architecture', 'MJPEG Video Streaming', 'WebSockets / HTTP POST Control', 'FPV Teleoperation'],
    difficulty: 'Advanced',
    timeEstimate: '35 mins assembly • 20 mins calibration'
  },
  {
    id: 4,
    number: '04',
    title: 'DIY Robotic Arm (4-DOF Pick and Place)',
    category: 'Industrial Mechatronics & Kinematics',
    tagline: 'Servo control, object manipulation, pick-and-place tasks and multi-cube stacking',
    image: '/hackathon/Screenshot_2026-10-30_143320_5a26986c.png',
    hardware: [
      'Laser-Cut Acrylic / Aluminum 4-DOF Articulated Arm Frame',
      '4x MG996R / SG90 Metal-Gear High-Torque Servo Actuators',
      'Arduino UNO with 16-Channel PWM Servo Driver Board',
      'Potentiometer Joystick Matrix / Serial Command Console',
      'Machined Mechanical Claw Gripper with Silicone Friction Pads'
    ],
    whatYouWillDo: [
      'Assemble base rotation, shoulder, elbow, and gripper linkages with strict mechanical centering',
      'Calibrate servo PWM pulse widths (544µs to 2400µs) to prevent binding and servo motor burnout',
      'Program automated pick-and-place trajectories using smooth inverse-kinematic interpolation',
      'Execute vertical cube stacking requiring sub-3mm precision'
    ],
    tasks: [
      {
        id: 1,
        title: 'Task 1: Base & Elbow Kinematic Calibration',
        points: 20,
        description: 'Demonstrate smooth 0° to 180° swing of base and full vertical reach without servo jitter.',
        criteria: '20 pts for silent, jitter-free zero-position alignment.'
      },
      {
        id: 2,
        title: 'Task 2: Pick & Place Precision Transfer',
        points: 20,
        description: 'Pick 25mm cube from Pick Zone A and transfer across 180° arc into narrow drop bin.',
        criteria: '20 pts for drop without dropping early or knocking container.'
      },
      {
        id: 3,
        title: 'Task 3: 3-Cube Vertical Tower Stacking Challenge',
        points: 20,
        description: 'Pick 3 distinct colored cubes in sequence and stack vertically into a freestanding tower.',
        criteria: '20 pts for 3-cube tower standing stable for 10+ seconds; 12 pts for 2-cube stack.'
      }
    ],
    skillsGained: ['Forward & Inverse Kinematics', 'Multi-Axis Servo Synchronization', 'PWM Angle Mapping', 'Center-of-Mass Load Balancing'],
    difficulty: 'Intermediate',
    timeEstimate: '40 mins assembly • 15 mins calibration'
  },
  {
    id: 5,
    number: '05',
    title: 'RCJ Soccer "Keeper / Goalie" Penalty Deflection Bot',
    category: 'Autonomous Sports Robotics',
    tagline: 'Ball detection, reaction timing, shot deflection and goalkeeper positioning',
    image: '/hackathon/Screenshot_2026-10-30_143602_a22a1f0b.png',
    hardware: [
      'High-Speed Lateral Deflection Chassis with Broad Front Bumper',
      'Dual HC-SR04 / Sharp IR Range Finders for Ball Trajectory Sensing',
      'Arduino UNO High-Clock Cycle Processing Loop',
      'Fast 600 RPM Metal Gearmotors with Optical Quadrature Encoders',
      'Wide Curved Deflector Shield to Parrying Incoming Shots'
    ],
    whatYouWillDo: [
      'Fabricate and mount the wide goalie deflection blade at legal 20cm competition width',
      'Program ultra-fast 10ms polling loop calculating approaching ball vector and velocity',
      'Execute lateral strafe maneuvers across the 60cm penalty box line to intercept rolled balls',
      'Deflect high-speed strikes away from the goal mouth into designated clearance wings'
    ],
    tasks: [
      {
        id: 1,
        title: 'Task 1: Boundary Constraint & Zero Foul Holding',
        points: 20,
        description: 'Remain 100% inside the green goalkeeper boundary line during continuous back-and-forth patrolling.',
        criteria: '20 pts for 30s patrol without crossing goal line.'
      },
      {
        id: 2,
        title: 'Task 2: 5-Shot Penalty Deflection Test',
        points: 20,
        description: 'Judge rolls 5 official balls toward the goal from 1 meter distance at varying angles.',
        criteria: '4 pts per deflected ball (Max 20 pts for stopping all 5 shots).'
      },
      {
        id: 3,
        title: 'Task 3: Active Counter-Clearance Kickout',
        points: 20,
        description: 'Upon deflecting, robot must push ball forward at least 20cm away from the danger zone.',
        criteria: '20 pts for successful clearing impulse; 10 pts for passive bounce.'
      }
    ],
    skillsGained: ['High-Speed Sensor Polling', 'Vector Trajectory Prediction', 'Rotary Encoder PID Tuning', 'RoboCup Junior Regulations'],
    difficulty: 'Intermediate',
    timeEstimate: '30 mins assembly • 15 mins calibration'
  },
  {
    id: 6,
    number: '06',
    title: 'RCJ Rescue "Victim Sorter" Rover',
    category: 'Disaster Relief & Search Robotics',
    tagline: 'Autonomous color classification, victim triage, and dual-zone sorting gates',
    image: '/hackathon/Screenshot_2026-10-30_143951_14fea82e.png',
    hardware: [
      'TCS3200 / TCS34725 High-Accuracy I2C RGB Color Sensor',
      'Dual Compartment Trapdoor Servo Mechanism',
      'Arduino Microcontroller Core with OLED Telemetry Display',
      '4-Wheel Independent Suspension Rover Frame',
      'High-Intensity Pure White Illumination LEDs for Consistent Color Readings'
    ],
    whatYouWillDo: [
      'Calibrate TCS3200 frequency counters against Silver (Live Victim) and Black (Deceased Victim) standard pucks',
      'Drive into simulated debris collapse zone and position over victim cylinders',
      'Read RGB spectral values, classify triage priority in software, and actuate corresponding trapdoor',
      'Transport live victims to the green evacuation pad while isolating deceased payloads'
    ],
    tasks: [
      {
        id: 1,
        title: 'Task 1: Color Discrimination & OLED Readout',
        points: 20,
        description: 'Accurately distinguish between silver and black victim tokens under variable ambient light.',
        criteria: '20 pts for 100% classification accuracy on 4 consecutive samples.'
      },
      {
        id: 2,
        title: 'Task 2: Dual-Zone Automated Triage Gate Action',
        points: 20,
        description: 'Direct Silver token to Left Chamber and Black token to Right Chamber via internal servo gate.',
        criteria: '20 pts for zero routing errors in under 45 seconds.'
      },
      {
        id: 3,
        title: 'Task 3: Autonomous Triage Drop in Evacuation Zone',
        points: 20,
        description: 'Navigate to Green Evacuation Zone on mat and deposit all silver victims safely inside perimeter.',
        criteria: '20 pts for depositing payload 100% inside evacuation boundary.'
      }
    ],
    skillsGained: ['RGB Color Space Mapping', 'Light Frequency Transduction', 'Multi-Compartment Sorting Actuation', 'Disaster Robotics Protocol'],
    difficulty: 'Intermediate',
    timeEstimate: '35 mins assembly • 15 mins calibration'
  },
  {
    id: 7,
    number: '07',
    title: 'RCJ Rescue "Victim Payload Gripper" (Full Mobile Build)',
    category: 'Mobile Search & Retrieval Robotics',
    tagline: 'Chassis + 2-DOF heavy gripper claw, incline climbing and precision payload retrieval',
    image: '/hackathon/Screenshot_2026-10-30_144919_4e1b3e96.png',
    hardware: [
      'Full Mobile Robot Chassis with Integrated 2-DOF Front Gripper',
      'Metal-Gear Servos for Heavy Payload Clamping Force',
      'High-Traction Treaded Rubber Drive Wheels for 15° Incline Ramps',
      'Ultrasonic Object Locator Sensor Mounted on Gripper Bridge',
      'Dual 18650 Li-ion Independent Motor Power Bus'
    ],
    whatYouWillDo: [
      'Integrate the mechanical gripper claw directly onto the front bulkhead of the mobile rover',
      'Balance chassis weight distribution to prevent forward tipping when lifting a 150g steel victim cylinder',
      'Climb the 15-degree inclined ramp on the challenge mat, dock with the payload, and close the gripper securely',
      'Reverse down the slope and deposit the payload into the elevated drop receptacle'
    ],
    tasks: [
      {
        id: 1,
        title: 'Task 1: Ramp Climbing & Slope Stability',
        points: 20,
        description: 'Ascend 15° inclined ramp, pause mid-slope for 3 seconds without sliding, and reach top platform.',
        criteria: '20 pts for clean climb without wheel slip or stall.'
      },
      {
        id: 2,
        title: 'Task 2: Ultrasonic Automated Dock & Clamp',
        points: 20,
        description: 'Detect victim cylinder at 10cm, creep forward slowly, and execute tight claw clamp.',
        criteria: '20 pts for automated grasp without pushing cylinder off platform.'
      },
      {
        id: 3,
        title: 'Task 3: Controlled Descent & Precision Deposit',
        points: 20,
        description: 'Reverse down ramp carrying payload and drop into target container without dropping early.',
        criteria: '20 pts for secure deposit in drop container.'
      }
    ],
    skillsGained: ['Center of Gravity Optimization', 'Torque-to-Weight Gearing', 'Incline Traction Dynamics', 'Automated Grasping Routines'],
    difficulty: 'Advanced',
    timeEstimate: '40 mins assembly • 15 mins calibration'
  },
  {
    id: 8,
    number: '08',
    title: 'Gesture Controlled Robot',
    category: 'Human-Machine Interface (HMI)',
    tagline: 'Control the robot using hand gestures, motion sensors and smart wireless telemetry',
    image: '/hackathon/Screenshot_2026-10-30_144147_49b908a2.png',
    hardware: [
      'MPU-6050 6-Axis Accelerometer & Gyroscope IMU Module',
      'Hand-Worn Sensor Glove / Controller Strap with Arduino Nano',
      'nRF24L01+ 2.4GHz High-Speed RF Wireless Transceiver Pair',
      '4WD Smart Rover with Onboard Arduino UNO Receiver Core',
      'Ultra-Low Latency Packet Protocol Firmware'
    ],
    whatYouWillDo: [
      'Wire the MPU-6050 sensor to an Arduino Nano strapped to the operator’s hand',
      'Calculate Pitch and Roll tilt angles using complementary filtering to eliminate noise and drift',
      'Transmit gesture codes over 2.4GHz RF to the mobile robot with under 15ms latency',
      'Control robot forward, backward, turns, and instant palm-flat emergency braking'
    ],
    tasks: [
      {
        id: 1,
        title: 'Task 1: 4-Way Gesture Recognition Test',
        points: 20,
        description: 'Tilt hand forward, backward, left, and right; demonstrate corresponding robot motions on cue.',
        criteria: '20 pts for 4/4 immediate responses without misinterpretation.'
      },
      {
        id: 2,
        title: 'Task 2: Figure-8 Agility Course Driving',
        points: 20,
        description: 'Maneuver robot through a complete figure-8 loop between two arena pylons purely via hand gestures.',
        criteria: '20 pts for completing loop in under 40s without touching markers.'
      },
      {
        id: 3,
        title: 'Task 3: Palm-Flat Emergency Brake Challenge',
        points: 20,
        description: 'Drive robot toward an obstacle wall at speed and execute flat-hand gesture to halt within 5cm.',
        criteria: '20 pts for halting within 5cm buffer without touching wall.'
      }
    ],
    skillsGained: ['6-Axis IMU Sensor Filtering', 'I2C Bus Communication', 'RF Transceiver Networking', 'Wearable HMI Ergonomics'],
    difficulty: 'Intermediate',
    timeEstimate: '35 mins assembly • 15 mins calibration'
  },
  {
    id: 9,
    number: '09',
    title: 'Self-Balancing Robot (Two-Wheeled Inverted Pendulum)',
    category: 'Advanced Control Theory & Dynamics',
    tagline: 'Inverted pendulum equilibrium, Kalman filtering, high-frequency PID balance loop',
    image: '/hackathon/Screenshot_2026-10-30_144754_0b6c1a03.png',
    hardware: [
      'MPU-6050 6-Axis IMU Mounted at Center-of-Mass Node',
      'Dual High-Speed Coreless / Encoder DC Gearmotors',
      'Arduino UNO / Nano running 200Hz Hardware Timer Loop',
      'Vertical 2-Wheeled Acrylic Upright Chassis Frame',
      'High-Discharge 7.4V Li-Po / 18650 Battery Array for Instant Reverse Torque'
    ],
    whatYouWillDo: [
      'Mount the MPU6050 sensor with vibration-damping grommets precisely on the vertical chassis axis',
      'Implement a 5ms discrete PID loop feeding angle and angular rate into motor PWM registers',
      'Calibrate Proportional gain for response speed, Derivative gain for damping, and Integral gain for zero-offset',
      'Achieve steady upright balance, resist mechanical impulse pushes, and drive while balancing'
    ],
    tasks: [
      {
        id: 1,
        title: 'Task 1: Autonomous Upright Balance Equilibrium',
        points: 20,
        description: 'Release robot from hand; it must self-stabilize and hold upright position for > 30 seconds.',
        criteria: '20 pts for 30s uninterrupted balance without human touch.'
      },
      {
        id: 2,
        title: 'Task 2: Mechanical Push Disturbance Recovery',
        points: 20,
        description: 'Judge applies a light forward and backward push with a pen; robot must recover without toppling.',
        criteria: '20 pts for recovering balance after 2 consecutive push disturbances.'
      },
      {
        id: 3,
        title: 'Task 3: Controlled Translation While Balancing',
        points: 20,
        description: 'Command robot to drive 50cm forward, stop, and reverse 50cm back while maintaining equilibrium.',
        criteria: '20 pts for controlled translation without tipping over.'
      }
    ],
    skillsGained: ['Inverted Pendulum Mathematics', 'Discrete PID Loop Design', 'Complementary/Kalman Filtering', 'Dynamic Motor Back-EMF Compensation'],
    difficulty: 'Advanced',
    timeEstimate: '35 mins assembly • 25 mins calibration'
  },
  {
    id: 10,
    number: '10',
    title: 'Smart Agricultural Mini-Lab & RF Swarm Defender Bot',
    category: 'Agri-Tech & Swarm Wireless Robotics',
    tagline: 'Autonomous soil moisture sensing, automated water pumping, and wireless intruder patrol',
    image: '/hackathon/Screenshot_2026-10-30_142603_66930140.png',
    secondaryImage: '/hackathon/Screenshot_2026-10-30_143005_19b6e0a0.png',
    hardware: [
      'Corrosion-Resistant Capacitive Soil Moisture Sensor Probe',
      '5V Submersible Micro-Water Pump with Silicone Tubing',
      '5V Optocoupler-Isolated Solid State Relay Module',
      'nRF24L01 2.4GHz RF Communication Node',
      'Autonomous Swarm Rover with Ultrasonic Perimeter Scanning Sensor'
    ],
    whatYouWillDo: [
      'Connect capacitive moisture probe to analog input with auto-calibrating dry/wet soil thresholds',
      'Program relay switching hysteresis to prevent micro-pump motor chatter during borderline moisture levels',
      'Broadcast RF alert telemetry to mobile defender robot when crop moisture drops below critical limits',
      'Defender robot dispatches to perimeter coordinates, sweeps area, and logs environmental telemetry'
    ],
    tasks: [
      {
        id: 1,
        title: 'Task 1: Automated Precision Irrigation Cycle',
        points: 20,
        description: 'Insert probe into dry soil sample; relay triggers pump for exactly 5 seconds until wet threshold is hit.',
        criteria: '20 pts for automatic trigger and immediate cutoff upon hydration.'
      },
      {
        id: 2,
        title: 'Task 2: Swarm RF Distress Telemetry Dispatch',
        points: 20,
        description: 'Stationary node transmits wireless emergency alert packet to mobile patrol rover.',
        criteria: '20 pts for rover receiving signal and activating alarm LED within 1 second.'
      },
      {
        id: 3,
        title: 'Task 3: Perimeter Security Patrol Loop',
        points: 20,
        description: 'Rover dispatches from base station, performs 360-degree perimeter ultrasonic sweep, and returns.',
        criteria: '20 pts for full autonomous patrol and dock without manual assist.'
      }
    ],
    skillsGained: ['Capacitive Analog Sensing', 'Relay Electrical Isolation', 'Swarm Node Networking', 'Closed-Loop Environmental Automation'],
    difficulty: 'Intermediate',
    timeEstimate: '30 mins assembly • 15 mins calibration'
  }
];

export const HACKATHON_TIMELINE: HackathonTimelineStep[] = [
  {
    date: '1st Nov 2026',
    title: 'National Registrations Open',
    subtitle: 'Portal opens for Solo Innovators and Duo Teams (Grades 8–12). Early bird discounts active.',
    iconName: 'Sparkles',
    status: 'active'
  },
  {
    date: '30th Nov 2026',
    title: 'Early Bird Window Closes',
    subtitle: 'Special fee of ₹1,800 (Solo) / ₹2,500 (Duo) ends. Regular registration rates apply.',
    iconName: 'Clock',
    status: 'upcoming'
  },
  {
    date: '15th Dec 2026',
    title: 'Registration Hard Deadline',
    subtitle: 'Final team rosters locked. Sealed mystery kits prepared for national courier dispatch.',
    iconName: 'ShieldCheck',
    status: 'upcoming'
  },
  {
    date: '16th – 24th Dec 2026',
    title: 'Sealed Kit Doorstep Dispatch',
    subtitle: 'Tamper-evident sealed boxes + arena mat delivered to participants across all 28 states & UTs.',
    iconName: 'Truck',
    status: 'upcoming'
  },
  {
    date: '28th Dec – 5th Jan 2027',
    title: 'Proctoring Slot Booking & Test Run',
    subtitle: 'Teams test dual-camera Google Meet links and schedule their preferred 1-hour competition slot.',
    iconName: 'Calendar',
    status: 'upcoming'
  },
  {
    date: '9th – 10th Jan 2027',
    title: 'The National Finals: 60-Minute Live Build',
    subtitle: 'Live proctored 1-hour showdown. Unbox sealed mystery challenge, assemble, code, and execute on mat!',
    iconName: 'Trophy',
    status: 'upcoming'
  },
  {
    date: '16th – 17th Jan 2027',
    title: 'Grand Awards & Winner Declaration',
    subtitle: 'National ceremony stream. ₹10,000 cash prize, drone kits, internships, and mentorships awarded.',
    iconName: 'Award',
    status: 'upcoming'
  }
];

export const HACKATHON_FAQS = [
  {
    q: 'Do I get to keep the robotics hardware kit after the hackathon?',
    a: 'YES! 100%. The sealed robotics kit, sensors, microcontrollers, tools, and the 2400x1200mm challenge arena mat belong to you permanently. You can continue prototyping all 10 robotics experiments at home or in your school lab.'
  },
  {
    q: 'What if I am a beginner in coding and robotics?',
    a: 'The Balki RoboCup Hackathon is structured specifically for school students in Grades 8 to 12. Prior to the finals, all registered students receive access to pre-recorded masterclasses, starter code repositories, pinout cheatsheets, and live Q&A clinic sessions.'
  },
  {
    q: 'Can two students form a team?',
    a: 'Yes! You can register either as a Solo Innovator (1 student) or as a Duo Team (2 students from the same school or different schools). Duo teams collaborate together during the 60-minute build session.'
  },
  {
    q: 'How does remote proctoring work on Google Meet?',
    a: 'You will need 2 devices with cameras: (1) a laptop webcam showing your workbench and hands, and (2) a smartphone mounted on a stand showing the 2400x1200mm arena mat from above. A certified Balki RoboCup judge evaluates your build live.'
  },
  {
    q: 'When do I open the sealed kit box?',
    a: 'You MUST NOT open the tamper-evident security seal before your competition slot. Your judge will verify the unbroken security seal live on camera at minute 00:00 of your slot. Opening the seal in advance will result in disqualification.'
  },
  {
    q: 'What computer software do I need installed before the hackathon?',
    a: 'You only need the free Arduino IDE (v2.x) and a Chrome browser installed on your laptop with standard CH340 / CP2102 USB driver packages. Full setup guides are provided immediately upon registration.'
  }
];
