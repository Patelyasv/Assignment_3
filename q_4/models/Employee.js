const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({

    empid: {
        type: String,
        unique: true
    },

    name: String,

    email: String,

    password: String,

    salary: Number,

    hra: Number,

    da: Number,

    totalSalary: Number

});

module.exports = mongoose.model("Employee", employeeSchema);