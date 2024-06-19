const FormData = require('../models/formData');

exports.saveFormData = async (req, res) => {
    const { userId, data } = req.body;
    try {
        let formData = await FormData.findOne({ userId: userId });
        if (formData) {
            formData.data = data;
        } else {
            formData = new FormData({ userId, data });
        }
        await formData.save();
        res.status(200).json({ message: 'Data saved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving data', error });
    }
};

exports.retrieveFormData = async (req, res) => {
    const { userId } = req.params;
    try {
        const formData = await FormData.findOne({ userId: userId });
        if (formData) {
            res.status(200).json(formData);
        } else {
            res.status(404).json({ message: 'Data not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving data', error });
    }
};
