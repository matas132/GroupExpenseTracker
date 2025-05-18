using GroupExpenseTracker.Server.Models;

namespace GroupExpenseTracker.Server.Dtos
{
    public class MembersGroupDto
    {
        public int Id { get; set; }
        public string? GroupName { get; set; }
        public decimal YourBalance { get; set; }
        public List<MemberDto> Members { get; set; } = new List<MemberDto>();
        public List<TransactionDto> Transactions { get; set; } = new List<TransactionDto>();
    }


    public static class MembersGroupDtoDtoExtensions
    {
        public static MembersGroupDto ToDto(this MembersGroup group)
        {
            MembersGroupDto groupDto = new MembersGroupDto();

            groupDto.Id = group.id;
            groupDto.GroupName = group.groupName;
            groupDto.YourBalance = group.SeeYourBalance();
            group.members.ForEach(nn => groupDto.Members.Add(nn.ToDto()));
            group.transactions.ForEach(nn => groupDto.Transactions.Add(nn.ToDto()));
            return groupDto;
        }

        public static MembersGroup FromDto(this MembersGroupDto groupDto)
        {
            MembersGroup group = new MembersGroup();

            group.id = groupDto.Id;
            group.groupName = groupDto.GroupName ?? string.Empty;
            groupDto.Members.ForEach(nn => group.members.Add(nn.FromDto()));

            return group;
        }
        public static MembersGroup FromDto(this MembersGroupDto groupDto, List<Member> members)
        {
            MembersGroup group = groupDto.FromDto();

            foreach (TransactionDto transactionDto in groupDto.Transactions)
            {
                var foundMember = transactionDto.FromDto(members);
                if (foundMember != null)
                {
                    group.transactions.Add(foundMember);
                }
            }

            return group;
        }
    }


}
