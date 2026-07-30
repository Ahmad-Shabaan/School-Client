import { useQuery } from "@tanstack/react-query";
import { usersQueryOptions } from "../options/dashboard.options";
import CreateUserForm from "../components/CreateUserForm";
import type { CreateUserFormValues } from "@/lib/utils/validation";
import { useCreateUser } from "../hooks/useDashboard";
import type { UserRequestDto } from "../types/dashboard.types";
import AppError from "@/shared/components/common/ErrorBoundary/AppError";
import { DataTable } from "../table/data-table";
import { columns } from "../table/columns";
import UsersSkeleton from "../components/UsersSkeleton";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCallback, useEffect, useState } from "react";
import { Cross, FilterIcon, ListFilter } from "lucide-react";
import type { PaginationState } from "@tanstack/react-table";
import { useSearchParams } from "react-router-dom";
import { ROUTES } from "@/config/routes";

const Members = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") ?? "",
  );
  const [position, setPosition] = useState("bottom");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex:
      Number(searchParams.get("page")) === 0
        ? 1
        : Number(searchParams.get("page")),
    pageSize: 10,
  });
  const { data, isLoading, isError, error } = useQuery(
    usersQueryOptions({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      search: searchParams.get("search") ?? "",
    }),
  );
  const {
    handleCreateUser,
    isLoading: createUserIsLoading,
    isError: createUserIsError,
    error: createUserError,
  } = useCreateUser();

  const handleSubmit = (values: CreateUserFormValues) => {
    const user: UserRequestDto = {
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
      roles: [values.role],
      isActive: true,
      forceChangePassword: true,
    };
    handleCreateUser(user);
  };

  // ── Page change ──────────────────────────────────────────────────────────
  const handlePageChange = useCallback(
    (p: number) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set("page", String(p));
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const handleSearchQueryChange = (searchTerm: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (searchTerm !== "") {
          next.set("search", searchTerm);
        } else {
          next.delete("search");
        }
        return next;
      },
      { replace: true },
    );
  };

  useEffect(() => {
    handlePageChange(pagination.pageIndex);
  }, [handlePageChange, pagination.pageIndex]);

  const clearFilters = () => {
    const next = new URLSearchParams(searchParams.toString());
    ["sort", "search", "status"].forEach((key) => next.delete(key));
    setSearchInput("");
    next.set("page", "1");
    setSearchParams(next, { replace: true });
  };

  if (isLoading) {
    return <UsersSkeleton />;
  }
  if (isError)
    return (
      <AppError
        message={error.title}
        link="Back to Dashboard"
        to={ROUTES.Admin.basePath}
      />
    );

  return (
    <div className="page-container">
      <div className="mb-6 sm:mb-8 relative">
        <h1 className="section-header">Members management</h1>
        <p className="text-sm text-on-surface-variant">
          View and track all your members
        </p>
      </div>
      <div className="flex justify-between mb-4">
        <div className="flex justify-start gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-surface-dim border-0 rounded-full"
              >
                <FilterIcon /> Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-32 ">
              <DropdownMenuGroup>
                <DropdownMenuRadioGroup
                  value={position}
                  onValueChange={setPosition}
                >
                  <DropdownMenuRadioItem value="top">
                    Status
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-surface-dim border-0 rounded-full"
              >
                <ListFilter /> Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40">
              <DropdownMenuGroup>
                <DropdownMenuRadioGroup
                  value={position}
                  onValueChange={setPosition}
                >
                  <DropdownMenuRadioItem value="top">
                    Name: A to Z
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="bottom">
                    Name: Z to A
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="right">
                    latest
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="right">
                    oldest
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <CreateUserForm
            onSubmit={handleSubmit}
            isLoading={createUserIsLoading}
            error={createUserError}
            isError={createUserIsError}
          />

          <Button
            variant="ghost"
            onClick={clearFilters}
            className=" bg-surface-dim border-0 rounded-full"
          >
            <Cross />
            Clear Filters
          </Button>
        </div>

        <Field className="w-3xs rounded-full">
          <ButtonGroup>
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="rounded-full cursor-pointer"
              id="input-button-group"
              placeholder="Type to search..."
            />
            <Button
              className="rounded-full "
              variant="outline"
              onClick={() => handleSearchQueryChange(searchInput)}
            >
              Search
            </Button>
          </ButtonGroup>
        </Field>
      </div>
      <DataTable
        columns={columns}
        pagination={{
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
        }}
        // pageCount={data.totalPages ?? 2}
        pageCount={2}
        onPaginationChange={setPagination}
        data={data?.data ?? []}
      />
    </div>
  );
};

export default Members;
