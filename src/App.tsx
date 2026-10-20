import { lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './pages/Home';

const Difference = lazy(() => import('./pages/Difference'));
const Team = lazy(() => import('./pages/Team'));
const Person = lazy(() => import('./pages/Person'));
const Board = lazy(() => import('./pages/Board'));
const Careers = lazy(() => import('./pages/Careers'));
const Services = lazy(() => import('./pages/Services'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const WhoWeServe = lazy(() => import('./pages/WhoWeServe'));
const AudienceDetail = lazy(() => import('./pages/AudienceDetail'));
const Insights = lazy(() => import('./pages/Insights'));
const Article = lazy(() => import('./pages/Article'));
const Contact = lazy(() => import('./pages/Contact'));
const Legal = lazy(() => import('./pages/Legal'));
const NotFound = lazy(() => import('./pages/NotFound'));

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about/the-northstead-difference" element={<Difference />} />
          <Route path="about/our-team" element={<Team />} />
          <Route path="about/our-team/:slug" element={<Person />} />
          <Route path="about/board-of-directors" element={<Board />} />
          <Route path="about/careers" element={<Careers />} />
          <Route path="services" element={<Services />} />
          <Route path="services/:slug" element={<ServiceDetail />} />
          <Route path="who-we-serve" element={<WhoWeServe />} />
          <Route path="who-we-serve/:slug" element={<AudienceDetail />} />
          <Route path="insights" element={<Insights />} />
          <Route path="insights/:slug" element={<Article />} />
          <Route path="contact" element={<Contact />} />
          <Route path="privacy-policy" element={<Legal kind="privacy" />} />
          <Route path="usa-patriot-act" element={<Legal kind="patriot" />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
