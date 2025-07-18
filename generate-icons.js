const fs = require('fs');
const path = require('path');

// Create a simple SVG icon for the app
const iconSVG = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2563eb;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1d4ed8;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="1024" height="1024" rx="180" fill="url(#grad1)"/>
  
  <!-- Excel grid -->
  <rect x="200" y="200" width="624" height="624" rx="20" fill="white" opacity="0.95"/>
  
  <!-- Grid lines -->
  <line x1="200" y1="300" x2="824" y2="300" stroke="#e5e7eb" stroke-width="2"/>
  <line x1="200" y1="400" x2="824" y2="400" stroke="#e5e7eb" stroke-width="2"/>
  <line x1="200" y1="500" x2="824" y2="500" stroke="#e5e7eb" stroke-width="2"/>
  <line x1="200" y1="600" x2="824" y2="600" stroke="#e5e7eb" stroke-width="2"/>
  <line x1="200" y1="700" x2="824" y2="700" stroke="#e5e7eb" stroke-width="2"/>
  
  <line x1="300" y1="200" x2="300" y2="824" stroke="#e5e7eb" stroke-width="2"/>
  <line x1="400" y1="200" x2="400" y2="824" stroke="#e5e7eb" stroke-width="2"/>
  <line x1="500" y1="200" x2="500" y2="824" stroke="#e5e7eb" stroke-width="2"/>
  <line x1="600" y1="200" x2="600" y2="824" stroke="#e5e7eb" stroke-width="2"/>
  <line x1="700" y1="200" x2="700" y2="824" stroke="#e5e7eb" stroke-width="2"/>
  
  <!-- Chart icon -->
  <circle cx="350" cy="350" r="15" fill="#2563eb"/>
  <circle cx="450" cy="300" r="15" fill="#2563eb"/>
  <circle cx="550" cy="250" r="15" fill="#2563eb"/>
  <circle cx="650" cy="200" r="15" fill="#2563eb"/>
  
  <!-- Lines connecting chart points -->
  <line x1="350" y1="350" x2="450" y2="300" stroke="#2563eb" stroke-width="4"/>
  <line x1="450" y1="300" x2="550" y2="250" stroke="#2563eb" stroke-width="4"/>
  <line x1="550" y1="250" x2="650" y2="200" stroke="#2563eb" stroke-width="4"/>
  
  <!-- Title -->
  <text x="512" y="950" text-anchor="middle" fill="white" font-size="80" font-weight="bold" font-family="Arial, sans-serif">EXCEL</text>
</svg>
`;

// Create the icon file
fs.writeFileSync(path.join(__dirname, 'app-icon.svg'), iconSVG);

console.log('App icon created: app-icon.svg');
console.log('To generate proper Android icons, use: npx capacitor-assets generate --iconBackgroundColor "#2563eb" --iconBackgroundColorDark "#1d4ed8"');
