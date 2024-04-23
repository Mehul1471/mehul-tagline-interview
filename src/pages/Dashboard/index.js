import React, { useEffect, useState } from "react";
import {
  Container,
  Divider,
  FormControlLabel,
  Paper,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
// import jsonData from "../../data/data.json";
import { jsonData } from "../../data";

const Dashboard = () => {
  const [listData, setListData] = useState(jsonData);
  const [filterFields, setFilterFields] = useState({});
  const [selectedFilter, setSelectedFilter] = useState({});

  const manageFilterFields = (data) => {
    const newData = JSON.parse(JSON.stringify(data));
    let filterFieldObj = newData.reduce((acc, curr) => {
      Object.keys(curr).forEach((key) => {
        if (!acc[key]) acc[key] = [];
        if (!acc[key].includes(curr[key])) {
          acc[key].push(curr[key]);
        }
      });
      return acc;
    }, {});
    setFilterFields(filterFieldObj);
  };

  useEffect(() => {
    if (jsonData && jsonData?.length) {
      manageFilterFields(jsonData);
    }
  }, [jsonData]);

  const getFilteredData = (filtObj) => {
    let copyMasterData = JSON.parse(JSON.stringify(jsonData));
    let newData = copyMasterData?.filter((el) => {
      return Object.keys(filtObj)?.every((key) => {
        if (Array.isArray(filtObj[key])) {
          return filtObj[key]?.length === 0 || filtObj[key].includes(el[key]);
        } else if (typeof filtObj[key] === "string") {
          return (
            filtObj[key] === "" ||
            el[key]?.toLowerCase()?.includes(filtObj[key]?.toLowerCase())
          );
        }
      });
    });
    setListData(newData);
  };

  const handleChange = (e, field) => {
    if (field) {
      let fieldName = e.target.name;
      let newData = { ...selectedFilter };
      if (!newData[field]) newData[field] = [];
      if (newData[field].includes(fieldName)) {
        let fIndex = newData[field].findIndex((el) => el === fieldName);
        if (fIndex !== -1) newData[field].splice(fIndex, 1);
      } else if (!newData[field].includes(fieldName)) {
        newData[field].push(fieldName);
      }
      setSelectedFilter(newData);
      getFilteredData(newData);
    }
  };

  const handleInputChange = (e) => {
    const fieldName = e.target.name || "name";
    let newData = { ...selectedFilter };
    newData[fieldName] = e.target.value;
    setSelectedFilter(newData);
    getFilteredData(newData);
  };

  return (
    <Container>
      <Stack gap={3}>
        <Stack
          direction="row"
          py={2}
          divider={<Divider orientation="vertical" flexItem />}
        >
          {Object.keys(filterFields).map((key) => {
            if (key !== "name" && key !== "id") {
              return (
                <Stack gap={2} key={key} flex={1} alignItems="center">
                  <Typography variant="h6" textTransform="capitalize">
                    {key}
                  </Typography>
                  <Stack gap={1}>
                    {filterFields[key].map((el, _ind) => {
                      return (
                        <FormControlLabel
                          key={_ind}
                          control={
                            <Switch
                              checked={selectedFilter[key]?.includes(el)}
                              onChange={(e) => handleChange(e, key)}
                              name={el}
                            />
                          }
                          label={el}
                        />
                      );
                    })}
                  </Stack>
                </Stack>
              );
            }
          })}
          {filterFields?.name ? (
            <Stack px={2}>
              <TextField
                id="name"
                label="name"
                variant="standard"
                onChange={handleInputChange}
              />
            </Stack>
          ) : null}
        </Stack>
        <TableContainer component={Paper} elevation={3}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                {Object.keys(filterFields).map((item) => (
                  <TableCell sx={{ borderBottom: "1px solid #000" }}>
                    <Typography variant="subtitle1" textTransform="capitalize">
                      {item}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {listData.map((row, _ind) => (
                <TableRow
                  key={_ind}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  {Object.keys(filterFields).map((item) => (
                    <TableCell>
                      <Typography
                        variant="subtitle1"
                        textTransform="capitalize"
                      >
                        {row[item]}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Container>
  );
};

export default Dashboard;
