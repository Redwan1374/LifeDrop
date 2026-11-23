# 🩸 LifeDrop — Emergency Blood Donor Finder & Request Network

<p align="center">
  <strong>Every Drop Counts. Every Life Matters.</strong>
</p>

<p align="center">
  A community-driven digital platform designed to connect blood donors with people in need, simplify emergency blood requests, and encourage life-saving voluntary donations.
</p>

<p align="center">
  <a href="https://github.com/Redwan1374/LifeDrop">GitHub Repository</a> •
  <a href="https://life-drop-blue.vercel.app/">Live Demo</a>
</p>

---

## 📖 About the Project

**LifeDrop** is a modern blood donor finder and emergency blood request platform designed to make blood donation coordination faster, easier, and more accessible.

In medical emergencies, finding a suitable blood donor within a limited time can be challenging for patients, families, and hospitals. LifeDrop aims to reduce this challenge by providing a centralized digital platform where people can discover blood donors, explore blood availability, and connect with individuals who are willing to donate.

With a modern, responsive, and user-friendly interface, LifeDrop promotes voluntary blood donation, community participation, and accessible donor discovery.

> **Our Mission:** To make blood donor connections easier, faster, and more accessible when every second matters.

---

## 🎯 Project Objectives

- Simplify the process of finding blood donors.
- Connect blood donors and blood requesters through a digital platform.
- Support emergency blood request coordination.
- Promote voluntary blood donation and awareness.
- Improve accessibility through location-oriented donor discovery.
- Create a user-friendly experience for people seeking blood during emergencies.

---

## ✨ Key Features

### 🩸 Blood Donor Discovery
Explore donor information and find potential blood donors based on blood group and location.

### 🚨 Emergency Blood Requests
Provide a dedicated interface for sharing urgent blood requirements and request-related information.

### 🧑‍🤝‍🧑 Donor Registration
Encourage individuals to join the donor community and share their willingness to donate blood.

### 🧬 Blood Group Exploration
Explore the eight major blood groups through a dedicated and accessible interface.

- A+
- A−
- B+
- B−
- AB+
- AB−
- O+
- O−

### 📍 Location-Oriented Search
Support donor discovery through city and location-based search interfaces.

### 📊 Dashboard Experience
Provide organized dashboard-style views for platform information, activities, and user-oriented interactions.

### 🏥 Hospital Information
Present hospital-related information and healthcare resources through a structured interface.

### 🔔 Notification Interface
Offer a notification-oriented experience for updates, requests, and important platform information.

### 📱 Responsive Design
Designed to provide a consistent browsing experience across desktop, tablet, and mobile devices.

---

## 🎨 UI/UX Highlights

LifeDrop focuses on combining usability with a visually engaging healthcare experience.

- Modern and vibrant visual identity
- Premium gradient-based design elements
- Clean typography and readable layouts
- Responsive navigation
- Interactive UI components
- Rounded cards and subtle shadows
- Color-coded blood group elements
- Emergency-focused visual hierarchy
- Smooth transitions and micro-interactions
- User-friendly forms and layouts

### Color Palette

| Color | Hex Code | Purpose |
|---|---|---|
| Blood Red | `#E63946` | Primary actions and emergency emphasis |
| Coral | `#FF647C` | Highlights and accents |
| Pink | `#FF4D9D` | Decorative elements |
| Violet | `#8B5CF6` | Secondary visual accents |
| Electric Blue | `#4D96FF` | Information elements |
| Mint Green | `#36D6A5` | Positive indicators |
| Dark Navy | `#171C3A` | Text and contrast |
| Soft Background | `#F8F7FF` | Page backgrounds |

---

## 🛠️ Technology Stack

### Frontend

- **React 19** — Component-based user interface development
- **TypeScript** — Type-safe development
- **Vite 8** — Development server and build tooling
- **Tailwind CSS 4** — Utility-first styling
- **Lucide React** — Icon library
- **Motion** — Animation and interactive transitions

### Development Tools

- npm
- Git
- GitHub
- Vercel

---

## 🏗️ Project Structure

```text
LifeDrop/
│
├── src/                   # Application source code
│
├── index.html              # Main HTML entry point
├── package.json             # Project dependencies and scripts
├── package-lock.json        # Dependency lock file
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts           # Vite configuration
├── metadata.json           # Application metadata
├── .env.example            # Environment variable template
├── .gitignore              # Git ignored files
└── README.md                # Project documentation
```

---

## 🚀 Getting Started

Follow these steps to run LifeDrop locally.

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/)
- npm
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Redwan1374/LifeDrop.git
```

### 2. Navigate to the Project Directory

```bash
cd LifeDrop
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

If the application requires Gemini API integration, create a `.env.local` file in the project root and configure the required API key.

```env
GEMINI_API_KEY=your_gemini_api_key
```

Replace `your_gemini_api_key` with your own API key.

> Never commit private API keys, passwords, tokens, or other sensitive credentials to GitHub.

### 5. Start the Development Server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm install` | Install project dependencies |
| `npm run dev` | Start the local development server |
| `npm run build` | Build the application for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run TypeScript validation |

---

## 🌐 Deployment

LifeDrop can be deployed using **Vercel**.

### Deployment Steps

1. Push the project to GitHub.
2. Visit [Vercel](https://vercel.com/).
3. Import the `Redwan1374/LifeDrop` repository.
4. Configure environment variables if required.
5. Verify the build settings.
6. Deploy the project.

Vercel can automatically build and redeploy the application whenever new changes are pushed to the connected GitHub repository.

### Production Build

To test the production build locally:

```bash
npm run build
```

To preview the generated build:

```bash
npm run preview
```

---

## 🔐 Privacy & Safety

LifeDrop is designed around the importance of privacy, responsible information sharing, and safe donor coordination.

- Personal information should be shared responsibly.
- Donor contact information should be protected.
- Donor availability should not be interpreted as medical eligibility.
- Blood donation eligibility should be confirmed with qualified healthcare professionals.
- Emergency blood requests should contain accurate and verifiable information.

**Disclaimer:** LifeDrop is intended to facilitate blood donor discovery and coordination. It does not replace hospitals, qualified healthcare professionals, medical screening, or emergency medical services. In a medical emergency, contact the appropriate healthcare facility immediately.

---

## 🔮 Future Development

Potential future improvements include:

- Secure user authentication
- Real-time donor availability
- Database integration
- Verified donor registration
- Automated notifications
- Advanced donor matching
- Interactive donor maps
- Hospital and blood bank partnerships
- Request status tracking
- Admin dashboard
- Bangla and English language support
- Progressive Web App (PWA) support

---

## 🤝 Contributing

Contributions, suggestions, bug reports, and feature requests are welcome.

To contribute:

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Commit your changes.
5. Submit a Pull Request.

For major changes, open an issue first to discuss the proposed improvement.

---

## 👨‍💻 Developer

**Redwan Ahmed Rafi**

Computer Science & Engineering Student  
Daffodil International University, Bangladesh

- GitHub: [@Redwan1374](https://github.com/Redwan1374)
- Project Repository: [LifeDrop](https://github.com/Redwan1374/LifeDrop)

---

## 📄 License

The licensing terms for this project have not yet been specified. Please contact the repository owner regarding permission for reuse, distribution, or modification.

---

<p align="center">
  <strong>🩸 Every Drop Counts. Every Life Matters.</strong>
</p>

<p align="center">
  Built with ❤️ to promote voluntary blood donation and help save lives.
</p>
