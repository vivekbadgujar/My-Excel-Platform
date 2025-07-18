# Excel Analytics Platform

A powerful platform for uploading any Excel file (.xls or .xlsx), analyzing the data, and generating interactive 2D and 3D charts. Users can select X and Y axes from the column headers of the Excel file, choose from various chart types, and access each user's history of uploads and analysis saved and visible on their dashboard.

## 📋 Project Overview

This two MERN (MongoDB, Express.js, React.js, Node.js) stack-based full-stack projects are designed for students to complete over a 10-week period. Each project is divided into 5-week modules with structured goals, guidance, and references for development. The purpose is to give them hands-on experience in complete application development using the MERN stack.

## 🎯 Description

A powerful platform for uploading any Excel file (.xls or .xlsx), analyzing the data, and generating interactive 2D and 3D charts. Users can select X and Y axes from the column headers of the Excel file, choose from various chart types, and access each user's history of uploads and analysis saved and visible on their dashboard. Admin can manage users and data usage. The platform will optionally integrate AI APIs to provide smart insights or summary reports from the uploaded data.

## ✨ Key Features

### 📊 Excel File Data Processing
- **File Upload**: Support for .xls and .xlsx files
- **Data Parsing**: Automatically parse and structure data from Excel files
- **Column Recognition**: Dynamic identification of data types and headers

### 📈 Data Mapping & Visualization
- **Dynamic Axis Selection**: Allow users to choose X and Y axes dynamically from Excel column headers
- **Multiple Chart Types**: Support for bar, line, pie, scatter, and 3D column charts
- **Interactive Charts**: User-friendly chart interactions with Chart.js and Three.js

### 🔐 User & Admin Authentication
- **JWT-based Authentication**: Secure login system
- **Role-based Access**: Differentiate between users and admins
- **User Management**: Admin panel for user oversight

### 📱 Dashboard & History
- **Upload History**: Track and display user's previous uploads and analysis
- **Data Management**: Save analysis history and enable feature integration
- **Responsive Design**: Modern, mobile-friendly interface

### 💾 Downloadable Charts
- **Export Options**: Download charts as PNG/PDF formats
- **High Quality**: Maintain chart quality during export

### 🤖 AI Tools & Integration (Optional)
- **Smart Insights**: AI-powered analysis summaries
- **Data Intelligence**: Generate insights from uploaded data
- **Report Generation**: Automated summary reports

### 🎨 Simple and Modern Responsive UI
- **Professional Design**: Clean, intuitive interface
- **Tailwind CSS**: Modern styling framework
- **Mobile Responsive**: Optimized for all devices

## 🛠️ Tech Stack & Tools

### Frontend
- **React.js**: Component-based UI library
- **Redux Toolkit**: State management
- **Chart.js**: 2D chart rendering
- **Three.js**: 3D visualizations
- **Tailwind CSS**: Utility-first CSS framework

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Multer**: File upload handling
- **JWT**: Authentication tokens

### Optional Tools
- **OpenAI API**: AI insights and summaries
- **Postman**: API testing
- **Git/GitHub**: Version control
- **Cloudinary**: File storage (if needed)

## 📅 Development Timeline

### Week 1: Project Setup & Authentication
- Project setup, user/admin authentication, dashboard layout
- User authentication (JWT-based)
- Basic dashboard structure

### Week 2: File Upload & Data Processing
- File upload setup, Excel parsing logic, data storage in MongoDB
- Excel file parsing with SheetJS
- Data validation and storage

### Week 3: Chart Rendering & Visualization
- Chart rendering with dynamic axes
- Multiple chart type support
- Interactive chart features

### Week 4: AI Integration & Advanced Features
- AI integration for analysis and summaries
- Advanced chart options
- Data export functionality

### Week 5: Admin Panel & Deployment
- Admin panel, testing, and bug fixes
- Testing and optimization
- Deployment (Render for backend, Netlify for frontend)

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vivekbadgujar/My-Excel-Platform.git
   cd My-Excel-Platform
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**
   Create `.env` files in both server and client directories with necessary configurations.

5. **Start the development servers**
   ```bash
   # Terminal 1 - Start backend server
   cd server
   npm run dev
   
   # Terminal 2 - Start frontend client
   cd client
   npm run dev
   ```

## 🔧 Environment Variables

### Server (.env)
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### Client (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
```

## 📚 References

- **Sheet.js**: [https://sheetjs.com/](https://sheetjs.com/)
- **Chart.js**: [https://www.chartjs.org/](https://www.chartjs.org/)
- **Three.js**: [https://threejs.org/](https://threejs.org/)
- **YouTube Resources**: JavaScript Mastery, CodeEvolution, Fireship
- **Sample Inspiration**: [https://github.com/username/sample-excel-app](https://github.com/username/sample-excel-app)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Vivek Badgujar**
- GitHub: [@vivekbadgujar](https://github.com/vivekbadgujar)
- LinkedIn: [Vivek Badgujar](https://linkedin.com/in/vivekbadgujar)

## 🙏 Acknowledgments

- Thanks to the open-source community for the amazing tools and libraries
- Special thanks to the MERN stack ecosystem
- Inspired by modern data visualization platforms

---

⭐ If you found this project helpful, please give it a star on GitHub!