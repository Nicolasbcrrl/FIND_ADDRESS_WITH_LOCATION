import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, TextInput, Button, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import React, { useEffect, useState} from 'react';
import * as Location from 'expo-location';

export default function App() {
  const[research, setResearch] = useState('');
  const[region, setRegion] = useState({
    name: "HAAGA-HELIA",
    latitude: 60.200692,
    longitude: 24.934302,
    latitudeDelta: 0.0322,
    LongitudeDelta: 0.0221,
  });
  const [location, setLocation] = useState(null);
  const [isReady, setReady] = useState(false);

  const fetchlocalisation = () => {
    if (!research) {
      Alert.alert('Please enter a keyword');
      return;
    }
    fetch("https://www.mapquestapi.com/geocoding/v1/address?key=pWBMs7bqfHmTAojNXOLdm3RQg9wvi6P1&location=" + research + "&maxResults=1")
      .then(response => response.json())
      .then(data =>{ 
        setRegion(
          {
            ...region, 
            name: data.results[0].providedLocation.location,
            latitude: data.results[0].locations[0].latLng.lat, 
            longitude: data.results[0].locations[0].latLng.lng
          }
        )
      })
      .catch(err => Alert.alert('Error', err.message))
  }

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('No permission to get location')
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location)
      setRegion({
        ...region,
        name: "Your current position",
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
      await setReady(true);
    })();
  },[]);
  if(!isReady){
    return(
      <View style={styles.loadingView}>
        <Text style={{ fontSize: 20 }}>Loading the map, pleas wait</Text>
      </View>
    );

  }
  else{
    return(
      <View style={styles.container}>
        <MapView
          style={{ flex: 1, height: '75%'}}
            region={region}
          >
          <Marker
            coordinate={{
              latitude: region.latitude,
              longitude: region.longitude
            }}
            title={region.name}
          />
        </MapView>
        <View style={styles.viewSearch}>
          <TextInput
          style={styles.addressInput}
          value={research}
          onChangeText={(text) => setResearch(text)}
          />
          <Button
            style={{ width: '75%' }}
            title="Show"
            onPress={fetchlocalisation}
          />
        </View>
        <StatusBar style="auto" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingView: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  viewSearch: {
    width: '100%',
    height: '10%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressInput: {
    borderColor: 'gray',
    borderBottomWidth: 1,
    width: '75%',
  },
});