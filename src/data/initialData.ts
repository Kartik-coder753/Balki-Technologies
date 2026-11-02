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
    name: 'Autonomous Drone Flight & Telemetry Testing Rig',
    category: 'Aeronautics & Robotics',
    dailyRate: 850,
    weeklyRate: 4800,
    securityDeposit: 12000,
    totalUnits: 5,
    availableUnits: 3,
    image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80',
    condition: 'Brand New',
    specs: [
      'Open-source ArduPilot / PX4 flight avionics system',
      'Full HD low-latency FPV video streaming system',
      'Telemetry transceiver (915MHz) for laptop mission planner',
      'Optical flow & Sonar precision indoor hovering'
    ],
    includes: [
      'Complete quadcopter drone with carbon fiber frame',
      'FlySky 10-channel RC transmitter with telemetry screen',
      '3x High-capacity LiPo flight batteries & smart multi-charger',
      'Flight training simulator software USB dongle'
    ],
    description: 'Rent our verified autonomous flight test system for school drone workshops, AI vision aerial research, or STEM aviation camps.',
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
    title: 'Autonomous Drone Flight & 3D CAD Prototyping (Classes 11–12)',
    gradeLevel: 'Class 11-12',
    targetAudience: 'Senior secondary students mastering aerodynamics, PID flight controllers, and parametric CAD.',
    nepCompetencies: ['Advanced Engineering Design', 'Control Systems Physics', 'Rapid Prototyping'],
    durationWeeks: 8,
    totalHours: 28,
    enrolledStudents: 940,
    rating: 4.98,
    thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=600&q=80',
    overview: 'Dive deep into aerospace engineering, quadcopter dynamics, brushless ESC pulse timing, and design custom drone mounts using 3D parametric CAD modeling.',
    certificateTitle: 'Advanced UAV & Prototyping Engineer',
    isLiked: true,
    likesCount: 264,
    lessons: [
      {
        id: 'c4-l1',
        title: 'Quadcopter Physics: Gyroscope Fusion, PID Loops, and Hover Stability',
        durationMinutes: 50,
        videoSnippetTitle: 'How Drones Stay Level: Proportional-Integral-Derivative Control',
        summary: 'Analyze Roll, Pitch, and Yaw dynamics and adjust PID gains for wind resistance.',
        theoryContent: 'A quadcopter uses two clockwise (CW) and two counter-clockwise (CCW) propellers to cancel torque. Angular orientation is continuously measured by an Inertial Measurement Unit (IMU) combining an accelerometer and a gyroscope. A PID controller calculates the error between desired angle and actual angle hundreds of times per second to vary motor speeds smoothly.',
        codeSnippet: '// PID Controller Simulation for Quadcopter Altitude Hold\nclass DronePID {\n  constructor(kp, ki, kd) {\n    this.kp = kp; this.ki = ki; this.kd = kd;\n    this.integral = 0; this.prevError = 0;\n  }\n  compute(setpoint, currentAlt, dt = 0.05) {\n    const error = setpoint - currentAlt;\n    this.integral += error * dt;\n    const derivative = (error - this.prevError) / dt;\n    this.prevError = error;\n    return (this.kp * error) + (this.ki * this.integral) + (this.kd * derivative);\n  }\n}\nconst controller = new DronePID(1.2, 0.05, 0.4);\nconsole.log("Motor Throttle Adjustment:", controller.compute(5.0, 4.2).toFixed(2));',
        codeLanguage: 'javascript',
        simulationType: 'drone_telemetry',
        quiz: {
          question: 'What happens to a quadcopter if all four propellers spin in the same direction?',
          options: [
            'It will fly twice as fast',
            'The body of the drone will spin uncontrollably in the opposite direction due to reactive torque',
            'The battery will recharge itself',
            'It will glide silently like a plane'
          ],
          correctIndex: 1,
          explanation: 'Newton\'s Third Law dictates that spinning propellers exert an equal and opposite torque on the frame. Diagonal pairs must spin in opposite directions to cancel net angular torque.'
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
  studentName: 'Aarav Sharma',
  schoolName: 'Kendriya Vidyalaya, Hyderabad',
  grade: 'Class 8-A',
  tinkeringHours: 32,
  completedLessonIds: ['c1-l1', 'c1-l2', 'c2-l1'],
  quizScores: {
    'c1-l1': 100,
    'c1-l2': 100,
    'c2-l1': 100
  },
  earnedCertificates: [
    {
      courseId: 'course-1',
      courseTitle: 'Junior Tinkerer: Electronics & Magic Circuits (Classes 3–5)',
      issueDate: 'August 14, 2026',
      certificateId: 'BALKI-CERT-2026-7842'
    }
  ],
  badges: [
    {
      id: 'badge-1',
      name: 'Circuit Apprentice',
      icon: 'Zap',
      description: 'Built and verified your first closed electrical loop without short-circuits.',
      unlockedAt: '2026-08-10'
    },
    {
      id: 'badge-2',
      name: 'Radar Navigator',
      icon: 'Radio',
      description: 'Mastered ultrasonic echolocation mathematics and acoustic reflection.',
      unlockedAt: '2026-08-25'
    },
    {
      id: 'badge-3',
      name: 'ATL 30-Hours Club',
      icon: 'Award',
      description: 'Logged over 30 verified hands-on tinkering hours inside an Atal Tinkering Lab.',
      unlockedAt: '2026-09-02'
    }
  ],
  likedCourseIds: ['course-1', 'course-4']
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'BALKI-ORD-2026-9041',
    createdAt: '2026-09-10',
    customerName: 'Dr. Ramesh Sundaram',
    customerEmail: 'ramesh.atl@dpssecunderabad.edu.in',
    customerPhone: '+91 98850 12345',
    schoolName: 'Delhi Public School (ATL Wing)',
    shippingAddress: {
      street: 'Plot 42, Nacharam Road',
      city: 'Secunderabad',
      state: 'Telangana',
      pincode: '500076'
    },
    items: [
      {
        product: INITIAL_PRODUCTS[0],
        quantity: 5
      },
      {
        product: INITIAL_PRODUCTS[2],
        quantity: 5
      }
    ],
    subtotal: 16240,
    gstAmount: 2923.2,
    shippingFee: 0,
    discount: 0,
    totalAmount: 19163.2,
    paymentMethod: 'SchoolPO',
    paymentStatus: 'PO Approved (Net 30)',
    trackingNumber: 'BALKI-EXP-940212IN',
    orderStatus: 'in_transit',
    deliveryOtp: '4829',
    paymentReference: 'PO-DPS-SEC-2026/09',
    trackingDetails: {
      courierPartner: 'Delhivery B2B Logistics (Priority STEM Express)',
      awbNumber: 'DELHIVERY-B2B-940212IN',
      dispatchDate: '2026-09-11T10:30:00.000Z',
      expectedDeliveryDate: '2026-09-14T17:00:00.000Z',
      originHub: 'Balki Central Fulfillment, Financial District, Hyderabad',
      destinationHub: 'Secunderabad North Delivery Center, Telangana',
      deliverySecurityOtp: '4829',
      assignedFieldEngineer: {
        name: 'Ramesh Verma',
        phone: '+91 90711 99139',
        badge: 'Lead Robotics Technician (ATL Certified)'
      },
      liveCoordinates: {
        lat: 17.4435,
        lng: 78.3842
      },
      checkpoints: [
        {
          id: 'chk-1',
          status: 'order_placed',
          title: 'Order Verified & Institutional PO Approved',
          description: 'Official School Purchase Order verified under Net-30 ATL funding compliance.',
          location: 'Balki Corporate HQ, Hyderabad',
          timestamp: '2026-09-10T09:15:00.000Z',
          completed: true,
          current: false
        },
        {
          id: 'chk-2',
          status: 'qc_assembly',
          title: 'Quality Check & Serial Number Allocation',
          description: 'Components tested for zero-defect compliance, anti-static foam packed, barcoded.',
          location: 'Balki Assembly Center, Hyderabad',
          timestamp: '2026-09-10T16:45:00.000Z',
          completed: true,
          current: false
        },
        {
          id: 'chk-3',
          status: 'dispatched',
          title: 'Dispatched via Priority Logistics',
          description: 'Consignment handed over to Delhivery B2B Express. Waybill generated.',
          location: 'Shamshabad Air Freight & Logistics Hub',
          timestamp: '2026-09-11T10:30:00.000Z',
          completed: true,
          current: false
        },
        {
          id: 'chk-4',
          status: 'in_transit',
          title: 'In Transit – Arrived at Regional Sorting Hub',
          description: 'Scanned at regional transshipment facility. Outward connection scheduled.',
          location: 'Secunderabad Regional Sorting Hub',
          timestamp: '2026-09-12T08:20:00.000Z',
          completed: true,
          current: true
        },
        {
          id: 'chk-5',
          status: 'out_for_delivery',
          title: 'Out for School Lab Delivery & Verification',
          description: 'Assigned to field technician for secure school gate delivery and OTP verification.',
          location: 'Secunderabad North Delivery Van 04',
          timestamp: '2026-09-14T09:00:00.000Z',
          completed: false,
          current: false
        },
        {
          id: 'chk-6',
          status: 'delivered',
          title: 'Lab Delivery & Technician Handover Sign-off',
          description: 'Unboxed in school innovation lab, inspection checklist signed by ATL in-charge.',
          location: 'DPS Secunderabad Tinkering Lab',
          timestamp: '2026-09-14T15:30:00.000Z',
          completed: false,
          current: false
        }
      ]
    }
  }
];

// Aliases for convenience
export const initialProducts = INITIAL_PRODUCTS;
export const initialCourses = INITIAL_COURSES;
export const initialRentals = INITIAL_RENTALS;
export const initialInventory = INITIAL_INVENTORY;
export const initialUserProgress = INITIAL_USER_PROGRESS;
export const initialOrders = INITIAL_ORDERS;
