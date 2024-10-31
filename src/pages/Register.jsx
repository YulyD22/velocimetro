// src/Register.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { auth } from '../services/FirebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';


const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    

    const handleRegister = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            setMessage("Usuario registrado con éxito");
        } catch (error) {
            setMessage(`Error al registrar: ${error.message}`);
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
            <Button title="Registrarse" onPress={handleRegister} />
            {message ? <Text style={styles.message}>{message}</Text> : null}
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
        color: 'green',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default Register;
