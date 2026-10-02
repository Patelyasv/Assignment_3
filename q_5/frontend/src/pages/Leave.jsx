import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Leave() {

    const [date, setDate] = useState("");
    const [reason, setReason] = useState("");
    const [grant, setGrant] = useState("No");

    const [leaves, setLeaves] = useState([]);


    const token = localStorage.getItem("token");


    // Add Leave

    const addLeave = async (e) => {

        e.preventDefault();

        try {

            await axios.post(
                "http://localhost:5000/leave",
                {
                    date: date,
                    reason: reason,
                    grant: grant
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            alert("Leave added successfully");

            setDate("");
            setReason("");
            setGrant("No");

            getLeaves();

        } catch (error) {

            alert("Error adding leave");

        }

    };


    // Get Leaves

    const getLeaves = async () => {

        const response = await axios.get(
            "http://localhost:5000/leave",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        setLeaves(response.data);

    };


    useEffect(() => {

        getLeaves();

    }, []);


    return (

        <div>

            <h1>Leave Application</h1>


            <h2>Apply for Leave</h2>

            <form onSubmit={addLeave}>

                <label>Date:</label>

                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />

                <br /><br />


                <label>Reason:</label>

                <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                />

                <br /><br />


                <label>Grant:</label>

                <select
                    value={grant}
                    onChange={(e) => setGrant(e.target.value)}
                >

                    <option value="Yes">
                        Yes
                    </option>

                    <option value="No">
                        No
                    </option>

                </select>

                <br /><br />


                <button type="submit">
                    Add Leave
                </button>

            </form>


            <hr />


            <h2>Leave List</h2>

            <table border="1" cellPadding="10">

                <thead>

                    <tr>

                        <th>Date</th>
                        <th>Reason</th>
                        <th>Grant</th>

                    </tr>

                </thead>


                <tbody>

                    {leaves.map((leave) => (

                        <tr key={leave._id}>

                            <td>
                                {leave.date}
                            </td>

                            <td>
                                {leave.reason}
                            </td>

                            <td>
                                {leave.grant}
                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>


            <br />

            <Link to="/home">
                Back to Home
            </Link>

        </div>

    );

}

export default Leave;