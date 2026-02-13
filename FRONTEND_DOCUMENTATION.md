# Hotel Beach - Frontend Documentation

## Overview

The frontend is built with Next.js 14 (App Router), TypeScript, and Tailwind CSS, providing a modern, responsive user interface for the Hotel Beach booking system.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Date Handling:** date-fns
- **PDF Generation:** jsPDF
- **Form Handling:** React Hook Form (where applicable)

---

## 📁 Project Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   ├── not-found.tsx            # 404 page
│   │
│   ├── about/                   # About page
│   │   └── page.tsx
│   │
│   ├── rooms/                   # Rooms listing
│   │   └── page.tsx
│   │
│   ├── accommodation/           # Room details
│   │   ├── [slug]/
│   │   │   └── page.tsx        # Dynamic room page
│   │   └── deluxe-room/
│   │       └── page.tsx        # Static room page
│   │
│   ├── search-results/          # Search & filter
│   │   └── page.tsx
│   │
│   ├── booking-confirmation/    # Booking flow
│   │   └── page.tsx
│   │
│   ├── blog/                    # Blog system
│   │   ├── page.tsx            # Blog listing
│   │   └── [slug]/
│   │       └── page.tsx        # Blog post
│   │
│   ├── contact/                 # Contact page
│   │   └── page.tsx
│   │
│   ├── explore/                 # Explore Santorini
│   │   └── page.tsx
│   │
│   ├── login/                   # Authentication
│   │   └── page.tsx
│   │
│   ├── register/                # User registration
│   │   └── page.tsx
│   │
│   └── dashboard/               # Role-based dashboards
│       ├── admin/               # Admin panel
│       │   ├── page.tsx        # Admin dashboard
│       │   ├── bookings/       # Booking management
│       │   │   ├── page.tsx
│       │   │   └── [id]/
│       │   │       └── page.tsx
│       │   ├── users/          # User management
│       │   │   └── page.tsx
│       │   ├── rooms/          # Room management
│       │   │   └── page.tsx
│       │   ├── home/           # Home CMS
│       │   │   └── page.tsx
│       │   ├── about/          # About CMS
│       │   │   └── page.tsx
│       │   ├── explore/        # Explore CMS
│       │   │   └── page.tsx
│       │   ├── theme/          # Theme settings
│       │   │   └── page.tsx
│       │   ├── site-settings/  # Site settings
│       │   │   └── page.tsx
│       │   ├── booking-settings/ # Booking settings
│       │   │   └── page.tsx
│       │   └── contact-settings/ # Contact settings
│       │       └── page.tsx
│       │
│       ├── guest/              # Guest dashboard
│       │   ├── page.tsx       # Guest overview
│       │   ├── bookings/      # My bookings
│       │   │   ├── page.tsx
│       │   │   └── [id]/
│       │   │       └── page.tsx
│       │   ├── profile/       # Profile management
│       │   │   └── page.tsx
│       │   └── contact/       # AI Concierge
│       │       └── page.tsx
│       │
│       └── staff/             # Staff dashboard
│           └── page.tsx
│
├── components/                 # Reusable components
│   ├── home/                  # Home page sections
│   │   ├── HeroH1.tsx
│   │   ├── IntroSectionH2.tsx
│   │   ├── DeluxeRoomH3.tsx
│   │   ├── ChefExperienceH4.tsx
│   │   ├── RetreatSpaH5.tsx
│   │   ├── SignatureDesignsH6.tsx
│   │   └── ExploreSantoriniH7.tsx
│   │
│   ├── rooms/                 # Room components
│   │   ├── RetreatSectionR0.tsx
│   │   ├── RoomShowcaseR1.tsx
│   │   ├── RoomDetailComponent.tsx
│   │   ├── SpaSectionR3.tsx
│   │   └── PromotionGridR4.tsx
│   │
│   ├── blog/                  # Blog components
│   │   └── BlogB1.tsx
│   │
│   ├── about/                 # About components
│   │   └── AboutA1.tsx
│   │
│   ├── explore/               # Explore components
│   │   └── ExplorePageE1.tsx
│   │
│   ├── contact/               # Contact components
│   │   └── ContactPageC1.tsx
│   │
│   ├── dashboard/             # Dashboard components
│   │   └── DashboardLayout.tsx
│   │
│   ├── ui/                    # UI components
│   │   └── date-range-picker.tsx
│   │
│   ├── Header.tsx             # Site header
│   ├── Footer.tsx             # Site footer
│   ├── RouteGuard.tsx         # Auth protection
│   ├── ImageUpload.tsx        # Single image upload
│   ├── MultiImageUpload.tsx   # Multiple image upload
│   ├── LayoutWrapper.tsx      # Layout wrapper
│   ├── MainContentWrapper.tsx # Content wrapper
│   ├── PageTransition.tsx     # Page transitions
│   ├── PageLoaderAdvanced.tsx # Loading states
│   ├── UnifiedPageLoader.tsx  # Unified loader
│   ├── ResponsiveContainer.tsx # Responsive container
│   └── SideDrawerMenu.tsx     # Mobile menu
│
├── lib/                       # Utilities
│   ├── api.ts                # API client & endpoints
│   ├── utils.ts              # Helper functions
│   └── generateInvoicePDF.ts # PDF generation
│
├── store/                     # Zustand stores
│   └── authStore.ts          # Authentication state
│
├── styles/                    # Global styles
│   ├── globals.css           # Global CSS
│   └── mobile-optimizations.css # Mobile styles
│
├── data/                      # Static data
│   └── roomsData.ts          # Room data
│
├── doc/                       # Documentation
│   ├── IMPLEMENTATION_COMPLETE.md
│   ├── AVAILABILITY_CHECK_COMPLETE.md
│   ├── PAGES_CMS_IMPLEMENTATION.md
│   ├── DASHBOARD_GUIDE.md
│   ├── LOADER_SETUP_INSTRUCTIONS.md
│   └── NEXT_STEPS.md
│
├── public/                    # Static assets
│   └── images/
│
├── .env.local                # Environment variables
├── .env.example              # Environment template
├── next.config.js            # Next.js configuration
├── tailwind.config.js        # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
├── package.json              # Dependencies
└── README.md                 # Project readme
```

---

## 🎯 Key Features

### 1. Public Pages

#### Home Page (`/`)
- **Hero Section (H1):** Full-screen hero with CTA
- **Intro Section (H2):** Hotel introduction
- **Deluxe Room (H3):** Featured room showcase
- **Chef Experience (H4):** Dining highlights
- **Retreat & Spa (H5):** Wellness offerings
- **Signature Designs (H6):** Design showcase
- **Explore Santorini (H7):** Local attractions
- All sections are CMS-managed
- Fully responsive design

#### Rooms Page (`/rooms`)
- Room listing with grid layout
- Filter by availability
- Dynamic content from CMS
- Responsive cards

#### Room Details (`/accommodation/[slug]`)
- Dynamic routing
- Image gallery
- Amenities list
- Pricing information
- Real-time availability
- Booking integration
- Responsive layout

#### Search Results (`/search-results`)
- Advanced filters:
  - Date range picker
  - Guest count (adults/children)
  - Price range slider
  - Room type selection
  - Amenities checkboxes
- Live currency conversion (45+ currencies)
- Real-time availability checking
- Sortable results
- Responsive grid layout
- Mobile-optimized filters

#### Booking Confirmation (`/booking-confirmation`)
- Multi-step booking flow
- Guest information form
- Form validation with error messages
- Country selection (195 countries)
- Currency converter
- Booking summary
- Payment details
- Terms & conditions
- Fully responsive

#### Blog (`/blog`)
- Blog post listing
- Category filtering
- Featured images
- Dynamic routing for posts
- SEO optimized
- Responsive layout

#### About (`/about`)
- Hotel information
- CMS-managed content
- Image galleries
- Responsive sections

#### Explore (`/explore`)
- Santorini attractions
- Local recommendations
- CMS-managed content
- Responsive layout

#### Contact (`/contact`)
- Contact form
- Location map
- Contact information
- Service hours
- Responsive design

### 2. Authentication

#### Login (`/login`)
- Email/password login
- Google OAuth button
- Form validation
- Error handling
- Redirect after login
- Responsive design

#### Register (`/register`)
- User registration form
- Email/password
- Name and phone
- Form validation
- Success redirect
- Responsive design

### 3. Guest Dashboard (`/dashboard/guest`)

#### Overview
- Welcome message
- Booking statistics cards
- Upcoming bookings list
- Past bookings
- Quick actions
- Responsive grid layout

#### My Bookings (`/dashboard/guest/bookings`)
- All bookings list
- Status filters
- Search functionality
- Booking cards
- Mobile-optimized

#### Booking Details (`/dashboard/guest/bookings/[id]`)
- Complete booking information
- Room details with image
- Check-in/out dates
- Guest information
- Payment summary
- QR code
- Booking timeline
- Download invoice (PDF)
- Cancel booking option
- Fully responsive

#### Profile (`/dashboard/guest/profile`)
- Personal information form
- Email (read-only)
- Name and phone
- Billing information
- Country selection (195 countries)
- Address fields
- Save changes
- Fully responsive

#### Contact/Concierge (`/dashboard/guest/contact`)
- AI chatbot interface
- Message history
- Quick action buttons
- Direct contact cards (phone, email, location)
- Service hours display
- Emergency hotline
- Dynamic contact data
- Fully responsive

### 4. Admin Dashboard (`/dashboard/admin`)

#### Overview
- Key metrics
- Statistics cards
- Recent bookings
- Revenue charts
- Quick actions
- Responsive layout

#### Booking Management (`/dashboard/admin/bookings`)
- All bookings table
- Search by:
  - Guest name
  - Email
  - Phone
  - Room name
  - Booking ID
- Filter by status
- Sortable columns:
  - Guest name
  - Room
  - Check-in date
  - Check-out date
  - Total price
  - Status
- Pagination
- View details
- Update status
- Responsive table

#### Booking Details (`/dashboard/admin/bookings/[id]`)
- Complete booking view
- Guest information
- Room details
- Payment tracking
- Status updates
- Timeline
- Actions (confirm, cancel)
- Responsive layout

#### User Management (`/dashboard/admin/users`)
- All users table
- Search by:
  - Name
  - Email
  - Phone
  - Role
  - User ID
- Filter by role
- Sortable columns:
  - Name
  - Email
  - Role
  - Status
  - Joined date
- Create new user
- Edit user role
- Activate/deactivate
- Delete user
- Responsive table

#### Room Management (`/dashboard/admin/rooms`)
- Room listing
- Add new room
- Edit room details
- Upload images (Cloudinary)
- Set pricing
- Manage amenities
- Toggle availability
- Delete rooms
- Responsive forms

#### Content Management System

**Home Page CMS (`/dashboard/admin/home`)**
- Edit all 7 sections
- Upload images
- Edit text content
- Toggle section visibility
- Reorder sections
- Preview changes
- Responsive editor

**About Page CMS (`/dashboard/admin/about`)**
- Multiple content sections
- Image management
- Text editing
- Section visibility
- Responsive editor

**Explore Page CMS (`/dashboard/admin/explore`)**
- Attractions management
- Recommendations
- Image uploads
- Text editing
- Responsive editor

**Theme Settings (`/dashboard/admin/theme`)**
- Color scheme
- Typography
- Logo upload
- Favicon
- Brand colors
- Responsive editor

**Site Settings (`/dashboard/admin/site-settings`)**
- Navigation menu
- Footer content
- Social media links
- SEO settings
- Responsive editor

**Booking Settings (`/dashboard/admin/booking-settings`)**
- Cancellation policies
- Payment methods
- Booking rules
- Pricing rules
- Responsive editor

**Contact Settings (`/dashboard/admin/contact-settings`)**
- Phone numbers
- Email addresses
- Location details
- Service hours (Front Desk, Room Service, Concierge, Spa, Restaurant)
- Emergency hotline
- Responsive forms

### 5. Staff Dashboard (`/dashboard/staff`)
- View bookings
- Update status
- Guest management
- Responsive layout

---

## 🔐 Authentication & Authorization

### Auth Store (Zustand)
```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}
```

### Route Protection
- `RouteGuard` component
- Role-based access control
- Redirect to login if unauthorized
- Supports multiple roles per route

### Protected Routes
- `/dashboard/admin/*` - Admin only
- `/dashboard/staff/*` - Staff only
- `/dashboard/guest/*` - Guest only

---

## 🌐 API Integration

### API Client (`lib/api.ts`)

**Base Configuration:**
```typescript
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' }
});
```

**Interceptors:**
- Request: Adds JWT token to headers
- Response: Handles 401 errors, auto-logout

**API Endpoints:**

```typescript
// Authentication
authAPI.register(data)
authAPI.login(data)
authAPI.getProfile()
authAPI.updateProfile(data)
authAPI.changePassword(data)
authAPI.getAllUsers()
authAPI.createUser(data)
authAPI.updateUser(userId, data)
authAPI.deleteUser(userId)

// Rooms
roomsAPI.getAll()
roomsAPI.getById(id)
roomsAPI.getAvailable(checkIn, checkOut)
roomsAPI.create(data)
roomsAPI.update(id, data)
roomsAPI.delete(id)

// Bookings
bookingsAPI.checkAvailability(data)
bookingsAPI.create(data)
bookingsAPI.getAll()
bookingsAPI.getMyBookings()
bookingsAPI.getById(id)
bookingsAPI.updateStatus(id, status)
bookingsAPI.updatePaymentStatus(id, status, method)
bookingsAPI.cancel(id)

// Content/CMS
contentAPI.getAll()
contentAPI.getByPage(pageName)
contentAPI.create(data)
contentAPI.update(pageName, data)

// Blog
blogAPI.getAll()
blogAPI.getBySlug(slug)
blogAPI.create(data)
blogAPI.update(id, data)
blogAPI.delete(id)

// Contact Settings
contactSettingsAPI.get()
contactSettingsAPI.update(data)

// Upload
uploadAPI.uploadImage(file)
```

---

## 🎨 Styling & Design

### Tailwind Configuration
```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: '#59a4b5',
      secondary: '#4a8a99',
    }
  }
}
```

### Responsive Breakpoints
- `sm`: 640px (tablet)
- `md`: 768px
- `lg`: 1024px (desktop)
- `xl`: 1280px
- `2xl`: 1536px

### Common Patterns
```tsx
// Responsive padding
className="p-4 sm:p-6 md:p-8"

// Responsive text
className="text-sm sm:text-base md:text-lg"

// Responsive grid
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"

// Responsive button
className="w-full sm:w-auto"
```

### Color Scheme
- Primary: `#59a4b5` (Teal)
- Secondary: `#4a8a99` (Dark Teal)
- Gradients: `from-[#59a4b5] to-[#4a8a99]`
- Gray scale for text and backgrounds

---

## 📱 Responsive Design

All pages are fully responsive with:
- Mobile-first approach
- Adaptive layouts
- Touch-friendly interfaces
- Responsive images
- Mobile navigation drawer
- Responsive tables
- Stacked forms on mobile
- Optimized spacing

---

## 🔧 Utilities

### PDF Generation (`lib/generateInvoicePDF.ts`)
- Generate booking invoices
- Include booking details
- QR code integration
- Professional formatting
- Download functionality

### Helper Functions (`lib/utils.ts`)
- Date formatting
- Price formatting
- String manipulation
- Validation helpers

---

## 🚀 Setup & Development

### Installation
```bash
npm install
```

### Environment Variables
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

### Development
```bash
npm run dev
# Open http://localhost:3000
```

### Build
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

---

## 📦 Dependencies

### Core
- next: ^14.0.0
- react: ^18.0.0
- react-dom: ^18.0.0
- typescript: ^5.0.0

### State & Data
- zustand: ^4.4.0
- axios: ^1.5.0
- date-fns: ^2.30.0

### UI & Styling
- tailwindcss: ^3.3.0
- lucide-react: ^0.290.0
- framer-motion: ^10.16.0

### Utilities
- jspdf: ^2.5.1
- qrcode: ^1.5.3

---

## 🎯 Features Checklist

✅ Server-side rendering (SSR)
✅ Static site generation (SSG)
✅ Dynamic routing
✅ API integration
✅ Authentication & authorization
✅ Role-based access control
✅ Responsive design
✅ Mobile optimization
✅ Form validation
✅ Error handling
✅ Loading states
✅ Image optimization
✅ SEO optimization
✅ PDF generation
✅ Currency conversion
✅ Real-time availability
✅ Search & filtering
✅ Sorting capabilities
✅ CMS integration
✅ Blog system
✅ Multi-language ready

---

## 🔄 State Management

### Auth Store
- User information
- JWT token
- Authentication status
- Login/logout actions
- Persistent storage (localStorage)

### Component State
- Local state with useState
- Form state management
- Loading states
- Error states
- Modal states

---

## 🎨 Component Patterns

### Page Components
```tsx
export default function PageName() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  if (isLoading) return <Loader />;
  
  return (
    <RouteGuard allowedRoles={['guest']}>
      <DashboardLayout>
        {/* Page content */}
      </DashboardLayout>
    </RouteGuard>
  );
}
```

### Reusable Components
```tsx
interface ComponentProps {
  title: string;
  data: any[];
  onAction: () => void;
}

export default function Component({ title, data, onAction }: ComponentProps) {
  return (
    <div className="responsive-classes">
      {/* Component content */}
    </div>
  );
}
```

---

## 🚧 Future Enhancements

- [ ] Progressive Web App (PWA)
- [ ] Offline support
- [ ] Push notifications
- [ ] Advanced animations
- [ ] Skeleton loaders
- [ ] Infinite scroll
- [ ] Virtual scrolling
- [ ] Image lazy loading
- [ ] Code splitting optimization
- [ ] Performance monitoring
- [ ] A/B testing
- [ ] Analytics integration
- [ ] Error tracking (Sentry)
- [ ] Accessibility improvements
- [ ] Multi-language support (i18n)

---

## 📝 Best Practices

### Code Organization
- One component per file
- Logical folder structure
- Consistent naming conventions
- TypeScript for type safety

### Performance
- Image optimization with Next.js Image
- Code splitting
- Lazy loading
- Memoization where needed
- Efficient re-renders

### Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus management
- Color contrast

### SEO
- Meta tags
- Open Graph tags
- Structured data
- Sitemap
- Robots.txt

---

**Last Updated:** February 13, 2026
**Version:** 1.0.0
