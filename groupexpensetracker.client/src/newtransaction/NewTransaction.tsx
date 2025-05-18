import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";




type MembersGroupDto = {
    id: number;
    groupName: string;
    members: {
        id: number;
        name: string;
        balance: number;
    }[];

};

function NewTransaction() {
    const { groupId } = useParams(); 

    const [group, setGroup] = useState<MembersGroupDto>();
    const [AmountPaid, setAmountPaid] = useState(0);
    const [MemberWhoPaid, setMemberWhoPaid] = useState(0);
    const [SplitType, setSplitType] = useState("");

    const [memberAmounts, setMemberAmounts] = useState<Record<number, number>>({});



    const fetchMembers = useCallback(async () => {
        try {
            const response = await fetch(("/api/newtransaction/" + groupId));
            if (response.ok) {
                const data = await response.json();
                setGroup(data);
            }
        } catch (err) {
            console.error(err);
        }
    }, [groupId]);

    useEffect(() => {
        const fetchData = async () => {
            await fetchMembers();

            if (group?.members) {
                setMemberAmounts(prev => {
                    const needsInit = group.members.some(m => !(m.id in prev));
                    return needsInit
                        ? group.members.reduce((acc, m) => ({ ...acc, [m.id]: 0 }), {})
                        : prev;
                });
            }
        };

        fetchData();
    }, [fetchMembers, group?.members]);





    const getBalanceText = (balance?: number) => {
        
        if (balance === undefined || balance === null) return 'Settled';
        const roundedBalance : number =Number(balance.toFixed(2));
        if (roundedBalance > 0) return 'The group owes ' + roundedBalance.toString();
        if (roundedBalance < 0) return 'Owes the group ' + Math.abs(roundedBalance).toString();
        return 'Settled';
    };




    async function handleAddNewTransaction(e: React.FormEvent, SplitType: string, MembersIds: number[], Splitamounts: number[] = []) {
        e.preventDefault();
        if (!AmountPaid || !MemberWhoPaid) {
            return;
        }
        try {
            const response = await fetch(("/api/newtransaction/" + groupId), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        payingMemberId: MemberWhoPaid,
                        amountPaid: AmountPaid,
                        splitType: SplitType,
                        membersIds: MembersIds,
                        splitAmounts: Splitamounts,
                    }),
            });
            if (response.ok) {
                
                setMemberWhoPaid(0);
                setAmountPaid(0);
                setMemberAmounts([]);
                fetchMembers();
                setSplitType("");
            }
        } catch (err) {
            console.error(err);
        }
    }






    return (

        <div className="container mt-4">
            <h1 className="mb-3">New Transaction</h1>
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Create New Transaction</h5>

                </div>
                <div className="card-body">
                    <label htmlFor="groupName" className="form-label">Select who paid for the transaction:</label>
                    <table className="table table-bordered table-hover w-100">
                        <thead className="table-dark">
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {group?.members.map((member) => (
                                <tr
                                    key={member.id}
                                    onClick={() => setMemberWhoPaid(member.id)}
                                    className={MemberWhoPaid === member.id ? "table-primary" : ""}
                                    style={{ cursor: "pointer" }}
                                >
                                    <td>{member.name}</td>
                                    <td>{getBalanceText(member.balance)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="row g-2">
                        <div className="col-md-8">
                            <label htmlFor="groupName" className="form-label">Enter the full amount paid:</label>
                            <input
                                id="groupName"
                                type="number"
                                className="form-control"
                                step="0.01"
                                value={AmountPaid}
                                onChange={(e) => setAmountPaid(Number.parseFloat(e.target.value))}
                                placeholder="Enter amount paid"
                            />
                        </div>
                        <label htmlFor="groupName" className="form-label">How to split the amount:</label>
                        <div className="row g-3">
                            
                            <div className="col-md-4">
                                <form onSubmit={(e: React.FormEvent) => handleAddNewTransaction(e, "equally", group?.members.map(m => m.id) || [])}>
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg w-100 py-2 mt-4 shadow-sm"
                                    >
                                        Equally
                                    </button>
                                </form>
                            </div>

                            <div className="col-md-4">
                                <button
                                    type="button"
                                    onClick={() =>{
                                        if (MemberWhoPaid && AmountPaid) {
                                            setSplitType("percentage");
                                        }
                                            } }
                                    className="btn btn-primary btn-lg w-100 py-2 mt-4 shadow-sm"
                                >
                                    Percentage
                                </button>
                            </div>

                            <div className="col-md-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (MemberWhoPaid && AmountPaid) {
                                            setSplitType("dynamic");
                                        }
                                    }}
                                    className="btn btn-primary btn-lg w-100 py-2 mt-4 shadow-sm"
                                >
                                    Dynamic
                                </button>
                            </div>
                        </div>
                     </div>
                </div>
            </div>
            <br></br>
            {SplitType === "percentage" && (
                <div className="card mb-4">
                    <div className="card-header">
                        <h5 className="mb-0">Enter a percentage for each member</h5>
                    </div>
                    <div className="card-body">
                        <table className="table table-bordered w-100">
                            <thead className="table-dark">
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">Enter percentage</th>
                                </tr>
                            </thead>
                            <tbody>
                                {group?.members.map((member) => (
                                    <tr key={member.id}>
                                        <td>{member.name}</td>
                                        <td>
                                            <input
                                                type="number"
                                                className="form-control"
                                                step="1"
                                                min="0"
                                                max={100}
                                                value={memberAmounts[member.id] || 0}
                                                onChange={(e) => {
                                                    const newValue = parseFloat(e.target.value) || 0;

                                                    const currentSum = Object.values(memberAmounts).reduce((sum, amount) => sum + amount, 0);
                                                    const otherMembersSum = currentSum - (memberAmounts[member.id] || 0);
                                                    const remainingAllowed = 100 - otherMembersSum;

                                                    if (newValue > remainingAllowed) {
                                                        return;
                                                    }

                                                    setMemberAmounts(prev => ({
                                                        ...prev,
                                                        [member.id]: newValue
                                                    }));
                                                }}
                                                placeholder="0"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="mt-3">
                            <button
                                className="btn btn-primary"
                                onClick={(e) => {
                                    handleAddNewTransaction(
                                        e,
                                        "percentage",
                                        group?.members.map(m => m.id) || [],
                                        Object.values(memberAmounts)
                                    );
                                }}
                            >
                                Submit Percentage Split
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {SplitType === "dynamic" && (
                <div className="card mb-4">
                    <div className="card-header">
                        <h5 className="mb-0">Enter the exact amount for each member</h5>
                    </div>
                    <div className="card-body">
                        <table className="table table-bordered w-100">
                            <thead className="table-dark">
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">Enter amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {group?.members.map((member) => (
                                    <tr key={member.id}>
                                        <td>{member.name}</td>
                                        <td>
                                            <input
                                                type="number"
                                                className="form-control"
                                                step="0.01"
                                                min="0"
                                                max={AmountPaid}
                                                value={memberAmounts[member.id] || 0}
                                                onChange={(e) => {
                                                    const newValue = parseFloat(e.target.value) || 0;

                                                    const currentSum = Object.values(memberAmounts).reduce((sum, amount) => sum + amount, 0);
                                                    const otherMembersSum = currentSum - (memberAmounts[member.id] || 0);
                                                    const remainingAllowed = AmountPaid - otherMembersSum;

                                                    if (newValue > remainingAllowed) {
                                                        return;
                                                    }

                                                    setMemberAmounts(prev => ({
                                                        ...prev,
                                                        [member.id]: newValue
                                                    }));
                                                }}
                                                placeholder="0.00"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="mt-3">
                            <button
                                className="btn btn-primary"
                                onClick={(e) => {
                                    handleAddNewTransaction(
                                        e,
                                        "dynamic",
                                        group?.members.map(m => m.id) || [],
                                        Object.values(memberAmounts)
                                    );
                                }}
                            >
                                Submit Dynamic Split
                            </button>
                        </div>
                    </div>
                </div>
            )}






        </div>);


}

export default NewTransaction;