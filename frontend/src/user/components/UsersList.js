import './UsersList.css';

import Card from '../../shared/components/UI/Card';
import React from 'react';
import UsersListItem from './UsersListItem';

const UsersList = (props) => {
  if (props.users.length !== 0) {
    return (
      <ul className='users-list'>
        {props.users.map((user) => {
          return (
            <UsersListItem
              key={user._id}
              id={user._id}
              name={user.name}
              posterCount={user.posters.length}
            />
          );
        })}
      </ul>
    );
  } else {
    return (
      <div className='center'>
        <Card>
          <h2>No users found.</h2>
        </Card>
      </div>
    );
  }
};

export default UsersList;
