import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

function Dropdown({ options, selected, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-44">
      <div
        className="bg-[#F6F6F8] border-2 border-[#EAECEF] h-11 rounded-full cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex justify-between items-center px-3 h-full">
          <p className="font-semibold text-sm text-[#5B617F] truncate w-28">
            {selected}
          </p>
          <IoIosArrowDown
            className={`text-[#898EA6] text-base transition-transform duration-200 ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-12 left-0 w-full bg-white border border-[#EAECEF] rounded-lg shadow-md z-10">
          {options.map((option, index) => (
            <p
              key={index}
              onClick={() => {
                onSelect(option);
                setIsOpen(false);
              }}
              className="px-3 py-2 text-sm text-[#5B617F] hover:bg-[#F6F6F8] cursor-pointer"
            >
              {option}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
