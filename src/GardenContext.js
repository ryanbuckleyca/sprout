import { createContext, useContext } from 'react'

const GardenContext = createContext({})

export const GardenProvider = ({ children, garden }) => {
  return (
    <GardenContext.Provider value={garden}>
      {children}
    </GardenContext.Provider>
  )
}

export const useGarden = () => {
  return useContext(GardenContext)
}

export default GardenContext
