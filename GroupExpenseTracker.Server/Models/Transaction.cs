namespace GroupExpenseTracker.Server.Models
{
    public class Transaction
    {

        public int id { get; set; }
        public Member? payingMember { get; set; }
        public decimal amountPaid { get; set; }
        public string? splitType { get; set; }
        public List<Member> members { get; set; } = new List<Member>();
        public List<decimal> splitAmounts { get; set; } = new List<decimal>();


        public void CalculateTransaction()
        {
            if (payingMember == null)
            {
                return;
            }

            switch (splitType)
            {
                case "equally":
                    payingMember.balance += amountPaid;
                    decimal moneySplit = amountPaid / members.Count();

                    foreach(Member member in members)
                    {
                        member.balance -= moneySplit;
                    }

                    break;
                case "percentage":

                    if (splitAmounts.Sum() > 100)
                    {
                        return;
                    }


                    payingMember.balance += amountPaid;

                    payingMember.balance -= amountPaid - (amountPaid * (splitAmounts.Sum()/100));


                    for (int i = 0; i < members.Count; i++)
                    {
                        members[i].balance -= amountPaid * (splitAmounts[i]/100);
                    }




                    break;
                case "dynamic":

                    if (splitAmounts.Sum() > amountPaid)
                    {
                        return;
                    }

                    payingMember.balance += amountPaid;

                    payingMember.balance -= amountPaid - splitAmounts.Sum(); // if split amounts inputed are less than the total amount paid, the difference is returned to the payer


                    for (int i = 0; i < members.Count; i++)
                    {
                        members[i].balance -= splitAmounts[i];
                    }



                    break;

            }




        }


    }
}
