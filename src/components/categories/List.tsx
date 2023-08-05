import ContentHeader from '@app/components/content-header/ContentHeader';
import { clientAxios } from '@app/config/Axios';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
// import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { CategoryProps } from '@app/interfaces/categories';

interface Props {
  active: boolean;
}

const List = (props: Props) => {
  const [pending, setPending] = useState(true);
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [records, setRecords] = useState<CategoryProps[]>([]);

  const { active } = props;
  const { role } = useSelector((state: any) => state.auth.profile);

  useEffect(() => {
    const getCategories = async () => {
      const response = await clientAxios.get('/categories?limit=100');
      return response.data.results;
    };

    getCategories()
      .then((data) => {
        setCategories(data);
        setRecords(data);
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
      name: 'Image',
      cell: (param: any) => <img width={50} height={50} src={param.image} />,
    },
    {
      name: 'Actions',
      cell: (param: CategoryProps) => listActions(param),
    },
  ];


  const handleDelete = (id: string | undefined) => {
    if (id) {
      setCategories(
        categories.map((x) => {
          if (x.id === id) {
            x.isDeleting = true;
          }
          return x;
        })
      );

      clientAxios
        .delete(`/categories/${id}`)
        .then(() => {
          setCategories((categories) => categories.filter((x) => x.id !== id));
        })
        .catch((err) => console.log(err));
    }
  };

  const listActions = (param: CategoryProps) => {
    if (!param.id || role !== 'admin') return null;
    return (
      <>
        <Link
          to={`/categories/edit/${param.id}`}
          className='btn btn-primary mr-2'
        >
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
      </>
    );
  };

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filteredCategories = categories.filter((category) => {
      return category.name.toLowerCase().includes(e.target.value.toLowerCase());
    });
    setRecords(filteredCategories);
  };

  const rows = records.filter((category) => category.active === active);

  return (
    <>
      <ContentHeader title={`${active ? 'Active' : 'Inactive'} categories`} />

      <section className='content'>
        <div className='row'>
          <div className='col-md-12'>
            <div className='card card-primary'>
              <div className='card-header'>
                <h3 className='card-title'>{`List of ${
                  active ? 'active' : 'inactive'
                } categories`}</h3>
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
                  data={rows}
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
    </>
  );
};

export default List;
