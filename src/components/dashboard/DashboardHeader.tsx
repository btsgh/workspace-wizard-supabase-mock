
import React from 'react';

interface DashboardHeaderProps {
  title: string;
  description: string;
}

const DashboardHeader = ({ title, description }: DashboardHeaderProps) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-muted-foreground mt-2">{description}</p>
    </div>
  );
};

export default DashboardHeader;
