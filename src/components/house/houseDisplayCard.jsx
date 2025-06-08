'use client';

import { Card } from '../ui/card';
import { Pen, Trash } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import React from 'react';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const HouseDisplayCard = ({price, rooms, bathrooms, address, floors, url, id, handleDeleteHouse}) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeIn}
      className="w-full max-w-sm md:max-w-md lg:max-w-lg"
    >
      <Card className="flex flex-col gap-3 border-none shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden bg-white">
        {/* Image */}
        <div className="relative h-48 w-full">
         
        <Image
          src={url}
          alt="House Image"
          fill
          className="rounded w-full h-auto object-cover"
          priority
        />
     
        </div>

        {/* Price and Icons */}
        <div className="flex justify-between items-center px-4">
          <div className="flex items-end gap-1">
            <h1 className="font-bold text-xl text-slate-800">${price}</h1>
            <span className="text-slate-500 text-sm">/month</span>
          </div>
          <div className="flex gap-3 items-center">
            <Pen size={18} className="text-blue-500 hover:text-blue-400 cursor-pointer transition-colors" />
            <Trash size={18} className="text-red-500 hover:text-red-400 cursor-pointer transition-colors" onClick={() => handleDeleteHouse(id)}/>
          </div>
        </div>

        {/* Address */}
        <div className="px-4">
          <p className="font-medium text-md text-slate-700">
            {address}
          </p>
        </div>

        {/* Details */}
        <div className="flex items-center gap-2 text-gray-500 text-sm px-4 pb-4">
          <span>{rooms} rooms</span>
          <span>·</span>
          <span>{bathrooms} bathrooms</span>
          <span>·</span>
          <span>{floors} floors</span>
        </div>
      </Card>
    </motion.div>
  );
};

export default HouseDisplayCard;
