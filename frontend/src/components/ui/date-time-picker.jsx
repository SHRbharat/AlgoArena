import React from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

export const DateTimePicker = React.forwardRef(({ className, label, ...props }, ref) => {
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={props.id} className="text-sm font-medium">
        {label}
      </Label>
      <input
        type="datetime-local"
        className={cn(
          "flex h-10 w-fit rounded-md border border-input bg-background px-3 py-2",
          "text-sm ring-offset-background file:border-0 file:bg-transparent",
          "file:text-sm file:font-medium placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          "focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          "dark:bg-gray-1000 dark:text-white dark:border-gray-1000",
          "dark:[color-scheme:dark]",
          className
        )}
        ref={ref}
        {...props}
        value={props.value ? formatDate(new Date(props.value)) : ''}
      />
    </div>
  );
});

DateTimePicker.displayName = 'DateTimePicker';
