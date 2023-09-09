import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native";
import * as Location from "expo-location";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get("window");

const SCREEN_HEIGHT = height;
const SCREEN_WIDTH = width;
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function Home() {

  interface Region {
    latitude: number,
    longitude: number,
    latitudeDelta: number,
    longitudeDelta: number
  }

  interface Marker {
    latitude: number,
    longitude: number,
    title: string,
    subtitle: string
  }

  const markers: Array<Marker> = [
    {
      latitude: 57.248507,
      longitude: 22.579306,
      title: "Talsi Bus Station Toilet",
      subtitle: "5 stars"
    },
    {
      latitude: 57.24504391438646,
      longitude: 22.586908392751756,
      title: "Talsi Centrs Toilet",
      subtitle: "1 star"
    },
    {
      latitude: 57.24804120342333,
      longitude: 22.578428917499927,
      title: "Talsi RIMI Toilet",
      subtitle: "2 stars"
    }
  ]

  const [region, setRegion] = useState<Region>({
    latitude: -1,
    longitude: -1,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA
  });
  
  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setRegion({...region, 
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
    })();
  }, []);

  return (
    <SafeAreaView>
         {region.latitude === -1 || region.longitude === -1 ? (
          <Text>Loading...</Text>
        ) : (
          <MapView
            region={region}
            showsUserLocation={true}
            provider={PROVIDER_GOOGLE}
            onRegionChangeComplete={region => setRegion(region)}
            style={{
              height: SCREEN_HEIGHT / 3,
              width: SCREEN_WIDTH
            }}
          >
            {markers.map((marker, index) => (
              <Marker key={index} coordinate={{latitude: marker.latitude, longitude: marker.longitude}} title={marker.title} description={marker.subtitle}/>
            ))}
          </MapView>
        )}
        <Text>{region.latitude}</Text>
    </SafeAreaView>
  )
}
  