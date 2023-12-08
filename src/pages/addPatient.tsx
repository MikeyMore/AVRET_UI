import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/navbar';
import '../styles/addPatient.css';
import Authenticate from '../authServises/authenticate';
import Footer from '../components/footer';

function AddPatient() {
  const token = localStorage.getItem('user');
  const [role, setRole] = useState<string>('');
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [address, setAddress] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const axiosInstance = axios.create({
    baseURL: 'http://localhost:3003/avret',
    timeout: 5000,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === 'name') {
      setName(value);
    } else if (name === 'lastName') {
      setLastName(value);
    } else if (name === 'email') {
      setEmail(value);
    } else if (name === 'phone') {
      setPhone(value);
    } else if (name === 'birthdate') {
      setBirthdate(value);
    } else if (name === 'address') {
      setAddress(value);
    } else if (name === 'address2') {
      setAddress2(value);
    } else if (name === 'city') {
      setCity(value);
    } else if (name === 'zip') {
      setZip(value);
    }
  };

  const handleSubmit = async () => {
    if (!name || !lastName || !email || !phone || !birthdate || !address || !city || !zip) {
      alert('Please fill out all fields!');
    } else {
    try {
        const response = await axiosInstance.post('/person', {
          name: name + ' ' + lastName,
          email: email,
          phone: phone,
          birthdate: birthdate,
          address: address,
          address2: address2,
          city: city,
          zip: zip,
        });
        if (response.status === 200) {
          alert('Patient added!');
          console.log(response.data);
        }
        // Redirect to success page
      } catch (error) {
        alert('Something went wrong!\n' + error);
        console.error(error);
      }
    };
  };

  useEffect(() => {
    const checkAuth = async () => {
      const auth = await Authenticate('role1');
      if (auth === true) {
        setIsAuthenticated(true);
        setRole(localStorage.getItem('role') || '');
      } else {
      setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <div style={{
      height: '100%',
    }}>
      {isAuthenticated === true ? (
      <div style={{
          height: '100vh',
        }}>
        <Navbar role={role} />
        <h1 className='title'>Add Patient</h1>
        <div className='patientForm'>
          <input
            className='name'
            type='text'
            name='name'
            placeholder="Patient's name"
            value={name}
            onChange={handleChange}
          />
          <input
            className='lastName'
            type='text'
            name='lastName'
            placeholder='Last Name'
            value={lastName}
            onChange={handleChange}
          />
          <input
            className='email'
            type='email'
            name='email'
            placeholder='Email'
            value={email}
            onChange={handleChange}
          />
          <input
            className='phone'
            type='phone'
            name='phone'
            placeholder='Phone number'
            value={phone}
            onChange={handleChange}
          />
          <div
            className='bd'
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'left' }}
          >
            <label className='label'>Birthdate</label>
            <input
              className='bdinput'
              type='date'
              name='birthdate'
              placeholder='Evaluation date'
              value={birthdate}
              onChange={handleChange}
            />
          </div>
          <input
            className='address'
            type='text'
            name='address'
            placeholder='Address'
            value={address}
            onChange={handleChange}
          />
          <input
            className='address2'
            type='text'
            name='address2'
            placeholder='Apt/Unit'
            value={address2}
            onChange={handleChange}
          />
          <div style={{ display: 'flex', justifyContent: 'start' }}>
            <input
              className='city'
              type='text'
              name='city'
              placeholder='City'
              value={city}
              onChange={handleChange}
            />
            <input
              className='zip'
              type='text'
              name='zip'
              placeholder='Zip'
              value={zip}
              onChange={handleChange}
            />
          </div>
  
          <input className='submit' type='submit' value='Submit' onClick={handleSubmit} />
        
        </div>
        <Footer />
      </div>
      
      ) : isAuthenticated === false ? (
        <div>
          <h1>You are not authorized to view this page</h1>
          <button className="submit" onClick={() => window.location.href = '/'}>Login</button>
        </div>
      ) : (
        <div>Loading...</div>
      )}

    </div>
  );
}

export default AddPatient;