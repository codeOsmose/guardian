
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';

const Register = ({ onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      // Replace with your backend API endpoint
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Sucesso', 'Conta criada com sucesso! Faça login para continuar.');
        onSwitchToLogin();
      } else {
        Alert.alert('Erro no Registro', data.message || 'Erro ao criar conta.');
      }
    } catch (error) {
      console.error('Erro ao conectar com o servidor:', error);
      Alert.alert('Erro', 'Não foi possível conectar com o servidor. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('./assets/shield.png')} // Certifique-se de ter um ícone de escudo em assets
        style={styles.logo}
      />
      <Text style={styles.title}>Criar Conta</Text>
      <Text style={styles.subtitle}>Comece a gerenciar suas assinaturas hoje</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome Completo"
        autoCapitalize="words"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha (mínimo 6 caracteres)"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar Senha"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Criando conta...' : 'Criar Conta'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onSwitchToLogin}>
        <Text style={styles.loginText}>
          Já tem uma conta? <Text style={styles.loginLink}>Faça login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
    padding: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
    tintColor: '#6a5acd',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#6a5acd',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginText: {
    fontSize: 16,
    color: '#666',
  },
  loginLink: {
    color: '#6a5acd',
    fontWeight: 'bold',
  },
});

export default Register;

