import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { People } from '../models/People.js'

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let person = await People.findOne({ email });
        if (person) {
            return res.status(400).json({
                message: "User already exists"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        person = await People.create({
            name, email, password: hashedPassword
        })
        res.status(201).json({
            message: "Person addded successfully"
        })
    } catch (error) {
        res.send("Error", error.message)
    }
}

export const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;

        let person = await People.findOne({ email });

        if (!person) {
            return res.status(400).json({
                message: "User doesn't exist"
            });
        }

        const isMatch = await bcrypt.compare(password, person.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid Creadentials"
            });
        }

        // JWT Token Creation

        const token = jwt.sign(
            { id: person._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login Successful",
            token,
            person
        });

    } catch (error) {
        res.send("Error", error.message);
        console.log(`Error: ${error.message}`)
    }

}