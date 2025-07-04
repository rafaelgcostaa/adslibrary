# Ad Analysis Platform

A comprehensive platform for analyzing Facebook ads and generating creative content.

## Setup Instructions

### 1. Supabase Configuration

1. Click "Connect to Supabase" in the top right corner of the application
2. This will set up your Supabase project and configure the environment variables

### 2. Create Demo Users (Required for Demo Login)

After connecting to Supabase, you need to manually create the demo users:

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Users**
3. Click **Add user** and create these accounts:

   **Admin Demo Account:**
   - Email: `admin@demo.com`
   - Password: `demo123`
   - Confirm password: `demo123`

   **User Demo Account:**
   - Email: `user@demo.com`
   - Password: `demo123`
   - Confirm password: `demo123`

4. Make sure to **disable email confirmation** in Authentication settings if you want immediate access

### 3. Database Migration

The database schema will be automatically created when you connect to Supabase. The migration includes:

- `profiles` table for user data
- Credit management system
- Row Level Security (RLS) policies
- Automatic profile creation for new users

### 4. Additional API Keys (Optional)

For full functionality, configure these environment variables in your `.env` file:

```env
# Facebook Ads Library API
VITE_FACEBOOK_APP_ID=your_facebook_app_id
VITE_FACEBOOK_ACCESS_TOKEN=your_facebook_access_token

# PIAPI.AI (Image Generation)
VITE_PIAPI_API_KEY=your_piapi_api_key

# OpenAI (Text Generation)
VITE_OPENAI_API_KEY=your_openai_api_key

# Stripe (Payments)
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## Features

- **User Authentication**: Secure login/signup with Supabase Auth
- **Ad Search**: Search and analyze Facebook ads
- **Creative Generator**: AI-powered ad creative generation
- **Credit System**: Manage user credits for API usage
- **Responsive Design**: Works on desktop and mobile
- **Dark Mode**: Toggle between light and dark themes

## Demo Accounts

Once you've created the demo users in Supabase, you can use:

- **Admin**: admin@demo.com / demo123
- **User**: user@demo.com / demo123

## Troubleshooting

### "Invalid login credentials" Error

This error occurs when:
1. Supabase is not properly configured
2. Demo users haven't been created in the Supabase Dashboard
3. The email/password combination doesn't exist

**Solution**: Follow the setup instructions above to create the demo users manually in your Supabase Dashboard.

### Connection Issues

If you see connection errors:
1. Verify your Supabase URL and keys are correct
2. Check that your Supabase project is active
3. Ensure your internet connection is stable

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```