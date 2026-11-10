import { Product, Course, InventoryItem, Order, CaseStudyBlog, RentalBooking } from '../types';

/**
 * Universal browser file downloader using Blob and anchor download attribute
 */
export function triggerFileDownload(content: string, filename: string, mimeType: string = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

/**
 * Download NEP 2020 ATL Complete Curriculum & Syllabus Guide
 */
export function downloadCurriculumGuide() {
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Balki Technologies - NEP 2020 ATL Curriculum & Syllabus Guide</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1e293b; max-width: 900px; margin: 0 auto; padding: 40px 20px; background: #fff; }
    .header { border-bottom: 3px solid #d97706; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
    .title { color: #0f172a; font-size: 26px; font-weight: 800; margin: 0; }
    .subtitle { color: #d97706; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }
    .meta { font-size: 12px; color: #64748b; text-align: right; }
    h2 { color: #0f172a; font-size: 18px; border-left: 4px solid #d97706; padding-left: 12px; margin-top: 30px; }
    .grade-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 16px; }
    .grade-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
    .grade-title { font-size: 16px; font-weight: 700; color: #0f172a; }
    .grade-badge { background: #fef3c7; color: #92400e; font-size: 11px; font-weight: 700; padding: 3px 10px; rounded: 20px; border-radius: 20px; }
    ul { margin: 8px 0; padding-left: 20px; }
    li { font-size: 13px; color: #334155; margin-bottom: 4px; }
    .footer { margin-top: 50px; border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 11px; color: #94a3b8; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1 class="title">BALKI TECHNOLOGIES</h1>
      <div class="subtitle">Official ATL & NEP 2020 Grade-Progressive Curriculum Syllabus</div>
    </div>
    <div class="meta">
      <div>Reference: AIM-ATL-NEP2020-V4</div>
      <div>Coverage: 50,000+ Indian Tinkering Labs</div>
      <div>Issued: March 2026</div>
    </div>
  </div>

  <h2>1. Foundational Vision & NEP 2020 Alignment</h2>
  <p style="font-size: 13px; color: #475569;">
    Designed in strict conformity with NITI Aayog Atal Innovation Mission (AIM) Package 1-3 mandates and NEP 2020 experiential learning directives. This syllabus standardizes progressive hands-on engineering across Indian schools, enabling uninterrupted tinkering from magnetic circuits in primary grades to AI-edge vision and autonomous aeronautics in senior secondary.
  </p>

  <h2>2. Grade-Progressive Curriculum Matrix</h2>

  <div class="grade-card">
    <div class="grade-header">
      <span class="grade-title">Phase 1: Junior Tinkerer (Classes 3–5)</span>
      <span class="grade-badge">Zero Soldering • Magnetic Safety</span>
    </div>
    <p style="font-size: 12px; color: #64748b; margin: 0 0 8px 0;"><strong>Core Goal:</strong> Demystifying electrical current and sensory observation without hazardous voltages.</p>
    <ul>
      <li><strong>Module 1:</strong> The Closed Circuit Loop — Batteries, conductors, and luminous LED art.</li>
      <li><strong>Module 2:</strong> Conductors vs. Insulators — The lemon clock and graphite conductivity mystery.</li>
      <li><strong>Module 3:</strong> Magnetic Switches & Reed Sensors — Solderless modular burglar alarms.</li>
      <li><strong>Module 4:</strong> Capstone Innovation — Build your first motorized tabletop fan and lighthouse.</li>
    </ul>
  </div>

  <div class="grade-card">
    <div class="grade-header">
      <span class="grade-title">Phase 2: Intermediate Robotics & Sensors (Classes 6–8)</span>
      <span class="grade-badge">Block-to-C++ Arduino Coding</span>
    </div>
    <p style="font-size: 12px; color: #64748b; margin: 0 0 8px 0;"><strong>Core Goal:</strong> Developing algorithmic logic, sensor feedback loops, and autonomous chassis mechanics.</p>
    <ul>
      <li><strong>Module 1:</strong> Microcontroller Architecture — Atmega328P I/O pins, digital PWM, and analog sensors.</li>
      <li><strong>Module 2:</strong> Echolocation Radar — HC-SR04 ultrasonic distance calculation (Speed of Sound physics).</li>
      <li><strong>Module 3:</strong> Motor Control — L298N H-Bridge drivers, speed modulation, and autonomous obstacle avoidance.</li>
      <li><strong>Module 4:</strong> Capstone Innovation — 2WD Smart Line-Follower Rover for intra-school robotics expos.</li>
    </ul>
  </div>

  <div class="grade-card">
    <div class="grade-header">
      <span class="grade-title">Phase 3: IoT, Cloud Telemetry & TinyML (Classes 9–10)</span>
      <span class="grade-badge">ESP32 • Wi-Fi / BLE • MQTT</span>
    </div>
    <p style="font-size: 12px; color: #64748b; margin: 0 0 8px 0;"><strong>Core Goal:</strong> Real-world environmental sensing, cloud dashboards, and edge machine learning classification.</p>
    <ul>
      <li><strong>Module 1:</strong> Wireless Sensor Networks — Connecting ESP32 to Wi-Fi and lightweight MQTT telemetry.</li>
      <li><strong>Module 2:</strong> Smart Agriculture Automation — Soil moisture sensing with automated relay water pumps.</li>
      <li><strong>Module 3:</strong> TinyML Computer Vision — ESP32-CAM convolutional kernels and localized gesture detection.</li>
      <li><strong>Module 4:</strong> Capstone Innovation — Cloud-connected Climate Anomaly Station with OLED real-time analytics.</li>
    </ul>
  </div>

  <div class="grade-card">
    <div class="grade-header">
      <span class="grade-title">Phase 4: Autonomous Drones & 3D Prototyping (Classes 11–12)</span>
      <span class="grade-badge">Aerodynamics • PID Control • CAD</span>
    </div>
    <p style="font-size: 12px; color: #64748b; margin: 0 0 8px 0;"><strong>Core Goal:</strong> Industrial prototyping, flight avionics, and computer-aided design for science fairs.</p>
    <ul>
      <li><strong>Module 1:</strong> Aerodynamics & Quadcopter Dynamics — Brushless ESC timing and reactive torque cancellation.</li>
      <li><strong>Module 2:</strong> PID Flight Stabilization — Gyroscope/accelerometer sensor fusion algorithms.</li>
      <li><strong>Module 3:</strong> Parametric 3D CAD — Designing custom brackets and slicing for FDM rapid prototyping.</li>
      <li><strong>Module 4:</strong> Capstone Innovation — Autonomous GPS waypoint navigation drone for disaster relief simulation.</li>
    </ul>
  </div>

  <h2>3. Turnkey School Enablement & Warranties</h2>
  <ul style="font-size: 13px;">
    <li><strong>Free On-Site Installation:</strong> Certified Balki engineers calibrate equipment on school premises.</li>
    <li><strong>Teacher Enablement Workshops:</strong> 2-day certified pedagogical training with physical manuals.</li>
    <li><strong>Doorstep 12-Month Replacement:</strong> No waiting on repairs — rapid component swaps for classroom continuity.</li>
    <li><strong>School Purchase Orders:</strong> GeM / Net-30 purchase order acceptance with GST input credit.</li>
  </ul>

  <div class="footer">
    Balki Technologies Pvt. Ltd. • Hyderabad Central Hub & Pan-India Distribution • Contact: +91-9071199139 • balki.technologies@gmail.com
  </div>
</body>
</html>`;

  triggerFileDownload(htmlContent, 'Balki_NEP2020_ATL_Curriculum_Syllabus.html', 'text/html;charset=utf-8');
}

/**
 * Download Technical Datasheet for any Product
 */
export function downloadProductDatasheet(product: Product) {
  const content = `================================================================================
BALKI TECHNOLOGIES PVT. LTD. - OFFICIAL TECHNICAL DATASHEET
================================================================================
Product Name:        ${product.name}
SKU / Part Code:     ${product.sku}
Category:            ${product.category}
Grade Level:         ${product.gradeLevel}
ATL AIM Certified:   ${product.atlCertified ? 'YES (NITI Aayog Compliant)' : 'Standard School Edition'}
NEP 2020 Aligned:    ${product.nepAligned ? 'YES' : 'Standard'}
Warranty Period:     ${product.warrantyMonths} Months Doorstep Replacement
Warehouse Hub:       ${product.warehouseLocation}
MSRP (Inclusive GST): ₹${product.price.toLocaleString('en-IN')} (Original: ₹${product.originalPrice.toLocaleString('en-IN')})
--------------------------------------------------------------------------------

1. PRODUCT OVERVIEW
--------------------------------------------------------------------------------
${product.shortDesc}

${product.description}

2. CORE SPECIFICATIONS & KEY CAPABILITIES
--------------------------------------------------------------------------------
${product.features.map((f, i) => `[${i + 1}] ${f}`).join('\n')}

3. WHAT'S IN THE BOX (PACKAGE CONTENTS)
--------------------------------------------------------------------------------
${product.whatsInBox.map((item, i) => ` * ${item}`).join('\n')}

4. SAFETY & CLASSROOM COMPLIANCE
--------------------------------------------------------------------------------
- Voltage Tolerances: Reverse polarity and thermal auto-resettable fuse protection
- Age Alignment: Specifically calibrated for ${product.gradeLevel} students
- Quality Standard: 100% pre-tested at Balki Central Hub before dispatch
- Support Hotline: 24/7 Problem Resolvance Desk (+91-9071199139)

================================================================================
Generated on: ${new Date().toLocaleDateString('en-IN')} | Balki Technologies
Email: balki.technologies@gmail.com | Website: https://balki-technologies.in
================================================================================`;

  triggerFileDownload(content, `${product.sku}_Datasheet_Balki_Technologies.txt`, 'text/plain;charset=utf-8');
}

/**
 * Download Official STEM Innovation Certificate
 */
export function downloadCertificateDocument(cert: {
  studentName?: string;
  courseTitle: string;
  certificateId: string;
  issueDate: string;
}) {
  const name = cert.studentName || 'Aarav Sharma';
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Balki Technologies - STEM Certificate of Excellence</title>
  <style>
    body { margin: 0; padding: 40px; background: #0f172a; font-family: 'Georgia', serif; display: flex; justify-content: center; align-items: center; min-height: 90vh; }
    .cert-frame { background: #fff; width: 850px; padding: 50px; border: 12px double #d97706; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); text-align: center; position: relative; }
    .watermark { position: absolute; font-size: 120px; font-weight: 900; color: rgba(217, 119, 6, 0.05); top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-25deg); pointer-events: none; }
    .badge { display: inline-block; background: #fef3c7; color: #92400e; font-family: sans-serif; font-size: 11px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; padding: 6px 16px; border-radius: 50px; border: 1px solid #fde68a; margin-bottom: 20px; }
    h1 { font-family: 'Cinzel', 'Georgia', serif; font-size: 32px; color: #0f172a; margin: 0 0 10px 0; letter-spacing: 1px; }
    p.sub { font-family: sans-serif; font-size: 14px; color: #64748b; margin-bottom: 30px; text-transform: uppercase; letter-spacing: 1.5px; }
    .recipient { font-size: 38px; color: #b45309; font-weight: bold; font-style: italic; border-bottom: 2px solid #e2e8f0; display: inline-block; padding: 0 40px 10px 40px; margin-bottom: 20px; }
    .text { font-family: sans-serif; font-size: 14px; color: #334155; line-height: 1.8; max-width: 650px; margin: 0 auto 30px auto; }
    .course-highlight { font-weight: 700; color: #0f172a; }
    .meta-box { display: flex; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 30px; margin-top: 30px; font-family: sans-serif; font-size: 12px; }
    .sign { text-align: right; }
    .sign-line { width: 180px; border-bottom: 1px solid #334155; margin-bottom: 6px; font-family: cursive; font-size: 18px; color: #0f172a; }
    .id-tag { font-family: monospace; color: #64748b; text-align: left; }
    @media print { body { background: #fff; padding: 0; } .cert-frame { box-shadow: none; border: 8px double #d97706; } }
  </style>
</head>
<body>
  <div class="cert-frame">
    <div class="watermark">BALKI STEM</div>
    <div class="badge">National STEM & Atal Tinkering Innovation Certificate</div>
    <h1>CERTIFICATE OF EXCELLENCE</h1>
    <p class="sub">This credential verifies hands-on engineering mastery</p>
    <div>This is proudly awarded to</div>
    <div class="recipient">${name}</div>
    <div class="text">
      for successfully completing all practical hardware prototyping modules, simulation challenges, and practical mastery assessments in
      <br><span class="course-highlight">"${cert.courseTitle}"</span>
      <br>under the National Education Policy (NEP 2020) Atal Tinkering Lab Experiential Framework.
    </div>

    <div class="meta-box">
      <div class="id-tag">
        <div><strong>Certificate ID:</strong> ${cert.certificateId}</div>
        <div><strong>Date Issued:</strong> ${cert.issueDate}</div>
        <div><strong>Verification:</strong> aim.gov.in/verify • balki.tech</div>
      </div>
      <div class="sign">
        <div class="sign-line">Balki Technologies</div>
        <div><strong>Lead Academic Director</strong></div>
        <div style="color: #64748b; font-size: 11px;">Balki Technologies STEM Board</div>
      </div>
    </div>
  </div>
</body>
</html>`;

  triggerFileDownload(htmlContent, `Certificate_${cert.certificateId}.html`, 'text/html;charset=utf-8');
}

/**
 * Download Warehouse Stock Audit CSV
 */
export function downloadStockAuditCsv(inventory: InventoryItem[]) {
  const headers = ['SKU', 'Item Name', 'Category', 'Current Stock', 'Min Threshold', 'Warehouse Location', 'Unit Cost INR', 'Selling Price INR', 'Stock Status'];
  
  const rows = inventory.map(item => [
    `"${item.sku}"`,
    `"${item.name.replace(/"/g, '""')}"`,
    `"${item.category}"`,
    item.currentStock,
    item.minimumThreshold,
    `"${item.warehouse}"`,
    item.unitCost,
    item.sellingPrice,
    `"${item.status}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const dateStr = new Date().toISOString().split('T')[0];
  triggerFileDownload(csvContent, `Balki_Warehouse_Stock_Audit_${dateStr}.csv`, 'text/csv;charset=utf-8');
}

/**
 * Download Official GST Tax Invoice
 */
export function downloadTaxInvoice(order: Order) {
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Balki Technologies - Tax Invoice ${order.id}</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, sans-serif; color: #0f172a; max-width: 800px; margin: 0 auto; padding: 30px 20px; font-size: 13px; }
    .header { border-bottom: 2px solid #0f172a; padding-bottom: 15px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start; }
    .brand { font-size: 22px; font-weight: 900; color: #0f172a; }
    .brand span { color: #d97706; }
    .invoice-tag { font-size: 18px; font-weight: 800; color: #d97706; text-align: right; }
    .company-details { font-size: 11px; color: #475569; margin-top: 4px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; background: #f8fafc; padding: 15px; border-radius: 8px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th { background: #0f172a; color: #fff; padding: 8px; text-align: left; font-size: 11px; font-weight: 700; }
    td { padding: 8px; border-bottom: 1px solid #e2e8f0; font-size: 12px; }
    .totals { width: 300px; margin-left: auto; margin-bottom: 30px; }
    .totals-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 12px; }
    .grand-total { border-top: 2px solid #0f172a; padding-top: 8px; font-size: 14px; font-weight: 800; color: #b45309; }
    .footer { border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 11px; color: #64748b; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">BALKI <span>TECHNOLOGIES</span></div>
      <div class="company-details">
        Balki Technologies Pvt. Ltd. • Financial District, Hyderabad, Telangana<br>
        GSTIN: <strong>36AAACD1234F1Z9</strong> • PAN: AAACD1234F<br>
        CIN: U72900TG2024PTC189234 • Phone: +91-9071199139
      </div>
    </div>
    <div>
      <div class="invoice-tag">TAX INVOICE</div>
      <div style="font-size: 12px; color: #475569; text-align: right; margin-top: 4px;">
        Invoice No: <strong>${order.id}</strong><br>
        Date: <strong>${new Date(order.createdAt).toLocaleDateString('en-IN')}</strong><br>
        Tracking: <strong>${order.trackingNumber}</strong>
      </div>
    </div>
  </div>

  <div class="grid">
    <div>
      <strong style="color: #0f172a;">Billed & Shipped To:</strong><br>
      ${order.customerName}<br>
      ${order.schoolName ? `${order.schoolName}<br>` : ''}
      ${order.shippingAddress.street}<br>
      ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}<br>
      Phone: ${order.customerPhone} • Email: ${order.customerEmail}
    </div>
    <div>
      <strong style="color: #0f172a;">Payment & Tax Summary:</strong><br>
      Payment Method: <strong>${order.paymentMethod === 'UPI' ? 'UPI (Canara Bank VPA: 120039687478@canara)' : order.paymentMethod}</strong><br>
      Transaction Ref / UTR: <strong style="font-family: monospace;">${order.paymentReference || 'N/A'}</strong><br>
      Payment Status: <span style="color: #059669; font-weight: bold;">PAID (Verified)</span><br>
      School GSTIN: ${order.gstin || 'B2C / Not Provided'}<br>
      Place of Supply: ${order.shippingAddress.state} (India)
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Description of Goods / STEM Kits</th>
        <th>SKU</th>
        <th style="text-align: center;">Qty</th>
        <th style="text-align: right;">Rate (INR)</th>
        <th style="text-align: right;">Amount (INR)</th>
      </tr>
    </thead>
    <tbody>
      ${order.items.map(item => `
        <tr>
          <td><strong>${item.product.name}</strong><br><span style="font-size: 10px; color: #64748b;">${item.product.gradeLevel} • 12-Mo Warranty</span></td>
          <td>${item.product.sku}</td>
          <td style="text-align: center;">${item.quantity}</td>
          <td style="text-align: right;">₹${item.product.price.toLocaleString('en-IN')}</td>
          <td style="text-align: right;">₹${(item.product.price * item.quantity).toLocaleString('en-IN')}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="totals">
    <div class="totals-row">
      <span>Taxable Value (Excl. GST):</span>
      <span>₹${order.subtotal.toLocaleString('en-IN')}</span>
    </div>
    <div class="totals-row">
      <span>Integrated GST (IGST 18%):</span>
      <span>₹${order.gstAmount.toLocaleString('en-IN')}</span>
    </div>
    <div class="totals-row">
      <span>Shipping & Transit Insurance:</span>
      <span>${order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}</span>
    </div>
    ${order.discount > 0 ? `
    <div class="totals-row" style="color: #059669; font-weight: bold;">
      <span>Discount Applied:</span>
      <span>-₹${order.discount.toLocaleString('en-IN')}</span>
    </div>` : ''}
    <div class="totals-row grand-total">
      <span>Total Invoice Amount:</span>
      <span>₹${order.totalAmount.toLocaleString('en-IN')}</span>
    </div>
  </div>

  <div class="footer">
    This is a computer-generated tax invoice and requires no physical signature.<br>
    Balki Technologies Pvt. Ltd. • All kits backed by 12-Month On-Site Replacement Warranty.
  </div>
</body>
</html>`;

  triggerFileDownload(htmlContent, `Balki_Tax_Invoice_${order.id}.html`, 'text/html;charset=utf-8');
}

/**
 * Download Formal Institutional ATL Proposal / Rate Card
 */
export function downloadB2BProposal(details?: {
  schoolName?: string;
  contactPerson?: string;
  packageType?: string;
  studentStrength?: number;
  estimatedBudget?: string;
}) {
  const school = details?.schoolName || 'Instituion / School Atal Tinkering Lab';
  const pkg = details?.packageType || 'Comprehensive ATL Lab Setup';
  const budget = details?.estimatedBudget || '₹4,00,000 - ₹6,50,000';
  const students = details?.studentStrength || 150;

  const content = `================================================================================
BALKI TECHNOLOGIES PVT. LTD. - INSTITUTIONAL ATL LAB PROPOSAL & RATE CARD
================================================================================
Prepared For:       ${school}
Contact Person:     ${details?.contactPerson || 'School Principal / ATL In-Charge'}
Configured Package: ${pkg}
Student Capacity:   ${students} Simultaneous Students
Estimated Budget:   ${budget} (Inclusive of Installation & GST)
Valid Through:      30 Days from Generation
================================================================================

1. EXECUTIVE SUMMARY
--------------------------------------------------------------------------------
Balki Technologies Pvt. Ltd. provides India's most complete, grade-progressive
STEM & Robotics ecosystem (Classes 3 to 12), complying with NITI Aayog's Atal
Innovation Mission (AIM) and NEP 2020 standards across 50,000+ school labs.

2. LAB SETUP DELIVERABLES
--------------------------------------------------------------------------------
* Package 1 (Electronics & Sensors):
  - 10x Balki Uno R3 Microcontroller Boards with shielded USB cables
  - 5x ESP32 Dual-Core IoT & Bluetooth development boards
  - 20x Multi-Sensor Innovation Packs (Ultrasonic, Gas, PIR, Temperature)
  - Solderless breadboards, jumper bundles, power supplies

* Package 2 (Rapid Prototyping & Mechanical):
  - 1x Precision Desktop 3D Printer (220x220x250mm FDM) with auto bed-leveling
  - 5kg Non-toxic biodegradable PLA Filament spools
  - 15x 2WD Robotics chassis with high-torque DC motors and wheels
  - ESD-safe temperature controlled soldering & safety station

* Package 3 (Aeronautics & Drone Prototyping):
  - 1x Autonomous Quadcopter flight testing rig with telemetry
  - 6-Channel 2.4GHz radio transmitter and optical flow sensor

3. VALUE-ADDED TURNKEY SERVICES (ZERO EXTRA COST)
--------------------------------------------------------------------------------
[✓] Free On-Site Installation: Doorstep assembly and calibration by certified engineers.
[✓] 2-Day Teacher Enablement: Certified pedagogical training for science educators.
[✓] Comprehensive Syllabus: NEP 2020 aligned weekly lesson plans and project worksheets.
[✓] 12-Month On-Site Warranty: Immediate component replacement for damaged modules.
[✓] Net-30 / GeM Purchase Orders: Official GST e-invoices with full input tax credit.

4. NEXT STEPS & IMPLEMENTATION SCHEDULE
--------------------------------------------------------------------------------
1. Sign and stamp this quote or issue formal School Purchase Order (PO).
2. Direct dispatch within 24-48 hours from Hyderabad / Bengaluru / Delhi NCR hubs.
3. Onsite engineer arrives on agreed date for lab setup & educator training.

================================================================================
Balki Technologies Institutional Desk • +91-9071199139 • balki.technologies@gmail.com
================================================================================`;

  triggerFileDownload(content, `Balki_ATL_Proposal_${school.replace(/[^a-zA-Z0-9]/g, '_')}.txt`, 'text/plain;charset=utf-8');
}

/**
 * Download Case Study Whitepaper
 */
export function downloadCaseStudyPdf(study: CaseStudyBlog) {
  const content = `================================================================================
BALKI TECHNOLOGIES - CASE STUDY & FIELD IMPLEMENTATION REPORT
================================================================================
Title:         ${study.title}
Category:      ${study.category}
School / Hub:  ${study.clientOrCompany} (${study.location})
Published:     ${study.publishedDate} • ${study.readTimeMinutes} Min Read
================================================================================

EXECUTIVE SUMMARY:
--------------------------------------------------------------------------------
${study.executiveSummary}

CHALLENGE:
--------------------------------------------------------------------------------
${study.challenge}

SOLUTION & DEPLOYMENT:
--------------------------------------------------------------------------------
${study.solution}

QUANTITATIVE IMPACT METRICS:
--------------------------------------------------------------------------------
${study.keyMetrics.map(s => `* ${s.label}: ${s.value} (${s.detail})`).join('\n')}

KEY OUTCOMES:
--------------------------------------------------------------------------------
${study.outcomes.map(o => `* ${o}`).join('\n')}

FULL STUDY CONTENT & METHODOLOGY:
--------------------------------------------------------------------------------
${study.fullArticle}

HARDWARE PACKAGES UTILIZED:
--------------------------------------------------------------------------------
${study.productsUsed.map(p => `* ${p.name} (SKU: ${p.sku}) - ₹${p.price.toLocaleString('en-IN')}`).join('\n')}

================================================================================
Published by Balki Technologies STEM Research Division
Email: balki.technologies@gmail.com | Phone: +91-9071199139
================================================================================`;

  triggerFileDownload(content, `CaseStudy_${study.id}_Balki_Technologies.txt`, 'text/plain;charset=utf-8');
}

/**
 * Download Official Equipment Rental Agreement & Deposit Authorization
 */
export function downloadRentalAgreement(booking: RentalBooking) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Rental Agreement - ${booking.id} - Balki Technologies</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #1e293b; max-width: 800px; margin: auto; }
    .header { border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-start; }
    .title { font-size: 24px; font-weight: 800; color: #0f172a; margin: 0; }
    .badge { display: inline-block; background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 700; margin-top: 8px; }
    .table { width: 100%; border-collapse: collapse; margin: 24px 0; }
    .table th, .table td { border: 1px solid #e2e8f0; padding: 12px 16px; text-align: left; font-size: 13px; }
    .table th { background: #f8fafc; font-weight: 600; }
    .highlight { font-weight: 700; color: #d97706; }
    .footer { margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 12px; color: #64748b; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1 class="title">BALKI TECHNOLOGIES PVT. LTD.</h1>
      <p style="margin: 4px 0; color: #64748b; font-size: 13px;">STEM Equipment Rental Agreement & Deposit Authorization</p>
      <span class="badge">Status: ${booking.status}</span>
    </div>
    <div style="text-align: right; font-size: 12px; color: #64748b;">
      <div><strong>Booking ID:</strong> ${booking.id}</div>
      <div><strong>Date:</strong> ${new Date(booking.createdAt || Date.now()).toLocaleDateString('en-IN')}</div>
    </div>
  </div>

  <h3>Hirer / Institution Details</h3>
  <table class="table">
    <tr><th>Institution / School:</th><td>${booking.institutionName}</td></tr>
    <tr><th>Contact Person:</th><td>${booking.userName}</td></tr>
    <tr><th>Email & Phone:</th><td>${booking.userEmail} | ${booking.userPhone}</td></tr>
  </table>

  <h3>Equipment & Duration Breakdown</h3>
  <table class="table">
    <tr><th>Allocated Hardware:</th><td class="highlight">${booking.equipmentName}</td></tr>
    <tr><th>Rental Period:</th><td>${booking.startDate} to ${booking.endDate} (${booking.totalDays} days)</td></tr>
    <tr><th>Rental Fee:</th><td>₹${booking.rentalFee.toLocaleString('en-IN')}</td></tr>
    <tr><th>Refundable Deposit:</th><td style="color: #059669; font-weight: 700;">₹${booking.depositFee.toLocaleString('en-IN')} (100% Refundable)</td></tr>
    <tr style="background: #f8fafc;"><th>Total Authorized:</th><td style="font-size: 16px; font-weight: 800; color: #b45309;">₹${booking.totalAmount.toLocaleString('en-IN')}</td></tr>
  </table>

  <h3>Terms & Conditions</h3>
  <ul style="font-size: 12px; color: #475569; line-height: 1.8;">
    <li>Equipment is supplied in shockproof flight cases pre-calibrated to NABL test criteria.</li>
    <li>Hirer is liable for normal care and maintenance. In transit damage is insured by Balki Technologies.</li>
    <li>Security deposit is automatically initiated for release within 24 hours of equipment safe check-in.</li>
  </ul>

  <div class="footer">
    <div style="display: flex; justify-content: space-between; margin-top: 40px;">
      <div>Authorized Signatory<br><strong>Balki Technologies Logistics Hub</strong></div>
      <div style="text-align: right;">Hirer Acceptance<br><strong>${booking.institutionName}</strong></div>
    </div>
  </div>
</body>
</html>`;

  triggerFileDownload(html, `Rental_Agreement_${booking.id}.html`, 'text/html;charset=utf-8');
}

/**
 * Download Official High-Value Order Approval Request Summary
 */
export function downloadOrderRequestSummary(request: any) {
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Balki Technologies - High-Value Order Approval Request ${request.requestId}</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, sans-serif; color: #0f172a; max-width: 800px; margin: 0 auto; padding: 30px 20px; font-size: 13px; }
    .header { border-bottom: 2px solid #0f172a; padding-bottom: 15px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start; }
    .brand { font-size: 22px; font-weight: 900; color: #0f172a; }
    .brand span { color: #d97706; }
    .invoice-tag { font-size: 16px; font-weight: 800; color: #d97706; text-align: right; }
    .company-details { font-size: 11px; color: #475569; margin-top: 4px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; background: #f8fafc; padding: 15px; border-radius: 8px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th { background: #0f172a; color: #fff; padding: 8px; text-align: left; font-size: 11px; font-weight: 700; }
    td { padding: 8px; border-bottom: 1px solid #e2e8f0; font-size: 12px; }
    .totals { width: 320px; margin-left: auto; margin-bottom: 30px; }
    .totals-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 12px; }
    .grand-total { border-top: 2px solid #0f172a; padding-top: 8px; font-size: 14px; font-weight: 800; color: #b45309; }
    .footer { border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 11px; color: #64748b; text-align: center; }
    .badge { display: inline-block; padding: 3px 8px; border-radius: 4px; font-weight: bold; font-size: 10px; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">BALKI <span>TECHNOLOGIES</span></div>
      <div class="company-details">
        Balki Technologies Pvt. Ltd. • Financial District, Hyderabad, Telangana<br>
        STEM & ATL Lab Engineering Division • Phone: +91-9071199139
      </div>
    </div>
    <div>
      <div class="invoice-tag">APPROVAL REQUEST</div>
      <div style="font-size: 12px; color: #475569; text-align: right; margin-top: 4px;">
        Request ID: <strong>${request.requestId}</strong><br>
        Date: <strong>${new Date(request.createdAt).toLocaleDateString('en-IN')}</strong><br>
        Status: <span class="badge" style="background: #fef3c7; color: #92400e;">${request.approvalStatus || 'PENDING'}</span>
      </div>
    </div>
  </div>

  <div class="grid">
    <div>
      <strong style="color: #0f172a;">Client & Institution Details:</strong><br>
      ${request.customerDetails?.name || 'Educator'}<br>
      ${request.customerDetails?.schoolName ? `${request.customerDetails.schoolName}<br>` : ''}
      ${request.customerDetails?.address || 'India'}<br>
      Phone: ${request.customerDetails?.phone} • Email: ${request.customerDetails?.email}
    </div>
    <div>
      <strong style="color: #0f172a;">Request & Payment State:</strong><br>
      Category: <strong>High-Value Lab Order (≥ ₹5,000)</strong><br>
      Approval Status: <strong style="color: #b45309;">${request.approvalStatus || 'PENDING'}</strong><br>
      Payment Status: <strong style="color: #475569;">${request.paymentStatus || 'NOT_STARTED'}</strong><br>
      Payment Collected: <strong>₹0 (Zero - Awaiting Approval)</strong>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Requested STEM Hardware / Package</th>
        <th style="text-align: center;">Qty</th>
        <th style="text-align: right;">Unit Price (INR)</th>
        <th style="text-align: right;">Amount (INR)</th>
      </tr>
    </thead>
    <tbody>
      ${(request.requestedProducts || []).map((item: any) => `
        <tr>
          <td><strong>${item.productName || item.name}</strong></td>
          <td style="text-align: center;">${item.quantity}</td>
          <td style="text-align: right;">₹${(item.estimatedUnitPrice || item.price || 0).toLocaleString('en-IN')}</td>
          <td style="text-align: right;">₹${((item.estimatedUnitPrice || item.price || 0) * item.quantity).toLocaleString('en-IN')}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="totals">
    <div class="totals-row">
      <span>Subtotal (Excl. Tax):</span>
      <span>₹${(request.subtotal || 0).toLocaleString('en-IN')}</span>
    </div>
    <div class="totals-row">
      <span>18% GST (Indian Standard):</span>
      <span>₹${(request.taxAmount || 0).toLocaleString('en-IN')}</span>
    </div>
    <div class="totals-row">
      <span>Insured School Delivery:</span>
      <span>${request.shippingCharges === 0 ? 'FREE' : `₹${request.shippingCharges}`}</span>
    </div>
    <div class="totals-row grand-total">
      <span>Total Requested Amount:</span>
      <span>₹${(request.requestedAmount || request.finalAmount || 0).toLocaleString('en-IN')}</span>
    </div>
  </div>

  <div class="footer">
    Notice: Your order request has been successfully submitted. Our team will verify product availability and contact you shortly regarding pricing and payment.<br>
    Balki Technologies Pvt. Ltd. • Hyderabad Central Hub & Pan-India Distribution
  </div>
</body>
</html>`;

  triggerFileDownload(htmlContent, `Balki_Order_Request_${request.requestId}.html`, 'text/html;charset=utf-8');
}

