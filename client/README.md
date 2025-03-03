# TikTok AI SaaS Project Requirements

## Overview
A TikTok AI-powered SaaS platform that helps users optimize their TikTok shop and content strategy. The platform includes AI-driven insights, user authentication, subscription-based access, and automated features to boost engagement and sales.

## Features

### 1. **User Authentication**
- Email/password signup & login
- OAuth support (Google, TikTok login)
- Email verification
- Password reset functionality

### 2. **Subscription & Payments (Stripe Integration)**
- Subscription-based model
- Free trial option
- Multiple pricing tiers
- Payment tracking and invoices
- Subscription management (cancel, upgrade, downgrade)
- Webhooks for payment status updates
- Trainer earnings and withdrawal system (10% platform fee retained)

### 3. **AI-Powered TikTok Insights**
- Analyze TikTok shop performance
- Identify trending products and content
- AI-generated video scripts for product promotion
- Engagement optimization suggestions
- Hashtag and keyword recommendations
- Competitor analysis

### 4. **Content Automation Tools**
- AI-generated captions & hooks
- Automated post scheduling
- FYP trend detection and alerts
- TikTok comment and DM automation

### 5. **Personalized Dashboards**
- User dashboard with analytics
- Subscription status overview
- Saved AI recommendations
- Video content performance tracking

### 6. **Admin Panel**
- User management
- Subscription monitoring
- Payment & revenue tracking
- AI system performance & data analysis

## Tech Stack
- **Frontend**: React, Next.js, Tailwind CSS, ShadCN/UI components
- **Backend**: Node.js, Express, MongoDB
- **AI Services**: OpenAI API for content generation
- **Payments**: Stripe for subscription management
- **Hosting**: Vercel for frontend, AWS/DigitalOcean for backend

## ShadCN Components Usage
- **Authentication Forms**: Styled login, registration, and password reset forms.
- **Modals & Dialogs**: Used for subscription upgrades, AI-generated script previews, and important alerts.
- **Cards & Dashboard Elements**: Displaying user analytics, TikTok insights, and payment history.
- **Data Tables**: For listing subscriptions, payments, and user-generated content.
- **Buttons & Alerts**: Standardized UI components for consistent UX.
- **Skeleton Loaders**: Smooth loading experience for AI insights and analytics.

## Database Schema
- `users` (email, password, role, subscription status, TikTok API integration, etc.)
- `subscriptions` (user ID, plan type, payment status, start/end date)
- `ai_insights` (user queries, AI recommendations, timestamps)
- `content_data` (saved scripts, scheduled posts, engagement metrics)

## API Endpoints
- **Authentication**:
  - `POST /auth/register`
  - `POST /auth/login`
  - `POST /auth/forgot-password`
- **Subscriptions & Payments**:
  - `POST /subscribe`
  - `GET /subscription-status`
  - `POST /withdraw`
- **AI Insights**:
  - `POST /ai/generate-script`
  - `GET /ai/trend-analysis`
- **Content Automation**:
  - `POST /content/schedule`
  - `GET /content/analytics`

