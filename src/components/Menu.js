import React from 'react';
import { useRef, useState } from 'react'
import { Menu as Hamburger, X, Home, MessageSquare, Check, Settings } from 'react-feather'
import { Tooltip } from 'react-tippy'

export const MENU_WIDTHS = {
  COLLAPSED: 65,
  EXPANDED: 250
}
  
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
        flexDirection: 'column',
        position: 'absolute',
        top: 0, 
        left: 0, 
        width: expanded ? MENU_WIDTHS.EXPANDED : MENU_WIDTHS.COLLAPSED,
        height: '100vh', 
        zIndex: 10,
        background: 'none',
      }}
    >
      <button 
        style={{
          height: 50,
          backgroundColor: "#4A4A4A",
          margin: 0,
          padding: 20,
          width: "100%",
          border: 0,
          textAlign: 'right',
          cursor: 'pointer',
          position: 'relative'
        }} 
        onClick={toggleMenu}
      >
        {expanded ? <X color="white" /> : <Hamburger color="white" />}
      </button>
      <ul style={{
        padding: 20,
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        listStyleType: 'none',
        opacity: 1, 
        position: 'relative',
        backgroundColor: '#4A4A4A',
        height: "100%",
        color: "white",
        overflow: "hidden",
      }}>
        <MenuItem name="home" expanded={expanded}><Home color="white" /></MenuItem>
        <MenuItem name="message board" expanded={expanded}><MessageSquare color="white" /></MenuItem>
        <MenuItem name="task list" expanded={expanded}><Check color="white" /></MenuItem>
        <MenuItem name="settings" expanded={expanded}><Settings color="white" /></MenuItem>
      </ul>
    </div>
  )
}

const MenuItem = ({ name, expanded, children }) => (
  <Tooltip title={name} trigger="mouseenter" position="right" arrow={true} offset={-10} distance={25} disabled={expanded}>
    <li style={{display: 'flex', alignItems: 'center', gap: 22, marginBottom: 20, whiteSpace: 'nowrap'}} width="100%">
      { children }{expanded && name}
    </li>
  </Tooltip>
)

export default Menu
