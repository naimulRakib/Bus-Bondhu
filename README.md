# BusBondhu Express — Trust & Dispatch Layer for Intercity Bus Parcels

> **Ideathon Bangladesh 2026 Prototype & Investor Pitch Demo**  
> Customer-side Web App built with Next.js 16 (App Router), Tailwind CSS v4, Zustand, Framer Motion, and Sonner.

---

## 📌 Executive Summary & Thesis

Every day, hundreds of thousands of informal parcels travel off-the-books inside the luggage boots of intercity buses across Bangladesh. Merchants in wholesale hubs like Islampur and Chawkbazar use bus parcels because they arrive in **2 to 4 hours**, compared to traditional couriers (Sundarban, SA Paribahan, RedX) which take **24 to 48+ hours**.

However, the current informal bus parcel system is plagued by three systemic failures:
1. **Unpredictable Pricing & Extortion:** Counter clerks charge arbitrary cash amounts without receipts or rate cards.
2. **Zero Custody Tracking:** No proof of handover between the counter clerk, bus driver, and recipient.
3. **Severe Theft & Zero Recourse:** When a package is lost, damaged, or handed to the wrong stranger, the merchant receives **Tk 0 compensation**.

**BusBondhu Express** does **NOT** build or buy a vehicle fleet. Instead, it is an **asset-light software, custody, and settlement layer** that organizes the existing bus boot capacity into a trusted, predictable logistics network:
- **Confirmed Bus Departures & Fixed Upfront Band Pricing** (Standard: Tk 100, Medium: Tk 130, Bulky: Tk 160).
- **Client-Side QR Labeling** for physical counter verification.
- **Timestamped 5-Stage Custody Chain** (Origin counter → Manifest assignment → Bus boot departure → Destination arrival → Recipient pickup).
- **Secret 6-Digit Recipient Collection PIN** revealed exclusively at the destination counter.
- **24-Hour Verified Claim SLA** backed by a Tk 2,000 compensation pool (funded by a Tk 15 escrow per parcel).

---

## 🚀 Live Demo Architecture

The prototype is split into two cleanly separated layers:
1. **Customer-Facing Application (Mobile-First):**
   - **Landing Page (`/`):** Explains the 7-step verified journey and pilot corridor thesis.
   - **Mock Login (`/login`):** Pre-filled merchant credentials with 4-digit OTP simulation.
   - **Merchant Home (`/home`):** Active shipments, status badges, quick booking shortcut, and shipment history.
   - **5-Step Booking Wizard (`/book`):** Route & date selector, parcel size band calculator, restricted goods warning, verified departure picker, receiver details, and upfront price breakdown.
   - **Booking Confirmation (`/book/confirm`):** QR label generator with print preview, parcel dimensions, and counter handover instructions.
   - **Shipment Custody Timeline (`/shipment/[id]`):** Live animated Framer Motion timeline, departure countdown timer, and slide-over evidence inspection drawer (photos, GPS coordinates, operator badge IDs).
   - **Public Receiver Tracking (`/track/[token]`):** Masked sender/recipient privacy, secret 6-digit pickup code, destination counter operating hours, map placeholder, and simplified recipient timeline.
   - **Custody Claim Resolution (`/claim/[shipmentId]`):** Interactive incident category picker, local photo evidence upload with instant preview, pilot policy comparison (Tk 2,000 guarantee vs Tk 0 courier recourse), and 24h audit SLA roadmap.
   - **Notifications & SMS Log (`/notifications`):** Filterable audit log of all simulated SMS messages with phone screen popup preview.

2. **Simulated Operator & Counter Layer (Demo Control Panel):**
   - A floating, collapsible control panel activated by hotkey **`D`** or the top navigation bar.
   - Simulates physical bus counters and dispatch supervisors without requiring a separate backend or second device.
   - **Stage Advancer:** Moves any parcel forward one handover stage at a time.
   - **Auto-Play Presentation Engine:** Automatically advances stages every 1–6 seconds for hands-free pitching.
   - **Scenario Presets:**
     - *Happy Path:* Smooth progression from intake to delivery.
     - *Trip Delay:* Broadcasts highway congestion (+90m revised arrival window) and dispatches SMS alert.
     - *Missing Scan:* Simulates a lapsed handover scan window and unlocks immediate claim filing.
   - **Real-Time Sonner Toast Alerts:** Fires simulated SMS popup notifications whenever a stage updates.
   - **Interactive Phone Screen Modal:** Renders realistic mobile phone notifications for audience viewing.
   - **Investor Lens Dashboard:** Interactive financial model displaying unit economics, platform take-rate, TAM, and counter clerk incentives.

---

## ⏱️ The 3-Minute Ideathon Pitch Demo Script

Follow this script to deliver a pitch for judges and investors:

### Minute 1: The Problem & The 40-Second Booking (0:00 – 0:45)
1. **The Hook:** *"Intercity buses in Bangladesh carry over 100,000 parcels every single day in their luggage boots. Merchants use them because they arrive in 3 hours. But when a parcel goes missing, the merchant gets Tk 0, and the counter clerk claims he never saw it. BusBondhu fixes this."*
2. **Action:** Click **"Open Live Demo"** → Log in as Demo Merchant (pre-filled phone `01712-345678`).
3. **Action:** Click **"Book a New Parcel"** (`/book`):
   - Step 1: Select Dhaka (Sayedabad) → Cumilla (Sasongachha).
   - Step 2: Choose **Medium Band (Tk 130)** — point out the clear dimensions and restricted goods safety badge.
   - Step 3: Pick a confirmed departure (e.g., **Shohoj Express 09:30 AM**).
   - Step 4: Fill receiver details (pre-filled demo data).
   - Step 5: Review fixed upfront pricing (**Tk 130 total** vs unpredictable counter extortion).
4. **Action:** Click **"Confirm & Generate QR Label"** (`/book/confirm`). Show the instant QR code label: *"The merchant attaches this QR label before walking into the bus terminal."*

---

### Minute 2: The Digital Custody Handover Journey (0:45 – 1:45)
1. **Action:** Navigate to the shipment detail page (`/shipment/[id]`). Show the animated custody timeline and live departure cutoff countdown.
2. **Action:** Press **`D`** on your keyboard to open the **Demo Control Panel**.
3. **Action:** Click **"Advance One Stage"**:
   - Stage 1: Origin counter scans QR label. (Watch the instant Sonner toast notification pop up in the top right!).
   - Stage 2: Parcel added to bus luggage manifest.
   - Stage 3: Parcel loaded into boot; bus departs terminal.
4. **Action:** Click **"View Evidence"** on any timeline node to reveal the slide-over drawer: *"Every handover records the exact clerk badge ID, GPS coordinates, and package condition."*

---

### Minute 3: Receiver Collection, Exception Handling & Investor Unit Economics (1:45 – 3:00)
1. **Action:** Click **"Public Receiver View"** (`/track/[token]`).
   - Point out privacy masking (sender and receiver phones are protected).
   - Explain the **Secret Collection Code**: *"The receiver cannot take the parcel without this 6-digit PIN, eliminating wrongful pickups."*
2. **Action:** Trigger an exception from Demo Controls (press `D` → click **"Missing Scan"** or **"Delay Trip"**).
   - Watch the amber/red exception alert banner appear on the timeline.
   - Click **"Report Issue / File Claim"** (`/claim/[shipmentId]`).
   - Click **"Quick Demo: Use Sample Photo"** to show instant photo evidence preview.
   - Submit claim: show the **24-Hour SLA Roadmap** and explain the **Tk 2,000 pilot compensation pool**.
3. **Action:** Click **"Investor Lens"** in the top navbar:
   - Walk through the **Tk 130 Unit Economics Waterfall**:
     - Origin Counter Clerk: **Tk 20** (15%)
     - Bus Operator Boot Space: **Tk 35** (27%)
     - Destination Counter Clerk: **Tk 20** (15%)
     - Verification & Insurance Escrow: **Tk 15** (11%)
     - **Net BusBondhu Contribution: Tk 40 (31% margin)**.
   - Highlight the **Zero Fleet CapEx** advantage: *"We do not own a single bus. We turn existing luggage boots into high-margin logistics infrastructure."*

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 16.4 (App Router, Turbopack) | Server-side rendering, routing, static optimization |
| **Language** | TypeScript (Strict mode) | Type safety across domain entities & API contracts |
| **Styling** | Tailwind CSS v4 & CSS Tokens | Custom design system, responsive mobile layout |
| **Animation** | Framer Motion | Smooth timeline reveals and drawer transitions |
| **State Management** | Zustand (with localStorage persist) | Reactive store across shipments, notifications, auth & demo panel |
| **Notifications** | Sonner | Real-time SMS toast popups |
| **Icons** | Lucide React | Modern, consistent iconography |
| **QR Code** | `qrcode` | 100% client-side SVG QR label rendering |
| **Localization** | Custom i18n Context | English & বাংলা (Bangla) language toggle |

---

## 💻 Local Development Setup

### Prerequisites
- Node.js 18.18+ or Node.js 20+
- npm or pnpm

### 1. Installation
```bash
# Clone or navigate into the repository directory
cd Bus-Bondhu

# Install dependencies
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Open your browser at **`http://localhost:3000`**.

### 3. Build & Production Verification
```bash
# Run lint check (strict 0 errors, 0 warnings policy)
npm run lint

# Build production bundle
npm run build

# Start production server
npm run start
```

---

## 🎹 Keyboard Shortcuts & Demo Utilities

- **`D`**: Toggle the floating **Demo Control Panel** from any screen.
- **Auto-Play Speed Slider**: Adjust handover advancement speed between 1 and 6 seconds.
- **Load Seed**: Instantly reloads 3 demo shipments across different stages (`booked`, `loaded_departed`, `receiver_notified`).
- **Reset Data**: Clears store to demonstrate empty state handling.
- **Investor Lens (Top Navbar)**: Launches the pitch financial model and unit economics breakdown.
- **Language Toggle (Top Navbar)**: Instantly switches the UI between English and বাংলা.

---

## ⚠️ Prototype Disclaimer

> **Notice:** This application is an interactive prototype demo built for investor evaluation and Ideathon Bangladesh 2026. All bus departures, parcel tracking data, payments, and SMS dispatches are simulated locally within the browser. No real telecom charges, financial transactions, or bus operator luggage bookings are executed.
