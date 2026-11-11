import { Product, RentalEquipment, Course, InventoryItem, UserProgress, Order } from "../types";
import { ATL_PRODUCTS, ATL_INVENTORY } from "./atlProductsList";

export const INITIAL_PRODUCTS: Product[] = ATL_PRODUCTS;

export const INITIAL_RENTALS: RentalEquipment[] = [
  {
    id: 'rent-1',
    name: 'Industrial High-Speed 3D Printer Pro (Bambu Lab / Creality CoreXY)',
    category: 'Prototyping & Fabrication',
    dailyRate: 650,
    weeklyRate: 3500,
    securityDeposit: 8000,
    totalUnits: 8,
    availableUnits: 6,
    image: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=800&q=80',
    condition: 'Calibrated',
    specs: [
      'Max Speed: 500 mm/s high-acceleration printing',
      'Build Volume: 256 x 256 x 256 mm',
      'Nozzle Temp: Up to 300°C (PLA, ABS, PETG, Carbon Fiber)',
      'Auto-Bed Leveling & Dual Lidar Chamber Camera'
    ],
    includes: [
      'Pre-calibrated 3D printer in protective flight case',
      '2x 1kg Spools of Premium PLA filament',
      'Complete toolset, spare 0.4mm hardened steel nozzles & PEI sheet',
      'Virtual onboarding & slicing setup session with Balki engineer'
    ],
    description: 'Perfect for schools and student teams preparing for national science exhibitions, ATL marathons, or college hackathons requiring rapid physical prototyping without full equipment purchase.',
    minRentalDays: 3
  },
  {
    id: 'rent-2',
    name: 'Precision Desktop CNC Milling & PCB Prototyping Rig',
    category: 'Rapid Prototyping & CNC',
    dailyRate: 850,
    weeklyRate: 4800,
    securityDeposit: 12000,
    totalUnits: 5,
    availableUnits: 3,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    condition: 'Brand New',
    specs: [
      'High-speed 12,000 RPM ER11 spindle motor with PWM speed control',
      'GRBL 3-axis motion controller with offline touchscreen pendant',
      'Precision lead screw drive with 0.01mm repeatability',
      'Emergency stop switch, limit switches, and acrylic safety enclosure'
    ],
    includes: [
      'Complete desktop CNC router with aluminum T-slot bed',
      '10-piece tungsten carbide engraving bit set & collet wrench',
      'Offline controller with USB SD card reader',
      'Balki CAM & G-Code generator starter software pack'
    ],
    description: 'Rent our verified desktop CNC router for school circuit prototyping, acrylic engraving, wood carving, and robotics chassis fabrication.',
    minRentalDays: 3
  },
  {
    id: 'rent-3',
    name: 'Dual-Channel 100MHz Digital Storage Oscilloscope (DSO)',
    category: 'Electronics Testing',
    dailyRate: 350,
    weeklyRate: 1800,
    securityDeposit: 4000,
    totalUnits: 12,
    availableUnits: 9,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    condition: 'Calibrated',
    specs: [
      'Bandwidth: 100MHz real-time with 1GSa/s sampling rate',
      '7-inch High-resolution TFT color display',
      '32 Automated waveform measurement functions',
      'USB Flash storage for FFT spectrum analysis & screen capture'
    ],
    includes: [
      '100MHz DSO Unit with NABL calibration certificate',
      '2x 1X/10X switchable passive oscilloscope probes',
      'Power cord and BNC-to-Alligator clip test leads',
      'Quick reference signal analysis guide'
    ],
    description: 'Essential for electronics workshops, debugging microcontrollers, PWM motor signals, and radio frequencies during school science fairs.',
    minRentalDays: 2
  },
  {
    id: 'rent-4',
    name: 'Advanced Programmable Humanoid Bipedal Robot Kit',
    category: 'Robotics & AI',
    dailyRate: 950,
    weeklyRate: 5500,
    securityDeposit: 15000,
    totalUnits: 4,
    availableUnits: 2,
    image: 'https://images.unsplash.com/photo-1535378620166-273708d44e4c?auto=format&fit=crop&w=800&q=80',
    condition: 'Excellent',
    specs: [
      '17 High-torque bus serial metal gear servos with feedback',
      'Built-in IMU sensor for real-time dynamic balance & walking gait',
      'Raspberry Pi / ESP32 dual architecture for AI vision',
      'Python & ROS (Robot Operating System) programmable'
    ],
    includes: [
      'Assembled humanoid robot in aluminum carry case',
      'Dual high-discharge battery packs and rapid charger',
      'Pre-loaded gait algorithms (walking, dancing, climbing, object tracking)',
      'Remote joystick controller & Bluetooth PC adapter'
    ],
    description: 'Deliver the ultimate crowd-puller demonstration at school annual days, STEM expos, and university robotics symposiums.',
    minRentalDays: 2
  },
  {
    id: 'rent-5',
    name: 'High-Precision CNC PCB Milling & Engraving Machine',
    category: 'Prototyping & Fabrication',
    dailyRate: 750,
    weeklyRate: 4200,
    securityDeposit: 10000,
    totalUnits: 6,
    availableUnits: 4,
    image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
    condition: 'Calibrated',
    specs: [
      'Working Area: 300 x 180 x 45 mm',
      'Spindle Speed: 10,000 RPM ER11 high-precision chuck',
      'Offline controller with SD card slot for standalone milling',
      'Milling capabilities: Copper clad boards, Acrylic, Wood, Soft Aluminum'
    ],
    includes: [
      'Benchtop CNC 3018-Pro machine with safety acrylic shielding',
      'Set of 20 V-shape engraving bits & end mills',
      '10x Double-sided FR4 copper clad PCB blanks',
      'Virtual PCB isolation routing workflow coaching session'
    ],
    description: 'Enables students to prototype real double-sided electronic circuit boards within 30 minutes inside their school ATL lab.',
    minRentalDays: 3
  },
  {
    id: 'rent-6',
    name: 'Thermal Diagnostics Infrared Camera (FLIR / Testo Sensor)',
    category: 'Electronics Testing',
    dailyRate: 450,
    weeklyRate: 2400,
    securityDeposit: 6000,
    totalUnits: 7,
    availableUnits: 5,
    image: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=800&q=80',
    condition: 'Brand New',
    specs: [
      'Thermal Resolution: 160 x 120 (19,200 temperature measurement pixels)',
      'Temperature Range: -20°C to 550°C (±2°C accuracy)',
      'MSX Thermal Image Blending for crisp edge definition',
      'Built-in Wi-Fi for live report generation to iPad/Android tablets'
    ],
    includes: [
      'Handheld thermal imager in rugged drop-tested case',
      'Dual hot-swappable Li-Ion rechargeable batteries and dock',
      'Calibration certificate & thermal analysis desktop software suite'
    ],
    description: 'Perfect for detecting PCB short circuits, testing solar panel hot spots, and teaching thermal dissipation physics in school labs.',
    minRentalDays: 2
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-1',
    title: 'Junior Tinkerer: Electronics & Magic Circuits (Classes 3–5)',
    gradeLevel: 'Class 3-5',
    targetAudience: 'Elementary students stepping into electricity and basic hands-on STEM.',
    nepCompetencies: ['Foundational Scientific Inquiry', 'Observation & Pattern Recognition', 'Hands-on Prototyping'],
    durationWeeks: 4,
    totalHours: 12,
    enrolledStudents: 1240,
    rating: 4.9,
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
    overview: 'An engaging foundational course guiding young innovators through the basics of circuits, electric current, conductors vs insulators, and luminous LED art without dangerous tools.',
    certificateTitle: 'Junior STEM Inventor Certificate',
    isLiked: true,
    likesCount: 142,
    lessons: [
      {
        id: 'c1-l1',
        title: 'The Closed Circuit Loop: Power, Light, and Switches',
        durationMinutes: 25,
        videoSnippetTitle: 'Demystifying Electrons with LED & Coin Cells',
        summary: 'Understand how electrical current flows in an unbroken path from the positive to negative terminal.',
        theoryContent: 'Electricity is the movement of tiny particles called electrons. For electricity to do work — like lighting up a bright LED bulb or spinning a miniature fan — it needs a complete, unbroken loop called a CLOSED CIRCUIT. If there is any break in the path, it becomes an OPEN CIRCUIT, and the current stops immediately.',
        codeSnippet: '// Virtual Circuit Simulator\nconst battery = { voltage: 3.0, connected: true };\nconst switchState = "CLOSED";\n\nif (battery.connected && switchState === "CLOSED") {\n  console.log("⚡ Circuit Complete: LED Glows Bright Amber!");\n} else {\n  console.log("⭕ Open Circuit: Current Cannot Flow.");\n}',
        codeLanguage: 'javascript',
        simulationType: 'led_blink',
        quiz: {
          question: 'What happens to an electric circuit when you open the switch?',
          options: [
            'The current increases and the light glows brighter',
            'The loop breaks and electric current stops flowing',
            'The battery discharges instantly',
            'Electrons change direction and flow in reverse'
          ],
          correctIndex: 1,
          explanation: 'Opening a switch introduces a physical air gap in the conductive path, converting the circuit into an open circuit where electricity cannot flow.'
        }
      },
      {
        id: 'c1-l2',
        title: 'Conductors vs. Insulators: The Lemon & Graphite Mystery',
        durationMinutes: 30,
        videoSnippetTitle: 'Testing Everyday Objects for Electrical Conductivity',
        summary: 'Discover how metals, pencil graphite, and saltwater allow electric charge to pass, while rubber and plastic stop it.',
        theoryContent: 'Materials that allow electricity to flow easily through them are called CONDUCTORS. Most metals like copper, aluminum, and even pencil lead (graphite) are good conductors. Materials that resist the flow of electricity are called INSULATORS, such as rubber, dry wood, glass, and plastic.',
        codeSnippet: '// Conductivity Tester Simulation\nfunction testMaterial(name, resistanceOhms) {\n  if (resistanceOhms < 100) {\n    return `${name} is a CONDUCTOR! Bulb lights up.`;\n  } else {\n    return `${name} is an INSULATOR. Current blocked.`;\n  }\n}\nconsole.log(testMaterial("Graphite Pencil", 15));\nconsole.log(testMaterial("Plastic Ruler", 999999));',
        codeLanguage: 'javascript',
        simulationType: 'led_blink',
        quiz: {
          question: 'Which of the following common classroom items acts as an electrical conductor?',
          options: ['Plastic eraser', 'Pencil graphite core', 'Dry wooden desk', 'Glass marble'],
          correctIndex: 1,
          explanation: 'Graphite is a crystalline form of carbon with delocalized electrons, making it an effective electrical conductor.'
        }
      }
    ]
  },
  {
    id: 'course-2',
    title: 'Autonomous Robotics & Sensor Integration (Classes 6–8)',
    gradeLevel: 'Class 6-8',
    targetAudience: 'Middle schoolers ready for robotics, line tracking, ultrasonic navigation, and logic.',
    nepCompetencies: ['Computational Thinking', 'Algorithmic Problem Solving', 'Mechanical & Sensor Systems'],
    durationWeeks: 6,
    totalHours: 20,
    enrolledStudents: 2150,
    rating: 4.95,
    thumbnail: 'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?auto=format&fit=crop&w=600&q=80',
    overview: 'Master the core principles of autonomous rovers. Program microcontrollers to read ultrasonic distance waves, make real-time steering decisions, and navigate obstacle courses autonomously.',
    certificateTitle: 'Certified ATL Junior Roboticist',
    isLiked: false,
    likesCount: 218,
    lessons: [
      {
        id: 'c2-l1',
        title: 'Echolocation & Ultrasonic Radar (HC-SR04 Deep Dive)',
        durationMinutes: 35,
        videoSnippetTitle: 'How Bats and Robots Measure Distance Using Sound Waves',
        summary: 'Learn how ultrasonic sensors emit 40kHz acoustic pulses and calculate distance using the speed of sound.',
        theoryContent: 'The HC-SR04 sensor works on the principle of acoustic reflection. It sends out an ultrasonic sound burst (40,000 Hz, beyond human hearing) from the transmitter. When the wave strikes an obstacle, it bounces back to the receiver. By measuring the travel duration (time in microseconds), and knowing that sound travels in air at ~340 m/s (0.034 cm/microsecond), we use: Distance = (Time × 0.034) / 2.',
        codeSnippet: '// Arduino C++ Ultrasonic Distance Radar\nconst int trigPin = 9;\nconst int echoPin = 10;\n\nvoid setup() {\n  pinMode(trigPin, OUTPUT);\n  pinMode(echoPin, INPUT);\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  digitalWrite(trigPin, LOW);\n  delayMicroseconds(2);\n  digitalWrite(trigPin, HIGH);\n  delayMicroseconds(10);\n  digitalWrite(trigPin, LOW);\n  \n  long duration = 1200; // simulated microsecond bounce\n  int distanceCm = duration * 0.034 / 2;\n  Serial.print("Obstacle Distance: ");\n  Serial.print(distanceCm);\n  Serial.println(" cm");\n  delay(500);\n}',
        codeLanguage: 'cpp',
        simulationType: 'ultrasonic_radar',
        quiz: {
          question: 'Why do we divide the distance calculation by 2 in ultrasonic echolocation?',
          options: [
            'Because the sound wave travels at half speed in daylight',
            'Because the measured duration covers the round-trip (out to the object and back)',
            'Because there are two sensor cylinders on the board',
            'To convert inches into metric centimeters'
          ],
          correctIndex: 1,
          explanation: 'The sound wave travels forward to the object and bounces back to the receiver, doubling the travel path. Dividing by 2 isolates the single one-way distance.'
        }
      },
      {
        id: 'c2-l2',
        title: 'H-Bridge Motor Drivers & Autonomous Obstacle Avoidance Logic',
        durationMinutes: 40,
        videoSnippetTitle: 'Controlling DC Motor Direction and Steering Logic',
        summary: 'Program motor states: Forward, Reverse, Spin-Left, and Spin-Right with an L298N driver based on sensor readings.',
        theoryContent: 'An H-Bridge circuit allows microcontrollers to switch the polarity of DC motors, enabling both forward and reverse rotation without touching wires. Combining this with ultrasonic distance logic: If Distance < 20cm, Stop -> Reverse 200ms -> Turn Right 90° -> Check Path -> Resume Forward.',
        codeSnippet: '// Obstacle Avoidance Decision Engine\nfunction navigateRover(distanceCm) {\n  if (distanceCm < 20) {\n    return "⚠️ OBSTACLE DETECTED! Executing: STOP -> REVERSE -> TURN RIGHT";\n  } else {\n    return "✅ PATH CLEAR: Full Speed Forward at 80% PWM";\n  }\n}\nconsole.log(navigateRover(14));\nconsole.log(navigateRover(65));',
        codeLanguage: 'javascript',
        simulationType: 'servo_sweep',
        quiz: {
          question: 'What is the primary role of an L298N motor driver between an Arduino and a DC motor?',
          options: [
            'To step down the voltage to 1.5 volts',
            'To supply high current from an external battery safely without frying the microcontroller',
            'To measure the temperature of the wheels',
            'To provide Bluetooth signals'
          ],
          correctIndex: 1,
          explanation: 'Microcontrollers output only 20-40mA per pin, whereas DC motors require 500mA-2A under load. Motor driver shields isolate and amplify power safely.'
        }
      }
    ]
  },
  {
    id: 'course-3',
    title: 'Internet of Things (IoT) & Smart Agriculture with ESP32 (Classes 9–10)',
    gradeLevel: 'Class 9-10',
    targetAudience: 'High school students building connected sensor networks, cloud dashboards, and automation.',
    nepCompetencies: ['Data Analytics & Telemetry', 'Embedded Systems', 'Real-world Environmental Problem Solving'],
    durationWeeks: 8,
    totalHours: 24,
    enrolledStudents: 1890,
    rating: 4.92,
    thumbnail: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=600&q=80',
    overview: 'Harness the ESP32 Wi-Fi architecture to monitor soil moisture, temperature, and ambient light. Stream telemetry live to cloud platforms and trigger automatic solenoid water pumps.',
    certificateTitle: 'Certified IoT Systems Specialist',
    isLiked: false,
    likesCount: 185,
    lessons: [
      {
        id: 'c3-l1',
        title: 'Connecting ESP32 to Wi-Fi and Publishing Telemetry via MQTT',
        durationMinutes: 45,
        videoSnippetTitle: 'Cloud Telemetry Architecture & Lightweight Pub/Sub Protocols',
        summary: 'Learn why MQTT is preferred over HTTP for IoT and publish live sensor payloads.',
        theoryContent: 'MQTT (Message Queuing Telemetry Transport) is an extremely lightweight publish-subscribe messaging protocol designed for battery-powered sensors operating over constrained networks. An IoT device connects to a central broker (like Balki IoT Cloud or HiveMQ) and publishes JSON payloads to specific topics (e.g. "balki/lab/soil_moisture").',
        codeSnippet: '// ESP32 MQTT Telemetry Payload\nconst telemetryPacket = {\n  device_id: "BALKI-ESP32-ATL-04",\n  soil_moisture_pct: 34,\n  ambient_temp_c: 29.4,\n  pump_state: "AUTOMATIC_ACTIVE",\n  timestamp: new Date().toISOString()\n};\n\nconsole.log("Transmitting to MQTT broker:", JSON.stringify(telemetryPacket, null, 2));',
        codeLanguage: 'json',
        simulationType: 'led_blink',
        quiz: {
          question: 'Why is MQTT preferred over standard HTTP for battery-operated IoT sensor nodes?',
          options: [
            'It consumes substantially less power and network bandwidth due to minimal packet overhead',
            'It can only transmit text messages',
            'It requires no network connection',
            'It eliminates the need for microcontrollers'
          ],
          correctIndex: 0,
          explanation: 'MQTT header overhead is as small as 2 bytes, compared to hundreds of bytes in HTTP headers, conserving battery and bandwidth on distributed IoT nodes.'
        }
      }
    ]
  },
  {
    id: 'course-4',
    title: 'Advanced Robotics Kinematics & 3D CAD Prototyping (Classes 11–12)',
    gradeLevel: 'Class 11-12',
    targetAudience: 'Senior secondary students mastering robotic kinematics, PID motion controllers, and parametric CAD.',
    nepCompetencies: ['Advanced Engineering Design', 'Control Systems Physics', 'Rapid Prototyping'],
    durationWeeks: 8,
    totalHours: 28,
    enrolledStudents: 940,
    rating: 4.98,
    thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=600&q=80',
    overview: 'Dive deep into mechatronics engineering, multi-axis servo kinematics, closed-loop PID velocity control, and design custom robotic linkages using 3D parametric CAD modeling.',
    certificateTitle: 'Advanced Robotics & Prototyping Engineer',
    isLiked: true,
    likesCount: 264,
    lessons: [
      {
        id: 'c4-l1',
        title: 'Robotics Kinematics: IMU Feedback, PID Loops, and Dynamic Balance Control',
        durationMinutes: 50,
        videoSnippetTitle: 'How Autonomous Robots Maintain Dynamic Equilibrium: Proportional-Integral-Derivative Control',
        summary: 'Analyze angular orientation and tilt dynamics to adjust PID motor gains for instantaneous balance recovery.',
        theoryContent: 'An autonomous two-wheel self-balancing robot or multi-axis manipulator continuously measures tilt angle and angular velocity using an Inertial Measurement Unit (IMU). A closed-loop PID controller calculates the error between the vertical setpoint and actual angle hundreds of times per second, commanding counter-torque to wheels or actuators to maintain perfect equilibrium.',
        codeSnippet: '// PID Controller Simulation for Two-Wheel Self-Balancing Robot\nclass RobotBalancePID {\n  constructor(kp, ki, kd) {\n    this.kp = kp; this.ki = ki; this.kd = kd;\n    this.integral = 0; this.prevError = 0;\n  }\n  compute(setpointAngle, currentAngle, dt = 0.02) {\n    const error = setpointAngle - currentAngle;\n    this.integral += error * dt;\n    const derivative = (error - this.prevError) / dt;\n    this.prevError = error;\n    return (this.kp * error) + (this.ki * this.integral) + (this.kd * derivative);\n  }\n}\nconst controller = new RobotBalancePID(18.5, 0.4, 2.1);\nconsole.log("Motor Drive Correction PWM:", controller.compute(0.0, 3.4).toFixed(2));',
        codeLanguage: 'javascript',
        simulationType: 'servo_sweep',
        quiz: {
          question: 'What is the primary role of the derivative (D) term in an inverted pendulum self-balancing robot PID controller?',
          options: [
            'It prevents steady-state error accumulation',
            'It dampens oscillations by predicting future error based on rate of tilt change',
            'It inverts the direction of motor rotation at all times',
            'It doubles the maximum battery voltage'
          ],
          correctIndex: 1,
          explanation: 'The derivative component acts as a predictive damper, applying opposing torque proportional to the velocity of tilt to eliminate overshoot and prevent violent oscillations.'
        }
      }
    ]
  },
  {
    id: 'course-5',
    title: 'Edge Artificial Intelligence & TinyML with ESP32-CAM (Classes 9–10)',
    gradeLevel: 'Class 9-10',
    targetAudience: 'Secondary students building computer vision neural networks and face detection systems on low-power chips.',
    nepCompetencies: ['Artificial Intelligence Fundamentals', 'Data Classification', 'Embedded Vision'],
    durationWeeks: 6,
    totalHours: 18,
    enrolledStudents: 1420,
    rating: 4.96,
    thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=600&q=80',
    overview: 'Demystify artificial intelligence and neural networks. Train lightweight machine learning models to detect handwritten digits, identify gestures, and trigger physical actuators using the ESP32-CAM module.',
    certificateTitle: 'Certified TinyML & Edge AI Specialist',
    isLiked: false,
    likesCount: 198,
    lessons: [
      {
        id: 'c5-l1',
        title: 'Pixel Arrays to Feature Maps: Computer Vision on Microcontrollers',
        durationMinutes: 40,
        videoSnippetTitle: 'Convolutional Kernels and Grayscale Image Processing',
        summary: 'Understand how a camera captures pixel brightness arrays and extracts edge features using convolution matrices.',
        theoryContent: 'Every digital camera image is simply a 2D grid of numbers representing pixel intensity from 0 (pure black) to 255 (pure white). Edge AI systems use small mathematical filters called kernels (e.g. 3x3 Sobel matrices) that multiply across pixel neighborhoods to highlight sharp horizontal and vertical boundaries without needing cloud servers.',
        codeSnippet: '// TinyML Grayscale Image Edge Detection Simulation\nfunction detectEdges(pixel3x3) {\n  const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];\n  let gradient = 0;\n  for (let i = 0; i < 9; i++) {\n    gradient += pixel3x3[i] * sobelX[i];\n  }\n  return Math.abs(gradient) > 80 ? "Edge Boundary Detected" : "Uniform Background";\n}\nconsole.log(detectEdges([255, 255, 0, 255, 255, 0, 255, 255, 0]));',
        codeLanguage: 'javascript',
        simulationType: 'led_blink',
        quiz: {
          question: 'What is the chief advantage of running TinyML computer vision on edge devices rather than sending video streams to cloud servers?',
          options: [
            'Zero Internet latency, complete student data privacy, and minimal power consumption',
            'Edge devices have infinite cloud storage',
            'It makes the camera lens bigger',
            'It prevents the battery from ever discharging'
          ],
          correctIndex: 0,
          explanation: 'Running inference locally on-chip eliminates network lag, keeps private imagery inside the classroom, and functions reliably without internet access.'
        }
      }
    ]
  },
  {
    id: 'course-6',
    title: 'Solar Clean Energy & Smart City Grid Engineering (Classes 6–8)',
    gradeLevel: 'Class 6-8',
    targetAudience: 'Middle school students exploring sustainable energy, solar photovoltaics, and smart microgrids.',
    nepCompetencies: ['Environmental Stewardship', 'Physics of Renewable Energy', 'Engineering Systems'],
    durationWeeks: 4,
    totalHours: 14,
    enrolledStudents: 1680,
    rating: 4.88,
    thumbnail: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=600&q=80',
    overview: 'Explore the future of clean energy aligned with India National Solar Mission. Build automated dual-axis solar trackers that maximize sunlight harvest and balance microgrid battery storage.',
    certificateTitle: 'Junior Green Energy Innovator',
    isLiked: false,
    likesCount: 167,
    lessons: [
      {
        id: 'c6-l1',
        title: 'Photovoltaic Physics & Maximum Power Point Tracking (MPPT)',
        durationMinutes: 35,
        videoSnippetTitle: 'Harnessing Photons: How Sunlight Becomes Usable Amperes',
        summary: 'Learn how semiconductor silicon p-n junctions absorb photon energy and why panel angle affects power harvest.',
        theoryContent: 'Solar panels generate peak electrical current when sunlight hits the surface at a perpendicular 90-degree angle of incidence. Throughout the day, as the sun moves across the sky, static panels lose up to 40% of potential energy. Dual-axis servo tracking systems use four photoresistors (LDRs) to detect light differentials and steer the panel directly toward the brightest point.',
        codeSnippet: '// Solar Tracker Servo Steering Logic\nfunction computeSolarAngle(ldrEast, ldrWest) {\n  const delta = ldrEast - ldrWest;\n  if (Math.abs(delta) < 15) return "☀️ Optimal Angle: Facing Sun Directly";\n  return delta > 0 ? "Steering Servo East (+5°)" : "Steering Servo West (-5°)";\n}\nconsole.log(computeSolarAngle(750, 420));\nconsole.log(computeSolarAngle(600, 595));',
        codeLanguage: 'javascript',
        simulationType: 'servo_sweep',
        quiz: {
          question: 'Why does an automated dual-axis solar tracker produce significantly more daily kilowatt-hours than a fixed stationary panel?',
          options: [
            'It generates its own internal sunlight',
            'It maintains an optimal 90-degree angle to the sun throughout the entire day',
            'It reduces the weight of the solar panel',
            'It eliminates the need for electrical wires'
          ],
          correctIndex: 1,
          explanation: 'By continuously adjusting azimuth and elevation to face the sun perpendicular to incident rays, trackers harvest maximum solar irradiance all day.'
        }
      }
    ]
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = ATL_INVENTORY;

export const INITIAL_USER_PROGRESS: UserProgress = {
  studentName: '',
  schoolName: '',
  grade: 'Innovator',
  tinkeringHours: 0,
  completedLessonIds: [],
  quizScores: {},
  earnedCertificates: [],
  badges: [],
  likedCourseIds: []
};

export const INITIAL_ORDERS: Order[] = [];

// Aliases for convenience
export const initialProducts = INITIAL_PRODUCTS;
export const initialCourses = INITIAL_COURSES;
export const initialRentals = INITIAL_RENTALS;
export const initialInventory = INITIAL_INVENTORY;
export const initialUserProgress = INITIAL_USER_PROGRESS;
export const initialOrders = INITIAL_ORDERS;
