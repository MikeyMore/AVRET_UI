import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../styles/patients.css";
import Navbar from '../components/navbar';
import Authenticate from '../authServises/authenticate';
import Footer from '../components/footer';

interface Patient {
  full_name: string;
  phone: string;
  birthdate: string;
  email: string;
  person_id: string;
  Address1: string;
  Address2: string;
  City: string;
  zipcode: string;
  recent_evaluation: [{}];
}

interface Evaluation {
  age: number;
  eval_date: string;
  eval_id: number;
  full_name: string;
  h_bpm: number;
  notes: string;
  person_id: string;
  therapist_name: string;
  treatments: string;
}

function Patients() {
  const [role, setRole] = useState<string>('');
  const [selectedPatient, setSelectedPatient] = React.useState<Patient>();
  const [recentEvaluation, setRecentEvaluation] = useState<Evaluation | null>(null); 
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [viewPatient, setViewPatient] = React.useState(false);
  const [patients, setPatients] = React.useState<Patient[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [viewEvaluations, setViewEvaluations] = React.useState(false);

  useEffect(() => {
    const results = patients.filter(patient =>
      patient.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(patient.birthdate).toLocaleDateString().includes(searchTerm)
    );
    setFilteredPatients(results);
    if (searchTerm === '') {
      const fetchPatients = async () => {
        try {
          const response = await axiosInstance.get('/patients');
          setPatients(response.data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchPatients();
    }
  }, [searchTerm, patients]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleBack = () => { 
    setViewPatient(false);
    setSelectedPatient(undefined);
    setViewEvaluations(false);
    setEvaluations([]);
    setRecentEvaluation(null);
  }

  const axiosInstance = axios.create({
    baseURL: 'http://localhost:3003/avret',
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  const handleClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setViewPatient(true);
  }

  React.useEffect(() => {
    const recentEvaluation = async () => {
      try {
        const response = await axiosInstance.get(`/recent-evaluation`, {
          params: {
            person_id: selectedPatient?.person_id,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('user')}`,
            'Content-Type': 'application/json',
          },
        });
        setRecentEvaluation(response.data[0]);
      } catch (error) {
        console.error(error);
      }
    }
    
    const getEvaluations = async () => {
      try {
        const response = await axiosInstance.get(`/evaluation`, {
          params: {
            person_id: selectedPatient?.person_id,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('user')}`,
            'Content-Type': 'application/json',
          },
        });
        setEvaluations(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    if (selectedPatient){
      recentEvaluation();
      getEvaluations();
    } else {
      setRecentEvaluation(null);
      setEvaluations([]);
    }
    
  }, [selectedPatient, viewPatient, viewEvaluations]);

  React.useEffect(() => {
    if (viewPatient === true) {
      setRecentEvaluation(null);
      setEvaluations([]);
    }

  }, [selectedPatient]);
  React.useEffect(() => {
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
    const fetchPatients = async () => {
      try {
        const response = await axiosInstance.get('/patients'
        , {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('user')}`,
            'Content-Type': 'application/json',
          },
        });
        setPatients(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPatients();
  }, []);
  if (viewPatient && isAuthenticated) {
    return (<div>{viewPatient && (
      <div>
        <Navbar role= {role}/>
        <button style={
          {
            backgroundColor: 'white',
            color: 'black',
            border: '2px solid #4CAF50',
            borderRadius: '12px',
            padding: '10px 24px',
            fontSize: '16px',
            margin: '10px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'row',
          }
        } onClick={handleBack}>Back</button>
        <div style={{
          display: 'flex',
          width: 'auto',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '10px',
          padding: '10px',
          border: '2px solid #4CAF50',
          borderRadius: '12px',
          backgroundColor: 'white',
          boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',

          }}>
        <h2>{selectedPatient?.full_name}</h2>
        <p>Phone: {selectedPatient?.phone}</p>
        <p>Birthdate: {selectedPatient?.birthdate ? new Date(selectedPatient.birthdate).toLocaleDateString() : ''}</p>
        <p>Email: {selectedPatient?.email}</p>
        <p>Address: {selectedPatient?.Address1}</p>
        <p>Apt/Unit: {selectedPatient?.Address2}</p>
        <p>City: {selectedPatient?.City}</p>
        <p>Zipcode: {selectedPatient?.zipcode}</p>
        <p>Patient Id: {selectedPatient?.person_id}</p>
        </div>
        {recentEvaluation ? 
         <div style={{
          display: 'flex',
          width: 'auto',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '10px',
          padding: '10px',
          border: '2px solid #4CAF50',
          borderRadius: '12px',
          backgroundColor: 'white',
          boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
          }}>
          <h2>Most Recent Evaluation</h2>
          <p><strong>Treatment: </strong>{recentEvaluation.treatments}</p>
          <p><strong>Highest BPM: </strong>{recentEvaluation.h_bpm}</p>
          <p><strong>Notes: </strong> {recentEvaluation.notes}</p>
          <p><strong>Date of evaluation: </strong>{recentEvaluation.eval_date ? new Date(recentEvaluation.eval_date).toLocaleDateString() : ''}</p>
          <p><strong>Therapist: </strong>{recentEvaluation.therapist_name}</p>
        </div>
      : <div >
          <h2>No recent evaluation</h2>
        </div>}
        <button className='submit' style={{
          margin: '3rem 0',
        }} onClick={() => setViewEvaluations(!viewEvaluations)}>
          View all evaluations
        </button>
        {viewEvaluations ? <div
        style={{
          display: 'flex',
          width: 'auto',
          height: 'auto',
          bottom: '10rem',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '10px',
          padding: '10px',
          border: '2px solid #4CAF50',
          borderRadius: '12px',
          backgroundColor: 'white',
          boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
          }}>
            <h2>Evaluations</h2>
            {evaluations.length > 0 ? <table className='patientTable'>
              <tr>
                <th>Date</th>
                <th>Treatment</th>
                <th>Highest BPM</th>
                <th>Notes</th>
                <th>Therapist</th>
              </tr>
              {evaluations.map((evaluation) => (
                <tr className='patientRow'>
                  <td>{new Date(evaluation.eval_date).toLocaleDateString()}</td>
                  <td>{evaluation.treatments}</td>
                  <td>{evaluation.h_bpm}</td>
                  <td>{evaluation.notes}</td>
                  <td>{evaluation.therapist_name}</td>
                </tr>
              ))}
            </table> : <div><h3>No evaluations for this patient</h3></div>    }
        </div> : <div></div>}
      </div>
    )}</div>)
  } else if (isAuthenticated) {
    return (
      <div>
        <Navbar role={role} />
        <div className='patientList'>
          <h1>Patients</h1>
          <p>Search by name, email, or birthdate</p>
          <input type='text' placeholder='Search...'
          className='searchBar' 
          value={searchTerm}
          onChange={handleChange}/>
          <table className='patientTable'>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Birthday</th>
              <th>Email</th>
            </tr>
            {filteredPatients.map((patient)=>(
              <tr className='patientRow' onClick={() =>handleClick(patient)}>
                <td>{patient.full_name}</td>
                <td>{patient.phone}</td>
                <td>{new Date(patient.birthdate).toLocaleDateString()}</td>
                <td>{patient.email}</td>
              </tr>
            ))}
          </table>
        </div>
        <Footer />
      </div>
    );
  } else { 
    return(isAuthenticated === false ? (
      <div>
        <h1>You are not authorized to view this page</h1>
        <button className="submit" onClick={() => window.location.href = '/'}>Login</button>
      </div>
    ) : (
      <div>Loading...</div>
    ));
  }
}

export default Patients;