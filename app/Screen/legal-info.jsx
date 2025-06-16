/**
 * legal-info.jsx
 * 
 * This component renders the legal information screen of the Aispeak application.
 * It provides access to Terms and Conditions and Privacy Policy.
 * 
 * @author Aispeak Front-End Development Internship Assessment
 * @version 1.1
 */

// Import necessary libraries and components
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Nunito_400Regular, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { SourceSansPro_400Regular, SourceSansPro_600SemiBold } from '@expo-google-fonts/source-sans-pro';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import Fonts from '../../constants/Fonts';

// Import image assets
import ArrowLeft from '../../assets/images/arrow-left.png';
import DocIcon from '../../assets/images/page-flip.png';

/**
 * Main LegalInfoScreen component
 * Displays legal information options for the user
 */
const LegalInfoScreen = () => {
  // Initialize router for navigation between screens
  const router = useRouter();

  /**
   * Navigation function to the Terms and Conditions screen
   */
  const navigateToTerms = () => {
    router.push('/terms');
  };

  /**
   * Navigation function to the Privacy Policy screen
   */
  const navigateToPrivacy = () => {
    router.push('/privacy');
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

  // Render the legal information screen UI
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      {/* Header section with back button and title */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <View style={styles.backButtonCircle}>
            <Image source={ArrowLeft} style={styles.arrowIcon} />
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Información Legal</Text>
        <View style={{ width: 36 }} /> {/* Empty view for layout balance */}
      </View>
      
      {/* Scrollable content area */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Terms and Conditions menu item */}
        <TouchableOpacity style={styles.menuItem} onPress={navigateToTerms}>
          <View style={styles.menuItemLeft}>
            <Image source={DocIcon} style={styles.menuItemDocIcon} />
            <Text style={styles.menuItemText}>Términos y Condiciones</Text>
          </View>
          <View style={styles.menuItemRight}>
            <Text style={styles.menuItemArrow}>›</Text>
          </View>
        </TouchableOpacity>
        
        {/* Privacy Policy menu item */}
        <TouchableOpacity style={styles.menuItem} onPress={navigateToPrivacy}>
          <View style={styles.menuItemLeft}>
            <Image source={DocIcon} style={styles.menuItemDocIcon} />
            <Text style={styles.menuItemText}>Política de Privacidad</Text>
          </View>
          <View style={styles.menuItemRight}>
            <Text style={styles.menuItemArrow}>›</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

/**
 * Styles for the LegalInfoScreen component
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
    textAlign: 'center',
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
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemDocIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
    tintColor: Colors.blue,
  },
  menuItemText: {
    fontFamily: Fonts.sourceSans,
    fontSize: 16,
    color: Colors.dark,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemArrow: {
    fontSize: 18,
    color: Colors.darkGray,
  },
});

export default LegalInfoScreen;