import React,{useState, useEffect} from 'react';
import './css/style.css';

const Tempapp = () => {

    const [city, setCity] = useState(null);
    const [search, setSearch] = useState("");
    useEffect(() => {
        const fetchAPI = async () => {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${search}&units=metric&appid=1fe55f27829afc97ea60a0f3b1978686`
            const response = await fetch(url);
            const resJSON = await response.json();
            setCity(resJSON.main);
        };
        fetchAPI();
    }, [search]);
  return (
    <>
    <div className="box">
        <div className="inputData">
            <input type="search" className='inputField' placeholder='Enter city name' value={search} onChange={(event) => { setSearch(event.target.value) }} />
        </div>

        {!city ? (
            <p className='errorMsg'>No Data Found</p>
        ) : (<>
            <div className="info">
                <h2 className="location">
                    <i className="fa-solid fa-street-view icon-street"></i>{search}
                </h2>
                 {/* {city.temp>30 ? (<h4><i class="fa-solid fa-sun"></i></h4>):(<h4><i class="fa-solid fa-clouds"></i></h4>)} */}
                <h1 className="temp">{city.temp}°C</h1>
                <h3 className="tempmin_max">Min: {city.temp_min}°C | Max: {city.temp_max}°C</h3>
            </div>
            <div className="wave -one"></div>
            <div className="wave -two"></div>
            <div className="wave -three"></div>
        </>
        )}

    </div>
</>
  )
}

export default Tempapp