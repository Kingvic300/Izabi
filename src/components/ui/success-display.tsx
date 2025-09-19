import React, { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface SuccessDisplayProps {
  message: string;
  persistent?: boolean;
  onDismiss?: () => void;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline';
  }>;
  className?: string;
}

export const SuccessDisplay: React.FC<SuccessDisplayProps> = ({
  message,
  persistent = false,
  onDismiss,
  actions,
  className
}) => {
  useEffect(() => {
    if (!persistent && onDismiss) {
      const timer = setTimeout(onDismiss, 3000);
      return () => clearTimeout(timer);
    }
  }, [persistent, onDismiss]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Card className={cn(
          'border-green-500 bg-green-50 dark:bg-green-900/20 border-l-4',
          className
        )}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-green-800 dark:text-green-200">
                    {message}
                  </p>
                  {actions && actions.length > 0 && (
                    <div className="flex space-x-2 mt-3">
                      {actions.map((action, index) => (
                        <Button
                          key={index}
                          variant={action.variant || 'default'}
                          size="sm"
                          onClick={action.onClick}
                          className="h-8"
                        >
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {onDismiss && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDismiss}
                  className="h-8 w-8 p-0 text-green-600 dark:text-green-400"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export const useSuccess = () => {
  const [success, setSuccess] = React.useState<string | null>(null);

  const showSuccess = (message: string) => {
    setSuccess(message);
  };

  const clearSuccess = () => {
    setSuccess(null);
  };

  return {
    success,
    showSuccess,
    clearSuccess,
  };
};