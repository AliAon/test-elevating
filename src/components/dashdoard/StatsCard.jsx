// eslint-disable react/prop-types
export default function StatsCard({ item }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg  2xl:p-4 xl:p-2 flex items-center gap-4 transition-all duration-200 hover:shadow-sm hover:border-gray-300 group cursor-pointer">
      <div className="2xl:w-10 2xl:h-10 w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0 transition-colors duration-200 group-hover:bg-gray-100">
        <img src={item.icon} alt={item.title} width={20} height={20} />
      </div>
      <div className="flex-1 min-w-0">
        <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
          {item.title}
        </h2>
        <p className="text-2xl font-bold text-gray-900">{item.value}</p>
      </div>
    </div>
  );
}
