import { useEffect, useState } from 'react';
import '../../Content/bootstrap.css';
import { Link } from 'react-router-dom';

type MembersGroupDto = {
    id: number;
    groupName: string;
    yourBalance: number;
};


function Groups() {
    
    const [groups, setGroups] = useState<MembersGroupDto[]>([]);
    const [GroupName, setGroupName] = useState('');

    useEffect(() => {
        fetchGroups();
    });

    async function fetchGroups() {
        try {
            const response = await fetch('/api/groups');
            if (response.ok) {
                const data = await response.json();
                setGroups(data);
            }
        } catch (err) {
            console.error(err);
        }
    }


    const getBalanceText = (balance?: number) => {
        if (balance === undefined || balance === null) return 'Settled';
        const roundedBalance: number = Number(balance.toFixed(2));
        if (roundedBalance > 0) return 'The group owes you ' + roundedBalance.toString();
        if (roundedBalance < 0) return 'You owe the group ' + Math.abs(roundedBalance).toString();
        return 'Settled';
    };


    async function handleAddGroup(e: React.FormEvent) {
        e.preventDefault();

        if (!GroupName.trim()) {
            return;
        }

        try {
            const response = await fetch('/api/groups', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        groupName: GroupName
                    }),
            });

            if (response.ok) {
                setGroupName('');
                fetchGroups();
            }
        } catch (err) {
            console.error(err);
        }
    }

    
    return (
        <div className="container mt-4">
            <h1 className="mb-3">Groups</h1>

            <div className="card mb-4">
                <div className="card-header">
                    <h5 className="mb-0">Add New Group</h5>
                </div>
                <div className="card-body">
                    <form onSubmit={handleAddGroup} className="row g-3">
                        <div className="col-md-8">
                            <label htmlFor="groupName" className="form-label">Group Name:</label>
                            <input
                                id="groupName"
                                type="text"
                                className="form-control"
                                value={GroupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                placeholder="Enter group name"
                            />
                        </div>
                        
                        <div className="col-md-4 d-flex justify-content-center">
                            <button type="submit" className="btn btn-primary w-50 mt-4">
                                Add Group
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Groups List</h5>
                   
                </div>
                <div className="card-body">
                    {(
                        <div className="table-responsive">
                            <table className="table table-bordered align-middle">
                                <thead className="table-dark">
                                    <tr>
                                        <th scope="col">Name</th>
                                        <th scope="col">Your Balance</th>
                                        <th scope="col"> </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {groups.map((group) => (
                                        <tr key={group.id}>
                                            <td>{group.groupName}</td>
                                            <td>{
                                                
                                                getBalanceText(group.yourBalance)
                                            
                                                }</td>
                                            <td>
                                                <Link className="btn btn-link p-0 border-0" to={"/group/" + group.id}>View group</Link>
                                                
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
export default Groups;