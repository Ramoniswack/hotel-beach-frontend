'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RoomDetailComponent from '@/components/rooms/RoomDetailComponent';

const SuperiorRoomPage: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Header isScrolled={isScrolled} />
      <RoomDetailComponent roomId="superior-room" />
      <Footer />
    </>
  );
};

export default SuperiorRoomPage;
