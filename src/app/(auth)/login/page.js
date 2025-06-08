"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import banner from "../../../../public/assets/images/home-page.png";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { protectSignInAction } from "@/actions/auth";
import { ArrowRight } from "lucide-react";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isLoading } = useAuthStore();
  const router = useRouter();

  const handleOnChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const checkFirstLevelOfValidation = await protectSignInAction(
      formData.email
    );

    if (!checkFirstLevelOfValidation.success) {
      toast.error(checkFirstLevelOfValidation.error);
      return;
    }

    const result = await login(formData.email, formData.password);

    if (result === true) {
      toast.success("Login successful!");
      router.push("/house/list");
    } else {
      toast.error(result || "Login failed");
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center bg-slate-900 text-white z-0">

      {/* Background image animation */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={banner}
          alt="Background"
          fill
          priority
          className="object-cover animate-backgroundMove"
        />
        <div className="absolute inset-0 bg-slate-900 opacity-70 backdrop-blur-sm" />
      </div>

      {/* Container */}
      <div className="relative z-10 flex flex-col lg:flex-row w-full max-w-6xl bg-white/5 rounded-xl shadow-xl backdrop-blur-md overflow-hidden border border-white/10">

        {/* Left Side (Image) */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:block w-1/2 relative"
        >
          <Image
            src={banner}
            alt="Register"
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            className="rounded-l-xl"
          />
        </motion.div>

        {/* Right Side (Form) */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-md w-full mx-auto"
          >
            <div className="text-center mb-10 opacity-60">
              <h1 className="text-3xl font-bold tracking-widest text-white">
                BEstate
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Label htmlFor="email" className="text-sm font-medium text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="w-full h-12 px-4 bg-[#16243a] text-white border border-[#2b3c59] placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  value={formData.email}
                  onChange={handleOnChange}
                />
              </motion.div>

              {/* Password */}
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <Label htmlFor="password" className="text-sm font-medium text-white">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="w-full h-12 px-4 bg-[#16243a] text-white border border-[#2b3c59] placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  value={formData.password}
                  onChange={handleOnChange}
                />
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <Button
                  disabled={isLoading}
                  type="submit"
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    "Signing In..."
                  ) : (
                    <>
                      Login
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </motion.div>

              {/* Sign In Link */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-center text-sm text-gray-300 pt-2"
              >
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="text-blue-400 hover:underline font-semibold"
                >
                  Sign Up
                </Link>
              </motion.p>
            </form>
          </motion.div>
        </motion.div>
      </div>

      {/* Background animation style */}
      <style jsx global>{`
        @keyframes backgroundMove {
          0% {
            transform: scale(1.05) translateY(0px);
          }
          50% {
            transform: scale(1.1) translateY(-10px);
          }
          100% {
            transform: scale(1.05) translateY(0px);
          }
        }

        .animate-backgroundMove {
          animation: backgroundMove 12s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
