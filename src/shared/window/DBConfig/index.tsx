
import { mdiDatabase } from '@mdi/js';
import { Input } from '@shared/components';
import { setActiveDatabaseConfig } from '@shared/store/manager';
import { ButtonColor, ButtonType, DBConfig as Config, SFC, ToastType, WindowDispatch } from '@shared/types';
import { displayToast } from '@shared/utils/toast';
import { Form, Formik } from 'formik';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import * as yup from 'yup'; // corrected import
import * as S from './Styles';

export const DBConfig: SFC = ({ className }) => { 
    const dispatch = useDispatch<WindowDispatch>();

    const initialValues: Config = {
        server: '',
        name: '',
        user: '',
        password: '',
        port: 0,
    };

    type FormValues = typeof initialValues;

    const handleSubmit = (values: FormValues) => { // make the function async
        const config: Config = {
            server: values.server,
            name: values.name,
            user: values.user,
            password: values.password,
            port: values.port
        };
        try {
            displayToast('Database Connected', ToastType.success);
            /*
            //console.log('CONNECTED: '+ response);
            if (response){
                displayToast('Connected', ToastType.success);
            } else {
                displayToast('Connection failed', ToastType.error);
            }*/
        } catch (error: any) {
            dispatch(setActiveDatabaseConfig(null));
            displayToast(`${error}`, ToastType.error);
        }
    };

    const validationSchema = useMemo(() => {
        return yup.object().shape({
            server: yup.string().required('Server is required'),
            name: yup.string().required('Name is required'),
            user: yup.string().required('User is required'),
            password: yup.string().required('Password is required'),
            port: yup.number().integer().required('Port is required').notOneOf([0], 'Port cannot be 0'),
        });
    }, []);

    return (
        <>
        <S.Container>
            <S.CardContainer>
                <S.CardHeader className={className}>
                    <S.Icon path={mdiDatabase} size="40px"/>
                    <S.CardTitle> Database Configuration</S.CardTitle>
                </S.CardHeader>
                <S.CardBody className={className}>
                    <Formik
                        initialValues={initialValues}
                        onSubmit={handleSubmit}
                        validateOnMount={false}
                        validationSchema={validationSchema}
                    >
                        {({ dirty, errors, isSubmitting, touched, isValid }) => (
                            <Form>
                                <Input errors={errors} type="text" label="Server" name="server" touched={touched} />
                                <Input errors={errors} type="text" label="Name" name="name" touched={touched} />
                                <Input errors={errors} type="text" label="User" name="user" touched={touched} />
                                <Input errors={errors} type="password" label="Password" name="password" touched={touched} />
                                <Input errors={errors} type="number" label="Port" name="port" touched={touched} />
                                <S.Button
                                    className={"width:100% !important;"}
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
};
