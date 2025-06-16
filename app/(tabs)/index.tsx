import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../Screen/ProfileScreen';
import EditProfileScreen from '../Screen/EditProfileScreen';
import LegalInfoScreen from '../Screen/legal-info';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Stack.Navigator initialRouteName="Profile">
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Edit Profile" component={EditProfileScreen} />
      <Stack.Screen name="Legal Info" component={LegalInfoScreen} />
    </Stack.Navigator>
  );
}