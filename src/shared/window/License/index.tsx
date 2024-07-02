import { mdiKey } from '@mdi/js';
import { Input, Key } from '@shared/components';
import { ButtonColor, ButtonType, SFC, ToastType, WindowDispatch } from '@shared/types';
import { displayToast } from '@shared/utils/toast';
import { Form, Formik } from 'formik';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import * as S from './Styles';

export const License: SFC = ({className}) => {
    const dispatch = useDispatch<WindowDispatch>();

    const initialValues = {
        license: '',
    };

    type FormValues = typeof initialValues;
    
    const handleSubmit = async (values: FormValues) => { // make the function async
        const data = {
            license: values.license,
        };

        try {
            displayToast('Success', ToastType.success);
            /*
            if (response.data.isLicense) {
                dispatch(setActivePage(Page.dashboard));
                dispatch(setActiveLicense(data.license));
                displayToast(response.data.message, ToastType.success);
            } else {
                displayToast(response.data.message, ToastType.error);
            }*/
        } catch (error) {
            //dispatch(setActiveLicense(null));
            displayToast('License Error!', ToastType.error);
        }
    };

    const validationSchema = useMemo(() => {
        return yup.object().shape({
            license: yup.string().required('Server is required'),
        });
    }, []);
    
    return (
        <>
           <S.Container>
            <S.CardContainer>
                <S.CardHeader className={className}>
                    <S.Icon path={mdiKey} size="40px"/>
                    <S.CardTitle> License Key</S.CardTitle>
                </S.CardHeader>
                <S.CardBody className={className}>
                    <Key />
                    <Formik
                        initialValues={initialValues}
                        onSubmit={handleSubmit}
                        validateOnMount={false}
                        validationSchema={validationSchema}
                    >
                        {({ dirty, errors, isSubmitting, touched, isValid }) => (
                            <Form>
                                <Input errors={errors} type="text" label="License" name="license" touched={touched} />
                                <S.Button
                                    dirty={dirty}
                                    disabled={isSubmitting}
                                    isSubmitting={isSubmitting}
                                    isValid={isValid}
                                    text="Submit"
                                    color={ButtonColor.blue}
                                    type={ButtonType.submit}
                                />
                            </Form>
                        )}
                    </Formik>
                </S.CardBody>
            </S.CardContainer>
        </S.Container>
        </>
    );
}