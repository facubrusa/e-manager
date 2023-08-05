import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import ContentHeader from '@app/components/content-header/ContentHeader';
import { clientAxios } from '@app/config/Axios';
import { UserProps } from '@app/interfaces/users';

import ChangePasswordModal from './ChangePasswordModal';

const List = () => {
  const [pending, setPending] = useState(true);
  const [users, setUsers] = useState<UserProps[]>([]);
  const [modalShow, setModalShow] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const [records, setRecords] = useState<UserProps[]>([]);

  const { role } = useSelector((state: any) => state.auth.profile);

  useEffect(() => {
    const getUsers = async () => {
      const response = await clientAxios.get('/users?limit=100');
      return response.data.results;
    };

    getUsers()
      .then((data) => {
        setUsers(data);
        setRecords(data);
      })
      .catch((err) => {
        console.log(err.response);
      })
      .finally(() => setPending(false));
  }, []);

  const columns = [
    {
      name: 'Name',
      selector: (row: any) => row.name,
      sortable: true,
    },
    {
      name: 'Email',
      selector: (row: any) => row.email,
      sortable: true,
    },
    {
      name: 'Role',
      selector: (row: any) => row.role,
      sortable: true,
    },
    {
      name: 'Actions',
      cell: (param: UserProps) => listActions(param),
    },
  ];

  const handleDelete = (id: string | undefined) => {
    if (id) {
      setUsers(
        users.map((x) => {
          if (x.id === id) {
            x.isDeleting = true;
          }
          return x;
        })
      );

      clientAxios
        .delete(`/users/${id}`)
        .then(() => {
          setUsers((users) => users.filter((x) => x.id !== id));
        })
        .catch((err) => console.log(err));
    }
  };

  const handleChangePassword = (id: string | undefined) => {
    if (!id) return;
    setUserId(id);
    setModalShow(true);
  };

  const changePassword = (password: string) => {
    clientAxios
      .patch(`/users/${userId}`, { password })
      .then(() => {
        toast.success('User password changed successfully');
      })
      .catch((err) => console.log(err));
  };

  const listActions = (param: UserProps) => {
    if (!param.id || role !== 'admin') return null;
    return (
      <>
        <Link to={`/users/edit/${param.id}`} className='btn btn-primary mr-2'>
          <i className='fas fa-edit'></i>
        </Link>
        <button
          className='btn btn-danger mr-2'
          onClick={() => handleDelete(param.id)}
        >
          {param.isDeleting ? (
            <span className='spinner-border spinner-border-sm'></span>
          ) : (
            <i className='fas fa-trash-alt'></i>
          )}
        </button>
        <button
          className='btn btn-warning'
          onClick={() => handleChangePassword(param.id)}
        >
          <i className='fas fa-key'></i>
        </button>
      </>
    );
  };

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filteredUsers = users.filter((user) => {
      return user.name.toLowerCase().includes(e.target.value.toLowerCase());
    });
    setRecords(filteredUsers);
  };

  return (
    <>
      <ContentHeader title='List users' />

      <section className='content'>
        <div className='row'>
          <div className='col-md-12'>
            <div className='card card-primary'>
              <div className='card-header'>
                <h3 className='card-title'>List of users</h3>
                <div className='card-tools'>
                  <button
                    type='button'
                    className='btn btn-tool'
                    data-card-widget='collapse'
                    title='Collapse'
                  >
                    <i className='fas fa-minus'></i>
                  </button>
                </div>
              </div>
              <div className='card-body'>
                <div className='row justify-content-end'>
                  <div className='col-2'>
                    <input
                      type='text'
                      className='form-control'
                      placeholder='Search'
                      onChange={handleFilter}
                    />
                  </div>
                </div>
                <DataTable
                  columns={columns}
                  data={records}
                  highlightOnHover
                  pagination
                  responsive
                  progressPending={pending}
                />
              </div>
              {/* /.card-body */}
            </div>
            {/* /.card */}
          </div>
        </div>
      </section>

      <ChangePasswordModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        changePassword={changePassword}
      />
    </>
  );
};

export default List;
