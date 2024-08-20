import React, { useEffect, useState } from "react";
import axios from "../../../../../Localhost/Custumize-axios";

const Warranties = ({name, value, onChange }) => {
  const [fillwarranties, setFillWarranties] = useState([]);
  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get("warranties");
        setFillWarranties(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    load();
  }, []);
  return (
    <>
      <select
        name={name}
        id=""
        className="form-select"
        value={value}
        onChange={onChange}
      >
        <option value="" selected hidden>
          Vui lòng thời gian bảo hành
        </option>
        {fillwarranties.map((fill, index) => (
          <option value={fill.id} key={fill.id}>
            {fill.name}
          </option>
        ))}
      </select>
    </>
  );
};

export default Warranties;
