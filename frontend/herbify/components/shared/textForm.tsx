import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { TextField, Typography, Button, Container, Box } from '@mui/material';

interface HerbifyFormProps<FormValuesInterface> {
    handleSubmit: (values: FormValuesInterface) => void;
    initialValues: FormValuesInterface;
    validationSchema: any;
    textFields?: TextFieldProps[];
    errorMessage: string;
    submitButtonText: string;
}

interface TextFieldProps {
    name: string;
    type: string;
}

export const NO_ERROR_MESSAGE = "";

export const HerbifyForm: React.FC<HerbifyFormProps<any>> = ({ handleSubmit, initialValues, validationSchema, textFields, errorMessage, submitButtonText }) => {
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
                            <Box key={index} sx={{ mb: 2 }}>
                                <Field
                                    as={TextField}
                                    type={fieldProps.type}
                                    label={fieldProps.name.charAt(0).toUpperCase() + fieldProps.name.slice(1)} // Capitalize the label
                                    name={fieldProps.name}
                                    variant="outlined"
                                    fullWidth
                                    required
                                />
                                <ErrorMessage name={fieldProps.name} component={Typography}/>
                            </Box>
                        ))}
                        {errorMessage && <Typography color="error" sx={{ mb: 2 }}>{errorMessage}</Typography>}
                        <Button 
                            type="submit" 
                            variant='contained' 
                            fullWidth
                            sx={{ 
                                backgroundColor: 'Highlight', 
                                '&:hover': { 
                                    backgroundColor: 'HighlightDark' 
                                } 
                            }}
                        >
                            {submitButtonText}
                        </Button>
                    </Form>
                )}
            </Formik>
        </Container>
    );
};
