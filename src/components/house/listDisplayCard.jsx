'use client'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '../ui/button'
import Image from 'next/image'
import { useHouseStore } from '@/store/useHouseStore'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { toast } from "sonner";

const ListCard = ({id, index, address, price, rooms, bathrooms, floors, url, handleDeleteHouse}) => {
 
const router = useRouter();
  console.log('HouseDisplayCard ID:', id);
  const handleEdit = () => {
    if (!id) {
      toast.error('Missing house ID');
      return;
    }
    router.push(`/house/edit/${id}`);
  };
  return (
    <motion.tr
      
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
    >
      {/* House Image + Address */}
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="relative w-16 h-14 rounded overflow-hidden bg-gray-100 border border-gray-300">
            <Image
              src={url}
              alt="House Image"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">
              {address}
            </p>
          </div>
        </div>
      </td>

      {/* Price */}
      <td className="p-4 text-sm text-gray-700">${price}</td>

      {/* Rooms */}
      <td className="p-4 text-sm text-gray-700">{rooms}</td>

      {/* Floors */}
      <td className="p-4 text-sm text-gray-700">{floors}</td>

      {/* Bathrooms */}
      <td className="p-4 text-sm text-gray-700">{bathrooms}</td>

      {/* Actions */}
      <td className="p-4 text-right">
        <div className="flex justify-end gap-2">
          <Button
            onClick={handleEdit}
            variant="ghost"
            size="icon"
          >
            <Pencil className="h-4 w-4 text-blue-600" />
          </Button>
          <Button
            onClick={handleDeleteHouse}
            variant="ghost"
            size="icon"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      </td>
    </motion.tr>
  )
}

export default ListCard
