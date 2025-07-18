"use client";

import React, { useState, useCallback, useRef } from "react";
import * as XLSX from "xlsx";
import { UploadCloud, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type ParsedData = Record<string, string | number>[];

interface FileUploaderProps {
  onDataUploaded: (data: ParsedData, headers: string[], fileName: string) => void; // Updated to include fileName
}

export default function FileUploader({ onDataUploaded }: FileUploaderProps) {
  const [isParsing, setIsParsing] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      console.log("Starting file upload process for:", file.name);
      setIsParsing(true);
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = e.target?.result;
          if (!data) throw new Error("No data read from file.");
          console.log("File data loaded successfully.");
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json<Record<string, string | number>>(worksheet);

          if (json.length === 0) {
            throw new Error("The uploaded Excel file is empty or couldn't be read.");
          }

          const headers = Object.keys(json[0]);
          console.log("Parsed headers:", headers);
          console.log("Parsed data:", json);

          const formData = new FormData();
          formData.append("file", file);
          const token = localStorage.getItem("token");
          console.log("Using token for upload:", token);
          if (!token) {
            throw new Error("No authentication token available.");
          }

          const uploadResponse = await fetch("http://localhost:5000/api/upload", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          });

          console.log("Upload response status:", uploadResponse.status);
          if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text();
            throw new Error(`Upload failed: ${uploadResponse.status} - ${errorText}`);
          }

          const uploadData = await uploadResponse.json();
          console.log("Upload success response:", uploadData);
          toast({ title: "File Uploaded", description: uploadData.message });
          onDataUploaded(json, headers, file.name); // Already passing fileName
        } catch (error) {
          console.error("Upload or parsing error details:", error);
          toast({
            variant: "destructive",
            title: "Upload Error",
            description:
              error instanceof Error ? error.message : "Could not upload or parse the Excel file.",
          });
        } finally {
          setIsParsing(false);
        }
      };
      reader.onerror = (error) => {
        console.error("File read error:", error);
        toast({
          variant: "destructive",
          title: "File Read Error",
          description: "There was an error reading the file.",
        });
        setIsParsing(false);
      };
      reader.readAsArrayBuffer(file);
    },
    [onDataUploaded, toast]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        console.log("File dropped:", acceptedFiles[0].name);
        handleFile(acceptedFiles[0]);
      }
    },
    [handleFile]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      console.log("File dropped event:", e.dataTransfer.files[0].name);
      handleFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      console.log("File selected via browse:", e.target.files[0].name);
      handleFile(e.target.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex items-center justify-center w-full">
      <Card
        className="w-full max-w-lg border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors duration-300"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <CardContent className="p-6 text-center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".xlsx, .xls"
            className="hidden"
            disabled={isParsing}
          />
          <UploadCloud className="mx-auto h-16 w-16 text-gray-400" />
          <h3 className="mt-4 text-xl font-semibold">Drop your Excel file here</h3>
          <p className="mt-1 text-sm text-gray-500">or click to browse</p>
          <Button onClick={handleClick} className="mt-6" disabled={isParsing}>
            {isParsing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Parsing...
              </>
            ) : (
              "Browse Files"
            )}
          </Button>
          <p className="text-xs text-gray-500 mt-4">Supports .xls and .xlsx files</p>
        </CardContent>
      </Card>
    </div>
  );
}