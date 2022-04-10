import React, {useEffect, useState} from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import useImage from 'use-image';
import { sortBy } from 'lodash'

import Sidebar from './components/Sidebar'
import Plant from './components/Plant'
import Grid from './components/Grid'
import uuid from 'react-uuid';

const height = window.innerHeight
const width = window.innerWidth
const scale = Math.min(width / 576, height / 378)
const blocksize = 18
const ratio = 2/3

console.log({scale})

const contentful = require('contentful')

const client = contentful.createClient({
  // This is the space ID. A space is like a project folder in Contentful terms
  space: "1hpnntply6oj",
  // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
  accessToken: process.env.REACT_APP_CONTENTFUL
})

const App = () => {
  // const [tiles, setTiles] = useState(initialTiles);
  const [selectedId, selectShape] = useState(null);
  const [draggedId, setDragged] = useState(null);
  const [plants, setPlants] = useState([])
  const [plantedItems, setPlantedItems] = useState([])
  const [image] = useImage("http://images.ctfassets.net/1hpnntply6oj/6Iv7x3k7kivzWto60zp2ry/15b722b5557237a95fbef453be0de0d9/bed_map.png");
  
  const setSpeciesVarietiesToPlants = (s) => {
    s.fields.varieties.forEach((variety) => {
      const { plantProfile: speciesPlantProfile, ...speciesFields } = s.fields || {}
      const { species, plantProfile: varietyPlantProfile, ...varietyFields } = variety.fields || {}
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
  const setSpeciesToPlants = (s) => {
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

  // This API call will request an entry with the specified ID from the space defined at the top, using a space-specific access token.
  useEffect(() => {
    const processEntries = (response) => {
      const species = response.items.filter((item) => (
        item.sys.contentType.sys.id === 'species'
      ))
      species.forEach((s) => {
        s.fields.varieties?.length > 0 
          ? setSpeciesVarietiesToPlants(s)
          : setSpeciesToPlants(s) 
      })
    }  
  
    setPlants([])
    client.getEntries().then(processEntries).catch(console.error)
  }, [])

  const checkDeselect = (e) => {
    // deselect when clicked on empty area
    console.log('user clicked on: ', e.target)
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault(); 
    const droppedPlant = {...plants.find((p) => p.entityId === draggedId)}
    droppedPlant.id = uuid()
    droppedPlant.x = e.clientX
    droppedPlant.y = e.clientY
    setPlantedItems((plantedItems) => sortBy([...plantedItems, droppedPlant], ['y', 'x']))
  }

  const bgScale = Math.min(window.innerWidth / image?.width, window.innerHeight / image?.height)

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      style={{
        position: 'relative', 
        width: window.innerWidth, 
        height: window.innerHeight, 
        overflow: 'hidden'
      }}
    >
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={checkDeselect}
        onTouchStart={checkDeselect}
      >
        {image && (
          <Layer>
            <Rect
              x={0}
              y={0}
              width={window.innerWidth}
              height={window.innerWidth}
              fillPatternRepeat="no-repeat"
              fillPatternImage={image}
              fillPatternScaleX={bgScale}
              fillPatternScaleY={bgScale}
              draggable={false}
            />
          </Layer>
        )}
        <Layer>
          <Grid blocksize={blocksize} scale={scale} />
        </Layer>
        {console.log({plants, plantedItems})}
        <Layer>
          {plantedItems.map((plant, i) => (
            <Plant
              key={i}
              x={plant.x}
              y={plant.y}
              scale={scale}
              ratio={ratio}
              blocksize={blocksize}
              plant={plant}
              asHTML={false}
              selectShape={selectShape}
              setDragged={setDragged}
              selectedId={selectedId}
              onChange={(newAttrs) => {
                console.log({newAttrs})
                const imgs = plantedItems.slice();
                imgs[i] = newAttrs;
                setPlantedItems(sortBy(imgs, ['y', 'x']));
              }}
            />
          ))}
        </Layer>
      </Stage>
      <Sidebar
        plants={plants}
        ratio={ratio}
        setDragged={setDragged}
        selectedId={selectedId}
        selectShape={selectShape}
        setPlants={setPlants}
        scale={scale}
        blocksize={blocksize}
      />
    </div>
  );
};

export default App
