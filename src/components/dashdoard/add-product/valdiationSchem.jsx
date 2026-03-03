import * as Yup from "yup";

export const validationSchema = Yup.object({
  brand_name: Yup.string().required("Brand name is required"),
  logo: Yup.mixed().required("Logo file is required"),
});
