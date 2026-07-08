// Auth controller placeholder

exports.login = async (req, res, next) => {
  try {
    res.json({ message: 'Login endpoint' });
  } catch (error) {
    next(error);
  }
};

exports.register = async (req, res, next) => {
  try {
    res.json({ message: 'Register endpoint' });
  } catch (error) {
    next(error);
  }
};
