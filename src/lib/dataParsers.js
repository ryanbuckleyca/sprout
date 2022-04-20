import uuid from 'react-uuid';

export const setSpeciesVarietiesToPlants = (s, setPlants) => {
  s.fields.varieties.forEach((variety) => {
    const { 
      plantProfile: speciesPlantProfile,
      ...speciesFields
    } = s.fields || {}

    const { 
      species, 
      plantProfile: varietyPlantProfile,
      ...varietyFields
    } = variety.fields || {}

    const plant = {
      id: uuid(),
      entityId: variety?.sys?.id || s?.sys?.id,
      type: 'variety',
      ...speciesPlantProfile?.fields,
      ...speciesFields,
      ...varietyPlantProfile?.fields,
      ...varietyFields
    }

    setPlants((plants) => [...plants, plant])
  })
}

export const setSpeciesToPlants = (s, setPlants) => {
  const { plantProfile, ...speciesFields } = s.fields || {}
  const plant = {
    id: uuid(),
    entityId: s.sys?.id,
    type: 'species',
    ...plantProfile?.fields,
    ...speciesFields,
  }
  setPlants((plants) => [...plants, plant])
}
