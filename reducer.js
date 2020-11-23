import { ActionSheetIOS } from 'react-native'


const initialState = {
  markers: [
    {
      address: "Budapest 18, Budapest, Magyarország",
      latitude: 47.41208317667451,
      longitude: 19.200159628750264,
      type: 0,
      approveCount: 3
    },
    {
      address: "Vecsés, Pest, Magyarország",
      latitude: 47.51208317667451,
      longitude: 19.300159628750264,
      type: 1,
      approveCount: 2
    },
    {
      address: "Vecsés, Pest, Magyarország",
      latitude: 49.51208317667451,
      longitude: 19.300159628750264,
      type: 2,
      approveCount: 1
    },
    {
      address: "Budapest 22, Budapest, Magyarország",
      latitude: 47.45552887428843,
      longitude: 19.026731438934803,
      type: 0,
      approveCount: 0
    }
  ]
}

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'ADD_MARKER':
      let newMarker = {
        address: action.payload.address,
        latitude: action.payload.latitude,
        longitude: action.payload.longitude,
        type: action.payload.type,
        approveCount: action.payload.approveCount
      }
      state.markers.push(newMarker)
      state.markers = state.markers.sort((a,b) => b.approveCount - a.approveCount)
      return state

    case 'REMOVE_MARKER':
      state.markers = state.markers.filter(e => (e.address != action.payload.address 
                                                || e.type !== action.payload.type
                                                || e.approveCount !== action.payload.approveCount
                                                || e.latitude.toString() !== action.payload.latitude.toString()
                                                || e.longitude.toString() !== action.payload.longitude.toString()))
      return state

    default:
      return state
  }
}

export default reducer
