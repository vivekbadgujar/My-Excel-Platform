"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import AnalyticsDashboard from "../../components/analytics-dashboard";
import FileUploader from "../../components/file-uploader";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { 
  User, 
  LogOut, 
  BarChart3, 
  FileSpreadsheet, 
  History, 
  Settings,
  TrendingUp,
  Upload,
  Crown
} from "lucide-react";

// Define the UserData interface
interface UserData {
  userId: string;
  email?: string;
  role?: string;
}

interface UploadedData {
  data: Record<string, string | number>[];
  headers: string[];
  fileName: string; // Added file name to track
}

// Main Dashboard Component
export default function Dashboard() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [uploadedData, setUploadedData] = useState<UploadedData | null>(null);
  const [uploadHistory, setUploadHistory] = useState<UploadedData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token, redirecting to login");
          router.push("/");
          return;
        }
        const response = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data as UserData;
        if (!data.userId) {
          data.userId = localStorage.getItem("userId") || "Not available";
        }
        console.log("Fetched userData:", data);
        setUserData(data);
      } catch (err) {
        if (err instanceof Error) {
          console.log("Profile fetch error:", err.message);
          setError(`Profile fetch failed: ${err.message}`);
          router.push("/");
        }
      }
    };
    fetchProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    setUserData(null);
    router.push("/");
  };

  const handleDataUploaded = (data: Record<string, string | number>[], headers: string[], fileName: string) => {
    console.log("Data uploaded in Dashboard:", data, headers, "File Name:", fileName);
    const newUpload = { data, headers, fileName };
    setUploadedData(newUpload);
    setUploadHistory((prev) => [...prev, newUpload].slice(-5)); // Keep last 5 uploads
  };

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="max-w-md w-full">
        <CardContent className="p-6 text-center">
          <p className="text-red-500 text-lg font-semibold">{error}</p>
        </CardContent>
      </Card>
    </div>
  );

  if (!userData) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="max-w-md w-full">
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading user data...</p>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Excel Analytics Platform</h1>
                <p className="text-sm text-gray-500">Powerful data visualization and insights</p>
              </div>
            </div>
            
            {/* User Profile Section */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/api/placeholder/40/40" alt={userData.email || "User"} />
                  <AvatarFallback className="bg-blue-600 text-white">
                    {userData.email?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{userData.email || "Not available"}</p>
                  <div className="flex items-center space-x-2">
                    <Badge variant={userData.role === "admin" ? "default" : "secondary"} className="text-xs">
                      {userData.role === "admin" && <Crown className="h-3 w-3 mr-1" />}
                      {userData.role || "User"}
                    </Badge>
                  </div>
                </div>
              </div>
              <Separator orientation="vertical" className="h-8" />
              <Button onClick={handleLogout} variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <span>Quick Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Uploads</span>
                  <Badge variant="outline">{uploadHistory.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current Data</span>
                  <Badge variant={uploadedData ? "default" : "secondary"}>
                    {uploadedData ? "Ready" : "None"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Data Rows</span>
                  <Badge variant="outline">{uploadedData?.data.length || 0}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Upload History */}
            {uploadHistory.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <History className="h-5 w-5 text-green-600" />
                    <span>Upload History</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {uploadHistory.slice(-5).map((item, index) => (
                      <div key={index} className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50">
                        <FileSpreadsheet className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{item.fileName}</p>
                          <p className="text-xs text-gray-500">{item.data.length} rows</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* File Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="h-5 w-5 text-blue-600" />
                  <span>Upload Excel File</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FileUploader onDataUploaded={handleDataUploaded} />
              </CardContent>
            </Card>
          </div>

          {/* Main Analytics Section */}
          <div className="lg:col-span-3">
            <AnalyticsDashboard uploadedData={uploadedData} />
          </div>
        </div>
      </div>
    </div>
  );
}