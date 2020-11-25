import { ActionSheetIOS } from "react-native";

const initialState = {
  markers: [
    {
      address: "Budapest 18, Budapest, Magyarország",
      latitude: 47.41208317667451,
      longitude: 19.200159628750264,
      type: 0,
      approveCount: 3,
      isApproved: false,
    },
    {
      address: "Vecsés, Pest, Magyarország",
      latitude: 47.51208317667451,
      longitude: 19.300159628750264,
      type: 1,
      approveCount: 2,
      isApproved: false,
    },
    {
      address: "Vecsés, Pest, Magyarország",
      latitude: 49.51208317667451,
      longitude: 19.300159628750264,
      type: 2,
      approveCount: 1,
      isApproved: false,
    },
    {
      address: "Budapest 22, Budapest, Magyarország",
      latitude: 47.45552887428843,
      longitude: 19.026731438934803,
      type: 0,
      approveCount: 0,
      isApproved: false,
    },
  ],
  messages: [
    {
      _id: 1,
      text: "Hello User",
      createdAt: new Date(),
      user: {
        _id: 3,
        name: "React Native",
        avatar: "https://placeimg.com/140/140/any",
      },
    },
    {
      _id: 2,
      text: "Hello another user",
      createdAt: new Date(),
      user: {
        _id: 2,
        name: "React Native",
        avatar: "https://placeimg.com/140/140/any",
      },
    },
  ],
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case "ADD_MARKER":
      let newMarker = {
        address: action.payload.address,
        latitude: action.payload.latitude,
        longitude: action.payload.longitude,
        type: action.payload.type,
        approveCount: action.payload.approveCount,
        isApproved: action.payload.isApproved,
      };

      state = {
        ...state,
        markers: [...state.markers, newMarker].sort(
          (a, b) => b.approveCount - a.approveCount
        ),
      };
      return state;

    case "ADD_MESSAGE":
      let newMessage = {
        _id: action.payload.id,
        text: action.payload.text,
        createdAt: action.payload.createdAt,
        user: {
          _id: action.payload.user.id,
          name: action.payload.user.name,
          avatar: action.payload.user.avatar,
        },
      };

      state = {
        ...state,
        messages: [newMessage, ...state.messages],
      };
      return state;

    case "REMOVE_MARKER":
      state.markers = state.markers.filter(
        (e) =>
          e.address != action.payload.address ||
          e.type !== action.payload.type ||
          e.approveCount !== action.payload.approveCount ||
          e.latitude.toString() !== action.payload.latitude.toString() ||
          e.longitude.toString() !== action.payload.longitude.toString()
      );

      state = {
        ...state,
        markers: [...state.markers],
      };
      return state;

    case "APPROVE_MARKER":

    default:
      return state;
  }
}

export default reducer;
