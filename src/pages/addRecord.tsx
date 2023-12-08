import React, { useEffect, useState } from 'react'
import Navbar from '../components/navbar'
import '../styles/addRecord.css'
import axios from 'axios';
import Authenticate from '../authServises/authenticate';
import Footer from '../components/footer';

interface Record {
  name: string;
  lastName: string;
  age: string;
  phone: string;
  bpm: string;
  treatment: string;
  evalDate: string;
  therapistRecord: string;
  notes: string;
}

function AddRecord() {
  const token = localStorage.getItem('user');
  const axiosInstance = axios.create({
    baseURL: 'http://localhost:3003/avret',
    timeout: 10000,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const [role, setRole] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [record, setRecord] = React.useState<Record>({
    name: '',
    lastName: '',
    age: '',
    phone: '',
    bpm: '',
    treatment: '',
    evalDate: '',
    therapistRecord: '',
    notes: '',
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setRecord((prevRecord) => ({
      ...prevRecord,
      [name]: value,
    }));
    console.log(record);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    if(!record.name || !record.lastName || !record.age || !record.phone || !record.bpm || !record.treatment || !record.evalDate || !record.therapistRecord || !record.notes) {
      alert('Please fill out all fields!'); return;
    }
    event.preventDefault();
    console.log(record);
    // TODO: submit record to API
    try {
    const response = await axiosInstance.post('patient/record', {
      full_name: record.name + ' ' + record.lastName,
      age: record.age,
      phone: record.phone,
      bpm: record.bpm,
      treatment: record.treatment,
      evalDate: record.evalDate,
      therapistRecord: record.therapistRecord,
      notes: record.notes,
    });
    if(response.status === 200) {
      alert('Record added successfully!');
      setRecord({
        name: '',
        lastName: '',
        age: '',
        phone: '',
        bpm: '',
        treatment: '',
        evalDate: '',
        therapistRecord: '',
        notes: '',
      });
    }
    } catch (error) {
      console.error(error);
      alert('Something went wrong, please try again');
    }
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
    <div>
      {isAuthenticated === true ? (
       <div>
        <Navbar role={role}/>
        <h1 className='title'>Add Record</h1>
        <form className='recordForm' onSubmit={handleSubmit}>
          <input
            className='name'
            type='text'
            name='name'
            placeholder="Patient's name"
            value={record.name}
            onChange={handleChange}
          />
          <input
            className='lastName'
            type='text'
            name='lastName'
            placeholder='Last Name'
            value={record.lastName}
            onChange={handleChange}
          />
          <input
            className='phone'
            type='text'
            name='phone'
            placeholder='Phone number'
            value={record.phone}
            onChange={handleChange}
          />
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <input
              className='age'
              type='number'
              name='age'
              placeholder='Age'
              value={record.age}
              onChange={handleChange}
            />
            <input
              className='bpm'
              type='number'
              name='bpm'
              placeholder='Highest BPM'
              value={record.bpm}
              onChange={handleChange}
            />
          </div>

          <input
            className='treatment'
            type='text'
            name='treatment'
            placeholder='Treatments'
            value={record.treatment}
            onChange={handleChange}
          />

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label className='label'>Evaluation date</label>
            <input
              className='eval'
              type='date'
              name='evalDate'
              placeholder='Evaluation date'
              value={record.evalDate}
              onChange={handleChange}
            />
          </div>
          <input
            className='therapistRecord'
            type='text'
            name='therapistRecord'
            placeholder='Therapist on evaluation'
            value={record.therapistRecord}
            onChange={handleChange}
          />

          <input
            className='notes'
            type='text'
            name='notes'
            placeholder='Notes'
            value={record.notes}
            onChange={handleChange}
          />
          <input className='submit' type='submit' />
        </form>
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

export default AddRecord;