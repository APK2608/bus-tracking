// Location controller placeholder

exports.getLocations = async (req, res, next) => {
  try {
    res.json({ message: 'Get locations' });
  } catch (error) {
    next(error);
  }
};

exports.updateLocation = async (req, res, next) => {
  try {
    res.json({ message: 'Update location' });
  } catch (error) {
    next(error);
  }
};
