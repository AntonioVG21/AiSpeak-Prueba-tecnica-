/**
 * EditProfileScreen.jsx
 * 
 * This component renders the edit profile screen of the Aispeak application.
 * It allows users to modify their personal information and save changes.
 * 
 * @author Aispeak Front-End Development Internship Assessment
 * @version 1.1
 */

// Import necessary libraries and components
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, TextInput, SafeAreaView, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Nunito_400Regular, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { SourceSansPro_400Regular, SourceSansPro_600SemiBold } from '@expo-google-fonts/source-sans-pro';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Ya no necesitamos useRouter de expo-router
import { Colors } from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import Swiper from 'react-native-swiper';

// Import image assets
import CapybaraFront from '../../assets/images/capybara-front.png';

import CapybaraGafas from '../../assets/images/capybara-gafas.jpg';
import CapybaraGorro from '../../assets/images/capybara-gorro.jpg';
import CapybaraSombrero from '../../assets/images/capybara-sombrero.jpg';
import CapybaraVerano from '../../assets/images/capybara-verano.jpg';
import ArrowLeft from '../../assets/images/arrow-left.png';

/**
 * Main EditProfileScreen component
 * Allows users to edit their profile information
 * @param {Object} props - Component props including navigation
 */
export default function EditProfileScreen({ navigation }) {
  // We use the navigation prop from React Navigation
  // State for user data with default values
  const [userData, setUserData] = useState({
    name: 'Capybara Capybara',
    email: 'capybara@example.com',
    phone: '+1 234 567 890',
    profileImage: CapybaraFront,
  });
  
  // State for selected profile image index
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // State to control image selector visibility
  const [showImageSelector, setShowImageSelector] = useState(false);
  
  // Array of profile images
  const profileImages = [
    CapybaraFront,
    CapybaraGafas,
    CapybaraGorro,
    CapybaraSombrero,
    CapybaraVerano
  ];
  
  /**
   * Effect hook to load user data from AsyncStorage when component mounts
   * This ensures the edit screen displays the most current user information
   */
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Attempt to retrieve stored user data
        const storedData = await AsyncStorage.getItem('userData');
        if (storedData) {
          // If data exists, update userData state
          setUserData(JSON.parse(storedData));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    loadUserData();
  }, []);
  
  /**
   * Saves user data to AsyncStorage and navigates back to profile screen
   */
  const saveUserData = async () => {
    try {
      // Aseguramos que la imagen seleccionada esté incluida en los datos del usuario
      const updatedUserData = {
        ...userData,
        profileImage: profileImages[selectedImageIndex]
      };
      
      // Actualizamos el estado local
      setUserData(updatedUserData);
      
      // Save the updated user data to AsyncStorage
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));
      
      // Aseguramos que los cambios se guarden correctamente en AsyncStorage
      // No es necesario un evento personalizado en React Native
      
      // Navigate back to the previous screen
      navigation.goBack();
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };
  
  /**
   * Handles account deletion by clearing AsyncStorage
   * and navigating back to profile screen
   */
  const handleDeleteAccount = async () => {
    try {
      // Clear all data from AsyncStorage
      await AsyncStorage.clear();
      alert('Cuenta eliminada'); // Alert user of successful account deletion
      navigation.goBack(); // Navigate back to the previous screen
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };
  
  /**
   * Load custom fonts using Expo's useFonts hook
   * - Nunito: Used for headings and titles
   * - Source Sans Pro: Used for body text and general content
   */
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_700Bold,
    SourceSansPro_400Regular,
    SourceSansPro_600SemiBold,
  });

  // Return null while fonts are still loading
  if (!fontsLoaded) {
    return null;
  }
  
  // Render the edit profile screen UI
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      {/* Header section with back button, title and save button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <View style={styles.backButtonCircle}>
            <Image source={ArrowLeft} style={styles.arrowIcon} />
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar perfil</Text>
        <TouchableOpacity onPress={saveUserData}>
          <Text style={styles.saveText}>Guardar</Text>
        </TouchableOpacity>
      </View>
      
      {/* Scrollable content area */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Profile image section with modal selector for photo selection */}
        <View style={styles.profileImageContainer}>
          <TouchableOpacity onPress={() => setShowImageSelector(true)}>
            <Image 
              source={userData.profileImage || profileImages[selectedImageIndex]}
              style={styles.profileImage}
              resizeMode="cover"
              fadeDuration={0}
              // Añadimos una key única basada en la imagen para forzar la actualización
              key={userData.profileImage ? JSON.stringify(userData.profileImage) : `profile-${selectedImageIndex}`}
            />
            <Text style={styles.editPhotoText}>Pulsa para cambiar la foto</Text>
          </TouchableOpacity>
        </View>

        {/* Personal information section title */}
        <Text style={styles.sectionTitle}>Información personal</Text>
        
        {/* Form inputs for user data */}
        <View style={styles.formContainer}>
          {/* Name input field */}
          <TextInput
            style={styles.input}
            value={userData.name}
            onChangeText={(text) => setUserData({...userData, name: text})}
            placeholder="Name"
          />
          
          {/* Email input field */}
          <TextInput
            style={styles.input}
            value={userData.email}
            onChangeText={(text) => setUserData({...userData, email: text})}
            placeholder="Correo Electrónico"
            keyboardType="email-address"
          />
          
          {/* Phone input field */}
          <TextInput
            style={styles.input}
            value={userData.phone}
            onChangeText={(text) => setUserData({...userData, phone: text})}
            placeholder="Teléfono"
            keyboardType="phone-pad"
          />
        </View>

        {/* Delete account button at the bottom */}
        <TouchableOpacity 
          style={styles.deleteAccountButton}
          onPress={handleDeleteAccount}
        >
          <Text style={styles.deleteAccountText}>Borrar cuenta</Text>
        </TouchableOpacity>
      </ScrollView>
      
      {/* Modal para seleccionar imagen de perfil */}
      {showImageSelector && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecciona una imagen</Text>
            <View style={styles.imageGrid}>
              {profileImages.map((image, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={[styles.imageOption, selectedImageIndex === index && styles.selectedImageOption]}
                  onPress={() => {
                    setSelectedImageIndex(index);
                    // Actualizamos el estado con la nueva imagen seleccionada
                    const updatedUserData = {...userData, profileImage: profileImages[index]};
                    setUserData(updatedUserData);
                    // Guardamos inmediatamente en AsyncStorage para asegurar que se actualice
                    AsyncStorage.setItem('userData', JSON.stringify(updatedUserData))
                      .catch(error => console.error('Error al guardar imagen:', error));
                  }}
                >
                  <Image 
                    source={image} 
                    style={styles.optionImage} 
                    resizeMode="cover"
                    fadeDuration={0}
                    // Añadimos una key única para forzar la actualización
                    key={`option-${index}`}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity 
              style={styles.confirmButton}
              onPress={() => setShowImageSelector(false)}
            >
              <Text style={styles.confirmButtonText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

/**
 * Styles for the EditProfileScreen component
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.yellow,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  backButton: {
    padding: 5,
  },
  backButtonCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.blue,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  arrowIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  headerTitle: {
    fontFamily: Fonts.nunitoBold,
    fontSize: 20,
    color: Colors.dark,
    flex: 1,
    textAlign: 'center',
  },
  saveText: {
    fontFamily: Fonts.sourceSansBold,
    fontSize: 16,
    color: Colors.blue,
  },
  profileImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.brown,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  editPhotoText: {
    fontFamily: Fonts.sourceSansBold,
    color: Colors.blue,
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
  sectionTitle: {
    fontFamily: Fonts.nunitoBold,
    fontSize: 16,
    color: Colors.dark,
    marginBottom: 10,
  },
  formContainer: {
    marginBottom: 30,
  },
  input: {
    fontFamily: Fonts.sourceSans,
    fontSize: 16,
    backgroundColor: Colors.lightGray,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  deleteAccountButton: {
    alignSelf: 'center',
    marginTop: 20,
  },
  deleteAccountText: {
    fontFamily: Fonts.sourceSansBold,
    color: Colors.red,
    fontSize: 16,
  },
  // Estilos para el modal de selección de imágenes
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: Colors.yellow,
    borderRadius: 15,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: Fonts.nunitoBold,
    fontSize: 18,
    color: Colors.dark,
    marginBottom: 15,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  imageOption: {
    margin: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 40,
    padding: 2,
  },
  selectedImageOption: {
    borderColor: Colors.blue,
  },
  optionImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.brown,
    resizeMode: 'contain',
  },
  confirmButton: {
    backgroundColor: Colors.blue,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 10,
  },
  confirmButtonText: {
    fontFamily: Fonts.sourceSansBold,
    color: Colors.light,
    fontSize: 16,
  },
});
