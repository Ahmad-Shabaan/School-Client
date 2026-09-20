import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
const SearchInput = ({
  searchInput,
  setSearchInput,
  handleSearchQueryChange,
}: {
  searchInput: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
  handleSearchQueryChange: (searchTerm: string) => void;
}) => {
  return (
    <div className="flex items-center gap-2">
      <Field className="w-full sm:w-64">
        <ButtonGroup>
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearchQueryChange(searchInput);
            }}
            className="rounded-lg"
            id="input-button-group"
            placeholder="Search members..."
          />
          <Button
            className="h-10"
            variant="outline"
            size="icon"
            onClick={() => handleSearchQueryChange(searchInput)}
          >
            <Search className="h-4 w-4" />
          </Button>
        </ButtonGroup>
      </Field>
    </div>
  );
};

export default SearchInput;
