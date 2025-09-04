# ShopWave E-Commerce Platform

A modern, mobile-first e-commerce platform built with Next.js, Supabase, and Google Sheets integration.

## Features

- 🛍️ **Complete E-commerce Experience**: Product catalog, cart, checkout, order management
- 📱 **Mobile-First Design**: Responsive design optimized for mobile devices
- 🔐 **Authentication**: Supabase-based phone number authentication with OTP
- 📊 **Product Management**: Google Sheets integration for easy product data management
- 💰 **Referral System**: Built-in referral program with discount codes
- 🏪 **Admin Dashboard**: Complete admin interface for order and product management
- 💳 **Payment Integration**: Razorpay integration for online payments
- 📞 **WhatsApp Integration**: Direct order notifications via WhatsApp

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Backend**: Supabase (PostgreSQL database)
- **Product Data**: Google Sheets API
- **Authentication**: Supabase Auth with OTP
- **Payments**: Razorpay
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **UI Components**: Custom components with Radix UI

## Quick Start

### Prerequisites

- Node.js 18+
- A Supabase account
- A Google Cloud account (for Sheets API)
- A Razorpay account (optional, for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd firebaseshopwave
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure Supabase**
   - Create a new Supabase project
   - Copy your project URL and anon key to `.env.local`
   - Run the database migrations (see Database Setup below)

5. **Configure Google Sheets**
   - Create a Google Cloud project
   - Enable Google Sheets API
   - Create a service account and download the JSON key
   - Create a Google Sheet for products
   - Share the sheet with your service account email

6. **Run the development server**
   ```bash
   npm run dev
   ```

## Database Setup

Create the following tables in your Supabase database:

### User Profiles Table
```sql
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  referral_code TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Orders Table
```sql
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  items JSONB NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  original_total DECIMAL(10,2),
  discount_amount DECIMAL(10,2) DEFAULT 0,
  referral_code TEXT,
  address JSONB NOT NULL,
  payment TEXT NOT NULL,
  status TEXT DEFAULT 'Pending',
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL
);
```

### Referral Codes Table
```sql
CREATE TABLE referral_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  discount_percentage INTEGER DEFAULT 10,
  max_uses INTEGER DEFAULT 100,
  current_uses INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Referral Rewards Table
```sql
CREATE TABLE referral_rewards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID REFERENCES auth.users(id),
  referee_id UUID REFERENCES auth.users(id),
  order_id UUID REFERENCES orders(id),
  reward_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Google Sheets Setup

Create a Google Sheet with the following columns (in order):

| Column | Description |
|--------|-------------|
| A | Product ID |
| B | Product Name |
| C | Slug |
| D | Price |
| E | Original Price |
| F | Category |
| G | Subcategory |
| H | Brand |
| I | Description |
| J | Features (comma-separated) |
| K | Specifications (JSON) |
| L | Images (comma-separated URLs) |
| M | In Stock (true/false) |
| N | Stock Quantity |
| O | Rating |
| P | Review Count |
| Q | Tags (comma-separated) |
| R | Is Active (true/false) |
| S | Created At |
| T | Updated At |

## Configuration

### Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
- `GOOGLE_SHEETS_ID`: Your Google Sheets spreadsheet ID
- `GOOGLE_API_KEY`: Your Google API key
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`: Service account email
- `GOOGLE_PRIVATE_KEY`: Service account private key
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`: Razorpay key ID (optional)
- `RAZORPAY_KEY_SECRET`: Razorpay secret (optional)

### Admin Access

Create an admin user in Supabase Auth dashboard and use those credentials to access `/admin/login`.

## Features Overview

### Referral System
- Users can generate unique referral codes
- Automatic discount application during checkout
- Real-time tracking of referral usage and earnings
- Admin dashboard for referral management

### Product Management
- Google Sheets as CMS for easy product management
- Real-time sync with the application
- Support for multiple product categories
- Image management and SEO optimization

### Order Management
- Complete order lifecycle management
- WhatsApp integration for order notifications
- Admin dashboard for order processing
- Real-time order status updates

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy

### Other Platforms
The application can be deployed to any platform that supports Next.js applications.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

For questions and support, please contact [your-support-email].

## License

This project is licensed under the MIT License.

---

**Note**: This application replaces Firebase with Supabase for better developer experience and includes a complete referral system for business growth.
