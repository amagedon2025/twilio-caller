# Phone Dialer - Browser-Based VoIP Application

A modern, mobile-friendly web-based phone dialer that enables users to make phone calls directly from their desktop or mobile browser using Twilio Voice API.

## Features

- **Cross-Platform Compatibility**: Works seamlessly on desktop, iPhone, and Android browsers
- **Interactive Dial Pad**: Full 12-key number pad with touch-optimized buttons
- **Real-time Call Status**: Visual indicators for connecting, ringing, in-call, and disconnected states
- **Mobile Optimized**: Responsive design that adapts to 80% screen size on mobile devices
- **WebRTC Audio**: High-quality audio with microphone and speaker support
- **Ethereum Wallet Integration**: Quick access button with redirect modal to ethereum-vaults.com
- **Modern UI**: Beautiful gradient design with smooth animations and hover effects

## Prerequisites

- Node.js 16+ and npm
- Supabase account with Edge Functions enabled
- Twilio account with:
  - Account SID
  - API Key and Secret
  - TwiML App SID

## Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd project
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create a `.env` file in the root directory with Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Twilio Configuration

### 1. Get Your Twilio Credentials

1. Go to [Twilio Console](https://console.twilio.com/)
2. Navigate to **Account SID** and **Auth Token** (save these)
3. Go to **API Keys & Credentials** section
4. Create a new API Key and save the **SID** and **Secret**

### 2. Create a TwiML App

1. In Twilio Console, go to **Phone Numbers** > **Manage**
2. Navigate to **Voice** > **TwiML Apps**
3. Create a new TwiML App
4. Set the **Request URL** to your application's callback endpoint (or a placeholder for now)
5. Save the **App SID**

### 3. Deploy Edge Function with Credentials

The Twilio token generation function requires the following environment variables to be set in Supabase Edge Functions:

- `TWILIO_ACCOUNT_SID`
- `TWILIO_API_KEY`
- `TWILIO_API_SECRET`
- `TWILIO_TWIML_APP_SID`

These are automatically configured during deployment if you've set them up in your Supabase project.

## Development

### Start the development server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for production
```bash
npm run build
```

Output will be in the `dist/` directory.

### Type checking
```bash
npm run typecheck
```

### Linting
```bash
npm run lint
```

## Deployment

### Deploy to Vercel/Netlify

1. Push your code to GitHub
2. Connect your repository to Vercel or Netlify
3. Set environment variables in the platform's dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy

### Deploy to Traditional Server

1. Build the project:
```bash
npm run build
```

2. Copy the `dist/` directory contents to your web server
3. Configure your web server to serve `index.html` for all routes (for SPA routing)

### Example Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/dist;
    index index.html;

    location / {
        try_files $uri /index.html;
    }
}
```

## How It Works

### Architecture

```
┌─────────────────────────────────────────┐
│         Browser Application             │
│  ┌───────────────────────────────────┐  │
│  │   Phone Dialer UI (React)         │  │
│  │  - Dial pad buttons               │  │
│  │  - Call controls                  │  │
│  │  - Status display                 │  │
│  └───────────────────────────────────┘  │
│             ↓                             │
│  ┌───────────────────────────────────┐  │
│  │   Twilio Voice Client             │  │
│  │  - WebRTC connections             │  │
│  │  - Audio handling                 │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
         ↓               ↓
    ┌─────────┐   ┌──────────────┐
    │ Supabase│   │ Twilio Voice │
    │  Edge   │   │     API      │
    │Functions│   │              │
    └─────────┘   └──────────────┘
```

### User Flow

1. **App Loads**: React app initializes and requests Twilio access token from Supabase Edge Function
2. **Dial Number**: User enters phone number using interactive dial pad
3. **Initiate Call**: User clicks call button, triggering WebRTC connection via Twilio
4. **Audio Setup**: Browser requests microphone/speaker permissions
5. **Call Connected**: Real-time audio communication via WebRTC
6. **End Call**: User clicks hang-up button to disconnect

## Usage

### Making a Call

1. Launch the application in your browser
2. Enter the phone number with country code (e.g., +1 555 123 4567)
3. Click the green phone button to initiate the call
4. Allow microphone and speaker permissions when prompted
5. Wait for the call to connect
6. Click the red phone button to end the call

### Using the Ethereum Wallet Button

1. Click the wallet icon button on the right side
2. A confirmation modal will appear asking if you want to proceed
3. Click "Continue" to open ethereum-vaults.com in a new tab
4. You can return to the call interface using your browser's tab switcher

### Keyboard Shortcuts (Desktop)

- Number keys (0-9): Add digits to phone number
- Backspace: Delete last digit
- Enter: Initiate call
- Escape: End call (when in call)

## Permissions Required

The application requires the following browser permissions:

- **Microphone**: Required for audio input during calls
- **Speaker/Audio Output**: Required for hearing the other person
- **Camera**: Not required (audio-only calls)

## Browser Compatibility

| Browser | Mobile | Desktop | Notes |
|---------|--------|---------|-------|
| Chrome  | ✅     | ✅      | Full support |
| Safari  | ✅     | ✅      | Full support (iOS 14.5+) |
| Firefox | ✅     | ✅      | Full support |
| Edge    | ✅     | ✅      | Full support |
| Opera   | ✅     | ✅      | Full support |

## Troubleshooting

### "Device not ready" error
- Check that your Twilio credentials are correctly configured
- Verify the Edge Function is deployed and accessible
- Check browser console for detailed error messages

### No audio during calls
- Ensure microphone permission is granted
- Check system volume settings
- Try a different browser or device
- Verify Twilio account has outgoing call permissions

### Calls not connecting
- Verify phone number format includes country code
- Check Twilio account balance (if applicable)
- Ensure TwiML App SID is correctly configured
- Check browser console for WebRTC errors

### Mobile issues
- Enable "Allow in-call audio routing" in browser settings (iOS)
- Ensure app has microphone permissions in OS settings
- Try disabling battery saver mode
- Clear browser cache and try again

## Project Structure

```
src/
├── components/
│   ├── PhoneDialer.tsx      # Main dialer UI component
│   └── RedirectModal.tsx    # Ethereum redirect confirmation modal
├── hooks/
│   └── useTwilioVoice.ts    # Twilio Voice client hook
├── App.tsx                  # Main app component
├── main.tsx                 # React entry point
└── index.css                # Global styles with dial button animations

supabase/
└── functions/
    └── twilio-token/
        └── index.ts         # Token generation Edge Function
```

## Performance Optimization

- **Code Splitting**: React automatically code-splits for faster loading
- **Lazy Loading**: Components load on-demand
- **Minification**: Production builds are optimized and minified
- **CSS Optimization**: Tailwind CSS purges unused styles
- **Service Worker**: Caching strategy for offline support (optional)

## Security Considerations

- **Credentials**: Never expose Twilio credentials in client code
- **Token Generation**: Tokens are generated server-side via Edge Functions
- **CORS**: Properly configured to prevent unauthorized access
- **Authentication**: Implement Supabase Auth for production deployments
- **Rate Limiting**: Consider implementing rate limits on token generation

## Development Tips

### Enable Vue DevTools
Add `devtools: true` to the Vite config for debugging

### Monitor WebRTC Connections
Use Chrome DevTools: **about:webrtc-internals** to debug call quality

### Test on Mobile Devices
- Use Ngrok for local tunneling: `ngrok http 5173`
- Test on real devices for accurate microphone/speaker behavior

## API Reference

### useTwilioVoice Hook

```typescript
const {
  device,           // Twilio Device instance
  callStatus,       // Current call status
  error,            // Error message if any
  makeCall,         // Function to initiate call
  hangUp            // Function to end call
} = useTwilioVoice();
```

### Edge Function: `/twilio-token`

**Request:**
```json
{
  "identity": "user_identifier"
}
```

**Response:**
```json
{
  "token": "eyJhbGc...",
  "identity": "user_identifier"
}
```

## License

MIT License - See LICENSE file for details

## Support

For issues or questions:
1. Check the Troubleshooting section
2. Review Twilio documentation: https://www.twilio.com/docs/voice
3. Check Supabase docs: https://supabase.com/docs

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## Changelog

### v1.0.0
- Initial release
- Phone dialer with Twilio integration
- Mobile-optimized responsive design
- Ethereum wallet redirect button
- Real-time call status tracking
