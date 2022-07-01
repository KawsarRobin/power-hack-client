import { Button, Container, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <Container className="p-md-5 my-5 w-75 border shadow-lg border-2 rounded">
      <Form>
        <Form.Group className="my-3" controlId="formBasicEmail">
          <h3>Please Login</h3>
          <Form.Label></Form.Label>
          <Form.Control type="email" placeholder="Enter email" required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Control type="password" placeholder="Password" required />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Remember me" />
        </Form.Group>
        <Button className="w-25 my-3" variant="primary" type="submit">
          Login
        </Button>
        <Link className=" m-3" to="/home">
          <Button variant="secondary">Home</Button>
        </Link>
      </Form>
      <br />
      <Link className="text-decoration-none" to="/registration">
        <h5 className="text-dark mb-3"> Don't Have Account ? </h5>
      </Link>
    </Container>
  );
};

export default Login;
