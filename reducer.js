import { ActionSheetIOS } from 'react-native'


const initialState = {
  markers: [
    {
      id: 1,
      latitude: 47.41208317667451,
      longitude: 19.200159628750264,
      type: 0
    },
    {
      id: 2,
      latitude: 47.51208317667451,
      longitude: 19.300159628750264,
      type: 1
    },
    {
      id: 3,
      latitude: 49.51208317667451,
      longitude: 19.300159628750264,
      type: 2
    }
  ]
}

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'ADD_MARKER':
      console.log(action.payload)
      let newMarker = {
        id: action.payload.id,
        latitude: action.payload.latitude,
        longitude: action.payload.longitude,
        type: action.payload.type
      }
      state.markers.push(newMarker)
      return state

    default:
      return state
  }
}

export default reducer
