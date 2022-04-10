import React, { useEffect, useState } from 'react';
import { Image, Group, Text, Circle } from 'react-konva';
import useImage from 'use-image';

const contentful = require('contentful');

const client = contentful.createClient({
  // This is the space ID. A space is like a project folder in Contentful terms
  space: "1hpnntply6oj",
  // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
  accessToken: process.env.REACT_APP_CONTENTFUL
});

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

  const onSelect = () => {
    selectShape(plant.id);
  }

  const handleDrag = (e) => {
    setDragged(e.target.id)
    console.log('dragging: ', e.target.id)
  }

  const { height, width } = imageData?.fields?.file?.details?.image || {}

  if(asHTML) {
    return (
      <div 
        id={plant.entityId} 
        draggable={true} 
        onDragStart={handleDrag} 
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
      onClick={onSelect}
      onTap={onSelect}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(e) => {
        console.log({e})
        setIsDragging(false)
        console.log(e.target.attrs)
        onChange({
          ...plant,
          x: Math.round(e.target.attrs.x / (blocksize * scale)) * (blocksize * scale),
          y: Math.round(e.target.attrs.y / (blocksize * scale)) * (blocksize * scale),
        })
      }}
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
