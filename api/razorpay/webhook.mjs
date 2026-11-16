// src/server/createApiApp.ts
import express from "express";
import crypto from "crypto";
import Razorpay from "razorpay";

// src/data/atlProductsList.ts
var ATL_PRODUCTS = [
  // --- 1. MASTER TURNKEY LAB PACKAGES (Non-repeating dedicated laboratory imagery) ---
  {
    id: "pkg-prod-e",
    name: "Package E \u2013 Complete ATL Equipment Package (Master Turnkey 169-Item Lab Solution)",
    category: "atl-packages",
    gradeLevel: "All Grades",
    price: 590961,
    originalPrice: 697334,
    rating: 5,
    reviewsCount: 210,
    stock: 18,
    minStockAlert: 2,
    sku: "BALKI-ATL-PKG-E-169",
    warehouseLocation: "Hyderabad Central Logistics Hub",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
      "/src/assets/images/atl_turnkey_lab_1792018813842.jpg"
    ],
    shortDesc: "The definitive all-in-one Atal Tinkering Lab setup covering Packages A + B + C + D combined (all 169 line items as per AIM Guidelines 2026).",
    description: "Package E encompasses all 169 line items mandated by the Atal Innovation Mission (AIM), NITI Aayog guidelines (2026). It combines Electronics & IoT (Package A - 111 items), Robotics & Automation (Package B - 29 items), AI/ML & Computer Vision (Package C - 7 items), and 3D Printing & Prototyping (Package D - 22 items) into an integrated laboratory consignment with free onsite training and 12-month replacement warranty.",
    features: [
      "Comprehensive coverage of all 169 official AIM ATL materials in one shipment",
      "Net Sub-total: \u20B95,90,960.62 | Statutory 18% GST: \u20B91,06,372.91 | Net Total: \u20B96,97,334.00",
      "Includes high-speed Creality K1C 3D printer, Raspberry Pi 5 8GB, Meta Quest 3S VR, and 20x Arduino UNO R4",
      "Accompanied by 2-day on-site educator masterclasses and turnkey ATL inauguration kit",
      "Full statutory GST B2B invoice with input tax credit for institutions"
    ],
    whatsInBox: [
      "Package A: 111 Items (Microcontrollers, Sensors, Displays, Power Supplies, Wires)",
      "Package B: 29 Items (Motors, Motor Drivers, Chassis, Wheels, Relays, EV Kit, Autonomous Rover)",
      "Package C: 7 Items (Raspberry Pi 5 8GB, Meta Quest 3S VR, TinyML Kit, ESP32-CAMs)",
      "Package D: 22 Items (Creality K1C 3D Printer, Artis UPS, 3D Pens, Filaments, Tools)"
    ],
    nepAligned: true,
    atlCertified: true,
    warrantyMonths: 12
  },
  {
    id: "pkg-prod-a",
    name: "Package A \u2013 Electronics & IoT Equipment Package (111 Items)",
    category: "atl-packages",
    gradeLevel: "All Grades",
    price: 191029,
    originalPrice: 225414,
    rating: 4.95,
    reviewsCount: 178,
    stock: 25,
    minStockAlert: 3,
    sku: "BALKI-ATL-PKG-A-111",
    warehouseLocation: "Hyderabad Central Logistics Hub",
    image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=1200&q=80",
      "/src/assets/images/iot_electronics_kit_1792018814258.jpg"
    ],
    shortDesc: "Complete 111-item consignment of microcontrollers, IoT boards, sensors, displays, and laboratory power supplies.",
    description: "Equips school Atal Tinkering Labs with 20x Arduino UNO R4 Minima boards, 10x Nano V3 Type-C, 15x ESP32 WiFi+Bluetooth boards, complete MQ gas sensor suites, ultrasonic sensors, Wanptek 30V/5A DC power supply, and specialized Bio-Tech & Agri-Tech STEM kits.",
    features: [
      "111 Distinct line items strictly conforming to AIM ATL Guidelines 2026",
      "Sub-total: \u20B91,91,028.57 | GST @ 18%: \u20B934,385.14 | Grand Total: \u20B92,25,414.00",
      "Thousands of consumables: 5000+ LEDs, 2000+ Jumper cables, 400m Hook-up wires",
      "Includes Bio-Tech, Agri-Tech, Water/Sanitation, and Solar Energy experiment kits"
    ],
    whatsInBox: [
      "20x Arduino UNO R4 Minima & 10x ATmega328P Nano V3 Type-C",
      "15x ESP32-WROOM-32 & 6x ESP8266 NodeMCU CP2102",
      "40x HC-SR04 Ultrasonic & 20x HC-SR501 PIR Motion Sensors",
      "1x Wanptek 30V/5A Adjustable DC Power Supply & Solar Energy Kit"
    ],
    nepAligned: true,
    atlCertified: true,
    warrantyMonths: 12
  },
  {
    id: "pkg-prod-b",
    name: "Package B \u2013 Robotics & Automation Equipment Package (29 Items)",
    category: "atl-packages",
    gradeLevel: "All Grades",
    price: 100951,
    originalPrice: 119122,
    rating: 4.9,
    reviewsCount: 142,
    stock: 30,
    minStockAlert: 4,
    sku: "BALKI-ATL-PKG-B-29",
    warehouseLocation: "Bengaluru Depot",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
      "/src/assets/images/robotics_automation_kit_1792018814223.jpg"
    ],
    shortDesc: "Comprehensive 29-item robotics hardware suite: NEMA17 steppers, BO geared motors, chassis, autonomous rovers & EV kits.",
    description: "Powers school robotics programs with 20x NEMA17 Stepper Motors (JK42HS48) with A4988 drivers, 72x BO geared motors, 10x aluminum 2WD robot chassis, Balki Smart 4WD Autonomous Navigation Kit, WitBlox AI Robotics kit, Mechanix steel modular kit, and an educational Electric Vehicle (EV) kit.",
    features: [
      "29 High-grade mechanical & electromechanical line items",
      "Sub-total: \u20B91,00,951.25 | GST @ 18%: \u20B918,171.23 | Grand Total: \u20B91,19,122.00",
      "Covers mobile rovers, automated conveyor systems, industrial automation, and EV physics",
      "12-Month replacement warranty on non-consumable robotics kits"
    ],
    whatsInBox: [
      "20x JK42HS48 NEMA17 Stepper Motors with A4988 Drivers",
      "72x BO Geared Motors & 20x 65mm High-Grip Robot Wheels",
      "10x Red 2WD Aluminum Smart Robot Car Chassis Kits",
      "1x Autonomous 4WD Smart Rover Kit + 1x WitBlox AI Kit + 1x EV Prototyping Kit"
    ],
    nepAligned: true,
    atlCertified: true,
    warrantyMonths: 12
  },
  {
    id: "pkg-prod-c",
    name: "Package C \u2013 AI/ML & Computer Vision Equipment Package (7 Items)",
    category: "atl-packages",
    gradeLevel: "Class 9-10",
    price: 182005,
    originalPrice: 214766,
    rating: 4.98,
    reviewsCount: 95,
    stock: 20,
    minStockAlert: 2,
    sku: "BALKI-ATL-PKG-C-07",
    warehouseLocation: "Hyderabad Central Logistics Hub",
    image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=1200&q=80",
      "/src/assets/images/ai_vision_kit_1792018815040.jpg"
    ],
    shortDesc: "High-end advanced computing package: 4x Raspberry Pi 5 8GB, Meta Quest 3S VR headset, and TinyML starter kits.",
    description: "Enables high school students to build computer vision, neural classification, and augmented reality models. Features 4x Raspberry Pi 5 Model 8GB RAM computers, Meta Quest 3S VR Headset 128GB with Touch Plus controllers, official Arduino TinyML kits with Nano 33 BLE & OV7675 camera, and optical fingerprint sensors.",
    features: [
      "Cutting-edge edge AI and spatial computing hardware",
      "Sub-total: \u20B91,82,005.00 | GST @ 18%: \u20B932,760.90 | Grand Total: \u20B92,14,766.00",
      "Deploy real machine learning models locally on edge devices without cloud dependency",
      "Compatible with Python, TensorFlow Lite Micro, OpenCV, and Unity VR"
    ],
    whatsInBox: [
      "4x Raspberry Pi 5 Model 8GB RAM Single Board Computers",
      "1x Meta Quest 3S VR Headset (With Controllers) - 128GB",
      "2x Official Arduino TinyML Starter Kits AKX00028 with OV7675 Camera",
      "11x ESP32-CAM & ESP32-CAM-MB Boards + 4x R307S Fingerprint Sensors"
    ],
    nepAligned: true,
    atlCertified: true,
    warrantyMonths: 12
  },
  {
    id: "pkg-prod-d",
    name: "Package D \u2013 3D Printing & Rapid Prototyping Equipment Package (22 Items)",
    category: "atl-packages",
    gradeLevel: "All Grades",
    price: 116976,
    originalPrice: 138031,
    rating: 4.92,
    reviewsCount: 118,
    stock: 22,
    minStockAlert: 3,
    sku: "BALKI-ATL-PKG-D-22",
    warehouseLocation: "Hyderabad Central Logistics Hub",
    image: "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=1200&q=80",
      "/src/assets/images/printer_prototyping_kit_1792018815179.jpg"
    ],
    shortDesc: "Professional prototyping lab: Creality K1C CoreXY 3D printer, Artis 1500VA UPS, 3D pens, and workshop materials.",
    description: "Transform digital CAD designs into physical inventions. Includes the flagship Creality K1C High-Speed 3D Printer (600mm/s), Artis 1500VA dedicated line interactive UPS, 6kg filaments (PLA + TPU), 5x 3D Pens LT-3 Series, acrylic sheets, MDF boards, balsa wood, and Taparia workshop hand tools.",
    features: [
      "22 Essential rapid prototyping and digital fabrication line items",
      "Sub-total: \u20B91,16,975.80 | GST @ 18%: \u20B921,055.64 | Grand Total: \u20B91,38,031.00",
      "Creality K1C printer features AI camera, hardened nozzle, and carbon fiber capability",
      "Full assortment of laser acrylic sheets, MDF boards, balsa wood, and mechanical tools"
    ],
    whatsInBox: [
      "1x Creality K1C High-Speed CoreXY 3D Printer",
      "1x Artis 1500VA Line Interactive Dedicated UPS",
      "5kg PLA + 1kg TPU Multi-Colour Filaments & 5x Dry Boxes",
      "5x 3D Pens LT-3 Series + Taparia Hacksaws, Pliers & Tweezers"
    ],
    nepAligned: true,
    atlCertified: true,
    warrantyMonths: 12
  },
  // --- 2. MICROCONTROLLERS & IOT ('microcontrollers') ---
  {
    id: "mat-prod-1",
    name: "Arduino UNO R4 Minima Board (Item 1, Package A)",
    category: "microcontrollers",
    gradeLevel: "Class 6-8",
    price: 938,
    originalPrice: 1250,
    rating: 4.95,
    reviewsCount: 88,
    stock: 120,
    minStockAlert: 20,
    sku: "BALKI-ATL-A01-UNOR4",
    warehouseLocation: "Hyderabad Central Logistics Hub",
    image: "/products/arduino_uno_r4_minima.png",
    shortDesc: "Next-gen 32-bit Renesas RA4M1 ARM Cortex-M4 microcontroller board running at 48MHz with 256KB Flash.",
    description: "The official Arduino UNO R4 Minima features a powerful 32-bit architecture with 12-bit DAC, CAN bus support, and increased SRAM (32KB). 100% pin-compatible with classic Arduino shields while executing operations up to 3x faster.",
    features: ["Renesas RA4M1 32-bit ARM Cortex-M4 @ 48MHz", "5V operating voltage with up to 24V input tolerance", "Built-in 12-bit DAC, CAN bus, and operational amplifier", "USB-C high-speed programming interface"],
    whatsInBox: ["1x Arduino UNO R4 Minima Board", "1x High-Speed USB Type-C Cable", "1x Quickstart Pinout Reference Card"],
    nepAligned: true,
    atlCertified: true,
    warrantyMonths: 12
  },
  {
    id: "mat-prod-2",
    name: "ATmega328P 5V Nano V3.0 Development Board 16MHz Type-C (Item 2, Package A)",
    category: "microcontrollers",
    gradeLevel: "Class 6-8",
    price: 438,
    originalPrice: 650,
    rating: 4.9,
    reviewsCount: 64,
    stock: 95,
    minStockAlert: 15,
    sku: "BALKI-ATL-A02-NANOV3",
    warehouseLocation: "Hyderabad Central Logistics Hub",
    image: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Compact breadboard-friendly ATmega328P microcontroller with CH340 USB-C interface for embedded robotics.",
    description: "Designed for compact wearable and rover installations. Operates at 16MHz clock with 32KB flash memory, 14 digital I/O pins, and 8 analog inputs on a breadboard-friendly DIP-30 footprint.",
    features: ["ATmega328P 16MHz processor with CH340G USB controller", "Modern USB Type-C interface", "8 Analog input pins (A0-A7)", "Breadboard pluggable form factor"],
    whatsInBox: ["1x ATmega328P Nano V3.0 Board (Pre-soldered headers)", "1x USB Type-C Cable"],
    nepAligned: true,
    atlCertified: true,
    warrantyMonths: 12
  },
  {
    id: "mat-prod-3",
    name: "ESP32-WROOM-32 38Pin WiFi+Bluetooth Dual Core Board (Item 3, Package A)",
    category: "microcontrollers",
    gradeLevel: "Class 9-10",
    price: 514,
    originalPrice: 750,
    rating: 4.94,
    reviewsCount: 112,
    stock: 140,
    minStockAlert: 20,
    sku: "BALKI-ATL-A03-ESP32",
    warehouseLocation: "Bengaluru Depot",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    shortDesc: "High-performance dual-core Xtensa 32-bit LX6 microcontroller with 2.4GHz Wi-Fi and Bluetooth BLE 4.2.",
    description: "The premier platform for IoT and smart city automation in school ATL labs. Features dual cores running up to 240MHz, capacitive touch sensors, Hall sensor, and deep-sleep ultra-low power consumption.",
    features: ["Dual-core Xtensa LX6 microprocessor up to 240MHz", "Integrated 802.11 b/g/n Wi-Fi and Bluetooth v4.2 BR/EDR and BLE", "520KB SRAM + 4MB external SPI flash", "Rich peripherals: capacitive touch, ADC, DAC, UART, SPI, I2C, PWM"],
    whatsInBox: ["1x ESP32-WROOM-32 38-Pin Development Board", "1x Micro-USB Programming Cable"],
    nepAligned: true,
    atlCertified: true,
    warrantyMonths: 12
  },
  {
    id: "mat-prod-141",
    name: "Raspberry Pi 5 Model 8GB RAM Single Board Computer (Item 141, Package C)",
    category: "microcontrollers",
    gradeLevel: "Class 11-12",
    price: 24999,
    originalPrice: 28500,
    rating: 4.98,
    reviewsCount: 76,
    stock: 35,
    minStockAlert: 5,
    sku: "BALKI-ATL-C01-RPI5-8GB",
    warehouseLocation: "Hyderabad Central Logistics Hub",
    image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=800&q=80",
    shortDesc: "64-bit quad-core Arm Cortex-A76 processor @ 2.4GHz with 8GB LPDDR4X SDRAM and VideoCore VII GPU.",
    description: "Deliver desktop-class performance and advanced computer vision in your ATL lab. Delivers 2-3x the CPU speed of Raspberry Pi 4, featuring dual 4Kp60 HDMI display outputs, PCIe 2.0 interface, and dual-band Wi-Fi.",
    features: ["2.4GHz quad-core 64-bit Arm Cortex-A76 CPU", "8GB high-speed LPDDR4X-4267 SDRAM", "Dual 4Kp60 micro-HDMI display outputs with HDR support", "PCIe 2.0 interface for fast NVMe storage expansion"],
    whatsInBox: ["1x Raspberry Pi 5 8GB Board", "1x Official Active Cooler Heatsink Fan", "1x 27W USB-C Power Supply", "1x Micro-HDMI to Standard HDMI Cable"],
    nepAligned: true,
    atlCertified: true,
    warrantyMonths: 12
  },
  {
    id: "mat-prod-147",
    name: "Official Arduino Tiny Machine Learning Kit AKX00028 Starter Bundle (Item 147, Package C)",
    category: "microcontrollers",
    gradeLevel: "Class 9-10",
    price: 8499,
    originalPrice: 10500,
    rating: 4.92,
    reviewsCount: 48,
    stock: 28,
    minStockAlert: 4,
    sku: "BALKI-ATL-C07-TINYML",
    warehouseLocation: "Hyderabad Central Logistics Hub",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Official TinyML bundle with Arduino Nano 33 BLE Sense, OV7675 camera module & custom carrier shield.",
    description: "Developed in collaboration with Harvard and TensorFlow. Enables students to train practical deep neural network models on a PC and run inference directly on the Nordic nRF52840 Cortex-M4 microcontroller.",
    features: ["Arduino Nano 33 BLE Sense with onboard 9-axis IMU, microphone, and gesture sensors", "OV7675 Camera module with custom carrier shield", "Directly compatible with Edge Impulse machine learning workflow", "Pre-configured code libraries for voice keyword spotting and gesture detection"],
    whatsInBox: ["1x Arduino Nano 33 BLE Sense Board", "1x OV7675 Camera Module", "1x Arduino Tiny Machine Learning Shield", "1x Micro-USB Cable"],
    nepAligned: true,
    atlCertified: true,
    warrantyMonths: 12
  },
  // --- 3. SENSORS & AUTOMATION MODULES ('sensors') ---
  {
    id: "mat-prod-65",
    name: "HC-SR04 Ultrasonic Range Finder Sensor Module (Item 65, Package A)",
    category: "sensors",
    gradeLevel: "Class 6-8",
    price: 86,
    originalPrice: 140,
    rating: 4.88,
    reviewsCount: 220,
    stock: 350,
    minStockAlert: 50,
    sku: "BALKI-ATL-A65-HCSR04",
    warehouseLocation: "Hyderabad Central Logistics Hub",
    image: "https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Non-contact ultrasonic echolocation distance sensor measuring from 2cm to 400cm with 3mm precision.",
    description: "The standard distance measurement sensor for robotics obstacle avoidance and liquid level monitoring. Operates at 5V, emitting a 40kHz ultrasonic burst and measuring echo bounce return latency.",
    features: ['Measuring range: 2cm to 400cm (0.8" to 157")', "Accuracy: 3mm resolution", "Operating voltage: 5V DC at 15mA", "Trigger and Echo digital GPIO interface"],
    whatsInBox: ["1x HC-SR04 Ultrasonic Sensor Module", "4x Female-to-Female DuPont Jumper Wires"],
    nepAligned: true,
    atlCertified: true,
    warrantyMonths: 12
  },
  {
    id: "mat-prod-107",
    name: "Environmental Air Quality & Gas Monitoring Station (DHT + MQ-135 + 16x2 LCD) (Item 107, Package A)",
    category: "sensors",
    gradeLevel: "Class 9-10",
    price: 1769,
    originalPrice: 2400,
    rating: 4.95,
    reviewsCount: 52,
    stock: 45,
    minStockAlert: 6,
    sku: "BALKI-ATL-A107-ENVIRO",
    warehouseLocation: "Hyderabad Central Logistics Hub",
    image: "/products/environmental_station_lcd.jpg",
    gallery: [
      "/products/environmental_station_lcd.jpg",
      "/src/assets/images/air_quality_station_1792086691081.jpg"
    ],
    shortDesc: "Complete environmental monitoring station with Arduino UNO, DHT11/22 sensor, MQ-135 gas detector, buzzer & 16x2 LCD screen.",
    description: "Enables high-precision atmospheric pollution, indoor air quality, and hazardous gas detection research. Features an Arduino UNO controller reading live ambient temperature, relative humidity %, and air gas PPM concentrations, displaying metrics simultaneously on a backlit LCD1602 screen with audible buzzer threshold alarm.",
    features: ["Real-time MQ-135 hazardous smoke, alcohol, and gas concentration sensing", "Digital DHT11/22 calibrated ambient temperature & humidity telemetry", "Parallel LCD1602 green-backlit multi-line display with I2C/direct pinout", "Onboard active acoustic alarm buzzer for hazardous threshold alerts"],
    whatsInBox: ["1x Calibrated Arduino UNO Controller Board", "1x MQ-135 Wide-Spectrum Gas/Smoke Sensor Module", "1x DHT11 Digital Temperature & Humidity Sensor", "1x LCD1602 Alphanumeric Display with I2C Interface", "1x Active Piezoelectric Buzzer & Mounting Board"],
    nepAligned: true,
    atlCertified: true,
    warrantyMonths: 12
  },
  {
    id: "mat-prod-144",
    name: "R307S Optical Fingerprint Reader Biometric Sensor Module (Item 144, Package C)",
    category: "sensors",
    gradeLevel: "Class 9-10",
    price: 1186,
    originalPrice: 1650,
    rating: 4.9,
    reviewsCount: 39,
    stock: 40,
    minStockAlert: 5,
    sku: "BALKI-ATL-C04-R307S",
    warehouseLocation: "Hyderabad Central Logistics Hub",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    shortDesc: "All-in-one optical biometric fingerprint recognition sensor with onboard DSP image processing.",
    description: "Integrates optical fingerprint scanning, image processing, template generation, and fingerprint matching. Stores up to 1000 fingerprints with high security and UART serial communication.",
    features: ["Optical fingerprint sensing with blue/green LED illumination", "Stores and matches up to 1000 fingerprint templates", "False Acceptance Rate (FAR) < 0.001%", "UART serial interface compatible with Arduino, ESP32 and Raspberry Pi"],
    whatsInBox: ["1x R307S Optical Fingerprint Sensor Module", "1x 6-Pin JST Connecting Wire Harness"],
    nepAligned: true,
    atlCertified: true,
    warrantyMonths: 12
  },
  // --- 4. ROBOTICS & ACTUATORS ('robotics-mechanics') ---
  {
    id: "mat-prod-132",
    name: "4-DOF Smartphone Web-Controlled Robotic Arm STEM Kit (Item 132, Package B)",
    category: "robotics-mechanics",
    gradeLevel: "Class 6-8",
    price: 4974,
    originalPrice: 6500,
    rating: 4.96,
    reviewsCount: 135,
    stock: 55,
    minStockAlert: 8,
    sku: "BALKI-ATL-B21-ROBARM",
    warehouseLocation: "Bengaluru Depot",
    image: "/products/robotic_arm_mobile_control.jpg",
    gallery: [
      "/products/robotic_arm_mobile_control.jpg",
      "/src/assets/images/robotic_arm_kit_1792086690563.jpg"
    ],
    shortDesc: "Articulated 4-DOF laser-cut robotic arm with SG90 micro servos and real-time smartphone slider web dashboard.",
    description: "A hands-on mechanical and embedded robotics kit. Features an articulated laser-cut MDF chassis with 4x micro servos controlling Base rotation, Shoulder pitch, Elbow pitch, and Gripper claw clamp. Controlled wirelessly via smartphone web interface with Record & Play motion sequencing.",
    features: ["4-Axis degree-of-freedom articulated arm with geared micro servos", "Web-based smartphone slider control interface (Gripper, Elbow, Shoulder, Base)", "Record & Play automated repeatable trajectory sequencing mode", "Includes wooden mechanical links, fasteners, and Arduino/ESP servo driver board"],
    whatsInBox: ["1x Precision Laser-Cut Arm Chassis Assembly Kit", "4x High-Torque SG90/MG90S Micro Servos", "1x Dedicated Wireless Servo Controller Board", "1x Gripper Assembly with Hardware Fasteners"],
    nepAligned: true,
    atlCertified: true,
    warrantyMonths: 12
  },
  {
    id: "mat-prod-127",
    name: "JK42HS48-1684-01 NEMA17 Stepper Motor with A4988 Driver (Item 127, Package B)",
    category: "robotics-mechanics",
    gradeLevel: "Class 9-10",
    price: 985,
    originalPrice: 1400,
    rating: 4.88,
    reviewsCount: 82,
    stock: 110,
    minStockAlert: 15,
    sku: "BALKI-ATL-B16-NEMA17",
    warehouseLocation: "Bengaluru Depot",
    image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80",
    shortDesc: "High-torque 4.4 kg-cm hybrid stepper motor with 1.8\xB0 step angle and A4988 microstepping driver board.",
    description: "The industry-standard precision actuator for 3D printers, CNC plotters, robotic arms, and linear gantry actuators. Comes paired with an Allegro A4988 microstepping driver shield with adjustable current limiting.",
    features: ["Holding torque: 4.4 kg-cm (43 N-cm)", "Step angle: 1.8 degrees (200 steps per revolution)", "Rated current: 1.68A per phase", "Includes A4988 driver module with aluminum heatsink"],
    whatsInBox: ["1x JK42HS48 NEMA17 Stepper Motor with 1-meter cable", "1x A4988 Stepper Motor Driver Shield with Heatsink"],
    nepAligned: true,
    atlCertified: true,
    warrantyMonths: 12
  },
  {
    id: "mat-prod-137",
    name: "Electric Vehicle (EV) Educational Technology Prototyping Kit (Item 137, Package B)",
    category: "robotics-mechanics",
    gradeLevel: "Class 9-10",
    price: 15e3,
    originalPrice: 19500,
    rating: 4.95,
    reviewsCount: 42,
    stock: 25,
    minStockAlert: 3,
    sku: "BALKI-ATL-B26-EVKIT",
    warehouseLocation: "Bengaluru Depot",
    image: "/products/ev_educational_prototyping_kit.png",
    shortDesc: "Complete educational EV workbench with BLDC/DC traction motor, motor controller, regenerative braking & battery telemetry.",
    description: "Built specifically for NEP 2020 vocational clean energy curricula. Students assemble a functional scale electric vehicle drive chassis, analyzing battery management systems (BMS), motor torque curves, and power consumption.",
    features: ["High-torque traction motor with electronic speed controller (ESC)", "Rechargeable high-current battery pack with BMS telemetry", "Throttle pedal/potentiometer control with forward/reverse switching", "Digital voltmeter and ammeter for live energy consumption analysis"],
    whatsInBox: ["1x Heavy-Duty EV Scale Metal Drive Chassis", "1x High-Torque DC Traction Motor", "1x Dedicated Electronic Speed Controller", "1x Battery Pack & Balancing Charger", "1x Multi-Function Telemetry Display"],
    nepAligned: true,
    atlCertified: true,
    warrantyMonths: 12
  },
  // --- 5. 3D PRINTING & FABRICATION ('drone-3d') ---
  {
    id: "mat-prod-148",
    name: "Creality K1C High-Speed 3D Printer (Item 148, Package D)",
    category: "drone-3d",
    gradeLevel: "All Grades",
    price: 66249,
    originalPrice: 75e3,
    rating: 4.97,
    reviewsCount: 165,
    stock: 22,
    minStockAlert: 2,
    sku: "BALKI-ATL-D01-K1C",
    warehouseLocation: "Hyderabad Central Logistics Hub",
    image: "/products/creality_k1c_3d_printer.png",
    shortDesc: "600mm/s CoreXY enclosed 3D printer with AI camera, carbon-fiber reinforced printing, and auto bed-leveling.",
    description: "The champion 3D printer for modern ATL fabrication laboratories. Reaches maximum printing speeds of 600mm/s with 20,000mm/s\xB2 acceleration. Features an all-metal direct drive extruder, unicorn quick-swap nozzle, and chamber AI camera for automated spaghetti failure detection.",
    features: ["Blazing print speed up to 600mm/s with 20,000mm/s\xB2 acceleration", "Build volume: 220 x 220 x 250 mm in a fully enclosed heated chamber", "Supports carbon-fiber reinforced filaments (PLA-CF, PETG-CF), ABS, TPU & PLA", "Integrated AI Camera for real-time monitoring and automated time-lapse video generation", "Hands-free auto bed-leveling with strain gauge sensor"],
    whatsInBox: ["1x Creality K1C Fully Assembled 3D Printer", "1x 1kg Spool of Premium Hyper PLA Filament", "1x Toolset, Flush Cutters, Hex Keys & PEI Flexible Build Plate", "1x Power Cable & USB Drive with Slicing Software"],
    nepAligned: true,
    atlCertified: true,
    warrantyMonths: 12
  },
  {
    id: "mat-prod-143",
    name: "Meta Quest 3S VR Headset 128GB with Controllers (Item 143, Package C)",
    category: "drone-3d",
    gradeLevel: "Class 9-10",
    price: 41250,
    originalPrice: 48e3,
    rating: 4.96,
    reviewsCount: 58,
    stock: 18,
    minStockAlert: 2,
    sku: "BALKI-ATL-C03-QUEST3S",
    warehouseLocation: "Hyderabad Central Logistics Hub",
    image: "/products/meta_quest_3s_vr.png",
    shortDesc: "Standalone mixed reality VR headset with full-color passthrough and Touch Plus haptic controllers.",
    description: "Immerse school students in interactive 3D science simulations, architectural walkthroughs, and spatial geometry. Powered by the Snapdragon XR2 Gen 2 platform, delivering crisp visual fidelity without needing a high-end PC.",
    features: ["High-resolution fast-switch LCD displays with full-color stereoscopic passthrough", "Qualcomm Snapdragon XR2 Gen 2 processor with 128GB onboard storage", "Precision inside-out spatial tracking (no external base stations needed)", "Includes dual Touch Plus controllers with TruTouch haptic feedback"],
    whatsInBox: ["1x Meta Quest 3S Headset with Standard Facial Interface", "2x Touch Plus Controllers with Wrist Lanyards", "1x Power Adapter & Charging Cable"],
    nepAligned: true,
    atlCertified: true,
    warrantyMonths: 12
  },
  {
    id: "mat-prod-134",
    name: "Balki Smart 4WD Autonomous Navigation & Obstacle Avoidance Kit (Item 134, Package B)",
    category: "robotics-mechanics",
    gradeLevel: "Class 9-10",
    price: 4113,
    originalPrice: 5500,
    rating: 4.95,
    reviewsCount: 78,
    stock: 45,
    minStockAlert: 6,
    sku: "BALKI-ATL-B23-AUTOROBOT",
    warehouseLocation: "Bengaluru Depot",
    image: "/src/assets/images/robotics_automation_kit_1792018814223.jpg",
    shortDesc: "ESP32 programmable 4WD smart rover robot with ultrasonic obstacle avoidance, line tracking, and Wi-Fi telemetry.",
    description: "A modular autonomous ground robotics development platform. Students program PID trajectory stabilization, ultrasonic navigation, and obstacle avoidance maneuvers in C++ Arduino IDE or Python, controlling the robot via smartphone Wi-Fi app.",
    features: ["Onboard ESP32 dual-core robotics controller with IMU balance sensor", "Directly programmable via Arduino IDE with pre-tuned motor control algorithms", "Smartphone Wi-Fi companion app for virtual telemetry & steering", "Rechargeable Li-Ion battery pack with USB charging protection"],
    whatsInBox: ["1x 4WD Aluminum Robot Chassis with High-Torque Geared Motors", "1x ESP32 Dual-Core Robotics Motherboard", "1x Ultrasonic Distance Radar & 8-Ch Line Follower Array", "1x Rechargeable Battery Pack with Charger"],
    nepAligned: true,
    atlCertified: true,
    warrantyMonths: 12
  },
  // --- 6. PHYSICS LAB & POWER SUPPLIES ('physics-lab') ---
  {
    id: "mat-prod-87",
    name: "Wanptek WPS305H 30V/5A Variable Adjustable DC Power Supply (Item 87, Package A)",
    category: "physics-lab",
    gradeLevel: "All Grades",
    price: 8936,
    originalPrice: 11500,
    rating: 4.94,
    reviewsCount: 62,
    stock: 35,
    minStockAlert: 4,
    sku: "BALKI-ATL-A87-WANPTEK",
    warehouseLocation: "Hyderabad Central Logistics Hub",
    image: "/products/wanptek_dc_power_supply.png",
    shortDesc: "High-precision 4-digit LED display benchtop variable switching DC regulated power supply (0\u201330V, 0\u20135A).",
    description: "An indispensable laboratory instrument for powering sensitive microcontrollers, testing motor stall currents, and verifying electronic circuit prototypes with short-circuit and over-voltage safety protection.",
    features: ["Continuous adjustment from 0 to 30 Volts and 0 to 5 Amperes", "High-accuracy 4-digit digital LED display for voltage, current, and wattage", "Constant Voltage (CV) and Constant Current (CC) automatic switching", "Short-circuit alarm with overload protection cutoff"],
    whatsInBox: ["1x Wanptek WPS305H Benchtop DC Power Supply Unit", "1x Pair of Heavy-Duty Alligator Clip Output Cables", "1x 230V AC Mains Cord"],
    nepAligned: true,
    atlCertified: true,
    warrantyMonths: 12
  },
  {
    id: "mat-prod-85",
    name: "Active Single-Axis Solar Sun Tracking System STEM Kit (Item 85, Package A)",
    category: "physics-lab",
    gradeLevel: "Class 6-8",
    price: 1031,
    originalPrice: 1500,
    rating: 4.94,
    reviewsCount: 71,
    stock: 60,
    minStockAlert: 8,
    sku: "BALKI-ATL-A85-SOLARTRACK",
    warehouseLocation: "Ambala Cantt Depot",
    image: "/products/solar_tracker_overhead.jpg",
    gallery: [
      "/products/solar_tracker_overhead.jpg",
      "/products/solar_tracker_angled.jpg",
      "/products/solar_tracker_front.jpg",
      "/products/solar_tracker_rear.jpg",
      "/products/solar_tracker_side.jpg"
    ],
    shortDesc: "Motorized dual-LDR active solar sun tracker with photovoltaic panel, BO gear motor & comparator board.",
    description: "Teaches students active renewable energy harvesting, photoelectric conversion, and automated analog tracking algorithms. Employs two black-shrouded LDR light sensors to detect light differential, driving a high-torque BO motor to pivot the solar panel perpendicular to sunlight for peak power generation.",
    features: ["Dual light-dependent resistor (LDR) differential light sensing", "High-torque yellow BO geared motor on precision tilt swivel axis", "High-efficiency monocrystalline solar panel module with continuous voltage output", "Dedicated analog comparator motor driver control board with dual 9V power"],
    whatsInBox: ["1x Articulated Laser-Cut Yellow Base & Tilt Swivel Assembly", "1x Monocrystalline Solar Panel Module", "1x BO Geared Motor with Drive Coupling", "2x Shrouded LDR Light Sensors & Driver PCB", "2x 9V Hi-Watt Heavy Duty Batteries with Snap Clips"],
    nepAligned: true,
    atlCertified: true,
    warrantyMonths: 12
  },
  // --- 7. BIOLOGY, AGRITECH & WATER STEM ('biology-anatomy') ---
  {
    id: "mat-prod-111",
    name: "OM LABS Bio-Tech Arduino STEM Kit (Item 111, Package A)",
    category: "biology-anatomy",
    gradeLevel: "Class 9-10",
    price: 7024,
    originalPrice: 9200,
    rating: 4.96,
    reviewsCount: 54,
    stock: 30,
    minStockAlert: 4,
    sku: "BALKI-ATL-A111-BIOTECH",
    warehouseLocation: "Bengaluru Depot",
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Human physiology biometrics kit with EMG muscle sensor, SpO2 blood oxygen, heart pulse, temp & pH probes.",
    description: "Bridges life sciences and embedded electronics. Students measure real bio-potentials (electromyography muscle flex signals), pulse oximetry, galvanic skin response, and body temperature on an Arduino telemetry dashboard.",
    features: ["Medical-grade electromyography (EMG) muscle sensor with surface electrodes", "MAX30102 / MAX30100 Pulse Oximeter and Heart-Rate sensor", "Digital clinical temperature probe and precision pH electrode", "Pre-built graphical telemetry monitor for classroom demonstration"],
    whatsInBox: ["1x Arduino UNO Compatible Controller with Shield", "1x EMG Muscle Sensor with 3x Reusable Gel Electrodes", "1x Pulse Oximeter SpO2 Sensor", "1x Precision pH Electrode & Calibration Buffers"],
    nepAligned: true,
    atlCertified: true,
    warrantyMonths: 12
  },
  {
    id: "mat-prod-84",
    name: "Smart Touchless Ultrasonic Dustbin & Sanitation STEM Kit (Item 84, Package A)",
    category: "biology-anatomy",
    gradeLevel: "Class 6-8",
    price: 5586,
    originalPrice: 7200,
    rating: 4.92,
    reviewsCount: 46,
    stock: 35,
    minStockAlert: 5,
    sku: "BALKI-ATL-A84-DUSTBIN",
    warehouseLocation: "Hyderabad Central Logistics Hub",
    image: "/products/smart_dustbin_flatlay.jpg",
    gallery: [
      "/products/smart_dustbin_flatlay.jpg",
      "/src/assets/images/smart_dustbin_kit_1792086690761.jpg"
    ],
    shortDesc: "Automated hands-free smart waste bin with ultrasonic sonar distance sensing, micro servo lid & Arduino UNO.",
    description: "Empowers students to build smart city sanitation and touchless hygiene devices. When a hand or waste approaches within 20cm, the HC-SR04 ultrasonic sensor triggers the high-torque SG90 micro servo to lift the hinged bin lid automatically, closing it seamlessly after disposal.",
    features: ["Touchless automated lid opening powered by SG90 micro servo motor", "HC-SR04 Ultrasonic Sonar rangefinder with dual transducer eyes", "Arduino UNO programmable controller with customizable distance thresholds", "Complete with 9V battery harness, toggle switch, and desktop yellow bin"],
    whatsInBox: ["1x Bright Yellow Cylindrical Desktop Waste Bin with Hinged Flap Lid", "1x Arduino UNO Microcontroller Board with USB Cable", "1x HC-SR04 Ultrasonic Distance Sensor Module", "1x Micro Servo Motor (SG90 with horns & linkage arm)", "1x 9V Heavy Duty Battery, Snap Connector & Power Switch"],
    nepAligned: true,
    atlCertified: true,
    warrantyMonths: 12
  },
  {
    id: "mat-prod-83",
    name: "Smart Plant Irrigation & Agri-Tech Arduino STEM Kit (Item 83, Package A)",
    category: "biology-anatomy",
    gradeLevel: "Class 6-8",
    price: 2886,
    originalPrice: 3800,
    rating: 4.96,
    reviewsCount: 68,
    stock: 50,
    minStockAlert: 6,
    sku: "BALKI-ATL-A83-IRRIGATE",
    warehouseLocation: "Bengaluru Depot",
    image: "/products/smart_irrigation_flatlay.webp",
    gallery: [
      "/products/smart_irrigation_flatlay.webp",
      "/products/smart_irrigation_live.jpg",
      "/products/smart_irrigation_schematic.webp"
    ],
    shortDesc: "Automated plant watering system with soil moisture sensor, 5V relay, submersible water pump & 18650 Li-ion battery.",
    description: "Brings precision smart agriculture and IoT environmental science into school ATL labs. The corrosion-resistant soil moisture probe monitors soil hydration levels in real time. When moisture drops below calibrated thresholds, the Arduino triggers a 5V Songle relay to pump water from a reservoir directly to the plant root zone through clear vinyl tubing.",
    features: ["Dual-prong soil moisture probe with LM393 sensitivity comparator module", "5V Songle relay isolation module safely controlling the DC pump", "Submersible miniature 5V DC water pump with transparent vinyl tubing", "Rechargeable dual 3.7V 18650 Li-ion battery pack with slot holder & DC jack", "Complete step-by-step circuit wiring diagram and Arduino code provided"],
    whatsInBox: ["1x Arduino UNO Development Board with USB Cable", "1x Soil Moisture Sensor Probe & LM393 Comparator Board", "1x 5V Relay Module (Songle SRD)", "1x Miniature Submersible Water Pump with Clear Tubing", "1x Dual 18650 Li-ion Battery Holder with 2x 3.7V Batteries", "1x Barrel DC Jack & Jumper Wire Bundle"],
    nepAligned: true,
    atlCertified: true,
    warrantyMonths: 12
  },
  // --- 8. GRADE-PROGRESSIVE FOUNDATIONAL STEM KITS ('grade-kits') ---
  {
    id: "kit-j-01",
    name: "Junior Tinkerer: Snap-Circuit & Magnetic Electronics Discovery Kit",
    category: "grade-kits",
    gradeLevel: "Class 3-5",
    price: 3299,
    originalPrice: 4200,
    rating: 4.95,
    reviewsCount: 84,
    stock: 45,
    minStockAlert: 5,
    sku: "BALKI-GRD-J01-SNAP",
    warehouseLocation: "Hyderabad Central Logistics Hub",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Tool-free modular magnetic snaps for elementary students to explore lights, switches, buzzers, and motor circuits safely.",
    description: "Designed for NEP 2020 experiential foundational science in primary grades. Children connect magnetic conductive blocks to build over 50 projects including police sirens, flying saucer propellers, and light-sensitive night lamps with no soldering or exposed wires.",
    features: ["100% Shock-proof magnetic clip-and-lock modular components", "Build over 50 interactive circuit experiments with pictorial visual guides", "Includes colorful LEDs, touch switches, light sensor, and propeller fan", "Runs on 2x AA batteries with built-in auto short-circuit protection"],
    whatsInBox: ["1x Magnetic Baseboard Grid", "30x Snap-Together Circuit Modules", "1x Illustrated 64-Page Full Color Experiment Guide", "2x AA Safety Battery Enclosure"],
    nepAligned: true,
    atlCertified: true,
    warrantyMonths: 12
  },
  {
    id: "kit-j-02",
    name: "Eco-Green Renewable Solar & Wind Clean Energy Explorer Kit",
    category: "grade-kits",
    gradeLevel: "Class 3-5",
    price: 2499,
    originalPrice: 3200,
    rating: 4.91,
    reviewsCount: 62,
    stock: 40,
    minStockAlert: 6,
    sku: "BALKI-GRD-J02-ECO",
    warehouseLocation: "Bengaluru Depot",
    image: "https://images.unsplash.com/photo-1508873696983-2df5293cb39f?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Hands-on solar turbine and mini wind generator kit demonstrating clean energy conversion and storage.",
    description: "Inspires early climate science and clean engineering. Young tinkerers build functional solar cars, revolving wind turbines, and hydro-wheel power stations while observing voltage generation on an integrated LED voltmeter meter.",
    features: ["Assemble 6 distinct working clean-energy models", "Photovoltaic silicon solar cell + micro-generator wind turbine blade", "Visual LED meter showing real-time green energy generation", "Durable non-toxic ABS interlocking modular mechanical pieces"],
    whatsInBox: ["1x High-Efficiency Micro Solar Cell", "1x Aerodynamic Wind Turbine with Generator Hub", "1x Solar Rover Chassis & Wheels", "1x Multimeter Test Cable"],
    nepAligned: true,
    atlCertified: true,
    warrantyMonths: 12
  },
  // --- 9. CHEMISTRY & MATERIAL SCIENCE ('chemistry-lab') ---
  {
    id: "kit-chem-01",
    name: "Advanced Chemistry Glassware & Organic Synthesis Workstation Set",
    category: "chemistry-lab",
    gradeLevel: "Class 9-10",
    price: 11499,
    originalPrice: 14500,
    rating: 4.93,
    reviewsCount: 37,
    stock: 20,
    minStockAlert: 3,
    sku: "BALKI-LAB-CH01-GLASS",
    warehouseLocation: "Ambala Cantt Depot",
    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Borosilicate 3.3 laboratory distillation apparatus, titration burettes, test tubes, heating mantle & safety ware.",
    description: "Conforms to CBSE and state board senior laboratory standards. Constructed from thermal shock-resistant Borosilicate 3.3 glass with standardized 24/40 ground glass joints for distillation, titration, refluxing, and chemical analysis.",
    features: ["Class A ASTM calibrated volumetric flasks, graduated cylinders, and burettes", "Thermal shock resistant Borosilicate 3.3 laboratory glass rated to 500\xB0C", "24/40 Precision ground joints for leak-free chemical distillation", "Complete with heavy cast-iron retort stands, clamps, and chemical splash goggles"],
    whatsInBox: ["1x 24/40 Borosilicate Distillation Column Set", "1x 500ml Round Bottom Flask & Liebig Condenser", "1x 50ml Precision Burette with PTFE Stopcock", "12x Borosilicate Test Tubes with Rack", "2x Chemical Splash Goggles & Nitrile Gloves"],
    nepAligned: true,
    atlCertified: true,
    warrantyMonths: 12
  },
  // --- 10. MICROSCOPES & OPTICS ('microscopes-optics') ---
  {
    id: "kit-opt-01",
    name: "Research Binocular Biological Compound Microscope 1600X Lab Set",
    category: "microscopes-optics",
    gradeLevel: "Class 11-12",
    price: 18999,
    originalPrice: 23500,
    rating: 4.97,
    reviewsCount: 51,
    stock: 18,
    minStockAlert: 2,
    sku: "BALKI-LAB-OP01-MICROSCOPE",
    warehouseLocation: "Ambala Cantt Depot",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Professional 1600X optical compound microscope with dual LED illumination, mechanical stage & 5MP USB digital camera.",
    description: "Delivers crystal-clear magnification of cellular mitosis, microbiology specimens, and histology slides. Features an adjustable Siedentopf binocular head, coaxial coarse & fine focus, Abbe 1.25 NA condenser, and a 5MP USB digital eyepiece for live projection on classroom screens.",
    features: ["Magnification range: 40X, 100X, 400X, 1000X, and 1600X with DIN achromatic optics", "Coaxial coarse & fine focusing with 0.002mm division precision", "Dual-layer mechanical stage with X-Y vernier caliper movement controls", "Includes 5.0MP USB digital microscope camera with Windows/Mac measurement software"],
    whatsInBox: ["1x Professional Binocular Microscope Body with 4x DIN Objectives (4X, 10X, 40X, 100X Oil)", "2x Pairs of Widefield Eyepieces (WF10X & WF16X)", "1x 5MP USB Digital Eyepiece Camera & Driver Software", "1x Immersion Oil Bottle & 50x Blank Prepared Slides"],
    nepAligned: true,
    atlCertified: true,
    warrantyMonths: 24
  },
  // --- 11. EXPERIENTIAL MATHEMATICS LAB ('mathematics-lab') ---
  {
    id: "kit-math-01",
    name: "NEP Experiential Mathematics & Solid Geometry Manipulatives Kit",
    category: "mathematics-lab",
    gradeLevel: "Class 6-8",
    price: 4899,
    originalPrice: 6200,
    rating: 4.9,
    reviewsCount: 43,
    stock: 35,
    minStockAlert: 4,
    sku: "BALKI-LAB-MT01-GEOM",
    warehouseLocation: "Hyderabad Central Logistics Hub",
    image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Physical geometry apparatus: transparent 3D volume dissection sets, clinometers, Napier bones & algebraic tiles.",
    description: "Transforms abstract mathematics into tactile, intuitive understanding. Aligned with NEP 2020 mathematical inquiry pedagogy. Students physically verify Pythagoras theorem, volume equivalence (cylinder vs cone vs sphere), and coordinate geometry.",
    features: ["Transparent hollow geometric solids demonstrating liquid volume ratios", "Precision metal trigonometric clinometer for indirect height measurement", "Color-coded magnetic algebraic tiles for polynomial factorization", "Durable acrylic Pythagoras theorem verification balance apparatus"],
    whatsInBox: ["14x Transparent Geometric Volume Solids with Filling Plugs", "1x Metal Clinometer with Heavy Base", "1x Set of 100 Magnetic Algebraic Tiles", "1x Napier Bones Set & Coordinate Grid Board"],
    nepAligned: true,
    atlCertified: true,
    warrantyMonths: 12
  },
  // --- 12. CALIBRATION & BENCHMARK VERIFICATION ITEMS ---
  {
    id: "test-item-999",
    name: "Starter Sensor & Resistor Module (\u20B9999 Small Order Calibration)",
    category: "sensors",
    gradeLevel: "Class 6-8",
    price: 719.49,
    originalPrice: 1200,
    rating: 5,
    reviewsCount: 12,
    stock: 50,
    minStockAlert: 5,
    sku: "BALKI-TEST-0999",
    warehouseLocation: "Hyderabad Central Logistics Hub",
    image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Calibrated benchmark product resulting in exactly \u20B9999.00 order total with 18% GST and standard shipping.",
    description: "Precision test bundle for verifying Small Order automatic checkout path (< \u20B95,000 threshold).",
    features: ["Evaluates to exact \u20B9999 final amount with statutory 18% IGST and shipping", "Automatic payment gateway routing verification", "Small Order Razorpay staging pipeline compatible"],
    whatsInBox: ["1x Sensor calibration module", "1x Resistor precision pack", "1x Quick reference test card"],
    nepAligned: true,
    atlCertified: true,
    warrantyMonths: 12
  },
  {
    id: "test-item-4999",
    name: "Advanced Robotic Actuator & Servo Hub (\u20B94,999 Small Order Maximum)",
    category: "robotics-mechanics",
    gradeLevel: "Class 9-10",
    price: 4236.44,
    originalPrice: 5800,
    rating: 5,
    reviewsCount: 15,
    stock: 40,
    minStockAlert: 4,
    sku: "BALKI-TEST-4999",
    warehouseLocation: "Hyderabad Central Logistics Hub",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Calibrated benchmark product resulting in exactly \u20B94,999.00 order total with 18% GST and free insured shipping.",
    description: "Precision test bundle for verifying upper bound of Small Order automatic payment checkout (< \u20B95,000 threshold).",
    features: ["Evaluates to exact \u20B94,999.00 final amount (highest small order value)", "Automatic payment checkout path active", "Prepared for Razorpay payment integration without owner approval required"],
    whatsInBox: ["2x High-torque digital servos", "1x Multi-channel PCA9685 driver", "1x Power step-down BEC"],
    nepAligned: true,
    atlCertified: true,
    warrantyMonths: 12
  },
  {
    id: "test-item-5000",
    name: "Modular Microcontroller Laboratory Bench (\u20B95,000 Exact Threshold)",
    category: "microcontrollers",
    gradeLevel: "Class 11-12",
    price: 4237.29,
    originalPrice: 6e3,
    rating: 5,
    reviewsCount: 18,
    stock: 35,
    minStockAlert: 3,
    sku: "BALKI-TEST-5000",
    warehouseLocation: "Hyderabad Central Logistics Hub",
    image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Calibrated benchmark product resulting in exactly \u20B95,000.00 order total with 18% GST and free insured shipping.",
    description: "Precision test bundle for verifying exact \u20B95,000 threshold requirement: exactly \u20B95,000 MUST require owner approval.",
    features: ["Evaluates to exact \u20B95,000.00 final amount", 'Triggers "Request Owner Approval" flow as mandated', "Stores request in Firestore with approvalStatus: PENDING and paymentStatus: NOT_STARTED"],
    whatsInBox: ["1x Bench microcontroller station", "1x Shielded interface harness", "1x Calibration certificate"],
    nepAligned: true,
    atlCertified: true,
    warrantyMonths: 12
  },
  {
    id: "test-item-5500",
    name: "Autonomous Robotics Navigation & Lidar Station (\u20B95,500 High-Value Order)",
    category: "robotics-mechanics",
    gradeLevel: "Class 11-12",
    price: 4661.02,
    originalPrice: 6500,
    rating: 5,
    reviewsCount: 22,
    stock: 30,
    minStockAlert: 3,
    sku: "BALKI-TEST-5500",
    warehouseLocation: "Hyderabad Central Logistics Hub",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
    shortDesc: "Calibrated benchmark product resulting in exactly \u20B95,500.00 order total with 18% GST and free insured shipping.",
    description: "Precision test bundle for verifying Large Order approval workflow above threshold (\u20B95,500).",
    features: ["Evaluates to exact \u20B95,500.00 final amount", "Requires owner approval with zero payment collected", "Displays confirmation screen with team review notification"],
    whatsInBox: ["1x Autonomous robotic controller", "1x 2D Lidar navigation sensor", "1x Telemetry transceiver"],
    nepAligned: true,
    atlCertified: true,
    warrantyMonths: 12
  }
];
var ATL_INVENTORY = ATL_PRODUCTS.map((p) => ({
  sku: p.sku,
  name: p.name,
  category: p.category,
  currentStock: p.stock,
  minimumThreshold: p.minStockAlert,
  warehouse: p.warehouseLocation,
  unitCost: Math.round(p.price * 0.75),
  sellingPrice: p.price,
  lastRestocked: "2026-10-10",
  status: p.stock <= p.minStockAlert ? "Low Stock" : "In Stock"
}));

// src/data/initialData.ts
var INITIAL_PRODUCTS = ATL_PRODUCTS;
var INITIAL_RENTALS = [
  {
    id: "rent-1",
    name: "Industrial High-Speed 3D Printer Pro (Bambu Lab / Creality CoreXY)",
    category: "Prototyping & Fabrication",
    dailyRate: 650,
    weeklyRate: 3500,
    securityDeposit: 8e3,
    totalUnits: 8,
    availableUnits: 6,
    image: "https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=800&q=80",
    condition: "Calibrated",
    specs: [
      "Max Speed: 500 mm/s high-acceleration printing",
      "Build Volume: 256 x 256 x 256 mm",
      "Nozzle Temp: Up to 300\xB0C (PLA, ABS, PETG, Carbon Fiber)",
      "Auto-Bed Leveling & Dual Lidar Chamber Camera"
    ],
    includes: [
      "Pre-calibrated 3D printer in protective flight case",
      "2x 1kg Spools of Premium PLA filament",
      "Complete toolset, spare 0.4mm hardened steel nozzles & PEI sheet",
      "Virtual onboarding & slicing setup session with Balki engineer"
    ],
    description: "Perfect for schools and student teams preparing for national science exhibitions, ATL marathons, or college hackathons requiring rapid physical prototyping without full equipment purchase.",
    minRentalDays: 3
  },
  {
    id: "rent-2",
    name: "Precision Desktop CNC Milling & PCB Prototyping Rig",
    category: "Rapid Prototyping & CNC",
    dailyRate: 850,
    weeklyRate: 4800,
    securityDeposit: 12e3,
    totalUnits: 5,
    availableUnits: 3,
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    condition: "Brand New",
    specs: [
      "High-speed 12,000 RPM ER11 spindle motor with PWM speed control",
      "GRBL 3-axis motion controller with offline touchscreen pendant",
      "Precision lead screw drive with 0.01mm repeatability",
      "Emergency stop switch, limit switches, and acrylic safety enclosure"
    ],
    includes: [
      "Complete desktop CNC router with aluminum T-slot bed",
      "10-piece tungsten carbide engraving bit set & collet wrench",
      "Offline controller with USB SD card reader",
      "Balki CAM & G-Code generator starter software pack"
    ],
    description: "Rent our verified desktop CNC router for school circuit prototyping, acrylic engraving, wood carving, and robotics chassis fabrication.",
    minRentalDays: 3
  },
  {
    id: "rent-3",
    name: "Dual-Channel 100MHz Digital Storage Oscilloscope (DSO)",
    category: "Electronics Testing",
    dailyRate: 350,
    weeklyRate: 1800,
    securityDeposit: 4e3,
    totalUnits: 12,
    availableUnits: 9,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
    condition: "Calibrated",
    specs: [
      "Bandwidth: 100MHz real-time with 1GSa/s sampling rate",
      "7-inch High-resolution TFT color display",
      "32 Automated waveform measurement functions",
      "USB Flash storage for FFT spectrum analysis & screen capture"
    ],
    includes: [
      "100MHz DSO Unit with NABL calibration certificate",
      "2x 1X/10X switchable passive oscilloscope probes",
      "Power cord and BNC-to-Alligator clip test leads",
      "Quick reference signal analysis guide"
    ],
    description: "Essential for electronics workshops, debugging microcontrollers, PWM motor signals, and radio frequencies during school science fairs.",
    minRentalDays: 2
  },
  {
    id: "rent-4",
    name: "Advanced Programmable Humanoid Bipedal Robot Kit",
    category: "Robotics & AI",
    dailyRate: 950,
    weeklyRate: 5500,
    securityDeposit: 15e3,
    totalUnits: 4,
    availableUnits: 2,
    image: "https://images.unsplash.com/photo-1535378620166-273708d44e4c?auto=format&fit=crop&w=800&q=80",
    condition: "Excellent",
    specs: [
      "17 High-torque bus serial metal gear servos with feedback",
      "Built-in IMU sensor for real-time dynamic balance & walking gait",
      "Raspberry Pi / ESP32 dual architecture for AI vision",
      "Python & ROS (Robot Operating System) programmable"
    ],
    includes: [
      "Assembled humanoid robot in aluminum carry case",
      "Dual high-discharge battery packs and rapid charger",
      "Pre-loaded gait algorithms (walking, dancing, climbing, object tracking)",
      "Remote joystick controller & Bluetooth PC adapter"
    ],
    description: "Deliver the ultimate crowd-puller demonstration at school annual days, STEM expos, and university robotics symposiums.",
    minRentalDays: 2
  },
  {
    id: "rent-5",
    name: "High-Precision CNC PCB Milling & Engraving Machine",
    category: "Prototyping & Fabrication",
    dailyRate: 750,
    weeklyRate: 4200,
    securityDeposit: 1e4,
    totalUnits: 6,
    availableUnits: 4,
    image: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
    condition: "Calibrated",
    specs: [
      "Working Area: 300 x 180 x 45 mm",
      "Spindle Speed: 10,000 RPM ER11 high-precision chuck",
      "Offline controller with SD card slot for standalone milling",
      "Milling capabilities: Copper clad boards, Acrylic, Wood, Soft Aluminum"
    ],
    includes: [
      "Benchtop CNC 3018-Pro machine with safety acrylic shielding",
      "Set of 20 V-shape engraving bits & end mills",
      "10x Double-sided FR4 copper clad PCB blanks",
      "Virtual PCB isolation routing workflow coaching session"
    ],
    description: "Enables students to prototype real double-sided electronic circuit boards within 30 minutes inside their school ATL lab.",
    minRentalDays: 3
  },
  {
    id: "rent-6",
    name: "Thermal Diagnostics Infrared Camera (FLIR / Testo Sensor)",
    category: "Electronics Testing",
    dailyRate: 450,
    weeklyRate: 2400,
    securityDeposit: 6e3,
    totalUnits: 7,
    availableUnits: 5,
    image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=800&q=80",
    condition: "Brand New",
    specs: [
      "Thermal Resolution: 160 x 120 (19,200 temperature measurement pixels)",
      "Temperature Range: -20\xB0C to 550\xB0C (\xB12\xB0C accuracy)",
      "MSX Thermal Image Blending for crisp edge definition",
      "Built-in Wi-Fi for live report generation to iPad/Android tablets"
    ],
    includes: [
      "Handheld thermal imager in rugged drop-tested case",
      "Dual hot-swappable Li-Ion rechargeable batteries and dock",
      "Calibration certificate & thermal analysis desktop software suite"
    ],
    description: "Perfect for detecting PCB short circuits, testing solar panel hot spots, and teaching thermal dissipation physics in school labs.",
    minRentalDays: 2
  }
];
var INITIAL_COURSES = [
  {
    id: "course-1",
    title: "Junior Tinkerer: Electronics & Magic Circuits (Classes 3\u20135)",
    gradeLevel: "Class 3-5",
    targetAudience: "Elementary students stepping into electricity and basic hands-on STEM.",
    nepCompetencies: ["Foundational Scientific Inquiry", "Observation & Pattern Recognition", "Hands-on Prototyping"],
    durationWeeks: 4,
    totalHours: 12,
    enrolledStudents: 1240,
    rating: 4.9,
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
    overview: "An engaging foundational course guiding young innovators through the basics of circuits, electric current, conductors vs insulators, and luminous LED art without dangerous tools.",
    certificateTitle: "Junior STEM Inventor Certificate",
    isLiked: true,
    likesCount: 142,
    lessons: [
      {
        id: "c1-l1",
        title: "The Closed Circuit Loop: Power, Light, and Switches",
        durationMinutes: 25,
        videoSnippetTitle: "Demystifying Electrons with LED & Coin Cells",
        summary: "Understand how electrical current flows in an unbroken path from the positive to negative terminal.",
        theoryContent: "Electricity is the movement of tiny particles called electrons. For electricity to do work \u2014 like lighting up a bright LED bulb or spinning a miniature fan \u2014 it needs a complete, unbroken loop called a CLOSED CIRCUIT. If there is any break in the path, it becomes an OPEN CIRCUIT, and the current stops immediately.",
        codeSnippet: '// Virtual Circuit Simulator\nconst battery = { voltage: 3.0, connected: true };\nconst switchState = "CLOSED";\n\nif (battery.connected && switchState === "CLOSED") {\n  console.log("\u26A1 Circuit Complete: LED Glows Bright Amber!");\n} else {\n  console.log("\u2B55 Open Circuit: Current Cannot Flow.");\n}',
        codeLanguage: "javascript",
        simulationType: "led_blink",
        quiz: {
          question: "What happens to an electric circuit when you open the switch?",
          options: [
            "The current increases and the light glows brighter",
            "The loop breaks and electric current stops flowing",
            "The battery discharges instantly",
            "Electrons change direction and flow in reverse"
          ],
          correctIndex: 1,
          explanation: "Opening a switch introduces a physical air gap in the conductive path, converting the circuit into an open circuit where electricity cannot flow."
        }
      },
      {
        id: "c1-l2",
        title: "Conductors vs. Insulators: The Lemon & Graphite Mystery",
        durationMinutes: 30,
        videoSnippetTitle: "Testing Everyday Objects for Electrical Conductivity",
        summary: "Discover how metals, pencil graphite, and saltwater allow electric charge to pass, while rubber and plastic stop it.",
        theoryContent: "Materials that allow electricity to flow easily through them are called CONDUCTORS. Most metals like copper, aluminum, and even pencil lead (graphite) are good conductors. Materials that resist the flow of electricity are called INSULATORS, such as rubber, dry wood, glass, and plastic.",
        codeSnippet: '// Conductivity Tester Simulation\nfunction testMaterial(name, resistanceOhms) {\n  if (resistanceOhms < 100) {\n    return `${name} is a CONDUCTOR! Bulb lights up.`;\n  } else {\n    return `${name} is an INSULATOR. Current blocked.`;\n  }\n}\nconsole.log(testMaterial("Graphite Pencil", 15));\nconsole.log(testMaterial("Plastic Ruler", 999999));',
        codeLanguage: "javascript",
        simulationType: "led_blink",
        quiz: {
          question: "Which of the following common classroom items acts as an electrical conductor?",
          options: ["Plastic eraser", "Pencil graphite core", "Dry wooden desk", "Glass marble"],
          correctIndex: 1,
          explanation: "Graphite is a crystalline form of carbon with delocalized electrons, making it an effective electrical conductor."
        }
      }
    ]
  },
  {
    id: "course-2",
    title: "Autonomous Robotics & Sensor Integration (Classes 6\u20138)",
    gradeLevel: "Class 6-8",
    targetAudience: "Middle schoolers ready for robotics, line tracking, ultrasonic navigation, and logic.",
    nepCompetencies: ["Computational Thinking", "Algorithmic Problem Solving", "Mechanical & Sensor Systems"],
    durationWeeks: 6,
    totalHours: 20,
    enrolledStudents: 2150,
    rating: 4.95,
    thumbnail: "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?auto=format&fit=crop&w=600&q=80",
    overview: "Master the core principles of autonomous rovers. Program microcontrollers to read ultrasonic distance waves, make real-time steering decisions, and navigate obstacle courses autonomously.",
    certificateTitle: "Certified ATL Junior Roboticist",
    isLiked: false,
    likesCount: 218,
    lessons: [
      {
        id: "c2-l1",
        title: "Echolocation & Ultrasonic Radar (HC-SR04 Deep Dive)",
        durationMinutes: 35,
        videoSnippetTitle: "How Bats and Robots Measure Distance Using Sound Waves",
        summary: "Learn how ultrasonic sensors emit 40kHz acoustic pulses and calculate distance using the speed of sound.",
        theoryContent: "The HC-SR04 sensor works on the principle of acoustic reflection. It sends out an ultrasonic sound burst (40,000 Hz, beyond human hearing) from the transmitter. When the wave strikes an obstacle, it bounces back to the receiver. By measuring the travel duration (time in microseconds), and knowing that sound travels in air at ~340 m/s (0.034 cm/microsecond), we use: Distance = (Time \xD7 0.034) / 2.",
        codeSnippet: '// Arduino C++ Ultrasonic Distance Radar\nconst int trigPin = 9;\nconst int echoPin = 10;\n\nvoid setup() {\n  pinMode(trigPin, OUTPUT);\n  pinMode(echoPin, INPUT);\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  digitalWrite(trigPin, LOW);\n  delayMicroseconds(2);\n  digitalWrite(trigPin, HIGH);\n  delayMicroseconds(10);\n  digitalWrite(trigPin, LOW);\n  \n  long duration = 1200; // simulated microsecond bounce\n  int distanceCm = duration * 0.034 / 2;\n  Serial.print("Obstacle Distance: ");\n  Serial.print(distanceCm);\n  Serial.println(" cm");\n  delay(500);\n}',
        codeLanguage: "cpp",
        simulationType: "ultrasonic_radar",
        quiz: {
          question: "Why do we divide the distance calculation by 2 in ultrasonic echolocation?",
          options: [
            "Because the sound wave travels at half speed in daylight",
            "Because the measured duration covers the round-trip (out to the object and back)",
            "Because there are two sensor cylinders on the board",
            "To convert inches into metric centimeters"
          ],
          correctIndex: 1,
          explanation: "The sound wave travels forward to the object and bounces back to the receiver, doubling the travel path. Dividing by 2 isolates the single one-way distance."
        }
      },
      {
        id: "c2-l2",
        title: "H-Bridge Motor Drivers & Autonomous Obstacle Avoidance Logic",
        durationMinutes: 40,
        videoSnippetTitle: "Controlling DC Motor Direction and Steering Logic",
        summary: "Program motor states: Forward, Reverse, Spin-Left, and Spin-Right with an L298N driver based on sensor readings.",
        theoryContent: "An H-Bridge circuit allows microcontrollers to switch the polarity of DC motors, enabling both forward and reverse rotation without touching wires. Combining this with ultrasonic distance logic: If Distance < 20cm, Stop -> Reverse 200ms -> Turn Right 90\xB0 -> Check Path -> Resume Forward.",
        codeSnippet: '// Obstacle Avoidance Decision Engine\nfunction navigateRover(distanceCm) {\n  if (distanceCm < 20) {\n    return "\u26A0\uFE0F OBSTACLE DETECTED! Executing: STOP -> REVERSE -> TURN RIGHT";\n  } else {\n    return "\u2705 PATH CLEAR: Full Speed Forward at 80% PWM";\n  }\n}\nconsole.log(navigateRover(14));\nconsole.log(navigateRover(65));',
        codeLanguage: "javascript",
        simulationType: "servo_sweep",
        quiz: {
          question: "What is the primary role of an L298N motor driver between an Arduino and a DC motor?",
          options: [
            "To step down the voltage to 1.5 volts",
            "To supply high current from an external battery safely without frying the microcontroller",
            "To measure the temperature of the wheels",
            "To provide Bluetooth signals"
          ],
          correctIndex: 1,
          explanation: "Microcontrollers output only 20-40mA per pin, whereas DC motors require 500mA-2A under load. Motor driver shields isolate and amplify power safely."
        }
      }
    ]
  },
  {
    id: "course-3",
    title: "Internet of Things (IoT) & Smart Agriculture with ESP32 (Classes 9\u201310)",
    gradeLevel: "Class 9-10",
    targetAudience: "High school students building connected sensor networks, cloud dashboards, and automation.",
    nepCompetencies: ["Data Analytics & Telemetry", "Embedded Systems", "Real-world Environmental Problem Solving"],
    durationWeeks: 8,
    totalHours: 24,
    enrolledStudents: 1890,
    rating: 4.92,
    thumbnail: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=600&q=80",
    overview: "Harness the ESP32 Wi-Fi architecture to monitor soil moisture, temperature, and ambient light. Stream telemetry live to cloud platforms and trigger automatic solenoid water pumps.",
    certificateTitle: "Certified IoT Systems Specialist",
    isLiked: false,
    likesCount: 185,
    lessons: [
      {
        id: "c3-l1",
        title: "Connecting ESP32 to Wi-Fi and Publishing Telemetry via MQTT",
        durationMinutes: 45,
        videoSnippetTitle: "Cloud Telemetry Architecture & Lightweight Pub/Sub Protocols",
        summary: "Learn why MQTT is preferred over HTTP for IoT and publish live sensor payloads.",
        theoryContent: 'MQTT (Message Queuing Telemetry Transport) is an extremely lightweight publish-subscribe messaging protocol designed for battery-powered sensors operating over constrained networks. An IoT device connects to a central broker (like Balki IoT Cloud or HiveMQ) and publishes JSON payloads to specific topics (e.g. "balki/lab/soil_moisture").',
        codeSnippet: '// ESP32 MQTT Telemetry Payload\nconst telemetryPacket = {\n  device_id: "BALKI-ESP32-ATL-04",\n  soil_moisture_pct: 34,\n  ambient_temp_c: 29.4,\n  pump_state: "AUTOMATIC_ACTIVE",\n  timestamp: new Date().toISOString()\n};\n\nconsole.log("Transmitting to MQTT broker:", JSON.stringify(telemetryPacket, null, 2));',
        codeLanguage: "json",
        simulationType: "led_blink",
        quiz: {
          question: "Why is MQTT preferred over standard HTTP for battery-operated IoT sensor nodes?",
          options: [
            "It consumes substantially less power and network bandwidth due to minimal packet overhead",
            "It can only transmit text messages",
            "It requires no network connection",
            "It eliminates the need for microcontrollers"
          ],
          correctIndex: 0,
          explanation: "MQTT header overhead is as small as 2 bytes, compared to hundreds of bytes in HTTP headers, conserving battery and bandwidth on distributed IoT nodes."
        }
      }
    ]
  },
  {
    id: "course-4",
    title: "Advanced Robotics Kinematics & 3D CAD Prototyping (Classes 11\u201312)",
    gradeLevel: "Class 11-12",
    targetAudience: "Senior secondary students mastering robotic kinematics, PID motion controllers, and parametric CAD.",
    nepCompetencies: ["Advanced Engineering Design", "Control Systems Physics", "Rapid Prototyping"],
    durationWeeks: 8,
    totalHours: 28,
    enrolledStudents: 940,
    rating: 4.98,
    thumbnail: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=600&q=80",
    overview: "Dive deep into mechatronics engineering, multi-axis servo kinematics, closed-loop PID velocity control, and design custom robotic linkages using 3D parametric CAD modeling.",
    certificateTitle: "Advanced Robotics & Prototyping Engineer",
    isLiked: true,
    likesCount: 264,
    lessons: [
      {
        id: "c4-l1",
        title: "Robotics Kinematics: IMU Feedback, PID Loops, and Dynamic Balance Control",
        durationMinutes: 50,
        videoSnippetTitle: "How Autonomous Robots Maintain Dynamic Equilibrium: Proportional-Integral-Derivative Control",
        summary: "Analyze angular orientation and tilt dynamics to adjust PID motor gains for instantaneous balance recovery.",
        theoryContent: "An autonomous two-wheel self-balancing robot or multi-axis manipulator continuously measures tilt angle and angular velocity using an Inertial Measurement Unit (IMU). A closed-loop PID controller calculates the error between the vertical setpoint and actual angle hundreds of times per second, commanding counter-torque to wheels or actuators to maintain perfect equilibrium.",
        codeSnippet: '// PID Controller Simulation for Two-Wheel Self-Balancing Robot\nclass RobotBalancePID {\n  constructor(kp, ki, kd) {\n    this.kp = kp; this.ki = ki; this.kd = kd;\n    this.integral = 0; this.prevError = 0;\n  }\n  compute(setpointAngle, currentAngle, dt = 0.02) {\n    const error = setpointAngle - currentAngle;\n    this.integral += error * dt;\n    const derivative = (error - this.prevError) / dt;\n    this.prevError = error;\n    return (this.kp * error) + (this.ki * this.integral) + (this.kd * derivative);\n  }\n}\nconst controller = new RobotBalancePID(18.5, 0.4, 2.1);\nconsole.log("Motor Drive Correction PWM:", controller.compute(0.0, 3.4).toFixed(2));',
        codeLanguage: "javascript",
        simulationType: "servo_sweep",
        quiz: {
          question: "What is the primary role of the derivative (D) term in an inverted pendulum self-balancing robot PID controller?",
          options: [
            "It prevents steady-state error accumulation",
            "It dampens oscillations by predicting future error based on rate of tilt change",
            "It inverts the direction of motor rotation at all times",
            "It doubles the maximum battery voltage"
          ],
          correctIndex: 1,
          explanation: "The derivative component acts as a predictive damper, applying opposing torque proportional to the velocity of tilt to eliminate overshoot and prevent violent oscillations."
        }
      }
    ]
  },
  {
    id: "course-5",
    title: "Edge Artificial Intelligence & TinyML with ESP32-CAM (Classes 9\u201310)",
    gradeLevel: "Class 9-10",
    targetAudience: "Secondary students building computer vision neural networks and face detection systems on low-power chips.",
    nepCompetencies: ["Artificial Intelligence Fundamentals", "Data Classification", "Embedded Vision"],
    durationWeeks: 6,
    totalHours: 18,
    enrolledStudents: 1420,
    rating: 4.96,
    thumbnail: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=600&q=80",
    overview: "Demystify artificial intelligence and neural networks. Train lightweight machine learning models to detect handwritten digits, identify gestures, and trigger physical actuators using the ESP32-CAM module.",
    certificateTitle: "Certified TinyML & Edge AI Specialist",
    isLiked: false,
    likesCount: 198,
    lessons: [
      {
        id: "c5-l1",
        title: "Pixel Arrays to Feature Maps: Computer Vision on Microcontrollers",
        durationMinutes: 40,
        videoSnippetTitle: "Convolutional Kernels and Grayscale Image Processing",
        summary: "Understand how a camera captures pixel brightness arrays and extracts edge features using convolution matrices.",
        theoryContent: "Every digital camera image is simply a 2D grid of numbers representing pixel intensity from 0 (pure black) to 255 (pure white). Edge AI systems use small mathematical filters called kernels (e.g. 3x3 Sobel matrices) that multiply across pixel neighborhoods to highlight sharp horizontal and vertical boundaries without needing cloud servers.",
        codeSnippet: '// TinyML Grayscale Image Edge Detection Simulation\nfunction detectEdges(pixel3x3) {\n  const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];\n  let gradient = 0;\n  for (let i = 0; i < 9; i++) {\n    gradient += pixel3x3[i] * sobelX[i];\n  }\n  return Math.abs(gradient) > 80 ? "Edge Boundary Detected" : "Uniform Background";\n}\nconsole.log(detectEdges([255, 255, 0, 255, 255, 0, 255, 255, 0]));',
        codeLanguage: "javascript",
        simulationType: "led_blink",
        quiz: {
          question: "What is the chief advantage of running TinyML computer vision on edge devices rather than sending video streams to cloud servers?",
          options: [
            "Zero Internet latency, complete student data privacy, and minimal power consumption",
            "Edge devices have infinite cloud storage",
            "It makes the camera lens bigger",
            "It prevents the battery from ever discharging"
          ],
          correctIndex: 0,
          explanation: "Running inference locally on-chip eliminates network lag, keeps private imagery inside the classroom, and functions reliably without internet access."
        }
      }
    ]
  },
  {
    id: "course-6",
    title: "Solar Clean Energy & Smart City Grid Engineering (Classes 6\u20138)",
    gradeLevel: "Class 6-8",
    targetAudience: "Middle school students exploring sustainable energy, solar photovoltaics, and smart microgrids.",
    nepCompetencies: ["Environmental Stewardship", "Physics of Renewable Energy", "Engineering Systems"],
    durationWeeks: 4,
    totalHours: 14,
    enrolledStudents: 1680,
    rating: 4.88,
    thumbnail: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=600&q=80",
    overview: "Explore the future of clean energy aligned with India National Solar Mission. Build automated dual-axis solar trackers that maximize sunlight harvest and balance microgrid battery storage.",
    certificateTitle: "Junior Green Energy Innovator",
    isLiked: false,
    likesCount: 167,
    lessons: [
      {
        id: "c6-l1",
        title: "Photovoltaic Physics & Maximum Power Point Tracking (MPPT)",
        durationMinutes: 35,
        videoSnippetTitle: "Harnessing Photons: How Sunlight Becomes Usable Amperes",
        summary: "Learn how semiconductor silicon p-n junctions absorb photon energy and why panel angle affects power harvest.",
        theoryContent: "Solar panels generate peak electrical current when sunlight hits the surface at a perpendicular 90-degree angle of incidence. Throughout the day, as the sun moves across the sky, static panels lose up to 40% of potential energy. Dual-axis servo tracking systems use four photoresistors (LDRs) to detect light differentials and steer the panel directly toward the brightest point.",
        codeSnippet: '// Solar Tracker Servo Steering Logic\nfunction computeSolarAngle(ldrEast, ldrWest) {\n  const delta = ldrEast - ldrWest;\n  if (Math.abs(delta) < 15) return "\u2600\uFE0F Optimal Angle: Facing Sun Directly";\n  return delta > 0 ? "Steering Servo East (+5\xB0)" : "Steering Servo West (-5\xB0)";\n}\nconsole.log(computeSolarAngle(750, 420));\nconsole.log(computeSolarAngle(600, 595));',
        codeLanguage: "javascript",
        simulationType: "servo_sweep",
        quiz: {
          question: "Why does an automated dual-axis solar tracker produce significantly more daily kilowatt-hours than a fixed stationary panel?",
          options: [
            "It generates its own internal sunlight",
            "It maintains an optimal 90-degree angle to the sun throughout the entire day",
            "It reduces the weight of the solar panel",
            "It eliminates the need for electrical wires"
          ],
          correctIndex: 1,
          explanation: "By continuously adjusting azimuth and elevation to face the sun perpendicular to incident rays, trackers harvest maximum solar irradiance all day."
        }
      }
    ]
  }
];
var INITIAL_INVENTORY = ATL_INVENTORY;
var INITIAL_USER_PROGRESS = {
  studentName: "",
  schoolName: "",
  grade: "Innovator",
  tinkeringHours: 0,
  completedLessonIds: [],
  quizScores: {},
  earnedCertificates: [],
  badges: [],
  likedCourseIds: []
};

// src/data/blogAndReviewsData.ts
var initialClientReviews = [];
var initialCaseStudyBlogs = [
  {
    id: "study-1",
    slug: "kvs-stem-retention-study",
    title: "Empirical STEM Study: 310% Retention Surge in KVS Classrooms via Hands-on ATL Kits",
    subtitle: "A 9-month comparative study across 1,400 students evaluating NEP 2020 experiential engineering vs lecture methods.",
    category: "NEP 2020 Research",
    clientOrCompany: "Kendriya Vidyalaya Sangathan & Innovation Research Circle",
    location: "Delhi NCR Region",
    publishedDate: "September 5, 2026",
    readTimeMinutes: 7,
    coverImage: "https://images.unsplash.com/photo-1511629091441-ee46146481b6?auto=format&fit=crop&w=1200&q=80",
    productsUsed: [
      {
        id: "prod-1",
        name: "Smart Touchless Ultrasonic Dustbin STEM Kit",
        sku: "BALKI-EXP-01-DUSTBIN",
        category: "biology-anatomy",
        image: "/products/smart_dustbin_flatlay.jpg",
        price: 1699
      },
      {
        id: "prod-3",
        name: "Pro-Range Obstacle Avoiding Robot using Arduino UNO Kit",
        sku: "BALKI-EXP-03-OBSTACLE",
        category: "robotics-mechanics",
        image: "https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&w=600&q=80",
        price: 1549
      }
    ],
    keyMetrics: [
      { label: "STEM Retention", value: "+310%", detail: "Measured in post-term conceptual recall exams" },
      { label: "Students Evaluated", value: "1,400+", detail: "Across 4 model KVS schools over 9 months" },
      { label: "Science Fair Wins", value: "47 Awards", detail: "District, State, and National level prizes" },
      { label: "Teacher Syllabus Pace", value: "40% Faster", detail: "Practical labs accelerated theoretical comprehension" }
    ],
    executiveSummary: "In accordance with National Education Policy (NEP 2020) mandates on experiential problem-solving, this longitudinal study tracked 1,400 Class 7-9 students divided into control (lecture/chalkboard) and experimental (Balki ATL Master Kits) cohorts. Students using modular hands-on tinkering kits achieved a 3.1x higher conceptual retention in electronics, circuit physics, and computational thinking.",
    challenge: "Prior to the intervention, students struggled with abstract electrical physics principles (Ohm\u2019s law, pulse-width modulation, sensor interrupts) when taught solely through 2D textbook diagrams. High school science teachers reported high student test anxiety and low participation in regional science congresses.",
    solution: "Each school lab was upgraded with Balki Master Tinkering Lab Packages P1-P4. Teachers received 30 hours of structured hands-on professional development. Students completed 24 structured mini-challenges, progressively transitioning from drag-and-drop visual logic to real-world embedded sensor circuits.",
    outcomes: [
      "Average physics and computational thinking scores rose from 54% to 88% in the experimental group.",
      "47 student teams qualified for CBSE National Science Exhibitions and Atal Marathon competitions.",
      "Teacher lab setup preparation time dropped from 45 minutes to 5 minutes due to modular color-coded storage."
    ],
    fullArticle: `## Research Background & Objectives
The National Education Policy (NEP 2020) emphasizes shifting education from rote memorization toward inquiry-driven, discovery-oriented, and experiential learning. While Atal Tinkering Labs (ATLs) have been sanctioned across tens of thousands of schools, their educational efficacy relies heavily on hardware accessibility, reliability, and pedagogical structuring.

## Methodology & Cohort Structure
Over three academic terms (August 2025 \u2013 May 2026), 1,400 students across Classes 7, 8, and 9 were tracked:
- **Group A (Control - 700 students):** Received standard classroom curriculum lectures and theoretical homework.
- **Group B (Experimental - 700 students):** Integrated weekly 90-minute hands-on tinkering lab sessions using Balki ATL Master Kits.

Both cohorts underwent identical pre-assessment and post-assessment tests on circuit principles, sensor mechanics, algorithmic troubleshooting, and creative problem-solving.

## Key Empirical Findings
1. **Long-Term Concept Retention:** In delayed 6-month surprise recall assessments, Group B demonstrated an 86.4% recall rate compared to Group A's 27.8%\u2014representing an overall 310% surge in retained physics intuition.
2. **Troubleshooting Resilience:** When presented with intentionally miswired breadboard circuits, 91% of Group B students systematically debugged the fault with multimeters within 4 minutes, whereas only 12% of Group A could diagnose the issue.

## Hardware Impact: Why Component Architecture Matters
Standard loose electronics frequently suffer from broken jumper cables, burnt ICs, and missing screws, which demoralize students. The Balki Master Lab Kit solved this through:
- **Reinforced Microcontroller Headers:** Custom PCB shields that prevent backwards IC insertion.
- **Color-Coded Component Trays:** Keeping passive components sorted by grade-level difficulty.
- **Comprehensive Teacher Lesson Guides:** Providing 5-minute pre-lab quick-starts and troubleshooting flowcharts.`,
    quote: {
      text: "Balki hardware converted abstract textbook formulas into tangible, blinking, moving creations that our students simply refuse to put down even when the final bell rings.",
      author: "Dr. Sunita Rao",
      role: "Principal Investigator & ATL Lead, Kendriya Vidyalaya"
    }
  },
  {
    id: "study-2",
    slug: "aerotech-robotics-industrial-automation",
    title: "Smart Factory Automation: How AeroTech Deployed Balki 6-DOF Arms & AI Vision Kits",
    subtitle: "Reducing automated component sorting prototyping costs by 82% using modular edge AI and articulated robotic arms.",
    category: "Industrial Prototyping",
    clientOrCompany: "AeroTech Industrial Automations Ltd.",
    location: "Pune Industrial Belt, Maharashtra",
    publishedDate: "August 28, 2026",
    readTimeMinutes: 6,
    coverImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
    productsUsed: [
      {
        id: "prod-8",
        name: "4-DOF Articulated Robotic Arm Web Control Kit",
        sku: "BALKI-EXP-08-ROBARM",
        category: "robotics-mechanics",
        image: "/products/robotic_arm_mobile_control.jpg",
        price: 2399
      },
      {
        id: "prod-9",
        name: "Balki Environmental Smart Air Quality & Gas Monitoring System",
        sku: "BALKI-EXP-09-ENVIROAIR",
        category: "sensors",
        image: "/products/environmental_station_lcd.jpg",
        price: 1799
      }
    ],
    keyMetrics: [
      { label: "Prototyping Cost", value: "-82%", detail: "Compared to imported industrial trial arms" },
      { label: "Inspection Cycle", value: "0.85 sec", detail: "Per unit vision classification and pick" },
      { label: "Defect Detection", value: "99.2%", detail: "Edge TinyML convolutional model accuracy" },
      { label: "Deployment Time", value: "14 Days", detail: "From lab validation to pilot factory conveyor" }
    ],
    executiveSummary: "AeroTech Automations required a low-cost, scalable testbed for pick-and-place quality control on high-speed electronics assembly conveyors. By adopting Balki 6-DOF articulated metallic robotic arms paired with ESP32-CAM TinyML neural vision units, the engineering team shaved 4 months off R&D cycles and cut hardware prototyping expenditure by 82%.",
    challenge: "Testing computer vision sorting algorithms on full-scale 200kg industrial robotic cells risked expensive conveyor downtime and required specialized safety cages. The firm needed agile, benchtop-safe robotic arms that could run Python inverse kinematics and communicate over standard serial protocols.",
    solution: "AeroTech engineers mounted Balki 6-DOF CNC aluminum arms alongside Balki ESP32-CAM edge vision modules. Using custom Python scripts and OpenCV / TensorFlow Lite models, the arm accurately identified defective solder joints and segregated boards into pass/fail bins.",
    outcomes: [
      "Engineers trained and validated 12 machine learning sorting models safely at desk benches.",
      "The pilot system achieved 0.85-second classification and placement cycles with \xB10.3mm repeatability.",
      "AeroTech expanded the setup into a permanent corporate training workbench for 40 onboarding automation engineers."
    ],
    fullArticle: `## Industrial Context
Factory automation lines cannot afford trial-and-error experiments directly on production machinery. For rapid prototyping of automated optical inspection (AOI), agile hardware that matches industrial degrees-of-freedom without industrial capital costs is indispensable.

## Implementation Architecture
1. **Edge Inference Camera:** The Balki AI Vision ESP32-CAM captured high-contrast top-down snapshots of PCB assemblies moving along an indexing conveyor belt.
2. **Lightweight Convolutional Neural Net:** Quantized MobileNet weights evaluated missing SMD components and solder bridging in under 120 milliseconds.
3. **Kinematic Actuation:** The Balki 6-DOF metallic arm, powered by 13kg/cm high-torque servos, interpolated trajectory coordinates to pick defective units and place them into reject bins.

## Return on Investment
Traditional industrial robot cells require \u20B94,00,000 to \u20B910,00,000 for preliminary evaluation. By staging prototypes on Balki modular hardware, AeroTech spent under \u20B925,000 on initial testbenches, accelerating client delivery by 6 weeks.`,
    quote: {
      text: "Balki 6-DOF arm combined with their edge camera provided industrial-grade torque and kinematic fidelity at a price point that made desk-side prototyping a joy.",
      author: "Rajiv Mehra",
      role: "Head of Automation Engineering, AeroTech Systems"
    }
  },
  {
    id: "study-3",
    slug: "hyderabad-clean-energy-solar-experiment",
    title: "Clean Energy Pilot: Dual-Axis Solar Tracking vs Fixed Panels in School Microgrids",
    subtitle: "High school students quantify a 38.4% daily kilowatt-hour increase using automated solar tracker hardware.",
    category: "Clean Tech Pilot",
    clientOrCompany: "National Clean Tech Foundation & Hyderabad Public School",
    location: "Hyderabad, Telangana",
    publishedDate: "August 14, 2026",
    readTimeMinutes: 5,
    coverImage: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80",
    productsUsed: [
      {
        id: "prod-11",
        name: "SRROBOTICS Single Axis Solar Tracking System Hand Made 100% Working Project",
        sku: "BALKI-EXP-11-SOLARTRK",
        category: "physics-lab",
        image: "/products/solar_tracker_overhead.jpg",
        price: 1599
      },
      {
        id: "prod-12",
        name: "smart irrigation soil moisture sensor arduino water pump kit",
        sku: "BALKI-EXP-12-SMARTIRR",
        category: "biology-anatomy",
        image: "/products/smart_irrigation_flatlay.webp",
        price: 999
      }
    ],
    keyMetrics: [
      { label: "Energy Generation", value: "+38.4%", detail: "Higher watt-hours logged across peak daylight hours" },
      { label: "Student Data Points", value: "45,000+", detail: "Logged to cloud IoT dashboards over 60 days" },
      { label: "Carbon Offset", value: "1.2 Tons", detail: "Direct microgrid savings feeding school STEM lab" },
      { label: "Research Paper", value: "1st Prize", detail: "Awarded at Telangana State Science Congress 2026" }
    ],
    executiveSummary: "Aligned with India\u2019s National Green Hydrogen & Solar Mission, this school research initiative tasked Class 8-10 students with measuring real-time photovoltaic output under varying celestial angles. Using the Balki Solar STEM Station with dual-axis LDR servo tracking, students demonstrated that continuous perpendicular tracking harvested 38.4% more energy than static panels.",
    challenge: "Students frequently learn renewable energy solely through theoretical textbook definitions without understanding why panel tilt angles, cloud dispersion, and ambient temperature affect real-world solar grid efficiency.",
    solution: "The science department deployed 10 Balki Solar STEM stations across the campus rooftop. Students calibrated quad-LDR differential circuits, programmed microcontrollers to adjust elevation and azimuth, and streamed voltage and current telemetry to a shared live dashboard.",
    outcomes: [
      "Students verified real-time MPPT (Maximum Power Point Tracking) efficiency curves.",
      "The experiment culminated in a full-scale 2kW solar rooftop upgrade design for the school\u2019s ATL laboratory.",
      "The project earned First Place in the Clean Energy & SDG-7 division at the State Children Science Congress."
    ],
    fullArticle: `## The Educational Challenge
In India, while solar installations are expanding exponentially, practical semiconductor and photovoltaic physics education has lagged behind. Students understand that panels generate DC electricity, but rarely understand the cosine loss effect when sunlight hits at oblique angles.

## The Experimental Setup
Teams of students paired stationary 5V 500mA monocrystalline panels against motorized Balki dual-axis tracker stations. Both systems fed identical 10-ohm load resistors:
- Ambient light values were measured by 4 balanced LDR photoresistors.
- Two SG90 metal-gear servos steered the panel in 5-degree increments toward peak irradiance.
- Real-time current and voltage telemetry were logged via ESP32 Wi-Fi boards to a cloud database every 30 seconds.

## Measurable Results
On clear days between 8:00 AM and 5:00 PM, fixed south-facing panels generated an average of 18.2 Watt-hours. The automated tracking stations yielded 25.2 Watt-hours\u2014a net gain of 38.4%. The students documented this in a peer-reviewed school whitepaper.`,
    quote: {
      text: "Having a physical experiment station that students could assemble, code, and measure gave our young girls the confidence that they too can become clean tech power engineers.",
      author: "K. Padmavathi",
      role: "Physics Lecturer & Eco Club Mentor"
    }
  },
  {
    id: "study-4",
    slug: "techcorp-rural-csr-robotics-pods",
    title: "Corporate CSR Impact: Equipping 50 Rural Government Schools with STEM Pods",
    subtitle: "How TechGlobal CSR Foundation deployed Balki Grade 6-8 kits to empower 4,200 first-generation rural innovators.",
    category: "Corporate CSR",
    clientOrCompany: "TechGlobal CSR Foundation & Dept. of School Education",
    location: "Mahbubnagar & Medak Districts, Telangana",
    publishedDate: "July 22, 2026",
    readTimeMinutes: 6,
    coverImage: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80",
    productsUsed: [
      {
        id: "prod-2",
        name: "Pro-Range Gesture Controlled Robot Using Arduino Nano",
        sku: "BALKI-EXP-02-GESTURE",
        category: "robotics-mechanics",
        image: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=600&q=80",
        price: 2199
      },
      {
        id: "prod-4",
        name: "Pro-Range Line Follower Robot using Arduino UNO",
        sku: "BALKI-EXP-04-LINEFOL",
        category: "robotics-mechanics",
        image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=600&q=80",
        price: 1449
      }
    ],
    keyMetrics: [
      { label: "Schools Reached", value: "50 Schools", detail: "Remote rural and tribal secondary schools" },
      { label: "Students Impacted", value: "4,200+", detail: "62% first-generation rural learners" },
      { label: "Teacher Champions", value: "110 Mentors", detail: "Certified via Balki Train-the-Trainer program" },
      { label: "Attendance Boost", value: "+24%", detail: "Surge in school attendance on weekly Tinkering days" }
    ],
    executiveSummary: "To bridge the digital divide between metropolitan elite schools and rural government high schools, TechGlobal CSR partnered with Balki Technologies to sponsor 50 turnkey STEM tinkering pods. Each pod contained 8 Grade 6-8 robotics kits, bilingual visual guides, and battery backup stations, impacting over 4,200 students.",
    challenge: "Rural schools frequently encounter erratic grid power, a lack of dedicated computer labs, and teachers who have had minimal exposure to microcontrollers or modern electronics.",
    solution: "Balki Technologies provided battery-powered STEM kits that operate independently of mains electricity. We conducted an intensive 3-day residential master training camp for 110 government science teachers, providing bilingual Telugu-English lesson manuals.",
    outcomes: [
      'Weekly student attendance on Friday "Tinkering Lab Days" surged by 24%.',
      "18 rural student prototypes addressed local agricultural challenges (crop-raiding monkey alarms, borewell water monitors).",
      'The CSR project was recognized as the "Best Educational CSR Partnership" at the Hyderabad CSR Leadership Forum.'
    ],
    fullArticle: `## Bridging the Educational Chasm
Every child, regardless of postal code, deserves to explore robotics, coding, and scientific innovation. In rural government schools, students possess sharp observational intuition regarding water conservation, agriculture, and animal husbandry, yet often lack physical tools to build solutions.

## The CSR Architecture
1. **Low-Power Hardware:** Balki kits were selected because they run reliably on rechargeable 9V Li-ion battery packs, requiring zero mains AC wiring.
2. **Vernacular Learning Materials:** Schematics and video lessons were provided in Telugu alongside English, eliminating language anxiety.
3. **Continuous Field Support:** Balki mobile technical vans visited each cluster once a month to inspect hardware and host inter-school hackathons.

## Inspiring Innovation
A team of three 8th-grade girls from Medak designed an ultrasonic borewell child safety alarm using the Balki Uno kit. Their working prototype received praise from district administrators and was presented to the State Education Minister.`,
    quote: {
      text: "Seeing a 13-year-old daughter of a smallholder farmer confidently code a soil sensor to save water is proof that genius is distributed equally\u2014it is access that was missing.",
      author: "Meenakshi Sundaram",
      role: "CSR Director, TechGlobal Foundation"
    }
  },
  {
    id: "study-5",
    slug: "rapid-prototyping-university-makerspace",
    title: "From CAD to Functional Board: Slashing University Mechanical R&D Cycles by 65%",
    subtitle: "Integrating benchtop CNC PCB isolation milling and eco-PLA 3D printing into collegiate innovation hubs.",
    category: "School Case Study",
    clientOrCompany: "Osmania University MakerSpace & Tech Incubation Cell",
    location: "Hyderabad, Telangana",
    publishedDate: "June 18, 2026",
    readTimeMinutes: 5,
    coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    productsUsed: [
      {
        id: "rent-5",
        name: "High-Precision CNC PCB Milling & Engraving Machine",
        sku: "BALKI-CNC-3018",
        category: "atl-packages",
        image: "https://images.unsplash.com/photo-1581092335878-2d9ff86ca2bf?auto=format&fit=crop&w=600&q=80",
        price: 18500
      },
      {
        id: "prod-7",
        name: "Balki Autonomous 4WD AI Smart Rover Kit",
        sku: "BALKI-EXP-07-ROVER",
        category: "robotics-mechanics",
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80",
        price: 4999
      }
    ],
    keyMetrics: [
      { label: "Turnaround Time", value: "-65%", detail: "From 10-day PCB fab waiting to 45-minute on-campus milling" },
      { label: "Active Student Startups", value: "28 Incubated", detail: "Deep tech, medical devices & AgTech ventures" },
      { label: "Boards Fabricated", value: "620+ Units", detail: "Double-sided FR4 isolation-routed circuit boards" },
      { label: "Chemical Waste", value: "Zero Effluent", detail: "Dry mechanical milling eliminates acid etchant baths" }
    ],
    executiveSummary: "University engineering incubation centers typically rely on external commercial PCB fabrication houses with 7 to 14-day turnaround times. By renting and purchasing Balki High-Precision CNC PCB milling stations and rapid 3D printing filaments, Osmania University slashed student iteration cycles from two weeks to under an hour.",
    challenge: "Student hardware startup founders were stalled waiting for external circuit board deliveries for every minor schematic modification. Chemical wet ferric-chloride etching posed severe laboratory chemical disposal and ventilation hazards.",
    solution: "The university incubation cell established an in-house rapid prototyping suite with Balki CNC 3018-Pro PCB isolation milling machines and high-accuracy PLA filament printing workstations.",
    outcomes: [
      "Students mill functional double-sided circuit prototypes in 45 minutes directly from Gerber CAM files.",
      "Completely eliminated chemical acid etching waste from student laboratories.",
      "Facilitated the filing of 14 provisional hardware utility patents within 8 months."
    ],
    fullArticle: `## The Prototyping Bottleneck in Academia
In modern electrical and mechatronics engineering, the gap between computer-aided design (CAD) simulations and physical prototypes is where most student innovations stall. When an error is discovered on an externally manufactured board, two weeks of momentum are lost.

## The Dry Mechanical Solution
Balki High-Precision CNC PCB Milling machines perform isolation routing: a high-speed 10,000 RPM V-bit physically carves microscopic isolation channels through copper clad without chemicals.

## Impact on Student Startups
Over 28 deep-tech student startups incubated at the university utilized the lab. One team building a non-invasive diabetes glucometer iterated through seven sensor analog-front-end revisions in just five days\u2014a process that previously would have taken four months.`,
    quote: {
      text: "Having on-demand CNC board isolation and 3D printing transformed our maker hub from a theoretical computer lab into a world-class hardware incubator.",
      author: "Prof. K. V. S. Ramakrishna",
      role: "Director, University Innovation & Incubation Hub"
    }
  }
];

// src/data/supportData.ts
var INITIAL_SUPPORT_TICKETS = [
  {
    id: "tkt-1",
    ticketNumber: "TKT-2026-4421",
    name: "Dr. Ramesh Sharma",
    role: "Principal / Management",
    institutionName: "Kendriya Vidyalaya No. 1, Delhi Cantt",
    email: "principal.kvdc@kvsedu.gov.in",
    phone: "+91 98110 44210",
    category: "Hardware Defect & 12-Month Replacement",
    orderIdOrSku: "ORD-2026-8831 / BALKI-ATL-5000",
    priority: "Urgent (Classroom Paused)",
    subject: "Ultrasonic Sensor & Motor Shield replacement under warranty",
    description: "During the grade 8 tinkering period, 2 ultrasonic sensors (HC-SR04) and 1 motor driver shield stopped responding to trigger pulses. We request doorstep component replacement under the 12-month Balki school warranty.",
    attachmentName: "lab_sensor_diagnostic_log.jpg",
    status: "Resolved",
    assignedEngineer: "Vikram Joshi (Senior Field Engineer - Delhi NCR)",
    slaHours: 24,
    createdAt: "2026-09-12T10:30:00Z",
    updatedAt: "2026-09-13T14:15:00Z",
    resolutionNotes: "Field Engineer visited campus on 13th Sept. Replaced 2x HC-SR04 sensors and 1x L298N shield free of charge. Conducted 30-min student circuit demo."
  },
  {
    id: "tkt-2",
    ticketNumber: "TKT-2026-5190",
    name: "Meenakshi Iyer",
    role: "ATL Lab In-Charge",
    institutionName: "Delhi Public School, Sector 45 Gurgaon",
    email: "meenakshi.atl@dpsgurgaon.edu.in",
    phone: "+91 98712 55432",
    category: "ATL Lab Installation & Setup Support",
    orderIdOrSku: "ORD-2026-9102 / BALKI-3DP-2026",
    priority: "High (Upcoming Event)",
    subject: "3D Printer Z-axis auto-bed leveling recalibration for Annual Expo",
    description: "Our annual school science exhibition is on 28th Sept. The 3D printer nozzle is scraping the PEI textured sheet on the left corner. We require on-site calibration or a remote video call with the technician.",
    attachmentName: "bed_leveling_first_layer.png",
    status: "Dispatched (Replacement)",
    assignedEngineer: "Amanpreet Singh (Rapid Prototyping Specialist)",
    slaHours: 48,
    createdAt: "2026-09-14T08:15:00Z",
    updatedAt: "2026-09-15T11:45:00Z",
    resolutionNotes: "Technician dispatched with replacement hardened nozzles and auto-leveling probe via Bluedart Air (AWB #8839201948). Scheduled campus visit tomorrow at 11 AM."
  },
  {
    id: "tkt-3",
    ticketNumber: "TKT-2026-6012",
    name: "Prof. Sandeep Kulkarni",
    role: "STEM Teacher",
    institutionName: "Bhartiya Vidya Bhavan Public School, Hyderabad",
    email: "sandeep.stem@bvbhyd.ac.in",
    phone: "+91 94401 22987",
    category: "Technical Wiring & Code Troubleshooting",
    orderIdOrSku: "BALKI-ARM-6DOF",
    priority: "Normal",
    subject: "Python Kinematics API inverse angles telemetry drift",
    description: "Students are programming the 6-DOF robotic arm for chess piece movement. When calculating inverse kinematics angles, servo 3 experiences a 4-degree offset. Need sample Python script and calibration coefficients.",
    attachmentName: "kinematics_angle_error.txt",
    status: "Engineer Assigned",
    assignedEngineer: "Kavita Reddy (Robotics Firmware Architect)",
    slaHours: 12,
    createdAt: "2026-09-15T16:00:00Z",
    updatedAt: "2026-09-16T09:20:00Z",
    resolutionNotes: "Firmware team verified calibration matrix. Custom Python script with calibrated servo offset patch sent to school email. Remote screen-sharing scheduled for 3:00 PM."
  }
];

// src/data/atlQuotationPackagesData.ts
var ALL_ATL_LINE_ITEMS = [
  // SECTION A: Electronics & IoT (Items 1 - 111)
  { sNo: 1, packageCode: "A", atlItemName: "Microcontroller Development Board", offeredMakeModel: "Arduino UNO R4 Minima Board", type: "Consumable", qty: 20, unitRate: 937.5, amount: 18750, category: "microcontrollers" },
  { sNo: 2, packageCode: "A", atlItemName: "Compact Small sized Microcontroller Development Board", offeredMakeModel: "ATmega328P 5V Nano V3.0 Development Board 16MHz CH340 Type-C", type: "Consumable", qty: 10, unitRate: 437.5, amount: 4375, category: "microcontrollers" },
  { sNo: 3, packageCode: "A", atlItemName: "Wireless IoT Microcontroller Development Board", offeredMakeModel: "ESP32-WROOM-32 38Pin Development Board WiFi+Bluetooth Ultra-Low Power Consumption Dual Core", type: "Consumable", qty: 15, unitRate: 513.75, amount: 7706.25, category: "microcontrollers" },
  { sNo: 4, packageCode: "A", atlItemName: "Breadboards & mini breadboard", offeredMakeModel: "400 Tie Points Contacts Mini Circuit Experiment Solderless Breadboard", type: "Consumable", qty: 30, unitRate: 43.75, amount: 1312.5, category: "physics-lab" },
  { sNo: 5, packageCode: "A", atlItemName: "Breadboards & mini breadboard", offeredMakeModel: "MB102 830 Points Solderless Prototype PCB Breadboard High Quality", type: "Consumable", qty: 20, unitRate: 76.25, amount: 1525, category: "physics-lab" },
  { sNo: 6, packageCode: "A", atlItemName: "General Purpose solderable Board", offeredMakeModel: "FR2 A Grade Material-(140 x 90 mm) PCB", type: "Consumable", qty: 30, unitRate: 40, amount: 1200, category: "physics-lab" },
  { sNo: 7, packageCode: "A", atlItemName: "General Purpose solderable Board", offeredMakeModel: "6 x 8 cm Universal PCB Prototype Board Single-Sided 2.54mm Hole Pitch", type: "Consumable", qty: 30, unitRate: 36.25, amount: 1087.5, category: "physics-lab" },
  { sNo: 8, packageCode: "A", atlItemName: "Berg Strips", offeredMakeModel: "2.54mm 1x40 Pin Female Single Row Header Strip", type: "Consumable", qty: 30, unitRate: 13.75, amount: 412.5, category: "physics-lab" },
  { sNo: 9, packageCode: "A", atlItemName: "Berg Strips", offeredMakeModel: "2.54mm 1x40 Pin Male Single Row Straight Short Header Strip", type: "Consumable", qty: 30, unitRate: 11.25, amount: 337.5, category: "physics-lab" },
  { sNo: 10, packageCode: "A", atlItemName: "16x2 LCD display", offeredMakeModel: "LCD1602 Parallel LCD Display with IIC/I2C interface", type: "Consumable", qty: 20, unitRate: 221.25, amount: 4425, category: "sensors" },
  { sNo: 11, packageCode: "A", atlItemName: "USB Cables", offeredMakeModel: "Arduino USB A-B 50cm Data Cable High-Quality for UNO/MEGA", type: "Consumable", qty: 10, unitRate: 42.5, amount: 425, category: "physics-lab" },
  { sNo: 12, packageCode: "A", atlItemName: "USB Cables", offeredMakeModel: "Arduino Nano USB A-Mini B 30cm Cable Reliable Data Transfer", type: "Consumable", qty: 10, unitRate: 25.45, amount: 254.5, category: "physics-lab" },
  { sNo: 13, packageCode: "A", atlItemName: "USB Cables", offeredMakeModel: "USB Type-A to Type-C Data Cable, 30cm Blue Compatible with Arduino UNO R3 Boards", type: "Consumable", qty: 10, unitRate: 72.5, amount: 725, category: "physics-lab" },
  { sNo: 14, packageCode: "A", atlItemName: "Battery", offeredMakeModel: "3.7V 2500mAh 18650 Li-Ion Rechargeable Battery + 3-Slot Case + 4-Slot AC-DC Smart Charger with LED Indicator", type: "Consumable", qty: 10, unitRate: 738.4, amount: 7384, category: "physics-lab" },
  { sNo: 15, packageCode: "A", atlItemName: "Battery", offeredMakeModel: "Envie 9V Infinite 900mAh USB Type-C Rechargeable Battery Fast Charging Low Self Discharge", type: "Consumable", qty: 10, unitRate: 448.75, amount: 4487.5, category: "physics-lab" },
  { sNo: 16, packageCode: "A", atlItemName: "Resistor Kit", offeredMakeModel: "Assorted resistor kit (600 pcs)", type: "Consumable", qty: 1, unitRate: 1062.5, amount: 1062.5, category: "physics-lab" },
  { sNo: 17, packageCode: "A", atlItemName: "Capacitor Kit", offeredMakeModel: "Assorted capacitor kit", type: "Consumable", qty: 1, unitRate: 699.5, amount: 699.5, category: "physics-lab" },
  { sNo: 18, packageCode: "A", atlItemName: "Linear Voltage Regulator", offeredMakeModel: "L78M05CV (L7805CV) TO-220 Linear Voltage Regulator", type: "Consumable", qty: 10, unitRate: 14.25, amount: 142.5, category: "physics-lab" },
  { sNo: 19, packageCode: "A", atlItemName: "Linear Voltage Regulator", offeredMakeModel: "LM7812 12V Linear Positive Voltage Regulator - TO-220 Package", type: "Consumable", qty: 10, unitRate: 20, amount: 200, category: "physics-lab" },
  { sNo: 20, packageCode: "A", atlItemName: "Linear Voltage Regulator", offeredMakeModel: "LM7809 - 9V Positive Voltage Regulator (To-220)", type: "Consumable", qty: 5, unitRate: 12.5, amount: 62.5, category: "physics-lab" },
  { sNo: 21, packageCode: "A", atlItemName: "Linear Voltage Regulator", offeredMakeModel: "AMS1117-3.3V, 1A, SOT-223 Voltage Regulator IC", type: "Consumable", qty: 10, unitRate: 11.25, amount: 112.5, category: "physics-lab" },
  { sNo: 22, packageCode: "A", atlItemName: "Linear Voltage Regulator", offeredMakeModel: "AMS1117-5.0V, 1A, SOT-223 Voltage Regulator IC", type: "Consumable", qty: 10, unitRate: 11.25, amount: 112.5, category: "physics-lab" },
  { sNo: 23, packageCode: "A", atlItemName: "Piezoelectric Plate", offeredMakeModel: "Piezo Buzzer 40mm with Cable", type: "Consumable", qty: 10, unitRate: 44.38, amount: 443.8, category: "sensors" },
  { sNo: 24, packageCode: "A", atlItemName: "8*8 LED Matrix Module", offeredMakeModel: "MAX7219 Dot Led Matrix Module MCU Control LED Display Module", type: "Consumable", qty: 10, unitRate: 146.25, amount: 1462.5, category: "sensors" },
  { sNo: 25, packageCode: "A", atlItemName: "Bluetooth module", offeredMakeModel: "HC-05 6pin Bluetooth Module with Button", type: "Consumable", qty: 15, unitRate: 243.75, amount: 3656.25, category: "sensors" },
  { sNo: 26, packageCode: "A", atlItemName: "7 Segment Led Display Module", offeredMakeModel: "TM1637 4 Bits Digital Tube LED Display Module With Clock Display for Arduino", type: "Consumable", qty: 10, unitRate: 55, amount: 550, category: "sensors" },
  { sNo: 27, packageCode: "A", atlItemName: "GSM Module", offeredMakeModel: "SIM800L V2 5V Wireless GSM GPRS MODULE Quad-Band with Antenna", type: "Consumable", qty: 2, unitRate: 550, amount: 1100, category: "sensors" },
  { sNo: 28, packageCode: "A", atlItemName: "GPS Module", offeredMakeModel: "GY-NEO6MV2 GPS Module With Flight Control with Antenna", type: "Consumable", qty: 2, unitRate: 623.75, amount: 1247.5, category: "sensors" },
  { sNo: 29, packageCode: "A", atlItemName: "Laser Diode Emitter Module", offeredMakeModel: "650nm 6mm 5V DC 5mW Mini Laser Dot Diode Module", type: "Consumable", qty: 10, unitRate: 18.75, amount: 187.5, category: "sensors" },
  { sNo: 30, packageCode: "A", atlItemName: "LDR Module", offeredMakeModel: "LM393 Light-Dependent Resistor Sensor Module", type: "Consumable", qty: 30, unitRate: 36.25, amount: 1087.5, category: "sensors" },
  { sNo: 31, packageCode: "A", atlItemName: "Keypad", offeredMakeModel: "4\xD74 Matrix Keypad Membrane Switch for Arduino, ARM and other MCU", type: "Consumable", qty: 6, unitRate: 48.75, amount: 292.5, category: "sensors" },
  { sNo: 32, packageCode: "A", atlItemName: "Active Buzzer", offeredMakeModel: "5V Active Electromagnetic Buzzer", type: "Consumable", qty: 20, unitRate: 20, amount: 400, category: "sensors" },
  { sNo: 33, packageCode: "A", atlItemName: "Active Buzzer", offeredMakeModel: "Large buzzer", type: "Consumable", qty: 20, unitRate: 31.25, amount: 625, category: "sensors" },
  { sNo: 34, packageCode: "A", atlItemName: "Sound Playback Module", offeredMakeModel: "ISD1820 Voice Recording Module with Speaker Support", type: "Consumable", qty: 10, unitRate: 177.5, amount: 1775, category: "sensors" },
  { sNo: 35, packageCode: "A", atlItemName: "Node MCU", offeredMakeModel: "ESP8266 NodeMCU CP2102 Board", type: "Consumable", qty: 6, unitRate: 296.25, amount: 1777.5, category: "microcontrollers" },
  { sNo: 36, packageCode: "A", atlItemName: "ESP32 Module", offeredMakeModel: "ESP-WROOM-32 WIFI Bluetooth Networking Smart Component Development Board", type: "Consumable", qty: 6, unitRate: 493.75, amount: 2962.5, category: "microcontrollers" },
  { sNo: 37, packageCode: "A", atlItemName: "Alligator Connectors", offeredMakeModel: "Alligator Clips Electrical DIY Test Leads 10pcs of Double-ended Crocodile Clips Roach Clip", type: "Consumable", qty: 20, unitRate: 82.5, amount: 1650, category: "physics-lab" },
  { sNo: 38, packageCode: "A", atlItemName: "Battery clips with DC Jack", offeredMakeModel: "9v Battery Connector + DC Jack(Battery Connector Cap) 10pcs Pack", type: "Consumable", qty: 40, unitRate: 15.38, amount: 615.2, category: "physics-lab" },
  { sNo: 39, packageCode: "A", atlItemName: "Hook-up Wires", offeredMakeModel: "Hook-up wire 400m red+black", type: "Consumable", qty: 1, unitRate: 1500, amount: 1500, category: "physics-lab" },
  { sNo: 40, packageCode: "A", atlItemName: "Jumper Cable (Ribbon cable)", offeredMakeModel: "Male-Male jumper 1000pcs", type: "Consumable", qty: 1, unitRate: 1562.5, amount: 1562.5, category: "physics-lab" },
  { sNo: 41, packageCode: "A", atlItemName: "Jumper Cable (Ribbon cable)", offeredMakeModel: "Male-Female jumper 600pcs", type: "Consumable", qty: 1, unitRate: 1012.5, amount: 1012.5, category: "physics-lab" },
  { sNo: 42, packageCode: "A", atlItemName: "Jumper Cable (Ribbon cable)", offeredMakeModel: "Female-Female jumper 400pcs", type: "Consumable", qty: 1, unitRate: 875, amount: 875, category: "physics-lab" },
  { sNo: 43, packageCode: "A", atlItemName: "RGB LEDs", offeredMakeModel: "XL-B504RGBW-XINGLIGHT-Plugin,D=5mm RGB LEDs ROHS", type: "Consumable", qty: 300, unitRate: 8.75, amount: 2625, category: "physics-lab" },
  { sNo: 44, packageCode: "A", atlItemName: "LEDs (Red)", offeredMakeModel: "5mm Red DIP LED", type: "Consumable", qty: 1e3, unitRate: 1.93, amount: 1930, category: "physics-lab" },
  { sNo: 45, packageCode: "A", atlItemName: "LEDs (Green)", offeredMakeModel: "5mm Green DIP LED", type: "Consumable", qty: 1e3, unitRate: 2.39, amount: 2390, category: "physics-lab" },
  { sNo: 46, packageCode: "A", atlItemName: "LEDs (Blue)", offeredMakeModel: "5mm Blue DIP LED", type: "Consumable", qty: 1e3, unitRate: 2.07, amount: 2070, category: "physics-lab" },
  { sNo: 47, packageCode: "A", atlItemName: "LEDs (Yellow)", offeredMakeModel: "5mm DIP LED Yellow", type: "Consumable", qty: 1e3, unitRate: 1.3, amount: 1300, category: "physics-lab" },
  { sNo: 48, packageCode: "A", atlItemName: "LEDs (White)", offeredMakeModel: "5mm DIP LED White", type: "Consumable", qty: 1e3, unitRate: 2.05, amount: 2050, category: "physics-lab" },
  { sNo: 49, packageCode: "A", atlItemName: "Timer IC - LM 555", offeredMakeModel: "NE 555 P PDIP-8 Timer IC", type: "Consumable", qty: 15, unitRate: 12, amount: 180, category: "physics-lab" },
  { sNo: 50, packageCode: "A", atlItemName: "Diodes and Transistors Kit", offeredMakeModel: "Diode/transistor assortment kit", type: "Consumable", qty: 3, unitRate: 240.94, amount: 722.82, category: "physics-lab" },
  { sNo: 51, packageCode: "A", atlItemName: "Button Switch Set", offeredMakeModel: "Assorted switch kit (100 pcs)", type: "Consumable", qty: 3, unitRate: 312.5, amount: 937.5, category: "physics-lab" },
  { sNo: 52, packageCode: "A", atlItemName: "Capacitive Touch Switch Module", offeredMakeModel: "TTP223 Touch Key Module - 2Pcs", type: "Consumable", qty: 10, unitRate: 16.25, amount: 162.5, category: "sensors" },
  { sNo: 53, packageCode: "A", atlItemName: "Triple Axis Magnetometer MPU6050", offeredMakeModel: "MPU-6050 3-Axis Accelerometer and Gyro Sensor", type: "Consumable", qty: 10, unitRate: 188.75, amount: 1887.5, category: "sensors" },
  { sNo: 54, packageCode: "A", atlItemName: "IR Sensors, sensor module", offeredMakeModel: "Infrared Obstacle Avoidance Sensor Module (Active Low)", type: "Consumable", qty: 20, unitRate: 32.5, amount: 650, category: "sensors" },
  { sNo: 55, packageCode: "A", atlItemName: "Humidity & Temperature Sensor DHT22", offeredMakeModel: "DHT22 AM2302 Digital Temperature & Humidity Sensor Module", type: "Consumable", qty: 10, unitRate: 131.25, amount: 1312.5, category: "sensors" },
  { sNo: 56, packageCode: "A", atlItemName: "MQ Series Sensor", offeredMakeModel: "MQ-2 Smoke LPG Butane Hydrogen Gas Sensor Module", type: "Consumable", qty: 3, unitRate: 116.25, amount: 348.75, category: "sensors" },
  { sNo: 57, packageCode: "A", atlItemName: "MQ Series Sensor", offeredMakeModel: "MQ-3 Alcohol Gas Detector Sensor Module", type: "Consumable", qty: 3, unitRate: 136.25, amount: 408.75, category: "sensors" },
  { sNo: 58, packageCode: "A", atlItemName: "MQ Series Sensor", offeredMakeModel: "MQ-4 Methane CNG Gas Detector High Sensitivity Module", type: "Consumable", qty: 3, unitRate: 120, amount: 360, category: "sensors" },
  { sNo: 59, packageCode: "A", atlItemName: "MQ Series Sensor", offeredMakeModel: "MQ-5 Methane LPG Propane Gas Sensor Module", type: "Consumable", qty: 3, unitRate: 125, amount: 375, category: "sensors" },
  { sNo: 60, packageCode: "A", atlItemName: "MQ Series Sensor", offeredMakeModel: "MQ-6 Propane Isobutane LPG Gas Sensor Module", type: "Consumable", qty: 3, unitRate: 136.25, amount: 408.75, category: "sensors" },
  { sNo: 61, packageCode: "A", atlItemName: "MQ Series Sensor", offeredMakeModel: "MQ-7 CO Carbon Monoxide Gas Sensor Module", type: "Consumable", qty: 3, unitRate: 145, amount: 435, category: "sensors" },
  { sNo: 62, packageCode: "A", atlItemName: "MQ Series Sensor", offeredMakeModel: "MQ-8 Hydrogen H2 Gas Sensor Alarm Detection Module", type: "Consumable", qty: 3, unitRate: 128.75, amount: 386.25, category: "sensors" },
  { sNo: 63, packageCode: "A", atlItemName: "MQ Series Sensor", offeredMakeModel: "MQ 135 Air Quality/Gas Detector Sensor Module For Arduino", type: "Consumable", qty: 3, unitRate: 130, amount: 390, category: "sensors" },
  { sNo: 64, packageCode: "A", atlItemName: "IR transmitter/receiver", offeredMakeModel: "TSOP1738 IR Receiver \u2013 Infrared Receiver", type: "Consumable", qty: 10, unitRate: 53.75, amount: 537.5, category: "sensors" },
  { sNo: 65, packageCode: "A", atlItemName: "Ultrasonic Sensor Module HC-SR-04 or compatible", offeredMakeModel: "HC-SR04 Ultrasonic Range Finder Sensor Module for Arduino", type: "Consumable", qty: 40, unitRate: 86.25, amount: 3450, category: "sensors" },
  { sNo: 66, packageCode: "A", atlItemName: "Triple Axis accelerometer ADXL335", offeredMakeModel: "ADXL345 Triple-Axis Accelerometer Sensor Module", type: "Consumable", qty: 10, unitRate: 311.25, amount: 3112.5, category: "sensors" },
  { sNo: 67, packageCode: "A", atlItemName: "PIR Motion Detector Module", offeredMakeModel: "HC-SR501 PIR Motion Detector Sensor Module", type: "Consumable", qty: 20, unitRate: 77.5, amount: 1550, category: "sensors" },
  { sNo: 68, packageCode: "A", atlItemName: "Pulse Rate Heart Sensor", offeredMakeModel: "Pulse Sensor Amped Heart Rate Monitor for Arduino", type: "Consumable", qty: 4, unitRate: 176.25, amount: 705, category: "sensors" },
  { sNo: 69, packageCode: "A", atlItemName: "Big Sound microphone module", offeredMakeModel: "Sound Detection Sensor Module for Arduino Robots", type: "Consumable", qty: 10, unitRate: 60, amount: 600, category: "sensors" },
  { sNo: 70, packageCode: "A", atlItemName: "Soil Moisture Sensor module", offeredMakeModel: "Soil Moisture Sensor Hygrometer Module Compatible with Arduino", type: "Consumable", qty: 6, unitRate: 41.25, amount: 247.5, category: "sensors" },
  { sNo: 71, packageCode: "A", atlItemName: "Rain Drop Sensor", offeredMakeModel: "Raindrop Detection Sensor Module Rain Sensor for Arduino", type: "Consumable", qty: 6, unitRate: 56.25, amount: 337.5, category: "sensors" },
  { sNo: 72, packageCode: "A", atlItemName: "Metal Touch Sensor Module", offeredMakeModel: "Touch Sensor Switch Module", type: "Consumable", qty: 6, unitRate: 48.75, amount: 292.5, category: "sensors" },
  { sNo: 73, packageCode: "A", atlItemName: "Flex Sensor", offeredMakeModel: "Flex Sensor 2.2\u2033 Bend Sensor for Hand Gesture Recognition", type: "Consumable", qty: 6, unitRate: 290, amount: 1740, category: "sensors" },
  { sNo: 74, packageCode: "A", atlItemName: "Temperature Sensor", offeredMakeModel: "LM35DZ/NOPB-Texas Instruments-\xB11.5\u2103 TO-92 Temperature Sensors ROHS", type: "Consumable", qty: 6, unitRate: 97.5, amount: 585, category: "sensors" },
  { sNo: 75, packageCode: "A", atlItemName: "Force Pressure Sensor", offeredMakeModel: "Force sensitive resistor", type: "Consumable", qty: 4, unitRate: 350, amount: 1400, category: "sensors" },
  { sNo: 76, packageCode: "A", atlItemName: "Colour Recognition Sensor", offeredMakeModel: "TCS3200 Color Recognition Sensor Module for Arduino", type: "Consumable", qty: 4, unitRate: 740, amount: 2960, category: "sensors" },
  { sNo: 77, packageCode: "A", atlItemName: "Water Flow Sensor", offeredMakeModel: "YF-S201 Water Flow Sensor 1\u201330 L/min Black", type: "Consumable", qty: 4, unitRate: 252.5, amount: 1010, category: "sensors" },
  { sNo: 78, packageCode: "A", atlItemName: "Sound Sensor", offeredMakeModel: "Sound Detection Sensor Module for Arduino Robots", type: "Consumable", qty: 10, unitRate: 60, amount: 600, category: "sensors" },
  { sNo: 79, packageCode: "A", atlItemName: "Power Bank", offeredMakeModel: "10000mAh power bank", type: "Consumable", qty: 5, unitRate: 812.5, amount: 4062.5, category: "physics-lab" },
  { sNo: 80, packageCode: "A", atlItemName: "RFID Reader & Tags", offeredMakeModel: "RC522 RFID Reader Writer SPI Module with Card & Tag", type: "Consumable", qty: 6, unitRate: 80, amount: 480, category: "sensors" },
  { sNo: 81, packageCode: "A", atlItemName: "RF Modules Tx & Rx 315 MHz ASK", offeredMakeModel: "315MHz RF Transmitter Receiver Module Wireless Link Kit for Arduino", type: "Consumable", qty: 10, unitRate: 98.75, amount: 987.5, category: "sensors" },
  { sNo: 82, packageCode: "A", atlItemName: "Bio-Medical Kit", offeredMakeModel: "Bio-Medical kit (Clinical Physiology Sensor Module)", type: "Non-Consumable", qty: 1, unitRate: 6875, amount: 6875, category: "biology-anatomy" },
  { sNo: 83, packageCode: "A", atlItemName: "Agri-Tech Kit", offeredMakeModel: "OM LABS Agri-Tech Arduino STEM Kit (Soil Moisture, Rain Drop, Humidity, Temp, Light, Flame, Gas)", type: "Non-Consumable", qty: 1, unitRate: 2886.25, amount: 2886.25, category: "biology-anatomy" },
  { sNo: 84, packageCode: "A", atlItemName: "Water/Sanitation Kit", offeredMakeModel: "OM LABS Water/Sanitation Arduino STEM Kit (pH, Turbidity, TDS, Water Temperature, Water Pump, Flow)", type: "Non-Consumable", qty: 1, unitRate: 5586.25, amount: 5586.25, category: "biology-anatomy" },
  { sNo: 85, packageCode: "A", atlItemName: "Solar Energy Experiment Kit", offeredMakeModel: "SOLAR ENERGY KIT (PV Panel, Multimeter, Load Cells, Angle Calibration)", type: "Non-Consumable", qty: 2, unitRate: 1031.25, amount: 2062.5, category: "physics-lab" },
  { sNo: 86, packageCode: "A", atlItemName: "Load Cell Sensor 1Kg (with connecting wires)", offeredMakeModel: "Phaeton Load Cell Sensor 611E 01 200KG Weighing Aluminum Alloy", type: "Consumable", qty: 10, unitRate: 156.25, amount: 1562.5, category: "sensors" },
  { sNo: 87, packageCode: "A", atlItemName: "DC Regulated Power Supply 0-30V, 5 Amp", offeredMakeModel: "Wanptek WPS305H 30V/5A Variable Adjustable Switching Power Source DC Power Supply", type: "Consumable", qty: 1, unitRate: 8936.25, amount: 8936.25, category: "physics-lab" },
  { sNo: 88, packageCode: "A", atlItemName: "DPDT switches", offeredMakeModel: "Slide Switch-DPDT Surface Mount, JS Series, 300 mA", type: "Consumable", qty: 20, unitRate: 11.25, amount: 225, category: "physics-lab" },
  { sNo: 89, packageCode: "A", atlItemName: "ATtiny85 microcontroller board", offeredMakeModel: "ATTINY85 USB Development Board", type: "Consumable", qty: 5, unitRate: 267.5, amount: 1337.5, category: "microcontrollers" },
  { sNo: 90, packageCode: "A", atlItemName: "Hall effect sensor Module", offeredMakeModel: "A3144 Hall Effect Magnetic Sensor Module", type: "Consumable", qty: 5, unitRate: 35, amount: 175, category: "sensors" },
  { sNo: 91, packageCode: "A", atlItemName: "Peltier module - 40x40mm Thermoelectric Cooler 6A", offeredMakeModel: "TEC1-12706 40\xD740mm 6A Thermoelectric Peltier Cooler", type: "Consumable", qty: 5, unitRate: 220, amount: 1100, category: "physics-lab" },
  { sNo: 92, packageCode: "A", atlItemName: "400 mAh 3.7V single cell Rechargeable LiPo Battery", offeredMakeModel: "WLY502040 3.7V 400mAh 1S LiPo Battery \u2013 Micro Rechargeable Battery Pack for Wearables / Robotics / IoT", type: "Consumable", qty: 15, unitRate: 168.75, amount: 2531.25, category: "physics-lab" },
  { sNo: 93, packageCode: "A", atlItemName: "Flame sensor", offeredMakeModel: "Flame Sensor Module", type: "Consumable", qty: 4, unitRate: 45, amount: 180, category: "sensors" },
  { sNo: 94, packageCode: "A", atlItemName: "1.3-inch Yellow-Blue OLED Display Module", offeredMakeModel: "1.3 Inch I2C OLED Display Module 4 Pin WHITE", type: "Consumable", qty: 5, unitRate: 368.75, amount: 1843.75, category: "sensors" },
  { sNo: 95, packageCode: "A", atlItemName: "Coin Cells", offeredMakeModel: "Panasonic CR2032 3V Lithium Coin Battery - pack of 1", type: "Consumable", qty: 20, unitRate: 71.25, amount: 1425, category: "physics-lab" },
  { sNo: 96, packageCode: "A", atlItemName: "9V Alkaline Battery", offeredMakeModel: "9V Original HW High-Quality Battery-5Pcs", type: "Consumable", qty: 20, unitRate: 151.25, amount: 3025, category: "physics-lab" },
  { sNo: 97, packageCode: "A", atlItemName: "DF Player", offeredMakeModel: "DFRobot Fermion DFPlayer Pro MP3 Player with 128MB Storage", type: "Consumable", qty: 5, unitRate: 1211.25, amount: 6056.25, category: "sensors" },
  { sNo: 98, packageCode: "A", atlItemName: "Turbidity Sensor", offeredMakeModel: "Turbidity Sensor with Module", type: "Consumable", qty: 2, unitRate: 611.25, amount: 1222.5, category: "sensors" },
  { sNo: 99, packageCode: "A", atlItemName: "SD Card Reading Writing Module for Arduino", offeredMakeModel: "SD Card Reading Writing Module for Arduino", type: "Non-Consumable", qty: 5, unitRate: 68.75, amount: 343.75, category: "sensors" },
  { sNo: 100, packageCode: "A", atlItemName: "Micro SD Card Reader Module", offeredMakeModel: "Micro SD Card Reader Module", type: "Non-Consumable", qty: 5, unitRate: 43.75, amount: 218.75, category: "sensors" },
  { sNo: 101, packageCode: "A", atlItemName: "DS18B20 Waterproof Temperature Probe (Sensor) \u2013 Black (1m)", offeredMakeModel: "DS18B20 Water Proof Temperature Probe \u2013 Black (1m)", type: "Consumable", qty: 5, unitRate: 63.75, amount: 318.75, category: "sensors" },
  { sNo: 102, packageCode: "A", atlItemName: "HX711 Load Cell Amplifier Module", offeredMakeModel: "HX711 24-Bit Dual Channel Load Cell Amplifier Weight Sensor", type: "Consumable", qty: 5, unitRate: 53.75, amount: 268.75, category: "sensors" },
  { sNo: 103, packageCode: "A", atlItemName: "Real Time Clock DS1307 RTC I2C Module", offeredMakeModel: "Tiny RTC Real Time Clock DS1307 I2C IIC Module for Arduino(Without cell)", type: "Consumable", qty: 10, unitRate: 52.5, amount: 525, category: "sensors" },
  { sNo: 104, packageCode: "A", atlItemName: "DC5V Humidifier USB Spray Module - 108KHz", offeredMakeModel: "DC5V Humidifier USB Spray Module 108KHz", type: "Consumable", qty: 5, unitRate: 198.75, amount: 993.75, category: "sensors" },
  { sNo: 105, packageCode: "A", atlItemName: "LM358 Gain Amplification Module Operational Amplifier", offeredMakeModel: "XD-21 LM358 Gain Amplification Module Operational Amplifier Module", type: "Consumable", qty: 10, unitRate: 52.5, amount: 525, category: "physics-lab" },
  { sNo: 106, packageCode: "A", atlItemName: "XL4015 5A DC-DC Step Down Adjustable Power Supply Buck Module LED with Heatsink", offeredMakeModel: "XL4015 5A Step Down Adjustable Power Supply with LED Voltmeter", type: "Consumable", qty: 5, unitRate: 305, amount: 1525, category: "physics-lab" },
  { sNo: 107, packageCode: "A", atlItemName: "PMS7003 Sensor Module PM2.5 Air, Particle Dust Sensor (with connecting Cable)", offeredMakeModel: "PMS7003 Sensor Module PM2.5 Air, Particle Dust Sensor", type: "Consumable", qty: 2, unitRate: 1768.75, amount: 3537.5, category: "sensors" },
  { sNo: 108, packageCode: "A", atlItemName: "PAM8403 Mini 5V Digital Amplifier Board with Switch Potentiometer", offeredMakeModel: "PAM8403 Mini 5V Digital Amplifier Board With Switch Potentiometer", type: "Consumable", qty: 5, unitRate: 75, amount: 375, category: "physics-lab" },
  { sNo: 109, packageCode: "A", atlItemName: "WS2812B Addressable RGB LED Strip - 5V - 60 LEDs / 5 meter - Inbuilt chip", offeredMakeModel: "1M WS2812B 5V Addressable RGB Non-Waterproof LED Strip Light 60LED's/Mtr", type: "Consumable", qty: 1, unitRate: 573.75, amount: 573.75, category: "physics-lab" },
  { sNo: 110, packageCode: "A", atlItemName: "2 Way Quick Push Type Lock Electric Wire Connectors", offeredMakeModel: "CH-2 Way Quick Push Type Lock Electric Wire Connectors Terminal (Pack of 5 Pcs)", type: "Consumable", qty: 4, unitRate: 50, amount: 200, category: "physics-lab" },
  { sNo: 111, packageCode: "A", atlItemName: "Bio Tech Kit", offeredMakeModel: "OM LABS Bio-Tech Arduino STEM Kit (EMG, Pulse Rate, SpO2, Temperature & pH)", type: "Non-Consumable", qty: 1, unitRate: 7023.75, amount: 7023.75, category: "biology-anatomy" },
  // SECTION B: Robotics & Automation (Items 112 - 140 / S.No 1-29 in Package B)
  { sNo: 112, packageCode: "B", atlItemName: "Water Pump module", offeredMakeModel: "Submersible mini water Pump 3 to 9V", type: "Consumable", qty: 10, unitRate: 46.25, amount: 462.5, category: "robotics-mechanics" },
  { sNo: 113, packageCode: "B", atlItemName: "Joystick Module", offeredMakeModel: "PS2 Joystick Module Breakout Sensor", type: "Consumable", qty: 6, unitRate: 42.5, amount: 255, category: "sensors" },
  { sNo: 114, packageCode: "B", atlItemName: "Motor driver Module - L293D", offeredMakeModel: "L293D Motor Driver Module", type: "Consumable", qty: 10, unitRate: 113.75, amount: 1137.5, category: "robotics-mechanics" },
  { sNo: 115, packageCode: "B", atlItemName: "DC Plastic Gear motor with wheel", offeredMakeModel: "150 RPM Single Shaft BO Motor", type: "Consumable", qty: 12, unitRate: 71.25, amount: 855, category: "robotics-mechanics" },
  { sNo: 116, packageCode: "B", atlItemName: "DC Plastic Gear motor with wheel", offeredMakeModel: "300 RPM BO Motor-Straight", type: "Consumable", qty: 12, unitRate: 83.75, amount: 1005, category: "robotics-mechanics" },
  { sNo: 117, packageCode: "B", atlItemName: "DC Plastic Gear motor with wheel", offeredMakeModel: "130\u2013280 RPM Strong Magnet BO Motor \u2013 Dual Shaft (1B48 EMC)", type: "Consumable", qty: 12, unitRate: 51.25, amount: 615, category: "robotics-mechanics" },
  { sNo: 118, packageCode: "B", atlItemName: "DC Plastic Gear motor with wheel", offeredMakeModel: "60 RPM Dual Shaft BO Motor - Straight", type: "Consumable", qty: 12, unitRate: 80, amount: 960, category: "robotics-mechanics" },
  { sNo: 119, packageCode: "B", atlItemName: "DC Plastic Gear motor with wheel", offeredMakeModel: "300 RPM Dual Shaft BO Motor-Straight", type: "Consumable", qty: 12, unitRate: 88.75, amount: 1065, category: "robotics-mechanics" },
  { sNo: 120, packageCode: "B", atlItemName: "DC Plastic Gear motor with wheel", offeredMakeModel: "Double Shaft BO Motor, 50 RPM", type: "Consumable", qty: 12, unitRate: 80, amount: 960, category: "robotics-mechanics" },
  { sNo: 121, packageCode: "B", atlItemName: "Wheels", offeredMakeModel: "65mm Robot Wheel for BO Motors (Yellow), Durable & Lightweight", type: "Consumable", qty: 20, unitRate: 30, amount: 600, category: "robotics-mechanics" },
  { sNo: 122, packageCode: "B", atlItemName: "DC Vibration Motor with Wire", offeredMakeModel: "Flat 1034 Mobile Phone Vibrator Motor", type: "Consumable", qty: 20, unitRate: 36.25, amount: 725, category: "robotics-mechanics" },
  { sNo: 123, packageCode: "B", atlItemName: "Relay Module", offeredMakeModel: "5V 2 Channel Relay Module", type: "Consumable", qty: 20, unitRate: 118.75, amount: 2375, category: "robotics-mechanics" },
  { sNo: 124, packageCode: "B", atlItemName: "Relay Module", offeredMakeModel: "5V 4 Channel Relay Module", type: "Consumable", qty: 20, unitRate: 195, amount: 3900, category: "robotics-mechanics" },
  { sNo: 125, packageCode: "B", atlItemName: "Water Solenoid Valve", offeredMakeModel: "YF-S201 Water Flow Sensor 1\u201330 L/min Black", type: "Consumable", qty: 4, unitRate: 252.5, amount: 1010, category: "robotics-mechanics" },
  { sNo: 126, packageCode: "B", atlItemName: "IR Sensors Array module for Line Following", offeredMakeModel: "3.3v-5v 8-Channel IR Sensor Array Line Follower Infrared Detection Module Board", type: "Consumable", qty: 5, unitRate: 96.25, amount: 481.25, category: "robotics-mechanics" },
  { sNo: 127, packageCode: "B", atlItemName: "Stepper motor with Driver board", offeredMakeModel: "JK42HS48-1684-01 NEMA17 4.4 kg-cm Stepper Motor - Round Type Shaft, A4988 driver Stepper Motor Driver", type: "Consumable", qty: 10, unitRate: 985, amount: 9850, category: "robotics-mechanics" },
  { sNo: 128, packageCode: "B", atlItemName: "Stepper motor with Driver board", offeredMakeModel: "JK42HS48-1684-01 NEMA17 4.4 kg-cm Stepper Motor - Round Type Shaft, A4988 driver Stepper Motor Driver", type: "Consumable", qty: 10, unitRate: 985, amount: 9850, category: "robotics-mechanics" },
  { sNo: 129, packageCode: "B", atlItemName: "DC motor", offeredMakeModel: "DC Motor - 150RPM - 12Volts", type: "Consumable", qty: 20, unitRate: 206.25, amount: 4125, category: "robotics-mechanics" },
  { sNo: 130, packageCode: "B", atlItemName: "DC motor", offeredMakeModel: "12V 60 RPM Geared DC Motor", type: "Consumable", qty: 20, unitRate: 168.75, amount: 3375, category: "robotics-mechanics" },
  { sNo: 131, packageCode: "B", atlItemName: "L298P Motor Driver", offeredMakeModel: "L298P Motor Driver Shield for Arduino", type: "Consumable", qty: 10, unitRate: 661.25, amount: 6612.5, category: "robotics-mechanics" },
  { sNo: 132, packageCode: "B", atlItemName: "Robotics DIY Kit", offeredMakeModel: "WitBlox AI Artificial Intelligence Robotic Science Kit for 101+ Project 174 Part 8 Yrs+, Interlocking Bricks", type: "Non-Consumable", qty: 3, unitRate: 4973.75, amount: 14921.25, category: "robotics-mechanics" },
  { sNo: 133, packageCode: "B", atlItemName: "Mechanical (Modular) Construction kit", offeredMakeModel: "Mechanix Steel Mega - 202 piece Building Kit I STEM/STEAM Toy for Adults, Kids, 8+, Tools & Manual Included", type: "Non-Consumable", qty: 5, unitRate: 1250, amount: 6250, category: "robotics-mechanics" },
  { sNo: 134, packageCode: "B", atlItemName: "Autonomous Mobile Robotics Kit", offeredMakeModel: "Balki Smart 4WD Autonomous Navigation & Obstacle Avoidance Kit with ESP32, Sensors & Motor Drivers", type: "Non-Consumable", qty: 1, unitRate: 4112.5, amount: 4112.5, category: "robotics-mechanics" },
  { sNo: 135, packageCode: "B", atlItemName: "Aerospace Kit", offeredMakeModel: "Smartivity Rocket Launcher", type: "Non-Consumable", qty: 1, unitRate: 817.5, amount: 817.5, category: "robotics-mechanics" },
  { sNo: 136, packageCode: "B", atlItemName: "Advance Metal Chassis for 4-wheel Robot (Red)", offeredMakeModel: "Red 2WD Aluminum Smart Robot Car Chassis Kit DIY", type: "Consumable", qty: 10, unitRate: 836.25, amount: 8362.5, category: "robotics-mechanics" },
  { sNo: 137, packageCode: "B", atlItemName: "EV (Electric Vehicle) Kit", offeredMakeModel: "EV Educational Prototype Kit with DC Motor, Controller, Battery Pack & Chassis", type: "Non-Consumable", qty: 1, unitRate: 15e3, amount: 15e3, category: "robotics-mechanics" },
  { sNo: 138, packageCode: "B", atlItemName: "Ball Caster Wheel", offeredMakeModel: "MINI 3PI Car N20 Caster Robot Ball Wheel, Small Robotics Wheel", type: "Consumable", qty: 20, unitRate: 43.75, amount: 875, category: "robotics-mechanics" },
  { sNo: 139, packageCode: "B", atlItemName: "Ball Bearing Two Trees Miniature", offeredMakeModel: "Two Trees Miniature bearings 624ZZ", type: "Consumable", qty: 20, unitRate: 12.5, amount: 250, category: "robotics-mechanics" },
  { sNo: 140, packageCode: "B", atlItemName: "Ball Bearing Large", offeredMakeModel: "608 ZZ Miniature Deep Groove Ball Bearing (8\xD722\xD77 mm) - Double Metal Shielded", type: "Consumable", qty: 5, unitRate: 28.75, amount: 143.75, category: "robotics-mechanics" },
  // SECTION C: AI/ML & Computer Vision (Items 141 - 147 / S.No 1-7 in Package C)
  { sNo: 141, packageCode: "C", atlItemName: "Single Board Computer Development Kit", offeredMakeModel: "Raspberry Pi 5 Model 8GB RAM", type: "Consumable", qty: 4, unitRate: 24998.75, amount: 99995, category: "microcontrollers" },
  { sNo: 142, packageCode: "C", atlItemName: "ESP32 CAM Module", offeredMakeModel: "ESP32-CAM WiFi + Bluetooth Module with OV2640 2MP Camera for Face Recognition", type: "Consumable", qty: 6, unitRate: 923.75, amount: 5542.5, category: "microcontrollers" },
  { sNo: 143, packageCode: "C", atlItemName: "AR/VR headsets (Unity, Unreal Engine compatible), haptic feedback devices, ARCore/ARKit tools", offeredMakeModel: "Meta Quest 3S VR Headset (With Controllers) - 128GB", type: "Non-Consumable", qty: 1, unitRate: 41250, amount: 41250, category: "drone-3d" },
  { sNo: 144, packageCode: "C", atlItemName: "R307 Biometric Sensor Module", offeredMakeModel: "R307S Optical Fingerprint Reader Sensor Module", type: "Consumable", qty: 4, unitRate: 1186.25, amount: 4745, category: "sensors" },
  { sNo: 145, packageCode: "C", atlItemName: "ESP 32 CAM Module", offeredMakeModel: "ESP32-CAM-MB WIFI BLUETOOTH DEVELOPMENT BOARD WITH OV3660 CAMERA MICRO USB CONNECTION TO SERIAL", type: "Non-Consumable", qty: 5, unitRate: 858.75, amount: 4293.75, category: "microcontrollers" },
  { sNo: 146, packageCode: "C", atlItemName: "MicroSD Card - 16 GB", offeredMakeModel: "SanDisk Ultra Micro SD 16GB UHS-I, 98MB/s R , Class 10 Memory Card", type: "Non-Consumable", qty: 5, unitRate: 1836.25, amount: 9181.25, category: "microcontrollers" },
  { sNo: 147, packageCode: "C", atlItemName: "AI & Machine Learning Kit", offeredMakeModel: "Official Arduino Tiny Machine Learning Kit AKX00028 Starter Bundle Nano 33 BLE Sense, OV7675 Camera & Custom Shield", type: "Non-Consumable", qty: 2, unitRate: 8498.75, amount: 16997.5, category: "microcontrollers" },
  // SECTION D: 3D Printing & Rapid Prototyping (Items 148 - 169 / S.No 1-22 in Package D)
  { sNo: 148, packageCode: "D", atlItemName: "3D Printer Kit and tools", offeredMakeModel: "Creality K1C 3D Printer (High-Speed CoreXY, AI Camera, Carbon-Fiber Ready)", type: "Non-Consumable", qty: 1, unitRate: 66248.75, amount: 66248.75, category: "drone-3d" },
  { sNo: 149, packageCode: "D", atlItemName: "Dedicated UPS/Power back up", offeredMakeModel: "Artis 1500VA Line Interactive UPS for Personal Computers, 3D Printers, Routers & Gaming Consoles", type: "Non-Consumable", qty: 1, unitRate: 9998.75, amount: 9998.75, category: "drone-3d" },
  { sNo: 150, packageCode: "D", atlItemName: "Filament for 3D printer", offeredMakeModel: "5kg PLA + 1kg TPU multi-colour Spools", type: "Consumable", qty: 1, unitRate: 5125, amount: 5125, category: "drone-3d" },
  { sNo: 151, packageCode: "D", atlItemName: "Filament Storage Box", offeredMakeModel: "Filament storage box with humidity seals", type: "Non-Consumable", qty: 5, unitRate: 562.5, amount: 2812.5, category: "drone-3d" },
  { sNo: 152, packageCode: "D", atlItemName: "3D Pen", offeredMakeModel: "3D Printing Pen LT-3 Series with Temperature Control", type: "Non-Consumable", qty: 5, unitRate: 1411.25, amount: 7056.25, category: "drone-3d" },
  { sNo: 153, packageCode: "D", atlItemName: "3D Pen Filament", offeredMakeModel: "3D Pen Filament Refills \u2013 11 Multicolor PLA | 5m Each | 1.75mm | for Kids & Adults (Pack of 11)", type: "Consumable", qty: 5, unitRate: 261.25, amount: 1306.25, category: "drone-3d" },
  { sNo: 154, packageCode: "D", atlItemName: "MDF Board Plain/ Balsa Wood Sheets", offeredMakeModel: "MDF Sheets for Laser Cutting, Thin MDF Board Unfinished for Crafts, DIY Architectural Models", type: "Consumable", qty: 10, unitRate: 298.75, amount: 2987.5, category: "drone-3d" },
  { sNo: 155, packageCode: "D", atlItemName: "Acrylic Sheet", offeredMakeModel: "Laser-Grade Cast Acrylic Sheet Stock Assortment (Multi-Thickness & Multi-Color Pack)", type: "Consumable", qty: 8, unitRate: 1406.25, amount: 11250, category: "drone-3d" },
  { sNo: 156, packageCode: "D", atlItemName: "Set of Arts & Crafts Accessories", offeredMakeModel: "Paraspapermart A4 Grey Board, 2mm Thick, 800 GSM, Pack of 5, Fine Finish Craft Board for Model Making", type: "Consumable", qty: 5, unitRate: 348.75, amount: 1743.75, category: "drone-3d" },
  { sNo: 157, packageCode: "D", atlItemName: "Set of Arts & Crafts Accessories", offeredMakeModel: "Worison 3 mm Thick 8pc Pack Craft Foam Board Set White, 8 x 8 Inches", type: "Consumable", qty: 5, unitRate: 352.5, amount: 1762.5, category: "drone-3d" },
  { sNo: 158, packageCode: "D", atlItemName: "Set of Arts & Crafts Accessories", offeredMakeModel: "PRANSUNITA 12 Pcs Colorful Jute Twine String, 20 MTS Each, 3 ply Colorful Rope Durable Packing String", type: "Consumable", qty: 5, unitRate: 26.56, amount: 132.8, category: "drone-3d" },
  { sNo: 159, packageCode: "D", atlItemName: "Set of Arts & Crafts Accessories", offeredMakeModel: "Amazon Basics Rubber Bands | Enhanced Stretchability and Durability | (3 inch, Pack of 50 gm)", type: "Consumable", qty: 100, unitRate: 1.99, amount: 199, category: "drone-3d" },
  { sNo: 160, packageCode: "D", atlItemName: "Set of Arts & Crafts Accessories", offeredMakeModel: "[100 Count] 4.5 Inch Wooden Multi-Purpose Popsicle Sticks, Craft, Tongue Depressor Wood Sticks", type: "Consumable", qty: 100, unitRate: 1.24, amount: 124, category: "drone-3d" },
  { sNo: 161, packageCode: "D", atlItemName: "Set of Arts & Crafts Accessories", offeredMakeModel: "Fevicol SH - Ultimate woodworking adhesive | Easy to use | Durable | Sets in 2-3 hours | 500g", type: "Consumable", qty: 2, unitRate: 198.75, amount: 397.5, category: "drone-3d" },
  { sNo: 162, packageCode: "D", atlItemName: "Balsa Wood Sticks and Blocks", offeredMakeModel: "8PCS 10cm*15cm Balsa Wood Sheets, Wood Sheet for DIY Model Aircraft Building, Boat Crafting", type: "Consumable", qty: 5, unitRate: 523.75, amount: 2618.75, category: "drone-3d" },
  { sNo: 163, packageCode: "D", atlItemName: "Hacksaw Frame", offeredMakeModel: "Taparia HFEP12 Nylon Handle Hacksaw Frame with Blade", type: "Non-Consumable", qty: 1, unitRate: 511.25, amount: 511.25, category: "drone-3d" },
  { sNo: 164, packageCode: "D", atlItemName: "Hacksaw blades", offeredMakeModel: "Hacksaw blade 12 inch Miranda / Ultra 12*1/2*18", type: "Consumable", qty: 10, unitRate: 156.25, amount: 1562.5, category: "drone-3d" },
  { sNo: 165, packageCode: "D", atlItemName: "Mini Hacksaw Frame", offeredMakeModel: "BUKU Mini 6inch Hacksaw Frame with Plastic Handle + 10pcs Spare Blades (Pack of 1)", type: "Non-Consumable", qty: 1, unitRate: 226.25, amount: 226.25, category: "drone-3d" },
  { sNo: 166, packageCode: "D", atlItemName: "Mini Hacksaw blades", offeredMakeModel: "Included with Mini Hacksaw Frame (10 spare blades)", type: "Consumable", qty: 10, unitRate: 0, amount: 0, category: "drone-3d" },
  { sNo: 167, packageCode: "D", atlItemName: "Pliers: 4.5-inch size", offeredMakeModel: 'External straight pliers 4.5"', type: "Non-Consumable", qty: 1, unitRate: 225, amount: 225, category: "drone-3d" },
  { sNo: 168, packageCode: "D", atlItemName: "Pliers: 4.5-inch size", offeredMakeModel: 'Long nose pliers 4.5"', type: "Non-Consumable", qty: 1, unitRate: 250, amount: 250, category: "drone-3d" },
  { sNo: 169, packageCode: "D", atlItemName: "Tweezer Set", offeredMakeModel: "6-pc non-magnetic tweezer set", type: "Non-Consumable", qty: 1, unitRate: 437.5, amount: 437.5, category: "drone-3d" }
];
var ATL_QUOTATION_PACKAGES = [
  {
    id: "pkg-a",
    code: "Package A",
    title: "Electronics & IoT Equipment Package",
    scope: "Microcontrollers, IoT boards, sensors, displays, communication modules, power supplies, electronic components and themed STEM kits.",
    lineItemsCount: 111,
    subTotal: 191028.57,
    gstRate: 18,
    gstAmount: 34385.14,
    roundOff: 0.29,
    grandTotal: 225414,
    grandTotalWords: "Rupees Two Lakh Twenty Five Thousand Four Hundred Fourteen Only",
    quotationNo: "BT/ATL/2026-27/A-001",
    date: "10-Oct-2026",
    validUntil: "09-Nov-2026",
    reference: "AIM ATL Equipment Guidelines (2026)",
    badge: "111 LINE ITEMS \xB7 IOT & SENSORS",
    themeColor: "blue",
    highlights: [
      "20x Arduino UNO R4 Minima Boards + 10x Nano V3 Type-C + 15x ESP32 WROOM IoT Boards",
      "Full sensor array: 40x HC-SR04 Ultrasonics, 20x PIRs, MQ-2 to MQ-135 Gas sensors, DHT22, PMS7003 Air Quality",
      "400m Hook-up wires, 2000+ Jumper ribbons, 5000+ DIP LEDs, Regulated DC Power Supply 30V/5A",
      "Themed Kits: Bio-Tech Kit, Agri-Tech Kit, Water/Sanitation Kit & Solar Energy Experiment Kit"
    ],
    lineItems: ALL_ATL_LINE_ITEMS.slice(0, 111)
  },
  {
    id: "pkg-b",
    code: "Package B",
    title: "Robotics & Automation Equipment Package",
    scope: "Motors, motor drivers, chassis, wheels, relays, robotics and construction kits, rocketry aerospace and EV kits.",
    lineItemsCount: 29,
    subTotal: 100951.25,
    gstRate: 18,
    gstAmount: 18171.23,
    roundOff: -0.48,
    grandTotal: 119122,
    grandTotalWords: "Rupees One Lakh Nineteen Thousand One Hundred Twenty Two Only",
    quotationNo: "BT/ATL/2026-27/B-001",
    date: "10-Oct-2026",
    validUntil: "09-Nov-2026",
    reference: "AIM ATL Equipment Guidelines (2026)",
    badge: "29 LINE ITEMS \xB7 ROBOTICS & MECHATRONICS",
    themeColor: "emerald",
    highlights: [
      "20x NEMA17 Stepper Motors (JK42HS48) with A4988 Drivers + 20x High-Torque 150RPM DC Motors",
      "72x BO Geared Motors (150/300/60/50 RPM) + 20x Rubber Grip Wheels & 10x 2WD Aluminum Robot Chassis",
      "WitBlox AI Robotic Science Kit (101+ Projects) & Mechanix Steel Mega 202-piece Modular Kits",
      "Autonomous 4WD Smart Rover Kit + Smartivity Rocket Launcher + Electric Vehicle (EV) Kit"
    ],
    lineItems: ALL_ATL_LINE_ITEMS.slice(111, 140)
  },
  {
    id: "pkg-c",
    code: "Package C",
    title: "AI/ML & Computer Vision Equipment Package",
    scope: "Single-board computers, camera modules, TinyML kit, biometric sensor and AR/VR headset.",
    lineItemsCount: 7,
    subTotal: 182005,
    gstRate: 18,
    gstAmount: 32760.9,
    roundOff: 0.1,
    grandTotal: 214766,
    grandTotalWords: "Rupees Two Lakh Fourteen Thousand Seven Hundred Sixty Six Only",
    quotationNo: "BT/ATL/2026-27/C-001",
    date: "10-Oct-2026",
    validUntil: "09-Nov-2026",
    reference: "AIM ATL Equipment Guidelines (2026)",
    badge: "7 LINE ITEMS \xB7 AI, TINYML & AR/VR",
    themeColor: "purple",
    highlights: [
      "4x Raspberry Pi 5 Model 8GB RAM Single Board Computers (Broadcom Quad-Core 2.4GHz)",
      "Meta Quest 3S VR Headset 128GB with Touch Plus Controllers for Unity & Spatial Simulation",
      "2x Official Arduino Tiny Machine Learning Kits AKX00028 with Nano 33 BLE Sense & OV7675 Camera",
      "11x ESP32-CAM & ESP32-CAM-MB Boards with OV2640/OV3660 + R307S Optical Fingerprint Sensor"
    ],
    lineItems: ALL_ATL_LINE_ITEMS.slice(140, 147)
  },
  {
    id: "pkg-d",
    code: "Package D",
    title: "3D Printing & Rapid Prototyping Equipment Package",
    scope: "3D printer with UPS and filament, 3D pens, prototyping materials and mechanical hand tools.",
    lineItemsCount: 22,
    subTotal: 116975.8,
    gstRate: 18,
    gstAmount: 21055.64,
    roundOff: -0.44,
    grandTotal: 138031,
    grandTotalWords: "Rupees One Lakh Thirty Eight Thousand Thirty One Only",
    quotationNo: "BT/ATL/2026-27/D-001",
    date: "10-Oct-2026",
    validUntil: "09-Nov-2026",
    reference: "AIM ATL Equipment Guidelines (2026)",
    badge: "22 LINE ITEMS \xB7 3D PRINTING & TOOLS",
    themeColor: "amber",
    highlights: [
      "Creality K1C High-Speed 3D Printer (CoreXY, 600mm/s, AI Camera, Carbon Fiber Compatible)",
      "Artis 1500VA Line Interactive Dedicated Lab UPS with Surge Protection",
      "5kg PLA + 1kg TPU Filaments + 5x Filament Sealed Dry Boxes + 5x 3D Pens LT-3 Series",
      "Prototyping Stock: Cast Acrylic Sheets, MDF Laser Boards, Balsa Wood, Taparia Hacksaws & Pliers"
    ],
    lineItems: ALL_ATL_LINE_ITEMS.slice(147, 169)
  },
  {
    id: "pkg-e",
    code: "Package E",
    title: "Complete ATL Equipment Package (Master Turnkey Solution)",
    scope: "All 169 line items of the AIM ATL equipment list (Packages A + B + C + D combined).",
    lineItemsCount: 169,
    subTotal: 590960.62,
    gstRate: 18,
    gstAmount: 106372.91,
    roundOff: 0.47,
    grandTotal: 697334,
    grandTotalWords: "Rupees Six Lakh Ninety Seven Thousand Three Hundred Thirty Four Only",
    quotationNo: "BT/ATL/2026-27/E-001",
    date: "10-Oct-2026",
    validUntil: "09-Nov-2026",
    reference: "AIM ATL Equipment Guidelines (2026)",
    badge: "COMPLETE 169-ITEM TURNKEY LAB",
    themeColor: "rose",
    highlights: [
      "Full Turnkey Lab: Combines Package A + Package B + Package C + Package D into one unified consignment",
      "Covers Electronics & IoT (111 items), Robotics & Automation (29 items), AI/ML & VR (7 items), 3D Prototyping (22 items)",
      "Sub-total \u20B95,90,960.62 + 18% GST (\u20B91,06,372.91) = \u20B96,97,334.00 Net Institutional Investment",
      "Includes complimentary 2-day on-site teacher training, laboratory inauguration support & 12-month onsite warranty"
    ],
    lineItems: ALL_ATL_LINE_ITEMS
  }
];

// src/server/firestoreAdmin.ts
import {
  initializeApp,
  getApps,
  cert,
  applicationDefault
} from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import fs from "fs";
import path from "path";
var cachedAdminDb = null;
var adminInitAttempted = false;
var adminInitReason = "not_initialized";
function stripUndefinedDeep(value) {
  if (value === null || value === void 0) return value;
  if (Array.isArray(value)) {
    return value.map((item) => stripUndefinedDeep(item));
  }
  if (typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      if (v !== void 0) {
        out[k] = stripUndefinedDeep(v);
      }
    }
    return out;
  }
  return value;
}
function mapNormalizedPaymentStatus(paymentStatus) {
  const s = (paymentStatus || "").toLowerCase();
  if (s === "paid" || s === "po approved (net 30)") return "paid";
  if (s === "failed") return "failed";
  return "pending";
}
function mapNormalizedDeliveryStatus(orderStatus) {
  const s = (orderStatus || "").toLowerCase();
  if (s === "delivered") return "delivered";
  if (s === "dispatched" || s === "in_transit" || s === "out_for_delivery") return "delivering";
  if (s === "qc_assembly") return "processing";
  return "pending";
}
function loadFirebaseConfig() {
  try {
    const configPath = path.join(process.cwd(), "firebase-applet-config.json");
    if (fs.existsSync(configPath)) {
      const parsed = JSON.parse(fs.readFileSync(configPath, "utf8"));
      return {
        projectId: process.env.FIREBASE_PROJECT_ID || parsed.projectId || "gen-lang-client-0184886612",
        firestoreDatabaseId: process.env.FIREBASE_DATABASE_ID || parsed.firestoreDatabaseId
      };
    }
  } catch {
  }
  return {
    projectId: process.env.FIREBASE_PROJECT_ID || "gen-lang-client-0184886612",
    firestoreDatabaseId: process.env.FIREBASE_DATABASE_ID || "ai-studio-balkitechnologie-18d8f381-5363-412d-b9cb-53b6b6bbba92"
  };
}
function stripWrappingQuotes(value) {
  const trimmed = value.trim();
  if (trimmed.startsWith('"') && trimmed.endsWith('"') || trimmed.startsWith("'") && trimmed.endsWith("'")) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}
function parseServiceAccountFromEnv() {
  const rawJson = stripWrappingQuotes(process.env.FIREBASE_SERVICE_ACCOUNT_JSON || "");
  if (rawJson) {
    try {
      const decoded = rawJson.startsWith("{") ? rawJson : Buffer.from(rawJson, "base64").toString("utf8");
      let parsed;
      try {
        parsed = JSON.parse(decoded);
      } catch {
        const normalizedJson = decoded.replace(/\r?\n/g, "\\n");
        parsed = JSON.parse(normalizedJson);
      }
      if (!parsed || typeof parsed !== "object") {
        return { account: null, diagnosticReason: "invalid_service_account_json" };
      }
      if (!parsed.client_email || !parsed.private_key) {
        return { account: null, diagnosticReason: "missing_client_email_or_private_key" };
      }
      const privateKey = String(parsed.private_key).replace(/\\\\n/g, "\n").replace(/\\n/g, "\n");
      if (!privateKey.includes("BEGIN PRIVATE KEY") && !privateKey.includes("BEGIN RSA PRIVATE KEY")) {
        return { account: null, diagnosticReason: "invalid_private_key_pem_format" };
      }
      return {
        account: {
          projectId: parsed.project_id || loadFirebaseConfig().projectId,
          clientEmail: parsed.client_email,
          privateKey
        },
        diagnosticReason: null
      };
    } catch {
      console.warn("[FirebaseAdmin] FIREBASE_SERVICE_ACCOUNT_JSON is malformed and could not be parsed.");
      return { account: null, diagnosticReason: "invalid_service_account_json" };
    }
  }
  const clientEmail = stripWrappingQuotes(process.env.FIREBASE_CLIENT_EMAIL || "");
  const privateKeyRaw = stripWrappingQuotes(process.env.FIREBASE_PRIVATE_KEY || "");
  const projectId = stripWrappingQuotes(process.env.FIREBASE_PROJECT_ID || "");
  if (clientEmail || privateKeyRaw) {
    if (!clientEmail || !privateKeyRaw) {
      return { account: null, diagnosticReason: "missing_client_email_or_private_key" };
    }
    const privateKey = privateKeyRaw.replace(/\\\\n/g, "\n").replace(/\\n/g, "\n");
    if (!privateKey.includes("BEGIN PRIVATE KEY") && !privateKey.includes("BEGIN RSA PRIVATE KEY")) {
      return { account: null, diagnosticReason: "invalid_private_key_pem_format" };
    }
    return {
      account: {
        projectId: projectId || loadFirebaseConfig().projectId,
        clientEmail,
        privateKey
      },
      diagnosticReason: null
    };
  }
  return { account: null, diagnosticReason: null };
}
function getAdminFirestore() {
  if (cachedAdminDb) return cachedAdminDb;
  if (adminInitAttempted) return null;
  adminInitAttempted = true;
  const cfg = loadFirebaseConfig();
  const { account: serviceAccount, diagnosticReason } = parseServiceAccountFromEnv();
  if (diagnosticReason) {
    adminInitReason = diagnosticReason;
    console.warn(`[FirebaseAdmin] Initialization skipped: ${adminInitReason}`);
    return null;
  }
  const hasExplicitCreds = Boolean(serviceAccount || process.env.GOOGLE_APPLICATION_CREDENTIALS);
  if (!hasExplicitCreds) {
    adminInitReason = "no_admin_credentials_configured";
    return null;
  }
  try {
    const appName = "balki-server-admin";
    const existingApp = getApps().find((a) => a.name === appName);
    const firebaseApp = existingApp || initializeApp(
      {
        credential: serviceAccount ? cert(serviceAccount) : applicationDefault(),
        projectId: serviceAccount?.projectId || cfg.projectId
      },
      appName
    );
    cachedAdminDb = cfg.firestoreDatabaseId ? getFirestore(firebaseApp, cfg.firestoreDatabaseId) : getFirestore(firebaseApp);
    adminInitReason = "configured";
    console.info(`[FirebaseAdmin] Initialized for project=${cfg.projectId}, db=${cfg.firestoreDatabaseId || "(default)"}`);
    return cachedAdminDb;
  } catch (err) {
    adminInitReason = err instanceof Error ? err.message : "init_failed";
    console.warn("[FirebaseAdmin] Initialization failed:", adminInitReason);
    return null;
  }
}
function getAdminFirestoreStatus() {
  getAdminFirestore();
  return {
    configured: Boolean(cachedAdminDb),
    reason: adminInitReason
  };
}
async function syncOrderCreatedToFirestore(order) {
  const db = getAdminFirestore();
  if (!db) return false;
  try {
    const orderRef = db.collection("orders").doc(order.id);
    const sanitizedOrder = stripUndefinedDeep(order);
    await orderRef.set(
      stripUndefinedDeep({
        ...sanitizedOrder,
        orderId: order.id,
        customerId: order.customerId || order.userId || "client",
        userId: order.userId || order.customerId || "client",
        serverVerifiedTotal: order.finalAmount ?? order.totalAmount,
        serverVerifiedTotalPaise: Math.round((order.finalAmount ?? order.totalAmount) * 100),
        currency: "INR",
        razorpayOrderId: order.razorpayOrderId || null,
        razorpayPaymentId: order.razorpayPaymentId || null,
        paymentStatus: order.paymentStatus,
        normalizedPaymentStatus: mapNormalizedPaymentStatus(order.paymentStatus),
        orderStatus: order.orderStatus,
        deliveryStatus: mapNormalizedDeliveryStatus(order.orderStatus),
        approvalStatus: order.approvalStatus,
        confirmationNotificationSent: false,
        createdAt: order.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      }),
      { merge: true }
    );
    return true;
  } catch (err) {
    console.warn("Firestore Admin syncOrderCreated failed:", err instanceof Error ? err.message : err);
    return false;
  }
}
async function syncRazorpayOrderIdToFirestore(orderId, razorpayOrderId) {
  const db = getAdminFirestore();
  if (!db) return false;
  try {
    await db.collection("orders").doc(orderId).set(
      {
        razorpayOrderId,
        paymentStatus: "Payment Pending",
        normalizedPaymentStatus: "pending",
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      },
      { merge: true }
    );
    return true;
  } catch (err) {
    console.warn("Firestore Admin syncRazorpayOrderId failed:", err instanceof Error ? err.message : err);
    return false;
  }
}
async function syncOrderRequestToFirestore(request) {
  const db = getAdminFirestore();
  if (!db) return false;
  try {
    const sanitizedReq = stripUndefinedDeep(request);
    await db.collection("orderRequests").doc(request.requestId).set(
      stripUndefinedDeep({
        ...sanitizedReq,
        serverVerifiedTotal: request.finalAmount ?? request.requestedAmount,
        serverVerifiedTotalPaise: Math.round((request.finalAmount ?? request.requestedAmount) * 100),
        currency: "INR",
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      }),
      { merge: true }
    );
    return true;
  } catch (err) {
    console.warn("Firestore Admin syncOrderRequest failed:", err instanceof Error ? err.message : err);
    return false;
  }
}
async function findFirestoreOrder(params) {
  const db = getAdminFirestore();
  if (!db) return null;
  try {
    if (params.orderId) {
      const snap = await db.collection("orders").doc(params.orderId).get();
      if (snap.exists) {
        return { id: snap.id, ...snap.data() };
      }
    }
    if (params.razorpayOrderId) {
      const querySnap = await db.collection("orders").where("razorpayOrderId", "==", params.razorpayOrderId).limit(1).get();
      if (!querySnap.empty) {
        const docSnap = querySnap.docs[0];
        return { id: docSnap.id, ...docSnap.data() };
      }
    }
    return null;
  } catch (err) {
    console.warn("Firestore Admin findFirestoreOrder failed:", err instanceof Error ? err.message : err);
    return null;
  }
}
async function runAtomicCaptureTransaction(params) {
  const db = getAdminFirestore();
  if (!db) {
    return { handledByFirestore: false };
  }
  try {
    return await db.runTransaction(async (tx) => {
      if (params.eventId) {
        const eventRef = db.collection("webhook-events").doc(params.eventId);
        const eventSnap = await tx.get(eventRef);
        if (eventSnap.exists) {
          return { handledByFirestore: true, duplicateEvent: true };
        }
      }
      let orderRef = null;
      let orderSnap = null;
      if (params.orderId) {
        orderRef = db.collection("orders").doc(params.orderId);
        orderSnap = await tx.get(orderRef);
      }
      if ((!orderSnap || !orderSnap.exists) && params.razorpayOrderId) {
        const qSnap = await tx.get(
          db.collection("orders").where("razorpayOrderId", "==", params.razorpayOrderId).limit(1)
        );
        if (!qSnap.empty) {
          orderSnap = qSnap.docs[0];
          orderRef = orderSnap.ref;
        }
      }
      let orderData;
      let isNewDoc = false;
      if (!orderSnap || !orderSnap.exists || !orderRef) {
        if (params.fallbackOrderData) {
          const fallback = stripUndefinedDeep(params.fallbackOrderData);
          orderRef = db.collection("orders").doc(fallback.id);
          orderData = {
            ...fallback,
            orderId: fallback.id,
            customerId: fallback.customerId || fallback.userId || "client",
            userId: fallback.userId || fallback.customerId || "client",
            serverVerifiedTotal: fallback.finalAmount ?? fallback.totalAmount,
            serverVerifiedTotalPaise: Math.round((fallback.finalAmount ?? fallback.totalAmount) * 100),
            currency: "INR"
          };
          isNewDoc = true;
        } else {
          if (params.eventId) {
            tx.set(db.collection("webhook-events").doc(params.eventId), {
              eventId: params.eventId,
              eventName: params.eventName || "payment.captured",
              razorpayOrderId: params.razorpayOrderId,
              razorpayPaymentId: params.razorpayPaymentId,
              status: "ignored_order_not_found",
              processedAt: (/* @__PURE__ */ new Date()).toISOString()
            });
          }
          return { handledByFirestore: true, orderNotFound: true };
        }
      } else {
        orderData = orderSnap.data();
      }
      if (orderData.razorpayOrderId && params.razorpayOrderId && orderData.razorpayOrderId !== params.razorpayOrderId) {
        return {
          handledByFirestore: true,
          razorpayOrderMismatch: true,
          order: { id: orderRef.id, ...orderData }
        };
      }
      const expectedTotal = Number(
        orderData.serverVerifiedTotal ?? orderData.finalAmount ?? orderData.totalAmount ?? 0
      );
      const expectedPaise = Math.round(expectedTotal * 100);
      if (params.currency && params.currency.toUpperCase() !== "INR") {
        if (params.eventId) {
          tx.set(db.collection("webhook-events").doc(params.eventId), {
            eventId: params.eventId,
            eventName: params.eventName || "payment.captured",
            orderId: orderRef.id,
            status: "rejected_currency_mismatch",
            currency: params.currency,
            processedAt: (/* @__PURE__ */ new Date()).toISOString()
          });
        }
        return { handledByFirestore: true, currencyMismatch: true };
      }
      if (typeof params.capturedAmountPaise === "number" && params.capturedAmountPaise !== expectedPaise) {
        if (params.eventId) {
          tx.set(db.collection("webhook-events").doc(params.eventId), {
            eventId: params.eventId,
            eventName: params.eventName || "payment.captured",
            orderId: orderRef.id,
            status: "rejected_amount_mismatch",
            expectedPaise,
            actualPaise: params.capturedAmountPaise,
            processedAt: (/* @__PURE__ */ new Date()).toISOString()
          });
        }
        return {
          handledByFirestore: true,
          amountMismatch: true,
          expectedPaise,
          actualPaise: params.capturedAmountPaise
        };
      }
      if (orderData.paymentStatus === "Paid") {
        if (orderData.razorpayPaymentId === params.razorpayPaymentId) {
          if (params.eventId) {
            tx.set(db.collection("webhook-events").doc(params.eventId), {
              eventId: params.eventId,
              eventName: params.eventName || "payment.captured",
              orderId: orderRef.id,
              razorpayOrderId: params.razorpayOrderId,
              razorpayPaymentId: params.razorpayPaymentId,
              status: "idempotent_already_paid",
              processedAt: (/* @__PURE__ */ new Date()).toISOString()
            });
          }
          return {
            handledByFirestore: true,
            alreadyPaidSamePayment: true,
            shouldSendConfirmation: false,
            order: { id: orderRef.id, ...orderData }
          };
        }
        if (params.eventId) {
          tx.set(db.collection("webhook-events").doc(params.eventId), {
            eventId: params.eventId,
            eventName: params.eventName || "payment.captured",
            orderId: orderRef.id,
            razorpayOrderId: params.razorpayOrderId,
            razorpayPaymentId: params.razorpayPaymentId,
            existingPaymentId: orderData.razorpayPaymentId,
            status: "rejected_duplicate_payment",
            processedAt: (/* @__PURE__ */ new Date()).toISOString()
          });
        }
        return { handledByFirestore: true, conflictDuplicatePayment: true, order: { id: orderRef.id, ...orderData } };
      }
      const nowIso = (/* @__PURE__ */ new Date()).toISOString();
      const shouldSendConfirmation = orderData.confirmationNotificationSent !== true;
      const nextOrderStatus = orderData.orderStatus === "delivered" ? "delivered" : "qc_assembly";
      const updatedFields = stripUndefinedDeep({
        paymentStatus: "Paid",
        normalizedPaymentStatus: "paid",
        orderStatus: nextOrderStatus,
        deliveryStatus: mapNormalizedDeliveryStatus(nextOrderStatus),
        razorpayOrderId: params.razorpayOrderId,
        razorpayPaymentId: params.razorpayPaymentId,
        paymentMethod: params.paymentMethod || orderData.paymentMethod || "Razorpay",
        paidAt: nowIso,
        updatedAt: nowIso,
        confirmationNotificationSent: true
      });
      if (params.razorpaySignature) {
        updatedFields.razorpaySignature = params.razorpaySignature;
      }
      if (isNewDoc) {
        tx.set(orderRef, stripUndefinedDeep({ ...orderData, ...updatedFields }), { merge: true });
      } else {
        tx.update(orderRef, updatedFields);
      }
      const txnId = `txn_${params.source}_${Date.now()}_${Math.floor(1e3 + Math.random() * 9e3)}`;
      const txnRecord = {
        transactionId: txnId,
        orderId: orderRef.id,
        customerId: orderData.customerId || orderData.userId || "client",
        amount: expectedTotal,
        currency: "INR",
        paymentMethod: params.paymentMethod || "Razorpay",
        transactionType: "payment",
        gatewayReference: params.razorpayPaymentId,
        status: "SUCCESS",
        metadata: {
          source: params.source,
          razorpayOrderId: params.razorpayOrderId,
          razorpayPaymentId: params.razorpayPaymentId,
          eventId: params.eventId || null,
          verifiedAt: nowIso
        },
        createdAt: nowIso
      };
      tx.set(db.collection("paymentTransactions").doc(txnId), txnRecord);
      let notifRecord;
      if (shouldSendConfirmation) {
        const notifId = `notif_pay_${orderRef.id}_${params.razorpayPaymentId}`;
        notifRecord = {
          notificationId: notifId,
          recipientId: orderData.customerId || orderData.userId || "client",
          recipientEmail: orderData.customerEmail,
          title: `Payment Confirmed: Order ${orderRef.id}`,
          message: `Your payment of INR ${expectedTotal.toLocaleString("en-IN")} has been verified via Razorpay (Txn: ${params.razorpayPaymentId}).`,
          type: "order_status",
          orderId: orderRef.id,
          read: false,
          createdAt: nowIso
        };
        tx.set(db.collection("notifications").doc(notifId), notifRecord);
      }
      if (params.eventId) {
        tx.set(db.collection("webhook-events").doc(params.eventId), {
          eventId: params.eventId,
          eventName: params.eventName || "payment.captured",
          orderId: orderRef.id,
          razorpayOrderId: params.razorpayOrderId,
          razorpayPaymentId: params.razorpayPaymentId,
          amountPaise: expectedPaise,
          currency: "INR",
          status: "processed_paid",
          processedAt: nowIso
        });
      }
      return {
        handledByFirestore: true,
        shouldSendConfirmation,
        order: { id: orderRef.id, ...orderData, ...updatedFields },
        transaction: txnRecord,
        notification: notifRecord
      };
    });
  } catch (err) {
    console.warn("Firestore runAtomicCaptureTransaction failed:", err instanceof Error ? err.message : err);
    return { handledByFirestore: false };
  }
}
async function runAtomicFailureTransaction(params) {
  const db = getAdminFirestore();
  if (!db) {
    return { handledByFirestore: false };
  }
  try {
    return await db.runTransaction(async (tx) => {
      if (params.eventId) {
        const eventRef = db.collection("webhook-events").doc(params.eventId);
        const eventSnap = await tx.get(eventRef);
        if (eventSnap.exists) {
          return { handledByFirestore: true, duplicateEvent: true };
        }
      }
      let orderRef = null;
      let orderSnap = null;
      if (params.orderId) {
        orderRef = db.collection("orders").doc(params.orderId);
        orderSnap = await tx.get(orderRef);
      }
      if ((!orderSnap || !orderSnap.exists) && params.razorpayOrderId) {
        const qSnap = await tx.get(
          db.collection("orders").where("razorpayOrderId", "==", params.razorpayOrderId).limit(1)
        );
        if (!qSnap.empty) {
          orderSnap = qSnap.docs[0];
          orderRef = orderSnap.ref;
        }
      }
      const nowIso = (/* @__PURE__ */ new Date()).toISOString();
      if (!orderSnap || !orderSnap.exists || !orderRef) {
        if (params.eventId) {
          tx.set(db.collection("webhook-events").doc(params.eventId), {
            eventId: params.eventId,
            eventName: params.eventName || "payment.failed",
            razorpayOrderId: params.razorpayOrderId || null,
            razorpayPaymentId: params.razorpayPaymentId || null,
            status: "ignored_order_not_found",
            processedAt: nowIso
          });
        }
        return { handledByFirestore: true, orderNotFound: true };
      }
      const orderData = orderSnap.data();
      if (orderData.paymentStatus === "Paid") {
        if (params.eventId) {
          tx.set(db.collection("webhook-events").doc(params.eventId), {
            eventId: params.eventId,
            eventName: params.eventName || "payment.failed",
            orderId: orderRef.id,
            razorpayOrderId: params.razorpayOrderId || null,
            razorpayPaymentId: params.razorpayPaymentId || null,
            status: "ignored_already_paid",
            processedAt: nowIso
          });
        }
        return {
          handledByFirestore: true,
          ignoredAlreadyPaid: true,
          order: { id: orderRef.id, ...orderData }
        };
      }
      const failureEntry = {
        paymentId: params.razorpayPaymentId || null,
        errorCode: params.errorCode || "PAYMENT_FAILED",
        description: params.errorDescription || "Payment attempt failed at Razorpay gateway",
        timestamp: nowIso
      };
      tx.update(orderRef, {
        paymentStatus: "Failed",
        normalizedPaymentStatus: "failed",
        lastPaymentError: failureEntry.description,
        failedPaymentAttempts: FieldValue.arrayUnion(failureEntry),
        updatedAt: nowIso
      });
      const txnId = `txn_fail_${Date.now()}_${Math.floor(1e3 + Math.random() * 9e3)}`;
      tx.set(db.collection("paymentTransactions").doc(txnId), {
        transactionId: txnId,
        orderId: orderRef.id,
        customerId: orderData.customerId || orderData.userId || "client",
        amount: Number(orderData.serverVerifiedTotal ?? orderData.finalAmount ?? orderData.totalAmount ?? 0),
        currency: "INR",
        paymentMethod: "Razorpay",
        transactionType: "payment",
        gatewayReference: params.razorpayPaymentId || params.razorpayOrderId || txnId,
        status: "FAILED",
        metadata: failureEntry,
        createdAt: nowIso
      });
      if (params.eventId) {
        tx.set(db.collection("webhook-events").doc(params.eventId), {
          eventId: params.eventId,
          eventName: params.eventName || "payment.failed",
          orderId: orderRef.id,
          razorpayOrderId: params.razorpayOrderId || null,
          razorpayPaymentId: params.razorpayPaymentId || null,
          status: "processed_failed",
          processedAt: nowIso
        });
      }
      return {
        handledByFirestore: true,
        order: { id: orderRef.id, ...orderData, paymentStatus: "Failed", lastPaymentError: failureEntry.description }
      };
    });
  } catch (err) {
    console.warn("Firestore runAtomicFailureTransaction failed:", err instanceof Error ? err.message : err);
    return { handledByFirestore: false };
  }
}
async function recordEmailAuditInFirestore(mailDoc) {
  const db = getAdminFirestore();
  if (!db) return;
  try {
    await db.collection("mail").doc(mailDoc.id).set(mailDoc, { merge: true });
  } catch (err) {
    console.warn("Firestore mail audit write skipped:", err instanceof Error ? err.message : err);
  }
}

// src/server/mailer.ts
var dispatchedConfirmationEmails = /* @__PURE__ */ new Set();
async function sendOrderConfirmationEmailOnce(input) {
  const dedupeKey = `${input.orderId}:${input.razorpayPaymentId}`;
  if (dispatchedConfirmationEmails.has(dedupeKey)) {
    return { sent: false, skippedDuplicate: true, provider: "deduplicated" };
  }
  dispatchedConfirmationEmails.add(dedupeKey);
  const itemsRows = (input.items || []).map((item) => {
    const price = item.lineTotal ?? (item.unitPrice || 0) * item.quantity;
    return `<li><strong>${item.name}</strong> &times; ${item.quantity} \u2014 \u20B9${Number(price).toLocaleString("en-IN")}</li>`;
  }).join("");
  const subject = `BALKI TECHNOLOGIES \u2014 Order Confirmed (${input.orderId})`;
  const html = `
    <div style="font-family: Arial, sans-serif; color: #0f172a; max-width: 600px;">
      <h2 style="color: #d97706;">Order Payment Verified & Confirmed</h2>
      <p>Dear ${input.customerName},</p>
      <p>Thank you for ordering from <strong>BALKI TECHNOLOGIES</strong>. Your payment has been cryptographically verified.</p>
      <ul>
        <li><strong>Order Reference:</strong> ${input.orderId}</li>
        <li><strong>Verified Amount:</strong> \u20B9${Number(input.amountInr).toLocaleString("en-IN")} INR</li>
        <li><strong>Payment Status:</strong> ${input.paymentStatus}</li>
        <li><strong>Razorpay Payment ID:</strong> ${input.razorpayPaymentId}</li>
      </ul>
      <h3>Products</h3>
      <ul>${itemsRows}</ul>
      <p>We will notify you with Delhivery priority tracking updates as soon as QC assembly completes.</p>
    </div>
  `.trim();
  const cleanEnv = (v) => {
    const t = (v || "").trim();
    return t.startsWith('"') && t.endsWith('"') || t.startsWith("'") && t.endsWith("'") ? t.slice(1, -1).trim() : t;
  };
  const resendApiKey = cleanEnv(process.env.RESEND_API_KEY);
  const fromEmail = cleanEnv(process.env.EMAIL_FROM) || "orders@balkitechnologies.com";
  let provider = "firestore_audit_queue";
  let delivered = false;
  if (resendApiKey) {
    provider = "resend";
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [input.customerEmail],
          subject,
          html
        })
      });
      delivered = response.ok;
    } catch (err) {
      console.warn("Resend email dispatch error:", err instanceof Error ? err.message : err);
    }
  }
  await recordEmailAuditInFirestore({
    id: `mail_${input.orderId}_${input.razorpayPaymentId}`,
    to: input.customerEmail,
    subject,
    orderId: input.orderId,
    paymentId: input.razorpayPaymentId,
    amountInr: input.amountInr,
    paymentStatus: input.paymentStatus,
    deliveryProvider: provider,
    delivered,
    html,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  });
  return { sent: true, skippedDuplicate: false, provider };
}

// src/server/createApiApp.ts
function isPlaceholderValue(val) {
  if (!val) return true;
  const trimmed = val.trim();
  if (!trimmed) return true;
  const upper = trimmed.toUpperCase();
  return upper.includes("YOUR_TEST_KEY") || upper.includes("YOUR_RAZORPAY") || upper.includes("CHANGE_THIS") || upper.startsWith("MY_") || trimmed === "undefined" || trimmed === "null";
}
function stripWrappingQuotes2(val) {
  if (!val) return "";
  const trimmed = String(val).trim();
  if (trimmed.startsWith('"') && trimmed.endsWith('"') || trimmed.startsWith("'") && trimmed.endsWith("'")) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}
function getRazorpayConfigStatus() {
  const rawKeyId = stripWrappingQuotes2(process.env.RAZORPAY_KEY_ID);
  const rawKeySecret = stripWrappingQuotes2(process.env.RAZORPAY_KEY_SECRET);
  const rawWebhookSecret = stripWrappingQuotes2(process.env.RAZORPAY_WEBHOOK_SECRET);
  const hasValidKeyId = !isPlaceholderValue(rawKeyId) && (rawKeyId.startsWith("rzp_test_") || rawKeyId.startsWith("rzp_live_")) && rawKeyId.length >= 14;
  const hasValidKeySecret = !isPlaceholderValue(rawKeySecret) && rawKeySecret.length >= 12;
  const webhookConfigured = !isPlaceholderValue(rawWebhookSecret) && rawWebhookSecret.length >= 12;
  if (!hasValidKeyId || !hasValidKeySecret) {
    return {
      configured: false,
      mode: "unconfigured",
      keyId: null,
      webhookConfigured
    };
  }
  return {
    configured: true,
    mode: rawKeyId.startsWith("rzp_live_") ? "live" : "test",
    keyId: rawKeyId,
    webhookConfigured
  };
}
function getRazorpayKeySecret() {
  const status = getRazorpayConfigStatus();
  if (!status.configured) return null;
  return stripWrappingQuotes2(process.env.RAZORPAY_KEY_SECRET);
}
function getRazorpayWebhookSecret() {
  const raw = stripWrappingQuotes2(process.env.RAZORPAY_WEBHOOK_SECRET);
  if (isPlaceholderValue(raw) || raw.length < 12) return null;
  return raw;
}
function getRazorpayClient() {
  const status = getRazorpayConfigStatus();
  const secret = getRazorpayKeySecret();
  if (!status.configured || !status.keyId || !secret) return null;
  try {
    return new Razorpay({
      key_id: status.keyId,
      key_secret: secret
    });
  } catch (err) {
    console.warn("Razorpay SDK initialization error:", err);
    return null;
  }
}
function getApprovalThresholdInr() {
  const parsed = Number(process.env.ORDER_APPROVAL_THRESHOLD_INR || 5e3);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 5e3;
}
var EPHEMERAL_FALLBACK_SECRET = crypto.randomBytes(32).toString("hex");
function getOrderSigningSecret() {
  const envSecret = stripWrappingQuotes2(process.env.ORDER_SIGNATURE_SECRET);
  if (!isPlaceholderValue(envSecret) && envSecret.length >= 16) {
    return envSecret;
  }
  const rzpSecret = stripWrappingQuotes2(process.env.RAZORPAY_KEY_SECRET);
  if (!isPlaceholderValue(rzpSecret) && rzpSecret.length >= 12) {
    return rzpSecret;
  }
  return EPHEMERAL_FALLBACK_SECRET;
}
function signOrderToken(payload) {
  const dataB64 = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const sig = crypto.createHmac("sha256", getOrderSigningSecret()).update(dataB64).digest("base64url");
  return `${dataB64}.${sig}`;
}
function verifyOrderToken(token) {
  if (typeof token !== "string" || !token.includes(".")) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [dataB64, sig] = parts;
  if (!dataB64 || !sig) return null;
  try {
    const expected = crypto.createHmac("sha256", getOrderSigningSecret()).update(dataB64).digest("base64url");
    const a = Buffer.from(expected, "utf8");
    const b = Buffer.from(sig, "utf8");
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      return null;
    }
    const parsed = JSON.parse(Buffer.from(dataB64, "base64url").toString("utf8"));
    if (!parsed || typeof parsed.orderId !== "string" || typeof parsed.finalAmount !== "number") {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}
function timingSafeEqualString(aStr, bStr) {
  const a = Buffer.from(aStr, "utf8");
  const b = Buffer.from(bStr, "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
function verifyRazorpayPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature, secretOverride) {
  const secret = secretOverride || getRazorpayKeySecret();
  if (!secret || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return false;
  }
  try {
    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
    return timingSafeEqualString(expected, razorpaySignature.trim());
  } catch {
    return false;
  }
}
function verifyRazorpayWebhookSignature(rawBody, signature, webhookSecretOverride) {
  const secret = webhookSecretOverride || getRazorpayWebhookSecret();
  if (!secret || !signature) return false;
  try {
    const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
    return timingSafeEqualString(expected, signature.trim());
  } catch {
    return false;
  }
}
var SERVER_SENSITIVE_PATTERN = /(rzp_(live|test)_[A-Za-z0-9]+|whsec_[A-Za-z0-9]+|-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----)/g;
function extractServerErrorMessage(input, fallback = "An unexpected server error occurred.", depth = 0) {
  if (depth > 5 || input === null || input === void 0) {
    return fallback;
  }
  if (typeof input === "string") {
    const cleaned = input.replace(SERVER_SENSITIVE_PATTERN, "[REDACTED]").trim();
    return cleaned && cleaned !== "[object Object]" ? cleaned : fallback;
  }
  if (typeof input === "number" || typeof input === "boolean") {
    return String(input);
  }
  if (Array.isArray(input)) {
    const parts = input.map((v) => extractServerErrorMessage(v, "", depth + 1)).filter(Boolean);
    return parts.length > 0 ? parts.join("; ") : fallback;
  }
  if (input instanceof Error) {
    const errAny = input;
    if (errAny?.error) {
      const nested = extractServerErrorMessage(errAny.error, "", depth + 1);
      if (nested) return nested;
    }
    if (errAny?.response?.data) {
      const nested = extractServerErrorMessage(errAny.response.data, "", depth + 1);
      if (nested) return nested;
    }
    return extractServerErrorMessage(input.message, "", depth + 1) || fallback;
  }
  if (typeof input === "object") {
    const obj = input;
    const candidateKeys = ["error", "description", "message", "reason", "response", "data", "details"];
    for (const key of candidateKeys) {
      if (obj[key] !== void 0 && obj[key] !== null) {
        const extracted = extractServerErrorMessage(obj[key], "", depth + 1);
        if (extracted) return extracted;
      }
    }
  }
  return fallback;
}
function logPaymentDiagnostic(stage, details = {}) {
  const payload = {
    stage,
    env: process.env.VERCEL ? "vercel" : process.env.NODE_ENV || "development",
    ...details,
    ts: (/* @__PURE__ */ new Date()).toISOString()
  };
  console.info("[PaymentDiagnostic]", JSON.stringify(payload));
}
function sendJsonError(res, status, message, code, extra = {}) {
  const safeMessage = extractServerErrorMessage(message, "Request could not be processed.");
  const requestId = typeof res.locals?.requestId === "string" ? res.locals.requestId : void 0;
  return res.status(status).json({
    success: false,
    message: safeMessage,
    error: safeMessage,
    code,
    ...requestId ? { requestId } : {},
    ...extra
  });
}
function sendJsonSuccess(res, status, message, data = {}) {
  const requestId = typeof res.locals?.requestId === "string" ? res.locals.requestId : void 0;
  return res.status(status).json({
    success: true,
    message,
    ...requestId ? { requestId } : {},
    data,
    ...data
  });
}
function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
function isValidPhone(phone) {
  if (typeof phone !== "string") return false;
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}
function normalizeAddress(raw) {
  if (!raw || typeof raw !== "object") return null;
  const street = typeof raw.street === "string" ? raw.street.trim() : "";
  const city = typeof raw.city === "string" ? raw.city.trim() : "";
  const state = typeof raw.state === "string" ? raw.state.trim() : "";
  const pincode = typeof raw.pincode === "string" ? raw.pincode.trim() : String(raw.pincode || "").trim();
  if (!street || !city || !state || !/^\d{6}$/.test(pincode)) {
    return null;
  }
  return { street, city, state, pincode };
}
var products = [...INITIAL_PRODUCTS];
var rentals = [...INITIAL_RENTALS];
var courses = [...INITIAL_COURSES];
var inventory = [...INITIAL_INVENTORY];
var clientReviews = [...initialClientReviews];
var caseStudies = [...initialCaseStudyBlogs];
var supportTickets = [...INITIAL_SUPPORT_TICKETS];
var serverCart = { items: [], appliedCoupon: void 0 };
var orders = [];
var orderRequests = [];
var paymentTransactions = [];
var notifications = [];
var adminUsers = [
  {
    adminId: "balki-super-admin",
    email: "kartikks1205@gmail.com",
    displayName: "Balki Technologies Operations Admin",
    role: "super_admin",
    permissions: ["manage_orders", "approve_requests", "update_status", "view_analytics", "manage_inventory"],
    createdAt: "2026-11-01T00:00:00.000Z",
    lastActiveAt: (/* @__PURE__ */ new Date()).toISOString()
  }
];
var rentalBookings = [];
var userProgress = { ...INITIAL_USER_PROGRESS };
var quoteRequests = [];
var internshipApplications = [];
var TRUSTED_ADMIN_EMAILS = ["kartikks1205@gmail.com"];
var recentSubmissions = /* @__PURE__ */ new Map();
var processedPaymentIds = /* @__PURE__ */ new Map();
var processedWebhookEvents = /* @__PURE__ */ new Set();
function generateOrderTracking(_orderId, customerCity = "Hyderabad", customerState = "Telangana", paymentMethod = "UPI", schoolName) {
  const awb = `DELHIVERY-B2B-${Math.floor(1e7 + Math.random() * 9e7)}`;
  const trackingNumber = `BALKI-EXP-${Math.floor(1e7 + Math.random() * 9e7)}IN`;
  const deliveryOtp = Math.floor(1e3 + Math.random() * 9e3).toString();
  const now = /* @__PURE__ */ new Date();
  const isPO = paymentMethod === "SchoolPO";
  const checkpoints = [
    {
      id: `chk-1-${Date.now()}`,
      status: "order_placed",
      title: isPO ? "School Purchase Order Registered (Net 30)" : "Order Placed & Staged for Payment",
      description: isPO ? `Official institutional purchase order registered for ${schoolName || "Partner School"}. Allocation confirmed.` : "Order verified on backend and staged for secure payment capture.",
      location: "Balki Corporate Fulfillment, Financial District, Hyderabad",
      timestamp: now.toISOString(),
      completed: true,
      current: false
    },
    {
      id: `chk-2-${Date.now()}`,
      status: "qc_assembly",
      title: "ATL Kit BOM Assembly & Quality Check",
      description: "Zero-defect inspection, sensor calibration, component flashing, and anti-static packaging.",
      location: "Balki Hardware Fabrication & QA Lab, Hyderabad",
      timestamp: new Date(now.getTime() + 15 * 60 * 1e3).toISOString(),
      completed: false,
      current: true
    },
    {
      id: `chk-3-${Date.now()}`,
      status: "dispatched",
      title: "Dispatched with Delhivery B2B Priority Logistics",
      description: `Consignment sealed and handed over to carrier. Waybill #${awb} allocated with 100% transit insurance.`,
      location: "Shamshabad Air Freight & Cargo Hub, Hyderabad",
      timestamp: new Date(now.getTime() + 18 * 3600 * 1e3).toISOString(),
      completed: false,
      current: false
    },
    {
      id: `chk-4-${Date.now()}`,
      status: "in_transit",
      title: `In Transit to ${customerCity} Transshipment Facility`,
      description: "Regional line-haul container in transit. Real-time temperature & shock sensors nominal.",
      location: `${customerCity} Logistics Terminal, ${customerState}`,
      timestamp: new Date(now.getTime() + 42 * 3600 * 1e3).toISOString(),
      completed: false,
      current: false
    },
    {
      id: `chk-5-${Date.now()}`,
      status: "out_for_delivery",
      title: "Out for School Lab Delivery & On-Site Handover",
      description: `Dispatched in local logistics vehicle. School gate handover requires 4-digit Security OTP (${deliveryOtp}).`,
      location: `Local Delivery Route - ${customerCity}`,
      timestamp: new Date(now.getTime() + 66 * 3600 * 1e3).toISOString(),
      completed: false,
      current: false
    },
    {
      id: `chk-6-${Date.now()}`,
      status: "delivered",
      title: "Delivered & ATL Lab Installation Scheduled",
      description: "Consignment successfully handed over to school ATL in-charge. Hands-on faculty demo scheduled.",
      location: schoolName || `${customerCity} Innovation Lab`,
      timestamp: new Date(now.getTime() + 72 * 3600 * 1e3).toISOString(),
      completed: false,
      current: false
    }
  ];
  const trackingDetails = {
    courierPartner: "Delhivery B2B Logistics (Priority STEM Express)",
    awbNumber: awb,
    dispatchDate: new Date(now.getTime() + 18 * 3600 * 1e3).toISOString(),
    expectedDeliveryDate: new Date(now.getTime() + 72 * 3600 * 1e3).toISOString(),
    originHub: "Balki Central Fulfillment, Financial District, Hyderabad",
    destinationHub: `${customerCity} Regional Delivery Center, ${customerState}`,
    deliverySecurityOtp: deliveryOtp,
    assignedFieldEngineer: {
      name: "Ramesh Verma",
      phone: "+91 90711 99139",
      badge: "Senior ATL Robotics Specialist"
    },
    liveCoordinates: {
      lat: 17.4435,
      lng: 78.3842
    },
    checkpoints
  };
  return { trackingNumber, deliveryOtp, trackingDetails };
}
function verifyAdminAccess(req) {
  const adminKey = req.headers["x-admin-key"];
  const adminEmail = req.headers["x-admin-email"];
  const authHeader = req.headers.authorization;
  if (typeof adminEmail === "string" && TRUSTED_ADMIN_EMAILS.includes(adminEmail.toLowerCase().trim())) {
    return { authorized: true, email: adminEmail.trim(), role: "super_admin" };
  }
  if (adminKey === "balki-super-admin-key-2026") {
    return { authorized: true, email: "kartikks1205@gmail.com", role: "super_admin" };
  }
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    if (token === "balki-super-admin-token" || TRUSTED_ADMIN_EMAILS.some((e) => token.toLowerCase().includes(e))) {
      return { authorized: true, email: "kartikks1205@gmail.com", role: "super_admin" };
    }
  }
  return { authorized: false };
}
function calculateTrustedOrderAmount(rawItems, couponCode) {
  if (!rawItems || !Array.isArray(rawItems) || rawItems.length === 0) {
    return { success: false, code: "EMPTY_ITEMS", error: "Items array is required for price calculation." };
  }
  if (rawItems.length > 100) {
    return { success: false, code: "TOO_MANY_ITEMS", error: "Maximum 100 line items per checkout." };
  }
  const threshold = getApprovalThresholdInr();
  let subtotal = 0;
  const itemBreakdown = [];
  for (const it of rawItems) {
    if (!it || typeof it !== "object") {
      return { success: false, code: "INVALID_ITEM", error: "Each item must be a valid object." };
    }
    const searchId = it.productId || it.id || it.product?.id;
    const searchSku = it.sku || it.product?.sku;
    const prod = products.find((p) => searchId && p.id === searchId || searchSku && p.sku === searchSku);
    if (!prod) {
      return {
        success: false,
        code: "PRODUCT_NOT_FOUND",
        error: `Product not found in catalog: ${searchId || searchSku || "Unknown"}`
      };
    }
    const rawQty = Number(it.quantity);
    if (!Number.isInteger(rawQty) || rawQty <= 0 || rawQty > 1e3) {
      return {
        success: false,
        code: "INVALID_QUANTITY",
        error: `Invalid quantity for "${prod.name}". Quantity must be a positive integer.`
      };
    }
    if (rawQty > prod.stock) {
      return {
        success: false,
        code: "INSUFFICIENT_STOCK",
        error: `Insufficient stock for "${prod.name}". Available in lab: ${prod.stock}, requested: ${rawQty}.`,
        availableStock: prod.stock
      };
    }
    const lineTotal = prod.price * rawQty;
    subtotal += lineTotal;
    itemBreakdown.push({
      productId: prod.id,
      sku: prod.sku,
      name: prod.name,
      unitPrice: prod.price,
      quantity: rawQty,
      lineTotal,
      image: prod.image
    });
  }
  let discount = 0;
  const cleanCoupon = typeof couponCode === "string" ? couponCode.trim().toUpperCase() : "";
  if (cleanCoupon === "ATL2026") {
    discount = Math.min(subtotal, 500);
  } else if (cleanCoupon === "NEP20") {
    discount = Math.min(subtotal, Math.round(subtotal * 0.2));
  } else if (cleanCoupon === "BALKI10") {
    discount = Math.min(subtotal, Math.round(subtotal * 0.1));
  } else if (cleanCoupon === "FREESHIP") {
    discount = 150;
  }
  const taxAmount = Number((subtotal * 0.18).toFixed(2));
  const baseShipping = subtotal > 1500 || subtotal === 0 ? 0 : 150;
  const shippingCharges = cleanCoupon === "FREESHIP" ? 0 : baseShipping;
  const finalAmount = Number(
    Math.max(0, subtotal + taxAmount + shippingCharges - (cleanCoupon === "FREESHIP" ? 0 : discount)).toFixed(2)
  );
  const requiresApproval = finalAmount >= threshold;
  const orderCategory = requiresApproval ? "LARGE_ORDER" : "SMALL_ORDER";
  return {
    success: true,
    data: {
      subtotal,
      taxAmount,
      shippingCharges,
      discount,
      finalAmount,
      currency: "INR",
      requiresApproval,
      orderCategory,
      threshold,
      items: itemBreakdown
    }
  };
}
function hydrateOrderFromSignedToken(tokenData) {
  const fullItems = tokenData.items.map((it) => {
    const prod = products.find((p) => p.id === it.productId);
    return prod ? { product: prod, quantity: it.quantity } : null;
  }).filter((x) => x !== null);
  const { trackingNumber, deliveryOtp, trackingDetails } = generateOrderTracking(
    tokenData.orderId,
    tokenData.deliveryAddress.city,
    tokenData.deliveryAddress.state,
    "Razorpay",
    tokenData.schoolName
  );
  return {
    id: tokenData.orderId,
    orderId: tokenData.orderId,
    userId: tokenData.customerId,
    customerId: tokenData.customerId,
    customerName: tokenData.customerName,
    customerEmail: tokenData.customerEmail,
    customerPhone: tokenData.customerPhone,
    schoolName: tokenData.schoolName,
    gstin: tokenData.gstin,
    deliveryAddress: tokenData.deliveryAddress,
    shippingAddress: tokenData.deliveryAddress,
    products: fullItems,
    items: fullItems,
    subtotal: tokenData.subtotal,
    taxAmount: tokenData.taxAmount,
    gstAmount: tokenData.taxAmount,
    shippingCharges: tokenData.shippingCharges,
    shippingFee: tokenData.shippingCharges,
    discount: tokenData.discount,
    finalAmount: tokenData.finalAmount,
    serverVerifiedTotal: tokenData.finalAmount,
    totalAmount: tokenData.finalAmount,
    currency: "INR",
    paymentMethod: "Razorpay",
    paymentStatus: "Payment Pending",
    orderStatus: "order_placed",
    approvalStatus: "approved",
    razorpayOrderId: tokenData.razorpayOrderId,
    trackingNumber: tokenData.trackingNumber || trackingNumber,
    courierName: "Delhivery B2B Priority",
    deliveryOtp: tokenData.deliveryOtp || deliveryOtp,
    trackingDetails,
    createdAt: new Date(tokenData.iat).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
}
var cachedApiApp = null;
function createApiApp() {
  const app = express();
  app.use("/api", (req, res, next) => {
    const incomingReqId = typeof req.headers["x-vercel-id"] === "string" && req.headers["x-vercel-id"].trim() || typeof req.headers["x-request-id"] === "string" && req.headers["x-request-id"].trim() || `req_${crypto.randomBytes(6).toString("hex")}`;
    res.locals.requestId = incomingReqId;
    res.setHeader("X-Request-Id", incomingReqId);
    const allowedOrigins = [
      "https://www.balkitechnologies.com",
      "https://balkitechnologies.com",
      process.env.APP_URL || ""
    ].filter(Boolean);
    const origin = req.headers.origin;
    if (origin && (allowedOrigins.includes(origin) || origin.includes("localhost") || origin.includes("127.0.0.1") || origin.endsWith(".vercel.app"))) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Vary", "Origin");
    }
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Admin-Email, X-Admin-Key, X-Razorpay-Signature, X-Razorpay-Event-Id, X-Request-Id");
    res.setHeader("Access-Control-Expose-Headers", "X-Request-Id");
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    if (req.method === "OPTIONS") {
      return res.status(204).end();
    }
    next();
  });
  const rawWebhookBodyParser = (req, res, next) => {
    if (Buffer.isBuffer(req.body) || Buffer.isBuffer(req.rawBody) || typeof req.rawBody === "string" || typeof req.body === "string") {
      return next();
    }
    return express.raw({ type: "*/*", limit: "1mb" })(req, res, next);
  };
  app.post(
    "/api/razorpay/webhook",
    rawWebhookBodyParser,
    async (req, res) => {
      try {
        const webhookSecret = getRazorpayWebhookSecret();
        if (!webhookSecret) {
          logPaymentDiagnostic("webhook_secret_missing");
          return sendJsonError(
            res,
            503,
            "Razorpay webhook secret is not configured on the server.",
            "RAZORPAY_WEBHOOK_NOT_CONFIGURED"
          );
        }
        const signature = req.headers["x-razorpay-signature"];
        if (typeof signature !== "string" || !signature.trim()) {
          logPaymentDiagnostic("webhook_signature_missing");
          return sendJsonError(res, 400, "Missing X-Razorpay-Signature header.", "MISSING_WEBHOOK_SIGNATURE");
        }
        let rawBuffer = null;
        if (Buffer.isBuffer(req.body)) {
          rawBuffer = req.body;
        } else if (Buffer.isBuffer(req.rawBody)) {
          rawBuffer = req.rawBody;
        } else if (typeof req.rawBody === "string") {
          rawBuffer = Buffer.from(req.rawBody, "utf8");
        } else if (typeof req.body === "string") {
          rawBuffer = Buffer.from(req.body, "utf8");
        }
        if (!rawBuffer) {
          logPaymentDiagnostic("webhook_raw_body_missing", { bodyType: typeof req.body });
          return sendJsonError(
            res,
            400,
            "Raw HTTP request body buffer is required for Razorpay webhook signature verification.",
            "INVALID_RAW_WEBHOOK_BODY"
          );
        }
        if (!verifyRazorpayWebhookSignature(rawBuffer, signature, webhookSecret)) {
          logPaymentDiagnostic("webhook_signature_invalid");
          return sendJsonError(res, 401, "Invalid Razorpay webhook signature.", "INVALID_WEBHOOK_SIGNATURE");
        }
        let event;
        try {
          event = JSON.parse(rawBuffer.toString("utf8"));
        } catch {
          return sendJsonError(res, 400, "Malformed JSON payload inside verified webhook body.", "INVALID_WEBHOOK_JSON");
        }
        if (!event || typeof event !== "object") {
          return sendJsonError(res, 400, "Unexpected webhook payload structure.", "INVALID_WEBHOOK_PAYLOAD");
        }
        const eventName = String(event.event || "unknown");
        const paymentEntity = event.payload?.payment?.entity;
        const orderEntity = event.payload?.order?.entity;
        const headerEventId = typeof req.headers["x-razorpay-event-id"] === "string" ? req.headers["x-razorpay-event-id"].trim() : "";
        const eventId = headerEventId || `${eventName}:${paymentEntity?.id || orderEntity?.id || "unknown"}`;
        if (processedWebhookEvents.has(eventId)) {
          return sendJsonSuccess(res, 200, "Webhook event already processed (idempotent)", {
            eventId,
            event: eventName,
            duplicate: true
          });
        }
        const rzpOrderId = String(paymentEntity?.order_id || orderEntity?.id || "").trim();
        const rzpPaymentId = String(paymentEntity?.id || "").trim();
        const paymentMethod = paymentEntity?.method ? String(paymentEntity.method) : "Razorpay";
        const capturedAmountPaise = typeof paymentEntity?.amount === "number" ? paymentEntity.amount : typeof orderEntity?.amount_paid === "number" ? orderEntity.amount_paid : null;
        const eventCurrency = paymentEntity?.currency || orderEntity?.currency || "INR";
        const balkiOrderId = String(
          paymentEntity?.notes?.balkiOrderId || paymentEntity?.notes?.internalOrderId || orderEntity?.notes?.balkiOrderId || orderEntity?.notes?.internalOrderId || orderEntity?.receipt || ""
        ).trim();
        const supportedEvents = /* @__PURE__ */ new Set(["order.paid", "payment.captured", "payment.failed"]);
        if (!supportedEvents.has(eventName)) {
          processedWebhookEvents.add(eventId);
          return sendJsonSuccess(res, 200, `Webhook event "${eventName}" acknowledged`, {
            eventId,
            event: eventName,
            ignored: true
          });
        }
        if (eventName === "payment.captured" || eventName === "order.paid") {
          const fsResult = await runAtomicCaptureTransaction({
            orderId: balkiOrderId || null,
            razorpayOrderId: rzpOrderId,
            razorpayPaymentId: rzpPaymentId || `pay_evt_${eventId}`,
            paymentMethod,
            capturedAmountPaise,
            currency: String(eventCurrency),
            eventId,
            eventName,
            source: "webhook"
          });
          if (fsResult.duplicateEvent) {
            processedWebhookEvents.add(eventId);
            return sendJsonSuccess(res, 200, "Webhook event already processed in Firestore (idempotent)", {
              eventId,
              event: eventName,
              duplicate: true
            });
          }
          if (fsResult.currencyMismatch) {
            processedWebhookEvents.add(eventId);
            return sendJsonError(res, 400, "Webhook currency mismatch; INR required.", "INVALID_CURRENCY");
          }
          if (fsResult.amountMismatch) {
            processedWebhookEvents.add(eventId);
            return sendJsonError(
              res,
              400,
              `Webhook payment amount mismatch (paid ${fsResult.actualPaise} paise, expected ${fsResult.expectedPaise} paise).`,
              "PAYMENT_AMOUNT_MISMATCH"
            );
          }
          let matchingOrder2 = orders.find(
            (o) => balkiOrderId && (o.id === balkiOrderId || o.orderId === balkiOrderId) || rzpOrderId && o.razorpayOrderId === rzpOrderId
          );
          if (matchingOrder2) {
            const expectedPaise = Math.round(
              Number(matchingOrder2.serverVerifiedTotal ?? matchingOrder2.finalAmount ?? matchingOrder2.totalAmount) * 100
            );
            if (String(eventCurrency).toUpperCase() !== "INR") {
              processedWebhookEvents.add(eventId);
              return sendJsonError(res, 400, "Webhook currency mismatch; INR required.", "INVALID_CURRENCY");
            }
            if (typeof capturedAmountPaise === "number" && capturedAmountPaise !== expectedPaise) {
              processedWebhookEvents.add(eventId);
              return sendJsonError(
                res,
                400,
                `Webhook payment amount mismatch (paid \u20B9${(capturedAmountPaise / 100).toFixed(2)}, expected \u20B9${(expectedPaise / 100).toFixed(2)}).`,
                "PAYMENT_AMOUNT_MISMATCH"
              );
            }
            if (matchingOrder2.paymentStatus === "Paid") {
              if (rzpPaymentId && matchingOrder2.razorpayPaymentId && matchingOrder2.razorpayPaymentId !== rzpPaymentId) {
                processedWebhookEvents.add(eventId);
                return sendJsonError(
                  res,
                  409,
                  `Order ${matchingOrder2.id} is already paid with ${matchingOrder2.razorpayPaymentId}. Conflicting payment ignored.`,
                  "DUPLICATE_PAYMENT_DETECTED"
                );
              }
            } else {
              matchingOrder2.paymentStatus = "Paid";
              matchingOrder2.normalizedPaymentStatus = "paid";
              matchingOrder2.orderStatus = matchingOrder2.orderStatus === "delivered" ? "delivered" : "qc_assembly";
              matchingOrder2.deliveryStatus = mapNormalizedDeliveryStatus(matchingOrder2.orderStatus);
              matchingOrder2.razorpayOrderId = rzpOrderId || matchingOrder2.razorpayOrderId;
              matchingOrder2.razorpayPaymentId = rzpPaymentId || matchingOrder2.razorpayPaymentId;
              matchingOrder2.paymentMethod = paymentMethod || matchingOrder2.paymentMethod || "Razorpay";
              matchingOrder2.paidAt = (/* @__PURE__ */ new Date()).toISOString();
              matchingOrder2.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
              if (rzpPaymentId) {
                processedPaymentIds.set(rzpPaymentId, matchingOrder2.id);
              }
              paymentTransactions.unshift({
                transactionId: `txn_wh_${Date.now()}`,
                orderId: matchingOrder2.id,
                customerId: matchingOrder2.customerId || matchingOrder2.userId || "client",
                amount: matchingOrder2.totalAmount,
                currency: "INR",
                paymentMethod: `Razorpay Webhook (${paymentMethod})`,
                transactionType: "payment",
                gatewayReference: rzpPaymentId || rzpOrderId || eventId,
                status: "SUCCESS",
                metadata: { eventName, eventId },
                createdAt: (/* @__PURE__ */ new Date()).toISOString()
              });
            }
          }
          const effectiveOrder = fsResult.order || matchingOrder2;
          const shouldEmail = Boolean(effectiveOrder) && (fsResult.handledByFirestore ? Boolean(fsResult.shouldSendConfirmation) : !effectiveOrder.confirmationNotificationSent);
          if (effectiveOrder && shouldEmail) {
            if (matchingOrder2) {
              matchingOrder2.confirmationNotificationSent = true;
            }
            if (!fsResult.handledByFirestore) {
              notifications.unshift({
                notificationId: `notif_wh_${Date.now()}`,
                recipientId: effectiveOrder.customerId || effectiveOrder.userId || "client",
                recipientEmail: effectiveOrder.customerEmail,
                title: `Payment Confirmed: Order ${effectiveOrder.id}`,
                message: `Your payment of INR ${Number(effectiveOrder.serverVerifiedTotal ?? effectiveOrder.totalAmount).toLocaleString("en-IN")} has been confirmed via Razorpay webhook.`,
                type: "order_status",
                orderId: effectiveOrder.id,
                read: false,
                createdAt: (/* @__PURE__ */ new Date()).toISOString()
              });
            }
            await sendOrderConfirmationEmailOnce({
              orderId: effectiveOrder.id || effectiveOrder.orderId,
              customerName: effectiveOrder.customerName || "Valued Client",
              customerEmail: effectiveOrder.customerEmail,
              amountInr: Number(effectiveOrder.serverVerifiedTotal ?? effectiveOrder.finalAmount ?? effectiveOrder.totalAmount ?? 0),
              paymentStatus: "Paid",
              razorpayPaymentId: rzpPaymentId || effectiveOrder.razorpayPaymentId || eventId,
              items: (effectiveOrder.items || []).map((it) => ({
                name: it.product?.name || it.name || "STEM Hardware Item",
                quantity: it.quantity || 1,
                unitPrice: it.product?.price || it.unitPrice || 0
              }))
            });
          }
          processedWebhookEvents.add(eventId);
          logPaymentDiagnostic("webhook_capture_processed", {
            event: eventName,
            orderId: effectiveOrder?.id || balkiOrderId || null,
            razorpayOrderId: rzpOrderId || null,
            orderMatched: Boolean(effectiveOrder),
            firestoreSynced: fsResult.handledByFirestore
          });
          return sendJsonSuccess(res, 200, `Webhook event "${eventName}" processed`, {
            eventId,
            event: eventName,
            orderMatched: Boolean(effectiveOrder),
            firestoreSynced: fsResult.handledByFirestore
          });
        }
        const errorDesc = extractServerErrorMessage(
          paymentEntity?.error_description || paymentEntity?.error_reason,
          "Payment failed at Razorpay gateway."
        );
        const errorCode = String(paymentEntity?.error_code || "PAYMENT_FAILED");
        const fsFail = await runAtomicFailureTransaction({
          orderId: balkiOrderId || null,
          razorpayOrderId: rzpOrderId || null,
          razorpayPaymentId: rzpPaymentId || null,
          errorCode,
          errorDescription: errorDesc,
          eventId,
          eventName
        });
        if (fsFail.duplicateEvent) {
          processedWebhookEvents.add(eventId);
          return sendJsonSuccess(res, 200, "Webhook failure event already processed (idempotent)", {
            eventId,
            event: eventName,
            duplicate: true
          });
        }
        const matchingOrder = orders.find(
          (o) => balkiOrderId && (o.id === balkiOrderId || o.orderId === balkiOrderId) || rzpOrderId && o.razorpayOrderId === rzpOrderId
        );
        let ignoredBecauseAlreadyPaid = Boolean(fsFail.ignoredAlreadyPaid);
        if (matchingOrder) {
          if (matchingOrder.paymentStatus === "Paid") {
            ignoredBecauseAlreadyPaid = true;
          } else {
            matchingOrder.paymentStatus = "Failed";
            matchingOrder.normalizedPaymentStatus = "failed";
            matchingOrder.lastPaymentError = errorDesc;
            matchingOrder.failedPaymentAttempts = [
              ...matchingOrder.failedPaymentAttempts || [],
              {
                paymentId: rzpPaymentId || null,
                errorCode,
                description: errorDesc,
                timestamp: (/* @__PURE__ */ new Date()).toISOString()
              }
            ];
            matchingOrder.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
          }
        }
        processedWebhookEvents.add(eventId);
        logPaymentDiagnostic("webhook_failure_processed", {
          event: eventName,
          orderId: matchingOrder?.id || balkiOrderId || null,
          razorpayOrderId: rzpOrderId || null,
          ignoredBecauseAlreadyPaid,
          firestoreSynced: fsFail.handledByFirestore
        });
        return sendJsonSuccess(res, 200, `Webhook event "${eventName}" processed`, {
          eventId,
          event: eventName,
          orderMatched: Boolean(fsFail.order || matchingOrder),
          ignoredBecauseAlreadyPaid,
          firestoreSynced: fsFail.handledByFirestore
        });
      } catch (err) {
        logPaymentDiagnostic("webhook_error", {
          reason: extractServerErrorMessage(err, "Internal server error processing Razorpay webhook.")
        });
        return sendJsonError(
          res,
          500,
          "Internal server error processing Razorpay webhook.",
          "WEBHOOK_PROCESSING_ERROR"
        );
      }
    }
  );
  app.use(express.json({ limit: "1mb" }));
  app.get(["/api", "/api/index", "/api/health"], (_req, res) => {
    const rzpStatus = getRazorpayConfigStatus();
    const fsStatus = getAdminFirestoreStatus();
    sendJsonSuccess(res, 200, "Balki Technologies API operational", {
      status: "ok",
      service: "Balki Technologies STEM Platform API",
      environment: process.env.VERCEL ? "vercel-serverless" : process.env.NODE_ENV || "development",
      razorpayConfigured: rzpStatus.configured,
      razorpayMode: rzpStatus.mode,
      webhookConfigured: rzpStatus.webhookConfigured,
      firestoreAdminConfigured: fsStatus.configured,
      firestoreAdminReason: fsStatus.reason,
      approvalThresholdInr: getApprovalThresholdInr(),
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  });
  app.get("/api/atl-packages", (_req, res) => {
    res.json(ATL_QUOTATION_PACKAGES);
  });
  app.get("/api/products", (req, res) => {
    const { category, grade, search } = req.query;
    let filtered = [...products];
    if (category && category !== "all") {
      filtered = filtered.filter((p) => p.category === category);
    }
    if (grade && grade !== "All Grades") {
      filtered = filtered.filter((p) => p.gradeLevel === grade || p.gradeLevel === "All Grades");
    }
    if (search && typeof search === "string") {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (p) => p.name.toLowerCase().includes(q) || p.shortDesc.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
      );
    }
    res.json(filtered);
  });
  app.get("/api/products/:id", (req, res) => {
    const product = products.find((p) => p.id === req.params.id);
    if (!product) {
      return sendJsonError(res, 404, "Product not found", "PRODUCT_NOT_FOUND");
    }
    res.json(product);
  });
  app.get("/api/rentals", (_req, res) => {
    res.json(rentals);
  });
  app.post("/api/rentals/book", (req, res) => {
    const { equipmentId, userName, userEmail, userPhone, institutionName, startDate, endDate, totalDays, rentalFee, depositFee } = req.body || {};
    const equipment = rentals.find((r) => r.id === equipmentId);
    if (!equipment) {
      return sendJsonError(res, 404, "Equipment not found", "EQUIPMENT_NOT_FOUND");
    }
    if (equipment.availableUnits <= 0) {
      return sendJsonError(res, 400, "Selected equipment is currently fully booked", "EQUIPMENT_UNAVAILABLE");
    }
    equipment.availableUnits -= 1;
    const newBooking = {
      id: `RENT-${Date.now().toString().slice(-6)}`,
      equipmentId,
      equipmentName: equipment.name,
      userName,
      userEmail,
      userPhone,
      institutionName,
      startDate,
      endDate,
      totalDays: Number(totalDays),
      rentalFee: Number(rentalFee),
      depositFee: Number(depositFee),
      totalAmount: Number(rentalFee) + Number(depositFee),
      status: "Confirmed",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    rentalBookings.unshift(newBooking);
    res.status(201).json(newBooking);
  });
  app.get("/api/rentals/bookings", (_req, res) => {
    res.json(rentalBookings);
  });
  app.get("/api/courses", (_req, res) => {
    res.json(courses);
  });
  app.get("/api/courses/:id", (req, res) => {
    const course = courses.find((c) => c.id === req.params.id);
    if (!course) {
      return sendJsonError(res, 404, "Course not found", "COURSE_NOT_FOUND");
    }
    res.json(course);
  });
  app.post("/api/courses/:id/like", (req, res) => {
    const course = courses.find((c) => c.id === req.params.id);
    if (!course) {
      return sendJsonError(res, 404, "Course not found", "COURSE_NOT_FOUND");
    }
    const { isLiked } = req.body || {};
    if (typeof isLiked === "boolean") {
      course.isLiked = isLiked;
      course.likesCount = (course.likesCount || 0) + (isLiked ? 1 : -1);
      if (course.likesCount < 0) course.likesCount = 0;
    } else {
      course.isLiked = !course.isLiked;
      course.likesCount = (course.likesCount || 0) + (course.isLiked ? 1 : -1);
      if (course.likesCount < 0) course.likesCount = 0;
    }
    if (!userProgress.likedCourseIds) {
      userProgress.likedCourseIds = [];
    }
    if (course.isLiked && !userProgress.likedCourseIds.includes(course.id)) {
      userProgress.likedCourseIds.push(course.id);
    } else if (!course.isLiked) {
      userProgress.likedCourseIds = userProgress.likedCourseIds.filter((id) => id !== course.id);
    }
    res.json({ success: true, course, likedCourseIds: userProgress.likedCourseIds });
  });
  app.get("/api/cart", (_req, res) => {
    let subtotal = 0;
    const stockWarnings = [];
    serverCart.items = serverCart.items.map((it) => {
      const prod = products.find((p) => p.id === it.product.id || p.sku === it.product.sku);
      if (prod) {
        if (prod.stock <= 0) {
          stockWarnings.push(`"${prod.name}" is currently out of stock.`);
        } else if (it.quantity > prod.stock) {
          stockWarnings.push(`Only ${prod.stock} units available for "${prod.name}" (requested ${it.quantity}).`);
          return { ...it, quantity: prod.stock };
        }
        return { ...it, product: prod };
      }
      return it;
    });
    for (const it of serverCart.items) {
      subtotal += it.product.price * it.quantity;
    }
    let discount = 0;
    if (serverCart.appliedCoupon === "ATL2026") {
      discount = Math.min(subtotal, 500);
    } else if (serverCart.appliedCoupon === "NEP20") {
      discount = Math.min(subtotal, Math.round(subtotal * 0.2));
    } else if (serverCart.appliedCoupon === "BALKI10") {
      discount = Math.min(subtotal, Math.round(subtotal * 0.1));
    } else if (serverCart.appliedCoupon === "FREESHIP") {
      discount = 150;
    }
    const gstAmount = Number((subtotal * 0.18).toFixed(2));
    const baseShipping = subtotal > 1500 || subtotal === 0 ? 0 : 150;
    const shippingFee = serverCart.appliedCoupon === "FREESHIP" ? 0 : baseShipping;
    const total = Number(Math.max(0, subtotal + gstAmount + shippingFee - (serverCart.appliedCoupon === "FREESHIP" ? 0 : discount)).toFixed(2));
    const payload = {
      items: serverCart.items,
      subtotal,
      gstAmount,
      shippingFee,
      discount,
      appliedCoupon: serverCart.appliedCoupon,
      total,
      stockWarnings
    };
    res.json(payload);
  });
  app.post("/api/cart/items", (req, res) => {
    const { productId, quantity = 1 } = req.body || {};
    const prod = products.find((p) => p.id === productId || p.sku === productId);
    if (!prod) {
      return sendJsonError(res, 404, "Product not found", "PRODUCT_NOT_FOUND");
    }
    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty <= 0) {
      return sendJsonError(res, 400, "Quantity must be a positive integer", "INVALID_QUANTITY");
    }
    const existing = serverCart.items.find((i) => i.product.id === prod.id || i.product.sku === prod.sku);
    const newQty = existing ? existing.quantity + qty : qty;
    if (newQty > prod.stock) {
      return sendJsonError(
        res,
        400,
        `Insufficient stock. Only ${prod.stock} units available for ${prod.name}.`,
        "INSUFFICIENT_STOCK",
        { availableStock: prod.stock }
      );
    }
    if (existing) {
      existing.quantity = newQty;
    } else {
      serverCart.items.push({ product: prod, quantity: newQty });
    }
    res.status(201).json({ success: true, cart: serverCart });
  });
  app.put("/api/cart/items/:productId", (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body || {};
    const prod = products.find((p) => p.id === productId || p.sku === productId);
    if (!prod) {
      return sendJsonError(res, 404, "Product not found", "PRODUCT_NOT_FOUND");
    }
    if (typeof quantity !== "number" || !Number.isInteger(quantity) || quantity < 0) {
      return sendJsonError(res, 400, "Valid non-negative integer quantity required", "INVALID_QUANTITY");
    }
    if (quantity === 0) {
      serverCart.items = serverCart.items.filter((i) => i.product.id !== prod.id && i.product.sku !== prod.sku);
      return res.json({ success: true, message: "Item removed from cart", cart: serverCart });
    }
    if (quantity > prod.stock) {
      return sendJsonError(
        res,
        400,
        `Insufficient stock constraint. Only ${prod.stock} units currently available.`,
        "INSUFFICIENT_STOCK",
        { availableStock: prod.stock }
      );
    }
    const item = serverCart.items.find((i) => i.product.id === prod.id || i.product.sku === prod.sku);
    if (item) {
      item.quantity = quantity;
    } else {
      serverCart.items.push({ product: prod, quantity });
    }
    res.json({ success: true, cart: serverCart });
  });
  app.delete("/api/cart/items/:productId", (req, res) => {
    const { productId } = req.params;
    serverCart.items = serverCart.items.filter((i) => i.product.id !== productId && i.product.sku !== productId);
    res.json({ success: true, message: "Item removed", cart: serverCart });
  });
  app.post("/api/cart/clear", (_req, res) => {
    serverCart.items = [];
    serverCart.appliedCoupon = void 0;
    res.json({ success: true, message: "Cart cleared" });
  });
  app.post("/api/cart/apply-coupon", (req, res) => {
    const { code } = req.body || {};
    if (!code || typeof code !== "string") {
      return sendJsonError(res, 400, "Coupon code required", "COUPON_REQUIRED");
    }
    const clean = code.trim().toUpperCase();
    const validCoupons = ["ATL2026", "NEP20", "BALKI10", "FREESHIP"];
    if (!validCoupons.includes(clean)) {
      return sendJsonError(
        res,
        400,
        "Invalid or expired coupon code. Available: ATL2026, NEP20, BALKI10, FREESHIP",
        "INVALID_COUPON"
      );
    }
    serverCart.appliedCoupon = clean;
    res.json({ success: true, appliedCoupon: clean, message: `Coupon ${clean} applied successfully` });
  });
  app.get("/api/razorpay/config-status", (_req, res) => {
    const status = getRazorpayConfigStatus();
    sendJsonSuccess(res, 200, status.configured ? "Razorpay configured" : "Razorpay credentials not yet configured", {
      configured: status.configured,
      mode: status.mode,
      keyId: status.keyId,
      currency: "INR",
      testMode: status.mode === "test",
      webhookConfigured: status.webhookConfigured
    });
  });
  app.get("/api/razorpay/public-key", (_req, res) => {
    const status = getRazorpayConfigStatus();
    if (!status.configured || !status.keyId) {
      return sendJsonError(
        res,
        503,
        "Razorpay payment gateway is not yet configured on this server. Please check back shortly or contact support.",
        "RAZORPAY_NOT_CONFIGURED",
        { configured: false, mode: "unconfigured", currency: "INR" }
      );
    }
    sendJsonSuccess(res, 200, "Razorpay public key retrieved", {
      configured: true,
      keyId: status.keyId,
      mode: status.mode,
      currency: "INR",
      testMode: status.mode === "test"
    });
  });
  app.post("/api/razorpay/create-order", async (req, res) => {
    try {
      const rzpStatus = getRazorpayConfigStatus();
      const razorpayClient = getRazorpayClient();
      if (!rzpStatus.configured || !rzpStatus.keyId || !razorpayClient) {
        return sendJsonError(
          res,
          503,
          "Razorpay merchant credentials are not yet configured. Your order details are preserved safely as Payment Pending.",
          "RAZORPAY_NOT_CONFIGURED",
          { configured: false, mode: "unconfigured" }
        );
      }
      const { orderId, orderToken, items, customerEmail, customerPhone, couponCode } = req.body || {};
      const threshold = getApprovalThresholdInr();
      let order = orderId ? orders.find((o) => o.id === orderId || o.orderId === orderId) : void 0;
      if (!order && orderToken) {
        const verified = verifyOrderToken(orderToken);
        if (!verified) {
          return sendJsonError(res, 400, "Invalid or tampered order verification token.", "INVALID_ORDER_TOKEN");
        }
        if (orderId && verified.orderId !== orderId) {
          return sendJsonError(res, 400, "Order verification token does not match requested orderId.", "ORDER_TOKEN_MISMATCH");
        }
        order = hydrateOrderFromSignedToken(verified);
        orders.unshift(order);
      }
      if (!order && orderId) {
        const fsOrder = await findFirestoreOrder({ orderId });
        if (fsOrder) {
          order = fsOrder;
          orders.unshift(order);
        }
      }
      let finalAmount = 0;
      if (order) {
        if (order.paymentStatus === "Paid") {
          return sendJsonError(res, 400, `Order ${order.id} has already been paid and processed.`, "ORDER_ALREADY_PAID");
        }
        finalAmount = Number(order.serverVerifiedTotal ?? order.finalAmount ?? order.totalAmount);
        if (finalAmount >= threshold) {
          return sendJsonError(
            res,
            400,
            `Order amount of \u20B9${finalAmount.toLocaleString("en-IN")} meets or exceeds the approval threshold of \u20B9${threshold.toLocaleString("en-IN")}. Administrator approval is required.`,
            "APPROVAL_REQUIRED",
            { requiresApproval: true, threshold, finalAmount }
          );
        }
        if (order.razorpayOrderId && order.paymentStatus !== "Failed") {
          return sendJsonSuccess(res, 200, "Existing Razorpay order retrieved", {
            configured: true,
            mode: rzpStatus.mode,
            razorpayOrderId: order.razorpayOrderId,
            amount: Math.round(finalAmount * 100),
            currency: "INR",
            keyId: rzpStatus.keyId,
            orderId: order.id,
            reused: true,
            notes: {
              balkiOrderId: order.id,
              customerEmail: order.customerEmail,
              customerPhone: order.customerPhone
            }
          });
        }
      } else if (items && Array.isArray(items) && items.length > 0) {
        const calc = calculateTrustedOrderAmount(items, couponCode);
        if (!calc.success || !calc.data) {
          return sendJsonError(res, 400, calc.error || "Invalid items", calc.code || "CALCULATION_ERROR", {
            availableStock: calc.availableStock
          });
        }
        if (calc.data.finalAmount >= threshold) {
          return sendJsonError(
            res,
            400,
            `Order amount of \u20B9${calc.data.finalAmount.toLocaleString("en-IN")} requires owner approval.`,
            "APPROVAL_REQUIRED",
            { requiresApproval: true, threshold, finalAmount: calc.data.finalAmount }
          );
        }
        finalAmount = calc.data.finalAmount;
      } else {
        return sendJsonError(res, 400, "Order ID or items array is required to create a Razorpay order.", "MISSING_ORDER_REFERENCE");
      }
      const amountInPaise = Math.round(finalAmount * 100);
      if (!Number.isFinite(amountInPaise) || amountInPaise < 100) {
        logPaymentDiagnostic("create_order_invalid_amount", { orderId: order?.id || null, amountInPaise });
        return sendJsonError(
          res,
          400,
          "Order payable amount must be at least \u20B91.00 (100 paise) for Razorpay processing.",
          "INVALID_ORDER_AMOUNT"
        );
      }
      const receiptId = order ? order.id : `rcpt_${Date.now().toString(36)}`;
      const rzpOrder = await razorpayClient.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: receiptId,
        notes: {
          balkiOrderId: receiptId,
          customerEmail: customerEmail || order?.customerEmail || "",
          customerPhone: customerPhone || order?.customerPhone || ""
        }
      });
      if (order) {
        order.razorpayOrderId = rzpOrder.id;
        order.paymentStatus = "Payment Pending";
        order.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
        await syncRazorpayOrderIdToFirestore(order.id, rzpOrder.id);
      }
      logPaymentDiagnostic("create_order_success", {
        mode: rzpStatus.mode,
        orderId: receiptId,
        razorpayOrderId: rzpOrder.id,
        amountInPaise
      });
      return sendJsonSuccess(res, 200, "Razorpay order created successfully", {
        configured: true,
        mode: rzpStatus.mode,
        razorpayOrderId: rzpOrder.id,
        amount: amountInPaise,
        currency: "INR",
        keyId: rzpStatus.keyId,
        orderId: receiptId,
        notes: {
          balkiOrderId: receiptId,
          customerEmail: customerEmail || order?.customerEmail || "",
          customerPhone: customerPhone || order?.customerPhone || ""
        }
      });
    } catch (err) {
      const statusCode = Number(err?.statusCode || err?.error?.statusCode || 502);
      const extracted = extractServerErrorMessage(
        err,
        "Unable to create Razorpay payment order right now. Please try again."
      );
      const isAuthError = statusCode === 401 || extracted.toLowerCase().includes("authentication failed") || extracted.toLowerCase().includes("key_id");
      const clientMessage = isAuthError ? "Razorpay merchant authentication failed on the server. Please verify RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in server environment variables." : extracted;
      logPaymentDiagnostic("create_order_failed", {
        statusCode,
        isAuthError,
        reason: clientMessage
      });
      return sendJsonError(
        res,
        502,
        clientMessage,
        isAuthError ? "RAZORPAY_AUTH_FAILED" : "RAZORPAY_ORDER_FAILED"
      );
    }
  });
  app.post(["/api/razorpay/verify-payment", "/api/orders/verify-payment"], async (req, res) => {
    try {
      const rzpStatus = getRazorpayConfigStatus();
      const razorpayClient = getRazorpayClient();
      if (!rzpStatus.configured || !razorpayClient) {
        return sendJsonError(
          res,
          503,
          "Razorpay payment verification cannot proceed because merchant credentials are not configured on the server.",
          "RAZORPAY_NOT_CONFIGURED"
        );
      }
      const { orderId, orderToken, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return sendJsonError(
          res,
          400,
          "Missing required parameters: razorpay_order_id, razorpay_payment_id, and razorpay_signature are mandatory.",
          "MISSING_PAYMENT_SIGNATURE"
        );
      }
      const isSignatureValid = verifyRazorpayPaymentSignature(
        String(razorpay_order_id),
        String(razorpay_payment_id),
        String(razorpay_signature)
      );
      if (!isSignatureValid) {
        logPaymentDiagnostic("verify_payment_invalid_signature", {
          orderId: orderId || null,
          razorpayOrderId: String(razorpay_order_id)
        });
        return sendJsonError(
          res,
          400,
          "Invalid Razorpay payment signature. Cryptographic verification failed. Payment cannot be verified.",
          "INVALID_PAYMENT_SIGNATURE"
        );
      }
      let order = orders.find(
        (o) => orderId && (o.id === orderId || o.orderId === orderId) || o.razorpayOrderId === razorpay_order_id
      );
      if (!order && orderToken) {
        const verifiedToken = verifyOrderToken(orderToken);
        if (!verifiedToken) {
          return sendJsonError(res, 400, "Invalid order verification token.", "INVALID_ORDER_TOKEN");
        }
        order = hydrateOrderFromSignedToken(verifiedToken);
        orders.unshift(order);
      }
      if (!order) {
        const fsOrder = await findFirestoreOrder({
          orderId: orderId ? String(orderId) : null,
          razorpayOrderId: String(razorpay_order_id)
        });
        if (fsOrder) {
          order = fsOrder;
          orders.unshift(order);
        }
      }
      if (!order) {
        logPaymentDiagnostic("verify_payment_order_not_found", {
          orderId: orderId || null,
          razorpayOrderId: String(razorpay_order_id)
        });
        return sendJsonError(
          res,
          404,
          `Order not found for ID "${orderId || razorpay_order_id}".`,
          "ORDER_NOT_FOUND"
        );
      }
      if (order.razorpayOrderId && order.razorpayOrderId !== String(razorpay_order_id)) {
        logPaymentDiagnostic("verify_payment_order_mismatch", {
          orderId: order.id,
          expectedRazorpayOrderId: order.razorpayOrderId,
          receivedRazorpayOrderId: String(razorpay_order_id)
        });
        return sendJsonError(
          res,
          400,
          "Razorpay order ID does not match this order record.",
          "RAZORPAY_ORDER_MISMATCH"
        );
      }
      const existingOrderForPayment = processedPaymentIds.get(String(razorpay_payment_id));
      if (existingOrderForPayment && existingOrderForPayment !== order.id) {
        logPaymentDiagnostic("verify_payment_cross_order_duplicate", {
          orderId: order.id,
          existingOrderForPayment
        });
        return sendJsonError(
          res,
          409,
          `Payment ${razorpay_payment_id} has already been applied to another order (${existingOrderForPayment}).`,
          "DUPLICATE_PAYMENT_DETECTED"
        );
      }
      if (order.paymentStatus === "Paid") {
        if (order.razorpayPaymentId === razorpay_payment_id || existingOrderForPayment === order.id) {
          return sendJsonSuccess(res, 200, "Payment already verified for this order.", {
            alreadyVerified: true,
            order,
            payment: {
              paymentId: order.razorpayPaymentId,
              orderId: order.razorpayOrderId,
              amount: order.totalAmount,
              currency: "INR",
              status: "captured"
            }
          });
        }
        logPaymentDiagnostic("verify_payment_duplicate_rejected", {
          orderId: order.id,
          razorpayOrderId: String(razorpay_order_id)
        });
        return sendJsonError(
          res,
          409,
          `Order ${order.id} has already been paid with transaction ${order.razorpayPaymentId}. Duplicate payment rejected.`,
          "DUPLICATE_PAYMENT_DETECTED"
        );
      }
      let fetchedMethod = null;
      let capturedAmountPaise = null;
      let capturedCurrency = null;
      try {
        const fetchedPayment = await razorpayClient.payments.fetch(String(razorpay_payment_id));
        if (fetchedPayment) {
          fetchedMethod = fetchedPayment.method ? String(fetchedPayment.method) : null;
          capturedAmountPaise = typeof fetchedPayment.amount === "number" ? fetchedPayment.amount : null;
          capturedCurrency = fetchedPayment.currency ? String(fetchedPayment.currency) : null;
          if (fetchedPayment.order_id && String(fetchedPayment.order_id) !== String(razorpay_order_id)) {
            return sendJsonError(
              res,
              400,
              "Razorpay payment does not belong to the supplied Razorpay order ID.",
              "RAZORPAY_ORDER_MISMATCH"
            );
          }
          const expectedTotalInr = Number(order.serverVerifiedTotal ?? order.finalAmount ?? order.totalAmount);
          const expectedPaise = Math.round(expectedTotalInr * 100);
          if (typeof fetchedPayment.amount === "number" && fetchedPayment.amount !== expectedPaise) {
            logPaymentDiagnostic("verify_payment_amount_mismatch", {
              orderId: order.id,
              paidPaise: fetchedPayment.amount,
              expectedPaise
            });
            return sendJsonError(
              res,
              400,
              `Payment amount mismatch detected (paid \u20B9${(fetchedPayment.amount / 100).toFixed(2)}, expected \u20B9${expectedTotalInr.toFixed(2)}).`,
              "PAYMENT_AMOUNT_MISMATCH"
            );
          }
          if (fetchedPayment.currency && fetchedPayment.currency !== "INR") {
            return sendJsonError(res, 400, "Invalid payment currency; INR required.", "INVALID_CURRENCY");
          }
          if (fetchedPayment.status && !["captured", "authorized"].includes(fetchedPayment.status)) {
            return sendJsonError(
              res,
              400,
              `Razorpay payment status is "${fetchedPayment.status}" and cannot be marked as paid.`,
              "PAYMENT_NOT_CAPTURED"
            );
          }
        }
      } catch (fetchErr) {
        logPaymentDiagnostic("verify_payment_fetch_note", {
          orderId: order.id,
          reason: extractServerErrorMessage(fetchErr, "Unable to fetch remote payment details")
        });
      }
      const fsCapture = await runAtomicCaptureTransaction({
        orderId: order.id,
        razorpayOrderId: String(razorpay_order_id),
        razorpayPaymentId: String(razorpay_payment_id),
        razorpaySignature: String(razorpay_signature),
        paymentMethod: fetchedMethod || "Razorpay",
        capturedAmountPaise,
        currency: capturedCurrency || "INR",
        source: "checkout_verify",
        fallbackOrderData: order
      });
      if (fsCapture.razorpayOrderMismatch) {
        return sendJsonError(
          res,
          400,
          "Razorpay order ID does not match the persisted Firestore order.",
          "RAZORPAY_ORDER_MISMATCH"
        );
      }
      if (fsCapture.amountMismatch) {
        return sendJsonError(
          res,
          400,
          `Payment amount mismatch detected (paid ${fsCapture.actualPaise} paise, expected ${fsCapture.expectedPaise} paise).`,
          "PAYMENT_AMOUNT_MISMATCH"
        );
      }
      if (fsCapture.currencyMismatch) {
        return sendJsonError(res, 400, "Invalid payment currency; INR required.", "INVALID_CURRENCY");
      }
      if (fsCapture.conflictDuplicatePayment) {
        return sendJsonError(
          res,
          409,
          `Order ${order.id} has already been paid. Duplicate payment rejected.`,
          "DUPLICATE_PAYMENT_DETECTED"
        );
      }
      if (fsCapture.alreadyPaidSamePayment && fsCapture.order) {
        return sendJsonSuccess(res, 200, "Payment already verified for this order.", {
          alreadyVerified: true,
          firestoreSynced: true,
          order: fsCapture.order,
          payment: {
            paymentId: fsCapture.order.razorpayPaymentId,
            orderId: fsCapture.order.razorpayOrderId,
            amount: fsCapture.order.totalAmount,
            currency: "INR",
            status: "captured"
          }
        });
      }
      const wasAlreadyNotified = Boolean(order.confirmationNotificationSent);
      processedPaymentIds.set(String(razorpay_payment_id), order.id);
      order.paymentStatus = "Paid";
      order.normalizedPaymentStatus = "paid";
      order.orderStatus = order.orderStatus === "delivered" ? "delivered" : "qc_assembly";
      order.deliveryStatus = mapNormalizedDeliveryStatus(order.orderStatus);
      order.razorpayOrderId = String(razorpay_order_id);
      order.razorpayPaymentId = String(razorpay_payment_id);
      order.razorpaySignature = String(razorpay_signature);
      order.paymentMethod = fetchedMethod || "Razorpay";
      order.paidAt = (/* @__PURE__ */ new Date()).toISOString();
      order.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
      order.confirmationNotificationSent = true;
      if (order.trackingDetails) {
        order.trackingDetails.checkpoints = order.trackingDetails.checkpoints.map((cp) => {
          if (cp.status === "order_placed") {
            return { ...cp, completed: true, current: false };
          }
          if (cp.status === "qc_assembly") {
            return { ...cp, completed: true, current: true, timestamp: (/* @__PURE__ */ new Date()).toISOString() };
          }
          return cp;
        });
      }
      const transactionId = fsCapture.transaction?.transactionId || `txn_${Date.now()}_${Math.floor(1e3 + Math.random() * 9e3)}`;
      paymentTransactions.unshift({
        transactionId,
        orderId: order.id,
        customerId: order.customerId || order.userId || "client",
        amount: order.totalAmount,
        currency: "INR",
        paymentMethod: fetchedMethod || "Razorpay",
        transactionType: "payment",
        gatewayReference: String(razorpay_payment_id),
        status: "SUCCESS",
        metadata: {
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          verifiedAt: (/* @__PURE__ */ new Date()).toISOString(),
          mode: rzpStatus.mode
        },
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      });
      const shouldSendEmail = fsCapture.handledByFirestore ? Boolean(fsCapture.shouldSendConfirmation) : !wasAlreadyNotified;
      if (shouldSendEmail) {
        notifications.unshift({
          notificationId: `notif_${Date.now()}`,
          recipientId: order.customerId || order.userId || "client",
          recipientEmail: order.customerEmail,
          title: `Payment Received: Order ${order.id}`,
          message: `Your payment of INR ${order.totalAmount.toLocaleString("en-IN")} has been cryptographically verified via Razorpay (Txn: ${razorpay_payment_id}). Consignment moved to QC Assembly.`,
          type: "order_status",
          orderId: order.id,
          read: false,
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        });
        await sendOrderConfirmationEmailOnce({
          orderId: order.id,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          amountInr: Number(order.serverVerifiedTotal ?? order.totalAmount),
          paymentStatus: "Paid",
          razorpayPaymentId: String(razorpay_payment_id),
          items: order.items.map((it) => ({
            name: it.product.name,
            quantity: it.quantity,
            unitPrice: it.product.price
          }))
        });
      }
      logPaymentDiagnostic("verify_payment_success", {
        orderId: order.id,
        razorpayOrderId: String(razorpay_order_id),
        mode: rzpStatus.mode,
        firestoreSynced: fsCapture.handledByFirestore
      });
      return sendJsonSuccess(res, 200, "Razorpay payment successfully verified and order marked as paid.", {
        firestoreSynced: fsCapture.handledByFirestore,
        order: fsCapture.order || order,
        payment: {
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
          signature: razorpay_signature,
          amount: order.totalAmount,
          currency: "INR",
          status: "captured"
        }
      });
    } catch (err) {
      const safeMsg = extractServerErrorMessage(err, "Internal error verifying Razorpay payment.");
      logPaymentDiagnostic("verify_payment_error", { reason: safeMsg });
      return sendJsonError(res, 500, safeMsg, "PAYMENT_VERIFICATION_ERROR");
    }
  });
  app.get("/api/razorpay/payment/:id", async (req, res) => {
    const paymentId = req.params.id;
    const rzpStatus = getRazorpayConfigStatus();
    const razorpayClient = getRazorpayClient();
    if (!rzpStatus.configured || !razorpayClient) {
      return sendJsonError(
        res,
        503,
        "Razorpay payment gateway is not yet configured.",
        "RAZORPAY_NOT_CONFIGURED"
      );
    }
    try {
      const payment = await razorpayClient.payments.fetch(paymentId);
      return sendJsonSuccess(res, 200, "Payment details retrieved", { payment });
    } catch (err) {
      const tx = paymentTransactions.find((t) => t.gatewayReference === paymentId || t.transactionId === paymentId);
      if (tx) {
        return sendJsonSuccess(res, 200, "Payment ledger record retrieved", {
          payment: {
            id: paymentId,
            amount: Math.round(tx.amount * 100),
            currency: tx.currency,
            status: tx.status === "SUCCESS" ? "captured" : tx.status.toLowerCase(),
            order_id: tx.orderId,
            method: tx.paymentMethod,
            created_at: Math.floor(new Date(tx.createdAt).getTime() / 1e3)
          }
        });
      }
      return sendJsonError(
        res,
        404,
        extractServerErrorMessage(err, "Payment record not found"),
        "PAYMENT_NOT_FOUND"
      );
    }
  });
  app.post("/api/razorpay/create-payment-link", async (req, res) => {
    try {
      const rzpStatus = getRazorpayConfigStatus();
      const razorpayClient = getRazorpayClient();
      if (!rzpStatus.configured || !razorpayClient) {
        return sendJsonError(
          res,
          503,
          "Razorpay merchant credentials are not yet configured. Cannot create live/test payment links yet.",
          "RAZORPAY_NOT_CONFIGURED"
        );
      }
      const { requestId, notes = {} } = req.body || {};
      if (!requestId) {
        return sendJsonError(res, 400, "requestId parameter is mandatory.", "REQUEST_ID_REQUIRED");
      }
      const request = orderRequests.find((r) => r.requestId === requestId || r.id === requestId);
      if (!request) {
        return sendJsonError(res, 404, `Order request "${requestId}" not found.`, "ORDER_REQUEST_NOT_FOUND");
      }
      if (request.approvalStatus !== "approved") {
        return sendJsonError(
          res,
          400,
          `Cannot generate payment link. Order request ${requestId} has approval status "${request.approvalStatus}". Only after administrator approval and final quotation confirmation can a payment link be generated.`,
          "APPROVAL_REQUIRED",
          { approvalStatus: request.approvalStatus }
        );
      }
      const approvedAmount = request.finalQuotedAmount || request.finalAmount || request.requestedAmount;
      const amountInPaise = Math.round(approvedAmount * 100);
      if (request.razorpayPaymentLinkId && request.razorpayPaymentLinkUrl) {
        return sendJsonSuccess(res, 200, "Existing payment link retrieved", {
          paymentLinkId: request.razorpayPaymentLinkId,
          paymentLinkUrl: request.razorpayPaymentLinkUrl,
          amount: approvedAmount,
          currency: "INR",
          status: "active",
          reused: true
        });
      }
      const linkRes = await razorpayClient.paymentLink.create({
        amount: amountInPaise,
        currency: "INR",
        accept_partial: false,
        description: `Approved Institutional Quotation Payment for ${request.requestId} - Balki Technologies`,
        customer: {
          name: request.customerDetails?.name || "Institutional Client",
          email: request.customerDetails?.email || "",
          contact: request.customerDetails?.phone || ""
        },
        notify: {
          sms: true,
          email: true
        },
        reminder_enable: true,
        notes: {
          requestId: request.requestId,
          schoolName: request.customerDetails?.schoolName || "",
          ...notes
        }
      });
      request.razorpayPaymentLinkId = linkRes.id;
      request.razorpayPaymentLinkUrl = linkRes.short_url;
      request.paymentStatus = "LINK_GENERATED";
      request.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
      notifications.unshift({
        notificationId: `notif_${Date.now()}`,
        recipientId: request.customerId,
        recipientEmail: request.customerDetails?.email,
        title: `Payment Link Generated for Approved Quote ${request.requestId}`,
        message: `Your quotation for \u20B9${approvedAmount.toLocaleString("en-IN")} has been approved by the procurement desk. Complete payment via Razorpay: ${linkRes.short_url}`,
        type: "approval",
        orderId: request.requestId,
        read: false,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      });
      return sendJsonSuccess(res, 200, "Razorpay payment link generated successfully", {
        paymentLinkId: linkRes.id,
        paymentLinkUrl: linkRes.short_url,
        amount: approvedAmount,
        currency: "INR",
        status: "created"
      });
    } catch (err) {
      const msg = extractServerErrorMessage(err, "Error creating Razorpay payment link");
      logPaymentDiagnostic("create_payment_link_failed", { reason: msg });
      return sendJsonError(
        res,
        502,
        msg,
        "RAZORPAY_PAYMENT_LINK_FAILED"
      );
    }
  });
  app.post("/api/razorpay/create-qr", async (req, res) => {
    try {
      const rzpStatus = getRazorpayConfigStatus();
      const razorpayClient = getRazorpayClient();
      if (!rzpStatus.configured || !razorpayClient) {
        return sendJsonError(
          res,
          503,
          "Dynamic QR payment requires configured Razorpay merchant credentials.",
          "RAZORPAY_NOT_CONFIGURED"
        );
      }
      const { orderId, orderToken, customerPhone } = req.body || {};
      let order = orderId ? orders.find((o) => o.id === orderId || o.orderId === orderId) : void 0;
      if (!order && orderToken) {
        const verified = verifyOrderToken(orderToken);
        if (verified) {
          order = hydrateOrderFromSignedToken(verified);
        }
      }
      if (!order) {
        return sendJsonError(res, 404, "Valid order reference is required for QR payment.", "ORDER_NOT_FOUND");
      }
      const cleanAmount = Number(order.totalAmount);
      if (!Number.isFinite(cleanAmount) || cleanAmount <= 0 || cleanAmount >= getApprovalThresholdInr()) {
        return sendJsonError(res, 400, "Order is ineligible for automatic QR payment.", "QR_INELIGIBLE");
      }
      const qrCode = await razorpayClient.qrCode.create({
        type: "upi_qr",
        name: `BALKI ${order.id}`,
        usage: "single_use",
        fixed_amount: true,
        payment_amount: Math.round(cleanAmount * 100),
        description: `Order ${order.id}`,
        notes: {
          balkiOrderId: order.id
        }
      });
      return sendJsonSuccess(res, 200, "Razorpay dynamic QR created", {
        qrId: qrCode.id,
        qrImageUrl: qrCode.image_url,
        qrString: qrCode.image_url || qrCode.id,
        orderId: order.id,
        amount: cleanAmount,
        currency: "INR",
        customerPhone: customerPhone || order.customerPhone || null
      });
    } catch (qrErr) {
      const msg = extractServerErrorMessage(
        qrErr,
        "Razorpay QR creation is unavailable on this merchant account. Please use Razorpay Checkout modal."
      );
      logPaymentDiagnostic("create_qr_failed", { requestId: res.locals?.requestId, reason: msg });
      return sendJsonError(res, 502, msg, "RAZORPAY_QR_UNAVAILABLE");
    }
  });
  app.get("/api/orders", (req, res) => {
    const { search, email, phone, status, trackingNumber } = req.query;
    let filtered = [...orders];
    if (email && typeof email === "string") {
      filtered = filtered.filter((o) => o.customerEmail.toLowerCase() === email.toLowerCase());
    }
    if (phone && typeof phone === "string") {
      filtered = filtered.filter((o) => o.customerPhone.includes(phone));
    }
    if (status && typeof status === "string") {
      filtered = filtered.filter((o) => o.orderStatus === status || o.paymentStatus.toLowerCase().includes(status.toLowerCase()));
    }
    if (trackingNumber && typeof trackingNumber === "string") {
      filtered = filtered.filter((o) => o.trackingNumber.toLowerCase() === trackingNumber.toLowerCase());
    }
    if (search && typeof search === "string") {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (o) => o.id.toLowerCase().includes(q) || o.trackingNumber.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q) || o.schoolName && o.schoolName.toLowerCase().includes(q)
      );
    }
    res.json(filtered);
  });
  app.get("/api/orders/threshold", (_req, res) => {
    const threshold = getApprovalThresholdInr();
    sendJsonSuccess(res, 200, "Threshold configuration retrieved", {
      threshold,
      currency: "INR",
      description: `Orders < \u20B9${threshold.toLocaleString("en-IN")} proceed with automatic payment; orders >= \u20B9${threshold.toLocaleString("en-IN")} require owner approval.`
    });
  });
  app.get("/api/orders/track/:query", (req, res) => {
    const queryStr = req.params.query.trim().toLowerCase();
    const order = orders.find(
      (o) => o.trackingNumber.toLowerCase() === queryStr || o.id.toLowerCase() === queryStr || o.trackingDetails?.awbNumber && o.trackingDetails.awbNumber.toLowerCase() === queryStr || o.customerPhone.replace(/\D/g, "").includes(queryStr.replace(/\D/g, "")) || o.customerEmail.toLowerCase() === queryStr
    );
    if (!order) {
      return sendJsonError(
        res,
        404,
        `No consignment found for tracking identifier: "${req.params.query}".`,
        "TRACKING_NOT_FOUND",
        {
          found: false,
          suggestions: ["BALKI-EXP-940212IN", "DELHIVERY-B2B-8971203", "ORD-2026-9081"]
        }
      );
    }
    if (!order.trackingDetails) {
      const generated = generateOrderTracking(
        order.id,
        order.shippingAddress?.city,
        order.shippingAddress?.state,
        order.paymentMethod,
        order.schoolName
      );
      order.trackingDetails = generated.trackingDetails;
      order.trackingNumber = order.trackingNumber || generated.trackingNumber;
      order.deliveryOtp = order.deliveryOtp || generated.deliveryOtp;
    }
    return sendJsonSuccess(res, 200, "Order tracking details retrieved", {
      found: true,
      order,
      trackingDetails: order.trackingDetails
    });
  });
  app.post("/api/orders/:id/track/advance", (req, res) => {
    const order = orders.find((o) => o.id === req.params.id || o.trackingNumber === req.params.id);
    if (!order) {
      return sendJsonError(res, 404, "Order not found", "ORDER_NOT_FOUND");
    }
    if (!order.trackingDetails) {
      const generated = generateOrderTracking(
        order.id,
        order.shippingAddress?.city,
        order.shippingAddress?.state,
        order.paymentMethod,
        order.schoolName
      );
      order.trackingDetails = generated.trackingDetails;
    }
    const stages = [
      "order_placed",
      "qc_assembly",
      "dispatched",
      "in_transit",
      "out_for_delivery",
      "delivered"
    ];
    const currentIdx = stages.indexOf(order.orderStatus || "qc_assembly");
    if (currentIdx === -1 || currentIdx >= stages.length - 1) {
      return sendJsonSuccess(res, 200, "Order is already delivered or in final stage.", { order });
    }
    const nextStatus = stages[currentIdx + 1];
    order.orderStatus = nextStatus;
    const nowIso = (/* @__PURE__ */ new Date()).toISOString();
    order.trackingDetails.checkpoints = order.trackingDetails.checkpoints.map((cp) => {
      const cpIdx = stages.indexOf(cp.status);
      const nextIdx = currentIdx + 1;
      if (cpIdx <= nextIdx) {
        return {
          ...cp,
          completed: true,
          current: cpIdx === nextIdx,
          timestamp: cpIdx === nextIdx ? nowIso : cp.timestamp
        };
      }
      return { ...cp, completed: false, current: false };
    });
    if (nextStatus === "dispatched") {
      order.trackingDetails.liveCoordinates = { lat: 17.2341, lng: 78.4312 };
    } else if (nextStatus === "in_transit") {
      order.trackingDetails.liveCoordinates = { lat: 17.4721, lng: 78.4892 };
    } else if (nextStatus === "out_for_delivery") {
      order.trackingDetails.liveCoordinates = { lat: 17.5021, lng: 78.5082 };
    } else if (nextStatus === "delivered") {
      order.trackingDetails.liveCoordinates = { lat: 17.5118, lng: 78.5204 };
    }
    return sendJsonSuccess(res, 200, `Consignment tracking advanced to ${nextStatus}`, { order });
  });
  app.post("/api/orders/:id/cancel", (req, res) => {
    const order = orders.find((o) => o.id === req.params.id || o.trackingNumber === req.params.id);
    if (!order) {
      return sendJsonError(res, 404, "Order not found", "ORDER_NOT_FOUND");
    }
    if (order.orderStatus === "delivered") {
      return sendJsonError(
        res,
        400,
        "Delivered orders cannot be cancelled online. Please initiate return request.",
        "ORDER_ALREADY_DELIVERED"
      );
    }
    if (order.orderStatus === "cancelled") {
      return sendJsonError(res, 400, "Order is already cancelled", "ORDER_ALREADY_CANCELLED");
    }
    for (const item of order.items) {
      const prod = products.find((p) => p.id === item.product.id || p.sku === item.product.sku);
      if (prod) {
        prod.stock += item.quantity;
        const inv = inventory.find((i) => i.sku === prod.sku);
        if (inv) {
          inv.currentStock = prod.stock;
          inv.status = inv.currentStock > inv.minimumThreshold ? "In Stock" : "Low Stock";
        }
      }
    }
    order.orderStatus = "cancelled";
    order.paymentStatus = order.paymentStatus === "Paid" ? "Refunded" : "Failed";
    if (order.trackingDetails) {
      order.trackingDetails.checkpoints.push({
        id: `chk-cancel-${Date.now()}`,
        status: "cancelled",
        title: "Order Cancelled & Stock Restored",
        description: "Customer requested cancellation before delivery. Reserved inventory restored.",
        location: "Balki Corporate HQ, Hyderabad",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        completed: true,
        current: true
      });
    }
    return sendJsonSuccess(res, 200, "Order cancelled successfully. Inventory restored.", { order });
  });
  app.post("/api/orders/calculate", (req, res) => {
    const { items, couponCode } = req.body || {};
    const calc = calculateTrustedOrderAmount(items, couponCode);
    if (!calc.success || !calc.data) {
      return sendJsonError(res, 400, calc.error || "Calculation error", calc.code || "CALCULATION_ERROR", {
        availableStock: calc.availableStock
      });
    }
    const rzpStatus = getRazorpayConfigStatus();
    return sendJsonSuccess(res, 200, "Order total calculated authoritatively", {
      ...calc.data,
      amountInPaise: Math.round(calc.data.finalAmount * 100),
      razorpay: {
        configured: rzpStatus.configured,
        mode: rzpStatus.mode
      }
    });
  });
  app.post("/api/orders/checkout-small", async (req, res) => {
    try {
      const {
        customerId,
        customerName,
        customerEmail,
        customerPhone,
        schoolName,
        gstin,
        deliveryAddress,
        shippingAddress,
        items,
        couponCode,
        paymentMethod = "Razorpay"
      } = req.body || {};
      if (typeof customerName !== "string" || customerName.trim().length < 2) {
        return sendJsonError(res, 400, "Customer full name is required.", "INVALID_CUSTOMER_NAME");
      }
      if (!isValidEmail(customerEmail)) {
        return sendJsonError(res, 400, "A valid email address is required.", "INVALID_CUSTOMER_EMAIL");
      }
      if (!isValidPhone(customerPhone)) {
        return sendJsonError(res, 400, "A valid 10-digit phone number is required.", "INVALID_CUSTOMER_PHONE");
      }
      const address = normalizeAddress(deliveryAddress || shippingAddress);
      if (!address) {
        return sendJsonError(
          res,
          400,
          "Complete delivery address (street, city, state, and 6-digit PIN code) is mandatory.",
          "INVALID_DELIVERY_ADDRESS"
        );
      }
      if (!items || !Array.isArray(items) || items.length === 0) {
        return sendJsonError(res, 400, "Cart items are required for checkout.", "EMPTY_ITEMS");
      }
      const idempotencyKey = `${customerEmail.trim().toLowerCase()}_${JSON.stringify(
        items.map((i) => ({ id: i.productId || i.id, q: i.quantity }))
      )}`;
      const now = Date.now();
      if (recentSubmissions.has(idempotencyKey) && now - recentSubmissions.get(idempotencyKey) < 8e3) {
        return sendJsonError(
          res,
          429,
          "A duplicate checkout submission is already being processed. Please wait a moment.",
          "DUPLICATE_SUBMISSION"
        );
      }
      recentSubmissions.set(idempotencyKey, now);
      const calc = calculateTrustedOrderAmount(items, couponCode);
      if (!calc.success || !calc.data) {
        return sendJsonError(res, 400, calc.error || "Invalid order items", calc.code || "CALCULATION_ERROR", {
          availableStock: calc.availableStock
        });
      }
      const threshold = getApprovalThresholdInr();
      if (calc.data.finalAmount >= threshold) {
        return sendJsonError(
          res,
          400,
          `Order amount of \u20B9${calc.data.finalAmount.toLocaleString("en-IN")} meets or exceeds the approval threshold of \u20B9${threshold.toLocaleString("en-IN")}. Please submit as "Request Owner Approval".`,
          "APPROVAL_REQUIRED",
          {
            requiresApproval: true,
            threshold,
            finalAmount: calc.data.finalAmount
          }
        );
      }
      for (const it of calc.data.items) {
        const prod = products.find((p) => p.id === it.productId);
        if (prod) {
          prod.stock = Math.max(0, prod.stock - it.quantity);
          const inv = inventory.find((i) => i.sku === prod.sku);
          if (inv) {
            inv.currentStock = prod.stock;
            if (inv.currentStock <= inv.minimumThreshold) {
              inv.status = inv.currentStock === 0 ? "Critical" : "Low Stock";
            }
          }
        }
      }
      const orderId = `ORD-2026-${Math.floor(1e3 + Math.random() * 9e3)}`;
      const effectiveCustomerId = customerId || "client_" + customerEmail.trim().split("@")[0];
      const { trackingNumber, deliveryOtp, trackingDetails } = generateOrderTracking(
        orderId,
        address.city,
        address.state,
        paymentMethod,
        schoolName
      );
      const fullItems = calc.data.items.map((it) => {
        const fullProd = products.find((p) => p.id === it.productId);
        return {
          product: fullProd,
          quantity: it.quantity
        };
      });
      const rzpStatus = getRazorpayConfigStatus();
      const razorpayClient = getRazorpayClient();
      let razorpayOrderId = void 0;
      let razorpayErrorMessage = void 0;
      if (rzpStatus.configured && razorpayClient) {
        const amountInPaise = Math.round(calc.data.finalAmount * 100);
        if (!Number.isFinite(amountInPaise) || amountInPaise < 100) {
          razorpayErrorMessage = "Order payable amount must be at least \u20B91.00 (100 paise) for Razorpay processing.";
          logPaymentDiagnostic("checkout_small_invalid_amount", { requestId: res.locals?.requestId, orderId, amountInPaise });
        } else {
          try {
            const rzpOrder = await razorpayClient.orders.create({
              amount: amountInPaise,
              currency: "INR",
              receipt: orderId,
              notes: {
                balkiOrderId: orderId,
                customerEmail: customerEmail.trim(),
                customerPhone: customerPhone.trim()
              }
            });
            razorpayOrderId = rzpOrder.id;
            logPaymentDiagnostic("checkout_small_rzp_order_created", {
              requestId: res.locals?.requestId,
              orderId,
              razorpayOrderId,
              amountInPaise,
              mode: rzpStatus.mode
            });
          } catch (sdkErr) {
            const statusCode = Number(sdkErr?.statusCode || sdkErr?.error?.statusCode || 502);
            const extracted = extractServerErrorMessage(sdkErr, "Unable to initialize Razorpay order right now.");
            const isAuthError = statusCode === 401 || extracted.toLowerCase().includes("authentication failed") || extracted.toLowerCase().includes("key_id");
            razorpayErrorMessage = isAuthError ? "Razorpay merchant authentication failed on the server. Please verify server RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET." : extracted;
            logPaymentDiagnostic("checkout_small_rzp_order_failed", {
              requestId: res.locals?.requestId,
              orderId,
              statusCode,
              isAuthError,
              reason: razorpayErrorMessage
            });
          }
        }
      }
      const newOrder = {
        id: orderId,
        orderId,
        userId: effectiveCustomerId,
        customerId: effectiveCustomerId,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        schoolName: typeof schoolName === "string" && schoolName.trim() ? schoolName.trim() : void 0,
        gstin: typeof gstin === "string" && gstin.trim() ? gstin.trim().toUpperCase() : void 0,
        deliveryAddress: address,
        shippingAddress: address,
        products: fullItems,
        items: fullItems,
        subtotal: calc.data.subtotal,
        taxAmount: calc.data.taxAmount,
        gstAmount: calc.data.taxAmount,
        shippingCharges: calc.data.shippingCharges,
        shippingFee: calc.data.shippingCharges,
        discount: calc.data.discount,
        finalAmount: calc.data.finalAmount,
        serverVerifiedTotal: calc.data.finalAmount,
        totalAmount: calc.data.finalAmount,
        currency: "INR",
        paymentMethod: "Razorpay",
        paymentStatus: "Payment Pending",
        normalizedPaymentStatus: "pending",
        orderStatus: "order_placed",
        deliveryStatus: "pending",
        approvalStatus: "approved",
        razorpayOrderId,
        trackingNumber,
        courierName: "Delhivery B2B Priority",
        deliveryOtp,
        trackingDetails,
        confirmationNotificationSent: false,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      orders.unshift(newOrder);
      const firestoreSynced = await syncOrderCreatedToFirestore(newOrder);
      const orderToken = signOrderToken({
        orderId,
        customerId: effectiveCustomerId,
        customerName: newOrder.customerName,
        customerEmail: newOrder.customerEmail,
        customerPhone: newOrder.customerPhone,
        schoolName: newOrder.schoolName,
        gstin: newOrder.gstin,
        deliveryAddress: address,
        subtotal: calc.data.subtotal,
        taxAmount: calc.data.taxAmount,
        shippingCharges: calc.data.shippingCharges,
        discount: calc.data.discount,
        finalAmount: calc.data.finalAmount,
        currency: "INR",
        razorpayOrderId,
        trackingNumber,
        deliveryOtp,
        items: calc.data.items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        iat: Date.now()
      });
      const razorpayInfo = rzpStatus.configured && rzpStatus.keyId && razorpayOrderId ? {
        configured: true,
        mode: rzpStatus.mode,
        orderId: razorpayOrderId,
        amount: Math.round(calc.data.finalAmount * 100),
        currency: "INR",
        status: "created",
        keyId: rzpStatus.keyId,
        notes: {
          balkiOrderId: orderId,
          customerEmail: newOrder.customerEmail,
          customerPhone: newOrder.customerPhone
        }
      } : {
        configured: rzpStatus.configured,
        mode: rzpStatus.mode,
        orderId: null,
        amount: Math.round(calc.data.finalAmount * 100),
        currency: "INR",
        status: rzpStatus.configured ? "gateway_error" : "not_configured",
        keyId: null,
        message: razorpayErrorMessage || "Razorpay payment gateway is not yet configured with merchant API credentials. Your order has been saved safely as Payment Pending."
      };
      return sendJsonSuccess(
        res,
        201,
        razorpayInfo.orderId ? "Small order created and prepared for Razorpay checkout." : "Small order saved as Payment Pending. Online payment gateway is awaiting merchant credential setup.",
        {
          orderCategory: "SMALL_ORDER",
          order: newOrder,
          orderToken,
          firestoreSynced,
          razorpay: razorpayInfo
        }
      );
    } catch (err) {
      const safeMsg = extractServerErrorMessage(err, "Unable to initialize small order checkout.");
      logPaymentDiagnostic("checkout_small_error", { requestId: res.locals?.requestId, reason: safeMsg });
      return sendJsonError(res, 500, safeMsg, "SMALL_CHECKOUT_ERROR");
    }
  });
  app.post("/api/orders/request-approval", async (req, res) => {
    try {
      const {
        customerId,
        customerName,
        customerEmail,
        customerPhone,
        schoolName,
        gstin,
        deliveryAddress,
        shippingAddress,
        items,
        couponCode
      } = req.body || {};
      if (typeof customerName !== "string" || customerName.trim().length < 2) {
        return sendJsonError(res, 400, "Customer full name is required.", "INVALID_CUSTOMER_NAME");
      }
      if (!isValidEmail(customerEmail)) {
        return sendJsonError(res, 400, "A valid email address is required.", "INVALID_CUSTOMER_EMAIL");
      }
      if (!isValidPhone(customerPhone)) {
        return sendJsonError(res, 400, "A valid 10-digit phone number is required.", "INVALID_CUSTOMER_PHONE");
      }
      const address = normalizeAddress(deliveryAddress || shippingAddress);
      if (!address) {
        return sendJsonError(
          res,
          400,
          "Complete delivery address (street, city, state, and 6-digit PIN code) is mandatory.",
          "INVALID_DELIVERY_ADDRESS"
        );
      }
      if (!items || !Array.isArray(items) || items.length === 0) {
        return sendJsonError(res, 400, "Cart items are required.", "EMPTY_ITEMS");
      }
      const idempotencyKey = `req_${customerEmail.trim().toLowerCase()}_${JSON.stringify(
        items.map((i) => ({ id: i.productId || i.id, q: i.quantity }))
      )}`;
      const now = Date.now();
      if (recentSubmissions.has(idempotencyKey) && now - recentSubmissions.get(idempotencyKey) < 8e3) {
        return sendJsonError(
          res,
          429,
          "A duplicate approval request is already in progress. Please wait a moment.",
          "DUPLICATE_SUBMISSION"
        );
      }
      recentSubmissions.set(idempotencyKey, now);
      const calc = calculateTrustedOrderAmount(items, couponCode);
      if (!calc.success || !calc.data) {
        return sendJsonError(res, 400, calc.error || "Invalid items", calc.code || "CALCULATION_ERROR", {
          availableStock: calc.availableStock
        });
      }
      const threshold = getApprovalThresholdInr();
      if (calc.data.finalAmount < threshold) {
        return sendJsonError(
          res,
          400,
          `Order amount \u20B9${calc.data.finalAmount.toLocaleString("en-IN")} is below \u20B9${threshold.toLocaleString("en-IN")} and qualifies for direct automatic payment checkout.`,
          "SMALL_ORDER_PATH_REQUIRED",
          { requiresApproval: false, threshold, finalAmount: calc.data.finalAmount }
        );
      }
      const requestId = `REQ-2026-${Math.floor(1e3 + Math.random() * 9e3)}`;
      const effectiveCustomerId = customerId || "client_" + customerEmail.trim().split("@")[0];
      const newRequest = {
        requestId,
        id: requestId,
        customerId: effectiveCustomerId,
        customerDetails: {
          name: customerName.trim(),
          email: customerEmail.trim(),
          phone: customerPhone.trim(),
          schoolName: typeof schoolName === "string" && schoolName.trim() ? schoolName.trim() : void 0,
          gstin: typeof gstin === "string" && gstin.trim() ? gstin.trim().toUpperCase() : void 0,
          address: `${address.street}, ${address.city}, ${address.state} - ${address.pincode}`,
          shippingAddress: address
        },
        requestedProducts: calc.data.items.map((it) => ({
          productId: it.productId,
          productName: it.name,
          quantity: it.quantity,
          estimatedUnitPrice: it.unitPrice
        })),
        subtotal: calc.data.subtotal,
        taxAmount: calc.data.taxAmount,
        shippingCharges: calc.data.shippingCharges,
        requestedAmount: calc.data.finalAmount,
        finalAmount: calc.data.finalAmount,
        currency: "INR",
        approvalStatus: "PENDING",
        paymentStatus: "NOT_STARTED",
        rejectionReason: null,
        finalQuotedAmount: null,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      orderRequests.unshift(newRequest);
      const firestoreSynced = await syncOrderRequestToFirestore(newRequest);
      notifications.unshift({
        notificationId: `notif_admin_${Date.now()}`,
        recipientId: "super-admin-balki",
        recipientEmail: "kartikks1205@gmail.com",
        title: `High-Value Order Approval Request: ${requestId}`,
        message: `${schoolName || customerName} requested approval for \u20B9${calc.data.finalAmount.toLocaleString("en-IN")} (${calc.data.items.length} hardware packages).`,
        type: "approval",
        orderId: requestId,
        read: false,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      });
      return sendJsonSuccess(
        res,
        201,
        "Your order request has been successfully submitted. Our team will verify product availability and contact you shortly regarding pricing and payment.",
        {
          orderCategory: "LARGE_ORDER",
          requestId,
          firestoreSynced,
          request: newRequest
        }
      );
    } catch (err) {
      const safeMsg = extractServerErrorMessage(err, "Unable to submit owner approval request.");
      logPaymentDiagnostic("request_approval_error", { requestId: res.locals?.requestId, reason: safeMsg });
      return sendJsonError(res, 500, safeMsg, "APPROVAL_REQUEST_ERROR");
    }
  });
  app.get("/api/orders/:id/payment-status", async (req, res) => {
    try {
      const orderId = req.params.id;
      const razorpayOrderId = typeof req.query.razorpayOrderId === "string" ? req.query.razorpayOrderId : void 0;
      const fsOrder = await findFirestoreOrder({ orderId, razorpayOrderId });
      const memOrder = orders.find(
        (o) => o.id === orderId || o.orderId === orderId || razorpayOrderId && o.razorpayOrderId === razorpayOrderId
      );
      const found = fsOrder || memOrder;
      if (!found) {
        return sendJsonError(res, 404, "Order not found", "ORDER_NOT_FOUND");
      }
      return sendJsonSuccess(res, 200, "Order payment status retrieved", {
        orderId: found.id || found.orderId,
        paymentStatus: found.paymentStatus,
        normalizedPaymentStatus: found.normalizedPaymentStatus || mapNormalizedPaymentStatus(found.paymentStatus),
        orderStatus: found.orderStatus,
        deliveryStatus: found.deliveryStatus || mapNormalizedDeliveryStatus(found.orderStatus),
        approvalStatus: found.approvalStatus,
        razorpayOrderId: found.razorpayOrderId || null,
        razorpayPaymentId: found.razorpayPaymentId || null,
        paidAt: found.paidAt || null,
        lastPaymentError: found.lastPaymentError || null,
        confirmed: found.paymentStatus === "Paid"
      });
    } catch (err) {
      const safeMsg = extractServerErrorMessage(err, "Failed to query order payment status.");
      logPaymentDiagnostic("payment_status_error", { requestId: res.locals?.requestId, reason: safeMsg });
      return sendJsonError(res, 500, safeMsg, "PAYMENT_STATUS_ERROR");
    }
  });
  app.get("/api/orders/:id", (req, res) => {
    const order = orders.find((o) => o.id === req.params.id || o.trackingNumber === req.params.id);
    if (!order) {
      return sendJsonError(res, 404, "Order not found", "ORDER_NOT_FOUND");
    }
    res.json(order);
  });
  app.get("/api/customer/orders", (req, res) => {
    const { customerId, email } = req.query;
    if (!customerId && !email) {
      return sendJsonError(res, 400, "customerId or email parameter required", "MISSING_CUSTOMER_IDENTIFIER");
    }
    const filtered = orders.filter(
      (o) => customerId && (o.customerId === customerId || o.userId === customerId) || email && typeof email === "string" && o.customerEmail.toLowerCase() === email.toLowerCase()
    );
    res.json(filtered);
  });
  app.get("/api/customer/order-requests", (req, res) => {
    const { customerId, email } = req.query;
    if (!customerId && !email) {
      return sendJsonError(res, 400, "customerId or email parameter required", "MISSING_CUSTOMER_IDENTIFIER");
    }
    const filtered = orderRequests.filter(
      (r) => customerId && r.customerId === customerId || email && typeof email === "string" && r.customerDetails.email?.toLowerCase() === email.toLowerCase()
    );
    res.json(filtered);
  });
  app.get("/api/customer/notifications", (req, res) => {
    const { customerId, email } = req.query;
    if (!customerId && !email) {
      return sendJsonError(res, 400, "customerId or email parameter required", "MISSING_CUSTOMER_IDENTIFIER");
    }
    const filtered = notifications.filter(
      (n) => customerId && n.recipientId === customerId || email && typeof email === "string" && n.recipientEmail?.toLowerCase() === email.toLowerCase()
    );
    res.json(filtered);
  });
  app.post("/api/customer/notifications/:id/read", (req, res) => {
    const notif = notifications.find((n) => n.notificationId === req.params.id);
    if (!notif) {
      return sendJsonError(res, 404, "Notification not found", "NOTIFICATION_NOT_FOUND");
    }
    notif.read = true;
    res.json({ success: true, notification: notif });
  });
  app.get("/api/admin/verify", (req, res) => {
    const access = verifyAdminAccess(req);
    res.json({
      isAdmin: access.authorized,
      admin: access.authorized ? {
        email: access.email,
        role: access.role,
        permissions: ["manage_orders", "approve_requests", "change_delivery_status", "view_analytics"]
      } : null
    });
  });
  app.get("/api/admin/orders", (req, res) => {
    const access = verifyAdminAccess(req);
    if (!access.authorized) {
      return sendJsonError(res, 403, "Unauthorized. Administrator credentials required.", "ADMIN_UNAUTHORIZED");
    }
    const { approvalStatus, orderStatus, search } = req.query;
    let list = [...orders];
    if (approvalStatus && typeof approvalStatus === "string") {
      list = list.filter((o) => o.approvalStatus === approvalStatus);
    }
    if (orderStatus && typeof orderStatus === "string") {
      list = list.filter((o) => o.orderStatus === orderStatus);
    }
    if (search && typeof search === "string") {
      const q = search.toLowerCase();
      list = list.filter(
        (o) => o.id.toLowerCase().includes(q) || o.trackingNumber.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q) || o.schoolName && o.schoolName.toLowerCase().includes(q)
      );
    }
    res.json(list);
  });
  app.post("/api/admin/orders/:id/approve", (req, res) => {
    const access = verifyAdminAccess(req);
    if (!access.authorized) {
      return sendJsonError(res, 403, "Unauthorized. Administrator credentials required.", "ADMIN_UNAUTHORIZED");
    }
    const order = orders.find((o) => o.id === req.params.id || o.orderId === req.params.id);
    if (!order) {
      return sendJsonError(res, 404, "Order not found", "ORDER_NOT_FOUND");
    }
    order.approvalStatus = "approved";
    order.approvedAt = (/* @__PURE__ */ new Date()).toISOString();
    order.approvedBy = access.email || "kartikks1205@gmail.com";
    order.orderStatus = "qc_assembly";
    order.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    if (order.trackingDetails) {
      order.trackingDetails.checkpoints = order.trackingDetails.checkpoints.map((cp) => {
        if (cp.status === "order_placed" || cp.status === "qc_assembly") {
          return { ...cp, completed: true, current: cp.status === "qc_assembly" };
        }
        return cp;
      });
    }
    notifications.unshift({
      notificationId: `notif_${Date.now()}`,
      recipientId: order.customerId || order.userId || "client",
      recipientEmail: order.customerEmail,
      title: `Order ${order.id} Approved by Procurement Desk`,
      message: "Your order has passed administrative verification and advanced to technical assembly and QA testing.",
      type: "approval",
      orderId: order.id,
      read: false,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    return sendJsonSuccess(res, 200, `Order ${order.id} approved successfully`, { order });
  });
  app.post("/api/admin/orders/:id/reject", (req, res) => {
    const access = verifyAdminAccess(req);
    if (!access.authorized) {
      return sendJsonError(res, 403, "Unauthorized. Administrator credentials required.", "ADMIN_UNAUTHORIZED");
    }
    const { rejectionReason } = req.body || {};
    const order = orders.find((o) => o.id === req.params.id || o.orderId === req.params.id);
    if (!order) {
      return sendJsonError(res, 404, "Order not found", "ORDER_NOT_FOUND");
    }
    order.approvalStatus = "rejected";
    order.rejectionReason = rejectionReason || "Institutional document requirements not satisfied.";
    order.orderStatus = "cancelled";
    order.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    for (const item of order.items) {
      const prod = products.find((p) => p.id === item.product?.id || p.sku === item.product?.sku);
      if (prod) {
        prod.stock += item.quantity;
      }
    }
    notifications.unshift({
      notificationId: `notif_${Date.now()}`,
      recipientId: order.customerId || order.userId || "client",
      recipientEmail: order.customerEmail,
      title: `Notice Regarding Order ${order.id}`,
      message: `Order update: ${order.rejectionReason}. Allocated inventory has been restored. Contact support for assistance.`,
      type: "approval",
      orderId: order.id,
      read: false,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    return sendJsonSuccess(res, 200, `Order ${order.id} rejected and inventory stock restored`, { order });
  });
  app.post("/api/admin/orders/:id/status", (req, res) => {
    const access = verifyAdminAccess(req);
    if (!access.authorized) {
      return sendJsonError(res, 403, "Unauthorized. Administrator credentials required.", "ADMIN_UNAUTHORIZED");
    }
    const { status, courierName, trackingNumber, note } = req.body || {};
    const order = orders.find((o) => o.id === req.params.id || o.orderId === req.params.id);
    if (!order) {
      return sendJsonError(res, 404, "Order not found", "ORDER_NOT_FOUND");
    }
    if (status) order.orderStatus = status;
    if (courierName) order.courierName = courierName;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    order.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    if (order.trackingDetails && status) {
      const stages = ["order_placed", "qc_assembly", "dispatched", "in_transit", "out_for_delivery", "delivered"];
      const targetIdx = stages.indexOf(status);
      if (targetIdx !== -1) {
        order.trackingDetails.checkpoints = order.trackingDetails.checkpoints.map((cp, idx) => ({
          ...cp,
          completed: idx <= targetIdx,
          current: idx === targetIdx
        }));
      }
    }
    notifications.unshift({
      notificationId: `notif_${Date.now()}`,
      recipientId: order.customerId || order.userId || "client",
      recipientEmail: order.customerEmail,
      title: `Consignment Update: Order ${order.id} is ${status?.replace("_", " ").toUpperCase()}`,
      message: note || `Consignment status updated to ${status}. Carrier: ${order.courierName || "Delhivery"}.`,
      type: "tracking",
      orderId: order.id,
      read: false,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    return sendJsonSuccess(res, 200, `Order ${order.id} status updated to ${status}`, { order });
  });
  app.get("/api/admin/order-requests", (req, res) => {
    const access = verifyAdminAccess(req);
    if (!access.authorized) {
      return sendJsonError(res, 403, "Unauthorized. Administrator credentials required.", "ADMIN_UNAUTHORIZED");
    }
    res.json(orderRequests);
  });
  app.post("/api/admin/order-requests/:id/approve", async (req, res) => {
    try {
      const access = verifyAdminAccess(req);
      if (!access.authorized) {
        return sendJsonError(res, 403, "Unauthorized. Administrator credentials required.", "ADMIN_UNAUTHORIZED");
      }
      const { finalQuotedAmount, shippingCharges = 0 } = req.body || {};
      const request = orderRequests.find((r) => r.requestId === req.params.id);
      if (!request) {
        return sendJsonError(res, 404, "Quote request not found", "ORDER_REQUEST_NOT_FOUND");
      }
      const quotedInr = Number(finalQuotedAmount) || request.requestedAmount;
      if (!Number.isFinite(quotedInr) || quotedInr <= 0) {
        return sendJsonError(res, 400, "Approved quoted amount must be positive.", "INVALID_QUOTED_AMOUNT");
      }
      request.approvalStatus = "approved";
      request.finalQuotedAmount = quotedInr;
      request.shippingCharges = Number(shippingCharges) || 0;
      request.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
      const rzpStatus = getRazorpayConfigStatus();
      const razorpayClient = getRazorpayClient();
      let linkId = void 0;
      let linkUrl = void 0;
      if (rzpStatus.configured && razorpayClient) {
        try {
          const linkRes = await razorpayClient.paymentLink.create({
            amount: Math.round(quotedInr * 100),
            currency: "INR",
            accept_partial: false,
            description: `Approved Institutional Quotation Payment for ${request.requestId} - Balki Technologies`,
            customer: {
              name: request.customerDetails?.name || "Institutional Client",
              email: request.customerDetails?.email || "",
              contact: request.customerDetails?.phone || ""
            },
            notify: { sms: true, email: true },
            reminder_enable: true,
            notes: {
              requestId: request.requestId,
              schoolName: request.customerDetails?.schoolName || ""
            }
          });
          linkId = linkRes.id;
          linkUrl = linkRes.short_url;
          request.razorpayPaymentLinkId = linkId;
          request.razorpayPaymentLinkUrl = linkUrl;
          request.paymentStatus = "LINK_GENERATED";
        } catch (linkErr) {
          console.warn("Razorpay payment link creation failed during approval:", linkErr?.error || linkErr);
          request.paymentStatus = "Pending";
        }
      } else {
        request.paymentStatus = "Pending";
      }
      notifications.unshift({
        notificationId: `notif_${Date.now()}`,
        recipientId: request.customerId,
        recipientEmail: request.customerDetails?.email,
        title: `Institutional Quote Approved: ${request.requestId}`,
        message: linkUrl ? `Your bulk quote has been approved at INR ${quotedInr.toLocaleString("en-IN")}. Razorpay payment link: ${linkUrl}` : `Your bulk quote has been approved at INR ${quotedInr.toLocaleString("en-IN")}. Payment link pending merchant gateway configuration.`,
        type: "approval",
        orderId: request.requestId,
        read: false,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      });
      return sendJsonSuccess(
        res,
        200,
        linkUrl ? `Quote request ${request.requestId} approved and Razorpay payment link generated.` : `Quote request ${request.requestId} approved. Razorpay credentials are not yet configured to generate live payment link.`,
        {
          request,
          paymentLink: linkId && linkUrl ? { paymentLinkId: linkId, paymentLinkUrl: linkUrl, amount: quotedInr } : null
        }
      );
    } catch (err) {
      const safeMsg = extractServerErrorMessage(err, "Unable to approve order request.");
      logPaymentDiagnostic("admin_approve_request_error", { requestId: res.locals?.requestId, reason: safeMsg });
      return sendJsonError(res, 500, safeMsg, "ADMIN_APPROVE_ERROR");
    }
  });
  app.post("/api/admin/order-requests/:id/reject", (req, res) => {
    const access = verifyAdminAccess(req);
    if (!access.authorized) {
      return sendJsonError(res, 403, "Unauthorized. Administrator credentials required.", "ADMIN_UNAUTHORIZED");
    }
    const { rejectionReason } = req.body || {};
    const request = orderRequests.find((r) => r.requestId === req.params.id);
    if (!request) {
      return sendJsonError(res, 404, "Quote request not found", "ORDER_REQUEST_NOT_FOUND");
    }
    request.approvalStatus = "rejected";
    request.rejectionReason = rejectionReason || "Institutional quote guidelines not met.";
    request.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    notifications.unshift({
      notificationId: `notif_${Date.now()}`,
      recipientId: request.customerId,
      recipientEmail: request.customerDetails?.email,
      title: `Quote Request Notice: ${request.requestId}`,
      message: `Your quotation request could not be approved: ${request.rejectionReason}.`,
      type: "approval",
      orderId: request.requestId,
      read: false,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    return sendJsonSuccess(res, 200, `Quote request ${request.requestId} rejected`, { request });
  });
  app.get("/api/admin/transactions", (req, res) => {
    const access = verifyAdminAccess(req);
    if (!access.authorized) {
      return sendJsonError(res, 403, "Unauthorized. Administrator credentials required.", "ADMIN_UNAUTHORIZED");
    }
    res.json(paymentTransactions);
  });
  app.get("/api/admin/admin-users", (req, res) => {
    const access = verifyAdminAccess(req);
    if (!access.authorized) {
      return sendJsonError(res, 403, "Unauthorized. Administrator credentials required.", "ADMIN_UNAUTHORIZED");
    }
    res.json(adminUsers);
  });
  app.get("/api/inventory", (_req, res) => {
    res.json(inventory);
  });
  app.post("/api/inventory/update", (req, res) => {
    const { sku, deltaStock, newMinThreshold, notes } = req.body || {};
    const item = inventory.find((i) => i.sku === sku);
    if (!item) {
      return sendJsonError(res, 404, "SKU not found in inventory", "SKU_NOT_FOUND");
    }
    if (typeof deltaStock === "number") {
      item.currentStock = Math.max(0, item.currentStock + deltaStock);
      item.lastRestocked = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    }
    if (typeof newMinThreshold === "number") {
      item.minimumThreshold = newMinThreshold;
    }
    if (item.currentStock <= 0) {
      item.status = "Critical";
    } else if (item.currentStock <= item.minimumThreshold) {
      item.status = "Low Stock";
    } else {
      item.status = "In Stock";
    }
    const prod = products.find((p) => p.sku === sku);
    if (prod) {
      prod.stock = item.currentStock;
    }
    res.json({ success: true, item, notes });
  });
  app.get("/api/user/progress", (_req, res) => {
    res.json(userProgress);
  });
  app.post("/api/user/progress/complete-lesson", (req, res) => {
    const { lessonId, quizScore, courseId, hoursAdded = 1.5 } = req.body || {};
    if (lessonId && !userProgress.completedLessonIds.includes(lessonId)) {
      userProgress.completedLessonIds.push(lessonId);
    }
    if (lessonId && typeof quizScore === "number") {
      userProgress.quizScores[lessonId] = quizScore;
    }
    userProgress.tinkeringHours += Number(hoursAdded);
    const course = courses.find((c) => c.id === courseId);
    if (course) {
      const allDone = course.lessons.every((l) => userProgress.completedLessonIds.includes(l.id));
      const alreadyHasCert = userProgress.earnedCertificates.some((c) => c.courseId === courseId);
      if (allDone && !alreadyHasCert) {
        userProgress.earnedCertificates.push({
          courseId,
          courseTitle: course.title,
          issueDate: (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
          certificateId: `BALKI-CERT-${Date.now().toString().slice(-6)}`
        });
      }
    }
    res.json(userProgress);
  });
  app.post("/api/b2b/quote", (req, res) => {
    const { schoolName, contactPerson, email, phone, cityState, studentStrength, packageType, estimatedBudget, notes } = req.body || {};
    if (!schoolName || !contactPerson || !isValidEmail(email)) {
      return sendJsonError(res, 400, "School name, contact person, and valid email are required.", "INVALID_B2B_QUOTE");
    }
    const newQuote = {
      id: `QUOTE-${Date.now().toString().slice(-5)}`,
      schoolName,
      contactPerson,
      email,
      phone,
      cityState,
      studentStrength: Number(studentStrength) || 50,
      packageType: packageType || "Comprehensive ATL Lab",
      estimatedBudget: estimatedBudget || "\u20B93,00,000 - \u20B95,00,000",
      notes,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    quoteRequests.unshift(newQuote);
    res.status(201).json({ success: true, quote: newQuote });
  });
  app.get("/api/internship/applications", (_req, res) => {
    res.json(internshipApplications);
  });
  app.post("/api/internship/apply", (req, res) => {
    const { fullName, email, phone, location, college, degree, languages, whyBalki, resumeFileName } = req.body || {};
    if (!fullName || !isValidEmail(email) || !phone) {
      return sendJsonError(res, 400, "Full name, valid email, and phone are mandatory.", "INVALID_INTERNSHIP_APPLICATION");
    }
    const application = {
      id: `APP-2026-${Date.now().toString().slice(-4)}`,
      fullName,
      email,
      phone,
      location: location || "Remote",
      college: college || "University",
      degree: degree || "Graduate",
      languages: languages || "English, Hindi",
      whyBalki: whyBalki || "Excited to drive STEM education outreach across 50,000+ ATL labs.",
      resumeFileName: resumeFileName || "Candidate_Resume.pdf",
      submittedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    internshipApplications.unshift(application);
    res.status(201).json({ success: true, application });
  });
  app.get("/api/reviews", (_req, res) => {
    res.json(clientReviews);
  });
  app.post("/api/reviews", (req, res) => {
    const { authorName, designation, institution, institutionType, location, productId, productName, rating, headline, reviewText, studentsImpacted } = req.body || {};
    if (!authorName || !institution || !reviewText) {
      return sendJsonError(res, 400, "Author name, institution and review text are required.", "INVALID_REVIEW");
    }
    const newRev = {
      id: `rev-${Date.now()}`,
      authorName,
      designation: designation || "Educator",
      institution,
      institutionType: institutionType || "Private CBSE/ICSE",
      location: location || "India",
      productId: productId || "prod-1",
      productName: productName || "ATL Master Tinkering Lab Setup Kit",
      rating: Number(rating) || 5,
      date: "Just now",
      verifiedPurchase: true,
      headline: headline || "Quality STEM hardware for students",
      reviewText,
      studentsImpacted: Number(studentsImpacted) || 100,
      likesCount: 1,
      badge: "Verified School Buyer"
    };
    clientReviews.unshift(newRev);
    res.status(201).json(newRev);
  });
  app.get("/api/case-studies", (_req, res) => {
    res.json(caseStudies);
  });
  app.get("/api/case-studies/:id", (req, res) => {
    const study = caseStudies.find((s) => s.id === req.params.id || s.slug === req.params.id);
    if (!study) {
      return sendJsonError(res, 404, "Case study not found", "CASE_STUDY_NOT_FOUND");
    }
    res.json(study);
  });
  app.get("/api/support/tickets", (req, res) => {
    const { status, search } = req.query;
    let filtered = [...supportTickets];
    if (status && typeof status === "string") {
      filtered = filtered.filter((t) => t.status.toLowerCase() === status.toLowerCase());
    }
    if (search && typeof search === "string") {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (t) => t.ticketNumber.toLowerCase().includes(q) || t.institutionName.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q) || t.name.toLowerCase().includes(q)
      );
    }
    res.json(filtered);
  });
  app.post("/api/support/tickets", (req, res) => {
    const { name, role, institutionName, email, phone, category, orderIdOrSku, priority, subject, description } = req.body || {};
    if (!name || !institutionName || !isValidEmail(email) || !description) {
      return sendJsonError(res, 400, "Name, Institution, valid Email, and Description are required.", "INVALID_SUPPORT_TICKET");
    }
    const newTicket = {
      id: `tkt-${Date.now()}`,
      ticketNumber: `TKT-2026-${Math.floor(1e3 + Math.random() * 9e3)}`,
      name,
      role: role || "ATL Lab In-Charge",
      institutionName,
      email,
      phone: phone || "+91 9071199139",
      category: category || "Hardware Defect & 12-Month Replacement",
      orderIdOrSku: orderIdOrSku || "N/A",
      priority: priority || "Urgent (Classroom Paused)",
      subject: subject || `${category || "Problem Resolvance"} - ${institutionName}`,
      description,
      status: "Open",
      assignedEngineer: "Balki National Support Desk (Field Tech Routing)",
      slaHours: priority === "Urgent (Classroom Paused)" ? 4 : 24,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    supportTickets.unshift(newTicket);
    res.status(201).json(newTicket);
  });
  app.use("/api", (req, res) => {
    return sendJsonError(
      res,
      404,
      `API endpoint not found: ${req.method} ${req.originalUrl}`,
      "API_ROUTE_NOT_FOUND"
    );
  });
  app.use((err, req, res, next) => {
    if (req.originalUrl.startsWith("/api")) {
      if (err instanceof SyntaxError && "body" in err) {
        return sendJsonError(res, 400, "Malformed JSON request payload.", "INVALID_JSON_PAYLOAD");
      }
      const safeErr = extractServerErrorMessage(err, "Unexpected internal server error.");
      logPaymentDiagnostic("unhandled_api_error", { path: req.originalUrl, reason: safeErr });
      return sendJsonError(
        res,
        err?.status || 500,
        safeErr,
        "INTERNAL_SERVER_ERROR"
      );
    }
    return next(err);
  });
  return app;
}
function getApiApp() {
  if (!cachedApiApp) {
    cachedApiApp = createApiApp();
  }
  return cachedApiApp;
}

// api/_lib/handler.ts
var cachedApp = null;
function resolveNormalizedUrl(req, fixedPath) {
  const rawUrl = typeof req?.url === "string" && req.url.trim() ? req.url.trim() : "/";
  let parsed;
  try {
    parsed = new URL(rawUrl, "http://localhost");
  } catch {
    parsed = new URL("/", "http://localhost");
  }
  const params = new URLSearchParams(parsed.search);
  const rewrittenPath = params.get("__apiPath");
  if (rewrittenPath !== null) {
    params.delete("__apiPath");
  }
  let pathname = parsed.pathname || "/";
  if (fixedPath) {
    pathname = fixedPath;
  } else if (rewrittenPath !== null) {
    const cleanSuffix = rewrittenPath.replace(/^\/+/, "");
    pathname = cleanSuffix ? `/api/${cleanSuffix}` : "/api";
  } else if (!pathname.startsWith("/api")) {
    pathname = "/api" + (pathname.startsWith("/") ? pathname : `/${pathname}`);
  }
  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}
function createVercelHandler(fixedPath) {
  return function vercelApiHandler(req, res) {
    const requestId = typeof req?.headers?.["x-vercel-id"] === "string" && req.headers["x-vercel-id"].trim() || typeof req?.headers?.["x-request-id"] === "string" && req.headers["x-request-id"].trim() || `req_${Date.now().toString(36)}`;
    try {
      if (!cachedApp) {
        cachedApp = getApiApp();
      }
      if (req) {
        req.url = resolveNormalizedUrl(req, fixedPath);
      }
      return cachedApp(req, res);
    } catch (err) {
      const message = err instanceof Error && err.message ? err.message : "Failed to initialize backend API handler.";
      console.error("[VercelAPIHandler] Initialization/execution error:", { requestId, message });
      if (res && !res.headersSent) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.setHeader("X-Request-Id", requestId);
        res.end(
          JSON.stringify({
            success: false,
            message,
            error: message,
            code: "API_HANDLER_ERROR",
            requestId
          })
        );
      }
    }
  };
}

// api/_lib/webhookEntry.ts
var config = {
  api: {
    bodyParser: false
  }
};
var handler = createVercelHandler("/api/razorpay/webhook");
var webhookEntry_default = handler;
export {
  config,
  webhookEntry_default as default
};
