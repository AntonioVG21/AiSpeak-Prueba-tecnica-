/**
 * @fileoverview Panel de logros que muestra los logros del usuario organizados por categorías,
 * con animaciones de entrada, filtrado por categorías, y estadísticas generales.
 * 
 * Este componente proporciona una interfaz interactiva para visualizar el progreso
 * del usuario en diferentes categorías de logros, con efectos visuales atractivos
 * y animaciones fluidas para mejorar la experiencia del usuario.
 */

import React, { useState, useEffect, useRef, memo, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
  Image,
  Easing,
} from 'react-native';
import { Colors } from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import AchievementCardEnhanced from './AchievementCardEnhanced';

// Importamos imágenes para usar como iconos de logros
// Optimizamos las importaciones para mejorar el rendimiento
import CapybaraFront from '../../assets/images/capybara-front.png';
import CapybaraProfile from '../../assets/images/capybara-profile1.png';
import CapybaraGafas from '../../assets/images/capybara-gafas.jpg';
import CapybaraGorro from '../../assets/images/capybara-gorro.jpg';
import CapybaraSombrero from '../../assets/images/capybara-sombrero.jpg';
import CapybaraVerano from '../../assets/images/capybara-verano.jpg';

// Componente optimizado para imágenes de logros
const OptimizedImage = memo(({ source, style }) => (
  <Image 
    source={source} 
    style={style}
    resizeMode="cover"
    fadeDuration={0}
    progressiveRenderingEnabled={true}
  />
));

/**
 * @interface Achievement
 * @description Define la estructura de un logro en la aplicación
 */
interface Achievement {
  /** Identificador único del logro */
  id: string;
  /** Título descriptivo del logro */
  title: string;
  /** Descripción detallada del logro y cómo completarlo */
  description: string;
  /** Referencia al icono que representa visualmente el logro */
  icon: any;
  /** Valor numérico entre 0 y 1 que representa el progreso actual */
  progress: number;
  /** Indica si el logro ha sido completado */
  isCompleted: boolean;
  /** Categoría a la que pertenece el logro */
  category: string;
  /** Cantidad de puntos que otorga al completarse */
  points: number;
}

/**
 * @interface AchievementsPanelProps
 * @description Define las propiedades del componente AchievementsPanel
 */
interface AchievementsPanelProps {
  /** Función opcional que se ejecuta al cerrar el panel */
  onClose?: () => void;
  /** Estilos adicionales para personalizar la apariencia del panel */
  style?: object;
}

/**
 * @component AchievementsPanel
 * @description Componente que muestra los logros del usuario organizados por categorías,
 * con animaciones de entrada, filtrado por categorías y estadísticas generales.
 * Permite al usuario visualizar su progreso y filtrar logros por diferentes criterios.
 * Optimizado con memo para evitar renderizados innecesarios.
 */
const AchievementsPanel: React.FC<AchievementsPanelProps> = memo(({ onClose, style }) => {
  /** 
   * Estado para los logros (datos simulados para demostración)
   * En una implementación real, estos datos vendrían de una API o base de datos
   */
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'Primer Día',
      description: 'Completa tu primer día de aprendizaje',
      icon: CapybaraFront,
      progress: 1,
      isCompleted: true,
      category: 'básico',
      points: 10,
    },
    {
      id: '2',
      title: 'Racha de 7 días',
      description: 'Mantén una racha de aprendizaje de 7 días',
      icon: CapybaraProfile,
      progress: 0.7,
      isCompleted: false,
      category: 'constancia',
      points: 50,
    },
    {
      id: '3',
      title: 'Vocabulario Experto',
      description: 'Aprende 100 palabras nuevas',
      icon: CapybaraGafas,
      progress: 0.45,
      isCompleted: false,
      category: 'vocabulario',
      points: 100,
    },
    {
      id: '4',
      title: 'Maestro Conversador',
      description: 'Completa 20 conversaciones prácticas',
      icon: CapybaraGorro,
      progress: 0.9,
      isCompleted: false,
      category: 'conversación',
      points: 150,
    },
    {
      id: '5',
      title: 'Gramática Perfecta',
      description: 'Obtén 10 puntuaciones perfectas en ejercicios de gramática',
      icon: CapybaraSombrero,
      progress: 0.3,
      isCompleted: false,
      category: 'gramática',
      points: 200,
    },
    {
      id: '6',
      title: 'Explorador Cultural',
      description: 'Completa todas las lecciones culturales del nivel básico',
      icon: CapybaraVerano,
      progress: 1,
      isCompleted: true,
      category: 'cultura',
      points: 250,
    },
  ]);

  /** Estado que controla el filtro de categoría actualmente seleccionado */
  const [activeFilter, setActiveFilter] = useState('todos');
  
  /** Estado que almacena la suma total de puntos de los logros completados */
  const [totalPoints, setTotalPoints] = useState(0);

  /** 
   * Referencias a valores de animación
   * Estas referencias persisten entre renderizados y controlan las animaciones del componente
   */
  /** Controla la animación de deslizamiento vertical del panel */
  const slideAnim = useRef(new Animated.Value(0)).current;
  /** Controla la animación de opacidad (fade in/out) del panel */
  const fadeAnim = useRef(new Animated.Value(0)).current;
  /** Controla la animación del contador de puntos */
  const progressAnim = useRef(new Animated.Value(0)).current;

  /**
   * Efecto para calcular y animar los puntos totales
   * Se ejecuta cuando cambia el array de logros
   * Optimizado para mejor rendimiento
   */
  useEffect(() => {
    // Filtra los logros completados y calcula los puntos en una sola iteración
    // para mejorar el rendimiento
    let points = 0;
    for (let i = 0; i < achievements.length; i++) {
      if (achievements[i].isCompleted) {
        points += achievements[i].points;
      }
    }
    
    // Anima el contador de puntos con una transición suave
    Animated.timing(progressAnim, {
      toValue: points,
      duration: 800, // Duración reducida para mejor rendimiento
      useNativeDriver: false, // No puede usar el driver nativo porque anima un valor numérico
    }).start();
    
    // Actualiza el estado con el nuevo total de puntos
    setTotalPoints(points);
  }, [achievements]); // Eliminamos progressAnim de las dependencias para evitar re-ejecuciones

  /**
   * Efecto para animar la entrada del panel
   * Crea una secuencia de animaciones para una entrada más dinámica y atractiva
   * Se ejecuta una vez al montar el componente
   * Optimizado para mejor rendimiento
   */
  useEffect(() => {
    // Secuencia de animaciones para una entrada más dinámica
    Animated.sequence([
      // Primero aparece con fade in (aumenta gradualmente la opacidad)
      Animated.timing(fadeAnim, {
        toValue: 1, // Valor final de opacidad (totalmente visible)
        duration: 250, // Duración reducida para mejor rendimiento
        useNativeDriver: true, // Usa el driver nativo para mejor rendimiento
      }),
      // Luego se desliza hacia arriba con un efecto de rebote suave
      Animated.spring(slideAnim, {
        toValue: 1, // Valor final de la posición (posición original)
        friction: 8, // Controla la resistencia del rebote (mayor valor = menos rebote)
        tension: 40, // Controla la velocidad de la animación (mayor valor = más rápido)
        useNativeDriver: true, // Usa el driver nativo para mejor rendimiento
      }),
    ]).start();

    // Anima el contador de puntos con un efecto de rebote para hacerlo más dinámico
    Animated.timing(progressAnim, {
      toValue: totalPoints, // Anima hasta el valor actual de puntos totales
      duration: 1000, // Duración reducida para mejor rendimiento
      easing: Easing.out(Easing.bounce), // Efecto de rebote al final de la animación
      useNativeDriver: false, // No puede usar el driver nativo porque anima un valor numérico
    }).start();
    // Eliminamos dependencias innecesarias para evitar re-ejecuciones
  }, [totalPoints]);

  /**
   * Filtra los logros según la categoría seleccionada en el estado activeFilter
   * Aplica diferentes criterios de filtrado según el valor del filtro activo
   * Memorizado para evitar recálculos innecesarios
   */
  const filteredAchievements = useMemo(() => {
    return achievements.filter(achievement => {
      if (activeFilter === 'todos') return true; // Muestra todos los logros
      if (activeFilter === 'completados') return achievement.isCompleted; // Solo muestra completados
      if (activeFilter === 'pendientes') return !achievement.isCompleted; // Solo muestra pendientes
      return achievement.category === activeFilter; // Filtra por categoría específica
    });
  }, [achievements, activeFilter]); // Solo recalcula cuando cambian los logros o el filtro

  /** Lista de categorías disponibles para filtrar los logros
   * Incluye filtros especiales (todos, completados, pendientes) y categorías específicas
   * Memorizado para evitar recreaciones innecesarias
   */
  const categories = useMemo(() => [
    { id: 'todos', name: 'Todos' },
    { id: 'completados', name: 'Completados' },
    { id: 'pendientes', name: 'Pendientes' },
    { id: 'básico', name: 'Básicos' },
    { id: 'constancia', name: 'Constancia' },
    { id: 'vocabulario', name: 'Vocabulario' },
    { id: 'conversación', name: 'Conversación' },
    { id: 'gramática', name: 'Gramática' },
    { id: 'cultura', name: 'Cultura' },
  ], []); // Array vacío porque las categorías son estáticas

  /**
   * Función para manejar la pulsación en un logro
   * Simula la actualización del progreso y la detección de completado
   * En una implementación real, esto podría conectarse a una API
   * @param id - Identificador único del logro que se ha pulsado
   * Optimizada con useCallback para evitar recreaciones innecesarias
   */
  const handleAchievementPress = useCallback((id: string) => {
    setAchievements(prevAchievements => {
      return prevAchievements.map(achievement => {
        if (achievement.id === id) {
          // Si ya está completado, no hacemos cambios
          if (achievement.isCompleted) return achievement;
          
          // Incrementamos el progreso en un 20% cada vez que se pulsa
          let newProgress = achievement.progress + 0.2;
          
          // Verificamos si el logro se ha completado con este incremento
          if (newProgress >= 1) {
            newProgress = 1; // Aseguramos que no supere el 100%
            return {
              ...achievement,
              progress: newProgress,
              isCompleted: true // Marcamos como completado
            };
          }
          
          // Si no está completado, solo actualizamos el progreso
          return {
            ...achievement,
            progress: newProgress
          };
        }
        return achievement; // Devolvemos sin cambios los demás logros
      });
    });
  }, []);

  /**
   * Interpolaciones para las animaciones
   * Transforman los valores de animación en propiedades visuales específicas
   * Memorizadas para evitar recálculos innecesarios
   */
  
  /** 
   * Interpolación para la animación de deslizamiento vertical
   * Transforma el valor de slideAnim (0-1) en una posición vertical (100-0)
   */
  const translateY = useMemo(() => {
    return slideAnim.interpolate({
      inputRange: [0, 1], // Rango de entrada de la animación
      outputRange: [100, 0], // Rango de salida en píxeles (de 100px abajo a 0px)
    });
  }, [slideAnim]);
  
  /** 
   * Interpolación para la animación de escala
   * Transforma el valor de slideAnim (0-1) en una escala (0.9-1)
   * con un punto intermedio para crear un efecto más dinámico
   */
  const scale = useMemo(() => {
    return slideAnim.interpolate({
      inputRange: [0, 0.5, 1], // Rango de entrada con punto intermedio
      outputRange: [0.9, 0.95, 1], // Rango de salida con valor intermedio
    });
  }, [slideAnim]);

  /** 
   * Interpolación para la animación del contador de puntos
   * Transforma el valor de progressAnim en el número actual de puntos
   */
  const animatedPoints = useMemo(() => {
    return progressAnim.interpolate({
      inputRange: [0, totalPoints], // Rango desde 0 hasta el total de puntos
      outputRange: [0, totalPoints], // Rango de salida igual al de entrada
    });
  }, [progressAnim, totalPoints]); // Recalcula cuando cambia totalPoints

  return (
    <Animated.View
      style={[
        styles.container, 
        {
          opacity: fadeAnim, // Animación de opacidad (fade in/out)
          transform: [
            { translateY }, // Animación de deslizamiento vertical
            { scale }, // Animación de escala
          ],
        }, 
        style, // Estilos personalizados pasados como prop
      ]}
    >
      {/* Encabezado del panel con título y botón de cierre */}
      <View style={styles.header}>
        <Text style={styles.title}>Mis Logros</Text>
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={onClose} // Ejecuta la función onClose pasada como prop
          accessibilityLabel="Cerrar panel de logros"
        >
          <Text style={styles.closeButtonText}>×</Text>
        </TouchableOpacity>
      </View>

      {/* Sección de estadísticas con información resumida de logros */}
      <View style={styles.statsContainer}>
        {/* Estadística: Logros completados */}
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Completados</Text>
          <Text style={styles.statValue}>
            {/* Muestra la fracción de logros completados */}
            {achievements.filter(a => a.isCompleted).length}/{achievements.length}
          </Text>
        </View>
        
        {/* Estadística: Puntos totales con animación */}
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Puntos</Text>
          <Animated.Text style={styles.statValue}>
            {/* Interpolación para animar el contador de puntos */}
            {animatedPoints.interpolate({
              inputRange: [0, totalPoints],
              // Convierte los valores numéricos a strings para mostrarlos
              outputRange: [0, totalPoints].map(v => Math.round(v).toString()),
            })}
          </Animated.Text>
        </View>
        
        {/* Estadística: Nivel calculado a partir de los puntos */}
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Nivel</Text>
          <Text style={styles.statValue}>
            {/* Calcula el nivel dividiendo los puntos entre 100 y sumando 1 */}
            {Math.floor(totalPoints / 100) + 1}
          </Text>
        </View>
      </View>

      {/* Barra de filtros horizontal con scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false} // Oculta la barra de scroll horizontal
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
        accessibilityLabel="Filtros de categorías de logros"
      >
        {/* Mapea todas las categorías disponibles para crear botones de filtro */}
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.filterButton,
              // Aplica estilo adicional si este filtro está activo
              activeFilter === category.id && styles.activeFilterButton,
            ]}
            onPress={() => setActiveFilter(category.id)} // Actualiza el filtro activo
            accessibilityLabel={`Filtrar por ${category.name}`}
            accessibilityState={{ selected: activeFilter === category.id }}
          >
            <Text
              style={[
                styles.filterText,
                // Aplica estilo adicional al texto si este filtro está activo
                activeFilter === category.id && styles.activeFilterText,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Contenedor principal de la lista de logros con scroll vertical */}
      <ScrollView
        showsVerticalScrollIndicator={false} // Oculta la barra de scroll vertical
        style={styles.achievementsContainer}
        contentContainerStyle={styles.achievementsContent}
        accessibilityLabel="Lista de logros"
      >
        {/* Renderizado condicional: muestra logros o mensaje de vacío */}
        {filteredAchievements.length > 0 ? (
          // Mapea los logros filtrados para mostrarlos
          filteredAchievements.map((achievement, index) => (
            <Animated.View
              key={achievement.id}
              style={{
                opacity: fadeAnim, // Animación de opacidad
                // Animación de entrada escalonada según el índice del logro
                transform: [{ 
                  translateY: Animated.multiply(
                    fadeAnim, 
                    Animated.add(0, Animated.multiply(-20, new Animated.Value(index)))
                  ) 
                }],
              }}
            >
              {/* Componente de tarjeta de logro mejorada */}
              <AchievementCardEnhanced
                key={achievement.id}
                title={achievement.title}
                description={achievement.description}
                icon={achievement.icon}
                progress={achievement.progress}
                isCompleted={achievement.isCompleted}
                points={achievement.points}
                onPress={() => handleAchievementPress(achievement.id)} // Maneja la pulsación
              />
            </Animated.View>
          ))
        ) : (
          // Mensaje cuando no hay logros que mostrar en la categoría seleccionada
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No hay logros en esta categoría
            </Text>
          </View>
        )}
      </ScrollView>
    </Animated.View>
  );
});

/**
 * Estilos del componente AchievementsPanel
 * Define la apariencia visual de todos los elementos del panel de logros
 */
const styles = StyleSheet.create({
  /**
   * Estilo del contenedor principal del panel
   * Establece el fondo, bordes redondeados y sombras específicas por plataforma
   */
  container: {
    backgroundColor: Colors.yellow, // Fondo amarillo para un aspecto alegre
    borderRadius: 20, // Bordes muy redondeados para un aspecto amigable
    overflow: 'hidden', // Evita que el contenido sobresalga de los bordes redondeados
    borderWidth: 1, // Borde fino para definir los límites
    borderColor: Colors.brown, // Color marrón para el borde que combina con el amarillo
    // Sombras específicas según la plataforma para dar profundidad
    ...Platform.select({
      ios: {
        shadowColor: Colors.dark,
        shadowOffset: { width: 0, height: 5 }, // Sombra hacia abajo
        shadowOpacity: 0.3, // Sombra semi-transparente
        shadowRadius: 10, // Sombra difuminada
      },
      android: {
        elevation: 10, // Elevación para crear sombra en Android
      },
    }),
  },
  /**
   * Estilo del encabezado del panel
   * Contiene el título y el botón de cierre
   */
  header: {
    flexDirection: 'row', // Organiza los elementos en fila
    justifyContent: 'space-between', // Separa el título y el botón
    alignItems: 'center', // Centra verticalmente los elementos
    padding: 15, // Espaciado interno
    backgroundColor: Colors.blue, // Fondo azul para destacar como encabezado
    borderBottomWidth: 2, // Borde inferior más grueso
    borderBottomColor: '#0056a8', // Azul más oscuro para el borde inferior
  },
  
  /**
   * Estilo del título del panel
   * Texto grande y en negrita con sombra sutil
   */
  title: {
    fontFamily: Fonts.nunitoBold, // Fuente en negrita
    fontSize: 20, // Tamaño grande
    color: Colors.light, // Color claro para contrastar con el fondo azul
    textShadowColor: 'rgba(0, 0, 0, 0.2)', // Sombra sutil
    textShadowOffset: { width: 1, height: 1 }, // Desplazamiento de la sombra
    textShadowRadius: 2, // Difuminado de la sombra
  },
  
  /**
   * Estilo del botón de cierre
   * Botón circular con borde y sombra
   */
  closeButton: {
    width: 36, // Tamaño fijo
    height: 36, // Tamaño fijo
    borderRadius: 18, // Radio igual a la mitad del ancho/alto para hacerlo circular
    backgroundColor: Colors.darkBlue, // Fondo azul oscuro
    justifyContent: 'center', // Centra el texto horizontalmente
    alignItems: 'center', // Centra el texto verticalmente
    borderWidth: 2, // Borde grueso
    borderColor: Colors.light, // Borde claro para destacar
    // Sombras específicas según la plataforma
    ...Platform.select({
      ios: {
        shadowColor: Colors.dark,
        shadowOffset: { width: 0, height: 2 }, // Sombra hacia abajo
        shadowOpacity: 0.3, // Sombra semi-transparente
        shadowRadius: 2, // Sombra poco difuminada
      },
      android: {
        elevation: 3, // Elevación moderada
      },
    }),
  },
  
  /**
   * Estilo del texto del botón de cierre (símbolo ×)
   */
  closeButtonText: {
    fontFamily: Fonts.nunitoBold, // Fuente en negrita
    fontSize: 20, // Tamaño grande
    color: Colors.light, // Color claro para contrastar
    lineHeight: 24, // Altura de línea para centrar verticalmente
  },
  /**
   * Estilo del contenedor de estadísticas
   * Muestra información resumida en una fila
   */
  statsContainer: {
    flexDirection: 'row', // Organiza los elementos en fila
    justifyContent: 'space-around', // Distribuye uniformemente los elementos
    padding: 15, // Espaciado interno
    backgroundColor: Colors.yellow, // Mantiene el fondo amarillo
    borderBottomWidth: 1, // Borde inferior fino
    borderBottomColor: Colors.brown, // Color marrón para el borde
  },
  
  /**
   * Estilo de cada elemento de estadística
   * Contiene una etiqueta y un valor
   */
  statItem: {
    alignItems: 'center', // Centra los elementos horizontalmente
  },
  
  /**
   * Estilo de la etiqueta de estadística
   * Texto pequeño y descriptivo
   */
  statLabel: {
    fontFamily: Fonts.nunito, // Fuente normal
    fontSize: 14, // Tamaño pequeño
    color: Colors.brown, // Color marrón para contrastar con el fondo
    marginBottom: 5, // Espacio inferior para separar de la etiqueta
  },
  
  /**
   * Estilo del valor de estadística
   * Texto grande y en negrita con sombra
   */
  statValue: {
    fontFamily: Fonts.nunitoBold, // Fuente en negrita
    fontSize: 18, // Tamaño grande
    color: Colors.dark, // Color oscuro para destacar
    textShadowColor: 'rgba(255, 255, 255, 0.6)', // Sombra clara para efecto de relieve
    textShadowOffset: { width: 0, height: 1 }, // Sombra ligeramente hacia abajo
    textShadowRadius: 2, // Difuminado de la sombra
  },
  /**
   * Estilo del contenedor de filtros
   * Barra horizontal con scroll para los botones de filtro
   */
  filtersContainer: {
    maxHeight: 50, // Altura máxima fija
    backgroundColor: Colors.yellow, // Mantiene el fondo amarillo
    borderBottomWidth: 1, // Borde inferior fino
    borderBottomColor: Colors.brown, // Color marrón para el borde
    // Sombra sutil específica por plataforma
    ...Platform.select({
      ios: {
        shadowColor: Colors.brown,
        shadowOffset: { width: 0, height: 2 }, // Sombra hacia abajo
        shadowOpacity: 0.1, // Sombra muy sutil
        shadowRadius: 2, // Difuminado ligero
      },
      android: {
        elevation: 2, // Elevación ligera
      },
    }),
  },
  
  /**
   * Estilo del contenido del ScrollView de filtros
   * Define el espaciado interno
   */
  filtersContent: {
    paddingHorizontal: 10, // Espaciado horizontal
    paddingVertical: 10, // Espaciado vertical
  },
  
  /**
   * Estilo de los botones de filtro inactivos
   * Botones redondeados con fondo claro
   */
  filterButton: {
    paddingHorizontal: 15, // Espaciado horizontal interno
    paddingVertical: 6, // Espaciado vertical interno
    borderRadius: 20, // Bordes muy redondeados
    marginHorizontal: 5, // Margen horizontal entre botones
    backgroundColor: Colors.lightGray, // Fondo gris claro
    borderWidth: 1, // Borde fino
    borderColor: Colors.gray, // Borde gris
    // Sombra sutil específica por plataforma
    ...Platform.select({
      ios: {
        shadowColor: Colors.dark,
        shadowOffset: { width: 0, height: 2 }, // Sombra hacia abajo
        shadowOpacity: 0.1, // Sombra muy sutil
        shadowRadius: 2, // Difuminado ligero
      },
      android: {
        elevation: 2, // Elevación ligera
      },
    }),
  },
  
  /**
   * Estilo adicional para los botones de filtro activos
   * Cambia el color de fondo y borde para destacar
   */
  activeFilterButton: {
    backgroundColor: Colors.blue, // Fondo azul
    borderColor: Colors.darkBlue, // Borde azul oscuro
    borderWidth: 2, // Borde más grueso
    // Sombra más pronunciada específica por plataforma
    ...Platform.select({
      ios: {
        shadowColor: Colors.darkBlue,
        shadowOffset: { width: 0, height: 2 }, // Sombra hacia abajo
        shadowOpacity: 0.3, // Sombra más visible
        shadowRadius: 2, // Difuminado ligero
      },
      android: {
        elevation: 3, // Elevación mayor
      },
    }),
  },
  
  /**
   * Estilo del texto de los botones de filtro inactivos
   */
  filterText: {
    fontFamily: Fonts.nunito, // Fuente normal
    fontSize: 14, // Tamaño pequeño
    color: Colors.dark, // Color oscuro
  },
  
  /**
   * Estilo adicional para el texto de los botones de filtro activos
   * Cambia a fuente en negrita y color claro con sombra
   */
  activeFilterText: {
    fontFamily: Fonts.nunitoBold, // Fuente en negrita
    color: Colors.light, // Color claro para contrastar con el fondo azul
    textShadowColor: 'rgba(0, 0, 0, 0.2)', // Sombra sutil
    textShadowOffset: { width: 0, height: 1 }, // Sombra ligeramente hacia abajo
    textShadowRadius: 1, // Difuminado mínimo
  },
  /**
   * Estilo del contenedor principal de logros
   * ScrollView que contiene todas las tarjetas de logros
   */
  achievementsContainer: {
    flex: 1, // Ocupa todo el espacio disponible
    backgroundColor: Colors.yellow, // Mantiene el fondo amarillo
  },
  
  /**
   * Estilo del contenido del ScrollView de logros
   * Define el espaciado interno
   */
  achievementsContent: {
    padding: 20, // Espaciado en todos los lados
    paddingBottom: 30, // Espaciado inferior adicional
  },
  
  /**
   * Estilo del contenedor para el mensaje de vacío
   * Se muestra cuando no hay logros en la categoría seleccionada
   */
  emptyContainer: {
    padding: 30, // Espaciado interno amplio
    alignItems: 'center', // Centra horizontalmente
    justifyContent: 'center', // Centra verticalmente
    backgroundColor: Colors.lightGray, // Fondo gris claro
    borderRadius: 15, // Bordes redondeados
    margin: 20, // Margen exterior
    // Sombra sutil específica por plataforma
    ...Platform.select({
      ios: {
        shadowColor: Colors.dark,
        shadowOffset: { width: 0, height: 2 }, // Sombra hacia abajo
        shadowOpacity: 0.1, // Sombra muy sutil
        shadowRadius: 3, // Difuminado medio
      },
      android: {
        elevation: 2, // Elevación ligera
      },
    }),
  },
  
  /**
   * Estilo del texto para el mensaje de vacío
   * Texto informativo cuando no hay logros que mostrar
   */
  emptyText: {
    fontFamily: Fonts.nunito, // Fuente normal
    fontSize: 16, // Tamaño medio
    color: Colors.textGray, // Color gris para texto secundario
    textAlign: 'center', // Centrado
    lineHeight: 24, // Altura de línea para mejor legibilidad
  },
});

export default AchievementsPanel;