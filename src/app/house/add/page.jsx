// app/house/add/page.jsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { protectHouseFormAction } from "@/actions/house";
import { useHouseStore } from "@/store/useHouseStore";
import HouseForm from "@/components/house/houseForm";
import banner from '../../../../public/assets/images/home-page.png'
import Image from "next/image";

export default function AddHousePage() {
  const router = useRouter();
  const { createHouse, isLoading } = useHouseStore();

  const [formState, setFormState] = useState({
    address: "",
    price: "",
    rooms: "",
    floors: "",
    bathrooms: "",
    estatetype: "house",
    bathroomType: "any",
  });

  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const check = await protectHouseFormAction();
      if (!check.success) return toast.error(check.error);

      const formData = new FormData();
      Object.entries(formState).forEach(([key, value]) => {
        formData.append(key, value);
      });

      selectedFiles.forEach((file) => formData.append("images", file));

      const result = await createHouse(formData);
      if (result?.success) {
        toast.success("House created successfully");
        router.push("/house/list");
      }
    } catch (error) {
      toast.error(error.message || "Creation failed");
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Background image and container */}
      <div className="absolute inset-0 z-0">
        <Image src={banner} alt="Background" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/70" />
      </div>
      <HouseForm
        formState={formState}
        setFormState={setFormState}
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
        existingImages={[]}
        isEditMode={false}
        handleInputChange={(e) => {
          const { name, value } = e.target;
          setFormState(prev => ({ ...prev, [name]: value }));
        }}
        handleFormSubmit={handleFormSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}