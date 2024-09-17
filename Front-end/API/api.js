const axios = require('axios');

const apiService = {
    getData: async () => {
        try {
            const response = await axios.get('http://localhost:8000'); 
            return response.data;
        } catch (error) {
            console.error('Erro ao consumir a API:', error);
            throw error;
        }
    },
    getDataById: async (id) => {
        try {
            const response = await axios.get(`http://localhost:8000/cliente/${id}`); 
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar dados da API:', error);
            throw error;
        }
    },
    postData: async (data) => {
        try {
            const response = await axios.post('http://localhost:8000/cliente', data); 
            return response.data;
        } catch (error) {
            console.error('Erro ao enviar dados para a API:', error);
            throw error;
        }
    },
    updateData: async (id, data) => {
        try {
            const response = await axios.put(`http://localhost:8000/cliente/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Erro ao atualizar dados da API:', error);
            throw error;
        }
    },
    deleteData: async (id) => {
        try {
            const response = await axios.delete(`http://localhost:8000/cliente/${id}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao excluir dados da API:', error);
            throw error;
        }
    },
    searchData: async (query) => {
        try {
            const response = await axios.get(`http://localhost:8000/search?q=${query}`); 
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar dados com base na query:', error);
            throw error;
        }
    }
};

module.exports = apiService;
