'use client';

// import dynamic from 'next/dynamic';

// const AuthPage = dynamic(
//   () => import('@/sections/auth/main').then((mod) => mod.AuthMain),
//   { ssr: false },
// );

// export default AuthPage;

import { Suspense } from 'react';
import LoginPage from './login';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPage />
    </Suspense>
  );
}
