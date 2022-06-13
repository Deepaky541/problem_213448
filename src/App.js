import React, { useState } from "react";
import ButtonComponent from "./components/ButtonComponent";
import CityRow from "./components/CityRow";
import "./styles.css";
import { useEffect } from "react";
import axios from "axios"



export default function App() {
  
   const [info, setinfo] = useState([]);
   const [page, setpage] = useState(1);
   const [totalcount, settotalcount] = useState(0);
   const [sortt, setsortt] = useState("ASC");
   const [error, seterror] = useState(false);
   const [loading, setloading] = useState(true);

    useEffect(() => {
      setloading(true);
      axios({
        url: `https://json-server-mocker-masai.herokuapp.com/cities?_sort=population`,
        params: {
          _order: sortt,
          _page: page,
          _limit: 10,
        },
      })
        .then((res) => {
          setinfo(res.data);
          setloading(false);
          settotalcount(Number(res.headers["x-total-count"]));
        })
        .catch((err) => {
          seterror(true);
          setloading(false);
        });
    }, [page, sortt]);
     const handlesort=()=>{
       setloading(true);
       if(sortt==="ASC")
       {
         setsortt("DESC")
       }
       else{
         setsortt("ASC")
       }
     }
     if(loading)
     {
       return <div id="loading-containe"></div>
     }
     if(error)
     {
       return <div>something went wrong!</div>
     }

  return (
    <div className="App">
      <div id="loading-container"></div>
      <table>
        <thead>
        <tr>
          <th>ID</th>
          <th>CITY NAME</th>
          <th>COUNTRY NAME</th>
          <th>POPULATION</th>
        </tr>
        </thead>
        <tbody>
        {info.map((el) => (
          <CityRow
            name={el.name}
            population={el.population}
            country={el.country}
            id={el.id}
            key={el.id}
          />
        ))}
        </tbody>
      </table>

      <div>
        <ButtonComponent
          id="SORT_BUTTON"
          title={
            sortt === "DESC"
              ? `Sort by Increasing Population`
              : "Sort by Decreasing Population"
          }
          onClick={handlesort}
        />
        <ButtonComponent
          title="PREV"
          id="PREV"
          disabled={page === 1}
          onClick={() => {
            setpage(page - 1);
            setloading(true);
          }}
        />
        <ButtonComponent
          id="NEXT"
          title="NEXT"
          disabled={totalcount <= page * 10}
          onClick={() => {
            setpage(page + 1);
            setloading(true);
          }}
        />
      </div>
    </div>
  );
}
