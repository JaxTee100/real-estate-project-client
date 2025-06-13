import Navbar from "@/components/navbar";

export const metadata = {
  title: "House routes",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <div>
      <Navbar />
      <div className="pt-24 px-4 sm:px-6 lg:px-8"> {/* Added padding top to account for navbar height */}
        {children}
      </div>
    </div>
  );
}