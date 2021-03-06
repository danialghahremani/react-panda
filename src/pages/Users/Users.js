/* @flow */

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { get } from 'lodash';
import { Avatar, Table, Button, Spin, Modal, Icon, Input } from 'antd';

import { loadAll as loadAllUsers } from 'actions/users.action';
import { UsersCard, UsersDetails } from 'components';
import StyleWrapper from './users.style';

type Props = {
  history: Object,
  users: Object,
  loadAllUsers: () => void
};

type State = {
  visibleModal: boolean,
  userId: ?string,
  query: string
};

// Export this for unit testing more easily
export class Users extends PureComponent<Props, State> {
  state = {
    visibleModal: false,
    userId: null,
    query: ''
  };

  columns = [
    {
      title: '',
      dataIndex: 'avatar',
      render: (avatar: string) => (
        <div>
          <Avatar size={64} src={avatar} />
        </div>
      )
    },
    {
      title: 'First Name',
      dataIndex: 'first_name'
    },
    {
      title: 'Last Name',
      dataIndex: 'last_name'
    },
    {
      title: 'Email',
      dataIndex: 'email'
    },
    {
      title: '',
      dataIndex: 'id',
      className: 'text-right',
      render: (_, row: Object) => (
        <Button
          size="large"
          type="primary"
          shape="round"
          onClick={() => this.showDetailsModal(row)}
        >
          Details
          <Icon type="right" />
        </Button>
      )
    }
  ];

  componentDidMount() {
    const { loadAllUsers: loadAllPromise } = this.props;
    loadAllPromise();
  }

  showDetailsModal = userId => {
    this.setState({ userId, visibleModal: true });
  };

  hideDetailsModal = () => {
    this.setState({ visibleModal: false });
  };

  hendleRedirect = () => {
    const { history } = this.props;
    history.push('/users/new-user');
  };

  showDetailsPage = (id: Object) => {
    const { history } = this.props;
    history.push(`/users/${id}`);
  };

  updateQuery = query => {
    this.setState(() => ({
      query: query.trim()
    }));
  };

  clearQuery = () => {
    this.updateQuery('');
  };

  render() {
    const { users } = this.props;
    const { visibleModal, userId, query } = this.state;

    const usersList = get(users, 'data.data', []);

    const showingUsers =
      query === ''
        ? usersList
        : usersList.filter(user =>
            user.first_name.toLowerCase().includes(query.toLowerCase())
          );

    return (
      <StyleWrapper>
        <Helmet title="Users" />

        <div className="add-user">
          <Button
            size="large"
            type="primary"
            shape="round"
            icon="user-add"
            onClick={this.hendleRedirect}
          >
            Add new user
          </Button>
        </div>

        <h2 className="sections-header">Users Table View</h2>
        {users.fetching === null || users.fetching ? (
          <Spin />
        ) : (
          <Table
            dataSource={usersList}
            columns={this.columns}
            rowKey="id"
            onChange={this.handlePaginate}
          />
        )}

        <h2 className="sections-header">Users Card View</h2>
        <div className="search-users">
          <Input
            placeholder="Search user..."
            size="large"
            value={query}
            onChange={event => this.updateQuery(event.target.value)}
          />

          <div className="showing-count">
            {showingUsers.length !== usersList.length && (
              <div>
                <span>
                  Now showing {showingUsers.length} of {usersList.length}
                </span>
                <Button type="primary" shape="round" onClick={this.clearQuery}>
                  Show all
                </Button>
              </div>
            )}
          </div>
        </div>

        {showingUsers.length === 0 && (
          <div className="no-data">No user(s) found!</div>
        )}

        <UsersCard user={showingUsers} onClick={this.showDetailsPage} />

        <Modal
          className="c--modal"
          title=""
          centered
          visible={visibleModal}
          onCancel={this.hideDetailsModal}
          footer={null}
        >
          <UsersDetails user={userId} />
        </Modal>
      </StyleWrapper>
    );
  }
}

const mapStateToProps = ({ users }: Object) => ({ users: users.all });

const mapDispatchToProps = { loadAllUsers };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Users);
