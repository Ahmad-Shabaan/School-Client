import { Filter, ListFilter, X } from "lucide-react";
import AppDropdownMenu from "./AppDropdownMenu";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import SearchInput from "@/shared/components/common/Form/SearchInput";

const Toolbar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") ?? "",
  );
  const clearFilters = () => {
    const next = new URLSearchParams(searchParams.toString());
    ["sort", "search", "status"].forEach((key) => next.delete(key));
    setSearchInput("");
    next.set("page", "1");
    setSearchParams(next, { replace: true });
  };

  const handleSearchQueryChange = (searchTerm: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (searchTerm !== "") next.set("search", searchTerm);
        else next.delete("search");

        return next;
      },
      { replace: true },
    );
  };
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-2 flex-wrap">
        <AppDropdownMenu
          items={[{ label: "Status", value: "top" }]}
          triggerBtn={
            <>
              <Filter className="h-3.5 w-3.5" /> Filter
            </>
          }
        />
        <AppDropdownMenu
          items={[
            { label: "Name: A to Z", value: "nameDesc" },
            { label: "Name: Z to A", value: "nameAsc" },
            { label: "Latest", value: "latest" },
            { label: "Oldest", value: "oldest" },
          ]}
          triggerBtn={
            <>
              <ListFilter className="h-3.5 w-3.5" /> Sort
            </>
          }
        />
        {searchParams.size > 1 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="gap-1.5 text-muted-foreground"
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </Button>
        )}
      </div>
      <SearchInput
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        handleSearchQueryChange={handleSearchQueryChange}
      />
    </div>
  );
};

export default Toolbar;
