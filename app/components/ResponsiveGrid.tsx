import React from 'react';

interface IResponsiveGridProps {
  children: React.ReactNode;
}

const ResponsiveGrid = ({ children }: IResponsiveGridProps) => {
  return <div className='grid-container'>{children}</div>;
};

export default ResponsiveGrid;
