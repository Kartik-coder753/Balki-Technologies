import { ProductCategory } from '../types';

export interface ATLLineItem {
  sNo: number;
  packageCode: 'A' | 'B' | 'C' | 'D';
  atlItemName: string;
  offeredMakeModel: string;
  type: 'Consumable' | 'Non-Consumable';
  qty: number;
  unitRate: number;
  amount: number;
  category: ProductCategory;
}

export interface ATLQuotationPackage {
  id: string;
  code: 'Package A' | 'Package B' | 'Package C' | 'Package D' | 'Package E';
  title: string;
  scope: string;
  lineItemsCount: number;
  subTotal: number;
  gstRate: number;
  gstAmount: number;
  roundOff: number;
  grandTotal: number;
  grandTotalWords: string;
  quotationNo: string;
  date: string;
  validUntil: string;
  reference: string;
  badge: string;
  themeColor: string;
  highlights: string[];
  lineItems: ATLLineItem[];
}

export const ALL_ATL_LINE_ITEMS: ATLLineItem[] = [
  // SECTION A: Electronics & IoT (Items 1 - 111)
  { sNo: 1, packageCode: 'A', atlItemName: 'Microcontroller Development Board', offeredMakeModel: 'Arduino UNO R4 Minima Board', type: 'Consumable', qty: 20, unitRate: 937.50, amount: 18750.00, category: 'microcontrollers' },
  { sNo: 2, packageCode: 'A', atlItemName: 'Compact Small sized Microcontroller Development Board', offeredMakeModel: 'ATmega328P 5V Nano V3.0 Development Board 16MHz CH340 Type-C', type: 'Consumable', qty: 10, unitRate: 437.50, amount: 4375.00, category: 'microcontrollers' },
  { sNo: 3, packageCode: 'A', atlItemName: 'Wireless IoT Microcontroller Development Board', offeredMakeModel: 'ESP32-WROOM-32 38Pin Development Board WiFi+Bluetooth Ultra-Low Power Consumption Dual Core', type: 'Consumable', qty: 15, unitRate: 513.75, amount: 7706.25, category: 'microcontrollers' },
  { sNo: 4, packageCode: 'A', atlItemName: 'Breadboards & mini breadboard', offeredMakeModel: '400 Tie Points Contacts Mini Circuit Experiment Solderless Breadboard', type: 'Consumable', qty: 30, unitRate: 43.75, amount: 1312.50, category: 'physics-lab' },
  { sNo: 5, packageCode: 'A', atlItemName: 'Breadboards & mini breadboard', offeredMakeModel: 'MB102 830 Points Solderless Prototype PCB Breadboard High Quality', type: 'Consumable', qty: 20, unitRate: 76.25, amount: 1525.00, category: 'physics-lab' },
  { sNo: 6, packageCode: 'A', atlItemName: 'General Purpose solderable Board', offeredMakeModel: 'FR2 A Grade Material-(140 x 90 mm) PCB', type: 'Consumable', qty: 30, unitRate: 40.00, amount: 1200.00, category: 'physics-lab' },
  { sNo: 7, packageCode: 'A', atlItemName: 'General Purpose solderable Board', offeredMakeModel: '6 x 8 cm Universal PCB Prototype Board Single-Sided 2.54mm Hole Pitch', type: 'Consumable', qty: 30, unitRate: 36.25, amount: 1087.50, category: 'physics-lab' },
  { sNo: 8, packageCode: 'A', atlItemName: 'Berg Strips', offeredMakeModel: '2.54mm 1x40 Pin Female Single Row Header Strip', type: 'Consumable', qty: 30, unitRate: 13.75, amount: 412.50, category: 'physics-lab' },
  { sNo: 9, packageCode: 'A', atlItemName: 'Berg Strips', offeredMakeModel: '2.54mm 1x40 Pin Male Single Row Straight Short Header Strip', type: 'Consumable', qty: 30, unitRate: 11.25, amount: 337.50, category: 'physics-lab' },
  { sNo: 10, packageCode: 'A', atlItemName: '16x2 LCD display', offeredMakeModel: 'LCD1602 Parallel LCD Display with IIC/I2C interface', type: 'Consumable', qty: 20, unitRate: 221.25, amount: 4425.00, category: 'sensors' },
  { sNo: 11, packageCode: 'A', atlItemName: 'USB Cables', offeredMakeModel: 'Arduino USB A-B 50cm Data Cable High-Quality for UNO/MEGA', type: 'Consumable', qty: 10, unitRate: 42.50, amount: 425.00, category: 'physics-lab' },
  { sNo: 12, packageCode: 'A', atlItemName: 'USB Cables', offeredMakeModel: 'Arduino Nano USB A-Mini B 30cm Cable Reliable Data Transfer', type: 'Consumable', qty: 10, unitRate: 25.45, amount: 254.50, category: 'physics-lab' },
  { sNo: 13, packageCode: 'A', atlItemName: 'USB Cables', offeredMakeModel: 'USB Type-A to Type-C Data Cable, 30cm Blue Compatible with Arduino UNO R3 Boards', type: 'Consumable', qty: 10, unitRate: 72.50, amount: 725.00, category: 'physics-lab' },
  { sNo: 14, packageCode: 'A', atlItemName: 'Battery', offeredMakeModel: '3.7V 2500mAh 18650 Li-Ion Rechargeable Battery + 3-Slot Case + 4-Slot AC-DC Smart Charger with LED Indicator', type: 'Consumable', qty: 10, unitRate: 738.40, amount: 7384.00, category: 'physics-lab' },
  { sNo: 15, packageCode: 'A', atlItemName: 'Battery', offeredMakeModel: 'Envie 9V Infinite 900mAh USB Type-C Rechargeable Battery Fast Charging Low Self Discharge', type: 'Consumable', qty: 10, unitRate: 448.75, amount: 4487.50, category: 'physics-lab' },
  { sNo: 16, packageCode: 'A', atlItemName: 'Resistor Kit', offeredMakeModel: 'Assorted resistor kit (600 pcs)', type: 'Consumable', qty: 1, unitRate: 1062.50, amount: 1062.50, category: 'physics-lab' },
  { sNo: 17, packageCode: 'A', atlItemName: 'Capacitor Kit', offeredMakeModel: 'Assorted capacitor kit', type: 'Consumable', qty: 1, unitRate: 699.50, amount: 699.50, category: 'physics-lab' },
  { sNo: 18, packageCode: 'A', atlItemName: 'Linear Voltage Regulator', offeredMakeModel: 'L78M05CV (L7805CV) TO-220 Linear Voltage Regulator', type: 'Consumable', qty: 10, unitRate: 14.25, amount: 142.50, category: 'physics-lab' },
  { sNo: 19, packageCode: 'A', atlItemName: 'Linear Voltage Regulator', offeredMakeModel: 'LM7812 12V Linear Positive Voltage Regulator - TO-220 Package', type: 'Consumable', qty: 10, unitRate: 20.00, amount: 200.00, category: 'physics-lab' },
  { sNo: 20, packageCode: 'A', atlItemName: 'Linear Voltage Regulator', offeredMakeModel: 'LM7809 - 9V Positive Voltage Regulator (To-220)', type: 'Consumable', qty: 5, unitRate: 12.50, amount: 62.50, category: 'physics-lab' },
  { sNo: 21, packageCode: 'A', atlItemName: 'Linear Voltage Regulator', offeredMakeModel: 'AMS1117-3.3V, 1A, SOT-223 Voltage Regulator IC', type: 'Consumable', qty: 10, unitRate: 11.25, amount: 112.50, category: 'physics-lab' },
  { sNo: 22, packageCode: 'A', atlItemName: 'Linear Voltage Regulator', offeredMakeModel: 'AMS1117-5.0V, 1A, SOT-223 Voltage Regulator IC', type: 'Consumable', qty: 10, unitRate: 11.25, amount: 112.50, category: 'physics-lab' },
  { sNo: 23, packageCode: 'A', atlItemName: 'Piezoelectric Plate', offeredMakeModel: 'Piezo Buzzer 40mm with Cable', type: 'Consumable', qty: 10, unitRate: 44.38, amount: 443.80, category: 'sensors' },
  { sNo: 24, packageCode: 'A', atlItemName: '8*8 LED Matrix Module', offeredMakeModel: 'MAX7219 Dot Led Matrix Module MCU Control LED Display Module', type: 'Consumable', qty: 10, unitRate: 146.25, amount: 1462.50, category: 'sensors' },
  { sNo: 25, packageCode: 'A', atlItemName: 'Bluetooth module', offeredMakeModel: 'HC-05 6pin Bluetooth Module with Button', type: 'Consumable', qty: 15, unitRate: 243.75, amount: 3656.25, category: 'sensors' },
  { sNo: 26, packageCode: 'A', atlItemName: '7 Segment Led Display Module', offeredMakeModel: 'TM1637 4 Bits Digital Tube LED Display Module With Clock Display for Arduino', type: 'Consumable', qty: 10, unitRate: 55.00, amount: 550.00, category: 'sensors' },
  { sNo: 27, packageCode: 'A', atlItemName: 'GSM Module', offeredMakeModel: 'SIM800L V2 5V Wireless GSM GPRS MODULE Quad-Band with Antenna', type: 'Consumable', qty: 2, unitRate: 550.00, amount: 1100.00, category: 'sensors' },
  { sNo: 28, packageCode: 'A', atlItemName: 'GPS Module', offeredMakeModel: 'GY-NEO6MV2 GPS Module With Flight Control with Antenna', type: 'Consumable', qty: 2, unitRate: 623.75, amount: 1247.50, category: 'sensors' },
  { sNo: 29, packageCode: 'A', atlItemName: 'Laser Diode Emitter Module', offeredMakeModel: '650nm 6mm 5V DC 5mW Mini Laser Dot Diode Module', type: 'Consumable', qty: 10, unitRate: 18.75, amount: 187.50, category: 'sensors' },
  { sNo: 30, packageCode: 'A', atlItemName: 'LDR Module', offeredMakeModel: 'LM393 Light-Dependent Resistor Sensor Module', type: 'Consumable', qty: 30, unitRate: 36.25, amount: 1087.50, category: 'sensors' },
  { sNo: 31, packageCode: 'A', atlItemName: 'Keypad', offeredMakeModel: '4×4 Matrix Keypad Membrane Switch for Arduino, ARM and other MCU', type: 'Consumable', qty: 6, unitRate: 48.75, amount: 292.50, category: 'sensors' },
  { sNo: 32, packageCode: 'A', atlItemName: 'Active Buzzer', offeredMakeModel: '5V Active Electromagnetic Buzzer', type: 'Consumable', qty: 20, unitRate: 20.00, amount: 400.00, category: 'sensors' },
  { sNo: 33, packageCode: 'A', atlItemName: 'Active Buzzer', offeredMakeModel: 'Large buzzer', type: 'Consumable', qty: 20, unitRate: 31.25, amount: 625.00, category: 'sensors' },
  { sNo: 34, packageCode: 'A', atlItemName: 'Sound Playback Module', offeredMakeModel: 'ISD1820 Voice Recording Module with Speaker Support', type: 'Consumable', qty: 10, unitRate: 177.50, amount: 1775.00, category: 'sensors' },
  { sNo: 35, packageCode: 'A', atlItemName: 'Node MCU', offeredMakeModel: 'ESP8266 NodeMCU CP2102 Board', type: 'Consumable', qty: 6, unitRate: 296.25, amount: 1777.50, category: 'microcontrollers' },
  { sNo: 36, packageCode: 'A', atlItemName: 'ESP32 Module', offeredMakeModel: 'ESP-WROOM-32 WIFI Bluetooth Networking Smart Component Development Board', type: 'Consumable', qty: 6, unitRate: 493.75, amount: 2962.50, category: 'microcontrollers' },
  { sNo: 37, packageCode: 'A', atlItemName: 'Alligator Connectors', offeredMakeModel: 'Alligator Clips Electrical DIY Test Leads 10pcs of Double-ended Crocodile Clips Roach Clip', type: 'Consumable', qty: 20, unitRate: 82.50, amount: 1650.00, category: 'physics-lab' },
  { sNo: 38, packageCode: 'A', atlItemName: 'Battery clips with DC Jack', offeredMakeModel: '9v Battery Connector + DC Jack(Battery Connector Cap) 10pcs Pack', type: 'Consumable', qty: 40, unitRate: 15.38, amount: 615.20, category: 'physics-lab' },
  { sNo: 39, packageCode: 'A', atlItemName: 'Hook-up Wires', offeredMakeModel: 'Hook-up wire 400m red+black', type: 'Consumable', qty: 1, unitRate: 1500.00, amount: 1500.00, category: 'physics-lab' },
  { sNo: 40, packageCode: 'A', atlItemName: 'Jumper Cable (Ribbon cable)', offeredMakeModel: 'Male-Male jumper 1000pcs', type: 'Consumable', qty: 1, unitRate: 1562.50, amount: 1562.50, category: 'physics-lab' },
  { sNo: 41, packageCode: 'A', atlItemName: 'Jumper Cable (Ribbon cable)', offeredMakeModel: 'Male-Female jumper 600pcs', type: 'Consumable', qty: 1, unitRate: 1012.50, amount: 1012.50, category: 'physics-lab' },
  { sNo: 42, packageCode: 'A', atlItemName: 'Jumper Cable (Ribbon cable)', offeredMakeModel: 'Female-Female jumper 400pcs', type: 'Consumable', qty: 1, unitRate: 875.00, amount: 875.00, category: 'physics-lab' },
  { sNo: 43, packageCode: 'A', atlItemName: 'RGB LEDs', offeredMakeModel: 'XL-B504RGBW-XINGLIGHT-Plugin,D=5mm RGB LEDs ROHS', type: 'Consumable', qty: 300, unitRate: 8.75, amount: 2625.00, category: 'physics-lab' },
  { sNo: 44, packageCode: 'A', atlItemName: 'LEDs (Red)', offeredMakeModel: '5mm Red DIP LED', type: 'Consumable', qty: 1000, unitRate: 1.93, amount: 1930.00, category: 'physics-lab' },
  { sNo: 45, packageCode: 'A', atlItemName: 'LEDs (Green)', offeredMakeModel: '5mm Green DIP LED', type: 'Consumable', qty: 1000, unitRate: 2.39, amount: 2390.00, category: 'physics-lab' },
  { sNo: 46, packageCode: 'A', atlItemName: 'LEDs (Blue)', offeredMakeModel: '5mm Blue DIP LED', type: 'Consumable', qty: 1000, unitRate: 2.07, amount: 2070.00, category: 'physics-lab' },
  { sNo: 47, packageCode: 'A', atlItemName: 'LEDs (Yellow)', offeredMakeModel: '5mm DIP LED Yellow', type: 'Consumable', qty: 1000, unitRate: 1.30, amount: 1300.00, category: 'physics-lab' },
  { sNo: 48, packageCode: 'A', atlItemName: 'LEDs (White)', offeredMakeModel: '5mm DIP LED White', type: 'Consumable', qty: 1000, unitRate: 2.05, amount: 2050.00, category: 'physics-lab' },
  { sNo: 49, packageCode: 'A', atlItemName: 'Timer IC - LM 555', offeredMakeModel: 'NE 555 P PDIP-8 Timer IC', type: 'Consumable', qty: 15, unitRate: 12.00, amount: 180.00, category: 'physics-lab' },
  { sNo: 50, packageCode: 'A', atlItemName: 'Diodes and Transistors Kit', offeredMakeModel: 'Diode/transistor assortment kit', type: 'Consumable', qty: 3, unitRate: 240.94, amount: 722.82, category: 'physics-lab' },
  { sNo: 51, packageCode: 'A', atlItemName: 'Button Switch Set', offeredMakeModel: 'Assorted switch kit (100 pcs)', type: 'Consumable', qty: 3, unitRate: 312.50, amount: 937.50, category: 'physics-lab' },
  { sNo: 52, packageCode: 'A', atlItemName: 'Capacitive Touch Switch Module', offeredMakeModel: 'TTP223 Touch Key Module - 2Pcs', type: 'Consumable', qty: 10, unitRate: 16.25, amount: 162.50, category: 'sensors' },
  { sNo: 53, packageCode: 'A', atlItemName: 'Triple Axis Magnetometer MPU6050', offeredMakeModel: 'MPU-6050 3-Axis Accelerometer and Gyro Sensor', type: 'Consumable', qty: 10, unitRate: 188.75, amount: 1887.50, category: 'sensors' },
  { sNo: 54, packageCode: 'A', atlItemName: 'IR Sensors, sensor module', offeredMakeModel: 'Infrared Obstacle Avoidance Sensor Module (Active Low)', type: 'Consumable', qty: 20, unitRate: 32.50, amount: 650.00, category: 'sensors' },
  { sNo: 55, packageCode: 'A', atlItemName: 'Humidity & Temperature Sensor DHT22', offeredMakeModel: 'DHT22 AM2302 Digital Temperature & Humidity Sensor Module', type: 'Consumable', qty: 10, unitRate: 131.25, amount: 1312.50, category: 'sensors' },
  { sNo: 56, packageCode: 'A', atlItemName: 'MQ Series Sensor', offeredMakeModel: 'MQ-2 Smoke LPG Butane Hydrogen Gas Sensor Module', type: 'Consumable', qty: 3, unitRate: 116.25, amount: 348.75, category: 'sensors' },
  { sNo: 57, packageCode: 'A', atlItemName: 'MQ Series Sensor', offeredMakeModel: 'MQ-3 Alcohol Gas Detector Sensor Module', type: 'Consumable', qty: 3, unitRate: 136.25, amount: 408.75, category: 'sensors' },
  { sNo: 58, packageCode: 'A', atlItemName: 'MQ Series Sensor', offeredMakeModel: 'MQ-4 Methane CNG Gas Detector High Sensitivity Module', type: 'Consumable', qty: 3, unitRate: 120.00, amount: 360.00, category: 'sensors' },
  { sNo: 59, packageCode: 'A', atlItemName: 'MQ Series Sensor', offeredMakeModel: 'MQ-5 Methane LPG Propane Gas Sensor Module', type: 'Consumable', qty: 3, unitRate: 125.00, amount: 375.00, category: 'sensors' },
  { sNo: 60, packageCode: 'A', atlItemName: 'MQ Series Sensor', offeredMakeModel: 'MQ-6 Propane Isobutane LPG Gas Sensor Module', type: 'Consumable', qty: 3, unitRate: 136.25, amount: 408.75, category: 'sensors' },
  { sNo: 61, packageCode: 'A', atlItemName: 'MQ Series Sensor', offeredMakeModel: 'MQ-7 CO Carbon Monoxide Gas Sensor Module', type: 'Consumable', qty: 3, unitRate: 145.00, amount: 435.00, category: 'sensors' },
  { sNo: 62, packageCode: 'A', atlItemName: 'MQ Series Sensor', offeredMakeModel: 'MQ-8 Hydrogen H2 Gas Sensor Alarm Detection Module', type: 'Consumable', qty: 3, unitRate: 128.75, amount: 386.25, category: 'sensors' },
  { sNo: 63, packageCode: 'A', atlItemName: 'MQ Series Sensor', offeredMakeModel: 'MQ 135 Air Quality/Gas Detector Sensor Module For Arduino', type: 'Consumable', qty: 3, unitRate: 130.00, amount: 390.00, category: 'sensors' },
  { sNo: 64, packageCode: 'A', atlItemName: 'IR transmitter/receiver', offeredMakeModel: 'TSOP1738 IR Receiver – Infrared Receiver', type: 'Consumable', qty: 10, unitRate: 53.75, amount: 537.50, category: 'sensors' },
  { sNo: 65, packageCode: 'A', atlItemName: 'Ultrasonic Sensor Module HC-SR-04 or compatible', offeredMakeModel: 'HC-SR04 Ultrasonic Range Finder Sensor Module for Arduino', type: 'Consumable', qty: 40, unitRate: 86.25, amount: 3450.00, category: 'sensors' },
  { sNo: 66, packageCode: 'A', atlItemName: 'Triple Axis accelerometer ADXL335', offeredMakeModel: 'ADXL345 Triple-Axis Accelerometer Sensor Module', type: 'Consumable', qty: 10, unitRate: 311.25, amount: 3112.50, category: 'sensors' },
  { sNo: 67, packageCode: 'A', atlItemName: 'PIR Motion Detector Module', offeredMakeModel: 'HC-SR501 PIR Motion Detector Sensor Module', type: 'Consumable', qty: 20, unitRate: 77.50, amount: 1550.00, category: 'sensors' },
  { sNo: 68, packageCode: 'A', atlItemName: 'Pulse Rate Heart Sensor', offeredMakeModel: 'Pulse Sensor Amped Heart Rate Monitor for Arduino', type: 'Consumable', qty: 4, unitRate: 176.25, amount: 705.00, category: 'sensors' },
  { sNo: 69, packageCode: 'A', atlItemName: 'Big Sound microphone module', offeredMakeModel: 'Sound Detection Sensor Module for Arduino Robots', type: 'Consumable', qty: 10, unitRate: 60.00, amount: 600.00, category: 'sensors' },
  { sNo: 70, packageCode: 'A', atlItemName: 'Soil Moisture Sensor module', offeredMakeModel: 'Soil Moisture Sensor Hygrometer Module Compatible with Arduino', type: 'Consumable', qty: 6, unitRate: 41.25, amount: 247.50, category: 'sensors' },
  { sNo: 71, packageCode: 'A', atlItemName: 'Rain Drop Sensor', offeredMakeModel: 'Raindrop Detection Sensor Module Rain Sensor for Arduino', type: 'Consumable', qty: 6, unitRate: 56.25, amount: 337.50, category: 'sensors' },
  { sNo: 72, packageCode: 'A', atlItemName: 'Metal Touch Sensor Module', offeredMakeModel: 'Touch Sensor Switch Module', type: 'Consumable', qty: 6, unitRate: 48.75, amount: 292.50, category: 'sensors' },
  { sNo: 73, packageCode: 'A', atlItemName: 'Flex Sensor', offeredMakeModel: 'Flex Sensor 2.2″ Bend Sensor for Hand Gesture Recognition', type: 'Consumable', qty: 6, unitRate: 290.00, amount: 1740.00, category: 'sensors' },
  { sNo: 74, packageCode: 'A', atlItemName: 'Temperature Sensor', offeredMakeModel: 'LM35DZ/NOPB-Texas Instruments-±1.5℃ TO-92 Temperature Sensors ROHS', type: 'Consumable', qty: 6, unitRate: 97.50, amount: 585.00, category: 'sensors' },
  { sNo: 75, packageCode: 'A', atlItemName: 'Force Pressure Sensor', offeredMakeModel: 'Force sensitive resistor', type: 'Consumable', qty: 4, unitRate: 350.00, amount: 1400.00, category: 'sensors' },
  { sNo: 76, packageCode: 'A', atlItemName: 'Colour Recognition Sensor', offeredMakeModel: 'TCS3200 Color Recognition Sensor Module for Arduino', type: 'Consumable', qty: 4, unitRate: 740.00, amount: 2960.00, category: 'sensors' },
  { sNo: 77, packageCode: 'A', atlItemName: 'Water Flow Sensor', offeredMakeModel: 'YF-S201 Water Flow Sensor 1–30 L/min Black', type: 'Consumable', qty: 4, unitRate: 252.50, amount: 1010.00, category: 'sensors' },
  { sNo: 78, packageCode: 'A', atlItemName: 'Sound Sensor', offeredMakeModel: 'Sound Detection Sensor Module for Arduino Robots', type: 'Consumable', qty: 10, unitRate: 60.00, amount: 600.00, category: 'sensors' },
  { sNo: 79, packageCode: 'A', atlItemName: 'Power Bank', offeredMakeModel: '10000mAh power bank', type: 'Consumable', qty: 5, unitRate: 812.50, amount: 4062.50, category: 'physics-lab' },
  { sNo: 80, packageCode: 'A', atlItemName: 'RFID Reader & Tags', offeredMakeModel: 'RC522 RFID Reader Writer SPI Module with Card & Tag', type: 'Consumable', qty: 6, unitRate: 80.00, amount: 480.00, category: 'sensors' },
  { sNo: 81, packageCode: 'A', atlItemName: 'RF Modules Tx & Rx 315 MHz ASK', offeredMakeModel: '315MHz RF Transmitter Receiver Module Wireless Link Kit for Arduino', type: 'Consumable', qty: 10, unitRate: 98.75, amount: 987.50, category: 'sensors' },
  { sNo: 82, packageCode: 'A', atlItemName: 'Bio-Medical Kit', offeredMakeModel: 'Bio-Medical kit (Clinical Physiology Sensor Module)', type: 'Non-Consumable', qty: 1, unitRate: 6875.00, amount: 6875.00, category: 'biology-anatomy' },
  { sNo: 83, packageCode: 'A', atlItemName: 'Agri-Tech Kit', offeredMakeModel: 'OM LABS Agri-Tech Arduino STEM Kit (Soil Moisture, Rain Drop, Humidity, Temp, Light, Flame, Gas)', type: 'Non-Consumable', qty: 1, unitRate: 2886.25, amount: 2886.25, category: 'biology-anatomy' },
  { sNo: 84, packageCode: 'A', atlItemName: 'Water/Sanitation Kit', offeredMakeModel: 'OM LABS Water/Sanitation Arduino STEM Kit (pH, Turbidity, TDS, Water Temperature, Water Pump, Flow)', type: 'Non-Consumable', qty: 1, unitRate: 5586.25, amount: 5586.25, category: 'biology-anatomy' },
  { sNo: 85, packageCode: 'A', atlItemName: 'Solar Energy Experiment Kit', offeredMakeModel: 'SOLAR ENERGY KIT (PV Panel, Multimeter, Load Cells, Angle Calibration)', type: 'Non-Consumable', qty: 2, unitRate: 1031.25, amount: 2062.50, category: 'physics-lab' },
  { sNo: 86, packageCode: 'A', atlItemName: 'Load Cell Sensor 1Kg (with connecting wires)', offeredMakeModel: 'Phaeton Load Cell Sensor 611E 01 200KG Weighing Aluminum Alloy', type: 'Consumable', qty: 10, unitRate: 156.25, amount: 1562.50, category: 'sensors' },
  { sNo: 87, packageCode: 'A', atlItemName: 'DC Regulated Power Supply 0-30V, 5 Amp', offeredMakeModel: 'Wanptek WPS305H 30V/5A Variable Adjustable Switching Power Source DC Power Supply', type: 'Consumable', qty: 1, unitRate: 8936.25, amount: 8936.25, category: 'physics-lab' },
  { sNo: 88, packageCode: 'A', atlItemName: 'DPDT switches', offeredMakeModel: 'Slide Switch-DPDT Surface Mount, JS Series, 300 mA', type: 'Consumable', qty: 20, unitRate: 11.25, amount: 225.00, category: 'physics-lab' },
  { sNo: 89, packageCode: 'A', atlItemName: 'ATtiny85 microcontroller board', offeredMakeModel: 'ATTINY85 USB Development Board', type: 'Consumable', qty: 5, unitRate: 267.50, amount: 1337.50, category: 'microcontrollers' },
  { sNo: 90, packageCode: 'A', atlItemName: 'Hall effect sensor Module', offeredMakeModel: 'A3144 Hall Effect Magnetic Sensor Module', type: 'Consumable', qty: 5, unitRate: 35.00, amount: 175.00, category: 'sensors' },
  { sNo: 91, packageCode: 'A', atlItemName: 'Peltier module - 40x40mm Thermoelectric Cooler 6A', offeredMakeModel: 'TEC1-12706 40×40mm 6A Thermoelectric Peltier Cooler', type: 'Consumable', qty: 5, unitRate: 220.00, amount: 1100.00, category: 'physics-lab' },
  { sNo: 92, packageCode: 'A', atlItemName: '400 mAh 3.7V single cell Rechargeable LiPo Battery', offeredMakeModel: 'WLY502040 3.7V 400mAh 1S LiPo Battery – Micro Rechargeable Battery Pack for Wearables / Robotics / IoT', type: 'Consumable', qty: 15, unitRate: 168.75, amount: 2531.25, category: 'physics-lab' },
  { sNo: 93, packageCode: 'A', atlItemName: 'Flame sensor', offeredMakeModel: 'Flame Sensor Module', type: 'Consumable', qty: 4, unitRate: 45.00, amount: 180.00, category: 'sensors' },
  { sNo: 94, packageCode: 'A', atlItemName: '1.3-inch Yellow-Blue OLED Display Module', offeredMakeModel: '1.3 Inch I2C OLED Display Module 4 Pin WHITE', type: 'Consumable', qty: 5, unitRate: 368.75, amount: 1843.75, category: 'sensors' },
  { sNo: 95, packageCode: 'A', atlItemName: 'Coin Cells', offeredMakeModel: 'Panasonic CR2032 3V Lithium Coin Battery - pack of 1', type: 'Consumable', qty: 20, unitRate: 71.25, amount: 1425.00, category: 'physics-lab' },
  { sNo: 96, packageCode: 'A', atlItemName: '9V Alkaline Battery', offeredMakeModel: '9V Original HW High-Quality Battery-5Pcs', type: 'Consumable', qty: 20, unitRate: 151.25, amount: 3025.00, category: 'physics-lab' },
  { sNo: 97, packageCode: 'A', atlItemName: 'DF Player', offeredMakeModel: 'DFRobot Fermion DFPlayer Pro MP3 Player with 128MB Storage', type: 'Consumable', qty: 5, unitRate: 1211.25, amount: 6056.25, category: 'sensors' },
  { sNo: 98, packageCode: 'A', atlItemName: 'Turbidity Sensor', offeredMakeModel: 'Turbidity Sensor with Module', type: 'Consumable', qty: 2, unitRate: 611.25, amount: 1222.50, category: 'sensors' },
  { sNo: 99, packageCode: 'A', atlItemName: 'SD Card Reading Writing Module for Arduino', offeredMakeModel: 'SD Card Reading Writing Module for Arduino', type: 'Non-Consumable', qty: 5, unitRate: 68.75, amount: 343.75, category: 'sensors' },
  { sNo: 100, packageCode: 'A', atlItemName: 'Micro SD Card Reader Module', offeredMakeModel: 'Micro SD Card Reader Module', type: 'Non-Consumable', qty: 5, unitRate: 43.75, amount: 218.75, category: 'sensors' },
  { sNo: 101, packageCode: 'A', atlItemName: 'DS18B20 Waterproof Temperature Probe (Sensor) – Black (1m)', offeredMakeModel: 'DS18B20 Water Proof Temperature Probe – Black (1m)', type: 'Consumable', qty: 5, unitRate: 63.75, amount: 318.75, category: 'sensors' },
  { sNo: 102, packageCode: 'A', atlItemName: 'HX711 Load Cell Amplifier Module', offeredMakeModel: 'HX711 24-Bit Dual Channel Load Cell Amplifier Weight Sensor', type: 'Consumable', qty: 5, unitRate: 53.75, amount: 268.75, category: 'sensors' },
  { sNo: 103, packageCode: 'A', atlItemName: 'Real Time Clock DS1307 RTC I2C Module', offeredMakeModel: 'Tiny RTC Real Time Clock DS1307 I2C IIC Module for Arduino(Without cell)', type: 'Consumable', qty: 10, unitRate: 52.50, amount: 525.00, category: 'sensors' },
  { sNo: 104, packageCode: 'A', atlItemName: 'DC5V Humidifier USB Spray Module - 108KHz', offeredMakeModel: 'DC5V Humidifier USB Spray Module 108KHz', type: 'Consumable', qty: 5, unitRate: 198.75, amount: 993.75, category: 'sensors' },
  { sNo: 105, packageCode: 'A', atlItemName: 'LM358 Gain Amplification Module Operational Amplifier', offeredMakeModel: 'XD-21 LM358 Gain Amplification Module Operational Amplifier Module', type: 'Consumable', qty: 10, unitRate: 52.50, amount: 525.00, category: 'physics-lab' },
  { sNo: 106, packageCode: 'A', atlItemName: 'XL4015 5A DC-DC Step Down Adjustable Power Supply Buck Module LED with Heatsink', offeredMakeModel: 'XL4015 5A Step Down Adjustable Power Supply with LED Voltmeter', type: 'Consumable', qty: 5, unitRate: 305.00, amount: 1525.00, category: 'physics-lab' },
  { sNo: 107, packageCode: 'A', atlItemName: 'PMS7003 Sensor Module PM2.5 Air, Particle Dust Sensor (with connecting Cable)', offeredMakeModel: 'PMS7003 Sensor Module PM2.5 Air, Particle Dust Sensor', type: 'Consumable', qty: 2, unitRate: 1768.75, amount: 3537.50, category: 'sensors' },
  { sNo: 108, packageCode: 'A', atlItemName: 'PAM8403 Mini 5V Digital Amplifier Board with Switch Potentiometer', offeredMakeModel: 'PAM8403 Mini 5V Digital Amplifier Board With Switch Potentiometer', type: 'Consumable', qty: 5, unitRate: 75.00, amount: 375.00, category: 'physics-lab' },
  { sNo: 109, packageCode: 'A', atlItemName: 'WS2812B Addressable RGB LED Strip - 5V - 60 LEDs / 5 meter - Inbuilt chip', offeredMakeModel: '1M WS2812B 5V Addressable RGB Non-Waterproof LED Strip Light 60LED\'s/Mtr', type: 'Consumable', qty: 1, unitRate: 573.75, amount: 573.75, category: 'physics-lab' },
  { sNo: 110, packageCode: 'A', atlItemName: '2 Way Quick Push Type Lock Electric Wire Connectors', offeredMakeModel: 'CH-2 Way Quick Push Type Lock Electric Wire Connectors Terminal (Pack of 5 Pcs)', type: 'Consumable', qty: 4, unitRate: 50.00, amount: 200.00, category: 'physics-lab' },
  { sNo: 111, packageCode: 'A', atlItemName: 'Bio Tech Kit', offeredMakeModel: 'OM LABS Bio-Tech Arduino STEM Kit (EMG, Pulse Rate, SpO2, Temperature & pH)', type: 'Non-Consumable', qty: 1, unitRate: 7023.75, amount: 7023.75, category: 'biology-anatomy' },

  // SECTION B: Robotics & Automation (Items 112 - 140 / S.No 1-29 in Package B)
  { sNo: 112, packageCode: 'B', atlItemName: 'Water Pump module', offeredMakeModel: 'Submersible mini water Pump 3 to 9V', type: 'Consumable', qty: 10, unitRate: 46.25, amount: 462.50, category: 'robotics-mechanics' },
  { sNo: 113, packageCode: 'B', atlItemName: 'Joystick Module', offeredMakeModel: 'PS2 Joystick Module Breakout Sensor', type: 'Consumable', qty: 6, unitRate: 42.50, amount: 255.00, category: 'sensors' },
  { sNo: 114, packageCode: 'B', atlItemName: 'Motor driver Module - L293D', offeredMakeModel: 'L293D Motor Driver Module', type: 'Consumable', qty: 10, unitRate: 113.75, amount: 1137.50, category: 'robotics-mechanics' },
  { sNo: 115, packageCode: 'B', atlItemName: 'DC Plastic Gear motor with wheel', offeredMakeModel: '150 RPM Single Shaft BO Motor', type: 'Consumable', qty: 12, unitRate: 71.25, amount: 855.00, category: 'robotics-mechanics' },
  { sNo: 116, packageCode: 'B', atlItemName: 'DC Plastic Gear motor with wheel', offeredMakeModel: '300 RPM BO Motor-Straight', type: 'Consumable', qty: 12, unitRate: 83.75, amount: 1005.00, category: 'robotics-mechanics' },
  { sNo: 117, packageCode: 'B', atlItemName: 'DC Plastic Gear motor with wheel', offeredMakeModel: '130–280 RPM Strong Magnet BO Motor – Dual Shaft (1B48 EMC)', type: 'Consumable', qty: 12, unitRate: 51.25, amount: 615.00, category: 'robotics-mechanics' },
  { sNo: 118, packageCode: 'B', atlItemName: 'DC Plastic Gear motor with wheel', offeredMakeModel: '60 RPM Dual Shaft BO Motor - Straight', type: 'Consumable', qty: 12, unitRate: 80.00, amount: 960.00, category: 'robotics-mechanics' },
  { sNo: 119, packageCode: 'B', atlItemName: 'DC Plastic Gear motor with wheel', offeredMakeModel: '300 RPM Dual Shaft BO Motor-Straight', type: 'Consumable', qty: 12, unitRate: 88.75, amount: 1065.00, category: 'robotics-mechanics' },
  { sNo: 120, packageCode: 'B', atlItemName: 'DC Plastic Gear motor with wheel', offeredMakeModel: 'Double Shaft BO Motor, 50 RPM', type: 'Consumable', qty: 12, unitRate: 80.00, amount: 960.00, category: 'robotics-mechanics' },
  { sNo: 121, packageCode: 'B', atlItemName: 'Wheels', offeredMakeModel: '65mm Robot Wheel for BO Motors (Yellow), Durable & Lightweight', type: 'Consumable', qty: 20, unitRate: 30.00, amount: 600.00, category: 'robotics-mechanics' },
  { sNo: 122, packageCode: 'B', atlItemName: 'DC Vibration Motor with Wire', offeredMakeModel: 'Flat 1034 Mobile Phone Vibrator Motor', type: 'Consumable', qty: 20, unitRate: 36.25, amount: 725.00, category: 'robotics-mechanics' },
  { sNo: 123, packageCode: 'B', atlItemName: 'Relay Module', offeredMakeModel: '5V 2 Channel Relay Module', type: 'Consumable', qty: 20, unitRate: 118.75, amount: 2375.00, category: 'robotics-mechanics' },
  { sNo: 124, packageCode: 'B', atlItemName: 'Relay Module', offeredMakeModel: '5V 4 Channel Relay Module', type: 'Consumable', qty: 20, unitRate: 195.00, amount: 3900.00, category: 'robotics-mechanics' },
  { sNo: 125, packageCode: 'B', atlItemName: 'Water Solenoid Valve', offeredMakeModel: 'YF-S201 Water Flow Sensor 1–30 L/min Black', type: 'Consumable', qty: 4, unitRate: 252.50, amount: 1010.00, category: 'robotics-mechanics' },
  { sNo: 126, packageCode: 'B', atlItemName: 'IR Sensors Array module for Line Following', offeredMakeModel: '3.3v-5v 8-Channel IR Sensor Array Line Follower Infrared Detection Module Board', type: 'Consumable', qty: 5, unitRate: 96.25, amount: 481.25, category: 'robotics-mechanics' },
  { sNo: 127, packageCode: 'B', atlItemName: 'Stepper motor with Driver board', offeredMakeModel: 'JK42HS48-1684-01 NEMA17 4.4 kg-cm Stepper Motor - Round Type Shaft, A4988 driver Stepper Motor Driver', type: 'Consumable', qty: 10, unitRate: 985.00, amount: 9850.00, category: 'robotics-mechanics' },
  { sNo: 128, packageCode: 'B', atlItemName: 'Stepper motor with Driver board', offeredMakeModel: 'JK42HS48-1684-01 NEMA17 4.4 kg-cm Stepper Motor - Round Type Shaft, A4988 driver Stepper Motor Driver', type: 'Consumable', qty: 10, unitRate: 985.00, amount: 9850.00, category: 'robotics-mechanics' },
  { sNo: 129, packageCode: 'B', atlItemName: 'DC motor', offeredMakeModel: 'DC Motor - 150RPM - 12Volts', type: 'Consumable', qty: 20, unitRate: 206.25, amount: 4125.00, category: 'robotics-mechanics' },
  { sNo: 130, packageCode: 'B', atlItemName: 'DC motor', offeredMakeModel: '12V 60 RPM Geared DC Motor', type: 'Consumable', qty: 20, unitRate: 168.75, amount: 3375.00, category: 'robotics-mechanics' },
  { sNo: 131, packageCode: 'B', atlItemName: 'L298P Motor Driver', offeredMakeModel: 'L298P Motor Driver Shield for Arduino', type: 'Consumable', qty: 10, unitRate: 661.25, amount: 6612.50, category: 'robotics-mechanics' },
  { sNo: 132, packageCode: 'B', atlItemName: 'Robotics DIY Kit', offeredMakeModel: 'WitBlox AI Artificial Intelligence Robotic Science Kit for 101+ Project 174 Part 8 Yrs+, Interlocking Bricks', type: 'Non-Consumable', qty: 3, unitRate: 4973.75, amount: 14921.25, category: 'robotics-mechanics' },
  { sNo: 133, packageCode: 'B', atlItemName: 'Mechanical (Modular) Construction kit', offeredMakeModel: 'Mechanix Steel Mega - 202 piece Building Kit I STEM/STEAM Toy for Adults, Kids, 8+, Tools & Manual Included', type: 'Non-Consumable', qty: 5, unitRate: 1250.00, amount: 6250.00, category: 'robotics-mechanics' },
  { sNo: 134, packageCode: 'B', atlItemName: 'Autonomous Mobile Robotics Kit', offeredMakeModel: 'Balki Smart 4WD Autonomous Navigation & Obstacle Avoidance Kit with ESP32, Sensors & Motor Drivers', type: 'Non-Consumable', qty: 1, unitRate: 4112.50, amount: 4112.50, category: 'robotics-mechanics' },
  { sNo: 135, packageCode: 'B', atlItemName: 'Aerospace Kit', offeredMakeModel: 'Smartivity Rocket Launcher', type: 'Non-Consumable', qty: 1, unitRate: 817.50, amount: 817.50, category: 'robotics-mechanics' },
  { sNo: 136, packageCode: 'B', atlItemName: 'Advance Metal Chassis for 4-wheel Robot (Red)', offeredMakeModel: 'Red 2WD Aluminum Smart Robot Car Chassis Kit DIY', type: 'Consumable', qty: 10, unitRate: 836.25, amount: 8362.50, category: 'robotics-mechanics' },
  { sNo: 137, packageCode: 'B', atlItemName: 'EV (Electric Vehicle) Kit', offeredMakeModel: 'EV Educational Prototype Kit with DC Motor, Controller, Battery Pack & Chassis', type: 'Non-Consumable', qty: 1, unitRate: 15000.00, amount: 15000.00, category: 'robotics-mechanics' },
  { sNo: 138, packageCode: 'B', atlItemName: 'Ball Caster Wheel', offeredMakeModel: 'MINI 3PI Car N20 Caster Robot Ball Wheel, Small Robotics Wheel', type: 'Consumable', qty: 20, unitRate: 43.75, amount: 875.00, category: 'robotics-mechanics' },
  { sNo: 139, packageCode: 'B', atlItemName: 'Ball Bearing Two Trees Miniature', offeredMakeModel: 'Two Trees Miniature bearings 624ZZ', type: 'Consumable', qty: 20, unitRate: 12.50, amount: 250.00, category: 'robotics-mechanics' },
  { sNo: 140, packageCode: 'B', atlItemName: 'Ball Bearing Large', offeredMakeModel: '608 ZZ Miniature Deep Groove Ball Bearing (8×22×7 mm) - Double Metal Shielded', type: 'Consumable', qty: 5, unitRate: 28.75, amount: 143.75, category: 'robotics-mechanics' },

  // SECTION C: AI/ML & Computer Vision (Items 141 - 147 / S.No 1-7 in Package C)
  { sNo: 141, packageCode: 'C', atlItemName: 'Single Board Computer Development Kit', offeredMakeModel: 'Raspberry Pi 5 Model 8GB RAM', type: 'Consumable', qty: 4, unitRate: 24998.75, amount: 99995.00, category: 'microcontrollers' },
  { sNo: 142, packageCode: 'C', atlItemName: 'ESP32 CAM Module', offeredMakeModel: 'ESP32-CAM WiFi + Bluetooth Module with OV2640 2MP Camera for Face Recognition', type: 'Consumable', qty: 6, unitRate: 923.75, amount: 5542.50, category: 'microcontrollers' },
  { sNo: 143, packageCode: 'C', atlItemName: 'AR/VR headsets (Unity, Unreal Engine compatible), haptic feedback devices, ARCore/ARKit tools', offeredMakeModel: 'Meta Quest 3S VR Headset (With Controllers) - 128GB', type: 'Non-Consumable', qty: 1, unitRate: 41250.00, amount: 41250.00, category: 'drone-3d' },
  { sNo: 144, packageCode: 'C', atlItemName: 'R307 Biometric Sensor Module', offeredMakeModel: 'R307S Optical Fingerprint Reader Sensor Module', type: 'Consumable', qty: 4, unitRate: 1186.25, amount: 4745.00, category: 'sensors' },
  { sNo: 145, packageCode: 'C', atlItemName: 'ESP 32 CAM Module', offeredMakeModel: 'ESP32-CAM-MB WIFI BLUETOOTH DEVELOPMENT BOARD WITH OV3660 CAMERA MICRO USB CONNECTION TO SERIAL', type: 'Non-Consumable', qty: 5, unitRate: 858.75, amount: 4293.75, category: 'microcontrollers' },
  { sNo: 146, packageCode: 'C', atlItemName: 'MicroSD Card - 16 GB', offeredMakeModel: 'SanDisk Ultra Micro SD 16GB UHS-I, 98MB/s R , Class 10 Memory Card', type: 'Non-Consumable', qty: 5, unitRate: 1836.25, amount: 9181.25, category: 'microcontrollers' },
  { sNo: 147, packageCode: 'C', atlItemName: 'AI & Machine Learning Kit', offeredMakeModel: 'Official Arduino Tiny Machine Learning Kit AKX00028 Starter Bundle Nano 33 BLE Sense, OV7675 Camera & Custom Shield', type: 'Non-Consumable', qty: 2, unitRate: 8498.75, amount: 16997.50, category: 'microcontrollers' },

  // SECTION D: 3D Printing & Rapid Prototyping (Items 148 - 169 / S.No 1-22 in Package D)
  { sNo: 148, packageCode: 'D', atlItemName: '3D Printer Kit and tools', offeredMakeModel: 'Creality K1C 3D Printer (High-Speed CoreXY, AI Camera, Carbon-Fiber Ready)', type: 'Non-Consumable', qty: 1, unitRate: 66248.75, amount: 66248.75, category: 'drone-3d' },
  { sNo: 149, packageCode: 'D', atlItemName: 'Dedicated UPS/Power back up', offeredMakeModel: 'Artis 1500VA Line Interactive UPS for Personal Computers, 3D Printers, Routers & Gaming Consoles', type: 'Non-Consumable', qty: 1, unitRate: 9998.75, amount: 9998.75, category: 'drone-3d' },
  { sNo: 150, packageCode: 'D', atlItemName: 'Filament for 3D printer', offeredMakeModel: '5kg PLA + 1kg TPU multi-colour Spools', type: 'Consumable', qty: 1, unitRate: 5125.00, amount: 5125.00, category: 'drone-3d' },
  { sNo: 151, packageCode: 'D', atlItemName: 'Filament Storage Box', offeredMakeModel: 'Filament storage box with humidity seals', type: 'Non-Consumable', qty: 5, unitRate: 562.50, amount: 2812.50, category: 'drone-3d' },
  { sNo: 152, packageCode: 'D', atlItemName: '3D Pen', offeredMakeModel: '3D Printing Pen LT-3 Series with Temperature Control', type: 'Non-Consumable', qty: 5, unitRate: 1411.25, amount: 7056.25, category: 'drone-3d' },
  { sNo: 153, packageCode: 'D', atlItemName: '3D Pen Filament', offeredMakeModel: '3D Pen Filament Refills – 11 Multicolor PLA | 5m Each | 1.75mm | for Kids & Adults (Pack of 11)', type: 'Consumable', qty: 5, unitRate: 261.25, amount: 1306.25, category: 'drone-3d' },
  { sNo: 154, packageCode: 'D', atlItemName: 'MDF Board Plain/ Balsa Wood Sheets', offeredMakeModel: 'MDF Sheets for Laser Cutting, Thin MDF Board Unfinished for Crafts, DIY Architectural Models', type: 'Consumable', qty: 10, unitRate: 298.75, amount: 2987.50, category: 'drone-3d' },
  { sNo: 155, packageCode: 'D', atlItemName: 'Acrylic Sheet', offeredMakeModel: 'Laser-Grade Cast Acrylic Sheet Stock Assortment (Multi-Thickness & Multi-Color Pack)', type: 'Consumable', qty: 8, unitRate: 1406.25, amount: 11250.00, category: 'drone-3d' },
  { sNo: 156, packageCode: 'D', atlItemName: 'Set of Arts & Crafts Accessories', offeredMakeModel: 'Paraspapermart A4 Grey Board, 2mm Thick, 800 GSM, Pack of 5, Fine Finish Craft Board for Model Making', type: 'Consumable', qty: 5, unitRate: 348.75, amount: 1743.75, category: 'drone-3d' },
  { sNo: 157, packageCode: 'D', atlItemName: 'Set of Arts & Crafts Accessories', offeredMakeModel: 'Worison 3 mm Thick 8pc Pack Craft Foam Board Set White, 8 x 8 Inches', type: 'Consumable', qty: 5, unitRate: 352.50, amount: 1762.50, category: 'drone-3d' },
  { sNo: 158, packageCode: 'D', atlItemName: 'Set of Arts & Crafts Accessories', offeredMakeModel: 'PRANSUNITA 12 Pcs Colorful Jute Twine String, 20 MTS Each, 3 ply Colorful Rope Durable Packing String', type: 'Consumable', qty: 5, unitRate: 26.56, amount: 132.80, category: 'drone-3d' },
  { sNo: 159, packageCode: 'D', atlItemName: 'Set of Arts & Crafts Accessories', offeredMakeModel: 'Amazon Basics Rubber Bands | Enhanced Stretchability and Durability | (3 inch, Pack of 50 gm)', type: 'Consumable', qty: 100, unitRate: 1.99, amount: 199.00, category: 'drone-3d' },
  { sNo: 160, packageCode: 'D', atlItemName: 'Set of Arts & Crafts Accessories', offeredMakeModel: '[100 Count] 4.5 Inch Wooden Multi-Purpose Popsicle Sticks, Craft, Tongue Depressor Wood Sticks', type: 'Consumable', qty: 100, unitRate: 1.24, amount: 124.00, category: 'drone-3d' },
  { sNo: 161, packageCode: 'D', atlItemName: 'Set of Arts & Crafts Accessories', offeredMakeModel: 'Fevicol SH - Ultimate woodworking adhesive | Easy to use | Durable | Sets in 2-3 hours | 500g', type: 'Consumable', qty: 2, unitRate: 198.75, amount: 397.50, category: 'drone-3d' },
  { sNo: 162, packageCode: 'D', atlItemName: 'Balsa Wood Sticks and Blocks', offeredMakeModel: '8PCS 10cm*15cm Balsa Wood Sheets, Wood Sheet for DIY Model Aircraft Building, Boat Crafting', type: 'Consumable', qty: 5, unitRate: 523.75, amount: 2618.75, category: 'drone-3d' },
  { sNo: 163, packageCode: 'D', atlItemName: 'Hacksaw Frame', offeredMakeModel: 'Taparia HFEP12 Nylon Handle Hacksaw Frame with Blade', type: 'Non-Consumable', qty: 1, unitRate: 511.25, amount: 511.25, category: 'drone-3d' },
  { sNo: 164, packageCode: 'D', atlItemName: 'Hacksaw blades', offeredMakeModel: 'Hacksaw blade 12 inch Miranda / Ultra 12*1/2*18', type: 'Consumable', qty: 10, unitRate: 156.25, amount: 1562.50, category: 'drone-3d' },
  { sNo: 165, packageCode: 'D', atlItemName: 'Mini Hacksaw Frame', offeredMakeModel: 'BUKU Mini 6inch Hacksaw Frame with Plastic Handle + 10pcs Spare Blades (Pack of 1)', type: 'Non-Consumable', qty: 1, unitRate: 226.25, amount: 226.25, category: 'drone-3d' },
  { sNo: 166, packageCode: 'D', atlItemName: 'Mini Hacksaw blades', offeredMakeModel: 'Included with Mini Hacksaw Frame (10 spare blades)', type: 'Consumable', qty: 10, unitRate: 0.00, amount: 0.00, category: 'drone-3d' },
  { sNo: 167, packageCode: 'D', atlItemName: 'Pliers: 4.5-inch size', offeredMakeModel: 'External straight pliers 4.5"', type: 'Non-Consumable', qty: 1, unitRate: 225.00, amount: 225.00, category: 'drone-3d' },
  { sNo: 168, packageCode: 'D', atlItemName: 'Pliers: 4.5-inch size', offeredMakeModel: 'Long nose pliers 4.5"', type: 'Non-Consumable', qty: 1, unitRate: 250.00, amount: 250.00, category: 'drone-3d' },
  { sNo: 169, packageCode: 'D', atlItemName: 'Tweezer Set', offeredMakeModel: '6-pc non-magnetic tweezer set', type: 'Non-Consumable', qty: 1, unitRate: 437.50, amount: 437.50, category: 'drone-3d' },
];

export const ATL_QUOTATION_PACKAGES: ATLQuotationPackage[] = [
  {
    id: 'pkg-a',
    code: 'Package A',
    title: 'Electronics & IoT Equipment Package',
    scope: 'Microcontrollers, IoT boards, sensors, displays, communication modules, power supplies, electronic components and themed STEM kits.',
    lineItemsCount: 111,
    subTotal: 191028.57,
    gstRate: 18,
    gstAmount: 34385.14,
    roundOff: 0.29,
    grandTotal: 225414.00,
    grandTotalWords: 'Rupees Two Lakh Twenty Five Thousand Four Hundred Fourteen Only',
    quotationNo: 'BT/ATL/2026-27/A-001',
    date: '10-Oct-2026',
    validUntil: '09-Nov-2026',
    reference: 'AIM ATL Equipment Guidelines (2026)',
    badge: '111 LINE ITEMS · IOT & SENSORS',
    themeColor: 'blue',
    highlights: [
      '20x Arduino UNO R4 Minima Boards + 10x Nano V3 Type-C + 15x ESP32 WROOM IoT Boards',
      'Full sensor array: 40x HC-SR04 Ultrasonics, 20x PIRs, MQ-2 to MQ-135 Gas sensors, DHT22, PMS7003 Air Quality',
      '400m Hook-up wires, 2000+ Jumper ribbons, 5000+ DIP LEDs, Regulated DC Power Supply 30V/5A',
      'Themed Kits: Bio-Tech Kit, Agri-Tech Kit, Water/Sanitation Kit & Solar Energy Experiment Kit'
    ],
    lineItems: ALL_ATL_LINE_ITEMS.slice(0, 111)
  },
  {
    id: 'pkg-b',
    code: 'Package B',
    title: 'Robotics & Automation Equipment Package',
    scope: 'Motors, motor drivers, chassis, wheels, relays, robotics and construction kits, rocketry aerospace and EV kits.',
    lineItemsCount: 29,
    subTotal: 100951.25,
    gstRate: 18,
    gstAmount: 18171.23,
    roundOff: -0.48,
    grandTotal: 119122.00,
    grandTotalWords: 'Rupees One Lakh Nineteen Thousand One Hundred Twenty Two Only',
    quotationNo: 'BT/ATL/2026-27/B-001',
    date: '10-Oct-2026',
    validUntil: '09-Nov-2026',
    reference: 'AIM ATL Equipment Guidelines (2026)',
    badge: '29 LINE ITEMS · ROBOTICS & MECHATRONICS',
    themeColor: 'emerald',
    highlights: [
      '20x NEMA17 Stepper Motors (JK42HS48) with A4988 Drivers + 20x High-Torque 150RPM DC Motors',
      '72x BO Geared Motors (150/300/60/50 RPM) + 20x Rubber Grip Wheels & 10x 2WD Aluminum Robot Chassis',
      'WitBlox AI Robotic Science Kit (101+ Projects) & Mechanix Steel Mega 202-piece Modular Kits',
      'Autonomous 4WD Smart Rover Kit + Smartivity Rocket Launcher + Electric Vehicle (EV) Kit'
    ],
    lineItems: ALL_ATL_LINE_ITEMS.slice(111, 140)
  },
  {
    id: 'pkg-c',
    code: 'Package C',
    title: 'AI/ML & Computer Vision Equipment Package',
    scope: 'Single-board computers, camera modules, TinyML kit, biometric sensor and AR/VR headset.',
    lineItemsCount: 7,
    subTotal: 182005.00,
    gstRate: 18,
    gstAmount: 32760.90,
    roundOff: 0.10,
    grandTotal: 214766.00,
    grandTotalWords: 'Rupees Two Lakh Fourteen Thousand Seven Hundred Sixty Six Only',
    quotationNo: 'BT/ATL/2026-27/C-001',
    date: '10-Oct-2026',
    validUntil: '09-Nov-2026',
    reference: 'AIM ATL Equipment Guidelines (2026)',
    badge: '7 LINE ITEMS · AI, TINYML & AR/VR',
    themeColor: 'purple',
    highlights: [
      '4x Raspberry Pi 5 Model 8GB RAM Single Board Computers (Broadcom Quad-Core 2.4GHz)',
      'Meta Quest 3S VR Headset 128GB with Touch Plus Controllers for Unity & Spatial Simulation',
      '2x Official Arduino Tiny Machine Learning Kits AKX00028 with Nano 33 BLE Sense & OV7675 Camera',
      '11x ESP32-CAM & ESP32-CAM-MB Boards with OV2640/OV3660 + R307S Optical Fingerprint Sensor'
    ],
    lineItems: ALL_ATL_LINE_ITEMS.slice(140, 147)
  },
  {
    id: 'pkg-d',
    code: 'Package D',
    title: '3D Printing & Rapid Prototyping Equipment Package',
    scope: '3D printer with UPS and filament, 3D pens, prototyping materials and mechanical hand tools.',
    lineItemsCount: 22,
    subTotal: 116975.80,
    gstRate: 18,
    gstAmount: 21055.64,
    roundOff: -0.44,
    grandTotal: 138031.00,
    grandTotalWords: 'Rupees One Lakh Thirty Eight Thousand Thirty One Only',
    quotationNo: 'BT/ATL/2026-27/D-001',
    date: '10-Oct-2026',
    validUntil: '09-Nov-2026',
    reference: 'AIM ATL Equipment Guidelines (2026)',
    badge: '22 LINE ITEMS · 3D PRINTING & TOOLS',
    themeColor: 'amber',
    highlights: [
      'Creality K1C High-Speed 3D Printer (CoreXY, 600mm/s, AI Camera, Carbon Fiber Compatible)',
      'Artis 1500VA Line Interactive Dedicated Lab UPS with Surge Protection',
      '5kg PLA + 1kg TPU Filaments + 5x Filament Sealed Dry Boxes + 5x 3D Pens LT-3 Series',
      'Prototyping Stock: Cast Acrylic Sheets, MDF Laser Boards, Balsa Wood, Taparia Hacksaws & Pliers'
    ],
    lineItems: ALL_ATL_LINE_ITEMS.slice(147, 169)
  },
  {
    id: 'pkg-e',
    code: 'Package E',
    title: 'Complete ATL Equipment Package (Master Turnkey Solution)',
    scope: 'All 169 line items of the AIM ATL equipment list (Packages A + B + C + D combined).',
    lineItemsCount: 169,
    subTotal: 590960.62,
    gstRate: 18,
    gstAmount: 106372.91,
    roundOff: 0.47,
    grandTotal: 697334.00,
    grandTotalWords: 'Rupees Six Lakh Ninety Seven Thousand Three Hundred Thirty Four Only',
    quotationNo: 'BT/ATL/2026-27/E-001',
    date: '10-Oct-2026',
    validUntil: '09-Nov-2026',
    reference: 'AIM ATL Equipment Guidelines (2026)',
    badge: 'COMPLETE 169-ITEM TURNKEY LAB',
    themeColor: 'rose',
    highlights: [
      'Full Turnkey Lab: Combines Package A + Package B + Package C + Package D into one unified consignment',
      'Covers Electronics & IoT (111 items), Robotics & Automation (29 items), AI/ML & VR (7 items), 3D Prototyping (22 items)',
      'Sub-total ₹5,90,960.62 + 18% GST (₹1,06,372.91) = ₹6,97,334.00 Net Institutional Investment',
      'Includes complimentary 2-day on-site teacher training, laboratory inauguration support & 12-month onsite warranty'
    ],
    lineItems: ALL_ATL_LINE_ITEMS
  }
];

export const ATL_TERMS_AND_CONDITIONS = [
  'Prices are in Indian Rupees (INR). GST @ 18% is charged extra as shown in official quotation tables.',
  'Validity: 30 days from the date of quotation (10-Oct-2026 to 09-Nov-2026). Component rates are pegged to the official ATL price sheet.',
  'Delivery: 2–3 weeks from receipt of confirmed Purchase Order (PO). Pan-India dispatch from Hyderabad and Ambala logistical depots.',
  'Payment Terms: 50% advance with Purchase Order, balance 50% upon delivery, equipment verification, and laboratory installation.',
  'Warranty: 12-Month replacement warranty on non-consumable equipment. Consumables and prototyping raw materials covered under transit defect replacement.',
  'Make & Model Integrity: Equivalent make/model of equal or superior specification may be supplied subject to NITI Aayog vendor authorization.',
  'Compliance: 100% compliant with Atal Innovation Mission (AIM) Atal Tinkering Lab equipment guidelines (2026).'
];
