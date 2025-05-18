using GroupExpenseTracker.Server.Models;

namespace GroupExpenseTracker.Server.Dtos
{
    public class MemberDto
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public decimal Balance { get; set; }
    }

    
    public static class MemberDtoExtensions
    {
        public static MemberDto ToDto(this Member member)
        {
            MemberDto memberDto = new MemberDto();
            memberDto.Id = member.id;
            memberDto.Name = member.name;
            memberDto.Balance = member.balance;

            return memberDto;
        }

        public static Member FromDto(this MemberDto memberDto)
        {
            Member member = new Member();

            member.id = memberDto.Id;
            if(memberDto.Name != null)
            {
                member.name = memberDto.Name;
            }
            
            member.balance = memberDto.Balance;

            return member;
        }
        

    }
}