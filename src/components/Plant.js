import React, { useEffect, useState } from 'react';
import { Image, Group, Text, Circle } from 'react-konva';
import useImage from 'use-image';
import client from '../lib/strapiClient'

const Plant = ({ x, y, blocksize, scale, ratio, onChange, plant, setSelectedCanvasId, selectedCanvasId, setSelectedInventoryId, selectedInventoryId, asHTML, setCanvasDraggingId, canvasDraggingId, setPlantedItems, plantedItems, handleDragFromSidebar }) => {
  // const { blocksize, scale, ratio } = useGarden() 
  // @TODO: why are useGarden values undefined when a new plant is dropped?
  const [imageData, setImageData] = useState()
  const [image] = useImage(imageData?.fields?.file?.url);

  useEffect(() => {
    const sprite = plant?.uniqueSprite?.fields?.harvest?.sys?.id
      || plant?.defaultSprite?.fields?.harvest?.sys?.id
  
    if(sprite) {
      client.getAsset(sprite).then((data) => setImageData(data)).catch(console.error)
    }
  }, [plant])

  if (!imageData) {
    return null
  }

  const handleSelect = (e) => {
    console.log('selected: ', e)
  }

  const handleCanvasDragEnd = (e) => {
    const newX = Math.round(e.target.attrs.x / (blocksize * scale)) * (blocksize * scale)
    const newY = Math.round(e.target.attrs.y / (blocksize * scale)) * (blocksize * scale)

    setPlantedItems((prevArray) => {
      const movedPlant = prevArray.find((p) => p.id === selectedCanvasId)
      console.log('plant was at (x,y): ', movedPlant.x, movedPlant.y)
      console.log('plant was dropped at (x,y): ', e.target.attrs.x, e.target.attrs.y)

      if (movedPlant.x === newX && movedPlant.y === newY) {
        return [...prevArray]
        // @TODO: bug, plant will not snap back to previous gridpoint if it's the same value
        // possible fix, check if values are the same and then undo move?
      }
      movedPlant.x = newX
      movedPlant.y = newY
      console.log('plant is now at (x,y): ', newX, newY)

      return [...prevArray]
    })
    // @TODO: bug, plants can be seen shuffling when array reorders for layering
    setCanvasDraggingId(undefined)
  }

  const { height, width } = imageData?.fields?.file?.details?.image || {}

  if(asHTML) {
    return (
      <div 
        id={plant.entityId} 
        draggable={true} 
        onDragStart={handleDragFromSidebar} 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'start',
          justifyItems: 'start',
          margin: 20,
          width: width / 10 * scale,
        }}
      >
      <img
        draggable={false}
        src={imageData.fields.file.url}
        height={height / 10 * scale}
        width={width / 10 * scale}
        alt={plant.name}
      />
      <p style={{
        width: '100%',
        fontSize: 8,
        fontFamily: 'Press Start 2P',
        textAlign: 'center'
      }}>
        {plant.name}
      </p>
    </div>

    )
  }

  return (
    <Group         
      x={x}
      y={y}
      height={(height/10) * scale + 10}
      width={(width/10) * scale + 10}
      onClick={handleSelect}
      onTap={handleSelect}
      onDragStart={() => setSelectedCanvasId(plant.id)}
      onDragEnd={(e) => handleCanvasDragEnd(e)}
      draggable 
    >
      <PlantShadow
        isCanvasDragging={canvasDraggingId === plant.id}
        isSelected={selectedCanvasId === plant.id}
        blocksize={blocksize}
        size={plant.inchSpacing}
        ratio={ratio}
        scale={scale}
      />
      <Image
        image={image} 
        src={imageData.fields.file.url}
        height={(height/10) * scale}
        width={(width/10) * scale}
      />
      <Text
        x={0}
        y={(height/10) * scale - (height/16)}
        width={80}
        text={plant.name}
        fontSize={8}
        fontFamily={'Press Start 2P'}
        fill='black'
      />
    </Group>
  )
};

const PlantShadow = ({ isCanvasDragging, isSelected, size, blocksize, scale, ratio }) => {
  return (
    <Circle
      x={blocksize * scale * 1}
      y={blocksize * scale * 1.9}
      width={blocksize * size * ratio / 2}
      height={blocksize * size * ratio / 2}
      fill='#000'
      opacity={0.3}
      strokeWidth={3}
      visible={isCanvasDragging || isSelected}
    />
  )
}

export default Plant
