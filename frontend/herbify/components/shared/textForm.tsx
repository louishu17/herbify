import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Grid, TextField, Typography, Button, Container, Box, FilledTextFieldProps, OutlinedTextFieldProps, StandardTextFieldProps, TextFieldVariants } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';


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
    optional?: boolean;
    datePicker?: boolean;
}

export const NO_ERROR_MESSAGE = "";

export const HerbifyForm: React.FC<HerbifyFormProps<any>> = ({ handleSubmit, initialValues, validationSchema, textFields, errorMessage, submitButtonText }) => {
    
    const formatDates = (values: any) => {
        const formattedValues = { ...values };
        if (textFields){
            textFields.forEach(field => {
                if (field.datePicker && values[field.name]) {
                    formattedValues[field.name] = format(new Date(values[field.name]), 'MM/dd/yyyy');
                }
            });
        }
        return formattedValues;
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Container maxWidth="sm">
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                        const formattedValues = formatDates(values);
                        handleSubmit(formattedValues);
                    }}
                    enableReinitialize={true}
                >
                    {() => (
                        <Form>
                            {textFields?.map((fieldProps, index) => (
                            <Box key={index} sx={{ mb: 2 }}>
                                {fieldProps.datePicker ? (
                                <Field
                                    component={DatePicker}
                                    name={fieldProps.name}
                                    label="Birthday"
                                    renderInput={(params: React.JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined; } & Omit<OutlinedTextFieldProps | FilledTextFieldProps | StandardTextFieldProps, "variant">) => (
                                    <TextField
                                        {...params}
                                        label="Birthday"
                                        fullWidth
                                    />
                                    )}
                                />
                                ) : (
                                <Field
                                    as={TextField}
                                    type={fieldProps.type}
                                    label={`${fieldProps.name.charAt(0).toUpperCase() + fieldProps.name.slice(1)}${fieldProps.optional ? ' (Optional)' : ''}`}
                                    name={fieldProps.name}
                                    variant="outlined"
                                    fullWidth
                                    required={!fieldProps.optional}
                                    
                                />
                                )}
                                <ErrorMessage name={fieldProps.name} component={Typography} />
                            </Box>
                            ))}
                            {errorMessage && <Typography color="red" sx={{marginBottom: 2}}>{errorMessage}</Typography>}

                            <Button 
                                type="submit" 
                                variant='contained' 
                                fullWidth
                                sx={{ 
                                    backgroundColor: 'Highlight', 
                                    '&:hover': { 
                                        backgroundColor: 'HighlightDark' 
                                    },
                                    marginBottom: 5
                                }}
                            >
                                {submitButtonText}
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Container>
        </LocalizationProvider>
    );
};
