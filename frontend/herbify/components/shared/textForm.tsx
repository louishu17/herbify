// LoginForm.tsx

import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import {  TextField, Typography, Button, Container } from '@mui/material';



interface HerbifyFormProps<FormValuesInterface> {
    handleSubmit : (values : FormValuesInterface ) => void;
    initialValues : FormValuesInterface;
    validationSchema : any;
    textFields? : TextFieldProps[];
    errorMessage : string;
}

interface TextFieldProps {
    name : string;
    type : string;
}

export const NO_ERROR_MESSAGE = "";

export const HerbifyForm: React.FC<HerbifyFormProps<any>> = (props:HerbifyFormProps<any>) => {
    return (
        <Container maxWidth="sm">
            <Formik
                initialValues={props.initialValues}
                validationSchema={props.validationSchema}
                onSubmit={(values : any) => {
                    console.log("form was submitted");
                    props.handleSubmit(values);
                }}
            >
                {() => (
                    <Form>
                        {props.textFields?.map((fieldProps, index) => {
                            return (
                                <div key={index} style={{marginBottom : 4}}>
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
                            );
                        })}

                    
                        {props.errorMessage.length > 0 ? <Typography color="red">{props.errorMessage}</Typography> : null}

                        <Button type="submit"  variant='contained' style={{backgroundColor : "Highlight"}} >
                            Submit
                        </Button>
                        
                    </Form>
                )}
            </Formik>
        </Container>
    
    );
};

