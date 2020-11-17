import React, { Component, useEffect } from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import MapView, { AnimatedRegion } from 'react-native-maps'
import { connect } from 'react-redux'
import { Image } from 'react-native'

const MainMapView = ({ markers}) => {
  const [currentRegion, setCurrentRegion] = React.useState(null)

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (e) => reject(e)
      )
    })
  }

  useEffect(() => {
    getCurrentLocation().then((position) => {
      if (position) {
        setCurrentRegion({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.0001,
          longitudeDelta: 0.0001,
        })
      }
    })
    console.log(currentRegion)
  }, [])

  return (
    <View>
      <MapView
        style={styles.map}
        loadingEnabled={true}
        zoomEnabled={true}
        defaultRegion={currentRegion}
      >
        {markers.map((marker, i) => {
          var markerSource = ""
          switch (marker.type) {
            case 0: 
              markerSource = require('../../images/tc_logo.png')
              break
            case 1: 
              markerSource = require('../../images/traffic_accident.png')
              break
            case 2: 
              markerSource = require('../../images/construction_logo.png')
              break
            default: markerSource = require('../../images/tc_logo.png')
          }
          return (
            <MapView.Marker key={i} coordinate={marker}>
              <Image
                source={markerSource}
                style={{ height: 50, width: 55 }}
              />
            </MapView.Marker>
          )
        })}
      </MapView>
    </View>
  )
}

const mapStateToProps = (state /*, ownProps*/) => ({
  markers: state.markers,
  //nextPage: state.stats.nextPage,
})

const styles = StyleSheet.create({
  map: {
    height: Dimensions.get('window').height,
  },
})

export default connect(mapStateToProps)(MainMapView)
