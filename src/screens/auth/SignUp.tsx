import * as React from 'react';
import { View, StyleSheet, Image, ImageBackground, Alert } from "react-native";
import followUp from './../../../assets/img/follow_up.png';
import image from './../../../assets/img/sign.png';
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, TextInput } from 'react-native-paper';
import { login } from '../../service/api-service';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
    Home: {} | undefined;
}

export const SignUp = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const validationSchema = Yup.object().shape({
        username: Yup.string().required("Digite seu e-mail"),
        password: Yup.string().required("Digite sua senha"),
    });

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },

        validationSchema: validationSchema,
        onSubmit: async (formValue: { username: string; password: string }) => {
            const { username, password } = formValue;
            try {
                const call = await login(username, password);
                console.log(call);
                if (call.access_token) {
                    navigation.navigate('Home');
                }
            } catch (error) {
                console.error('Erro de autenticação:', error);
                Alert.alert('Erro', 'Falha na autenticação. Por favor, tente novamente.');
            }
        },
    });


    return (
        <View style={styles.container}>

            <ImageBackground
                source={image}
                style={styles.backgroundImage}
            >
                <View style={styles.logoContainer}>
                    <Image source={followUp} style={styles.logo} />
                </View>
                <View style={styles.formContainer}>
                    <TextInput
                        mode="outlined"
                        label="e-mail"
                        outlineColor="#BCC1CD"
                        value={formik.values.username}
                        onChangeText={formik.handleChange('username')}
                        onBlur={formik.handleBlur('username')}
                        style={[styles.input, { backgroundColor: 'rgba(255, 255, 255, 0.5)' }]}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        left={<TextInput.Icon icon="account" color="#BCC1CD" />}
                    />
                    <TextInput
                        mode="outlined"
                        label="senha"
                        secureTextEntry
                        outlineColor="#BCC1CD"
                        value={formik.values.password}
                        onChangeText={formik.handleChange('password')}
                        onBlur={formik.handleBlur('password')}
                        style={[styles.input, { backgroundColor: 'rgba(255, 255, 255, 0.5)' }]}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        right={<TextInput.Icon icon="eye" color="#BCC1CD" />}
                        left={<TextInput.Icon icon="lock" color="#BCC1CD" />}
                    />
                    <Button
                        mode="contained"
                        icon="loading"
                        onPress={formik.handleSubmit}
                        style={styles.loginButton}>
                        Login
                    </Button>
                </View>
            </ImageBackground>
        </View>

    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        marginTop: 15,
        marginBottom: 280,
        marginRight: 100,
    },
    logo: {
        width: 250,
        height: 50,
    },
    formContainer: {
        width: '80%', // ajuste conforme necessário
    },
    input: {
        marginBottom: 5,
    },
    loginButton: {
        marginTop: 10,
        backgroundColor: '#3C8CD6'
    },
});
