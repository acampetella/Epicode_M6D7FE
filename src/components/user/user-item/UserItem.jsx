import React from "react";
import { Card, ListGroup } from "react-bootstrap";
const UserItem = (props) => {
  const { firstName, lastName, email, birthDate, avatar } = props;
  return (
    <>
      <Card className="blog-card">
        <Card.Img variant="top" src={avatar} className="blog-cover" />
        <Card.Body>
          <Card.Title>{`${firstName} ${lastName}`}</Card.Title>
          <ListGroup className="list-group-flush">
            <ListGroup.Item>email: {email}</ListGroup.Item>
            <ListGroup.Item>Data di nascita: {birthDate}</ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>
    </>
  );
};

export default UserItem;