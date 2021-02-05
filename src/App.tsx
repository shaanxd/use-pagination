import React, { useEffect } from 'react';
import Axios from 'axios';
import { useSetState } from 'react-use';

import './App.css';

interface UsePaginationState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  page: number;
}

interface PaginationProps {
  onPreviousClick: () => void;
  onNextClick: () => void;
}

const Pagination: React.FC<PaginationProps> = ({
  onNextClick,
  onPreviousClick,
}: PaginationProps) => (
  <div>
    <button onClick={onPreviousClick}>Previous</button>
    <button onClick={onNextClick}>Next</button>
  </div>
);

const usePagination = <T extends {}>(
  callback: (page: number) => Promise<any>,
  initialPage: number = 1,
  showComponent: boolean = false
): [T[], boolean, string | null, number, JSX.Element | null] => {
  const [state, setState] = useSetState<UsePaginationState<T>>({
    data: [],
    loading: false,
    error: null,
    page: initialPage,
  });

  const { data, loading, error, page } = state;

  useEffect(() => {
    getDataFromApi();
    //  eslint-disable-next-line
  }, [page]);

  const getDataFromApi = async () => {
    try {
      setState({ loading: true, error: null });
      const { data } = await callback(page);
      setState({ data: [...data], loading: false });
    } catch (err) {
      setState({ error: err.message, loading: false });
    }
  };

  const onNextClick = () => {
    setState({ page: page + 1 });
  };

  const onPreviousClick = () => {
    if (page > 1) {
      setState({ page: page - 1 });
    }
  };

  const renderPagination = () => {
    return showComponent ? (
      <Pagination onNextClick={onNextClick} onPreviousClick={onPreviousClick} />
    ) : null;
  };

  return [data, loading, error, page, renderPagination()];
};

function App() {
  const getDataFromApi = async (page: number) => {
    return Axios.get(`https://picsum.photos/v2/list?page=${page}&limit=2`);
  };

  const [data, loading, error, page, pagination] = usePagination(
    getDataFromApi,
    1,
    true
  );

  return loading ? (
    <div>Loading</div>
  ) : error ? (
    <div>{error}</div>
  ) : (
    <div>
      <div>{page}</div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      {pagination}
    </div>
  );
}

export default App;
