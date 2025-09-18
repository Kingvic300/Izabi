import React, { useState } from 'react';
import { AlertTriangle, X, Wifi, Server, AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { ErrorType } from '@/types/pdf';

interface ErrorDisplayProps {
  error: ErrorType;
  onDismiss?: () => void;
  onRetry?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onDismiss, onRetry }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getErrorIcon = () => {
    switch (error.type) {
      case 'validation':
        return <AlertTriangle className="h-5 w-5" />;
      case 'network':
        return <Wifi className="h-5 w-5" />;
      case 'backend':
        return <Server className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getErrorStyles = () => {
    switch (error.type) {
      case 'validation':
        return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200';
      case 'network':
        return 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200';
      case 'backend':
        return 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200';
      default:
        return 'border-gray-500 bg-gray-50 dark:bg-gray-900/20 text-gray-800 dark:text-gray-200';
    }
  };

  return (
    <Card className={cn('border-l-4', getErrorStyles())}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="flex-shrink-0 mt-0.5">
              {getErrorIcon()}
            </div>
            <div className="flex-1">
              <p className="font-medium">{error.message}</p>
              <p className="text-sm opacity-75 mt-1">
                {new Date(error.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            {onRetry && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRetry}
                className="h-8 w-8 p-0"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}
            {onDismiss && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDismiss}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {error.details && (
          <Collapsible open={showDetails} onOpenChange={setShowDetails}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="mt-2 h-6 text-xs">
                {showDetails ? 'Hide Details' : 'Show Details'}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <pre className="mt-2 p-2 bg-black/10 rounded text-xs overflow-auto max-h-32">
                {error.details}
              </pre>
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
    </Card>
  );
};

interface ErrorListProps {
  errors: ErrorType[];
  onDismiss?: (id: string) => void;
  onRetry?: () => void;
}

export const ErrorList: React.FC<ErrorListProps> = ({ errors, onDismiss, onRetry }) => {
  if (errors.length === 0) return null;

  return (
    <div className="space-y-2">
      {errors.map((error) => (
        <ErrorDisplay
          key={error.id}
          error={error}
          onDismiss={onDismiss ? () => onDismiss(error.id) : undefined}
          onRetry={onRetry}
        />
      ))}
    </div>
  );
};

export default ErrorDisplay;