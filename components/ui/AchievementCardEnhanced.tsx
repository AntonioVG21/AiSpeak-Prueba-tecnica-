/**
 * @file AchievementCardEnhanced.tsx
 * @description Componente mejorado para mostrar tarjetas de logros con animaciones
 * y efectos visuales avanzados. Incluye soporte para puntos, animaciones de celebración
 * y efectos visuales para mejorar la experiencia del usuario.
 */

/**
 * Componente AchievementCardEnhanced
 * 
 * Tarjeta de logro mejorada con animaciones y efectos visuales
 * para mostrar el progreso y celebrar cuando se completa un logro.
 */
import React, { useRef, useEffect, memo, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { Colors } from '../../constants/Colors';
import Fonts from '../../constants/Fonts';

/**
 * @interface AchievementCardProps
 * @description Propiedades para el componente AchievementCardEnhanced
 */
interface AchievementCardProps {
  title: string;                // Título del logro
  description: string;         // Descripción detallada del logro
  icon: any;                   // Icono representativo del logro
  progress: number;            // Progreso actual (0-1)
  isCompleted: boolean;        // Indica si el logro está completado
  points?: number;             // Puntos que otorga el logro
  onPress?: () => void;        // Función a ejecutar al presionar la tarjeta
  style?: object;              // Estilos adicionales para la tarjeta
}

/**
 * @component AchievementCardEnhanced
 * @description Componente de tarjeta de logro mejorado con animaciones y efectos visuales
 * Optimizado con memo para evitar renderizados innecesarios
 */
const AchievementCardEnhanced: React.FC<AchievementCardProps> = memo((
  {
    title,
    description,
    icon,
    progress,
    isCompleted,
    points = 0,
    onPress,
    style,
  }
) => {
  // Referencias para las diferentes animaciones utilizadas en el componente
  const scaleAnim = useRef(new Animated.Value(1)).current;       // Controla el escalado de la tarjeta
  const rotateAnim = useRef(new Animated.Value(0)).current;      // Controla la rotación de la tarjeta
  const progressAnim = useRef(new Animated.Value(0)).current;    // Controla la animación de la barra de progreso
  const opacityAnim = useRef(new Animated.Value(isCompleted ? 1 : 0.7)).current; // Controla la opacidad
  const sparkleAnim = useRef(new Animated.Value(0)).current;     // Controla el efecto de brillo
  const bounceAnim = useRef(new Animated.Value(0)).current;      // Controla el efecto de rebote del icono
  const shakeAnim = useRef(new Animated.Value(0)).current;       // Controla el efecto de sacudida

  /**
   * Efecto para animar el progreso y aplicar efectos de celebración cuando cambia
   * o cuando un logro se completa
   * Optimizado para mejor rendimiento con duraciones reducidas
   */
  useEffect(() => {
    // Anima la barra de progreso suavemente
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 500, // Reducimos la duración para mejor rendimiento
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false, // El width no puede usar native driver
    }).start();

    // Efectos especiales cuando el logro está completado
    if (isCompleted) {
      // Secuencia de animaciones para celebrar el logro
      Animated.sequence([
        // Efecto de pulso: escala hacia arriba
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 200, // Aumentamos ligeramente la duración para mejor visibilidad
          useNativeDriver: true,
        }),
        // Vuelve al tamaño normal
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200, // Aumentamos ligeramente la duración para mejor visibilidad
          useNativeDriver: true,
        }),
      ]).start();

      // Efecto de rotación suave
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 300, // Aumentamos la duración para mejor visibilidad
        useNativeDriver: true,
      }).start(() => {
        rotateAnim.setValue(0); // Reinicia para futuras animaciones
      });

      // Ajusta la opacidad a completa
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300, // Aumentamos la duración para mejor visibilidad
        useNativeDriver: true,
      }).start();

      // Efecto de brillo pulsante continuo para logros completados
      const startSparkleAnimation = () => {
        Animated.sequence([
          Animated.timing(sparkleAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(sparkleAnim, {
            toValue: 0.3, // No bajamos completamente a 0 para mantener algo de brillo
            duration: 1000,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // Cuando termina la animación, la reiniciamos para crear un efecto continuo
          startSparkleAnimation();
        });
      };
      
      // Iniciamos la animación de brillo continuo
      startSparkleAnimation();

      // Efecto de rebote para el icono con repetición para logros completados
      const startBounceAnimation = () => {
        Animated.sequence([
          // Movimiento hacia arriba con efecto de rebote
          Animated.timing(bounceAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.bounce,
            useNativeDriver: true,
          }),
          // Pausa antes de volver a bajar
          Animated.delay(1000),
          // Movimiento hacia abajo con efecto de rebote
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 800,
            easing: Easing.bounce,
            useNativeDriver: true,
          }),
          // Pausa antes de reiniciar
          Animated.delay(2000),
        ]).start(() => {
          // Cuando termina la animación, la reiniciamos para crear un efecto periódico
          startBounceAnimation();
        });
      };
      
      // Iniciamos la animación de rebote periódica
      startBounceAnimation();
    }
  }, [progress, isCompleted]); // Reducimos las dependencias para evitar re-ejecuciones innecesarias

  /**
   * Manejador del evento cuando se presiona la tarjeta
   * Aplica efectos visuales de feedback táctil
   * Optimizado con useCallback para evitar recreaciones innecesarias
   */
  const handlePressIn = useCallback(() => {
    // Efecto de presión: reduce ligeramente el tamaño
    Animated.timing(scaleAnim, {
      toValue: 0.98, // Reducimos el efecto de escala para mantener más la forma
      duration: 50, // Reducimos la duración para mejor rendimiento
      useNativeDriver: true,
    }).start();

    // Efecto de sacudida solo para logros no completados
    if (!isCompleted) {
      Animated.sequence([
        // Sacudida hacia la derecha (reducida)
        Animated.timing(shakeAnim, {
          toValue: 2, // Reducimos la intensidad de la sacudida
          duration: 50, // Reducimos la duración para mejor rendimiento
          useNativeDriver: true,
        }),
        // Sacudida hacia la izquierda (reducida)
        Animated.timing(shakeAnim, {
          toValue: -2, // Reducimos la intensidad de la sacudida
          duration: 50, // Reducimos la duración para mejor rendimiento
          useNativeDriver: true,
        }),
        // Vuelve a la posición original
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 50, // Reducimos la duración para mejor rendimiento
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [scaleAnim, shakeAnim, isCompleted]);

  /**
   * Manejador del evento cuando se suelta la tarjeta
   * Restaura el estado visual normal
   * Optimizado con useCallback para evitar recreaciones innecesarias
   */
  const handlePressOut = useCallback(() => {
    // Restaura el tamaño original
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 50, // Reducimos la duración para mejor rendimiento
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  // Configuración de interpolaciones para las animaciones (memorizadas para evitar recálculos)
  const progressWidth = useMemo(() => {
    return progressAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
    });
  }, [progressAnim]);

  // Controla la rotación de la tarjeta (efecto sutil)
  const rotate = useMemo(() => {
    return rotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '0deg'], // Eliminamos la rotación para mantener el cajón recto
    });
  }, [rotateAnim]);

  // Controla la opacidad del efecto de brillo
  const sparkleOpacity = useMemo(() => {
    return sparkleAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.3, 0.9, 0.3], // Efecto pulsante de opacidad más visible
      extrapolate: 'clamp',
    });
  }, [sparkleAnim]);

  // Controla el movimiento vertical del icono (efecto de rebote)
  const iconTranslateY = useMemo(() => {
    return bounceAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, -5, -6], // Reducimos el movimiento vertical para que sea menos pronunciado
      extrapolate: 'clamp',
    });
  }, [bounceAnim]);

  /**
   * Renderizado del componente
   */
  return (
    <TouchableOpacity
      activeOpacity={0.9} // Reduce ligeramente la opacidad al presionar
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isCompleted} // Deshabilita la interacción si ya está completado
    >
      {/* Contenedor principal con animaciones */}
      <Animated.View
        style={[
          styles.container,
          {
            opacity: opacityAnim,
            transform: [
              { scale: scaleAnim },    // Efecto de escala
              // Mantenemos el efecto de rotación pero con valor 0 para que no afecte
              { rotate },              
              // Reducimos el efecto de sacudida horizontal para mantener el cajón más recto
              { translateX: shakeAnim }, 
            ],
          },
          isCompleted && styles.completedContainer, // Estilo especial para logros completados
          style, // Estilos personalizados pasados como prop
        ]}
      >
        {/* Contenedor del icono con animación de rebote */}
        <Animated.View 
          style={[
            styles.iconContainer,
            { transform: [{ translateY: iconTranslateY }] }
          ]}
        >
          {/* Icono del logro - optimizado con propiedades de caché */}
          <Image 
            source={icon} 
            style={styles.icon}
            resizeMode="contain"
            fadeDuration={0} // Elimina la animación de fade para cargar más rápido
            // Propiedades para optimizar el rendimiento
            progressiveRenderingEnabled={true}
            // Propiedades adicionales para optimizar el rendimiento
            cachePolicy="memory-disk"
          />
          
          {/* Efecto de brillo para logros completados */}
          {isCompleted && (
            <Animated.View
              style={[
                styles.sparkleOverlay,
                { opacity: sparkleOpacity },
              ]}
            />
          )}
          
          {/* Insignia de completado */}
          {isCompleted && (
            <View style={styles.completedBadge}>
              <Text style={styles.completedBadgeText}>✓</Text>
            </View>
          )}
        </Animated.View>

        {/* Contenedor del contenido textual */}
        <View style={styles.contentContainer}>
          {/* Fila superior con título y puntos */}
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            {/* Muestra los puntos solo si son mayores que cero */}
            {points > 0 && (
              <View style={styles.pointsContainer}>
                <Text style={styles.pointsText}>{points} pts</Text>
              </View>
            )}
          </View>
          
          {/* Descripción del logro */}
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>

          {/* Barra de progreso animada */}
          <View style={styles.progressBarContainer}>
            <Animated.View
              style={[
                styles.progressBar,
                { width: progressWidth }, // Ancho animado según el progreso
                isCompleted && styles.completedProgressBar, // Estilo especial si está completado
              ]}
            />
            {/* Porcentaje de progreso */}
            <Text style={styles.progressText}>
              {Math.round(progress * 100)}%
            </Text>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
});

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
        shadowOffset: { width: 0, height: 2 }, // Sombra más uniforme
        shadowOpacity: 0.2,
        shadowRadius: 4, // Sombra más suave
      },
      android: {
        elevation: 3,
      },
    }),
    borderWidth: 1,
    borderColor: Colors.gray,
    // Aseguramos que el contenedor se mantenga recto
    transform: [{ perspective: 1000 }], // Ayuda a mantener la perspectiva correcta
  },
  
  // Estilo adicional para tarjetas de logros completados
  completedContainer: {
    borderColor: Colors.brown,
    borderWidth: 2, // Borde más grueso para destacar
    backgroundColor: '#FFF9E6', // Fondo ligeramente amarillento para logros completados
    ...Platform.select({
      ios: {
        shadowColor: Colors.brown,
        shadowOpacity: 0.4, // Sombra más intensa pero no excesiva
        shadowOffset: { width: 0, height: 2 }, // Sombra más uniforme
        shadowRadius: 5, // Ajustamos para que sea más uniforme
      },
      android: {
        elevation: 5, // Elevación ajustada para ser más uniforme
      },
    }),
    // Aseguramos que el contenedor se mantenga recto
    transform: [{ perspective: 1000 }], // Ayuda a mantener la perspectiva correcta
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
        shadowOffset: { width: 0, height: 1 }, // Sombra más uniforme
        shadowOpacity: 0.2,
        shadowRadius: 2, // Sombra más suave
      },
      android: {
        elevation: 2,
      },
    }),
    // Aseguramos que el contenedor del icono se mantenga recto
    transform: [{ perspective: 1000 }], // Ayuda a mantener la perspectiva correcta
  },
  
  // Estilo para el icono dentro del contenedor
  icon: {
    width: 50,
    height: 50,
    borderRadius: 25, // Forma circular
  },
  
  // Efecto de brillo que se muestra sobre el icono cuando está completado
  sparkleOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 30,
    backgroundColor: Colors.yellow, // Color amarillo para el brillo
    opacity: 0.7, // Hacemos el brillo más visible
  },
  
  // Insignia pequeña que indica que el logro está completado
  completedBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    width: 28, // Aumentamos ligeramente el tamaño
    height: 28, // Aumentamos ligeramente el tamaño
    borderRadius: 14, // Forma circular
    backgroundColor: Colors.blue,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.light, // Borde blanco para destacar
    ...Platform.select({ // Añadimos sombra para destacar más
      ios: {
        shadowColor: Colors.dark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  
  // Texto dentro de la insignia de completado
  completedBadgeText: {
    color: Colors.light,
    fontSize: 16, // Aumentamos el tamaño para mejor visibilidad
    fontFamily: Fonts.nunitoBold,
    textShadowColor: 'rgba(0, 0, 0, 0.3)', // Añadimos sombra para mejor contraste
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  
  // Contenedor para el contenido textual (título, descripción, progreso)
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  
  // Fila que contiene el título y los puntos
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  
  // Estilo para el título del logro
  title: {
    fontFamily: Fonts.nunitoBold,
    fontSize: 16,
    color: Colors.dark,
    flex: 1, // Permite que ocupe el espacio disponible
    textShadowColor: 'rgba(255, 255, 255, 0.8)', // Sombra de texto para legibilidad
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  
  // Contenedor para mostrar los puntos del logro
  pointsContainer: {
    backgroundColor: Colors.blue,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 5,
    borderWidth: 1,
    borderColor: '#0056a8', // Azul más oscuro para el borde
  },
  
  // Texto que muestra los puntos
  pointsText: {
    fontFamily: Fonts.nunitoBold,
    fontSize: 12,
    color: Colors.light, // Texto blanco para contraste
  },
  
  // Estilo para la descripción del logro
  description: {
    fontFamily: Fonts.nunito,
    fontSize: 14,
    color: Colors.textGray,
    marginBottom: 10,
    textShadowColor: 'rgba(255, 255, 255, 0.5)', // Sombra sutil para legibilidad
    textShadowOffset: { width: 0, height: 0.5 },
    textShadowRadius: 0.5,
  },
  
  // Contenedor para la barra de progreso
  progressBarContainer: {
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
    borderWidth: 1,
    borderColor: '#8B4513', // Borde más oscuro para destacar
    ...Platform.select({
      ios: {
        shadowColor: Colors.brown,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  
  // Texto que muestra el porcentaje de progreso
  progressText: {
    position: 'absolute',
    right: 5, // Alineado a la derecha
    fontSize: 11, // Ligeramente más grande
    fontFamily: Fonts.nunitoBold,
    color: Colors.dark,
    textShadowColor: 'rgba(255, 255, 255, 0.8)', // Sombra de texto para mejor legibilidad
    textShadowOffset: { width: 0, height: 0.5 },
    textShadowRadius: 1,
  },
});

export default AchievementCardEnhanced;