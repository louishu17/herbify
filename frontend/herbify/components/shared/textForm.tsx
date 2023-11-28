import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { TextField, Typography, Button, Container } from '@mui/material';

interface HerbifyFormProps<FormValuesInterface> {
    handleSubmit: (values: FormValuesInterface) => void;
    initialValues: FormValuesInterface;
    validationSchema: any;
    textFields?: TextFieldProps[];
    errorMessage: string;
}

interface TextFieldProps {
    name: string;
    type: string;
}

export const NO_ERROR_MESSAGE = "";

export const HerbifyForm: React.FC<HerbifyFormProps<any>> = ({ handleSubmit, initialValues, validationSchema, textFields, errorMessage }) => {
    return (
        <Container maxWidth="sm">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    console.log("form was submitted");
                    handleSubmit(values);
                }}
                enableReinitialize={true}
            >
                {() => (
                    <Form>
                        {textFields?.map((fieldProps, index) => (
                            <div key={index} style={{ marginBottom: 4 }}>
                                <Field
                                    as={TextField}
                                    type={fieldProps.type}
                                    label={fieldProps.name}
                                    name={fieldProps.name}
                                    variant="outlined"
                                    fullWidth
                                    required
                                />
                                <ErrorMessage name={fieldProps.name} component="Typography" />
                            </div>
                        ))}
                        {errorMessage && <Typography color="red">{errorMessage}</Typography>}
                        <Button type="submit" variant='contained' style={{ backgroundColor: "Highlight" }}>
                            Submit
                        </Button>
                    </Form>
                )}
            </Formik>
        </Container>
    );
};
