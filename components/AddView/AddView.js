import React, { Component, useEffect } from 'react'
import { connect, useDispatch } from 'react-redux'

import { SafeAreaView } from 'react-native'
import { Card, Title, Button, TextInput } from 'react-native-paper'
import MapView, { AnimatedRegion } from 'react-native-maps'
import DropDown from 'react-native-paper-dropdown'
import { ScrollView, View, Image } from 'react-native'

const AddView = ({ markers, addMarker }) => {
  const [currentRegion, setCurrentRegion] = React.useState(null)
  const [showDropDown, setShowDropDown] = React.useState(false)
  const [action, setAction] = React.useState()
  const [marker, setMarker] = React.useState()

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (e) => reject(e)
      )
    })
  }

  const actionList = [
    { value: 0, label: 'Traffipax' },
    { value: 1, label: 'Accident'  },
    { value: 2, label: 'Construction' },
  ]

  const send = () => {
    addMarker(action, 9, marker.latitude, marker.longitude)
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
    <ScrollView>
      <View>
        <Card>
          <Card.Title title="Send new perception" />
          <Card.Content>
            <Title>1. Choose the type(test)</Title>

            <DropDown
              label={'Type of action'}
              mode={'outlined'}
              value={action}
              setValue={setAction}
              list={actionList}
              visible={showDropDown}
              showDropDown={() => setShowDropDown(true)}
              onDismiss={() => setShowDropDown(false)}
              inputProps={{
                right: <TextInput.Icon name={'menu-down'} />,
              }}
            />
            <Title>2. Choose the location</Title>
            <View>
              <MapView
                style={{ width: '100%', height: 400, alignContent: 'center' }}
                loadingEnabled={true}
                zoomEnabled={true}
                defaultRegion={currentRegion}
                onPress={(e) => setMarker(e.nativeEvent.coordinate)}
              >
                {marker && <MapView.Marker coordinate={marker} />}
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
                  console.log(markers);
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
          </Card.Content>
          <Card.Actions>
            <View>
              <Button
                style={{ textAlign: 'center', alignContent: 'center' }}
                onPress={() => send()}
              >
                Send
              </Button>
            </View>
          </Card.Actions>
        </Card>
      </View>
    </ScrollView>
  )
}

const mapStateToProps = (state /*, ownProps*/) => ({
  markers: state.markers,
  //nextPage: state.stats.nextPage,
})

const mapDispatchToProps = (dispatch) => {
  return {
    // dispatching plain actions
    addMarker: (type, id, latitude, longitude) =>
      dispatch({
        type: 'ADD_MARKER',
        payload: { type: type, id: id, latitude: latitude, longitude: longitude },
      }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddView)
