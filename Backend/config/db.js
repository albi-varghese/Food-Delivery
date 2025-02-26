import mongoose from "mongoose"

export const connectDB = async() => {
    await mongoose.connect('mongodb+srv://food-app:albi4652@cluster0.vioz3.mongodb.net/food-app').then(()=>console.log("DB Connected"));
}