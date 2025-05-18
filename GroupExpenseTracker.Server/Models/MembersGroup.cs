namespace GroupExpenseTracker.Server.Models
{
    public class MembersGroup
    {
        public int id { get; set; }
        public string groupName { get; set; } = "";
        public List<Member> members { get; set; } = new List<Member>();
        public List<Transaction> transactions { get; set; } = new List<Transaction>();
        

        /// <summary>
        /// Finds your balance, since the task doesn't ask for authentication, the member with the name "You" is you
        /// </summary>
        /// <returns></returns>
        public decimal SeeYourBalance()
        {
            Member? member = members.Find(nn => nn.name == "You");

            if (member == null)
            {
                return 0M;
            }
            return member.balance;
        }







    }
}
