import axios from 'axios';
const getmessagedata = async (receiveid) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.post('http://localhost:5000/api/message/getmessage', {
            receiveid
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }


        )
        console.log(response);
        return response.data;
    }
    catch(error)
    {
        console.log(error.message);
    }

}
export default getmessagedata;