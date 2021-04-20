import React, { useEffect, useRef } from "react";
import { Platform, StyleSheet, Text, View, Alert } from "react-native";
import MqttService from "../../src/core/services/MqttService";
import { connect } from "react-redux";
import { Card, Title, Button } from "react-native-paper";
import MapView from "react-native-maps";
import { ScrollView, Image } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import DropDownPicker from "react-native-dropdown-picker";

const instructions = Platform.select({
  ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
  android:
    "Double tap R on your keyboard to reload,\n" +
    "Shake or press menu button for dev menu",
});

const AddViewMqtt = ({ markers }) => {
  const [currentRegion, setCurrentRegion] = React.useState(null);
  const [action, setAction] = React.useState();
  const [marker, setMarker] = React.useState();

  const isFirstRender = useRef(true);

  const actionList = [
    {
      value: 0,
      label: "Traffipax",
      icon: () => <Icon name="map-pin" size={18} color="#900" />,
      hidden: true,
    },
    {
      value: 1,
      label: "Accident",
      icon: () => <Icon name="map-pin" size={18} color="#900" />,
    },
    {
      value: 2,
      label: "Construction",
      icon: () => <Icon name="map-pin" size={18} color="#900" />,
    },
  ];

  useEffect(() => {
    getCurrentLocation().then((position) => {
      if (position) {
        setCurrentRegion({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.0001,
          longitudeDelta: 0.0001,
        });
      }
    });
    isFirstRender.current = false;
  }, []);

  useEffect(() => {
    console.log("Markers changed");
  }, [markers]);

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (e) => reject(e)
      );
    });
  };

  const onPublish = () => {
    const url = `https://reverse.geocoder.ls.hereapi.com/6.2/reversegeocode.json?prox=${marker.latitude}%2C${marker.longitude}&mode=retrieveAddresses&maxresults=1&gen=9&apiKey=99MVsWZF5b6TLmiXpC8MJlQI_2twZtLiYMluOmZ8zu0`;
    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        let newMarker = {
          address: json.Response.View[0].Result[0].Location.Address.Label,
          latitude: marker.latitude,
          longitude: marker.longitude,
          type: action,
          approveCount: 0,
          disApproveCount: 0,
          isApproved: false,
        };

        let message = JSON.stringify(newMarker);
        //  MqttService.publishMessage("WORLD", message);
        fetch(`http://127.0.0.1:8000/add/?message=${message}`);
      })
      .catch((e) => {
        console.log("Error in getAddressFromCoordinates", e);
        return e;
      });
  };

  return (
    <ScrollView>
      <View>
        <Card>
          <Card.Title title="Send new perception" />
          <Card.Content>
            <Title>1. Choose the type</Title>

            <DropDownPicker
              items={actionList}
              defaultValue={0}
              containerStyle={{ height: 40 }}
              style={{ backgroundColor: "#fafafa" }}
              itemStyle={{
                justifyContent: "flex-start",
              }}
              dropDownStyle={{ backgroundColor: "#fafafa" }}
              onChangeItem={(item) => setAction(item.value)}
            />
            <Title>2. Choose the location</Title>
            <View>
              <MapView
                style={{ width: "100%", height: 400, alignContent: "center" }}
                loadingEnabled={true}
                zoomEnabled={true}
                defaultRegion={currentRegion}
                onPress={(e) => setMarker(e.nativeEvent.coordinate)}
              >
                {marker && <MapView.Marker coordinate={marker} />}
                {markers.map((marker, i) => {
                  var markerSource = "";
                  switch (marker.type) {
                    case 0:
                      markerSource = require("../../images/tc_logo.png");
                      break;
                    case 1:
                      markerSource = require("../../images/traffic_accident.png");
                      break;
                    case 2:
                      markerSource = require("../../images/construction_logo.png");
                      break;
                    default:
                      markerSource = require("../../images/tc_logo.png");
                  }
                  return (
                    <MapView.Marker key={i} coordinate={marker}>
                      <Image
                        source={markerSource}
                        style={{ height: 50, width: 55 }}
                      />
                    </MapView.Marker>
                  );
                })}
              </MapView>
            </View>
          </Card.Content>
          <Card.Actions>
            <View>
              <Button
                style={{ textAlign: "center", alignContent: "center" }}
                onPress={onPublish}
                title="Publish"
                color="#841584"
              >
                Publish
              </Button>
            </View>
          </Card.Actions>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5,
  },
});

const mapStateToProps = (state /*, ownProps*/) => ({
  markers: state.markers,
  //nextPage: state.stats.nextPage,
});

const mapDispatchToProps = (dispatch) => {
  return {
    // dispatching plain actions
    addMarker: (marker) =>
      dispatch({
        type: "ADD_MARKER",
        payload: {
          address: marker.address,
          type: marker.type,
          latitude: marker.latitude,
          longitude: marker.longitude,
          approveCount: marker.approveCount,
          disApproveCount: marker.disApproveCount,
        },
      }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddViewMqtt);
