const token = localStorage.getItem("token");

axios.get(
    "http://localhost:5000/profile",
    {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
)
.then((response) => {

    setEmployee(response.data);

})
.catch((error) => {

    console.log(error);

    alert("Please login again");

});