'use client'

import React from 'react'
import banner from '../../../../../public/assets/images/home-page.png'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  Check,
  Heart,
  MapPin,
  Upload,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

const HouseDetailsContent = ({ id }) => {
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
          <Image src={banner} alt='large' fill className='object-cover rounded-md' />
          <Link
            href={'/house/list'}
            className='absolute top-4 left-4 flex items-center space-x-2 bg-white/80 text-gray-800 p-2 rounded-md shadow-md text-sm hover:bg-white transition'
          >
            <ArrowLeft size={16} />
            <span>Go back</span>
          </Link>
        </motion.div>

        <div className='grid grid-cols-2 gap-2'>
          {[1, 2, 3].map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className='relative h-[120px] sm:h-[180px] md:h-[240px] w-full rounded-md overflow-hidden'
            >
              <Image src={banner} alt={`thumb-${i}`} fill className='object-cover rounded-md' />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Location & Action Buttons */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div className='flex items-center gap-2 text-gray-900'>
          <MapPin size={16} />
          <span className='text-sm font-semibold'>no 6, freetown road, apapa lagos</span>
        </div>

        <div className='flex gap-2'>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='border border-gray-300 flex items-center gap-2 rounded-md shadow-sm text-sm text-gray-900 font-semibold cursor-pointer px-4 py-2 hover:bg-gray-100'
          >
            <Heart size={16} />
            Save
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='border border-gray-300 flex items-center gap-2 rounded-md shadow-sm text-sm text-gray-900 font-semibold cursor-pointer px-4 py-2 hover:bg-gray-100'
          >
            <Upload size={16} />
            Share
          </motion.div>
        </div>
      </div>

      {/* Pricing & Agent Info */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <div className='flex flex-col gap-4'>
          <div className='flex items-end gap-2'>
            <h1 className='text-4xl sm:text-5xl font-bold text-gray-900'>$512</h1>
            <span className='text-md text-gray-600'>/month</span>
          </div>

          <div className='flex flex-col gap-3'>
            <h3 className='underline text-md font-semibold text-gray-900'>Pricing details and terms</h3>
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
              {[
                { label: 'm²', value: 74 },
                { label: 'beds', value: 3 },
                { label: 'baths', value: 2 },
                { label: 'floor', value: 16 },
              ].map(({ label, value }, i) => (
                <div key={i} className='flex flex-col'>
                  <span className='text-2xl font-semibold text-gray-900'>{value}</span>
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
                  <Image src={banner} fill alt='agent-img' className='rounded-full object-cover' />
                </div>
                <span className='text-sm'>Agent: Maddie Molina</span>
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className='w-full md:w-[300px]'
            >
              <Button className='w-full bg-blue-600 text-white hover:bg-blue-700 p-4 rounded-md shadow'>
                Send Request
              </Button>
            </motion.div>
          </div>
        </div>

        {/* About Section */}
        <div className='flex flex-col gap-4'>
          <h1 className='text-lg font-bold text-gray-900'>About Apartment</h1>
          <p className='text-gray-600 text-sm leading-relaxed text-justify'>
            Whatever you do please read through the contents of this description, it’s your house not mine.
            Whatever you do please read through the contents of this description, it’s your house not mine.
          </p>

          <div className='flex flex-col gap-3'>
            <p className='underline font-semibold text-gray-900'>Full description</p>
            <ul className='grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-gray-900'>
              {[
                'Equipped Kitchen',
                'Wi-Fi',
                'Lake-View',
                'Free Parking',
                'Swimming Pool',
                'Light',
                'Air Conditioning',
                'Gym',
              ].map((feature, i) => (
                <motion.li
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  className='flex items-center gap-2'
                >
                  <Check size={16} className='text-green-600' />
                  <span>{feature}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default HouseDetailsContent
