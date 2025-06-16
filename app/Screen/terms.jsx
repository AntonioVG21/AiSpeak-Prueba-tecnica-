import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';

export default function TermsScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF5D6', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 20 }}>Términos y Condiciones</Text>
      <Text>Contenido de los términos y condiciones...</Text>
    </SafeAreaView>
  );
}