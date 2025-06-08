
import Navbar from "@/components/navbar";



export const metadata = {
  title: "House routes",
  description: "",
};

export default function RootLayout({ children }) {
  return (
      <div
        className={``}
      >
        <Navbar />
        {children}
      </div>
  );
}
