'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Application error:', error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="max-w-md w-full border-red-500/20 bg-red-500/5">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <AlertCircle className="size-5 text-red-400" />
                        <CardTitle className="text-red-300">Something went wrong!</CardTitle>
                    </div>
                    <CardDescription className="text-red-200/80">
                        {error.message || 'An unexpected error occurred while generating your wallpaper.'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                        <p>This could be due to:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Invalid device dimensions</li>
                            <li>Network connectivity issues</li>
                            <li>Temporary server error</li>
                        </ul>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={reset}
                            className="flex-1 bg-red-500 hover:bg-red-600"
                        >
                            Try again
                        </Button>
                        <Button
                            onClick={() => window.location.href = '/'}
                            variant="outline"
                            className="flex-1"
                        >
                            Go home
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
