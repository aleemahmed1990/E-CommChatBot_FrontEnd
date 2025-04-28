// ReferralDetail.js
import React, { useRef } from "react";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import Sidebar from "../Sidebar/sidebar";

const RELATED = [
  { thumb: "https://via.placeholder.com/100", name: "Alice", date: "1.2.2024" },
  { thumb: "https://via.placeholder.com/100", name: "Bob", date: "1.2.2024" },
  { thumb: "https://via.placeholder.com/100", name: "Carol", date: "1.2.2024" },
  { thumb: "https://via.placeholder.com/100", name: "Dave", date: "1.2.2024" },
  { thumb: "https://via.placeholder.com/100", name: "Eve", date: "1.2.2024" },
];

export default function ReferralDetail({
  video,
  onBack,
  sidebarOpen,
  toggleSidebar,
}) {
  const carouselRef = useRef();

  const scroll = (dir) => {
    carouselRef.current.scrollBy({ left: dir * 150, behavior: "smooth" });
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "lg:ml-80" : ""
        } w-full bg-gray-50 p-6`}
      >
        {/* Back & Title */}
        <button
          onClick={onBack}
          className="flex items-center text-gray-700 mb-4"
        >
          <X size={20} className="mr-2" /> Back to list
        </button>

        <h2 className="text-xl font-semibold mb-6">MORE VIDEOS</h2>
        <div className="relative mb-8">
          <button
            onClick={() => scroll(-1)}
            className="absolute left-0 top-1/2 -mt-5 bg-white p-2 rounded-full shadow"
          >
            <ChevronLeft />
          </button>
          <div
            ref={carouselRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide px-10"
          >
            {RELATED.map((r, i) => (
              <div key={i} className="w-24 flex-shrink-0 text-center">
                <img
                  src={r.thumb}
                  alt=""
                  className="w-24 h-24 rounded-lg mb-2"
                />
                <div className="text-sm">{r.name}</div>
                <div className="text-xs text-gray-500">date: {r.date}</div>
              </div>
            ))}
          </div>
          <button
            onClick={() => scroll(1)}
            className="absolute right-0 top-1/2 -mt-5 bg-white p-2 rounded-full shadow"
          >
            <ChevronRight />
          </button>
        </div>

        {/* Main Video */}
        <div className="flex items-center gap-6 mb-4">
          <Play size={40} className="text-orange-500" />
          <div>
            <h3 className="text-2xl font-semibold">Video ID# {video.code}</h3>
            <p className="text-gray-600">
              Length: 3 min, Created on {video.date}
            </p>
          </div>
        </div>
        <div className="relative mb-6">
          <img
            src="https://via.placeholder.com/600x300"
            alt="video placeholder"
            className="w-full rounded-lg"
          />
          <Play
            size={60}
            className="absolute inset-0 m-auto text-green-500 cursor-pointer"
          />
        </div>

        {/* Legend */}
        <div className="border rounded-lg p-4 max-w-xs mb-6">
          <h4 className="font-medium mb-2">Color codes</h4>
          {[
            { color: "bg-gray-400", label: "Incoming unverified videos" },
            { color: "bg-yellow-400", label: "moved to manager waiting" },
            { color: "bg-green-400", label: "verified videos" },
            { color: "bg-red-400", label: "moved to spam" },
          ].map((c, i) => (
            <div key={i} className="flex items-center mb-1">
              <span className={`${c.color} w-3 h-3 rounded-full mr-2`}></span>
              <span className="text-sm">{c.label}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button className="px-6 py-2 bg-red-600 text-white rounded">
            move to spam
          </button>
          <button className="px-6 py-2 bg-green-600 text-white rounded">
            mark as verified
          </button>
          <button className="px-6 py-2 bg-yellow-400 text-white rounded">
            Moved to manager
          </button>
          <button className="px-6 py-2 bg-lime-300 text-gray-900 rounded">
            Decide later
          </button>
        </div>
      </div>
    </div>
  );
}
