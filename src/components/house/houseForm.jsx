"use client";
import Image from "next/image";
import { Upload, Trash2, Plus, X } from "lucide-react";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useState } from "react";

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

export default function HouseForm({
    formState,
    setFormState,
    selectedFiles,
    setSelectedFiles,
    isEditMode,
    handleInputChange,
    handleFormSubmit,
    isLoading,
    existingImages,
    setExistingImages,
    deletedImages,
    setDeletedImages
}) {
    const MAX_IMAGES = 5;
    const [newFeature, setNewFeature] = useState("");

    const handleFileChange = (e) => {
        if (!e.target.files) return;

        const newFiles = Array.from(e.target.files);
        const totalCurrentImages = existingImages.length - deletedImages.length + selectedFiles.length;
        const remainingSlots = MAX_IMAGES - totalCurrentImages;

        if (newFiles.length > remainingSlots) {
            toast.error(`You can only add ${remainingSlots} more image(s) (max ${MAX_IMAGES} total)`);
            return;
        }

        setSelectedFiles([...selectedFiles, ...newFiles]);
    };

    const handleDeleteNewImage = (index) => {
        setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
        toast.success("Image removed from selection");
    };

    const handleDeleteExistingImage = (image) => {
        setDeletedImages([...deletedImages, image.publicId || image.url]);
        toast.success("Image marked for deletion. Submit form to confirm.");
    };

    const handleRestoreImage = (image) => {
        setDeletedImages(deletedImages.filter(img => img !== (image.publicId || image.url)));
        toast.success("Image restoration queued");
    };

    const getRemainingImageSlots = () => {
        const totalCurrentImages = existingImages.length - deletedImages.length + selectedFiles.length;
        return MAX_IMAGES - totalCurrentImages;
    };

    const handleAddFeature = () => {
        if (newFeature.trim() === "") {
            toast.error("Please enter a feature");
            return;
        }
        setFormState(prev => ({
            ...prev,
            features: [...(prev.features || []), newFeature.trim()]
        }));
        setNewFeature("");
    };

    const handleRemoveFeature = (index) => {
        setFormState(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index)
        }));
    };

    return (
        <motion.form
            onSubmit={handleFormSubmit}
            className="mx-auto w-full max-w-4xl grid grid-cols-1 gap-6 sm:grid-cols-2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <div className="flex z-10 flex-col items-center gap-4 border-2 border-dashed border-gray-600 rounded-xl p-10 text-center bg-black/40 backdrop-blur-sm shadow-md hover:shadow-gray-700 transform transition-transform hover:-translate-y-1 hover:scale-105 duration-300 col-span-full">
                <p className="text-gray-300 mb-4">
                    {existingImages.length - deletedImages.length + selectedFiles.length > 0
                        ? existingImages.length - deletedImages.length + selectedFiles.length >= MAX_IMAGES
                            ? `Maximum ${MAX_IMAGES} images reached`
                            : `You can add ${getRemainingImageSlots()} more image(s)`
                        : isEditMode 
                            ? "Add new images to complement existing ones" 
                            : "Upload images of your property"}
                </p>
                <Label className="cursor-pointer text-gray-300 hover:text-white hover:underline flex flex-col items-center">
                    <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                    <span>Click to upload images</span>
                    <input
                        type="file"
                        multiple
                        className="sr-only"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={existingImages.length - deletedImages.length + selectedFiles.length >= MAX_IMAGES}
                    />
                </Label>
            </div>

            {(selectedFiles.length > 0 || existingImages.length > 0) && (
                <div className="col-span-full mt-4">
                    <div className="flex flex-wrap gap-4 justify-center">
                        {/* Existing Images */}
                        {existingImages.map((image, index) => {
                            const isDeleted = deletedImages.includes(image.publicId || image.url);
                            return (
                                <div key={`existing-${index}`} className="relative group">
                                    <Image
                                        src={image.url}
                                        alt={`Existing image ${index + 1}`}
                                        width={120}
                                        height={120}
                                        className={`rounded-lg object-cover h-[120px] w-[120px] border-2 ${
                                            isDeleted ? "border-red-500 opacity-50" : "border-blue-400"
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => 
                                            isDeleted 
                                                ? handleRestoreImage(image) 
                                                : handleDeleteExistingImage(image)
                                        }
                                        className={`absolute -top-2 -right-2 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                                            isDeleted 
                                                ? "bg-green-500 hover:bg-green-600" 
                                                : "bg-red-500 hover:bg-red-600"
                                        } text-white`}
                                    >
                                        {isDeleted ? (
                                            <span className="text-xs">Restore</span>
                                        ) : (
                                            <Trash2 size={16} />
                                        )}
                                    </button>
                                </div>
                            );
                        })}

                        {/* New Images */}
                        {selectedFiles.map((file, index) => (
                            <div key={`new-${index}`} className="relative group">
                                <Image
                                    src={URL.createObjectURL(file)}
                                    alt={`New image ${index + 1}`}
                                    width={120}
                                    height={120}
                                    className="rounded-lg object-cover h-[120px] w-[120px] border-2 border-green-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleDeleteNewImage(index)}
                                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Rest of your form fields */}
            {["address", "rooms", "floors", "bathrooms", "area"].map((field, i) => (
                <motion.div
                    key={field}
                    variants={fadeInUp}
                    custom={i + 2}
                    className="bg-black/40 backdrop-blur-sm p-4 rounded-xl shadow-inner border border-gray-700"
                >
                    <Label className="text-gray-300">
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                        {field === "area" && " (sq ft)"}
                    </Label>
                    <Input
                        name={field}
                        value={formState[field]}
                        onChange={handleInputChange}
                        placeholder={`Enter ${field}`}
                        type={field === "address" ? "text" : "number"}
                        min={field !== "address" ? 0 : undefined}
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
                    min={0}
                    className="mt-1 bg-black border-gray-600 text-white focus:ring-gray-400"
                />
            </motion.div>

            {/* About Section */}
            <motion.div
                variants={fadeInUp}
                custom={11}
                className="bg-black/40 backdrop-blur-sm p-4 rounded-xl shadow-inner border border-gray-700 col-span-full"
            >
                <Label className="text-gray-300">About the Property</Label>
                <Textarea
                    name="about"
                    value={formState.about || ""}
                    onChange={handleInputChange}
                    placeholder="Describe the property in detail..."
                    rows={4}
                    className="mt-1 bg-black border-gray-600 text-white focus:ring-gray-400"
                />
            </motion.div>

            {/* Features Section */}
            <motion.div
                variants={fadeInUp}
                custom={12}
                className="bg-black/40 backdrop-blur-sm p-4 rounded-xl shadow-inner border border-gray-700 col-span-full"
            >
                <Label className="text-gray-300">Features</Label>
                <div className="flex gap-2 mt-2">
                    <Input
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        placeholder="Add a feature (e.g. Swimming pool)"
                        className="flex-1 bg-black border-gray-600 text-white focus:ring-gray-400"
                    />
                    <Button
                        type="button"
                        onClick={handleAddFeature}
                        className="bg-gray-800 hover:bg-gray-700"
                    >
                        <Plus size={16} />
                    </Button>
                </div>
                
                {formState.features?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {formState.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-1 bg-gray-800 px-3 py-1 rounded-full">
                                <span className="text-sm">{feature}</span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveFeature(index)}
                                    className="text-gray-400 hover:text-white"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>

            <motion.div variants={fadeInUp} custom={13} className="col-span-full z-10">
                <Button
                    type="submit"
                    className="w-full border bg-gray-800 hover:bg-white hover:text-black text-white rounded-xl py-2 shadow-md transition-all duration-300"
                    disabled={isLoading}
                >
                    {isEditMode
                        ? isLoading
                            ? "Updating House..."
                            : "Update House"
                        : isLoading
                            ? "Adding House...."
                            : "Add House"}
                </Button>
            </motion.div>
        </motion.form>
    );
}