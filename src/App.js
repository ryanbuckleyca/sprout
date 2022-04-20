import React, { useState, useEffect } from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import uuid from 'react-uuid';
import { sortBy } from 'lodash'
import useImage from 'use-image';

import { GardenProvider } from './GardenContext'

import useWindowSize from './lib/useWindowSize'
import client from './lib/strapiClient'
import {setSpeciesVarietiesToPlants, setSpeciesToPlants} from './lib/dataParsers'

import Sidebar from './components/Sidebar'
import Plant from './components/Plant'
import Grid from './components/Grid'

const height = window.innerHeight
const width = window.innerWidth
const scale = Math.min(width / 576, height / 378)
const blocksize = 18
const ratio = 2/3

console.log({scale})

const App = () => {
  // const [tiles, setTiles] = useState(initialTiles);
  const [selectedId, selectShape] = useState(null);
  const [draggedId, setDragged] = useState(null);
  const [plants, setPlants] = useState([])
  const [plantedItems, setPlantedItems] = useState([])
  const [image] = useImage("http://images.ctfassets.net/1hpnntply6oj/6Iv7x3k7kivzWto60zp2ry/15b722b5557237a95fbef453be0de0d9/bed_map.png");
  const { height, width } = useWindowSize()

    // This API call will request an entry with the specified ID from the space defined at the top, using a space-specific access token.
  useEffect(() => {
    const processEntries = (response) => {
      const species = response.items.filter((item) => (
        item.sys.contentType.sys.id === 'species'
      ))
      species.forEach((s) => {
        s.fields.varieties?.length > 0 
          ? setSpeciesVarietiesToPlants(s, setPlants)
          : setSpeciesToPlants(s, setPlants) 
      })
    }  

    setPlants([])
    client.getEntries().then(processEntries).catch(console.error)
  }, [setPlants])
  

  const checkDeselect = (e) => {
    // @TODO: deselect isn't working
    // deselect when clicked on empty area
    console.log('user clicked on: ', e.target)
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault(); 
    if(e.target.nodeName === 'CANVAS') {
      const droppedPlant = {...plants.find((p) => p.entityId === draggedId)}
      droppedPlant.id = uuid()
      droppedPlant.x = e.clientX
      droppedPlant.y = e.clientY
      setPlantedItems((plantedItems) => sortBy([...plantedItems, droppedPlant], ['y', 'x']))
    }
  }

  const handleChange = (newAttrs, plantIndex) => {
    console.log({newAttrs})
    setPlantedItems((prevArray) => {
      prevArray[plantIndex] = newAttrs;  
      // @TODO: bug, plant will not snap back to previous gridpoint if it's the same value
      // possible fix, check if values are the same and then undo move?
      return [...sortBy([...prevArray], ['y', 'x'])]
    })
  }

  const garden = {
    plants,
    setPlants
  }

  const bgScale = Math.min(window.innerWidth / image?.width, window.innerHeight / image?.height)

  return (
    <GardenProvider garden={garden}>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        style={{
          position: 'relative', 
          width: width, 
          height: height, 
          overflow: 'hidden'
        }}
      >
        <Stage
          width={width}
          height={height}
          onMouseDown={checkDeselect}
          onTouchStart={checkDeselect}
        >
          {image && (
            <Layer>
              <Rect
                x={0}
                y={0}
                width={width}
                height={height}
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
                onChange={(newAttrs) => handleChange(newAttrs, i)}
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
    </GardenProvider>
  );
};

export default App
