import Sidebar from "@/src/components/Sidebar";

export default function Home() {
  
  return (
    <div className="bg-black h-screen overflow-hidden">
      <main className="">
        {/* Sidebar */}
        <Sidebar />
        {/* Center */}
      </main>
      <div>{/* Music Player */}</div>
    </div>
  );
}
