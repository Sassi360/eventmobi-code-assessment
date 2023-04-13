import { ChakraBaseProvider, ColorModeScript, theme } from '@chakra-ui/react'
import React from 'react'
import ReactDOM from 'react-dom/client'
import {App} from './App'
import { ToggleColorMode } from './components/ToggleColorMode'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ChakraBaseProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ToggleColorMode/>
      <App />
    </ChakraBaseProvider >

  </React.StrictMode>,
)
