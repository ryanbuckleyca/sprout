import React, { useEffect, useState } from 'react';
import { Image, Group, Text, Circle } from 'react-konva';
import useImage from 'use-image';
import client from '../lib/strapiClient'

const Plant = ({ x, y, onChange, plant, ratio, selectShape, scale, selectedId, blocksize, asHTML, setDragged }) => {
  const [imageData, setImageData] = useState()
  const [image] = useImage(imageData?.fields?.file?.url);
  const [isDragging, setIsDragging] = useState(false)

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

  const handleSelect = () => {
    selectShape(plant.id);
  }

  const handleDragStart = (e) => {
    console.log('dragging: ', e.target.id)
    setDragged(e.target.id)
  }

  const handleDragEnd = (e) => {
    console.log('handling drop: ', e)
    console.log('blocksize: ', blocksize)
    console.log('scale: ', scale)
    console.log('e.target.attrs.x: ', e.target.attrs.x)
    console.log('e.target.attrs.y: ', e.target.attrs.y)
    console.log('x will be: ', Math.round(e.target.attrs.x / (blocksize * scale)) * (blocksize * scale))
    console.log('y will be: ', Math.round(e.target.attrs.y / (blocksize * scale)) * (blocksize * scale))
    setIsDragging(false)
    onChange({
      ...plant,
      x: Math.round(e.target.attrs.x / (blocksize * scale)) * (blocksize * scale),
      y: Math.round(e.target.attrs.y / (blocksize * scale)) * (blocksize * scale),
    })
  }

  const { height, width } = imageData?.fields?.file?.details?.image || {}

  if(asHTML) {
    return (
      <div 
        id={plant.entityId} 
        draggable={true} 
        onDragStart={handleDragStart} 
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
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(e) => handleDragEnd(e)}
      draggable 
    >
      <PlantShadow
        isDragging={isDragging}
        isSelected={selectedId === plant.id}
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

const PlantShadow = ({blocksize, scale, isDragging, isSelected, size, ratio}) => {
  return (
    <Circle
      x={blocksize * scale * 1}
      y={blocksize * scale * 1.9}
      width={blocksize * size * ratio / 2}
      height={blocksize * size * ratio / 2}
      fill='#000'
      opacity={0.3}
      strokeWidth={3}
      visible={isDragging || isSelected}
    />
  )
}

export default Plant
