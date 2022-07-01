import { useEffect, useState } from 'react';
import { Button, Form, Modal, Table } from 'react-bootstrap';
import Pagination from 'react-bootstrap/Pagination';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

const Layout = () => {
  const [allBills, setAllBills] = useState([]);
  const [show, setShow] = useState(false);
  const [lgShow, setLgShow] = useState(false);
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
  const [singleBill, setSingleBill] = useState({});

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  //   handling two function clicks
  const handleTwoOnclick = (id) => {
    const matchedBill = allBills.filter((bill) => bill._id === id);
    setSingleBill(matchedBill[0]);
    setLgShow(true);
    reset();
  };

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

  //   Pagination
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
    const matchedBillings = allBills.filter((bill) =>
      bill.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setMatchedBillings(matchedBillings);
  };

  //   Load all bills
  useEffect(() => {
    fetch(`https://fathomless-plains-85816.herokuapp.com/billing-listing`)
      .then((res) => res.json())
      .then((data) => setAllBills(data));
  }, [isLoading]);

  //   Loading all bills with pagination
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
    const total = allBills.reduce(
      (previous, bill) => previous + parseFloat(bill.paidAmount),
      0
    );
    setTotalAmount(total);
  }, [isLoading, allBills]);

  //   Posting single bill to db
  const handleSubmitForm = (e) => {
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

  // Update Billing
  const onSubmit = (data) => {
    const updatedBill = data;
    fetch(
      `https://fathomless-plains-85816.herokuapp.com/update-billing/${data.id}`,
      {
        method: 'PUT',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(updatedBill),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.modifiedCount > 0) {
          alert('Order Status updated to Approved Successfully');
          setIsLoading(false);
          setLgShow(false);
          reset();
        }
      })
      .catch((err) => console.log(err.message));
  };

  // Deleting bills by id
  const handleDelete = (id) => {
    if (window.confirm('Are you sure to delete?')) {
      const url = `https://fathomless-plains-85816.herokuapp.com/delete-billing/${id}`;
      fetch(url, {
        method: 'DELETE',
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.deletedCount > 0) {
            alert('You have successfully deleted billings!!');
            const remainingBills = bills.filter((bill) => bill._id !== id);
            setBills(remainingBills);
            setIsLoading(false);
          }
        })
        .catch((err) => console.log(err.message));
    }
  };

  return (
    <div>
      <div>
        <nav className="navbar navbar-light bg-light">
          <div className="container">
            <h3>PowerHack</h3>
            <div className="d-flex ">
              <h5 className="m-4">Paid Total: {totalAmount}</h5>
              <Link className="text-decoration-none m-3" to="/login">
                <Button>Login</Button>
              </Link>
            </div>
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
                    <Form onSubmit={handleSubmitForm}>
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
                <Modal
                  size="lg"
                  show={lgShow}
                  onHide={() => setLgShow(false)}
                  aria-labelledby="example-modal-sizes-title-lg"
                >
                  <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                      Provide Information to Update
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <input
                        defaultValue={singleBill._id}
                        readOnly
                        className="form-control mb-4"
                        {...register('id', { required: true })}
                      />
                      <input
                        defaultValue={singleBill.name}
                        placeholder="Full Name"
                        required
                        className="form-control mb-4"
                        {...register('name', { required: true })}
                      />
                      {errors.firstName?.type === 'required' &&
                        'Full name is required'}
                      <input
                        defaultValue={singleBill.email}
                        placeholder="Email"
                        required
                        className="form-control mb-4"
                        {...register('email', {
                          required: 'Email Address is required',
                        })}
                      />
                      <p>{errors.mail?.message}</p>
                      <input
                        defaultValue={singleBill.phone}
                        placeholder="Phone"
                        required
                        type="number"
                        className="form-control mb-4"
                        {...register('phone', {
                          required: true,
                          maxLength: 11,
                        })}
                      />
                      {errors.phone && <p>Phone is required</p>}
                      <input
                        defaultValue={singleBill.paidAmount}
                        placeholder="Paid Amount"
                        required
                        className="form-control mb-4"
                        {...register('paidAmount', { required: true })}
                      />
                      {errors.lastName && <p>Paid Amount is required</p>}

                      <input className="btn btn-warning" type="submit" />
                    </form>
                  </Modal.Body>
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
                  <Button
                    variant="dark"
                    onClick={() => handleTwoOnclick(bill._id)}
                  >
                    Edit
                  </Button>
                  <button
                    onClick={() => handleDelete(bill._id)}
                    className="btn btn-danger m-1"
                  >
                    delete
                  </button>
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
      <div>
        <h6 className="text-center pt-5 fw-bolder">
          Copyright © 2022 Kowshar Robin All rights reserved.
        </h6>
      </div>
    </div>
  );
};

export default Layout;
