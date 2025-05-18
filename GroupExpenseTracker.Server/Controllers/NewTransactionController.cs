using GroupExpenseTracker.Server.Data;
using GroupExpenseTracker.Server.Dtos;
using GroupExpenseTracker.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Text.RegularExpressions;

namespace GroupExpenseTracker.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NewTransactionController : Controller
    {

        private readonly DataContext _context;
        public NewTransactionController(DataContext context)
        {
            _context = context;
        }



        [HttpGet("{groupIndex}", Name = "GetNewTransaction")]
        public async Task<ActionResult<MembersGroupDto>> GetNewTransactionGroupMembers(int groupIndex)
        {
            MembersGroup? group = await _context.Groups
                .Include(g => g.members)
                .Include(g => g.transactions).ThenInclude(t => t.members)
                .FirstOrDefaultAsync(n => n.id == groupIndex);

            if (group == null)
            {
                return NotFound();
            }

            MembersGroupDto membersDto = group.ToDto();


            return membersDto;
        }




        [HttpPost("{groupIndex}")]
        public async Task<IActionResult> CreateTransaction(int groupIndex, [FromBody] TransactionDto transactionDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (string.IsNullOrWhiteSpace(transactionDto.SplitType))
            {
                return BadRequest(new { message = "empty split type" });
            }


            MembersGroup? group = await _context.Groups
                .Include(g => g.members)
                .Include(g => g.transactions).ThenInclude(t=>t.members)
                .FirstOrDefaultAsync(n => n.id == groupIndex);

            if (group == null)
            {
                return NotFound();
            }


            Transaction transaction = transactionDto.FromDto(_context.Members.ToList());

            group.transactions.Add(transaction);
            transaction.CalculateTransaction();


            await _context.SaveChangesAsync();

            return StatusCode(StatusCodes.Status201Created);
        }


        







    }

}
