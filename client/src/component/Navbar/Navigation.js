// Navbar.js

import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav>
            <NavLink to="/" className="header">
                <i className="fab fa-hive"></i> Home
            </NavLink>
            <ul className="navbar-links">
                <li>
                    <NavLink to="/Registration" activeClassName="nav-active">
                        <i className="far fa-registered" /> Registration
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/Voting" activeClassName="nav-active">
                        <i className="fas fa-vote-yea" /> Voting
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/Results" activeClassName="nav-active">
                        <i className="fas fa-poll-h" /> Results
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/Profile" activeClassName="nav-active">
                        <i className="fas fa-user" /> Profile
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
