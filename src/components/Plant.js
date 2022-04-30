import React, { useEffect, useState } from 'react';
import { Image, Group, Text, Circle } from 'react-konva';
import useImage from 'use-image';
import client from '../lib/strapiClient'

const Plant = ({ x, y, blocksize, scale, ratio, onChange, plant, setSelectedCanvasId, selectedCanvasId, setSelectedInventoryId, selectedInventoryId, asHTML, setCanvasDraggingId, canvasDraggingId, setPlantedItems, plantedItems, handleDragFromSidebar }) => {
  // const { blocksize, scale, ratio } = useGarden() 
  // @TODO: why are useGarden values undefined when a new plant is dropped?
  const [imageData, setImageData] = useState()
  const [image] = useImage(imageData?.fields?.file?.url);

  // set the image once the info about the plant is downloaded
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

  const handleCanvasDragStart = (canvasEvent) => {
    setSelectedCanvasId(plant.id)
  }

  // when a planted plant is dragged, not related to menu items
  const handleCanvasDragEnd = (canvasEvent) => {
    setPlantedItems((prevArray) => {
      // get the plant was dragged
      const movedPlant = prevArray.find((p) => p.id === selectedCanvasId)

      // console.log('movedPlant: ', movedPlant.name, movedPlant.id)
      // console.log('selectedCanvasId: ', selectedCanvasId)
      // console.log(selectedCanvasId, movedPlant)
      
      // get the location of where plant was dropped
      const { x, y } = canvasEvent.target.attrs
      const sizer = blocksize * scale
  
      // which way was the plant moved, so we can round to the next nearest block
      const xDir = movedPlant.x - x // if < 0 ? movedUp : movedDown
      const yDir = movedPlant.y - y // if < 0 ? movedUp : movedDown  
      const newX = (xDir < 0 ? Math.ceil(x / sizer) : Math.floor(x / sizer)) * sizer
      const newY = (yDir < 0 ? Math.ceil(y / sizer) : Math.floor(y / sizer)) * sizer
      
      // set plant location to closest snap point
      movedPlant.x = newX
      movedPlant.y = newY

      // React renders stacking order based on the place in the array
      // move higher x and y values to the top of the list so they appear in front
      prevArray.sort((a, b) => (a.y - b.y || a.x - b.x))
  
      return [...prevArray]
    })
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
      onDragStart={handleCanvasDragStart}
      onDragEnd={handleCanvasDragEnd}
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
