/**
 * @file AchievementCard.tsx
 * @description Componente para mostrar tarjetas de logros con animaciones
 * y efectos visuales. Incluye soporte para mostrar progreso y efectos
 * de celebración cuando un logro se completa.
 */
import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Animated, Easing, Platform } from 'react-native';
import { Colors } from '../../constants/Colors';
import Fonts from '../../constants/Fonts';

/**
 * @interface AchievementCardProps
 * @description Propiedades para el componente AchievementCard
 */
interface AchievementCardProps {
  /** Título del logro */
  title: string;
  /** Descripción detallada del logro */
  description: string;
  /** Icono que representa el logro */
  icon: any; // Imagen del logro
  /** Valor de progreso entre 0 y 1 */
  progress: number;
  /** Indica si el logro está completado */
  isCompleted: boolean;
  /** Función a ejecutar cuando se presiona la tarjeta */
  onPress?: () => void;
  /** Estilos adicionales para la tarjeta */
  style?: object;
}

/**
 * @component AchievementCard
 * @description Componente de tarjeta de logro con animaciones y efectos visuales
 */
const AchievementCard: React.FC<AchievementCardProps> = ({
  title,
  description,
  icon,
  progress,
  isCompleted,
  onPress,
  style,
}) => {
  // Referencias para las animaciones
  const scaleAnim = React.useRef(new Animated.Value(1)).current;    // Controla el escalado de la tarjeta
  const progressAnim = React.useRef(new Animated.Value(0)).current; // Controla la animación de la barra de progreso
  const rotateAnim = React.useRef(new Animated.Value(0)).current;   // Controla la rotación del efecto de brillo
  const opacityAnim = React.useRef(new Animated.Value(0)).current;  // Controla la opacidad del efecto de completado

  /**
   * Efecto para animar la barra de progreso cuando cambia su valor
   */
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 1000,
      easing: Easing.out(Easing.cubic), // Efecto de desaceleración suave
      useNativeDriver: false, // No se puede usar native driver para cambios de ancho
    }).start();
  }, [progress, progressAnim]);

  /**
   * Efecto para animar cuando se completa un logro
   * Aplica una secuencia de animaciones para celebrar
   */
  useEffect(() => {
    if (isCompleted) {
      // Secuencia de animaciones para celebrar el logro completado
      Animated.sequence([
        // Aumenta ligeramente el tamaño con efecto de rebote
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 300,
          easing: Easing.bounce,
          useNativeDriver: true,
        }),
        // Vuelve al tamaño normal
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        // Muestra gradualmente la insignia de completado
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();

      // Animación de rotación continua para el efecto de brillo
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [isCompleted, scaleAnim, rotateAnim, opacityAnim]);

  /**
   * Maneja el evento cuando se presiona la tarjeta
   * Reduce ligeramente el tamaño para dar feedback táctil
   */
  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.95, // Reduce ligeramente el tamaño
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  /**
   * Maneja el evento cuando se suelta la tarjeta
   * Restaura el tamaño original
   */
  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1, // Vuelve al tamaño original
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  // Interpolaciones para las animaciones
  
  /**
   * Interpolación para el ancho de la barra de progreso
   * Convierte el valor de progreso (0-1) en un porcentaje (0%-100%)
   */
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  /**
   * Interpolación para la rotación del efecto de brillo
   * Gira 360 grados para crear un efecto visual atractivo
   */
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  /**
   * Estilos para las sombras según la plataforma
   * Mejora la apariencia visual y destaca los logros completados
   */
  const shadowStyle = Platform.select({
    ios: {
      shadowColor: isCompleted ? Colors.blue : Colors.darkGray,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isCompleted ? 0.5 : 0.3, // Sombra más intensa para logros completados
      shadowRadius: isCompleted ? 8 : 4,      // Radio mayor para logros completados
    },
    android: {
      elevation: isCompleted ? 8 : 4, // Elevación mayor para logros completados
    },
  });

  /**
   * Renderizado del componente
   */
  return (
    <TouchableOpacity
      activeOpacity={0.9} // Reduce ligeramente la opacidad al presionar
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      {/* Contenedor principal con animaciones */}
      <Animated.View
        style={[
          styles.container,
          shadowStyle, // Sombras específicas según plataforma
          {
            transform: [{ scale: scaleAnim }], // Animación de escala
            borderColor: isCompleted ? Colors.brown : Colors.gray, // Borde destacado para completados
            borderWidth: isCompleted ? 2 : 1.5, // Borde más grueso para completados
          },
          style, // Estilos personalizados pasados como prop
        ]}
      >
        {/* Contenido principal de la tarjeta */}
        <View style={styles.content}>
          {/* Contenedor del icono */}
          <View style={styles.iconContainer}>
            {/* Efecto de brillo rotatorio para logros completados */}
            {isCompleted && (
              <Animated.View
                style={[
                  styles.completedEffect,
                  {
                    opacity: opacityAnim, // Aparición gradual
                    transform: [{ rotate }], // Rotación continua
                  },
                ]}
              />
            )}
            {/* Icono del logro */}
            <Image
              source={icon}
              style={[
                styles.icon,
                { tintColor: isCompleted ? Colors.blue : Colors.darkGray }, // Color destacado para completados
              ]}
            />
          </View>
          
          {/* Contenedor de información textual */}
          <View style={styles.textContainer}>
            {/* Título del logro */}
            <Text style={styles.title}>{title}</Text>
            
            {/* Descripción del logro */}
            <Text style={styles.description}>{description}</Text>
            
            {/* Barra de progreso animada */}
            <View style={styles.progressContainer}>
              <Animated.View
                style={[
                  styles.progressBar,
                  {
                    width: progressWidth, // Ancho animado según progreso
                    backgroundColor: isCompleted ? Colors.blue : Colors.darkBlue, // Color destacado para completados
                  },
                ]}
              />
              {/* Porcentaje de progreso */}
              <Text style={styles.progressText}>
                {Math.round(progress * 100)}%
              </Text>
            </View>
          </View>
        </View>
        
        {/* Insignia de completado */}
        {isCompleted && (
          <View style={styles.completedBadge}>
            <Text style={styles.completedText}>¡Completado!</Text>
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

/**
 * Estilos del componente
 */
const styles = StyleSheet.create({
  // Contenedor principal de la tarjeta
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.light,
    borderRadius: 15,
    padding: 15,
    marginBottom: 25, // Espacio entre tarjetas
    ...Platform.select({ // Sombras específicas por plataforma
      ios: {
        shadowColor: Colors.brown,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
    borderWidth: 1.5,
    borderColor: Colors.gray,
  },
  
  // Contenedor del contenido principal
  content: {
    flexDirection: 'row',
    padding: 15,
  },
  
  // Contenedor circular para el icono del logro
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30, // Forma circular
    backgroundColor: Colors.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 2,
    borderColor: Colors.yellow, // Borde amarillo para destacar
    ...Platform.select({
      ios: {
        shadowColor: Colors.brown,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  
  // Estilo para el icono dentro del contenedor
  icon: {
    width: 35,
    height: 35,
    resizeMode: 'contain', // Mantiene la proporción del icono
  },
  
  // Efecto visual que aparece alrededor del icono cuando está completado
  completedEffect: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35, // Forma circular
    borderWidth: 2,
    borderColor: Colors.blue,
    borderStyle: 'dashed', // Borde discontinuo para efecto visual
  },
  
  // Contenedor para el texto (título, descripción, progreso)
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  
  // Estilo para el título del logro
  title: {
    fontFamily: Fonts.nunitoBold,
    fontSize: 16,
    color: Colors.dark,
    marginBottom: 4,
  },
  
  // Estilo para la descripción del logro
  description: {
    fontFamily: Fonts.nunito,
    fontSize: 14,
    color: Colors.textGray,
    marginBottom: 8,
  },
  
  // Contenedor para la barra de progreso
  progressContainer: {
    height: 12,
    backgroundColor: Colors.lightGray,
    borderRadius: 6,
    overflow: 'hidden', // Oculta el contenido que sobresale
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: Colors.gray,
    ...Platform.select({
      ios: {
        shadowColor: Colors.dark,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  
  // Barra de progreso animada
  progressBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: Colors.blue,
    borderRadius: 5,
  },
  
  // Estilo especial para la barra de progreso cuando está completado
  completedProgressBar: {
    backgroundColor: Colors.brown, // Cambia a marrón cuando está completado
  },
  
  // Texto que muestra el porcentaje de progreso
  progressText: {
    fontFamily: Fonts.nunitoBold,
    fontSize: 10,
    color: Colors.dark,
    position: 'absolute',
    right: 5, // Alineado a la derecha
  },
  
  // Insignia pequeña que indica que el logro está completado
  completedBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    width: 24,
    height: 24,
    borderRadius: 12, // Forma circular
    backgroundColor: Colors.blue,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.light, // Borde blanco para destacar
  },
  
  // Texto dentro de la insignia de completado
  completedText: {
    fontFamily: Fonts.nunitoBold,
    fontSize: 10,
    color: Colors.light, // Texto blanco para contraste
    textShadowColor: 'rgba(0, 0, 0, 0.3)', // Sombra sutil para legibilidad
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
});

export default AchievementCard;