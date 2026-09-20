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
import { useCallback, useEffect, useState } from "react";
import type { PaginationState } from "@tanstack/react-table";
import { useSearchParams } from "react-router-dom";
import { ROUTES } from "@/config/routes";
import Toolbar from "../components/Toolbar";
import PageHeader from "@/shared/components/common/PageHeader";

const Members = () => {
  const [searchParams, setSearchParams] = useSearchParams();
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

  useEffect(() => {
    handlePageChange(pagination.pageIndex);
  }, [handlePageChange, pagination.pageIndex]);

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
      <div className="space-y-6">
        <PageHeader
          title="Members Management"
          description="View and manage all registered members"
        >
          <CreateUserForm
            onSubmit={handleSubmit}
            isLoading={createUserIsLoading}
            error={createUserError}
            isError={createUserIsError}
          />
        </PageHeader>

        <Toolbar />

        {/* Table */}
        <DataTable
          columns={columns}
          pagination={{
            pageIndex: pagination.pageIndex,
            pageSize: pagination.pageSize,
          }}
          pageCount={data?.pagination?.totalPages ?? 0}
          onPaginationChange={setPagination}
          data={data?.data ?? []}
        />
      </div>
    </div>
  );
};

export default Members;
