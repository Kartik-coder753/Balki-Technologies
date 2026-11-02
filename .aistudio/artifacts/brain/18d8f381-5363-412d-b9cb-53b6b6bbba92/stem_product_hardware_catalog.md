# Balki Technologies — Hardware Catalog & Uploaded Kit Verification

This document provides a line-by-line verification of the 11 uploaded product and circuit images, mapping each uploaded photograph and technical schematic directly to its respective STEM kit in the Balki Technologies ATL curriculum.

---

## 1. Smart Plant Irrigation & Agri-Tech Arduino STEM Kit
**SKU:** `BALKI-ATL-A83-IRRIGATE` | **Item 83, Package A** | **Category:** Biotech & Agritech

### User-Uploaded Images:
- **Circuit Schematic Diagram:**
  ![Smart Irrigation Circuit Diagram](3.webp)
- **Live Plant Prototype Test:**
  ![Smart Plant Watering System in Soil](2.jpg)
- **Complete Kit Bill of Materials (BOM):**
  ![Smart Irrigation Kit BOM](1.webp)

### Integrated App Asset:
`/src/assets/images/smart_irrigation_kit_1792086689241.jpg`

### Verified Specifications & Bill of Materials:
- **Controller:** Arduino UNO R3/R4 Minima board with ATmega328P / Renesas MCU
- **Sensors:** Dual-prong resistive/capacitive soil moisture probe with LM393 comparator potentiometer module
- **Actuation:** 5V Songle SRD relay isolation board safely switching a 5V DC miniature submersible water pump
- **Power Delivery:** Dual 3.7V 18650 Li-ion rechargeable battery holder (7.4V series) with 5.5mm DC barrel plug
- **Plumbing:** Flexible high-transparency vinyl delivery tubing feeding water into the plant root zone

---

## 2. 4-DOF Smartphone Web-Controlled Robotic Arm STEM Kit
**SKU:** `BALKI-ATL-B21-ROBARM` | **Item 132, Package B** | **Category:** Robotics & Actuators

### User-Uploaded Image:
- **Assembled Robotic Arm & Web Slider Controller:**
  ![4-DOF Robotic Arm with Smartphone Controller](4.jpg)

### Integrated App Asset:
`/src/assets/images/robotic_arm_kit_1792086690563.jpg`

### Verified Specifications & Bill of Materials:
- **Chassis:** Precision laser-cut high-density MDF articulated mechanical linkages with low-friction hardware
- **Degrees of Freedom (4-DOF):**
  - **Base:** 180° horizontal azimuthal rotation
  - **Shoulder:** Forward/backward vertical pitch actuation
  - **Elbow:** Forearm positioning articulation
  - **Gripper:** Two-jaw mechanical pinch clamp holding target blocks
- **Actuators:** 4x SG90 / MG90S micro servos with reinforced nylon and brass gears
- **Control Interface:** Wi-Fi / Bluetooth smartphone web application featuring real-time sliders for Gripper, Elbow, Shoulder, Base, plus Record and Playback trajectory automation

---

## 3. Smart Touchless Ultrasonic Dustbin STEM Kit
**SKU:** `BALKI-ATL-A84-DUSTBIN` | **Item 84, Package A** | **Category:** Smart City & Sanitation

### User-Uploaded Image:
- **Assembled Yellow Automated Dustbin with Sonar Eyes & Servo:**
  ![Smart Touchless Ultrasonic Dustbin](1.jpg)

### Integrated App Asset:
`/src/assets/images/smart_dustbin_kit_1792086690761.jpg`

### Verified Specifications & Bill of Materials:
- **Receptacle:** Bright yellow desktop cylindrical waste bin with counterbalanced hinged lid
- **Sensing:** Ultrasonic distance sensor (HC-SR04) mounted as forward-facing transducer eyes (2cm–400cm range)
- **Actuator:** SG90 micro servo mounted on the upper rim with custom mechanical lever opening the lid
- **Logic:** Arduino UNO controller running threshold algorithm; automatically lifts lid when hand is detected within 20cm and closes after a 3-second delay
- **Power:** 9V heavy duty battery with snap clip, DC barrel plug, and manual rocker power switch

---

## 4. Environmental Air Quality & Gas Monitoring Station
**SKU:** `BALKI-ATL-A107-ENVIRO` | **Item 107, Package A** | **Category:** Sensors & Automation

### User-Uploaded Image:
- **Assembled Air Quality Breadboard Station with 16x2 LCD:**
  ![Environmental Air Quality Monitor Station](1.jpg)

### Integrated App Asset:
`/src/assets/images/air_quality_station_1792086691081.jpg`

### Verified Specifications & Bill of Materials:
- **Telemetry Display:** 16x2 Parallel/I2C Alphanumeric LCD display (green backlight) displaying live metrics:
  - Line 1: `TEMP: 28.9C  HUMID: 76%`
  - Line 2: `GAS: 54 PPM`
- **Sensors:**
  - Calibrated DHT11/DHT22 digital relative humidity and temperature sensor
  - MQ-135 wide-spectrum electrochemical gas sensor with stainless steel mesh for hazardous smoke/alcohol/gas detection
- **Audio Alarm:** Active piezoelectric alarm buzzer triggered upon gas exceeding safety limits
- **Mounting:** Clean white acrylic benchtop test substrate with pre-routed wiring harnesses

---

## 5. Active Single-Axis Solar Sun Tracking System STEM Kit
**SKU:** `BALKI-ATL-A85-SOLARTRACK` | **Item 85, Package A** | **Category:** Physics & Clean Tech

### User-Uploaded Images:
- **Multi-Angle Physical Prototype Photographs:**
  - High-angle front view: ![Solar Tracker High Angle](5.jpg)
  - Rear motor mount & wiring: ![Solar Tracker Rear](4.jpg)
  - Isometric perspective: ![Solar Tracker Isometric](3.jpg)
  - Front straight-on view: ![Solar Tracker Front](2.jpg)
  - Swivel tilt angle view: ![Solar Tracker Tilt](1.jpg)

### Integrated App Asset:
`/src/assets/images/solar_tracker_kit_1792086691736.jpg`

### Verified Specifications & Bill of Materials:
- **Photovoltaic Cell:** Monocrystalline silicon solar panel mounted on a hinged tilt bracket
- **Tracking Mechanism:** Dual light-dependent resistors (LDRs) housed inside black cylindrical shrouds to create optical shadowing angles
- **Actuation:** High-torque yellow BO dual-shaft geared DC motor driving the panel tilt swivel
- **Control Electronics:** Dedicated analog comparator motor driver circuit board adjusting motor polarity based on differential LDR illumination
- **Chassis:** Sturdy yellow and orange laser-cut base plate with dual 9V power supplies
