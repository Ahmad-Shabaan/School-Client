import type { InfoForm } from "@/lib/utils/validation";
import FieldWrapper from "./FieldWrapper";
import InputForm from "./InputForm";
import type {
  Control,
  FieldErrors,
  FieldPath,
} from "react-hook-form";

interface InfoFormInputsProps<T extends InfoForm> {
  control: Control<T>;
  errors: FieldErrors<T>;
  firstName: FieldPath<T>;
  lastName: FieldPath<T>;
}
const InfoFormInputs = <T extends InfoForm>({
  control,
  errors,
  firstName,
  lastName,
}: InfoFormInputsProps<T>) => {
  return (
    <>
      <FieldWrapper
        id="update-firstName"
        label="First Name"
        errorId="firstName-error"
        errorMessage={errors.firstName?.message?.toString()}
      >
        <InputForm
          control={control}
          inputField={firstName}
          errors={errors}
          id="update-firstName"
          placeholder="John"
        />
      </FieldWrapper>

      <FieldWrapper
        id="update-lastName"
        label="Last Name"
        errorId="lastName-error"
        errorMessage={errors.lastName?.message?.toString()}
      >
        <InputForm
          control={control}
          inputField={lastName}
          errors={errors}
          id="update-lastName"
          placeholder="Doe"
        />
      </FieldWrapper>
    </>
  );
};

export default InfoFormInputs;
