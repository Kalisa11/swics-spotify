import Image from "next/image";
import { Inter } from "next/font/google";
import Sidebar from "@/src/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div>
      <h1>Next.js + Tailwind CSS</h1>
      <main>
        {/* Sidebar */}
        <Sidebar />
        {/* Center */}
      </main>
      <div>{/* Music Player */}</div>
    </div>
  );
}
