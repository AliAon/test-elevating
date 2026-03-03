import React from "react";

export default function RecommenededYearParamteres({ list }) {
  return (
    <div className="bg-bg_primary rounded-xl p-6 mt-5">
      <p className="text-2xl font-semibold text-black">
        Lifecycle Information
      </p>
      <div className="grid grid-cols-4 gap-3 mt-5">
        {list?.map((item, index) => (
          <Card key={index} item={item} />
        ))}
      </div>
    </div>
  );
}

export const Card = ({ item, bg = "#fff" }) => {
  return (
    <div
      className="rounded-xl p-6"
      style={{
        background: bg,
      }}
    >
      <div
        className="w-10 h-10 flex items-center justify-center rounded-full"
        style={{ backgroundColor: item.icon_bg }}
      >
        <img src={item.icon} alt="" width={24} height={24} />
      </div>

      <div className="mt-3">
        <p className="text-sm text-text_primary font-medium">{item.title}</p>
        <p className="text-2xl text-text_primary font-semibold">{item.value}</p>
        <p className="text-xs text-text_secondary font-medium">
          {item.time_left}
        </p>
      </div>
    </div>
  );
};
