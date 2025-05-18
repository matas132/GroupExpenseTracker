import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";



type MembersGroupDto = {
    id: number;
    groupName: string;
    members: {
        id: number;
        name: string;
        balance: number;
    }[];
    transactions: {
        id: number;
        payingMember: {
            id: number;
            name: string;
        };
        amountPaid: number;
        splitType: string;
    }[];
    

};





function Group() {
    const { groupId } = useParams(); 

    const [group, setGroup] = useState<MembersGroupDto>();
    const [MemberName, setMemberName] = useState('');

    useEffect(() => {
        fetchMembers();
    });

    async function fetchMembers() {
        try {
            const response = await fetch(("/api/group/" + groupId));
            if (response.ok) {
                const data = await response.json();
                setGroup(data);
            }
        } catch (err) {
            console.error(err);
        }
    }

    const getBalanceText = (balance?: number) => {
        if (balance === undefined || balance === null) return 'Settled';
        const roundedBalance: number = Number(balance.toFixed(2));
        if (roundedBalance > 0) return 'The group owes ' + roundedBalance.toString();
        if (roundedBalance < 0) return 'Owes the group ' + Math.abs(roundedBalance).toString();
        return 'Settled';
    };



    async function handleAddGroup(e: React.FormEvent) {
        e.preventDefault();
        if (!MemberName.trim()) {
            return;
        }
        try {
            const response = await fetch(("/api/group/" + groupId), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        name: MemberName,
                        balance: 0
                    }),
            });
            if (response.ok) {
                setMemberName('');
                fetchMembers();
            }
        } catch (err) {
            console.error(err);
        }
    }


    async function handleRemoveMember(e: React.FormEvent, memberId: number) {
        e.preventDefault();
        console.log("deleting: " + memberId.toString());
        
        try {
            const response = await fetch(("/api/group/" + groupId + "/remove/" + memberId), {
                method: 'DELETE',
                
                
            });
            if (response.ok) {

                fetchMembers();
            }
        } catch (err) {
            console.error(err);
        }
    }




    return (

            <div className="container mt-4">
                <h1 className="mb-3">Group</h1>
                <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Group</h5>

                    </div>
                    <div className="card-body">
                        <table className="table table-bordered align-middle w-100">
                            <thead className="table-dark">
                            <tr>
                                
                                    <th scope="col">Name</th>
                                    <th scope="col"> </th>
                                
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    <tr key={group?.id}>
                                        <td>{group?.groupName}</td>
                                    <td>
                                    <Link className="btn btn-link p-0 border-0" to={"/newtransaction/" + group?.id}>Create new transaction</Link>
                                    </td>
                                </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
                <br></br>
                <div className="card mb-4">
                    <div className="card-header">
                        <h5 className="mb-0">Add New Member</h5>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleAddGroup} className="row g-3">
                            <div className="col-md-8">
                                <label htmlFor="groupName" className="form-label">Member Name:</label>
                                <input
                                    id="groupName"
                                    type="text"
                                    className="form-control"
                                    value={MemberName}
                                    onChange={(e) => setMemberName(e.target.value)}
                                    placeholder="Enter member name"
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
                        <h5 className="mb-0">Members</h5>

                    </div>
                    <div className="card-body">
                        <table className="table table-bordered w-100">
                            <thead className="table-dark">
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">Balance</th>
                                    <th scope="col">Remove if settled</th>
                                </tr>
                            </thead>
                            <tbody>
                                {group?.members.map((member) => (
                                    <tr key={member.id}>
                                        <td>{member.name}</td>
                                        <td>{
                                            getBalanceText(member.balance)



                                        }
                                        </td>
                                        <td>
                                            <form onSubmit={(e: React.FormEvent) => {
                                                handleRemoveMember(e, member.id);
                                                
                                            }}>
                                                <button
                                                    type="submit"
                                                    className={`btn btn-link p-0 ${Number(member.balance.toFixed(2)) != 0.00 ? 'text-muted' : 'text-danger'}`}
                                                    style={{ textDecoration: Number(member.balance.toFixed(2)) != 0 ? 'none' : 'underline' }}
                                                    disabled={Number(member.balance.toFixed(2)) != 0}
                                                >
                                                    Remove
                                                </button>
                                            </form>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            <br></br>
            <br></br>
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Transactions</h5>

                </div>
                <div className="card-body">
                    <table className="table table-bordered w-100">
                        <thead className="table-dark">
                            <tr>
                                <th scope="col">Who paid for the transaction</th>
                                <th scope="col">Amount paid</th>
                                <th scope="col">Split amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {group?.transactions.map((transaction) => (
                                <tr key={transaction.id}>
                                    <td>{transaction.payingMember.name}</td>
                                    <td>{transaction.amountPaid}</td>
                                    <td>{transaction.splitType}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>


            </div>





  );
}

export default Group;