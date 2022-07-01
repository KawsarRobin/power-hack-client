import { useEffect, useState } from 'react';
import { Button, Form, Modal, Table } from 'react-bootstrap';
import Pagination from 'react-bootstrap/Pagination';

const Layout = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [bills, setBills] = useState([]);
  const [matchedBillings, setMatchedBillings] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(0);

  const handleName = (e) => {
    setName(e.target.value);
  };
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handlePhone = (e) => {
    const value = e.target.value;
    const validatedValue = value.replace(/[^0-9]/g, '');
    setPhone(validatedValue);
  };
  const handlePaidAmount = (e) => {
    setPaidAmount(e.target.value);
  };

  let active = page;
  let items = [];
  for (let number = 0; number < pageCount; number++) {
    items.push(
      <Pagination.Item
        onClick={() => setPage(number)}
        key={number}
        active={number === active}
      >
        {number + 1}
      </Pagination.Item>
    );
  }
  const size = 10;

  //   Handling Search
  const handleSearch = (e) => {
    const searchText = e.target.value;
    const matchedBillings = bills.filter((bill) =>
      bill.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setMatchedBillings(matchedBillings);
  };

  //   Loading all bills
  useEffect(() => {
    fetch(
      `https://fathomless-plains-85816.herokuapp.com/billing-list?page=${page}&&size=${size}`
    )
      .then((res) => res.json())
      .then((data) => {
        setBills(data.bills);
        setMatchedBillings(data.bills);
        const count = data.count;
        const pageNumber = Math.ceil(count / size);
        setPageCount(pageNumber);
      });
  }, [isLoading, page]);

  //   Total paid
  useEffect(() => {
    const total = bills.reduce(
      (previous, bill) => previous + parseFloat(bill.paidAmount),
      0
    );
    setTotalAmount(total);
  }, [bills]);

  //   Posting single bill to db
  const handleSubmit = (e) => {
    e.preventDefault();
    const bill = {
      name: name,
      email: email,
      phone: phone,
      paidAmount: parseFloat(paidAmount),
    };
    fetch('https://fathomless-plains-85816.herokuapp.com/add-billing', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(bill),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.insertedId) {
          alert('New bill added Successfully');
          handleClose();
          setIsLoading(false);
        }
      });
  };

  return (
    <div>
      <div>
        <nav className="navbar navbar-light bg-light">
          <div className="container">
            <h3>PowerHack</h3>
            <h6>Paid Total: {totalAmount}</h6>
          </div>
        </nav>
      </div>
      <div className="overflow-auto p-2 mt-5">
        <div>
          <nav className="navbar navbar-light bg-light">
            <div className="container-fluid">
              <form className="d-flex w-50">
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  onChange={handleSearch}
                />
              </form>
              <div>
                <Button variant="dark" onClick={handleShow}>
                  Add New Bills
                </Button>

                <Modal show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title className="text-center">
                      Please, Add New Bills
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                      <Form.Label>
                        Please, Provide All Information Correctly
                      </Form.Label>
                      <Form.Control
                        onChange={handleName}
                        className="mb-4"
                        required
                        type="text"
                        placeholder="Full Name"
                      />
                      <Form.Control
                        onChange={handleEmail}
                        className="mb-4"
                        required
                        type="email"
                        placeholder="Email"
                      />

                      <Form.Control
                        onChange={handlePhone}
                        className="mb-4"
                        required
                        type="tel"
                        step="any"
                        minLength={11}
                        maxLength={11}
                        placeholder="Phone"
                      />
                      <Form.Control
                        onChange={handlePaidAmount}
                        className="mb-4"
                        required
                        step="any"
                        min="1"
                        type="number"
                        placeholder="Paid Amount"
                      />
                      <Form.Control className="mb-4" required type="submit" />
                    </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="danger" onClick={handleClose}>
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>
            </div>
          </nav>
        </div>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Billing id</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Paid Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {matchedBillings.map((bill, index) => (
              <tr key={bill._id}>
                <td>{bill._id}</td>
                <td>{bill.name}</td>
                <td>{bill.email}</td>
                <td>{bill.phone}</td>
                <td>{bill.paidAmount}</td>

                <td>
                  <button className="btn btn-secondary m-1">Edit</button>
                  <button className="btn btn-danger m-1">delete</button>
                </td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <div className="ms-5">
        <Pagination>{items}</Pagination>
      </div>
    </div>
  );
};

export default Layout;
