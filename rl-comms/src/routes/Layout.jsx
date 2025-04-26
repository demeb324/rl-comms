import {Outlet, Link} from "react-router-dom";
import './Layout.css'

const Layout = () => {
    return (
        <div className="layout-container">
            <header className="layout-header">
                <nav className="layout-nav">
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                    </ul>
                </nav>
            </header>
            <main className="layout-main">
                <Outlet />
            </main>
            <footer className="layout-footer">
                <p>&copy; 2023 RL Comms</p>
            </footer>
        </div>
    );
}

export default Layout;