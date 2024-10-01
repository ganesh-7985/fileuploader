const sharp = require('sharp');

const manipulateImage = async (req, res) => {
  const { filePath } = req.body;

  try {
    const outputFilePath = 'uploads/modified-' + Date.now() + '.jpg';

    sharp(filePath)
      .resize(300, 300)
      .toFile(outputFilePath, (err) => {
        if (err) return res.status(500).json({ message: 'Image manipulation failed', err });
        res.json({ modifiedPath: outputFilePath });
      });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = { manipulateImage };

const getAllFiles = async (req, res) => {
  try {
    const files = await File.find();
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve files', error });
  }
};


