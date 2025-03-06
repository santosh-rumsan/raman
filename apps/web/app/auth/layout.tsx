'use client';

import GuestGuard from '@/guards/guest-guard';
import { ReactNode, Suspense, useEffect, useState } from 'react';

const images: string[] = [
  'https://i.pinimg.com/736x/8a/d3/62/8ad36243abc77ebf4d5b34d62510fa52.jpg',
  'https://m.media-amazon.com/images/I/81dxjiYexOL.jpg',
  'https://cdn.pixabay.com/photo/2016/06/02/02/33/triangles-1430105_1280.png',
  'https://assets.rumsan.net/rumsan-group/rahat-test1244444.jpeg',
  'https://assets.rumsan.net/esatya/rahat-beema-banner.jpg',
  'https://assets.rumsan.net/rumsan-group/hlb.jpg',
];

export default function AuthLayout({ children }: { children: ReactNode }) {
  const [bgImage, setBgImage] = useState<string | null>(null);

  useEffect(() => {
    // Run only on the client
    setBgImage(images[Math.floor(Math.random() * images.length)] as string);
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GuestGuard>
        <div className="h-screen flex">
          <div
            className="w-1/2 bg-cover bg-center"
            style={{ backgroundImage: `url(${bgImage})` }}
          ></div>
          <div className="w-1/2">{children}</div>
        </div>
      </GuestGuard>
    </Suspense>
  );
}
