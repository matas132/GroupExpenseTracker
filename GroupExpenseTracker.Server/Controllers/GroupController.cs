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
    public class GroupController : Controller
    {

        private readonly DataContext _context;
        public GroupController(DataContext context)
        {
            _context = context;
        }



        [HttpGet("{groupIndex}", Name = "GetMembersGroup")]
        public async Task<ActionResult<MembersGroupDto>> GetMembersGroup(int groupIndex)
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
        public async Task<IActionResult> CreateMember(int groupIndex, [FromBody] MemberDto memberDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (string.IsNullOrWhiteSpace(memberDto.Name))
            {
                return BadRequest(new { message = "Member name cannot be empty" });
            }


            MembersGroup? group = await _context.Groups
                .Include(g => g.members)
                .FirstOrDefaultAsync(n => n.id == groupIndex);

            if (group == null)
            {
                return NotFound();
            }



            Member newMember = memberDto.FromDto();

            group.members.Add(newMember);

            

            _context.Members.Add(newMember);
            await _context.SaveChangesAsync();

            return StatusCode(StatusCodes.Status201Created, newMember);
        }


        [HttpDelete("{groupIndex}/remove/{memberId}")]
        public async Task<IActionResult> RemoveMember(int groupIndex, int memberId)
        {
            var group = await _context.Groups
                .Include(g => g.members)
                .FirstOrDefaultAsync(g => g.id == groupIndex);

            if (group == null)
            {
                return NotFound("Group not found");
            }
                

            var memberToRemove = group.members.FirstOrDefault(m => m.id == memberId);
            if (memberToRemove == null)
            {
                return NotFound("Member not found");
            }

            if(Math.Round(memberToRemove.balance) != 0)
            {
                return NoContent();
            }




            group.members.Remove(memberToRemove);
            await _context.SaveChangesAsync();

            return NoContent();
        }








    }

}
