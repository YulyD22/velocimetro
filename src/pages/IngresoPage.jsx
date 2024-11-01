import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../services/FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

const IngresoPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();
    const [message, setMessage] = useState('');

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setMessage("Inicio de sesión exitoso");
        } catch (error) {
            setMessage(`Error al iniciar sesión: ${error.message}`);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title="Iniciar sesión" onPress={handleLogin} />
            {message ? <Text style={styles.message}>{message}</Text> : null}

            <Button
                title="¿No tienes cuenta? Regístrate"
                onPress={() => navigation.navigate("Register")}
                color="blue"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingLeft: 8,
    },
    message: {
        marginTop: 20,
        color: 'red',
        textAlign: 'center',
    },
});

export default IngresoPage;
