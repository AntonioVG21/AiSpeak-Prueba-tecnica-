/**
 * ProfileScreen.jsx
 * 
 * This component renders the main profile screen of the Aispeak application.
 * It displays user information, subscription details, and additional options.
 * 
 * @author Aispeak Front-End Development Internship Assessment
 * @version 1.1
 */

// Import necessary libraries and components
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, TextInput, SafeAreaView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Nunito_400Regular, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { SourceSansPro_400Regular, SourceSansPro_600SemiBold } from '@expo-google-fonts/source-sans-pro';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

// Import image assets
import PlanIcon from '../../assets/images/spark.png';
import LegalIcon from '../../assets/images/page-flip.png';
import LogoutIcon from '../../assets/images/exit.png';
import CapybaraFront from '../../assets/images/capybara-front.png';
import ArrowLeft from '../../assets/images/arrow-left.png';

// Import constants
import { Colors } from '../../constants/Colors';
import Fonts from '../../constants/Fonts';

/**
 * Main ProfileScreen component
 * Displays user profile information and navigation options
 */
const ProfileScreen = () => {
  // Initialize router for navigation between screens
  const router = useRouter();
  
  // Use the color constants directly from Colors.js

  // State management for user data and editing mode
  const [isEditing, setIsEditing] = useState(false);  // Controls whether the user is in edit mode
  
  // Default user data that will be shown if no saved data exists
  const [userData, setUserData] = useState({
    name: 'Capybara Capybara',
    email: 'capybara@example.com',
    phone: '+1 234 567 890',
    profileImage: CapybaraFront,
  });
  
  // Separate state for edited data to prevent immediate changes to displayed data
  const [editedData, setEditedData] = useState({ ...userData });

  /**
   * Effect hook to load user data from AsyncStorage when component mounts
   * This ensures persistence of user data between app sessions
   */
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Attempt to retrieve stored user data
        const storedData = await AsyncStorage.getItem('userData');
        if (storedData) {
          // If data exists, update both userData and editedData states
          setUserData(JSON.parse(storedData));
          setEditedData(JSON.parse(storedData));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    loadUserData();
  }, []);
  
  /**
   * Effect hook to refresh user data when the screen receives focus
   * This ensures the profile image and other data are updated after editing
   */
  useEffect(() => {
    // Function to refresh data
    const refreshUserData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('userData');
        if (storedData) {
          setUserData(JSON.parse(storedData));
          setEditedData(JSON.parse(storedData));
          console.log('User data refreshed successfully');
        }
      } catch (error) {
        console.error('Error refreshing user data:', error);
      }
    };
    
    // Call refresh immediately when component mounts or when returning to this screen
    refreshUserData();
    
    // Set up a timer to refresh data every second (for development purposes)
    const refreshTimer = setInterval(refreshUserData, 1000);
    
    // Clean up the timer when component unmounts
    return () => {
      clearInterval(refreshTimer);
    };
  }, []);

  /**
   * Saves user data to AsyncStorage for persistence
   * @param {Object} data - User data object to be saved
   */
  const saveUserData = async (data) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  /**
   * Handles the save action when editing profile
   * Updates the displayed user data and saves to storage
   */
  const handleSave = () => {
    setUserData(editedData);  // Update the displayed user data
    saveUserData(editedData); // Save to AsyncStorage for persistence
    setIsEditing(false);      // Exit editing mode
  };

  /**
   * Handles user logout action
   * Removes user data from AsyncStorage
   */
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      alert('Sesión cerrada'); // Alert user of successful logout
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  /**
   * Handles account deletion
   * Clears all data from AsyncStorage
   */
  const handleDeleteAccount = async () => {
    try {
      await AsyncStorage.clear();
      alert('Cuenta eliminada'); // Alert user of successful account deletion
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  /**
   * Navigation function to the Legal Information screen
   */
  const navigateToLegalInfo = () => {
    router.push('/Screen/legal-info');
  };
  
  /**
   * Navigation function to the Edit Profile screen
   */
  const navigateToEditProfile = () => {
    router.push('/Screen/EditProfileScreen');
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

  if (!fontsLoaded) {
    return null;
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.yellow,
    },
    safeArea: {
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
    backButtonText: {
      color: Colors.yellow,
      fontSize: 22, // Un poco más grande para centrar visualmente
      fontWeight: 'bold',
      textAlign: 'center',
      textAlignVertical: 'center', // Para Android
      includeFontPadding: false,   // Para Android
      padding: 0,                  // Asegura que no haya padding extra
      margin: 0,
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
      color: Colors.green,
    },
    profileImageContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
      marginBottom: 20,
    },
    capybaraImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 10,
      backgroundColor: Colors.brown,
      resizeMode: 'contain',
      alignSelf: 'center',
    },
    profileImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: Colors.brown,
    },
    editPhotoButton: {
      marginTop: 10,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: Colors.blue,
    },
    editPhotoText: {
      fontFamily: Fonts.sourceSansBold,
      color: Colors.blue,
      fontSize: 14,
      marginTop: 10,
      textAlign: 'center',
    },
    profileName: {
      fontFamily: Fonts.nunitoBold,
      fontSize: 22,
      color: Colors.dark,
      textAlign: 'center',
      marginBottom: 15,
    },
    editProfileButton: {
      backgroundColor: Colors.blue,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 25,
      alignSelf: 'center',
      marginBottom: 30,
      width: 150,
      alignItems: 'center',
      borderBottomWidth: 4,
      borderBottomColor: '#0056a8', // Un azul más oscuro que el color principal
    },
    editProfileText: {
      fontFamily: Fonts.nunitoBold,
      color: Colors.light,
      fontSize: 16,
    },
    sectionContainer: {
      marginBottom: 20,
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
    menuItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: Colors.lightGray,
      borderRadius: 10,
      padding: 15,
      marginBottom: 10,
    },
    lastMenuItem: {
      marginBottom: 10,
    },
    menuItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    menuItemIcon: {
      width: 24,
      height: 24,
      marginRight: 10,
      resizeMode: 'contain',
    },
    menuItemText: {
      fontFamily: Fonts.nunito,
      fontSize: 16,
      color: Colors.dark,
    },
    planText: {
      fontFamily: Fonts.nunitoBold,
      fontSize: 16,
      color: Colors.blue, // Azul para el botón de Plan con fondo blanco
    },
    legalInfoText: {
      fontFamily: Fonts.nunito,
      fontSize: 16,
      color: Colors.textGray, // Gris para Información legal con fondo blanco roto
    },
    logoutText: {
      color: Colors.red,
    },
    menuItemRight: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    menuItemValue: {
      fontFamily: Fonts.nunito,
      fontSize: 16,
      color: Colors.dark,
      marginRight: 5,
    },
    menuItemArrow: {
      fontSize: 18,
      color: Colors.textGray,
    },
    deleteAccountButton: {
      alignSelf: 'center',
      marginTop: 20,
    },
    deleteAccountText: {
      fontFamily: Fonts.nunitoBold,
      color: Colors.red,
      fontSize: 16,
    },
    versionText: {
      fontFamily: Fonts.nunito,
      fontSize: 14,
      color: Colors.textGray,
      textAlign: 'center',
      marginTop: 'auto',
      paddingVertical: 20,
    },
    arrowIcon: {
      width: 20,         // Hazlo un poco más pequeño que el círculo
      height: 20,
      resizeMode: 'contain',
      margin: 0,
      padding: 0,
      tintColor: '#FFFFFF', // Cambiar el color de la flecha a blanco
    },
    title: {
      color: Colors.brown,
      fontFamily: Fonts.nunitoBold,
      fontSize: 24,
    },
    body: {
      color: Colors.textGray,
      fontFamily: Fonts.sourceSans,
      fontSize: 16,
    },

  });

  if (isEditing) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.backButton}>
            <View style={styles.backButtonCircle}>
              <Image source={ArrowLeft} style={styles.arrowIcon} />
            </View>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Editar perfil</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveText}>Guardar</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.profileImageContainer}>
            <TouchableOpacity onPress={() => setShowImageSelector(true)}>
              <Image 
                source={userData.profileImage || CapybaraFront}
                style={styles.capybaraImage}
              />
              <Text style={styles.editPhotoText}>Pulsa para cambiar la foto</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Información personal</Text>
          
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              value={editedData.name}
              onChangeText={(text) => setEditedData({...editedData, name: text})}
              placeholder="Name"
            />
            
            <TextInput
              style={styles.input}
              value={editedData.email}
              onChangeText={(text) => setEditedData({...editedData, email: text})}
              placeholder="Correo Electrónico"
              keyboardType="email-address"
            />
            
            <TextInput
              style={styles.input}
              value={editedData.phone}
              onChangeText={(text) => setEditedData({...editedData, phone: text})}
              placeholder="Teléfono"
              keyboardType="phone-pad"
            />
          </View>

          <TouchableOpacity 
            style={styles.deleteAccountButton}
            onPress={handleDeleteAccount}
          >
            <Text style={styles.deleteAccountText}>Borrar cuenta</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {}} style={styles.backButton}>
          <View style={styles.backButtonCircle}>
            <Image source={ArrowLeft} style={styles.arrowIcon} />
          </View>
        </TouchableOpacity>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileImageContainer}>
          <Image 
            source={userData.profileImage || CapybaraFront}
            style={styles.capybaraImage}
          />
        </View>
        
        <Text style={styles.profileName}>{userData.name}</Text>
        
        <TouchableOpacity 
          style={styles.editProfileButton} 
          onPress={navigateToEditProfile}
        >
          <Text style={styles.editProfileText}>Editar perfil</Text>
        </TouchableOpacity>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Suscripción</Text>
          
          <TouchableOpacity style={[styles.menuItem, {backgroundColor: Colors.light}]}>
            <View style={styles.menuItemLeft}>
              <Image source={PlanIcon} style={[styles.menuItemIcon, {tintColor: Colors.blue}]} />
              <Text style={[styles.planText, {color: Colors.blue}]}>Plan</Text>
            </View>
            <View style={styles.menuItemRight}>
              <Text style={[styles.menuItemValue, {color: Colors.blue}]}>Mensual</Text>
              <Text style={[styles.menuItemArrow, {color: Colors.blue}]}>›</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Más</Text>
          
          <TouchableOpacity style={[styles.menuItem, {backgroundColor: '#F2F2F2'}]} onPress={navigateToLegalInfo}>
            <View style={styles.menuItemLeft}>
              <Image source={LegalIcon} style={[styles.menuItemIcon, {tintColor: Colors.textGray}]} />
              <Text style={[styles.menuItemText, {color: Colors.textGray}]}>Información legal</Text>
            </View>
            <View style={styles.menuItemRight}>
              <Text style={[styles.menuItemArrow, {color: Colors.textGray}]}>›</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.menuItem, styles.lastMenuItem, {backgroundColor: '#EFEFEF'}]} onPress={handleLogout}>
            <View style={styles.menuItemLeft}>
              <Image source={LogoutIcon} style={[styles.menuItemIcon, {tintColor: Colors.red}]} />
              <Text style={[styles.menuItemText, styles.logoutText]}>Cerrar sesión</Text>
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.versionText}>Version 1.1</Text>
      </ScrollView>
      

    </SafeAreaView>
  );
};

export default ProfileScreen;

