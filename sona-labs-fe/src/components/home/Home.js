import React, { useState, useEffect } from "react";
import { Button, Container, Row, Col, Form, Card } from "react-bootstrap";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import ReactDOM from "react-dom";
import DatePicker from "../common/DatePicker";
import {
  initiateOAuth,
  fetchContacts,
  checkContacts,
} from "../common/ApiClient";

const Home = () => {
  const [contactData, setContactData] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [selectedPage, setSelectedPage] = useState(1);
  const [accessToken, setAccessToken] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [filterDate, setFilterDate] = useState({});
  const [CalendarFilterChecker, setCalendarFilterChecker] = useState(false);

  useEffect(() => {
    initialLoad();
  }, [accessToken, filterDate, CalendarFilterChecker, setFilterDate]);

  const initialLoad = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code && code.length > 10) {
      localStorage.setItem("token", code);
      setAccessToken(code);
    }
    if (accessToken && accessToken.length > 50) {
      loadContacts();
    }
  };

  function isNotNullOrUndefined(value) {
    return value !== null && value !== undefined;
  }

  const loadContacts = async () => {
    if (CalendarFilterChecker == false) {
      setTimeout(() => {
        Swal.showLoading();
      }, 1000);
    }
    let dataParams = {};
    if (CalendarFilterChecker == false) {
      dataParams = {
        date_filter: {
          selected_filter: selectedFilter,
          raw_value: filterDate,
        },
      };
    }


    
    try {
      const response = await fetchContacts(dataParams);
      if (response.response.data.error === "Access token is not available") {
        localStorage.setItem("token", ""); // Reset token
      } else {
        if (CalendarFilterChecker == false) {
          Swal.close();
        }
        setContactData(response.response.data.result.results);
        setRowCount(response.response.data.result.total);
        setSelectedFilter("");
      }
    } catch (error) {
      if (isNotNullOrUndefined(error.response)) {
        console.log(error)
        Swal.fire({
          title: error.response.data.message,
          html: `API Response: ${error.response.data.result} <br><b>Try connecting again</b><br><br><button onclick="window.location.href = window.location.href.split('?')[0]" style="background-color: #4D60C5; border: none; color: white; padding: 10px 20px; cursor: pointer; border-radius: 6px;">Connect</button>`,
          icon: "error",
          showConfirmButton: false, // Hide the default confirm button
        });
        
      }
    }
  };


  
  const getNumberOfPages = (rowCount, rowsPerPage) => {
    return Math.ceil(rowCount / rowsPerPage);
  };

  const toPages = (pages) => {
    return Array.from({ length: pages }, (_, i) => i + 1);
  };

  const columns = [
    { name: "Email", selector: (row) => row.email, sortable: true },
    { name: "First Name", selector: (row) => row.firstName, sortable: true },
    { name: "Last Name", selector: (row) => row.lastName, sortable: true },
    {
      name: "Customer Date",
      selector: (row) => row.customerDate,
      sortable: true,
    },
    { name: "Lead Date", selector: (row) => row.leadDate, sortable: true },
  ];

  const showDatePicker = () => {
    setCalendarFilterChecker(true);
    Swal.fire({
      title: "<strong>Filter Contacts</strong>",
      html: '<div id="datepicker-container"></div>',
      showCloseButton: false,
      focusConfirm: false,
      width: 900,
      allowOutsideClick: false,
      allowEscapeKey: false,
      customClass: {
        confirmButton: "hiddenthis", // Add your custom class here
      },
      didOpen: () => {
        ReactDOM.render(
          <DatePicker
            handleSetFilterDate={handleSetFilterDate}
            handleClose={handleClose}
          />,
          document.getElementById("datepicker-container")
        );
      },
    });
  };

  const handleSetFilterDate = (ranges) => {
    setFilterDate(ranges);
  };

  const handleSelectChange = (event) => {
    setSelectedFilter(event.target.value);
    showDatePicker();
  };

  const handleClose = () => {
    setCalendarFilterChecker(false);
    loadContacts();
    Swal.close();
  };

  const BootyPagination = ({
    rowsPerPage,
    rowCount,
    onChangePage,
    currentPage,
  }) => {
    const handlePageChange = (page) => {
      onChangePage(page);
    };

    const pages = getNumberOfPages(rowCount, rowsPerPage);
    const pageItems = toPages(pages);

    return (
      <Row>
        <Col sm={4}>
          <ul className="pagination">
            <li className="page-item">
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{ color: "black", fontWeight: "bold" }}
              >
                <img
                  src="/left-arrow.png"
                  style={{ height: "20px" }}
                  alt="Left Arrow Icon"
                />{" "}
                <span>Previous</span>
              </button>
            </li>
          </ul>
        </Col>
        <Col sm={4} className=" d-flex justify-content-center">
          {" "}
          {/* Added 'd-flex justify-content-center' classes */}
          <ul className="pagination">
            {pageItems.map((page) => (
              <li
                key={page}
                className={`page-item ${page === currentPage ? "active" : ""}`}
              >
                <Button
                  style={{ backgroundColor: "#F9FAFB", color: "black" }}
                  className="page-link"
                  onClick={() => handlePageChange(page)}
                >
                  <span>{page}</span>
                </Button>
              </li>
            ))}
          </ul>
        </Col>
        <Col sm={4} className=" d-flex justify-content-end">
          {" "}
          {/* Add 'd-flex justify-content-end' classes */}
          <ul className="pagination">
            <li className="page-item">
              <Button
                className="page-link"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pageItems.length}
                style={{ color: "black", fontWeight: "bold" }}
              >
                <span>Next</span>{" "}
                <img
                  src="/right-arrow.png"
                  style={{ height: "20px" }}
                  alt="Right Arrow Icon"
                />
              </Button>
            </li>
          </ul>
        </Col>
      </Row>
    );
  };

  return (
    <Container style={{ marginTop: "5rem" }}>
      <Card>
        <Card.Body>
          <Row style={{ height: "71px", marginTop: "15px" }}>
            <Col sm={7} className="" style={{ textAlign: "left" }}>
              <h4>Data</h4>
            </Col>
            <Col sm={5} className="">
              <Row>
                <Col sm={9}>
                  <Form.Group controlId="formBasicSelect">
                    <Form.Control
                      as="select"
                      value={selectedFilter}
                      onChange={handleSelectChange}
                    >
                      <option value="">Select Filter</option>
                      <option value="customer_date">Customer Date</option>
                      <option value="lead_date">Lead Date</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col sm={3}>
                  <Button style={{backgroundColor:"#4A6AF2"}} onClick={initiateOAuth}>Connect</Button>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col>
              <DataTable
                columns={columns}
                data={contactData}
                pagination
                paginationComponent={BootyPagination}
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Home;
