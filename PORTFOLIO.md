# 💼 FreshExpress - Portfolio Project

## 📖 About this project

FreshExpress is a complete web application developed as a portfolio project that simulates a real last-mile eco-friendly delivery platform using electric vehicles.

## 🎯 Project Goals

This project demonstrates competencies in:

### Backend & Database

- ✅ **Database architecture** - Design of two DBs (operational + ethical data broker)
- ✅ **Advanced MySQL** - Complex queries, joins, transactions
- ✅ **Connection pooling** - Efficient database connection management
- ✅ **RESTful APIs** - Well-structured and documented endpoints
- ✅ **JWT Authentication** - Secure system with bcrypt and tokens

### Frontend & UX

- ✅ **Astro SSR** - Server-Side Rendering for better SEO and performance
- ✅ **TypeScript** - Type-safe and maintainable code
- ✅ **Tailwind CSS** - Modern and responsive design
- ✅ **Reusable components** - Modular architecture
- ✅ **Multi-role UX** - Different interfaces for clients, delivery drivers, and admins

### Advanced Features

- ✅ **Real-time tracking system** - Order tracking
- ✅ **Role management** - RBAC (Role-Based Access Control)
- ✅ **Shopping cart** - With persistence and state management
- ✅ **Rating system** - Delivery driver scoring
- ✅ **Ethical data broker** - Anonymisation with explicit consent
- ✅ **Ecological impact calculation** - CO₂ emissions saved

### DevOps & Deployment

- ✅ **Environment variables** - Configuration per environment
- ✅ **Git workflow** - Professional version control
- ✅ **Complete documentation** - README, deployment guides
- ✅ **Security** - Best practices and secrets management
- ✅ **Scalability** - Production-ready architecture

## 🏗️ Technical Architecture

### Main Stack

```
┌─────────────────────────────────────────┐
│         Frontend (Astro + TS)           │
│  ┌──────────┐ ┌──────────┐ ┌─────────┐ │
│  │  Client  │ │ Delivery │ │  Admin  │ │
│  └────┬─────┘ └────┬─────┘ └────┬────┘ │
└───────┼────────────┼────────────┼───────┘
        │            │            │
        ▼            ▼            ▼
┌─────────────────────────────────────────┐
│           REST API (Astro)              │
│   /api/auth  /api/cart  /api/user       │
│   /api/repartidor  /api/admin           │
└───────────────────┬─────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│     MySQL Connection (Pool)             │
└───────┬─────────────────────┬───────────┘
        │                     │
        ▼                     ▼
┌──────────────┐     ┌─────────────────┐
│ Operational  │     │   Data Broker   │
│     DB       │     │  (Anonymised)   │
└──────────────┘     └─────────────────┘
```

### Authentication Flow

```
1. Login → 2. Verify credentials → 3. Generate JWT
   ↓              ↓                        ↓
4. Store token in cookie → 5. Middleware verifies token
   ↓                              ↓
6. Access to protected routes ← Valid token
```

### Role System

| Role         | Access                                    |
| ------------ | ----------------------------------------- |
| `cliente`    | Client dashboard, purchases, tracking     |
| `repartidor` | Delivery driver panel, delivery management|
| `admin`      | All panels + user management              |

## 📊 Key Features

### 1. Real-Time Tracking System

```typescript
// Automatic polling every 30 seconds
setInterval(async () => {
  const data = await fetch("/api/rastreig?codigo=" + codigo);
  updateMap(data.ubicacion);
}, 30000);
```

### 2. Ethical Data Broker

- **Anonymisation**: SHA-256 with salt
- **Consent**: Explicit opt-in
- **Transparency**: Documentation of what is collected
- **Benefits**: Discounts for participants

### 3. Emissions Calculation

```typescript
const co2Saved = distanciaKm * 0.12; // kg CO₂ per km
const treesEquivalent = co2Saved / 21; // 1 tree = 21kg CO₂/year
```

## 🎨 UI/UX Design

### Colour Palette

- **Primary Green**: `#3BB143` (Sustainability)
- **Corporate Blue**: `#0047AB` (Trust)
- **Accent Yellow**: `#FFD700` (Ratings)

### Key Components

- **Dynamic headers** for each role
- **Product cards** with hover effects
- **Accessible forms** with validation
- **Interactive maps** with Google Maps
- **Loading states** and visual feedback

## 📈 Project Metrics

- **Lines of code**: ~5,000+
- **Components**: 15+
- **Pages**: 25+
- **API endpoints**: 20+
- **DB tables**: 12+
- **Development time**: ~X weeks

## 🔮 Future Roadmap (Possible improvements)

- [ ] WebSockets for real-time tracking
- [ ] Mobile app with React Native
- [ ] Payment system with Stripe
- [ ] Chat between client and delivery driver
- [ ] Push notifications
- [ ] Analytics dashboard with charts
- [ ] Coupon and promotions system
- [ ] Public API for third parties
- [ ] Integration with other platforms

## 🎓 Key Learnings

This project allowed me to:

1. **Software architecture** - Design a scalable application from scratch
2. **Database management** - Relational design and query optimisation
3. **Web security** - Authentication, authorisation, data protection
4. **Multi-role UX** - Different interfaces depending on the user
5. **RESTful APIs** - Endpoint design and documentation
6. **Advanced TypeScript** - Types, interfaces, generics
7. **Basic DevOps** - Deployment, monitoring, backups

## 📞 Professional Contact

This project is part of my professional portfolio. If you are interested in collaborating or have questions:

- **LinkedIn**: [Your profile]
- **GitHub**: [Your GitHub]
- **Portfolio**: [Your website]
- **Email**: [Your professional email]

## 📄 Licence

This project is under the MIT licence and is free to study, modify, and use for educational purposes.

---

**Developed with** ❤️ **and** ☕ **to demonstrate full-stack web development competencies**
