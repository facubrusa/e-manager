import ContentHeader from '@app/components/content-header/ContentHeader';
import { clientAxios } from '@app/config/Axios';
import { UserProps } from "@app/interfaces/users";
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

const ListUsers = () => {
  const [toggledClearRows, setToggleClearRows] = useState<boolean>(false);
  const [pending, setPending] = useState(true);
  const [rows, setRows] = useState<UserProps[]>([]);

  const dispatch = useDispatch();

  useEffect(() => {
    const getUsers = async () => {
      const users = await clientAxios.get('/users');
      return users.data.results;
    }

    getUsers()
      .then((data) => {
        setRows(data);
      })
      .catch((err) => {
        console.log(err.response);
      })
      .finally(() => setPending(false));
      // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleDelete = (data: any) => {
    console.log(data);
    console.log('delete');
  };

  const listActions = (param: UserProps) => {
    console.log(param.id);
    return (
      <>
        <Link to={`/edit-user/${param.id}`} className='btn btn-primary mr-2'><i className='fas fa-edit'></i></Link>
        <button className='btn btn-danger' onClick={() => handleDelete(param)}>
          <i className='fas fa-trash-alt'></i>
        </button>
      </>
    );
  };

  return (
    <>
      <ContentHeader title='Active users' />

      <section className='content'>
        <div className='row'>
          <div className='col-md-12'>
            <div className='card card-primary'>
              <div className='card-header'>
                <h3 className='card-title'>List of active users</h3>
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
                <DataTable
                  columns={columns}
                  data={rows}
                  highlightOnHover
                  pagination
                  responsive
                  clearSelectedRows={toggledClearRows}
                  progressPending={pending}
                />
              </div>
              {/* /.card-body */}
            </div>
            {/* /.card */}
          </div>
        </div>
      </section>
    </>
  );
};

export default ListUsers;
