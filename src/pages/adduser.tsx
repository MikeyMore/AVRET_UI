import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/navbar';
import Authenticate from '../authServises/authenticate';
import '../styles/addUser.css';

function Adduser() {
    const [user, setName] = useState('');
    const [role, setRole] = useState<string>('');
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const token = localStorage.getItem('user');
    
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
        } else if (name === 'password') {
            setPassword(value);
        } else if (name === 'email') {
            setEmail(value);
        }
    };

    const handleSubmit = async () => {
        if (!user || !password || !email) {
            alert('Please fill out all fields!');
        } else {
            try {
                const response = await axiosInstance.post('/user', 
                {
                  user: user,
                  password: password,
                  email: email,
                }
            );
                return response.data;
              } catch (error) {
                console.error(error);
              }
        }
    };

    React.useEffect(() => {
        const checkAuth = async () => {
          const auth = await Authenticate('role0');
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
        {isAuthenticated ? (<div>
            <Navbar role={role}/>
           
            <div className="addUserContainer">                  <h1 style={{margin: '1rem 0'}}>Add User</h1>
                <input type="text" name="name" className="name" placeholder="User's name" value={user} onChange={handleChange} />
                <input type="password" name="password" 
                className="name" 
                placeholder='Password' value={password} onChange={handleChange} />
                <input type="email" name="email" 
                className="email"
                placeholder='Email' value={email} onChange={handleChange} />
                <input type="submit" className="submit" onClick={handleSubmit} />
            </div>
        </div>) : isAuthenticated === false ? (<div>
        <h1>You are not authorized to view this page</h1>
        <button className="submit" onClick={() => window.location.href = '/'}>Login</button>
      </div>
    ) : (
      <div>Loading...</div>
    )}
        </div>
    );
}

export default Adduser;