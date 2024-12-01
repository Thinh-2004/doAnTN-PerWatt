import React, { useEffect, useState } from "react";
import axios from "../../../../../Localhost/Custumize-axios";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

const Warranties = ({ name, value, onChange }) => {
  const [fillWarranties, setFillWarranties] = useState([]);
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
      <FormControl fullWidth size="small">
        <InputLabel id="demo-select-small-label">Bảo hành</InputLabel>
        <Select
          name={name}
          labelId="demo-select-small-label"
          id="demo-select-small"
          value={value}
          label="Bảo hành"
          onChange={onChange}
        >
          {fillWarranties.map((fill) => (
            <MenuItem value={fill.id} key={fill.id}>
              {fill.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};

export default Warranties;
