'use client'

import React, { useEffect, useState } from 'react'
import banner from '../../../../../public/assets/images/home-page.png'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Heart,
  MapPin,
  Upload,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { useHouseStore } from '@/store/useHouseStore'
import HouseDetailsSkeleton from './houseSkeleton'

const HouseDetailsContent = ({ id }) => {
  const [house, setHouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const { getHouseById } = useHouseStore();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchHouse = async () => {
      try {
        setLoading(true);
        const houseDetails = await getHouseById(id);
        
        if (!houseDetails) {
          router.push('/404');
          return;
        }
        
        setHouse(houseDetails);
      } catch (error) {
        console.error('Error fetching house details:', error);
        router.push('/404');
      } finally {
        setLoading(false);
      }
    }
    
    fetchHouse();
  }, [router, id, getHouseById]);

  if (loading) {
    return (
      <HouseDetailsSkeleton />
    );
  }

  if (!house) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">House not found</p>
      </div>
    );
  }

  // Calculate available images (handle cases where images might be missing)
  const mainImage = house.images?.[0]?.url || banner.src;
  const thumbnails = house.images?.slice(1, 5) || [];

  // House features data
  const houseFeatures = [
    { label: 'm²', value: house.area ? `${house.area} ` : 'N/A' },
    { label: 'Beds', value: house.rooms || 'N/A' },
    { label: 'Baths', value: house.bathrooms || 'N/A' },
    { label: 'Floors', value: house.floors || 'N/A' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='flex flex-col gap-6 container mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden'
    >
      {/* Image Gallery */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 h-auto'>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className='relative h-[250px] sm:h-[350px] md:h-[500px] w-full rounded-md overflow-hidden'
        >
          <Image 
            src={mainImage} 
            alt='Main house image' 
            fill 
            className='object-cover rounded-md' 
            priority
          />
          <Link
            href={'/house/list'}
            className='absolute top-4 left-4 flex items-center space-x-2 bg-white/80 text-gray-800 p-2 rounded-md shadow-md text-sm hover:bg-white transition'
          >
            <ArrowLeft size={16} />
            <span>Go back</span>
          </Link>
        </motion.div>

        <div className='grid grid-cols-2 gap-2'>
          {thumbnails.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className='relative h-[120px] sm:h-[180px] md:h-[240px] w-full rounded-md overflow-hidden'
            >
              <Image 
                src={img.url} 
                alt={`House thumbnail ${i+1}`} 
                fill 
                className='object-cover rounded-md' 
              />
            </motion.div>
          ))}
          {/* Fill remaining slots if less than 4 images */}
          {Array.from({ length: 4 - thumbnails.length }).map((_, i) => (
            <div key={`empty-${i}`} className='bg-gray-100 rounded-md h-[120px] sm:h-[180px] md:h-[240px]'></div>
          ))}
        </div>
      </div>

      {/* Location & Action Buttons */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div className='flex items-center gap-2 text-gray-900'>
          <MapPin size={16} />
          <span className='text-sm font-semibold'>{house.address}</span>
        </div>

        <div className='flex gap-2'>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='border border-gray-300 flex items-center gap-2 rounded-md shadow-sm text-sm text-gray-900 font-semibold cursor-pointer px-4 py-2 hover:bg-gray-100'
          >
            <Heart size={16} />
            Save
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='border border-gray-300 flex items-center gap-2 rounded-md shadow-sm text-sm text-gray-900 font-semibold cursor-pointer px-4 py-2 hover:bg-gray-100'
          >
            <Upload size={16} />
            Share
          </motion.button>
        </div>
      </div>

      {/* Pricing & Agent Info */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <div className='flex flex-col gap-4'>
          <div className='flex items-end gap-2'>
            <h1 className='text-4xl sm:text-5xl font-bold text-gray-900'>${house.price?.toLocaleString()}</h1>
            <span className='text-md text-gray-600'>/month</span>
          </div>

          <div className='flex flex-col gap-3'>
            <h3 className='underline text-md font-semibold text-gray-900'>Property details</h3>
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
              {houseFeatures.map(({ label, value }, i) => (
                <div key={i} className='flex items-end gap-1'>
                  <span className='text-4xl font-semibold text-gray-900'>{value}</span>
                  <span className='text-sm text-gray-600'>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className='flex flex-col md:flex-row gap-4 items-center py-4'>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className='w-full md:w-[300px]'
            >
              <Button className='w-full border border-gray-300 bg-white hover:bg-gray-100 text-gray-900 flex items-center gap-2 p-4 rounded-md shadow'>
                <div className='relative w-8 h-8'>
                  <Image src={banner} fill alt='agent' className='rounded-full object-cover' />
                </div>
                <span className='text-sm'>Agent: Maddie Molina</span>
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className='w-full md:w-[300px]'
            >
              <Button className='w-full bg-blue-600 text-white hover:bg-blue-700 p-4 rounded-md shadow'>
                Contact Agent
              </Button>
            </motion.div>
          </div>
        </div>

        {/* About Section */}
        <div className='flex flex-col gap-4'>
          <h1 className='text-lg font-bold text-gray-900'>About this property</h1>
          <p className='text-gray-600 text-sm leading-relaxed text-justify'>
            {house.about || 'No description available.'}
          </p>

          {house.features?.length > 0 && (
            <div className='flex flex-col gap-3'>
              <p className='underline font-semibold text-gray-900'>Features</p>
              <ul className='grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-gray-900'>
                {house.features.map((feature, i) => (
                  <motion.li
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    className='flex items-center gap-2'
                  >
                    <Check size={16} className='text-gray-600' />
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default HouseDetailsContent