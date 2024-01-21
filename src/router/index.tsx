import { Navigate, RouteObject, useRoutes } from 'react-router-dom';
import Page1 from '../pages/page1';
import Page2 from '../pages/page2';
import Page3 from '../pages/page3';
import Page4 from '../pages/page4';
import Page5 from '../pages/page5';
import Page6 from '../pages/page6';
import Page7 from '../pages/page7';
import Page8 from '../pages/page8';
import Page9 from '../pages/page9';

const routes: RouteObject[] = [
  {
    path: '',
    element: <Navigate to={'/8'} />,
  },
  {
    path: '/1',
    element: <Page1 />,
  },
  {
    path: '/2',
    element: <Page2 />,
  },
  {
    path: '/3',
    element: <Page3 />,
  },
  {
    path: '/4',
    element: <Page4 />,
  },
  {
    path: '/5',
    element: <Page5 />,
  },
  {
    path: '/6',
    element: <Page6 />,
  },
  {
    path: '/7',
    element: <Page7 />,
  },
  {
    path: '/8',
    element: <Page8 />,
  },
  {
    path: '/9',
    element: <Page9 />,
  },
];

const Router = () => {
  const router = useRoutes(routes);
  return router;
};

export default Router;
