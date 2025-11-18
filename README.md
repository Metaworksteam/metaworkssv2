# 🚀 MetaWorks - Cybersecurity Compliance Platform

**One-Click Cybersecurity Compliance Solution**

MetaWorks is a comprehensive SaaS-based compliance platform with an intuitive UI/UX that helps organizations achieve and maintain cybersecurity compliance across multiple frameworks.

## ✨ Features

- **🔐 Multi-Framework Support**
  - NCA ECC (Saudi National Cybersecurity Authority)
  - SAMA CSF (Saudi Central Bank)
  - ISO 27001
  - PDPA (Personal Data Protection Act)

- **🎯 Risk Management**
  - Risk assessment and prediction
  - Real-time risk scoring
  - Automated risk monitoring

- **📋 Policy Management**
  - Document upload and management
  - Policy compliance tracking
  - Automated policy updates

- **🤖 AI-Powered Assistant**
  - Virtual cybersecurity consultant
  - Compliance guidance and recommendations
  - Automated compliance reporting

- **📊 Dashboard & Analytics**
  - Real-time compliance scoring
  - Risk heatmaps and visualizations
  - Progress tracking and timelines

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL + Drizzle ORM
- **Authentication**: Clerk + Custom Auth
- **UI Components**: shadcn/ui + Radix UI
- **Build Tool**: Vite
- **Deployment**: Ready for Vercel, Netlify, or any cloud platform

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL (optional for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/metaworks.git
   cd metaworks
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Run the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production build
   npm run build
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:5000`

## 🔧 Configuration

### Environment Variables

```env
# Database (optional for development)
DATABASE_URL=postgresql://username:password@localhost:5432/metaworks

# Clerk Authentication (optional)
CLERK_PUBLISHABLE_KEY=pk_live_your_key_here
CLERK_SECRET_KEY=sk_live_your_secret_here

# Session Configuration
SESSION_SECRET=your-session-secret-here

# OpenAI (optional)
OPENAI_API_KEY=your-openai-key-here

# DID Agent (optional)
DID_AGENT_ID=your-did-agent-id
DID_API_KEY=your-did-api-key
```

## 📁 Project Structure

```
MetaWorks/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/           # Utilities
├── server/                 # Express.js backend
│   ├── api/               # API endpoints
│   ├── auth.ts            # Authentication
│   └── db.ts              # Database connection
├── shared/                 # Shared schemas
├── scripts/                # Database scripts
└── public/                 # Static assets
```

## 🌐 Available Routes

- **Home**: `/` - Landing page
- **Dashboard**: `/dashboard` - User dashboard
- **Admin**: `/admin-dashboard` - Admin panel
- **Frameworks**: `/frameworks/*` - Compliance frameworks
- **Risk Management**: `/risk-management`
- **Virtual Assistant**: `/virtual-assistant`
- **Company Dashboard**: `/company`

## 🚀 Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

### Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop the `dist/public` folder to Netlify
   - Or use Netlify CLI

### Docker

1. **Build image**
   ```bash
   docker build -t metaworks .
   ```

2. **Run container**
   ```bash
   docker run -p 5000:5000 metaworks
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Wiki](https://github.com/yourusername/metaworks/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/metaworks/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/metaworks/discussions)

## 🙏 Acknowledgments

- Built with modern web technologies
- Designed for cybersecurity professionals
- Inspired by industry best practices

---

**Made with ❤️ for the cybersecurity community**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20-green.svg)](https://nodejs.org/)
