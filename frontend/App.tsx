// frontend/App.tsx
import React, {useEffect, useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, Text, View} from 'react-native';

function App(): React.JSX.Element {
  const [backendMessage, setBackendMessage] = useState('Conectando ao backend...');

  useEffect(() => {
    // NOTA: No Android, 'localhost' precisa ser trocado por '10.0.2.2' no emulador.
    // Para um dispositivo físico, use o IP da sua máquina na rede.
    fetch('http://localhost:8080/api/test' )
      .then(response => response.json())
      .then(data => setBackendMessage(data.message))
      .catch(error => {
        console.error(error);
        setBackendMessage('Falha ao conectar ao backend.');
      });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'light-content'} />
      <View style={styles.content}>
        <Text style={styles.title}>GuardianApp</Text>
        <Text style={styles.message}>{backendMessage}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E', // Um fundo escuro
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  message: {
    fontSize: 18,
    color: '#A9A9A9', // Um cinza claro
  },
});

export default App;
