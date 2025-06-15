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
    area: "",
    about: "",
    features: [],
    estatetype: "house",
    bathroomType: "any",
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const check = await protectHouseFormAction();
      if (!check.success) {
        toast.error(check.error);
        return;
      }

      const formData = new FormData();
      
      // Append all form fields
      Object.entries(formState).forEach(([key, value]) => {
        if (key === "features") {
          // Handle array separately
          formState.features.forEach((feature, index) => {
            formData.append(`features[${index}]`, feature);
          });
        } else {
          formData.append(key, value);
        }
      });

      // Append images
      selectedFiles.forEach((file) => formData.append("images", file));

      const result = await createHouse(formData);
      
      if (result) {
        toast.success("House created successfully");
        router.push("/house/list");
        router.refresh();
      } else {
        toast.error(result?.error || "Failed to create house");
      }
    } catch (error) {
      console.error("Creation error:", error);
      toast.error(error.message || "Creation failed");
    }
  };

  return (
    <div className="relative min-h-screen">
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
        deletedImages={deletedImages}
        setDeletedImages={setDeletedImages}
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