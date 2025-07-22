# 🤖 VWO FME Next.js SSR Example

> A modern Next.js application showcasing VWO Feature Management and Experimentation (FME) SDK integration with **Server-Side Rendering (SSR)**, enabling dynamic feature flags and user interaction tracking on the server.

## ✨ Features

- 🎯 **TypeScript support** with strict typing
- 🔧 **Server-side environment variables** configuration
- 🧩 **Component-based architecture** optimized for SSR
- 🚀 **VWO FME SDK integration** on the server side
- ⚡ **Server-Side Rendering (SSR)** for better performance and SEO
- 🔄 **API routes** for VWO operations
- 📊 **Real-time logging** and settings visualization

## 🚀 Prerequisites

Before you begin, ensure you have:

- Node.js 14.x or later
- npm or yarn
- VWO account with FME access

## 💻 Setup

1. Clone the repository

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with your VWO credentials:
   ```env
   VWO_ACCOUNT_ID=your_account_id
   VWO_SDK_KEY=your_sdk_key
   VWO_FLAG_KEY=your_flag_key
   VWO_EVENT_NAME=your_event_name
   VWO_LOG_LEVEL=INFO
   VWO_VARIABLE_KEY_1=model_name
   VWO_VARIABLE_KEY_2=query_answer
   ```

   **Note**: Environment variables no longer need the `NEXT_PUBLIC_` prefix as they are used server-side only.

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
nextjs/
├── components/         # Reusable React components
│   ├── Modal.tsx      # Modal dialog component
│   ├── SearchForm.tsx # User input form (SSR-compatible)
│   └── ResponseDisplay.tsx # Response display component
├── config/            # Configuration files
│   └── vwo-config.ts  # Server-side VWO configuration
├── lib/               # Server-side utilities
│   └── vwo-server.ts  # VWO SDK server-side functions
├── pages/             # Next.js pages and API routes
│   ├── api/           # API routes for VWO operations
│   │   └── vwo/       # VWO-specific API endpoints
│   ├── _app.tsx       # Next.js app wrapper
│   └── index.tsx      # Main application page (SSR)
├── styles/            # CSS modules
├── types/             # TypeScript type definitions
├── .env.local         # Environment variables (create this)
├── next.config.js     # Next.js configuration
└── package.json       # Project dependencies
```

## 🔧 Development

- `npm run dev` - Start development server with SSR
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## ⚙️ Environment Variables

All environment variables are now server-side only (no `NEXT_PUBLIC_` prefix needed):

**Required variables:**
- `VWO_ACCOUNT_ID`: Your VWO account ID
- `VWO_SDK_KEY`: Your VWO SDK key
- `VWO_FLAG_KEY`: Your feature flag key

**Optional variables:**
- `VWO_EVENT_NAME`: Event name for tracking (default: empty)
- `VWO_LOG_LEVEL`: Logging level (default: DEBUG)
- `VWO_VARIABLE_KEY_1`: First variable key (default: model_name)
- `VWO_VARIABLE_KEY_2`: Second variable key (default: query_answer)

## 🏗️ Server-Side Rendering (SSR) Architecture

### **How SSR Works in This Project:**

1. **Server-Side Initialization**: VWO SDK is initialized once on the server using a singleton pattern
2. **getServerSideProps**: Each page request triggers server-side flag evaluation
3. **API Routes**: Dedicated endpoints handle VWO operations (`/api/vwo/*`)
4. **Pre-rendered Content**: Flag results are evaluated server-side and sent to the client
5. **Form Submission**: User interactions trigger page navigation with query parameters

### **Key SSR Benefits:**

- **Better SEO**: Content is pre-rendered on the server
- **Faster Initial Load**: No client-side SDK initialization delay
- **Consistent Results**: Flag evaluation happens once per request
- **Server-Side Security**: Environment variables stay on the server

## 📝 TypeScript

This project uses TypeScript with strict type safety:

- **Server-side types** in `lib/vwo-server.ts`
- **Component interfaces** in `types/index.ts`
- **SSR page props** with proper typing
- **API response types** for consistent data flow

## 🧩 Components

The application uses SSR-optimized components:

- **Modal**: Reusable dialog component with accessibility features
- **SearchForm**: Form handling with loading states and validation
- **ResponseDisplay**: Server-rendered content display

## 🔄 API Routes

### `/api/vwo/evaluate` (POST)
Evaluates VWO flags for a user and tracks events:
```json
{
  "userId": "user123"
}
```

### `/api/vwo/logs` (GET)
Retrieves server-side VWO SDK logs:
```json
{
  "success": true,
  "logs": [...]
}
```

## 📊 How to Use

1. **Visit the Application**: Navigate to `http://localhost:3000`

2. **Enter User ID**: 
   - Type a custom user ID or click "Assign Random ID"
   - The form validates input and shows loading states

3. **Server-Side Processing**:
   - Page navigates to `/?userId=your_user_id`
   - Server evaluates VWO flags via `getServerSideProps`
   - Content is pre-rendered based on flag results

4. **View Results**:
   - Response is displayed with appropriate model name and content
   - Feature flag status shows enabled/disabled state
   - Background color changes based on flag variables

5. **Inspect Configuration**:
   - Click "Show Flag(s) Settings" to view campaign details
   - Click "Show VWO SDK Logs" to see server-side operation logs

## 🔒 Security & Best Practices

- **Server-side variables**: All VWO credentials stay on the server
- **Input validation**: User inputs are validated on both client and server
- **Error handling**: Comprehensive error handling for SDK operations
- **Type safety**: Full TypeScript coverage for better reliability
- **Accessibility**: ARIA labels and keyboard navigation support

## 🎯 Use Cases

This SSR implementation demonstrates:

- **Server-side A/B testing** with pre-rendered results
- **SEO-friendly** feature flag implementations
- **Consistent user experiences** across sessions
- **Performance optimization** through SSR
- **Secure credential management** on the server

The SSR architecture ensures that feature flag evaluation happens on the server, providing consistent results and better performance while keeping sensitive configuration secure.
# sset
