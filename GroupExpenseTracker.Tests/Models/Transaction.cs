using GroupExpenseTracker.Server.Models;
using System.Xml.Linq;
using Xunit;

namespace GroupExpenseTracker.Tests.Models
{
    public class TransactionTests
    {
        private Member Member1 = new Member { name = "Name1" };
        private Member Member2 = new Member { name = "Name2" };
        private Member Member3 = new Member { name = "Name3" };

        [Fact]
        public void CalculateTransaction_EqualSplit_ShouldDivideEqually()
        {
            var transaction = new Transaction
            {
                payingMember = Member1,
                amountPaid = 120M,
                splitType = "equally",
                members = new List<Member> { Member1, Member2, Member3 }
            };

            transaction.CalculateTransaction();

            Assert.Equal(120M - 40M, Member1.balance);
            Assert.Equal(-40M, Member2.balance);
            Assert.Equal(-40M, Member3.balance);
        }

        [Fact]
        public void CalculateTransaction_PercentageSplit_ShouldCalculateCorrectly()
        {
            var transaction = new Transaction
            {
                payingMember = Member2,
                amountPaid = 200M,
                splitType = "percentage",
                members = new List<Member> { Member2, Member3 },
                splitAmounts = new List<decimal> { 60M, 40M }
            };

            transaction.CalculateTransaction();

            Assert.Equal(200M - (200M * 0.6M), Member2.balance);
            Assert.Equal(-80M, Member3.balance);
        }

        [Fact]
        public void CalculateTransaction_DynamicSplit_ShouldUseExactAmounts()
        {
            var transaction = new Transaction
            {
                payingMember = Member3,
                amountPaid = 150M,
                splitType = "dynamic",
                members = new List<Member> { Member3, Member1 },
                splitAmounts = new List<decimal> { 100M, 50M }
            };

            transaction.CalculateTransaction();

            Assert.Equal(150M - 100M, Member3.balance);
            Assert.Equal(-50M, Member1.balance);
        }

        [Fact]
        public void CalculateTransaction_InvalidPercentage_ShouldNotProcess()
        {
            var initialBalance = Member1.balance;
            var transaction = new Transaction
            {
                payingMember = Member1,
                amountPaid = 100M,
                splitType = "percentage",
                members = new List<Member> { Member1, Member2 },
                splitAmounts = new List<decimal> { 70M, 40M }
            };

            transaction.CalculateTransaction();

            Assert.Equal(initialBalance, Member1.balance);
            Assert.Equal(0M, Member2.balance);
        }

        [Fact]
        public void CalculateTransaction_NoPayer_ShouldNotProcess()
        {
            var initialBalance = Member2.balance;
            var transaction = new Transaction
            {
                payingMember = null,
                amountPaid = 100M,
                splitType = "equally",
                members = new List<Member> { Member2 }
            };

            transaction.CalculateTransaction();

            Assert.Equal(initialBalance, Member2.balance);
        }
    }
}