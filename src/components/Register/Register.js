import { Button, Container, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <Container className="p-md-5 my-5 w-75 w-sm-100 border shadow-lg border-3 rounded">
      <Form>
        <Form.Group className="my-3" controlId="formBasicPassword">
          <Form.Label>
            {' '}
            <h3>Register</h3>{' '}
          </Form.Label>

          <Form.Control type="text" placeholder="Your Name" required />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Control type="email" placeholder="Enter email" required />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Control type="password" placeholder="Password" required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          {/* {user.email ? '' : <h4 className="text-danger my-2">{error}</h4>} */}
        </Form.Group>
        <Button className="w-25 my-3" variant="primary" type="submit">
          SignUp
        </Button>
        <Link className=" m-3" to="/home">
          <Button variant="secondary">Home</Button>
        </Link>
      </Form>
      <br />
      <Link className="text-decoration-none" to="/login">
        <h5 className="text-dark mb-3"> Already Registered? </h5>{' '}
      </Link>
    </Container>
  );
};

export default Register;
