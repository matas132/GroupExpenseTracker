import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
} from 'react-router-dom';
import '../Content/bootstrap.css';
import Groups from './groups/Groups';
import Group from './group/Group';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import NewTransaction from './newtransaction/NewTransaction';
function App() {




    return (
        <Router>
            
            <header>
                
                <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
                    <div className="container-fluid">
                        
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                
                                <li className="nav-item">
                                    <Link className="nav-link" to="/groups">Groups</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
            <hr />
            <hr />
            <hr />
            <Routes>
                <Route path="/" element={<Groups />} />
                <Route path="/groups" element={<Groups />} />
                <Route path="/group/:groupId" element={<Group />} />
                <Route path="/newtransaction/:groupId" element={<NewTransaction />} />
            </Routes>
        </Router>
    );
}


export default App;