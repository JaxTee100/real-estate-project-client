"use client";
import banner from "../../../../public/assets/images/home-page.png";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { motion } from "framer-motion";

import { protectHouseFormAction } from "@/actions/house";
import { useHouseStore } from "@/store/useHouseStore";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

function HouseForm({
  formState,
  setFormState,
  selectedFiles,
  setSelectedFiles,
  isEditMode,
  handleInputChange,
  handleFormSubmit,
  isLoading,
}) {
  return (
    <motion.form
      onSubmit={handleFormSubmit}
      className="grid grid-cols-1 gap-6 sm:grid-cols-2"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {!isEditMode && (
        <motion.div
          className="flex flex-col items-center gap-4 border-2 border-dashed border-gray-600 rounded-xl p-10 text-center bg-black/40 backdrop-blur-sm shadow-md hover:shadow-gray-700 transform transition-transform hover:-translate-y-1 hover:scale-105 duration-300 col-span-full"
          variants={fadeInUp}
          custom={1}
        >
          <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
          <Label className="cursor-pointer text-gray-300 hover:text-white hover:underline">
            <span>Click to upload images</span>
            <input
              type="file"
              multiple
              className="sr-only"
              accept="image/*"
              onChange={(e) =>
                e.target.files && setSelectedFiles(Array.from(e.target.files))
              }
            />
          </Label>

          {selectedFiles.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-3 justify-center">
              {selectedFiles.map((file, i) => (
                <Image
                  key={i}
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${i + 1}`}
                  width={80}
                  height={80}
                  className="rounded-lg object-cover shadow-md ring-2 ring-gray-500"
                />
              ))}
            </div>
          )}
        </motion.div>
      )}

      {["address", "rooms", "floors", "bathrooms"].map((field, i) => (
        <motion.div
          key={field}
          variants={fadeInUp}
          custom={i + 2}
          className="bg-black/40 backdrop-blur-sm p-4 rounded-xl shadow-inner border border-gray-700"
        >
          <Label className="text-gray-300">
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </Label>
          <Input
            name={field}
            value={formState[field]}
            onChange={handleInputChange}
            placeholder={`Enter ${field}`}
            type={field === "address" ? "text" : "number"}
            className="mt-1 bg-black border-gray-600 text-white focus:ring-gray-400"
          />
        </motion.div>
      ))}

      {/* Estate Type Select */}
      <motion.div
        variants={fadeInUp}
        custom={8}
        className="bg-black/40 backdrop-blur-sm p-4 rounded-xl shadow-inner border border-gray-700"
      >
        <Label className="text-gray-300">Estate Type</Label>
        <Select
          value={formState.estatetype}
          onValueChange={(value) =>
            setFormState((prev) => ({ ...prev, estatetype: value }))
          }
        >
          <SelectTrigger className="mt-1 bg-black border-gray-600 text-white">
            <SelectValue placeholder="Select estate type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="house">House</SelectItem>
            <SelectItem value="condo">Condo</SelectItem>
            <SelectItem value="apartment">Apartment</SelectItem>
            <SelectItem value="commercial">Commercial</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Bathroom Type Select */}
      <motion.div
        variants={fadeInUp}
        custom={9}
        className="bg-black/40 backdrop-blur-sm p-4 rounded-xl shadow-inner border border-gray-700"
      >
        <Label className="text-gray-300">Bathroom Type</Label>
        <Select
          value={formState.bathroomType}
          onValueChange={(value) =>
            setFormState((prev) => ({ ...prev, bathroomType: value }))
          }
        >
          <SelectTrigger className="mt-1 bg-black border-gray-600 text-white">
            <SelectValue placeholder="Select bathroom type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="combined">Combined</SelectItem>
            <SelectItem value="separated">Separated</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      <motion.div
        variants={fadeInUp}
        custom={10}
        className="bg-black/40 backdrop-blur-sm p-4 rounded-xl shadow-inner border border-gray-700"
      >
        <Label className="text-gray-300">House Price ($)</Label>
        <Input
          name="price"
          value={formState.price}
          onChange={handleInputChange}
          placeholder="Enter price"
          type="number"
          className="mt-1 bg-black border-gray-600 text-white focus:ring-gray-400"
        />
      </motion.div>

      <motion.div variants={fadeInUp} custom={12} className="col-span-full">
        <Button
          type="submit"
          className="w-full bg-gray-800 hover:bg-white hover:text-black border border-white text-white rounded-xl py-2 shadow-md transition-all duration-300"
          disabled={isLoading}
        >
          {isEditMode
            ? isLoading
              ? "Updating House..."
              : "Update Product"
            : isLoading
            ? "Adding House...."
            : "Add Product"}
        </Button>
      </motion.div>
    </motion.form>
  );
}

export default function SuperAdminManageProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const houseId = searchParams.get("id");
  const isEditMode = Boolean(houseId);

  const { getHouseById, createHouse, updateHouse, isLoading } = useHouseStore();

  const [formState, setFormState] = useState({
    address: "",
    price: "",
    rooms: "",
    floors: "",
    bathrooms: "",
    estatetype: "",
    bathroomType: "",
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isLoadingHouse, setIsLoadingHouse] = useState(false);

  useEffect(() => {
    const loadHouse = async () => {
      if (isEditMode && houseId) {
        setIsLoadingHouse(true);
        const house = await getHouseById(houseId);
        if (house) {
          setFormState({
            address: house.address,
            price: house.price.toString(),
            rooms: house.rooms.toString(),
            floors: house.floors.toString(),
            bathrooms: house.bathrooms.toString(),
            estatetype: house.estatetype || "",
            bathroomType: house.bathroomType || "",
          });
        }
        setIsLoadingHouse(false);
      }
    };

    loadHouse();
  }, [isEditMode, houseId, getHouseById]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const check = await protectHouseFormAction();
      if (!check.success) {
        toast(check.error);
        return;
      }

      const formData = new FormData();
      Object.entries(formState).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (!isEditMode || selectedFiles.length > 0) {
        selectedFiles.forEach((file) => formData.append("images", file));
      }

      const result = isEditMode
        ? await updateHouse(houseId, formData)
        : await createHouse(formData);

      if (result?.success || result) {
        toast.success(isEditMode ? "House updated successfully" : "House created successfully");
        router.push("/house/list");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Form submission error:", err);
      toast.error("Unexpected error. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 z-0">
        <Image src={banner} alt="Background" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <motion.div
        className="relative z-10 p-6 max-w-5xl mx-auto text-white"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } }, hidden: {} }}
      >
        <motion.h1
          className="text-3xl font-bold mb-8 text-center"
          variants={fadeInUp}
          custom={0}
        >
          {isEditMode ? "Edit Product" : "Add Product"}
        </motion.h1>

        <Suspense fallback={<div className="text-center text-white">Loading form...</div>}>
          {isLoadingHouse && isEditMode ? (
            <div className="text-center text-white">Loading house data...</div>
          ) : (
            <HouseForm
              formState={formState}
              setFormState={setFormState}
              selectedFiles={selectedFiles}
              setSelectedFiles={setSelectedFiles}
              isEditMode={isEditMode}
              handleInputChange={handleInputChange}
              handleFormSubmit={handleFormSubmit}
              isLoading={isLoading}
            />
          )}
        </Suspense>
      </motion.div>
    </div>
  );
}
