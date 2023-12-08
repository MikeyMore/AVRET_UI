import React from 'react'

function Footer() {
  return (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '5vh',
        width: '100vw',
        backgroundColor: '#1a1a1a',
        color: 'white',
        marginTop: '10rem',
        position: 'fixed',
        bottom: '0',
    }}>
        <p>AVRET © 2023</p>
    </div>
  )
}

export default Footer