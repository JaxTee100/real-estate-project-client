"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useHouseStore } from "@/store/useHouseStore";
import HouseForm from "@/components/house/HouseForm";
import Image from "next/image";
import banner from '../../../../../public/assets/images/home-page.png';

export default function EditHousePageDetails({ houseId }) {
  const router = useRouter();
  const { getHouseById, updateHouse, isLoading } = useHouseStore();

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
  const [existingImages, setExistingImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [isLoadingHouse, setIsLoadingHouse] = useState(true);

  useEffect(() => {
    const loadHouse = async () => {
      if (!houseId) {
        toast.error("Invalid house ID");
        router.push('/house/list');
        return;
      }

      setIsLoadingHouse(true);
      try {
        const house = await getHouseById(houseId);
        if (!house) {
          throw new Error("House not found");
        }

        setFormState({
          address: house.address || "",
          price: house.price?.toString() || "",
          rooms: house.rooms?.toString() || "",
          floors: house.floors?.toString() || "",
          bathrooms: house.bathrooms?.toString() || "",
          estatetype: house.estatetype || "house",
          bathroomType: house.bathroomType || "any",
        });
        setExistingImages(house.images || []);
      } catch (error) {
        console.error("Failed to load house:", error);
        toast.error(error.message || "Failed to load house data");
        router.push('/house/list');
      } finally {
        setIsLoadingHouse(false);
      }
    };

    loadHouse();
  }, [houseId, getHouseById, router]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ["address", "price", "rooms"];
    const missingFields = requiredFields.filter((field) => !formState[field]);
    if (missingFields.length > 0) {
      return toast.error(`Missing required fields: ${missingFields.join(", ")}`);
    }

    try {
      const formData = new FormData();

      Object.entries(formState).forEach(([key, value]) => {
        formData.append(key, value);
      });

      existingImages.forEach((img) => {
        if (!deletedImages.includes(img.publicId || img.url)) {
          formData.append("existingImages", img.publicId || img.url);
        }
      });

      deletedImages.forEach((imgId) => {
        formData.append("deletedImages", imgId);
      });

      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      formData.append("id", houseId);

      const result = await updateHouse(houseId, formData);
      if (result?.success) {
        toast.success("House updated successfully");
        router.push("/house/list");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.message || "Update failed");
    }
  };

  if (isLoadingHouse) {
    return <div className="text-center py-10">Loading house details...</div>;
  }

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 z-0">
        <Image src={banner} alt="Background" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/70" />
      </div>
      <div className="border border-red-500 p-16 flex items-center w-full">
        <HouseForm
          formState={formState}
          setFormState={setFormState}
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
          existingImages={existingImages}
          setExistingImages={setExistingImages}
          deletedImages={deletedImages}
          setDeletedImages={setDeletedImages}
          isEditMode={true}
          handleInputChange={(e) => {
            const { name, value } = e.target;
            setFormState(prev => ({ ...prev, [name]: value }));
          }}
          handleFormSubmit={handleFormSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}