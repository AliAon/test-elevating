import React, { useState } from "react";
import {
  createSearchParams,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export function SearchBar() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim() === "") return;

    // Push query to the route
    navigate({
      pathname, // or wherever you want to search
      search: `?${createSearchParams({ query: search })}`,
    });
  };

  return (
    <div className="flex items-center gap-4 mt-5 lg:mt-0">
      <form onSubmit={handleSearch} className="relative w-[260px] h-11">
        <div className="bg-gradient-to-r from-[#FFCBB6] to-primary/0 rounded-2xl p-[1px] h-full">
          <img
            src="/assets/svg/search.svg"
            alt=""
            width={24}
            height={24}
            className="absolute top-1/2 -translate-y-1/2 left-5"
          />
          <Input
            value={search}
            onChange={(e) => {
              // Push query to the route
              navigate({
                pathname, // or wherever you want to search
                search: `?${createSearchParams({ query: e.target.value })}`,
              });
              setSearch(e.target.value);
            }}
            placeholder="Search"
            className="w-full h-full text-sm placeholder:text-text_secondary font-semibold rounded-2xl bg-white border-0 ps-12"
          />
        </div>
      </form>

      <Link to="/admin/brand-details">
        <Button className="w-[207px] h-11 rounded-full bg-[#F06B3C] text-sm font-semibold text-white">
          Add Brand
        </Button>
      </Link>
    </div>
  );
}
