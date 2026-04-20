import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ReportIssue from './pages/ReportIssue';
import TrackStatus from './pages/TrackStatus';
import Dashboard from './pages/DashBoard';
import AdminPanel from './pages/AdminPanel';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"     element={<Login />} />
        <Route path="/register"  element={<Register />} />
        <Route path="/report"    element={<ReportIssue />} />
        <Route path="/track"     element={<TrackStatus />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin"     element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}






// This code is the Routing Configuration for your React frontend. It uses react-router-dom, which is the industry standard for creating "Single Page Applications" (SPAs).
// In a traditional website, clicking a link usually tells the browser to request a new HTML file from the server. In a React app, you never leave the index.html page. Instead, React intercepts the URL change and swaps out the components on the screen instantly.
// Here is the breakdown of what each part does:
// 1. The Components (The Building Blocks)
// import ... from './pages/...': These are your "Views" or "Pages." Each one is a separate file (e.g., Login.jsx, Home.jsx) that contains the UI for that specific path.
// 2. The Wrapper (BrowserRouter)
// <BrowserRouter>: This is the "brain" of your routing. It listens to the browser's URL bar (the history API). Whenever the URL changes (like going from / to /login), it tells the Routes component to update the view without refreshing the page.
// 3. The Router (Routes)
// <Routes>: This acts like a "Switch" statement. It looks at the current URL and compares it to all the <Route> children inside it. It will only render the one that matches the current path.
// 4. The Mapping (Route)
// <Route path="/" element={<Home />} />:
// path: The URL string the user sees in the browser (e.g., yourwebsite.com/login).
// element: The React component that should be displayed on the screen when that URL is active.
// How it works in practice:
// Initial Load: A user visits http://localhost:3000/. The browser hits the root. The <Routes> component matches / to the <Home /> component. React renders the Home page.
// Navigation: The user clicks a "Login" button. Your code (using a <Link to="/login"> component) changes the URL to http://localhost:3000/login.
// The Swap: BrowserRouter detects the change. Routes looks at the list, finds the <Route path="/login" ... />, and instantly replaces the Home component with the Login component on the DOM. The page never reloads.