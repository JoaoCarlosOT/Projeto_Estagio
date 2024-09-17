const express = require('express');
const session = require('express-session'); 
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const path = require('path');
const api = require('./API/api');
const authMiddleware = require('./auth/authMiddleware');

const app = express();
const port = 3000;


app.engine('handlebars', exphbs.engine({
    defaultLayout: false,
    partialsDir: path.join(__dirname, 'views', 'partials')
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
  secret: 'seu-segredo-aqui', 
  resave: false,
  saveUninitialized: true 
}));

app.get('/login', (req, res)=>{
  res.render('login');
})

app.post('/logar', (req, res) => {
  const { email, password } = req.body;
  
  
  if (email === 'admin@gmail.com' && password === '1234') {
    req.session.isAuthenticated = true; 
    res.redirect('/');
  } else {
    res.redirect('/login'); 
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Erro ao encerrar a sessão');
    }
    res.redirect('/login'); 
  });
});


app.use('/', authMiddleware);
app.use('/create', authMiddleware);
app.use('/insert', authMiddleware);
app.use('/update/:id', authMiddleware);
app.use('/edit/:id', authMiddleware);
app.use('/delete/:id', authMiddleware);
app.use('/details/:id', authMiddleware);

app.get('/', async (req, res) => {
  try {
    const clientes = await api.getData(); 
    res.render('home', { title: 'Página Inicial', clientes });
  } catch (error) {
    res.status(500).send('Erro ao buscar dados da API');
  }
});


app.get('/create', (req, res) => {
  res.render('create', { title: 'Cadastrar Novo Cliente' });
});

app.post('/insert', async (req, res) => {
  try {
    const data = {
      cliente: req.body.cliente,
      empresa: req.body.empresa,
      email: req.body.email,
      telefone: req.body.telefone,
      cpf_cnpj: req.body.cpf_cnpj
    };

    await api.postData(data);
    res.redirect('/');
  } catch (error) {
    console.error('Erro ao enviar dados para a API:', error);
    res.status(500).send('Erro ao processar o formulário');
  }
});


app.get('/update/:id', async (req, res) => {
  try {
      const id = req.params.id;
      const cliente = await api.getDataById(id); 

      if (!cliente) {
          return res.status(404).send('Cliente não encontrado');
      }

      res.render('update', { title: 'Atualizar Cliente', cliente });
  } catch (error) {
      res.status(500).send('Erro ao buscar dados do cliente');
  }
});

app.post('/edit/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const data = {
      cliente: req.body.cliente,
      empresa: req.body.empresa,
      email: req.body.email,
      telefone: req.body.telefone,
      cpf_cnpj: req.body.cpf_cnpj
    };

    await api.updateData(id, data);
    res.redirect('/');
  } catch (error) {
    console.error('Erro ao atualizar dados do cliente:', error);
    res.status(500).send('Erro ao processar a atualização');
  }
});

app.get('/delete/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await api.deleteData(id);
    res.redirect('/');
  } catch (error) {
    console.error('Erro ao excluir o cliente:', error);
    res.status(500).send('Erro ao processar a exclusão');
  }
});


app.get('/details/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const cliente = await api.getDataById(id); 

    if (!cliente) {
      return res.status(404).send('Cliente não encontrado');
    }

    res.render('details', { title: 'Detalhes do Cliente', cliente });
  } catch (error) {
    res.status(500).send('Erro ao buscar dados do cliente');
  }
});


app.get('/search', async (req, res) => {
  try {
    const query = req.query.q; 

    if (!query) {
      return res.redirect('/'); 
    }

    const clientes = await api.searchData(query);
    res.render('home', { title: 'Página Inicial', clientes }); 
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    res.status(500).send('Erro ao buscar dados');
  }
});



app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});