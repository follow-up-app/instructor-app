import * as React from 'react';
import * as Yup from "yup";
import { View, StyleSheet, Alert } from 'react-native';
import { Card, Avatar, ActivityIndicator, Button, TextInput } from 'react-native-paper';
import IUser from '../../interfaces/user.type';
import { getCurrentUser, getUserAvatarId, updatePassword } from '../../service/api-service';
import { useFormik } from "formik";

interface UserCardProps {
    name: string;
    email: string;
    onUpdatePasswordPress: () => void;
}

export const Profile: React.FC<UserCardProps> = ({ name, email, onUpdatePasswordPress }) => {
    const [currentUser, setCurrentUser] = React.useState<IUser | null>();
    const [loadAvatar, setLoadAvatar] = React.useState('');
    const [loading, setLoading] = React.useState(true);

    const fetchUser = async () => {
        const user = await getCurrentUser();
        setCurrentUser(user);
        if (user.image_path !== null) {
            const avatar = await getUserAvatarId(user.id);
            setLoadAvatar(avatar);
        }
        setLoading(false);
    }

    const formatPayload = (data: any) => {
        return {
            password: data.password,
        }
    }

    const validationSchema = Yup.object().shape({
        password: Yup.string().required("Digite sua senha"),
        confirm_password: Yup.string().required("Digite sua confirmação de senha").oneOf([Yup.ref('password')], 'As senhas devem coincidir'),
    });

    const formik = useFormik({
        initialValues: {
            password: '',
            confirm_password: '',
        },

        validationSchema: validationSchema,
        onSubmit: async (values: { password: string; confirm_password: string }) => {
            const payload = formatPayload(values);
            updatePassword(payload);
            try {
                const call = await updatePassword(payload);
                if (call) {
                    Alert.alert('Sucesso', 'Senha de acesso atualizada.');
                }
            } catch (error) {
                console.error('Erro de autenticação:', error);
                Alert.alert('Erro', 'Falha na autenticação. Por favor, tente novamente.');
            }
        },
    });

    React.useEffect(() => {
        fetchUser();
    }, []);

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.loading}>
                    <ActivityIndicator
                        animating={true}
                        color='#01878B' />
                </View>

            ) : (
                <Card style={styles.card}>
                    {currentUser && (
                        <Card.Title
                            title={currentUser.fullname}
                            subtitle={currentUser.email}
                            left={(props) =>
                                loadAvatar ? (
                                    <Avatar.Image
                                        size={50}
                                        source={{ uri: loadAvatar }}
                                    />
                                ) : (
                                    <Avatar.Icon
                                        icon="account-circle"
                                        size={50}
                                    />
                                )
                            }
                            titleStyle={styles.title}
                            subtitleStyle={styles.subtitle}
                        />
                    )}
                    <Card.Content>
                        <View>
                            <TextInput
                                mode="outlined"
                                label="nova senha"
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
                        </View>
                        <View>
                            <TextInput
                                mode="outlined"
                                label="confirmar"
                                secureTextEntry
                                outlineColor="#BCC1CD"
                                value={formik.values.confirm_password}
                                onChangeText={formik.handleChange('confirm_password')}
                                onBlur={formik.handleBlur('confirm_password')}
                                style={[styles.input, { backgroundColor: 'rgba(255, 255, 255, 0.5)' }]}
                                error={formik.touched.confirm_password && Boolean(formik.errors.confirm_password)}
                                right={<TextInput.Icon icon="eye" color="#BCC1CD" />}
                                left={<TextInput.Icon icon="lock" color="#BCC1CD" />}
                            />
                        </View>
                    </Card.Content>
                    <Card.Actions>
                        <Button
                            mode="contained"
                            icon="loading"
                            onPress={formik.handleSubmit}
                            style={styles.updateButton}>
                            Atualizar
                        </Button>
                    </Card.Actions>
                </Card>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        marginTop: 50
    },
    card: {
        backgroundColor: 'white',
        marginVertical: 10,
        marginHorizontal: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 14,
    },
    avatarContainer: {
        marginTop: 10,
        marginRight: 20,
        marginBottom: 0,
        flexDirection: 'row',
        alignItems: 'center',
    },
    loading: {
        flex: 1,
        marginTop: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        marginBottom: 5,
    },
    updateButton: {
        marginTop: 10,
        backgroundColor: '#3C8CD6'
    },
});