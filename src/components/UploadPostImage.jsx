import React from "react";
import isString from "lodash/isString";
import { useDropzone } from "react-dropzone";
import { Typography, Box, Stack } from "@mui/material";
import AddAPhotoRoundedIcon from "@mui/icons-material/AddAPhotoRounded";
import { styled } from "@mui/material/styles";
import RejectionFiles from "./RejectionFiles";

const DropZoneStyle = styled("div")(({ theme }) => ({
  outline: "none",
  overflow: "hidden",
  position: "relative",
  height: 250,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create("padding"),
  border: `1px dashed alpha('#919EAB', 0.32)`,
  "&:hover": { opacity: 0.75, cursor: "pointer" },
}));

function UploadPostImage({ error, file, helperText, sx, ...other }) {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
    multiple: false,
    ...other,
  });

  return (
    <Box sx={{ width: "100%", ...sx }}>
      <DropZoneStyle
        {...getRootProps()}
        sx={{
          ...(isDragActive && { opacity: 0.72 }),
          ...((isDragReject || error) && {
            color: "error.main",
            borderColor: "error.light",
            bgcolor: "error.lighter",
          }),
          ...(file && {
            padding: "5% 0",
          }),
        }}
      >
        <input {...getInputProps()} />

        <Stack
          direction="column"
          spacing={2}
          justifyContent="center"
          alignItems="center"
          zIndex={9}
        >
          <AddAPhotoRoundedIcon />
          <Typography
            gutterBottom
            variant="body2"
            sx={{ color: "#637381" }}
            textAlign="center"
          >
            Drop or Select Image
          </Typography>
        </Stack>

        {file && (
          <Box
            sx={{
              top: 0,
              borderRadius: 1,
              position: "absolute",
              width: "100%",
              height: "100%",
              overflow: "hidden",
              "& img": { objectFit: "cover", width: 1, height: 1 },
            }}
          >
            <img
              alt="file preview"
              src={isString(file) ? file : file.preview}
            />
          </Box>
        )}
      </DropZoneStyle>

      {helperText && helperText}

      {fileRejections.length > 0 && (
        <RejectionFiles fileRejections={fileRejections} />
      )}
    </Box>
  );
}

export default UploadPostImage;
