import { Typography } from "@mui/material";

const Errors = ({ validationErrors, keyName }) => {
  return (
    <Typography variant="body2" color="error">
      {validationErrors?.length
        ? validationErrors.find((item) => item.key === keyName)?.message
        : ""}
    </Typography>
  );
};

export default Errors;
