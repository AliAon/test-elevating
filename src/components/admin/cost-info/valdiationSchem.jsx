import * as Yup from "yup";

export const validationSchema = Yup.object({
  ESCALATOR_low_price: Yup.number().required("Required").positive(),
  ESCALATOR_high_price: Yup.number()
    .required("Required")
    .moreThan(Yup.ref("ESCALATOR_low_price"), "Must be greater than Min"),

  MOVING_WALK_low_price: Yup.number().required("Required").positive(),
  MOVING_WALK_high_price: Yup.number()
    .required("Required")
    .moreThan(Yup.ref("MOVING_WALK_low_price"), "Must be greater than Min"),

  PLATFORM_low_price: Yup.number().required("Required").positive(),
  PLATFORM_high_price: Yup.number()
    .required("Required")
    .moreThan(Yup.ref("PLATFORM_low_price"), "Must be greater than Min"),

  DUMB_WAITER_low_price: Yup.number().required("Required").positive(),
  DUMB_WAITER_high_price: Yup.number()
    .required("Required")
    .moreThan(Yup.ref("DUMB_WAITER_low_price"), "Must be greater than Min"),

  ELEVATOR: Yup.lazy((value) =>
    Yup.object(
      Object.keys(value || {}).reduce((schema, key) => {
        schema[key] = Yup.object().shape({
          low_price: Yup.number().required("Required").positive(),
          high_price: Yup.number()
            .required("Required")
            .moreThan(Yup.ref("low_price"), "Must be greater than Min"),
        });
        return schema;
      }, {})
    )
  ),
});
