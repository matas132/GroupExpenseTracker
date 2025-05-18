
using GroupExpenseTracker.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace GroupExpenseTracker.Server.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options){ }
        
        public DbSet<MembersGroup> Groups { get; set; }
        public DbSet<Member> Members { get; set; }


    }

}
