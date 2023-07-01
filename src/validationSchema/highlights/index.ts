import * as yup from 'yup';

export const highlightValidationSchema = yup.object().shape({
  page_number: yup.number().integer().required(),
  text: yup.string().required(),
  book_id: yup.string().nullable(),
  user_id: yup.string().nullable(),
});
