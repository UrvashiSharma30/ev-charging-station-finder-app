import React, { useContext } from 'react';
import {Image } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import MapViewStyle from '../assets/Utils/MapViewSTyle.json'
import { UserLocationContext } from '../src/Context/UserLocationContext';


export default function AppMapView() {
  const {location, setLocation} = useContext(UserLocationContext);
  return location?.latitude &&(
    <View>
      <MapView style={styles.map} 
      provider={PROVIDER_GOOGLE}
      showsUserLocation ={true}
      customMapStyle={MapViewStyle}
      region={{
        latitude:location?.latitude,
        longitude:location?.longitude,
        latitudeDelta:0.0422,
        longitudeDelta:0.0421

      }}> 
      <Marker coordinate={{
         latitude:location?.latitude,
         longitude:location?.longitude
      }}> 
      <Image source={require('../assets/images/car-marker.png')} style={styles.marker}/>
      
      </Marker>
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width:'100%',
    backgroundColor:'#FFF000'
  },
  map: {
    width: '100%',
    height: '100%',
  },
  marker:{
    height:60,
    width:35,
    objectFit:'contain'
  }
});