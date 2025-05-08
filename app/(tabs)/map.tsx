import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, TouchableOpacity, useWindowDimensions, Platform, View as RNView } from 'react-native';
import { View } from '@/components/View';
import { Text } from '@/components/Text';
import Colors from '@/constants/Colors';
import Theme from '@/constants/Theme';
import { Bike, Bus, ShieldAlert, Store, User, Layers } from 'lucide-react-native';
import { MapElementType } from '@/models/types';

// Map filter types
type MapFilter = 'bike_lanes' | 'bus_routes' | 'safe_sidewalks' | 'reports' | 'businesses';

// Conditionally import MapView only for native platforms
let MapView: any;
let Marker: any;
let Polyline: any;
let PROVIDER_GOOGLE: any;

if (Platform.OS !== 'web') {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  Marker = Maps.Marker;
  Polyline = Maps.Polyline;
  PROVIDER_GOOGLE = Maps.PROVIDER_GOOGLE;
}

// Map initial region centered on Teresina, PI, Brazil
const INITIAL_REGION = {
  latitude: -5.0914,
  longitude: -42.8038,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

// Mock data for map elements
const MAP_ELEMENTS = [
  // Bike lanes
  {
    id: 'bike1',
    type: 'bike_lane' as MapElementType,
    name: 'Av. Raul Lopes Bike Lane',
    description: 'Bike lane along Av. Raul Lopes',
    color: Colors.primary[500],
    coordinates: [
      { latitude: -5.0830, longitude: -42.7990 },
      { latitude: -5.0845, longitude: -42.7950 },
      { latitude: -5.0860, longitude: -42.7920 },
    ],
  },
  // Bus routes
  {
    id: 'bus1',
    type: 'bus_route' as MapElementType,
    name: 'T1 - Circular',
    description: 'Main bus route around the city center',
    color: Colors.secondary[500],
    coordinates: [
      { latitude: -5.0914, longitude: -42.8038 },
      { latitude: -5.0900, longitude: -42.8000 },
      { latitude: -5.0880, longitude: -42.7980 },
      { latitude: -5.0860, longitude: -42.7960 },
    ],
  },
  // Safe sidewalks
  {
    id: 'sidewalk1',
    type: 'safe_sidewalk' as MapElementType,
    name: 'Av. Frei Serafim Sidewalk',
    description: 'Well-maintained sidewalk along Av. Frei Serafim',
    color: Colors.success[500],
    coordinates: [
      { latitude: -5.0891, longitude: -42.8019 },
      { latitude: -5.0896, longitude: -42.8000 },
      { latitude: -5.0901, longitude: -42.7985 },
    ],
  },
  // Report hotspots
  {
    id: 'report1',
    type: 'report_hotspot' as MapElementType,
    name: 'Pothole Cluster',
    description: 'Area with multiple pothole reports',
    location: { latitude: -5.0891, longitude: -42.8019 },
  },
  {
    id: 'report2',
    type: 'report_hotspot' as MapElementType,
    name: 'Traffic Light Issue',
    description: 'Reports of traffic light malfunction',
    location: { latitude: -5.0880, longitude: -42.7980 },
  },
  // Business locations
  {
    id: 'business1',
    type: 'business_location' as MapElementType,
    name: 'Café Sustentável',
    description: 'Eco-friendly café with discounts for cyclists',
    location: { latitude: -5.0845, longitude: -42.7950 },
  },
  {
    id: 'business2',
    type: 'business_location' as MapElementType,
    name: 'Bike Shop',
    description: 'Bicycle repairs and accessories',
    location: { latitude: -5.0860, longitude: -42.7920 },
  },
];

export default function MapScreen() {
  const dimensions = useWindowDimensions();
  const [activeFilters, setActiveFilters] = useState<MapFilter[]>([
    'bike_lanes', 
    'bus_routes', 
    'safe_sidewalks', 
    'reports', 
    'businesses'
  ]);
  const [selectedElement, setSelectedElement] = useState<any | null>(null);

  const toggleFilter = (filter: MapFilter) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const getMarkerColorByType = (type: MapElementType) => {
    switch (type) {
      case 'report_hotspot':
        return Colors.error[500];
      case 'business_location':
        return Colors.secondary[500];
      default:
        return Colors.primary[500];
    }
  };

  const getMarkerIconByType = (type: MapElementType) => {
    switch (type) {
      case 'report_hotspot':
        return <ShieldAlert size={24} color={Colors.light.background} />;
      case 'business_location':
        return <Store size={24} color={Colors.light.background} />;
      default:
        return <User size={24} color={Colors.light.background} />;
    }
  };

  const isPolylineVisible = (type: MapElementType) => {
    if (type === 'bike_lane' && activeFilters.includes('bike_lanes')) return true;
    if (type === 'bus_route' && activeFilters.includes('bus_routes')) return true;
    if (type === 'safe_sidewalk' && activeFilters.includes('safe_sidewalks')) return true;
    return false;
  };

  const isMarkerVisible = (type: MapElementType) => {
    if (type === 'report_hotspot' && activeFilters.includes('reports')) return true;
    if (type === 'business_location' && activeFilters.includes('businesses')) return true;
    return false;
  };

  // Web placeholder component
  const WebPlaceholder = () => (
    <View style={[styles.container, styles.webPlaceholder]}>
      <Text style={styles.webPlaceholderText}>
        The map feature is currently only available on mobile devices.
      </Text>
      <Text style={styles.webPlaceholderSubtext}>
        Please use our mobile app to access the full mapping functionality.
      </Text>
    </View>
  );

  // Render different content based on platform
  const renderContent = () => {
    if (Platform.OS === 'web') {
      return <WebPlaceholder />;
    }

    return (
      <>
        <MapView
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          style={styles.map}
          initialRegion={INITIAL_REGION}
          showsUserLocation
          showsMyLocationButton
        >
          {/* Render polylines (bike lanes, bus routes, sidewalks) */}
          {MAP_ELEMENTS.filter(element => 
            'coordinates' in element && isPolylineVisible(element.type)
          ).map(element => (
            <Polyline
              key={element.id}
              coordinates={element.coordinates}
              strokeColor={element.color}
              strokeWidth={4}
              tappable
              onPress={() => setSelectedElement(element)}
            />
          ))}

          {/* Render markers (reports, businesses) */}
          {MAP_ELEMENTS.filter(element => 
            'location' in element && isMarkerVisible(element.type)
          ).map(element => (
            <Marker
              key={element.id}
              coordinate={element.location}
              title={element.name}
              description={element.description}
              onPress={() => setSelectedElement(element)}
            >
              <RNView style={[
                styles.markerContainer,
                { backgroundColor: getMarkerColorByType(element.type) }
              ]}>
                {getMarkerIconByType(element.type)}
              </RNView>
            </Marker>
          ))}
        </MapView>

        {/* Map filters */}
        <View style={styles.filtersContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFilters.includes('bike_lanes') && styles.activeFilterButton,
            ]}
            onPress={() => toggleFilter('bike_lanes')}
          >
            <Bike
              size={20}
              color={
                activeFilters.includes('bike_lanes') 
                  ? Colors.primary[700]
                  : Colors.neutral[500]
              }
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFilters.includes('bus_routes') && styles.activeFilterButton,
            ]}
            onPress={() => toggleFilter('bus_routes')}
          >
            <Bus
              size={20}
              color={
                activeFilters.includes('bus_routes') 
                  ? Colors.primary[700]
                  : Colors.neutral[500]
              }
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFilters.includes('safe_sidewalks') && styles.activeFilterButton,
            ]}
            onPress={() => toggleFilter('safe_sidewalks')}
          >
            <User
              size={20}
              color={
                activeFilters.includes('safe_sidewalks') 
                  ? Colors.primary[700]
                  : Colors.neutral[500]
              }
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFilters.includes('reports') && styles.activeFilterButton,
            ]}
            onPress={() => toggleFilter('reports')}
          >
            <ShieldAlert
              size={20}
              color={
                activeFilters.includes('reports') 
                  ? Colors.primary[700]
                  : Colors.neutral[500]
              }
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFilters.includes('businesses') && styles.activeFilterButton,
            ]}
            onPress={() => toggleFilter('businesses')}
          >
            <Store
              size={20}
              color={
                activeFilters.includes('businesses') 
                  ? Colors.primary[700]
                  : Colors.neutral[500]
              }
            />
          </TouchableOpacity>
        </View>

        {/* Map legend button */}
        <TouchableOpacity style={styles.legendButton}>
          <Layers size={24} color={Colors.neutral[700]} />
        </TouchableOpacity>

        {/* Selected element details */}
        {selectedElement && (
          <View style={styles.detailsContainer}>
            <View style={styles.detailsHeader}>
              <Text fontFamily="semibold" fontSize="lg">
                {selectedElement.name}
              </Text>
              <TouchableOpacity onPress={() => setSelectedElement(null)}>
                <Text fontSize="md" color={Colors.primary[500]}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
            <Text fontSize="sm" color={Colors.neutral[600]}>
              {selectedElement.description}
            </Text>
          </View>
        )}
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  webPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.xl,
  },
  webPlaceholderText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: Theme.spacing.md,
    color: Colors.neutral[700],
  },
  webPlaceholderSubtext: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.neutral[600],
  },
  filtersContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    right: Theme.spacing.md,
    flexDirection: 'column',
    backgroundColor: Colors.light.background,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.xs,
    ...Theme.shadows.md,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: Theme.spacing.xs,
  },
  activeFilterButton: {
    backgroundColor: Colors.primary[100],
  },
  legendButton: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 120 : 100,
    right: Theme.spacing.md,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.md,
  },
  markerContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.light.background,
    ...Theme.shadows.md,
  },
  detailsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Theme.spacing.lg,
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: Theme.borderRadius.lg,
    borderTopRightRadius: Theme.borderRadius.lg,
    ...Theme.shadows.lg,
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
});