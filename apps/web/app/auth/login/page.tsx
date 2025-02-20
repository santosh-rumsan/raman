'use client';

import dynamic from 'next/dynamic';

const AuthPage = dynamic(
  () => import('@/sections/auth/main').then((mod) => mod.AuthMain),
  { ssr: false },
);

export default AuthPage;
