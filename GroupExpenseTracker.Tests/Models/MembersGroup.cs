using GroupExpenseTracker.Server.Models;
using Xunit;

namespace GroupExpenseTracker.Tests.Models
{
    public class MembersGroupTests
    {
        [Fact]
        public void MembersGroup_Initialization_ShouldCreateEmptyLists()
        {
            
            var group = new MembersGroup();

            
            Assert.NotNull(group.members);
            Assert.NotNull(group.transactions);
            Assert.Empty(group.members);
            Assert.Empty(group.transactions);
        }

        [Fact]
        public void SeeYourBalance_WhenNoMembers_ReturnsZero()
        {
            
            var group = new MembersGroup { groupName = "Test Group" };

            
            var balance = group.SeeYourBalance();

            
            Assert.Equal(0M, balance);
        }

        [Fact]
        public void SeeYourBalance_WhenYouDontExist_ReturnsZero()
        {

            var group = new MembersGroup
            {
                groupName = "Group1",
                members = new List<Member>
                {
                    new Member { name = "Name1", balance = 50M },
                    new Member { name = "Name2", balance = -30M }
                }
            };

            var balance = group.SeeYourBalance();

            Assert.Equal(0M, balance);
        }

        [Fact]
        public void SeeYourBalance_WhenYouExist_ReturnsYourBalance()
        {

            var expectedBalance = 100M;
            var group = new MembersGroup
            {
                groupName = "Group1",
                members = new List<Member>
                {
                    new Member { name = "Name1", balance = 50M },
                    new Member { name = "You", balance = expectedBalance },
                    new Member { name = "Name2", balance = -30M }
                }
            };

            var actualBalance = group.SeeYourBalance();

            Assert.Equal(expectedBalance, actualBalance);
        }

        [Fact]
        public void SeeYourBalance_WhenMultipleYousExist_ReturnsFirstYourBalance()
        {
            var group = new MembersGroup
            {
                groupName = "Group1",
                members = new List<Member>
                {
                    new Member { name = "You", balance = 100M },
                    new Member { name = "Name1", balance = 50M },
                    new Member { name = "You", balance = 200M },
                    new Member { name = "Name3", balance = -30M }
                }
            };

            var balance = group.SeeYourBalance();

            Assert.Equal(100M, balance);
        }

        [Theory]
        [InlineData(0)]
        [InlineData(50.50)]
        [InlineData(-25.75)]
        [InlineData(999999.99)]
        public void SeeYourBalance_WithDifferentBalances_ReturnsCorrectValue(decimal testBalance)
        {
            var group = new MembersGroup
            {
                groupName = "Test Group",
                members = new List<Member>
                {
                    new Member { name = "You", balance = testBalance }
                }
            };

            var balance = group.SeeYourBalance();

            Assert.Equal(testBalance, balance);
        }
    }
}