import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getHighlightById, updateHighlightById } from 'apiSdk/highlights';
import { Error } from 'components/error';
import { highlightValidationSchema } from 'validationSchema/highlights';
import { HighlightInterface } from 'interfaces/highlight';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { BookInterface } from 'interfaces/book';
import { UserInterface } from 'interfaces/user';
import { getBooks } from 'apiSdk/books';
import { getUsers } from 'apiSdk/users';

function HighlightEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<HighlightInterface>(
    () => (id ? `/highlights/${id}` : null),
    () => getHighlightById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: HighlightInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateHighlightById(id, values);
      mutate(updated);
      resetForm();
      router.push('/highlights');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<HighlightInterface>({
    initialValues: data,
    validationSchema: highlightValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Highlight
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="page_number" mb="4" isInvalid={!!formik.errors?.page_number}>
              <FormLabel>Page Number</FormLabel>
              <NumberInput
                name="page_number"
                value={formik.values?.page_number}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('page_number', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.page_number && <FormErrorMessage>{formik.errors?.page_number}</FormErrorMessage>}
            </FormControl>
            <FormControl id="text" mb="4" isInvalid={!!formik.errors?.text}>
              <FormLabel>Text</FormLabel>
              <Input type="text" name="text" value={formik.values?.text} onChange={formik.handleChange} />
              {formik.errors.text && <FormErrorMessage>{formik.errors?.text}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<BookInterface>
              formik={formik}
              name={'book_id'}
              label={'Select Book'}
              placeholder={'Select Book'}
              fetcher={getBooks}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.title}
                </option>
              )}
            />
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'user_id'}
              label={'Select User'}
              placeholder={'Select User'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.email}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'highlight',
    operation: AccessOperationEnum.UPDATE,
  }),
)(HighlightEditPage);
