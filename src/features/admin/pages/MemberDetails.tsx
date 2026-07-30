import AppError from "@/shared/components/common/ErrorBoundary/AppError";
import { useQuery } from "@tanstack/react-query";
import {  useParams } from "react-router-dom";
import { userQueryOptions } from "../options/dashboard.options";
import { formatDateFull } from "@/lib/utils/formatDate";
import { ROUTES } from "@/config/routes";

const MemberDetails = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useQuery(userQueryOptions(id ? id : ""));
  if (isLoading) return <p>loading</p>;
  if (!data || isError)
    return (
      <AppError
        message="Failed to load user. Please try again."
        link="Back to Dashboard"
        to={ROUTES.Admin.basePath}
      />
    );
  return (
    <div className="page-container">
      <p>Created At: {formatDateFull(data.data.createdAt)}</p>
      <p>{data.data.lastLogin}</p>
      <p>First name: {data.data.firstName}</p>
      <p>Last name: {data.data.lastName}</p>
      <p>Email: {data.data.email}</p>
      <p>Activation: {data.data.isActive ? "Active" : "Inactive"}</p>
      <p>Username: {data.data.userName}</p>

      <p>
        Roles:
        {data.data.roles.map((role) => (
          <span>{role}</span>
        ))}
      </p>
    </div>
  );
};

export default MemberDetails;
