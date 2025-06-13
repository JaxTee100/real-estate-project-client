"use client";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import banner from '../../../../../public/assets/images/home-page.png';

export function EditHouseSkeleton() {
  return (
    <div className="relative min-h-screen">
      {/* Background image (same as actual page) */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={banner} 
          alt="Background" 
          fill 
          className="object-cover" 
          priority 
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Skeleton content */}
      <div className="border border-red-500 p-16 flex items-center w-full">
        <div className="w-full max-w-4xl mx-auto space-y-8">
          {/* Form header */}
          <div className="space-y-2">
            <Skeleton className="h-8 w-1/3 bg-gray-400" />
            <Skeleton className="h-4 w-2/3 bg-gray-400" />
          </div>

          {/* Form grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Address field */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-1/4 bg-gray-400" />
              <Skeleton className="h-10 w-full bg-gray-300" />
            </div>

            {/* Price field */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-1/4 bg-gray-400" />
              <Skeleton className="h-10 w-full bg-gray-300" />
            </div>

            {/* Rooms field */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-1/4 bg-gray-400" />
              <Skeleton className="h-10 w-full bg-gray-300" />
            </div>

            {/* Floors field */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-1/4 bg-gray-400" />
              <Skeleton className="h-10 w-full bg-gray-300" />
            </div>

            {/* Bathrooms field */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-1/4 bg-gray-400" />
              <Skeleton className="h-10 w-full bg-gray-300" />
            </div>

            {/* Estate type field */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-1/4 bg-gray-400" />
              <Skeleton className="h-10 w-full bg-gray-300" />
            </div>

            {/* Bathroom type field */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-1/4 bg-gray-400" />
              <Skeleton className="h-10 w-full bg-gray-300" />
            </div>
          </div>

          {/* Image upload section */}
          <div className="space-y-4">
            <Skeleton className="h-5 w-1/3 bg-gray-400" />
            <div className="flex flex-wrap gap-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton 
                  key={i} 
                  className="h-32 w-32 rounded-md bg-gray-300" 
                />
              ))}
            </div>
          </div>

          {/* Submit button */}
          <div className="pt-6">
            <Skeleton className="h-10 w-32 bg-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
}