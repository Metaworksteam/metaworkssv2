import React, { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  heading: string;
  description?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export default function PageHeader({
  heading,
  description,
  icon,
  actions,
  className
}: PageHeaderProps) {
  return (
    <Card className={cn("border-0 shadow-none bg-transparent", className)}>
      <CardHeader className="py-4 px-0">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                {icon}
              </div>
            )}
            <div>
              <CardTitle className="text-2xl font-bold">{heading}</CardTitle>
              {description && (
                <CardDescription className="mt-1 text-base">{description}</CardDescription>
              )}
            </div>
          </div>
          {actions && (
            <div className="flex items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      </CardHeader>
    </Card>
  );
}