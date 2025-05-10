
import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ 
  children,
  title,
  description
}) => {
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {(title || description) && (
        <div className="mb-6">
          {title && <h1 className="text-2xl font-bold text-gray-900">{title}</h1>}
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
};

export default PageContainer;
