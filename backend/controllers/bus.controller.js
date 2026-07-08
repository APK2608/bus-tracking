// Bus controller placeholder

exports.getBuses = async (req, res, next) => {
  try {
    res.json({ message: 'Get buses' });
  } catch (error) {
    next(error);
  }
};

exports.createBus = async (req, res, next) => {
  try {
    res.json({ message: 'Create bus' });
  } catch (error) {
    next(error);
  }
};
