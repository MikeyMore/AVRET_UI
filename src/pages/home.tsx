import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import Authenticate from '../authServises/authenticate';
import axios from 'axios';
import Footer from '../components/footer';

interface Therapist {
  full_name: string;  
  schedule: string;
}

function Home() {
  const axiosInstance = axios.create({
    baseURL: 'http://localhost:3003/avret',
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const [role, setRole] = useState<string>('');
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

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
    const fetchTherapist = async () => {
      try {
        const response = await axiosInstance.get('/therapists', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('user')}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.data;
        setTherapists(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTherapist();
  }, []);

  return (
    <div>
      {isAuthenticated === true ? (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}} >
          <Navbar role={role} />
          <h1>Welcome to AVRET</h1>
          <div style={{
          display: 'flex',
          flexDirection: 'column',
          width: '70vh'
        }}>
          <h1>About AVRET</h1>
          <h2>Welcome to AVRET (Animal Virtual Reality Exposure Therapy)</h2>
          <p>At AVRET, we are at the forefront of integrating innovative technology with compassionate care in the field of psychological therapy. Our project is dedicated to enhancing the therapeutic experience through the use of Virtual Reality (VR), specifically tailored for patients undergoing exposure therapy.</p>

          <h2>Our Mission</h2>
          <p>Our mission is to revolutionize exposure therapy by creating immersive, controlled, and safe virtual environments where patients can confront and overcome their fears and anxieties. By leveraging the power of VR, AVRET provides a unique platform where therapy can be customized to each individual’s needs, ensuring a more effective and engaging treatment process.</p>

          <h2>How AVRET Works</h2>
          <p>AVRET utilizes cutting-edge VR technology to simulate environments or situations that patients find challenging. This controlled virtual space allows for gradual exposure under the guidance of professional therapists, enabling patients to safely face their fears. The immersive nature of VR helps in creating realistic scenarios, ensuring a seamless integration of therapeutic techniques.</p>

          <h2>Who We Serve</h2>
          <p>Our primary focus is on individuals who are undergoing treatment for various phobias, anxiety disorders, and other conditions where exposure therapy is beneficial. AVRET's database-driven UI enables therapists to manage patient data effectively, track progress over time, and tailor treatments to each patient's evolving needs.</p>

          <h2>Our Commitment</h2>
          <p>We are committed to advancing the field of psychological therapy by continually updating our VR content, refining our database management system, and staying abreast of the latest research in the field. Our goal is to provide an empowering tool for both therapists and patients, fostering a path to recovery and well-being through innovative technology.</p>

          <h2>Join Us on a Journey of Healing and Empowerment</h2>
          <p>Discover how AVRET is transforming the landscape of exposure therapy and paving the way for a new era in mental health treatment. Welcome to a world where technology meets care, creating a haven for healing and growth.</p>
        </div>
        <h3>Here is a list of the Therapists and their schedule:</h3>
          <table style={{
            marginBottom: '10rem',
          }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Schedule</th>
            </tr>
          </thead>
          <tbody>
            {therapists.map((therapist, index) => (
              <tr key={index}>
                <td>{therapist.full_name}</td>
                <td>{therapist.schedule}</td>
              </tr>
            ))}
          </tbody>
        </table>
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

export default Home;