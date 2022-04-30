import React from 'react';
import { useRef, useState } from 'react'

const Menu = () => {
  const [expanded, setExpanded] = useState(false)
  const menuRef = useRef()

  const toggleMenu = () => {
    setExpanded((expanded) => !expanded)
    menuRef.current.classList.toggle('collapsed')
  }

  return (
    <div
      ref={menuRef}
      class="menu"
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
        onClick={toggleMenu}
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
        menu
      </div>
    </div>
  )
}

export default Menu
