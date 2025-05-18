using GroupExpenseTracker.Server.Models;

namespace GroupExpenseTracker.Server.Dtos
{
    public class TransactionDto
    {
        public int Id { get; set; }
        public int PayingMemberId { get; set; }
        public Member? PayingMember { get; set; }
        public decimal AmountPaid { get; set; }
        public string? SplitType { get; set; }
        public List<int> MembersIds { get; set; } = new List<int>();
        public List<MemberDto> Members { get; set; } = new List<MemberDto>();
        public List<decimal> SplitAmounts { get; set; } = new List<decimal>();
    }

    
    public static class TransactionDtoExtensions
    {
        public static TransactionDto ToDto(this Transaction transaction)
        {
            TransactionDto transactionDto = new TransactionDto();

            transactionDto.Id = transaction.id;

            if (transaction.payingMember != null)
            {
                transactionDto.PayingMember = transaction.payingMember;
                transactionDto.PayingMemberId = transaction.payingMember.id;
            }
            
            transactionDto.AmountPaid = transaction.amountPaid;
            transactionDto.SplitType = transaction.splitType;
            transactionDto.SplitAmounts = transaction.splitAmounts;


            transaction.members.ForEach(member => transactionDto.MembersIds.Add(member.id));

            transaction.members.ForEach(member => transactionDto.Members.Add(member.ToDto()));


            return transactionDto;
        }

        public static Transaction FromDto(this TransactionDto transactionDto, List<Member> members)
        {
            Transaction transaction = new Transaction();
            transaction.id = transactionDto.Id;

            var payingMember = members.Find(nn => nn.id == transactionDto.PayingMemberId);
            if(payingMember != null)
            {
                transaction.payingMember = payingMember;
            }


            transaction.amountPaid = transactionDto.AmountPaid;
            transaction.splitType = transactionDto.SplitType;
            transaction.splitAmounts = transactionDto.SplitAmounts;


            foreach (int memberId in transactionDto.MembersIds)
            {
                var foundMember = members.Find(nn => nn.id == memberId);
                if(foundMember != null)
                {
                    transaction.members.Add(foundMember);
                }

            }




            return transaction;
        }
        

    }
}