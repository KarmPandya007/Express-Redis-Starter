import { People } from '../models/People.js'

// Controller to get all people
export const getAllPeople = async (req, res) => {
    try {
        const people = await People.find();
        res.status(200).json(people);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching people', error });
    }
};

// Controller to get a person by ID
export const getPersonById = async (req, res) => {
    try {
        const person = await People.findById(req.params.id);
        if (!person) {
            return res.status(404).json({ message: 'Person not found' });
        }
        res.status(200).json(person);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching person', error });
    }
};


// Controller to update a person by ID
export const updatePersonById = async (req, res) => {
    try {
        const updatedPerson = await People.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPerson) {
            return res.status(404).json({ message: 'Person not found' });
        }
        res.status(200).json(updatedPerson);
    } catch (error) {
        res.status(400).json({ message: 'Error updating person', error });
    }
};

// Controller to delete a person by ID
export const deletePersonById = async (req, res) => {
    try {
        const deletedPerson = await People.findByIdAndDelete(req.params.id);
        if (!deletedPerson) {
            return res.status(404).json({ message: 'Person not found' });
        }
        res.status(200).json({ message: 'Person deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting person', error });
    }
};

