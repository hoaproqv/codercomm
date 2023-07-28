import { useFormContext, Controller } from "react-hook-form";
import { FormHelperText } from "@mui/material";
import UploadPostImage from "../UploadPostImage";

function FUploadPostImage({ name, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const checkError = !!error && !field.value;
        return (
          <div>
            <UploadPostImage error={checkError} {...other} file={field.value} />
            {checkError && (
              <FormHelperText error sx={{ px: 2, textAlign: "center" }}>
                {error.message}
              </FormHelperText>
            )}
          </div>
        );
      }}
    />
  );
}

export default FUploadPostImage;
