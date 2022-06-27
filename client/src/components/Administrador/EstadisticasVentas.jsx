import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCardStatistics } from "../../redux/actions";
import Card from "../Card/card";

export default function Estadisticas() {
  const dispatch = useDispatch();
  const videogame = useSelector((state) => state.videogames);
  const [name, setName] = useState("");

  useEffect(() => {
    dispatch(getCardStatistics(name));
  }, [dispatch, name]);

  const handleInputChange = (e) => {
    e.preventDefault();
    setName(e.target.value);
  };

let totalPrice = videogame.map((e) => e.price);
let ventasTotales = videogame.map((e) => e.contador);
let totalGanancias = 0;
for(let i = 0; i < totalPrice.length; i++){
  let ganancias = totalPrice[i]*ventasTotales[i];
  totalGanancias += ganancias;
  console.log(totalGanancias);
}

  return (
    <div>
      <input
        placeholder="Search Videogame..."
        value={name}
        type="text"
        id="inputName"
        onChange={(e) => handleInputChange(e)}
      />

     <h2> Ganancias Totales: ${(totalGanancias).toFixed(2)}</h2>
     
      {name?
        videogame.map((e) => (
          <div>
            <Card key={e.id} name={e.name} image={e.image} price={e.price} />
            <h4>Ventas: {e.contador}</h4>
            <h4>Ganancias del juego: ${(e.contador * e.price).toFixed(2)}</h4>
          </div>
        )) : null
      }
    </div>
  );
}
