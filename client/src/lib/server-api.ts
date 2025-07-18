// Since we're using static export, we need to directly call the external server
// This is a backup configuration for when the Vercel routing doesn't work

const SERVER_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-server-url.com' // Replace with your actual server URL
  : 'http://localhost:5000';

export const serverApi = `${SERVER_URL}/api`;
