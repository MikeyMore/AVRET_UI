import React from 'react'
import { Link } from 'react-router-dom'
import "../styles/navbar.css"
import ProfileIcon from '../assets/icons8-male-user-24.png'
import Logo from '../assets/AVRETLOGO.png'

function Navbar({role}: {role: string}) {
  const logout = () => {
    localStorage.removeItem('user');
  };
  return (
    <div className='navbar'>
      <div className='profile-icon' style={{display: 'flex',
      justifyContent: 'start',
      marginLeft: '1rem'}}>
            <img src={Logo} alt='profile icon'/>
      </div>
        <div className="links">
        
            <Link className='link' to='/' onClick={logout}>Log out</Link>
            <Link className='link' to='/home'>Home</Link>
            <Link className='link' to='/addRecord'>New Evaluation</Link>
            <Link className='link' to='/addPatient'>New Patient</Link>
            <Link className='link' to='/patients'>Patients</Link>
            {role === 'role0' ? <Link className='link' to='/adduser'>Admin</Link> : null}

        </div>
        
    </div>
  )
}

export default Navbar