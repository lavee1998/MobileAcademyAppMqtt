import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import {
  Provider as PaperProvider,
  Appbar,
  DefaultTheme,
  BottomNavigation,
} from 'react-native-paper'
import MainMapView from './components/MapView'
import AddView from './components/AddView'
import ChatView from './components/ChatView'
import reducer from './reducer'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'darkcyan',
    accent: 'white',
  },
}

const Map = () => <MainMapView />
const Add = () => <AddView />
const Chat = () => <ChatView />

const store = createStore(reducer)

export default App = () => {
  const _goBack = () => console.log('Went back')

  const [index, setIndex] = React.useState(0)
  const [routes] = React.useState([
    { key: 'map', title: 'Map', icon: 'map' },
    { key: 'add', title: 'Add', icon: 'plus' },
    { key: 'chat', title: 'Chat', icon: 'home' },

  ])

  const renderScene = BottomNavigation.SceneMap({
    add: Add,
    map: Map,
    chat: Chat,
  })

  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <Appbar.Header>
          <Appbar.BackAction onPress={_goBack} />
          <Appbar.Content title="Mobil Academy" subtitle="helló levi" />
        </Appbar.Header>

        <BottomNavigation
          navigationState={{ index, routes }}
          onIndexChange={setIndex}
          renderScene={renderScene}
        />
      </PaperProvider>
    </Provider>
  )
}
