# Empress MVP

A comprehensive menopause wellness platform built with Next.js 14, providing AI-powered guidance, community support, and wellness resources for women navigating menopause.

## 🌟 Features

### Core Functionality
- **🏠 Landing Page**: Compelling value proposition with email capture and clear navigation
- **🤖 AskEmpress**: AI-powered menopause concierge for personalized guidance and support
- **✨ Affirmations**: Customizable daily affirmations with AM/PM scheduling and tone selection
- **📊 Check-ins**: Weekly wellness tracking with trend visualization and progress insights
- **🛍️ Shop**: Shopify-integrated wellness product catalog with subscription options
- **👥 Pods**: Micro-community support groups with discussion threads and event calendar
- **👩‍⚕️ Doctors**: Healthcare provider directory by specialty (coming soon)
- **🏆 Account**: Gamification system with streaks, badges, and community leaderboard

### Design & UX
- **🎨 Luxury Theme**: Inspired by EmpressNaturals.co with purple and gold palette
- **📱 Mobile-First**: Responsive design optimized for all devices
- **♿ Accessible**: WCAG AA compliant with proper ARIA labels and keyboard navigation
- **🔒 Secure**: Client-side safety with proper environment variable handling

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. **Clone and install**:
   \`\`\`bash
   git clone <repository-url>
   cd empress-mvp
   pnpm install
   \`\`\`

2. **Environment setup**:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   Configure your API keys (see Environment Variables section below).

3. **Development server**:
   \`\`\`bash
   pnpm dev
   \`\`\`
   Open [http://localhost:3000](http://localhost:3000) to view the application.

4. **Build for production**:
   \`\`\`bash
   pnpm build
   pnpm start
   \`\`\`

## 🔧 Environment Variables

Create a `.env.local` file with the following variables:

### AI Integration (Choose one)
\`\`\`bash
# OpenAI (recommended)
OPENAI_API_KEY=sk-...

# OR Google Gemini
GEMINI_API_KEY=...
\`\`\`

### E-commerce Integration
\`\`\`bash
# Shopify Storefront API
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_API_TOKEN=...
\`\`\`

### Notifications (Future)
\`\`\`bash
# Twilio (for SMS affirmations)
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=...

# Resend (for email notifications)
RESEND_API_KEY=...
\`\`\`

## 📁 Project Structure

\`\`\`
empress-mvp/
├── app/                    # Next.js App Router
│   ├── (routes)/
│   │   ├── coach/         # AI chat interface
│   │   ├── affirmations/  # Daily affirmation scheduler
│   │   ├── checkins/      # Weekly wellness tracking
│   │   ├── shop/          # Product catalog & details
│   │   ├── pods/          # Community groups & calendar
│   │   ├── doctors/       # Healthcare provider directory
│   │   └── account/       # User dashboard & gamification
│   ├── api/               # API routes
│   │   ├── askEmpress/    # AI chat endpoint
│   │   ├── affirmations/  # Affirmation scheduling
│   │   ├── checkins/      # Wellness data storage
│   │   ├── shopify/       # Product data integration
│   │   └── email-signup/  # Email capture
│   ├── globals.css        # Empress luxury theme styles
│   └── layout.tsx         # Root layout with navigation
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── chat-interface.tsx
│   ├── products-grid.tsx
│   ├── navigation.tsx
│   └── ...
├── lib/                   # Utilities & configuration
│   ├── theme.ts          # Empress brand theme config
│   ├── storage.ts        # localStorage utilities
│   └── utils.ts          # General utilities
└── hooks/                # Custom React hooks
\`\`\`

## 🛡️ Security & Privacy

### Data Handling
- **No Persistent Storage**: MVP uses localStorage for demo purposes only
- **Client-Side Safety**: No sensitive data stored in browser beyond user preferences
- **Environment Variables**: All API keys server-side only, never exposed to client
- **Input Validation**: All user inputs sanitized and validated

### Production Considerations
- **HIPAA Compliance**: Future versions will require BAA (Business Associate Agreement) with AI vendors
- **Data Encryption**: All user data will be encrypted at rest and in transit
- **Audit Logging**: Comprehensive logging for healthcare compliance
- **Access Controls**: Role-based permissions for healthcare provider features

### Current Limitations
⚠️ **This is an MVP for demonstration purposes**:
- Uses mock data and localStorage persistence
- No real payment processing or medical advice
- AI responses are educational only, not diagnostic
- No user authentication or data persistence

## 🎯 API Routes

### Core Endpoints
- `GET /api/shopify/products` - Product catalog (Shopify integration)
- `POST /api/askEmpress` - AI chat responses
- `POST /api/affirmations` - Schedule affirmations
- `GET|POST /api/checkins` - Wellness tracking data
- `POST /api/email-signup` - Email list management

### Response Format
All API routes return consistent JSON responses:
\`\`\`typescript
{
  success: boolean
  data?: any
  error?: string
  message?: string
}
\`\`\`

## 🚧 Current Limitations

### MVP Constraints
- **Demo Data**: Uses localStorage and mock responses
- **No Authentication**: Open access for demonstration
- **No Real Payments**: Shop buttons are placeholders
- **No Live Chat**: Pod discussions stored locally
- **No Notifications**: Affirmations scheduled but not sent

### Known Issues
- Calendar integration requires manual ICS/Google Calendar setup
- Doctor profiles are placeholder content only
- Leaderboard uses mock user data
- AI responses are limited to predefined topics

## 🔮 Next Steps

### Phase 1: Core Integrations
- [ ] **AI Integration**: Connect OpenAI/Gemini APIs with RAG for menopause-specific knowledge
- [ ] **Shopify Integration**: Complete checkout flow and inventory management
- [ ] **Notification System**: Implement Twilio (SMS) and Resend (email) for affirmations
- [ ] **Database Migration**: Move from localStorage to PostgreSQL/Supabase

### Phase 2: Enhanced Features
- [ ] **User Authentication**: Implement secure login with NextAuth.js
- [ ] **Real-time Chat**: Add WebSocket support for pod discussions
- [ ] **Calendar Integration**: Connect Google Calendar/Outlook for scheduling
- [ ] **Payment Processing**: Integrate Stripe for shop transactions
- [ ] **Healthcare Provider API**: Connect with medical directory services

### Phase 3: Advanced Capabilities
- [ ] **Telehealth Integration**: Video consultations with healthcare providers
- [ ] **Wearable Data**: Sync with fitness trackers for comprehensive wellness tracking
- [ ] **AI Personalization**: Advanced ML for personalized recommendations
- [ ] **Community Moderation**: AI-powered content moderation for pods
- [ ] **Analytics Dashboard**: Comprehensive wellness insights and reporting

### Phase 4: Compliance & Scale
- [ ] **HIPAA Compliance**: Full healthcare data protection implementation
- [ ] **Multi-language Support**: Internationalization for global reach
- [ ] **Mobile Apps**: Native iOS/Android applications
- [ ] **Enterprise Features**: White-label solutions for healthcare organizations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript strict mode
- Use Prettier for code formatting
- Write meaningful commit messages
- Add JSDoc comments for complex functions
- Ensure accessibility compliance
- Test on mobile devices

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

For technical support or questions:
- Create an issue in this repository
- Contact: [support@empress-mvp.com](mailto:support@empress-mvp.com)
- Documentation: [docs.empress-mvp.com](https://docs.empress-mvp.com)

---

**⚠️ Medical Disclaimer**: This application provides educational information only and is not intended as medical advice. Always consult with qualified healthcare providers for medical concerns and treatment decisions.

**🔒 Privacy Notice**: This MVP uses localStorage for demonstration. Production versions will implement comprehensive privacy protections and comply with healthcare regulations.
