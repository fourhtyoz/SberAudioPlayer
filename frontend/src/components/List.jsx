import React, { useEffect, useState } from "react";
import { getItems } from "../utils/api";


export default function List() {
    const [items, setItems] = useState([]);

    useEffect(() => {
      const fetchItems = async () => {
        const data = await getItems();
        setItems(data);
      };
  
      fetchItems();
    }, []);

    return (
        <>
            <h1>Items</h1>
            <ul>
            {items.map(item => (
                <li key={item.id}>
                {item.name}: {item.description}
                </li>
            ))}
            </ul>
        </>

    )
}
