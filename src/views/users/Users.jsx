import React from 'react'
import UserList from '../../components/user/user-list/UserList';
import { Link } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';

const Users = () => {
  return (
    <Container className='p-5'>
      <h1 className='text-center'>Lista degli autori</h1>
      <Link to={'/home'}>
        <Button variant="link" className="fs-4 mb-3">Back to Home</Button>
      </Link>
      <UserList/>
    </Container>
  )
}

export default Users