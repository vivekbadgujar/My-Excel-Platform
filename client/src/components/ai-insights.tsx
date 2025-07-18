"use client";

import { Lightbulb, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface AiInsightsProps {
  insights: string | null;
  isLoading: boolean;
}

export default function AiInsights({ insights, isLoading }: AiInsightsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Lightbulb className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline">AI-Powered Insights</CardTitle>
        </div>
        <CardDescription>Key trends and patterns automatically identified from your data.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[75%]" />
          </div>
        ) : (
          insights ? (
            <p className="text-sm leading-relaxed">{insights}</p>
          ) : (
            <p className="text-sm text-muted-foreground">Click 'Generate Insights' to see what the AI finds in your data.</p>
          )
        )}
      </CardContent>
    </Card>
  );
}
