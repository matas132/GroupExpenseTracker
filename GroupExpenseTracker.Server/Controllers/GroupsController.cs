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
    public class GroupsController : Controller
    {

        private readonly DataContext _context;
        public GroupsController(DataContext context)
        {
            _context = context;
        }



        [HttpGet(Name = "GetGroups")]
        public async Task<ActionResult<IEnumerable<MembersGroupDto>>> Get()
        {
            
            var groups = await _context.Groups
                .AsNoTracking()
                .Include(g => g.members)
                .Select(nn => nn.ToDto())
                .ToListAsync();




            return Ok(groups);
            
        }


        [HttpPost]
        public async Task<IActionResult> Create([FromBody] MembersGroupDto groupDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (string.IsNullOrWhiteSpace(groupDto.GroupName))
            {
                return BadRequest(new { message = "Group name cannot be empty" });
            }


            MembersGroup newGroup = groupDto.FromDto();

            Member memberYou = new Member() { name = "You", balance = 0 };
            

            newGroup.members.Add(memberYou);

            _context.Members.Add(memberYou);

            _context.Groups.Add(newGroup);
            await _context.SaveChangesAsync();

            return CreatedAtRoute("GetGroups", new { id = newGroup.id }, newGroup);
        }



    }



    
}
