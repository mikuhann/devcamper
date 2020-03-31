module.exports = {
  getBootcamps: async (req, res) => {
    return res.status(200).json({
      success: true,
      msg: 'Show all bootcamps',
    });
  },
  getBootcamp: async (req, res) => {
    const { id } = req.params;

    return res.status(200).json({
      success: true,
      msg: `Show bootcamp with ${id}`,
    });
  },
  addBootcamp: async (req, res) => {
    return res.status(200).json({
      success: true,
      msg: 'Create new bootcamp',
    });
  },
  updateBootcamp: async (req, res) => {
    const { id } = req.params;

    return res.status(200).json({
      success: true,
      msg: `Update bootcamp with ${id}`,
    });
  },
  deleteBootcamp: async (req, res) => {
    const { id } = req.params;

    return res.status(200).json({
      success: true,
      msg: `Delete bootcamp with ${id}`,
    });
  }

}