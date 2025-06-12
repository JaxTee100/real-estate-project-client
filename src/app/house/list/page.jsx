'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from "next/navigation";
import HouseDisplayCard from '@/components/house/houseDisplayCard';
import { useHouseStore } from '@/store/useHouseStore';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { motion } from 'framer-motion';
import { toast } from 'sonner'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { AlignJustify, ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';
import ListCard from '@/components/house/listDisplayCard';
import { Input } from '@/components/ui/input';

const ShowAllHouses = () => {
  const router = useRouter();

  // Filter states - initialized to null for initial load
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [priceRange, setPriceRange] = useState(null);
  const [realEstateTypes, setRealEstateTypes] = useState({
    houses: false,
    condos: false,
    apartments: false,
    commercial: false,
  });
  const [selectedRooms, setSelectedRooms] = useState(null);
  const [bathroomType, setBathroomType] = useState(null);
  const [listDisplay, setListDisplay] = useState(false);
  const [layoutDisplay, setLayoutDisplay] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const showLayoutDisplay = () => {
    setListDisplay(false);
    setLayoutDisplay(true);
  }

  const showListDisplay = () => {
    setListDisplay(true);
    setLayoutDisplay(false);
  }

  const {
    houses,
    fetchClientHouses,
    currentPage,
    totalPages,
    setCurrentPage,
    deleteHouse
  } = useHouseStore();

  const fetchHouses = () => {
    // On initial load, fetch all houses without filters
    if (isInitialLoad) {
      fetchClientHouses({
        page: currentPage,
        limit: 5,
        rooms: null,
        bathroomType: null,
        minPrice: null,
        maxPrice: null,
        sortBy: null,
        sortOrder: null,
        estateTypes: null
      });
      setIsInitialLoad(false);
    } 
    // After initial load, apply filters as they change
    else {
      fetchClientHouses({
        page: currentPage,
        limit: 5,
        rooms: selectedRooms,
        bathroomType,
        minPrice: priceRange?.[0] || null,
        maxPrice: priceRange?.[1] || null,
        sortBy,
        sortOrder,
        estateTypes: Object.keys(realEstateTypes).filter(type => realEstateTypes[type])
      });
    }
  };

  useEffect(() => {
    fetchHouses();
  }, [
    currentPage,
    isInitialLoad,
    priceRange,
    sortBy,
    sortOrder,
    selectedRooms,
    realEstateTypes,
    bathroomType
  ]);

  const handleSortChange = (value) => {
    const [newSortBy, newSortOrder] = value.split("-");
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setIsInitialLoad(false);
  };

  const toggleRealEstateType = (type) => {
    setRealEstateTypes((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
    setIsInitialLoad(false);
  };

  const handlePriceChange = (newRange) => {
    setPriceRange(newRange);
    setIsInitialLoad(false);
  };

  const handleRoomsChange = (rooms) => {
    setSelectedRooms(rooms);
    setIsInitialLoad(false);
  };

  const handleBathroomChange = (type) => {
    setBathroomType(type);
    setIsInitialLoad(false);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  async function handleDeleteHouse(id) {
    if (window.confirm("Are you sure you want to delete this house?")) {
      try {
        await deleteHouse(id);
        toast.success("House deleted successfully");
        fetchHouses(); // Refresh the list
      } catch (error) {
        toast.error("Failed to delete house");
      }
    }
  }

  const FilterSection = () => (
    <div className='w-full p-4 space-y-8 bg-white rounded-lg shadow-md'>
      {/* Price Filter */}
      <div>
        <label className="block font-semibold mb-2">Price</label>
        <Slider
          value={priceRange || [0, 1000]}
          onValueChange={handlePriceChange}
          min={0}
          max={1000}
          step={10}
        />
        <div className="flex justify-between mt-2">
          <Input
            type="number"
            value={priceRange?.[0] || 0}
            onChange={(e) => handlePriceChange([+e.target.value, priceRange?.[1] || 1000])}
            className="border rounded px-2 py-1 w-1/2 mr-2"
          />
          <Input
            type="number"
            value={priceRange?.[1] || 1000}
            onChange={(e) => handlePriceChange([priceRange?.[0] || 0, +e.target.value])}
            className="border rounded px-2 py-1 w-1/2"
          />
        </div>
      </div>

      {/* Real Estate Type */}
      <div>
        <label className="block font-semibold mb-2">Real estate type</label>
        <div className="space-y-2">
          {Object.keys(realEstateTypes).map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                checked={realEstateTypes[type]}
                onCheckedChange={() => toggleRealEstateType(type)}
              />
              <label className="capitalize">{type}</label>
            </div>
          ))}
        </div>
      </div>

      {/* Bedrooms */}
      <div>
        <label className="block font-semibold mb-2">Bedrooms</label>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, "4 and more"].map((num) => (
            <Button
              key={num}
              variant={selectedRooms === num ? "default" : "outline"}
              onClick={() => handleRoomsChange(num)}
            >
              {num}
            </Button>
          ))}
        </div>
      </div>

      {/* Bathroom Type */}
      <div>
        <label className="block font-semibold mb-2">Bathroom</label>
        <div className="flex flex-wrap gap-2">
          {["any", "combined", "separate"].map((type) => (
            <Button
              key={type}
              variant={bathroomType === type ? "default" : "outline"}
              onClick={() => handleBathroomChange(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <main>
      <div className='flex flex-col md:flex-row gap-6 px-4 md:px-6'>
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className='w-full md:w-1/4'
        >
          <FilterSection />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className='w-full md:w-3/4 space-y-6'
        >
          {/* Header */}
          <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
            <h1 className='text-lg tracking-wider font-semibold'>Check out our collections</h1>
            <Button onClick={() => router.push('/house/add')} className='w-full sm:w-auto'>
              Add new house
            </Button>
          </div>

          {/* Sort + View Toggle */}
          <div className='flex flex-wrap justify-between items-center gap-4'>
            <div className='flex gap-2'>
              <LayoutGrid size={20} onClick={showLayoutDisplay} className={`cursor-pointer transition-all ${layoutDisplay ? "text-slate-900" : "text-gray-500"}`} />
              <AlignJustify size={20} onClick={showListDisplay} className={`cursor-pointer transition-all ${listDisplay ? "text-slate-900" : "text-gray-500"}`} />
            </div>

            <div className='flex gap-2 items-center w-full sm:w-auto'>
              <label className='text-gray-500'>Sort By</label>
              <Select 
                onValueChange={handleSortChange} 
                value={sortBy && sortOrder ? `${sortBy}-${sortOrder}` : undefined}
              >
                <SelectTrigger className='w-full sm:w-[150px]'>
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="createdAt-desc">Newest</SelectItem>
                  <SelectItem value="createdAt-asc">Oldest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Grid/List Display */}
          {layoutDisplay && (
            <motion.div
              layout
              className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
            >
              {houses.length > 0 ? (
                houses.map(house => (
                  <motion.div
                    key={house.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <HouseDisplayCard
                      id={house.id}
                      url={house.images[0].url}
                      address={house.address}
                      price={house.price}
                      rooms={house.rooms}
                      floors={house.floors}
                      bathrooms={house.bathrooms}
                      handleDeleteHouse={() => handleDeleteHouse(house.id)}
                    />
                  </motion.div>
                ))
              ) : (
                <p>No houses found.</p>
              )}
            </motion.div>
          )}

          {listDisplay && (
            <div className="w-full overflow-x-auto">
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                    <th className="p-4">House</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Rooms</th>
                    <th className="p-4">Floors</th>
                    <th className="p-4">Bathrooms</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {houses.map((house, index) => (
                    <ListCard
                      key={index}
                      id={house.id}
                      url={house.images[0].url}
                      address={house.address}
                      price={house.price}
                      rooms={house.rooms}
                      floors={house.floors}
                      bathrooms={house.bathrooms}
                      handleDeleteHouse={() => handleDeleteHouse(house.id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <motion.div
            className='mt-10 flex flex-wrap justify-center gap-2'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              disabled={currentPage === 1}
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                className='w-10'
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              disabled={currentPage === totalPages}
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
};

export default ShowAllHouses;