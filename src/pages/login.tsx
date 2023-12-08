import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../styles/login.css";

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3003/avret',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const Login = () => {
    const nav = useNavigate();
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (name === 'username') {
            setUser(value);
        } else if (name === 'password') {
            setPassword(value);
        }
    };

    const handleLogin = async () => {
        if (!user || !password) {
            alert('Please fill out all fields!');
        } else {
            try {
                const response = await axiosInstance.post('/login', {
                user,
                password,
                });
                if (response.data.token) {
                    
                    localStorage.setItem('user', JSON.stringify(response.data.token));
                    localStorage.setItem('role', JSON.stringify(response.data.role).replace(/['"]+/g, ""));
                    console.log(localStorage.getItem('role'));
                    nav('/home');
                } else {
                    alert('Wrong username or password!');
                }
            } catch (error: any) {
                if (error.response.status === 401) {
                    alert('Wrong username or password!');
                } else { alert('Something went wrong!\n'+ error); }
                console.error(error);
            }
        }
    };

    useEffect(() => {console.log( "Username and password: "+ user + "  "+ password)}, [user, password]);

    return (
        <div className='login_container'>
            <div className='login'>
                <div className='logo'></div>
                <h1>AVRET</h1>
                <input type='text'className='username' name='username' placeholder='username' value={user} onChange={handleChange} />
                <input type='password' className='password' name='password' placeholder='password' value={password} onChange={handleChange}/>
                <input className='submit' type='submit' value='Log in' onClick={handleLogin} />
            </div>
        </div>
    );
};

export default Login;