import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

export function Breadcrumbs({ list }) {
  return (
    <div className="py-3">
      <Breadcrumb>
        <BreadcrumbList>
          {list.map((item, index, arr) => {
            return (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    className={`${index == arr.length - 1 ? "text-[#f07143] font-bold" : ""}`}
                    href={item.link}
                  >
                    {item.item}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {index != arr.length - 1 && <BreadcrumbSeparator />}
              </>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
