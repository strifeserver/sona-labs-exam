import React, { useState, useEffect } from "react";
import { DateRangePicker } from "react-date-range";
import { Button, Container, Row, Col, Form } from "react-bootstrap";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import Swal from "sweetalert2";


const DatePicker = ({ handleSetFilterDate, handleClose }) => {
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  useEffect(() => {
    handleSetFilterDate(selectionRange);
  }, [selectionRange, handleSetFilterDate]);

  const formatDate = (date) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  const [year, setYear] = useState(new Date().getFullYear());

  const handleSelect = (ranges) => {
    setSelectionRange(ranges.selection);
  };

  const handleYearChange = (selectedYear) => {
    setYear(selectedYear);
    setSelectionRange({
      ...selectionRange,
      startDate: new Date(
        selectedYear,
        selectionRange.startDate.getMonth(),
        selectionRange.startDate.getDate()
      ),
      endDate: new Date(
        selectedYear,
        selectionRange.endDate.getMonth(),
        selectionRange.endDate.getDate()
      ),
    });
  };

  return (
    <Container className="date-picker-container">
      <Row>
        <Col sm="2" className="">
          <YearSelector onYearChange={handleYearChange} selectedYear={year} />
        </Col>
        <Col sm="10" className="" style={{ paddingLeft: "0px" }}>
          <DateRangePicker
            className=""
            ranges={[selectionRange]}
            onChange={handleSelect}
            months={2}
            direction="horizontal"
            showMonthAndYearPickers={false}
            minDate={new Date(year, 0, 1)}
            maxDate={new Date(year, 11, 31)}
            focusedRange={[0, 0]}
          />
          <Row>
            <Col sm="8" className="">
              <div
                className="date-inputs"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "300px",
                }}
              >
                <Form.Control
                  type="text"
                  value={formatDate(selectionRange.startDate)}
                  readOnly
                  style={{
                    width: "136px",
                    height: "44px",
                    margin: "5px",
                    fontSize: "14px",
                    textAlign: "center",
                  }}
                />
                <span style={{ lineHeight: "3" }}> - </span>
                <Form.Control
                  type="text"
                  value={formatDate(selectionRange.endDate)}
                  readOnly
                  style={{
                    width: "136px",
                    height: "44px",
                    margin: "5px",
                    fontSize: "14px",
                    textAlign: "center",
                  }}
                />
              </div>
            </Col>
            <Col sm="4" className="">
              <Row>
                <Col sm="12" style={{marginRight: "0px"}}>
                  <Button
                    onClick={() => Swal.close()}
                    style={{
                      backgroundColor: "white",
                      color: "black",
                      borderBlockColor: "gray",
                    }}
                  >
                    Cancel
                  </Button>
                  &nbsp;&nbsp;&nbsp;
                  <Button
                    onClick={handleClose}
                    style={{
                      backgroundColor: "#4D60C5",
                      borderBlockColor: "gray",
                    }}
                  >
                    Apply
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>{/* <Col sm="2" className=""></Col> */}</Row>
    </Container>
  );
};

const YearSelector = ({ onYearChange, selectedYear }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from(new Array(20), (val, index) => currentYear - index);

  return (
    <div className="custom-scrollbar" style={{ textAlign: 'left' }}>
      {years.map((year) => (
        <div
          key={year}
          className={`year ${year === selectedYear ? 'active' : ''}`}
          onClick={() => onYearChange(year)}
        >
          {year}
        </div>
      ))}
    </div>
  );
};

export default DatePicker;
