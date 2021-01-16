const fetchData = () => {
    axios.get("https://omdbapi.com/",{params : {apikey : "99e262a4" , s : "avengers"}})
    .then((response)=>{
        console.log(response.data)
    })
    .catch((err)=>{
        console.log(err)
    });
};

fetchData();
