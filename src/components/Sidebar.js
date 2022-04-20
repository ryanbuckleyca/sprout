import React from 'react';
import Plant from './Plant';
import { useRef, useState } from 'react'
import { useGarden } from '../GardenContext'

const Sidebar = ({ ratio, selectedInventoryId, setSelectedInventoryId, scale, blocksize }) => {
  const [expanded, setExpanded] = useState(false)
  const { plants } = useGarden()
  const sidebarRef = useRef()

  const toggleSidebar = () => {
    setExpanded((expanded) => !expanded)
    sidebarRef.current.classList.toggle('collapsed')
  }

  const handleDragFromSidebar = (e) => {
    console.log('dragging from sidebar: ', e.target.id)
    setSelectedInventoryId(e.target.id)
  }

  return (
    <div
      ref={sidebarRef}
      class="sidebar"
      style={{ 
        display: 'flex',
        position: 'absolute',
        top: 0, 
        right: 0, 
        width: 300,
        height: '100vh', 
        zIndex: 10,
        background: 'none',
      }}
    >
      <button 
        style={{height: 50, width: 50, padding: 10, border: 0, cursor: 'pointer', position: 'relative'}} 
        onClick={toggleSidebar}
      >
        <div style={{ transition: 'all .5s', transform: expanded ? 'none' : 'rotate(180deg)' }}>&lt;&lt;</div>
      </button>
      <div style={{
        padding: 10,
        opacity: 0.9, 
        position: 'relative',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'start',
        alignContent: 'start',
        overflowY: 'auto',
        backgroundColor: 'white',
      }}>
        {plants.map((plant, i) => (
          <Plant
            key={i}
            scale={scale}
            ratio={ratio}
            blocksize={blocksize}
            plant={plant}
            asHTML={true}
            handleDragFromSidebar={handleDragFromSidebar}
            setSelectedInventoryId={setSelectedInventoryId}
            selectedInventoryId={selectedInventoryId}
          />
        ))}
      </div>
    </div>
  )
}

export default Sidebar
