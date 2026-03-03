import { Skeleton } from "../ui/skeleton";

export default function SkeletonRow() {
  return (
    <div
      className="w-full grid items-center  bg-white rounded-2xl p-4"
      style={{
        gridTemplateColumns: "repeat(8, 1fr)",
      }}
    >
      <Skeleton className="w-[159px] h-5 rounded-md" />
      <Skeleton className="w-[159px] h-5 rounded-md" />
      <Skeleton className="w-[159px] h-5 rounded-md" />
      <Skeleton className="w-[159px] h-5 rounded-md" />
      <Skeleton className="w-[116px] h-5 rounded-md" />
      <Skeleton className="w-[130px] h-5 rounded-md" />
      <Skeleton className="w-[146px] h-5 rounded-md " />
      <Skeleton className="w-[146px] ml-auto h-5 rounded-md " />
    </div>
  );
}
