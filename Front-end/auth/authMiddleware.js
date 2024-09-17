// middlewares/authMiddleware.js
module.exports = (req, res, next) => {
    if (req.session && req.session.isAuthenticated) {
      return next(); // Usuário autenticado, continue para a próxima rota
    }
    res.render('login'); // Redireciona para a página de login se não estiver autenticado
  };
  