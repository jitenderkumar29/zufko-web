'use client';
import React, { Suspense, FC } from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';

const NotFound: FC = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    color: 'white',
    background: '#530605',
    fontSize: '2rem',
    fontWeight: 'bold',
    flexDirection: 'column',
    gap: '1rem',
  }}>
    <div>404</div>
    <div style={{ fontSize: '1rem', opacity: 0.7 }}>Page Not Found</div>
  </div>
);

const HomePage = dynamic(() => import('./components/HomePage/HomePage'));

const routeMap: Record<string, React.ComponentType> = {
  '/': HomePage,
};

const AppRoutes: FC = () => {
  const pathname = usePathname();
  const View = routeMap[pathname || '/'];

  if (!View) return <NotFound />;

  return (
    <Suspense fallback={null}>
      <View />
    </Suspense>
  );
};

export default AppRoutes;