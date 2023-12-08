import axios from 'axios';

const Authenticate = (currentPage: string) => {
    console.log(currentPage);
    const axiosInstance = axios.create({
        baseURL: 'http://localhost:3003/avret',
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
        },
    });
    const user = localStorage.getItem('user');
    async function checkAuth(currentPage: string) {
        console.log(currentPage);
        if (user) {
        try {
            const response = await axiosInstance.post('/authenticate', {
                 currentPage: currentPage ,
              }, {
                headers: {
                  Authorization: `Bearer ${user}`,
                  'Content-Type': 'application/json',
                },
              });
            if (response.data.message === 'Authentication successful') {
                return true;
            } else {
                return false;
            }
            
        } catch(error) {
            console.error(error);
            return false;
        };
        }
    }
    return checkAuth(currentPage);
    
}

export default Authenticate;